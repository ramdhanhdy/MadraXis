import { logger } from '../utils/logger';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabase';
import type { Student, ClassStudent } from '../types/student';

interface UseClassStudentsSubscriptionProps {
  classId: number;
  enabled?: boolean;
}

interface UseClassStudentsSubscriptionReturn {
  students: Student[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface ClassStudentJoin extends ClassStudent {
  student: Student;
}

export function useClassStudentsSubscription({
  classId,
  enabled = true
}: UseClassStudentsSubscriptionProps): UseClassStudentsSubscriptionReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<any>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.
      from('class_students').
      select(`
          *,
          student:profiles!student_id(
            id,
            full_name,
            email,
            role,
            school_id,
            created_at,
            updated_at,
            student_details:student_details(
              nis,
              grade_level,
              boarding,
              created_at,
              updated_at
            )
          )
        `).
      eq('class_id', classId);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const formattedStudents: Student[] = data?.map((item: any) => ({
        ...item.student,
        student_details: item.student.student_details
      })) || [];

      setStudents(formattedStudents);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const setupSubscription = useCallback(() => {
    if (!enabled || classId <= 0) return;

    // Subscribe to changes in the class_students table
    subscriptionRef.current = supabase.
    channel(`class_students_${classId}`).
    on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'class_students',
        filter: `class_id=eq.${classId}`
      },
      () => {
        // Re-fetch students when changes occur
        fetchStudents();
      }
    ).
    subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        logger.debug(`Subscribed to class_students updates for class ${classId}`);
      } else if (status === 'CHANNEL_ERROR') {
        setError(new Error('Failed to subscribe to real-time updates'));
      }
    });
  }, [classId, enabled, fetchStudents]);

  useEffect(() => {
    if (!enabled || classId <= 0) return;

    // Initial fetch
    fetchStudents();

    // Set up subscription
    setupSubscription();

    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [classId, enabled, fetchStudents, setupSubscription]);

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