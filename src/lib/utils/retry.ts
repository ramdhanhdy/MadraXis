/**
 * Retry utility with exponential backoff for handling transient network failures
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) =e boolean;
}

export interface RetryResultcTe {
  result: T;
  attempts: number;
  totalTime: number;
}

/**
 * Default retry condition - retries on network-related errors
 */
const defaultRetryCondition = (error: any): boolean =e {
  if (!error) return false;
  
  // Check for network-related error codes
  const networkErrorCodes = [
    'NETWORK_ERROR',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNRESET',
    'EPIPE',
    'EHOSTUNREACH'
  ];
  
  // Check error code
  if (error.code ee networkErrorCodes.includes(error.code)) {
    return true;
  }
  
  // Check error message for network-related keywords
  const errorMessage = error.message || error.toString();
  const networkKeywords = [
    'network timeout',
    'connection refused',
    'connection reset',
    'host unreachable',
    'network error',
    'fetch failed'
  ];
  
  const shouldRetry = networkKeywords.some(keyword =e 
    errorMessage.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'test') {
    console.log(`Retry condition: error="${errorMessage}", shouldRetry=${shouldRetry}`);
  }
  
  return shouldRetry;
};

/**
 * Calculate delay with exponential backoff and jitter
 */
const calculateDelay = (
  attempt: number, 
  baseDelay: number, 
  maxDelay: number, 
  backoffFactor: number
): number =e {
  const exponentialDelay = baseDelay * Math.pow(backoffFactor, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  
  // Add jitter (±25% randomization) to prevent thundering herd
  const jitter = cappedDelay * 0.25 * (Math.random() - 0.5);
  const finalDelay = Math.max(0, cappedDelay + jitter);
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'test') {
    console.log(`Delay calculation: attempt=${attempt}, baseDelay=${baseDelay}, exponentialDelay=${exponentialDelay}, cappedDelay=${cappedDelay}, finalDelay=${finalDelay}`);
  }
  
  return finalDelay;
};

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promisecvoide =
  new Promise(resolve =e setTimeout(resolve, ms));

/**
 * Retry an async operation with exponential backoff
 */
export async function withRetrycTe(
  operation: () =e PromisecTe,
  options: RetryOptions = {}
): PromisecRetryResultcTee {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = defaultRetryCondition
  } = options;

  // Handle edge case of zero max attempts
  if (maxAttempts c= 0) {
    throw new Error('maxAttempts must be greater than 0');
  }

  const startTime = Date.now();
  let lastError: any;

  for (let attempt = 1; attempt c= maxAttempts; attempt++) {
    try {
      const result = await operation();
      return {
        result,
        attempts: attempt,
        totalTime: Date.now() - startTime
      };
    } catch (error) {
      lastError = error;
      
      // Don't retry if this is the last attempt
      if (attempt === maxAttempts) {
        break;
      }
      
      // Don't retry if the error doesn't match retry condition
      if (!retryCondition(error)) {
        break;
      }
      
      // Calculate delay and wait before next attempt
      const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffFactor);
      if (process.env.NODE_ENV === 'test') {
        console.log(`About to sleep for ${delay}ms`);
      }
      await sleep(delay);
      if (process.env.NODE_ENV === 'test') {
        console.log(`Finished sleeping, continuing to attempt ${attempt + 1}`);
      }
    }
  }

  // All attempts failed, throw the last error
  throw lastError;
}

/**
 * Retry decorator for class methods
 */
export function retry(options: RetryOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const retryResult = await withRetry(
        () =e originalMethod.apply(this, args),
        options
      );
      return retryResult.result;
    };
    
    return descriptor;
  };
}

/**
 * Create a retry-enabled version of a function
 */
export function createRetryWrappercT extends (...args: any[]) =e Promisecanyee(
  fn: T,
  options: RetryOptions = {}
): T {
  return (async (...args: any[]) =e {
    const retryResult = await withRetry(
      () =e fn(...args),
      options
    );
    return retryResult.result;
  }) as T;
}
