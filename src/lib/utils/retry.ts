/**
 * Retry utility with exponential backoff for handling transient network failures
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

export interface RetryResult<T> {
  result: T;
  attempts: number;
  totalTime: number;
}

/**
 * Default retry condition - retries on network-related errors
 */
const defaultRetryCondition = (error: any): boolean => {
  if (!error) return false;
  
  // Check for network-related error codes
  const networkErrorCodes = [
    'NETWORK_ERROR',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNRESET',
    'EPIPE',
    'EHOSTUNREACH',
  ];
  
  // Check error code
  if (error.code && networkErrorCodes.includes(error.code)) {
    return true;
  }
  
  // Check HTTP status codes that should be retried
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  if (error.status && retryableStatusCodes.includes(error.status)) {
    return true;
  }
  
  // Check error message for network-related keywords
  const errorMessage = error.message || error.toString();
  const networkKeywords = [
    'network',
    'timeout',
    'connection',
    'fetch',
    'request failed',
    'server error',
  ];
  
  return networkKeywords.some(keyword => 
    errorMessage.toLowerCase().includes(keyword)
  );
};

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Calculate delay with exponential backoff and jitter
 */
const calculateDelay = (
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  backoffFactor: number
): number => {
  const exponentialDelay = baseDelay * Math.pow(backoffFactor, attempt - 1);
  const delayWithJitter = exponentialDelay * (0.5 + Math.random() * 0.5);
  return Math.min(delayWithJitter, maxDelay);
};

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryCondition = defaultRetryCondition,
  } = options;

  const startTime = Date.now();
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      return {
        result,
        attempts: attempt,
        totalTime: Date.now() - startTime,
      };
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Check if we should retry this error
      if (!retryCondition(error)) {
        break;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffFactor);
      await sleep(delay);
    }
  }

  // If we get here, all attempts failed
  throw new Error(
    `Retry failed after ${maxAttempts} attempts. Last error: ${lastError?.message || lastError}`
  );
}

/**
 * Retry with custom retry condition
 */
export async function retryWithCondition<T>(
  fn: () => Promise<T>,
  condition: (error: any) => boolean,
  options: Omit<RetryOptions, 'retryCondition'> = {}
): Promise<RetryResult<T>> {
  return retry(fn, { ...options, retryCondition: condition });
}

/**
 * Retry only on specific error types
 */
export async function retryOnErrorTypes<T>(
  fn: () => Promise<T>,
  errorTypes: string[],
  options: Omit<RetryOptions, 'retryCondition'> = {}
): Promise<RetryResult<T>> {
  const condition = (error: any) => {
    return errorTypes.some(type => 
      error.name === type || 
      error.constructor.name === type ||
      error.code === type
    );
  };
  
  return retry(fn, { ...options, retryCondition: condition });
}

/**
 * Retry only on specific HTTP status codes
 */
export async function retryOnStatusCodes<T>(
  fn: () => Promise<T>,
  statusCodes: number[],
  options: Omit<RetryOptions, 'retryCondition'> = {}
): Promise<RetryResult<T>> {
  const condition = (error: any) => {
    return statusCodes.includes(error.status || error.statusCode);
  };
  
  return retry(fn, { ...options, retryCondition: condition });
}

/**
 * Simple retry without exponential backoff (fixed delay)
 */
export async function retryWithFixedDelay<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  const result = await retry(fn, {
    maxAttempts,
    baseDelay: delay,
    maxDelay: delay,
    backoffFactor: 1, // No exponential backoff
  });
  
  return result.result;
}

/**
 * Retry utility for React Native network requests
 */
export async function retryNetworkRequest<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const defaultOptions: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: defaultRetryCondition,
  };
  
  const result = await retry(fn, { ...defaultOptions, ...options });
  return result.result;
}

/**
 * Utility to wrap a function with retry logic
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return ((...args: Parameters<T>) => {
    return retryNetworkRequest(() => fn(...args), options);
  }) as T;
}

// Export retry utilities
export const retryUtils = {
  retry,
  retryWithCondition,
  retryOnErrorTypes,
  retryOnStatusCodes,
  retryWithFixedDelay,
  retryNetworkRequest,
  withRetry,
  defaultRetryCondition,
} as const;
