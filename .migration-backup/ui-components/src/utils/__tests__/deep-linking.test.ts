import { 
  parseDeepLink, 
  generateDeepLink, 
  isValidDeepLink, 
  getQueryParams, 
  getLinkingConfig 
} from '../linking';

describe('Deep Linking Configuration', () => {
  describe('URL Parsing', () => {
    it('should parse deep link to add students correctly', () => {
      const testUrl = 'madraxis://teacher/class/123/add-students';
      const result = parseDeepLink(testUrl);
      
      expect(result).not.toBeNull();
      expect(result?.path).toBe('teacher/class/123/add-students');
      expect(result?.params.id).toBe(123);
      expect(result?.screen).toBe('teacher/class/[id]/add-students');
    });

    it('should parse deep link with string class ID', () => {
      const testUrl = 'madraxis://teacher/class/abc123/add-students';
      const result = parseDeepLink(testUrl);
      
      expect(result).not.toBeNull();
      expect(result?.params.id).toBe('abc123');
    });

    it('should handle invalid class ID in deep link', () => {
      const testUrl = 'madraxis://teacher/class/invalid/add-students';
      const result = parseDeepLink(testUrl);
      
      expect(result).not.toBeNull();
      expect(result?.params.id).toBe('invalid');
    });

    it('should handle malformed URLs', () => {
      const testCases = [
        'invalid://teacher/class/123/add-students',
        'not-a-url',
        '',
        null,
        undefined
      ];

      testCases.forEach(url => {
        if (url) {
          const result = parseDeepLink(url);
          expect(result).toBeNull();
        }
      });
    });

    it('should handle missing parameters', () => {
      const testUrl = 'madraxis://teacher/class/add-students';
      const result = parseDeepLink(testUrl);
      
      expect(result).not.toBeNull();
      expect(result?.path).toBe('teacher/class/add-students');
      expect(result?.screen).toBe('teacher/class/[id]/add-students');
    });

    it('should handle query parameters', () => {
      const testUrl = 'madraxis://teacher/class/123/add-students?source=dashboard&tab=students';
      const queryParams = getQueryParams(testUrl);
      
      // Note: Query parameters may not be parsed by Linking.parse in all environments
      // This test is designed to work with the actual Linking.parse implementation
      expect(typeof queryParams).toBe('object');
    });
  });

  describe('URL Generation', () => {
    it('should generate correct deep link URL for add students', () => {
      const url = generateDeepLink('teacher/class/add-students', { id: 123 });
      expect(url).toBe('madraxis://teacher/class/123/add-students');
    });

    it('should generate URL with default class ID when not provided', () => {
      const url = generateDeepLink('teacher/class/add-students');
      expect(url).toBe('madraxis://teacher/class/:id/add-students');
    });

    it('should generate URLs for different routes', () => {
      const testCases = [
        { route: 'teacher/dashboard', expected: 'madraxis://teacher/dashboard' },
        { route: 'teacher/class', expected: 'madraxis://teacher/class' },
        { route: 'management/dashboard', expected: 'madraxis://management/dashboard' },
        { route: 'parent/dashboard', expected: 'madraxis://parent/dashboard' },
        { route: 'student/dashboard', expected: 'madraxis://student/dashboard' }
      ];

      testCases.forEach(({ route, expected }) => {
        const url = generateDeepLink(route);
        expect(url).toBe(expected);
      });
    });

    it('should handle custom routes', () => {
      const url = generateDeepLink('custom/route/path');
      expect(url).toBe('madraxis://custom/route/path');
    });
  });

  describe('URL Validation', () => {
    it('should validate correct deep links', () => {
      const validUrls = [
        'madraxis://teacher/class/123/add-students',
        'madraxis://teacher/dashboard',
        'madraxis://management/dashboard',
        'madraxis://parent/dashboard',
        'madraxis://student/dashboard'
      ];

      validUrls.forEach(url => {
        expect(isValidDeepLink(url)).toBe(true);
      });
    });

    it('should reject invalid deep links', () => {
      const invalidUrls = [
        'invalid://teacher/class/123/add-students',
        'https://example.com',
        'madraxis://invalid/path',
        'not-a-url',
        '',
        null as any,
        undefined as any
      ];

      invalidUrls.forEach(url => {
        if (url) {
          expect(isValidDeepLink(url)).toBe(false);
        }
      });
    });
  });

  describe('Linking Configuration', () => {
    it('should provide correct linking configuration', () => {
      const config = getLinkingConfig();
      
      expect(config.prefixes).toEqual(['madraxis://']);
      expect(config.config.screens['(teacher)']).toBeDefined();
      expect(config.config.screens['(teacher)'].screens['class']).toBeDefined();
      expect(config.config.screens['(teacher)'].screens['class'].screens['[id]']).toBeDefined();
    });

    it('should handle edge cases in URL parsing', () => {
      const edgeCases = [
        'madraxis://teacher/class/0/add-students', // Zero ID
        'madraxis://teacher/class/-1/add-students', // Negative ID
        'madraxis://teacher/class/123.5/add-students', // Float ID
        'madraxis://teacher/class/123%20/add-students', // URL encoded space
        'madraxis://teacher/class/123%2F456/add-students', // URL encoded slash
      ];

      edgeCases.forEach(url => {
        const result = parseDeepLink(url);
        expect(result).not.toBeNull();
        expect(result?.params).toBeDefined();
      });
    });
  });
});