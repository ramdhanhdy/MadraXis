import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';

interface StudentBreakdown {
  classId: number;
  boardingStudents: number;
  dayStudents: number;
  totalStudents: number;
}

interface UseClassStudentBreakdownReturn {
  breakdowns: Record<number, StudentBreakdown>;
  loading: boolean;
  error: Error | null;
  refetch: (classIds: number[]) => Promise<void>;
}

interface UseClassStudentBreakdownProps {
  classIds: number[];
  enabled?: boolean;
}

export function useClassStudentBreakdown({
  classIds,
  enabled = true,
}: UseClassStudentBreakdownProps): UseClassStudentBreakdownReturn {
  const [breakdowns, setBreakdowns] = useState<Record<number, StudentBreakdown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBreakdown = useCallback(async (ids: number[]) => {
    if (!ids || ids.length === 0) {
      setBreakdowns({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch breakdown for all classes
      const promises = ids.map(async (classId) => {
        // Get boarding students count
        const { data: boardingData, error: boardingError } = await supabase
          .from('class_students')
          .select(`
            student_id,
            student_details!inner(
              boarding
            )
          `, { count: 'exact' })
          .eq('class_id', classId)
          .eq('student_details.boarding', true);

        if (boardingError) throw boardingError;

        // Get day students count
        const { data: dayData, error: dayError } = await supabase
          .from('class_students')
          .select(`
            student_id,
            student_details!inner(
              boarding
            )
          `, { count: 'exact' })
          .eq('class_id', classId)
          .eq('student_details.boarding', false);

        if (dayError) throw dayError;

        // Get total students
        const { count: totalCount, error: totalError } = await supabase
          .from('class_students')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', classId);

        if (totalError) throw totalError;

        return {
          classId,
          boardingStudents: boardingData?.length || 0,
          dayStudents: dayData?.length || 0,
          totalStudents: totalCount || 0,
        };
      });

      const results = await Promise.all(promises);
      
      const newBreakdowns: Record<number, StudentBreakdown> = {};
      results.forEach((result) => {
        newBreakdowns[result.classId] = result;
      });

      setBreakdowns(newBreakdowns);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async (ids: number[]) => {
    await fetchBreakdown(ids);
  }, [fetchBreakdown]);

  useEffect(() => {
    if (enabled && classIds.length > 0) {
      fetchBreakdown(classIds);
    }
  }, [classIds, enabled, fetchBreakdown]);

  return {
    breakdowns,
    loading,
    error,
    refetch,
  };
}