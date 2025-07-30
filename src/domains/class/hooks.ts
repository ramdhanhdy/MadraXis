import { useState, useEffect, useCallback } from 'react';
import { ClassService } from './api';
import {
  ClassWithDetails,
  GetClassesOptions,
  GetAvailableStudentsOptions,
  GetClassStudentsOptions,
  StudentWithDetails,
  CreateClassRequest,
  UpdateClassRequest,
  EnrollStudentRequest,
  BulkEnrollStudentsRequest
} from './types';

/**
 * Hook for managing classes for a teacher
 */
export function useTeacherClasses(teacherId: string, options?: GetClassesOptions) {
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    if (!teacherId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.getClasses(teacherId, options);
      setClasses(result.classes);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, [teacherId, options]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const refetch = useCallback(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    total,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for managing a single class
 */
export function useClass(classId: number, teacherId: string) {
  const [classData, setClassData] = useState<ClassWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClass = useCallback(async () => {
    if (!classId || !teacherId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.getClassById(classId, teacherId);
      setClassData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class');
    } finally {
      setLoading(false);
    }
  }, [classId, teacherId]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  const refetch = useCallback(() => {
    fetchClass();
  }, [fetchClass]);

  return {
    classData,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for managing available students for enrollment
 */
export function useAvailableStudents(
  classId: number,
  teacherId: string,
  options?: GetAvailableStudentsOptions
) {
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!classId || !teacherId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.getAvailableStudents(classId, teacherId, options);
      setStudents(result.students);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch available students');
    } finally {
      setLoading(false);
    }
  }, [classId, teacherId, options]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const refetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    total,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for managing enrolled students in a class
 */
export function useClassStudents(
  classId: number,
  teacherId: string,
  options?: GetClassStudentsOptions
) {
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!classId || !teacherId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.getClassStudents(classId, teacherId, options);
      setStudents(result.students);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class students');
    } finally {
      setLoading(false);
    }
  }, [classId, teacherId, options]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const refetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    total,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for class operations (create, update, delete)
 */
export function useClassOperations(teacherId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClass = useCallback(async (classData: CreateClassRequest): Promise<ClassWithDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.createClass(classData, teacherId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create class');
      return null;
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const updateClass = useCallback(async (
    classId: number,
    updateData: UpdateClassRequest
  ): Promise<ClassWithDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.updateClass(classId, updateData, teacherId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update class');
      return null;
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const deleteClass = useCallback(async (classId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await ClassService.deleteClass(classId, teacherId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete class');
      return false;
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const restoreClass = useCallback(async (classId: number): Promise<ClassWithDetails | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.restoreClass(classId, teacherId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore class');
      return null;
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  return {
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    restoreClass
  };
}

/**
 * Hook for student enrollment operations
 */
export function useStudentEnrollment(classId: number, teacherId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrollStudent = useCallback(async (enrollmentData: EnrollStudentRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await ClassService.enrollStudent(classId, enrollmentData, teacherId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll student');
      return false;
    } finally {
      setLoading(false);
    }
  }, [classId, teacherId]);

  const bulkEnrollStudents = useCallback(async (
    enrollmentData: BulkEnrollStudentsRequest
  ): Promise<{ results: string[]; errors: { studentId: string; error: string }[] } | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.bulkEnrollStudents(classId, enrollmentData, teacherId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk enroll students');
      return null;
    } finally {
      setLoading(false);
    }
  }, [classId, teacherId]);

  const removeStudent = useCallback(async (studentId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await ClassService.removeStudent(classId, studentId, teacherId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove student');
      return false;
    } finally {
      setLoading(false);
    }
  }, [classId, teacherId]);

  const bulkRemoveStudents = useCallback(async (
    studentIds: string[]
  ): Promise<{ results: string[]; errors: { studentId: string; error: string }[] } | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await ClassService.bulkRemoveStudents(classId, studentIds, teacherId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk remove students');
      return null;
    } finally {
      setLoading(false);
    }
  }, [classId, teacherId]);

  return {
    loading,
    error,
    enrollStudent,
    bulkEnrollStudents,
    removeStudent,
    bulkRemoveStudents
  };
}
