import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ClassService } from '../services/classService';
import { logger } from '../utils/logger';

export interface NavigationGuardResult {
  hasAccess: boolean;
  isLoading: boolean;
  error: string | null;
  validateAccess: (classId: number) => Promise<boolean>;
}

/**
 * Hook for managing navigation guards and permission validation
 * Validates teacher access to class operations
 */
export function useNavigationGuards(): NavigationGuardResult {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Validate if teacher has access to specific class
   */
  const validateAccess = async (classId: number): Promise<boolean> => {
    if (!user?.id) {
      setError('User not authenticated');
      return false;
    }

    if (user.role !== 'teacher') {
      setError('Access denied: User is not a teacher');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validate teacher access to the class
      await ClassService.validateTeacherAccess(classId, user.id, 'access');

      setHasAccess(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate access';
      setError(errorMessage);
      logger.error('Navigation guard validation failed:', { error: errorMessage, classId, userId: user.id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasAccess,
    isLoading,
    error,
    validateAccess,
  };
}