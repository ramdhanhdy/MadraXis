/**
 * Add Students to Class Feature Model
 * 
 * This module contains the business logic and data models for adding students to a class.
 */

import { z } from 'zod';

// Types
export interface AddStudentsState {
  classId: number | null;
  selectedStudents: number[];
  availableStudents: Student[];
  isLoading: boolean;
  error: string | null;
  hasAccess: boolean;
  isSubmitting: boolean;
}

export interface Student {
  id: number;
  full_name: string;
  email: string;
  student_id?: string;
  class_id?: number;
  is_enrolled?: boolean;
}

export interface AddStudentsFormData {
  classId: number;
  studentIds: number[];
}

// Validation schemas
export const addStudentsFormSchema = z.object({
  classId: z.number().positive('Class ID must be a positive number'),
  studentIds: z.array(z.number().positive()).min(1, 'At least one student must be selected'),
});

export type AddStudentsFormSchema = z.infer<typeof addStudentsFormSchema>;

// Business logic functions
export const validateClassId = (id: string | string[] | undefined): number | null => {
  if (!id || Array.isArray(id)) return null;
  const parsedId = parseInt(id, 10);
  return !isNaN(parsedId) && parsedId > 0 ? parsedId : null;
};

export const validateStudentSelection = (studentIds: number[]): { 
  isValid: boolean; 
  error?: string 
} => {
  if (studentIds.length === 0) {
    return { isValid: false, error: 'Please select at least one student' };
  }
  
  if (studentIds.some(id => !Number.isInteger(id) || id <= 0)) {
    return { isValid: false, error: 'Invalid student selection' };
  }
  
  return { isValid: true };
};

export const filterAvailableStudents = (
  allStudents: Student[], 
  classId: number
): Student[] => {
  return allStudents.filter(student => 
    !student.class_id || student.class_id !== classId
  );
};

export const groupStudentsByEnrollmentStatus = (students: Student[]) => {
  return students.reduce((acc, student) => {
    if (student.is_enrolled) {
      acc.enrolled.push(student);
    } else {
      acc.available.push(student);
    }
    return acc;
  }, { enrolled: [] as Student[], available: [] as Student[] });
};

// Initial state
export const initialAddStudentsState: AddStudentsState = {
  classId: null,
  selectedStudents: [],
  availableStudents: [],
  isLoading: false,
  error: null,
  hasAccess: false,
  isSubmitting: false,
};

// Error messages
export const ADD_STUDENTS_ERRORS = {
  INVALID_CLASS_ID: 'Invalid class ID provided',
  ACCESS_DENIED: 'You do not have permission to add students to this class',
  NO_STUDENTS_SELECTED: 'Please select at least one student',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  SUBMISSION_ERROR: 'Failed to add students to class',
  UNKNOWN_ERROR: 'An unknown error occurred',
  LOADING_STUDENTS_ERROR: 'Failed to load available students',
} as const;

// Success messages
export const ADD_STUDENTS_SUCCESS = {
  STUDENTS_ADDED: 'Students successfully added to class',
  SINGLE_STUDENT_ADDED: 'Student successfully added to class',
} as const;
