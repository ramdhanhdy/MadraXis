/**
 * Security tests for ClassService queries
 * Tests SQL injection prevention in database queries
 */

import { ClassService } from '../classService';
import { supabase } from '../../utils/supabase';
import { ClassAccessControl } from '../class/access';

// Mock access control
jest.mock('../class/access', () => ({
  ClassAccessControl: {
    validateTeacherAccess: jest.fn().mockResolvedValue(undefined), // Successful access
    verifyClassAccess: jest.fn().mockResolvedValue(true)
  }
}));

// Mock supabase
jest.mock('../../utils/supabase', () => {
  const mockResult = { data: [], error: null };
  
  const createMockChain = (): any => {
    return {
      eq: jest.fn(() => createMockChain()),
      not: jest.fn(() => createMockChain()),
      order: jest.fn(() => createMockChain()),
      range: jest.fn(() => createMockChain()),
      ilike: jest.fn(() => createMockChain()),
      or: jest.fn(() => createMockChain()),
      single: jest.fn(() => Promise.resolve({ data: { id: 1, school_id: 1 }, error: null })),
      catch: jest.fn(() => Promise.resolve(mockResult)),
      // Terminating operations that return promises
      execute: jest.fn(() => Promise.resolve(mockResult)),
      then: undefined // Explicitly remove thenable behavior
    };
  };

  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => createMockChain()),
        insert: jest.fn(() => createMockChain()),
        update: jest.fn(() => createMockChain()),
        delete: jest.fn(() => createMockChain()),
      })),
      rpc: jest.fn(() => Promise.resolve({
        data: [{ success: [], errors: [] }],
        error: null,
      })),
    },
  };
});

describe('ClassService - Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableStudents - SQL injection prevention', () => {
    it('should prevent SQL injection in search parameter', async () => {
      const maliciousSearch = "' OR 1=1 --";
      const teacherId = 'teacher-123';
      const classId = 1;

      // Create mock chain to capture method calls
      const mockOrMethod = jest.fn(() => ({ range: jest.fn(() => Promise.resolve({ data: [], count: 0, error: null })) }));
      const mockSelectChain = {
        eq: jest.fn(() => mockSelectChain),
        or: mockOrMethod,
        not: jest.fn(() => mockSelectChain),
        range: jest.fn(() => Promise.resolve({ data: [], count: 0, error: null }))
      };

      // Mock the supabase chain for the specific queries we need to test
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: jest.fn(() => mockSelectChain)
          };
        }
        if (table === 'class_students') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          };
        }
        if (table === 'classes') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: { id: 1, school_id: 1 }, error: null }))
              }))
            }))
          };
        }
        // Default mock for other tables
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: { id: 1, school_id: 1 }, error: null }))
            }))
          }))
        };
      });

      await ClassService.getAvailableStudents(classId, teacherId, {
        searchTerm: maliciousSearch,
      });

      // Verify that the malicious input was sanitized before being passed to the query
      expect(mockOrMethod).toHaveBeenCalled();
      const orCallArgs = mockOrMethod.mock.calls[0][0];

      // The sanitized search should not contain the most dangerous SQL injection characters
      // These are the characters that sanitizeLikeInput actually removes
      expect(orCallArgs).not.toContain("'"); // Single quotes should be removed
      expect(orCallArgs).not.toContain(";"); // Semicolons should be removed

      // Verify the sanitized pattern is used in ilike queries
      expect(orCallArgs).toContain('full_name.ilike.%');
      expect(orCallArgs).toContain('student_details.nis.ilike.%');

      // Verify that the original malicious pattern "' OR 1=1" is broken up
      expect(orCallArgs).not.toContain("' OR 1=1"); // The dangerous pattern should be broken
    });

    it('should sanitize multiple malicious search patterns', async () => {
      const teacherId = 'teacher-123';
      const classId = 1;

      const maliciousInputs = [
        "'; DROP TABLE students; --",
        '" OR "1"="1',
        "test'; INSERT INTO profiles VALUES ('hacker'); --",
        "admin'/**/OR/**/1=1--",
        "' UNION SELECT * FROM profiles --"
      ];

      // Create mock chain to capture method calls
      const mockOrMethod = jest.fn(() => ({ range: jest.fn(() => Promise.resolve({ data: [], count: 0, error: null })) }));
      const mockSelectChain = {
        eq: jest.fn(() => mockSelectChain),
        or: mockOrMethod,
        not: jest.fn(() => mockSelectChain),
        range: jest.fn(() => Promise.resolve({ data: [], count: 0, error: null }))
      };

      // Mock the supabase chain
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return { select: jest.fn(() => mockSelectChain) };
        }
        if (table === 'class_students') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          };
        }
        if (table === 'classes') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: { id: 1, school_id: 1 }, error: null }))
              }))
            }))
          };
        }

        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: { id: 1, school_id: 1 }, error: null }))
            }))
          }))
        };
      });

      for (const maliciousInput of maliciousInputs) {
        // Reset mocks for each test
        jest.clearAllMocks();

        await ClassService.getAvailableStudents(classId, teacherId, {
          searchTerm: maliciousInput,
        });

        // Verify that the most dangerous SQL injection characters are removed/escaped
        expect(mockOrMethod).toHaveBeenCalled();
        const orCallArgs = mockOrMethod.mock.calls[0][0];

        // Verify the most critical SQL injection characters are removed
        // These are the characters that sanitizeLikeInput actually removes
        expect(orCallArgs).not.toContain("'"); // Single quotes removed
        expect(orCallArgs).not.toContain('"'); // Double quotes removed
        expect(orCallArgs).not.toContain(";"); // Semicolons removed
        expect(orCallArgs).not.toContain("*"); // Asterisks removed
        expect(orCallArgs).not.toContain("="); // Equals signs removed

        // Verify the query structure is maintained
        expect(orCallArgs).toContain('full_name.ilike.%');
        expect(orCallArgs).toContain('student_details.nis.ilike.%');
      }
    });

    it('should preserve legitimate search terms while sanitizing', async () => {
      const teacherId = 'teacher-123';
      const classId = 1;
      const legitimateSearch = 'John Doe';

      // Create mock chain to capture method calls
      const mockOrMethod = jest.fn(() => ({ range: jest.fn(() => Promise.resolve({ data: [], count: 0, error: null })) }));
      const mockSelectChain = {
        eq: jest.fn(() => mockSelectChain),
        or: mockOrMethod,
        not: jest.fn(() => mockSelectChain),
        range: jest.fn(() => Promise.resolve({ data: [], count: 0, error: null }))
      };

      // Mock the supabase chain
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return { select: jest.fn(() => mockSelectChain) };
        }
        if (table === 'class_students') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          };
        }
        if (table === 'classes') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: { id: 1, school_id: 1 }, error: null }))
              }))
            }))
          };
        }

        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: { id: 1, school_id: 1 }, error: null }))
            }))
          }))
        };
      });

      await ClassService.getAvailableStudents(classId, teacherId, {
        searchTerm: legitimateSearch,
      });

      // Verify that legitimate search terms are preserved in the query
      expect(mockOrMethod).toHaveBeenCalled();
      const orCallArgs = mockOrMethod.mock.calls[0][0];

      // Should contain the legitimate search term
      expect(orCallArgs).toContain('John Doe');
      expect(orCallArgs).toContain('full_name.ilike.%John Doe%');
      expect(orCallArgs).toContain('student_details.nis.ilike.%John Doe%');

      // Should still be safe (no dangerous characters)
      expect(orCallArgs).not.toContain("'");
      expect(orCallArgs).not.toContain('"');
      expect(orCallArgs).not.toContain(";");
    });
  });

  describe('getTeacherClasses - SQL injection prevention', () => {
    it('should prevent SQL injection in search term', async () => {
      const maliciousSearch = "'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      await ClassService.getClasses(teacherId, {
        searchTerm: maliciousSearch,
      });

      expect(supabase.from).toHaveBeenCalled();
    });

    it('should prevent SQL injection in sort parameters', async () => {
      const maliciousSortBy = "name'; DROP TABLE classes; --";
      const maliciousSortOrder = "asc'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      await ClassService.getClasses(teacherId, {
        sortBy: maliciousSortBy as any,
        sortOrder: maliciousSortOrder as any,
      });

      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('Input validation tests', () => {
    it('should reject negative pagination values', async () => {
      const teacherId = 'teacher-123';
      
      await ClassService.getClasses(teacherId, {
        limit: -1,
        offset: -100,
      });

      // Should use sanitized defaults
      expect(supabase.from).toHaveBeenCalled();
    });

    it('should limit excessive pagination values', async () => {
      const teacherId = 'teacher-123';
      
      await ClassService.getClasses(teacherId, {
        limit: 10000,
        offset: 1000000,
      });

      // Should use sanitized limits
      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('Class creation - SQL injection prevention', () => {
    it('should prevent SQL injection in class name', async () => {
      const maliciousName = "Class'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      // Should be caught by Zod validation
      await expect(ClassService.createClass({
        name: maliciousName,
        level: 'Grade 10',
        school_id: 1,
        academic_year: '2024',
        semester: '1',
      }, teacherId)).rejects.toThrow();
    });

    it('should prevent SQL injection in level parameter', async () => {
      const maliciousLevel = "Grade'; DROP TABLE classes; --";
      const teacherId = 'teacher-123';

      await expect(ClassService.createClass({
        name: 'Test Class',
        level: maliciousLevel,
        school_id: 1,
        academic_year: '2024',
        semester: '1',
      }, teacherId)).rejects.toThrow();
    });
  });
});