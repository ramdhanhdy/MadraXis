import { useState, useEffect, useCallback } from 'react';
import { UserService } from './api';
import {
  Student,
  Teacher,
  Profile,
  StudentWithPerformance,
  UserWithDetails,
  SearchUsersOptions,
  UserSearchResult,
  UserCounts,
  LegacyStudent
} from './types';
import type { DatabaseResponse } from '@types/database';

/**
 * Hook for fetching students for a school
 */
export function useStudents(schoolId: number, limit?: number) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.fetchStudents(schoolId, limit);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setStudents(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [schoolId, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const refetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for fetching a single student with details
 */
export function useStudent(studentId: string) {
  const [student, setStudent] = useState<StudentWithPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.fetchStudentById(studentId);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setStudent(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const refetch = useCallback(() => {
    fetchStudent();
  }, [fetchStudent]);

  return {
    student,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for fetching teachers for a school
 */
export function useTeachers(schoolId: number, limit?: number) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.fetchTeachers(schoolId, limit);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setTeachers(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, [schoolId, limit]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const refetch = useCallback(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return {
    teachers,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for fetching user profile by ID
 */
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.fetchUserProfile(userId);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setProfile(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for searching students
 */
export function useStudentSearch(schoolId: number) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStudents = useCallback(async (searchTerm: string, limit: number = 10) => {
    if (!schoolId || !searchTerm.trim()) {
      setStudents([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.searchStudents(schoolId, searchTerm, limit);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setStudents(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search students');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  const clearSearch = useCallback(() => {
    setStudents([]);
    setError(null);
  }, []);

  return {
    students,
    loading,
    error,
    searchStudents,
    clearSearch
  };
}

/**
 * Hook for advanced user search with filters
 */
export function useUserSearch(schoolId: number) {
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useCallback(async (options: SearchUsersOptions = {}) => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.searchUsers(schoolId, options);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setSearchResult(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  const clearSearch = useCallback(() => {
    setSearchResult(null);
    setError(null);
  }, []);

  return {
    searchResult,
    loading,
    error,
    searchUsers,
    clearSearch
  };
}

/**
 * Hook for user counts by role
 */
export function useUserCounts(schoolId: number) {
  const [counts, setCounts] = useState<UserCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.getUserCounts(schoolId);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setCounts(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user counts');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const refetch = useCallback(() => {
    fetchCounts();
  }, [fetchCounts]);

  return {
    counts,
    loading,
    error,
    refetch
  };
}

/**
 * Hook for legacy student format (backward compatibility)
 */
export function useStudentsLegacy(schoolId: number, limit?: number) {
  const [students, setStudents] = useState<LegacyStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await UserService.fetchStudentsLegacyFormat(schoolId, limit);
      
      if (result.error) {
        setError(result.error.message);
      } else {
        setStudents(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [schoolId, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const refetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    refetch
  };
}
