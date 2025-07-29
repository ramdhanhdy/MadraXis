/**
 * Test utilities and helpers for ClassService testing
 * Provides mock data factories and utility functions for comprehensive testing
 */

import { Database } from '../../types/database';

// Mock data factories
export const createMockStudent = (overrides = {}) => ({
  id: `student-${Math.random().toString(36).substr(2, 9)}`,
  full_name: `Test Student ${Math.random().toString(36).substr(2, 5)}`,
  email: `student${Math.random().toString(36).substr(2, 5)}@test.com`,
  gender: Math.random() > 0.5 ? 'male' : 'female',
  student_details: {
    nis: `NIS${100000 + Math.floor(Math.random() * 900000)}`,
    grade_level: Math.floor(Math.random() * 12) + 1,
    enrollment_date: new Date().toISOString()
  },
  ...overrides
});

export const createMockClass = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000) + 1,
  name: `Test Class ${Math.random().toString(36).substr(2, 5)}`,
  level: `Grade ${Math.floor(Math.random() * 12) + 1}`,
  school_id: `school-${Math.random().toString(36).substr(2, 5)}`,
  academic_year: '2024',
  semester: '1',
  max_students: 30,
  created_at: new Date().toISOString(),
  ...overrides
});

export const createMockTeacher = (overrides = {}) => ({
  id: `teacher-${Math.random().toString(36).substr(2, 9)}`,
  full_name: `Test Teacher ${Math.random().toString(36).substr(2, 5)}`,
  email: `teacher${Math.random().toString(36).substr(2, 5)}@test.com`,
  school_id: `school-${Math.random().toString(36).substr(2, 5)}`,
  role: 'teacher',
  ...overrides
});

export const createMockClassEnrollment = (overrides = {}) => ({
  id: Math.floor(Math.random() * 10000) + 1,
  class_id: Math.floor(Math.random() * 1000) + 1,
  student_id: `student-${Math.random().toString(36).substr(2, 9)}`,
  enrollment_date: new Date().toISOString(),
  status: 'active',
  notes: '',
  ...overrides
});

// Error factories
export const createNetworkError = () => new Error('Network request failed');
export const createPermissionError = () => ({
  code: 'PGRST116',
  message: 'permission denied for relation',
  details: 'User does not have permission to access this resource'
});

export const createConstraintError = (constraint: string) => ({
  code: '23505',
  message: `duplicate key value violates unique constraint "${constraint}"`,
  details: 'Key already exists'
});

// Mock query builder factory
export const createMockQueryBuilder = (mockResponse?: any) => {
  const builder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(mockResponse || createSuccessfulResponse([]))
  };

  builder.single.mockResolvedValue(mockResponse || createSuccessfulResponse(null));
  builder.maybeSingle.mockResolvedValue(mockResponse || createSuccessfulResponse(null));
  
  return builder;
};

// Enhanced Supabase mock factory
export const createEnhancedSupabaseMock = () => ({
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue({ data: [], error: null }),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    update: jest.fn().mockResolvedValue({ data: [], error: null }),
    delete: jest.fn().mockResolvedValue({ data: [], error: null }),
  }),
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  channel: jest.fn().mockReturnValue({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockResolvedValue(undefined),
  }),
});

export const createSupabaseMock = (responses: Record<string, any> = {}) => {
  const createTableMock = (tableName: string) => {
    const queryBuilder = createMockQueryBuilder(responses[tableName]);
    return {
      select: jest.fn(() => queryBuilder),
      insert: jest.fn(() => queryBuilder),
      update: jest.fn(() => queryBuilder),
      delete: jest.fn(() => queryBuilder),
      upsert: jest.fn(() => queryBuilder)
    };
  };

  return {
    from: jest.fn((tableName: string) => createTableMock(tableName)),
    rpc: jest.fn().mockResolvedValue(createSuccessfulResponse(null))
  };
};

// Test data generators
export const generateLargeStudentList = (count: number) => 
  Array.from({ length: count }, (_, i) => createMockStudent({
    id: `student-${i + 1}`,
    full_name: `Student ${i + 1}`,
    student_details: {
      nis: `NIS${100000 + i}`,
      grade_level: Math.floor(i / 30) + 1
    }
  }));

export const generateClassList = (count: number, teacherId: string) =>
  Array.from({ length: count }, (_, i) => createMockClass({
    id: i + 1,
    name: `Class ${i + 1}`,
    teacher_id: teacherId
  }));

// Validation helpers
export const expectErrorCode = (error: any, expectedCode: string) => {
  expect(error).toMatchObject({
    code: expectedCode
  });
};

export const expectValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  expect(uuid).toMatch(uuidRegex);
};

// Performance testing utilities
export const measureAsyncTime = async (fn: () => Promise<any>): Promise<{ result: any; duration: number }> => {
  const startTime = Date.now();
  const result = await fn();
  const duration = Date.now() - startTime;
  return { result, duration };
};

export const createStressTestData = () => ({
  schools: Array.from({ length: 5 }, (_, i) => `school-${i + 1}`),
  teachers: Array.from({ length: 20 }, (_, i) => createMockTeacher()),
  classes: Array.from({ length: 100 }, (_, i) => createMockClass()),
  students: generateLargeStudentList(1000)
});

// Mock Supabase response builders
export const createSuccessfulResponse = (data: any) => ({
  data,
  error: null,
  count: Array.isArray(data) ? data.length : 1,
  status: 200,
  statusText: 'OK'
});

export const createErrorResponse = (error: any) => ({
  data: null,
  error,
  count: null,
  status: 400,
  statusText: 'Bad Request'
});

export const createEmptyResponse = () => createSuccessfulResponse([]);

// SQL injection test payloads
export const sqlInjectionPayloads = [
  "'; DROP TABLE students; --",
  "' OR 1=1 --",
  "' UNION SELECT * FROM users --",
  "admin'--",
  "1' OR '1'='1",
  "'; INSERT INTO users VALUES('hacker','password'); --",
  "'; UPDATE users SET password='hacked'; --",
  "'; DELETE FROM users WHERE 1=1; --",
  "' OR 1=1#",
  "' OR 'a'='a"
];

// XSS test payloads
export const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  'javascript:alert("XSS")',
  '<iframe src="javascript:alert(1)"></iframe>',
  '<svg onload=alert("XSS")>',
  '<body onload=alert("XSS")>',
  '"><script>alert("XSS")</script>',
  '\'><script>alert("XSS")</script>'
];

// Boundary value test data
export const boundaryValues = {
  zero: 0,
  negative: -1,
  maxInt: 2147483647,
  minInt: -2147483648,
  maxSafeInt: Number.MAX_SAFE_INTEGER,
  minSafeInt: Number.MIN_SAFE_INTEGER,
  maxString: 'a'.repeat(1000),
  emptyString: '',
  nullValue: null,
  undefinedValue: undefined,
  booleanTrue: true,
  booleanFalse: false
};