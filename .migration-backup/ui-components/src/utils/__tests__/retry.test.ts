/**
 * Tests for retry utility with exponential backoff
 */

import { withRetry, createRetryWrapper } from '../retry';

describe('Retry Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const mockOperation = jest.fn().mockResolvedValue('success');
      
      const result = await withRetry(mockOperation);
      
      expect(result.result).toBe('success');
      expect(result.attempts).toBe(1);
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });



    it('should retry on network errors and eventually succeed', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockRejectedValueOnce(new Error('connection refused'))
        .mockResolvedValue('success');
      
      const result = await withRetry(mockOperation, { 
        maxAttempts: 3,
        baseDelay: 10, // Very short delay for testing
        maxDelay: 50
      });
      
      expect(result.result).toBe('success');
      expect(result.attempts).toBe(3);
      expect(mockOperation).toHaveBeenCalledTimes(3);
    }, 5000); // 5 second timeout

    it('should fail after exhausting max attempts', async () => {
      const networkError = new Error('Network timeout');
      (networkError as any).code = 'NETWORK_ERROR';
      const mockOperation = jest.fn().mockRejectedValue(networkError);
      
      await expect(withRetry(mockOperation, { maxAttempts: 2 }))
        .rejects.toThrow('Network timeout');
      
      expect(mockOperation).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-network errors', async () => {
      const validationError = new Error('Validation failed');
      const mockOperation = jest.fn().mockRejectedValue(validationError);
      
      await expect(withRetry(mockOperation))
        .rejects.toThrow('Validation failed');
      
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should respect custom retry condition', async () => {
      const customError = new Error('Custom error');
      (customError as any).code = 'CUSTOM_ERROR';
      const mockOperation = jest.fn().mockRejectedValue(customError);
      
      const customRetryCondition = (error: any) => error.code === 'CUSTOM_ERROR';
      
      await expect(withRetry(mockOperation, { 
        maxAttempts: 2, 
        retryCondition: customRetryCondition 
      })).rejects.toThrow('Custom error');
      
      expect(mockOperation).toHaveBeenCalledTimes(2);
    });

    it('should handle different network error codes', async () => {
      const testCases = [
        'NETWORK_ERROR',
        'ECONNREFUSED',
        'ETIMEDOUT',
        'ENOTFOUND',
        'ECONNRESET'
      ];

      for (const errorCode of testCases) {
        const networkError = new Error(`Test error: ${errorCode}`);
        (networkError as any).code = errorCode;
        
        const mockOperation = jest.fn()
          .mockRejectedValueOnce(networkError)
          .mockResolvedValue('success');
        
        const result = await withRetry(mockOperation, { 
          maxAttempts: 2,
          baseDelay: 10,
          maxDelay: 50
        });
        
        expect(result.result).toBe('success');
        expect(result.attempts).toBe(2);
        expect(mockOperation).toHaveBeenCalledTimes(2);
        
        mockOperation.mockClear();
      }
    }, 10000);

    it('should handle network error messages', async () => {
      const testMessages = [
        'network timeout',
        'connection refused',
        'connection reset',
        'host unreachable',
        'network error',
        'fetch failed'
      ];

      for (const message of testMessages) {
        const networkError = new Error(message);
        
        const mockOperation = jest.fn()
          .mockRejectedValueOnce(networkError)
          .mockResolvedValue('success');
        
        const result = await withRetry(mockOperation, { 
          maxAttempts: 2,
          baseDelay: 10,
          maxDelay: 50
        });
        
        expect(result.result).toBe('success');
        expect(result.attempts).toBe(2);
        expect(mockOperation).toHaveBeenCalledTimes(2);
        
        mockOperation.mockClear();
      }
    }, 10000);

    it('should apply exponential backoff with jitter', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockResolvedValue('success');
      
      const startTime = Date.now();
      const result = await withRetry(mockOperation, { 
        maxAttempts: 3,
        baseDelay: 50,
        maxDelay: 200,
        backoffFactor: 2
      });
      const endTime = Date.now();
      
      expect(result.result).toBe('success');
      expect(result.attempts).toBe(3);
      // Should have some delay (at least base delay for first retry)
      expect(endTime - startTime).toBeGreaterThan(50);
    }, 5000);

    it('should respect maxDelay cap', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockResolvedValue('success');
      
      const result = await withRetry(mockOperation, { 
        maxAttempts: 2,
        baseDelay: 100,
        maxDelay: 50, // Lower than base delay
        backoffFactor: 2
      });
      
      expect(result.result).toBe('success');
      expect(result.attempts).toBe(2);
    }, 3000);
  });

  describe('createRetryWrapper', () => {
    it('should create a retry-enabled function', async () => {
      const originalFn = jest.fn()
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockResolvedValue('success');
      
      const retryFn = createRetryWrapper(originalFn, { 
        maxAttempts: 2,
        baseDelay: 10,
        maxDelay: 50
      });
      
      const result = await retryFn('arg1', 'arg2');
      
      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledTimes(2);
      expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
    }, 3000);
  });

  describe('edge cases', () => {
    it('should handle null/undefined errors', async () => {
      const mockOperation = jest.fn().mockRejectedValue(null);
      
      await expect(withRetry(mockOperation))
        .rejects.toBeNull();
      
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should handle errors without code or message', async () => {
      const mockOperation = jest.fn().mockRejectedValue({});
      
      await expect(withRetry(mockOperation))
        .rejects.toEqual({});
      
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should handle zero max attempts', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Test error'));
      
      await expect(withRetry(mockOperation, { maxAttempts: 0 }))
        .rejects.toThrow('maxAttempts must be greater than 0');
      
      expect(mockOperation).toHaveBeenCalledTimes(0);
    });
  });
});