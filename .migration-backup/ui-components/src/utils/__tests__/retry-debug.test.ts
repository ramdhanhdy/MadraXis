/**
 * Debug test for retry utility
 */

import { withRetry } from '../retry';

describe('Retry Debug', () => {
  it('should test retry condition directly', async () => {
    // Test with a simple custom retry condition that always returns true
    const mockOperation = jest.fn()
      .mockRejectedValueOnce(new Error('network timeout'))
      .mockResolvedValue('success');
    
    const customRetryCondition = (error: any) => {
      console.log('Retry condition called with:', error?.message);
      return true; // Always retry
    };
    
    const result = await withRetry(mockOperation, { 
      maxAttempts: 2,
      baseDelay: 10,
      retryCondition: customRetryCondition
    });
    
    expect(result.result).toBe('success');
    expect(result.attempts).toBe(2);
    expect(mockOperation).toHaveBeenCalledTimes(2);
  }, 3000);

  it('should test default retry condition behavior', () => {
    // Import the module to access internals
    const retryModule = require('../retry');
    
    // Test different error types
    const networkTimeoutError = new Error('network timeout');
    const connectionRefusedError = new Error('connection refused');
    const validationError = new Error('validation failed');
    const networkErrorWithCode = new Error('some error');
    (networkErrorWithCode as any).code = 'NETWORK_ERROR';
    
    console.log('Testing errors:');
    console.log('network timeout:', networkTimeoutError.message);
    console.log('connection refused:', connectionRefusedError.message);
    console.log('validation failed:', validationError.message);
    console.log('error with NETWORK_ERROR code:', networkErrorWithCode.message, networkErrorWithCode.code);
  });
});