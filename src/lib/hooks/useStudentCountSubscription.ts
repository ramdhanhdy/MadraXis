import { logger } from '@lib/utils/logger';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@lib/utils/supabase';
import { isSafeToQuery } from '@lib/utils/navigationGuard';

interface UseStudentCountSubscriptionProps {
  classIds: number[];
  enabled?: boolean;
}

interface UseStudentCountSubscriptionReturn {
  counts: Record<number, number>;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useStudentCountSubscription({
  classIds,
  enabled = true
}: UseStudentCountSubscriptionProps): UseStudentCountSubscriptionReturn {
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionsRef = useRef<Map<number, any>>(new Map());

  const fetchCounts = useCallback(async () => {
    // Don't fetch if navigation is in progress
    if (!isSafeToQuery()) {
      logger.debug('Skipping student count fetch - navigation in progress');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch counts for all provided class IDs
      const promises = classIds.map(async (classId) => {
        const { count, error: countError } = await supabase.
        from('class_students').
        select('*', { count: 'exact', head: true }).
        eq('class_id', classId);

        if (countError) {
          throw new Error(countError.message);
        }

        return { classId, count: count || 0 };
      });

      const results = await Promise.all(promises);

      const newCounts: Record<number, number> = {};
      results.forEach(({ classId, count }) => {
        newCounts[classId] = count;
      });

      setCounts(newCounts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [classIds]);

  const setupSubscriptions = useCallback(() => {
    if (!enabled || classIds.length === 0) return;

    // Set up individual subscriptions for each class
    classIds.forEach((classId) => {
      if (subscriptionsRef.current.has(classId)) {
        return; // Already subscribed
      }

      const subscription = supabase.
      channel(`class_student_count_${classId}`).
      on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_students',
          filter: `class_id=eq.${classId}`
        },
        () => {
          // When changes occur, re-fetch the count for this specific class
          supabase.
          from('class_students').
          select('*', { count: 'exact', head: true }).
          eq('class_id', classId).
          then(({ count, error: countError }) => {
            if (countError) {
              logger.error(`Error fetching student count for class ${classId}: ${countError.message}`, {
                classId,
                error: countError.message
              });
              // Optionally set error state or use cached value
              return;
            }
            setCounts((prev) => ({
              ...prev,
              [classId]: count || 0
            }));
          });
        }
      ).
      subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          logger.debug(`Subscribed to student count updates for class ${classId}`);
        }
      });

      subscriptionsRef.current.set(classId, subscription);
    });
  }, [classIds, enabled]);

  const cleanupSubscriptions = useCallback(() => {
    subscriptionsRef.current.forEach((subscription, classId) => {
      supabase.removeChannel(subscription);
      logger.debug(`Unsubscribed from student count updates for class ${classId}`);
    });
    subscriptionsRef.current.clear();
  }, []);

  useEffect(() => {
    if (!enabled || classIds.length === 0) return;

    // Fetch initial counts
    fetchCounts();

    // Set up subscriptions
    setupSubscriptions();

    // Cleanup function
    return () => {
      cleanupSubscriptions();
    };
  }, [classIds, enabled, fetchCounts, setupSubscriptions, cleanupSubscriptions]);

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
