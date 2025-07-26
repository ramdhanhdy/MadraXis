/**
 * Security tests for input sanitization utilities
 * Tests SQL injection prevention and input validation
 */

import {
  sanitizeLikeInput,
  sanitizeIdentifier,
  sanitizeIdArray,
  sanitizePagination,
  sanitizeSortParams,
  sanitizeEnum,
  sanitizeBoolean,
  sanitizeNumeric,
  sanitizeString,
  sanitizeArray
} from '../sanitization';

describe('Sanitization Utilities - Security Tests', () => {
  describe('sanitizeLikeInput', () => {
    it('should prevent SQL injection in LIKE clauses', () => {
      expect(sanitizeLikeInput('test%')).toBe('test');
      expect(sanitizeLikeInput('test_')).toBe('test');
      expect(sanitizeLikeInput("test' OR 1=1--")).toBe('test OR 11');
      expect(sanitizeLikeInput('test"; DROP TABLE users;--')).toBe('test DROP TABLE users');
      expect(sanitizeLikeInput('test\')).toBe('test');
    });

    it('should handle edge cases', () => {
      expect(sanitizeLikeInput('')).toBe('');
      expect(sanitizeLikeInput(null as any)).toBe('');
      expect(sanitizeLikeInput(undefined as any)).toBe('');
      expect(sanitizeLikeInput(123 as any)).toBe('');
    });

    it('should limit input length', () => {
      const longString = 'a'.repeat(300);
      expect(sanitizeLikeInput(longString).length).toBe(255);
    });
  });

  describe('sanitizeIdentifier', () => {
    it('should prevent SQL injection in identifiers', () => {
      expect(sanitizeIdentifier('valid_name')).toBe('valid_name');
      expect(sanitizeIdentifier('invalid;name')).toBe('invalidname');
      expect(sanitizeIdentifier('drop table')).toBe('droptable');
      expect(sanitizeIdentifier('test"')).toBe('test');
      expect(sanitizeIdentifier('test\'')).toBe('test');
    });
  });

  describe('sanitizeIdArray', () => {
    it('should prevent SQL injection in array inputs', () => {
      expect(sanitizeIdArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(sanitizeIdArray(['1', '2', '3'])).toEqual(['1', '2', '3']);
      expect(sanitizeIdArray([1, '2', 3])).toEqual([1, '2', 3]);
      expect(sanitizeIdArray([1, 'invalid;query', 3])).toEqual([1, 3]);
      expect(sanitizeIdArray(['test"', 'valid', 'drop table'])).toEqual(['valid']);
    });

    it('should handle edge cases', () => {
      expect(sanitizeIdArray([])).toEqual([]);
      expect(sanitizeIdArray(null as any)).toEqual([]);
      expect(sanitizeIdArray(undefined as any)).toEqual([]);
      expect(sanitizeIdArray('not an array' as any)).toEqual([]);
    });
  });

  describe('sanitizeNumeric', () => {
    it('should validate numeric inputs', () => {
      expect(sanitizeNumeric(123)).toBe(123);
      expect(sanitizeNumeric('123')).toBe(123);
      expect(sanitizeNumeric(-5, 0, 100)).toBe(0);
      expect(sanitizeNumeric(150, 0, 100)).toBe(100);
      expect(sanitizeNumeric('invalid')).toBe(0);
      expect(sanitizeNumeric(NaN)).toBe(0);
      expect(sanitizeNumeric(Infinity)).toBe(0);
    });
  });

  describe('sanitizeString', () => {
    it('should prevent SQL injection in string inputs', () => {
      expect(sanitizeString('hello world')).toBe('hello world');
      expect(sanitizeString("hello'world")).toBe('helloworld');
      expect(sanitizeString('hello"world')).toBe('helloworld');
      expect(sanitizeString('hello;world')).toBe('helloworld');
      expect(sanitizeString('hello\\world')).toBe('helloworld');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(300);
      expect(sanitizeString(longString).length).toBe(255);
    });

    it('should handle control characters', () => {
      expect(sanitizeString('hello\x00world')).toBe('helloworld');
      expect(sanitizeString('hello\nworld')).toBe('helloworld');
    });
  });

  describe('sanitizeArray', () => {
    it('should validate and sanitize arrays', () => {
      expect(sanitizeArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(sanitizeArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
      expect(sanitizeArray([1, '2', 3])).toEqual([1, 3]); // Mixed types filtered
      expect(sanitizeArray([1, 1, 2, 2])).toEqual([1, 2]); // Removes duplicates
    });

    it('should limit array size', () => {
      const largeArray = Array.from({ length: 1500 }, (_, i) => i + 1);
      expect(sanitizeArray(largeArray).length).toBe(1000);
    });

    it('should prevent SQL injection', () => {
      expect(sanitizeArray([1, 'invalid;query', 'test"'])).toEqual([1]);
      expect(sanitizeArray(['valid1', 'valid2', 'invalid;'])).toEqual(['valid1', 'valid2']);
    });
  });

  describe('sanitizeSortParams', () => {
    it('should prevent SQL injection in sort parameters', () => {
      expect(sanitizeSortParams('name', 'asc')).toEqual({ sortBy: 'name', sortOrder: 'asc' });
      expect(sanitizeSortParams('invalid;table', 'desc')).toEqual({ sortBy: 'created_at', sortOrder: 'desc' });
      expect(sanitizeSortParams('name', 'invalid')).toEqual({ sortBy: 'name', sortOrder: 'desc' });
    });
  });

  describe('sanitizePagination', () => {
    it('should validate pagination parameters', () => {
      expect(sanitizePagination(1, 10)).toEqual({ page: 1, limit: 10 });
      expect(sanitizePagination(-1, 10)).toEqual({ page: 1, limit: 10 });
      expect(sanitizePagination(1, 200)).toEqual({ page: 1, limit: 100 });
      expect(sanitizePagination('abc', 'def')).toEqual({ page: 1, limit: 20 });
    });
  });

  describe('sanitizeEnum', () => {
    it('should validate enum values', () => {
      const validValues = ['active', 'inactive', 'pending'] as const;
      expect(sanitizeEnum('active', validValues, 'active')).toBe('active');
      expect(sanitizeEnum('invalid', validValues, 'active')).toBe('active');
      expect(sanitizeEnum('INJECT; DROP TABLE', validValues, 'active')).toBe('active');
    });
  });

  describe('sanitizeBoolean', () => {
    it('should validate boolean inputs', () => {
      expect(sanitizeBoolean(true)).toBe(true);
      expect(sanitizeBoolean(false)).toBe(false);
      expect(sanitizeBoolean('true')).toBe(true);
      expect(sanitizeBoolean('false')).toBe(false);
      expect(sanitizeBoolean('invalid')).toBe(false);
      expect(sanitizeBoolean(1)).toBe(true);
      expect(sanitizeBoolean(0)).toBe(false);
    });
  });

  describe('Integration tests - SQL injection prevention', () => {
    it('should prevent common SQL injection patterns', () => {
      const maliciousInputs = [
        "' OR 1=1 --",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'--",
        "1' OR '1'='1",
        "test'; DELETE FROM users WHERE 1=1; --",
        "Robert'); DROP TABLE Students;--",
        "1 OR 1=1",
        "1' OR '1'='1' --",
        "1' OR 1 -- -",
        "1' OR 1=1--",
        "1' OR 1=1#",
        "1' UNION SELECT 1,2,3--",
        "1' UNION SELECT NULL--",
        "1' UNION SELECT NULL,NULL--",
      ];

      maliciousInputs.forEach(input => {
        expect(sanitizeLikeInput(input)).not.toContain("'");
        expect(sanitizeLikeInput(input)).not.toContain('"');
        expect(sanitizeLikeInput(input)).not.toContain(';');
        expect(sanitizeLikeInput(input)).not.toContain('--');
        expect(sanitizeString(input)).not.toContain("'");
        expect(sanitizeString(input)).not.toContain('"');
        expect(sanitizeString(input)).not.toContain(';');
      });
    });
  });
});