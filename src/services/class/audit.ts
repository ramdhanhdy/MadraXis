import { supabase } from '../../utils/supabase';
import { ClassServiceError } from './types';
import { logger } from '../../utils/logger';

/**
 * ClassAuditService handles audit trail logging for class operations
 */
export class ClassAuditService {
  /**
   * Log an audit trail entry for class operations
   */
  static async logAuditTrail(
    classId: number,
    action: 'create' | 'update' | 'delete' | 'restore' | 'enroll_student' | 'remove_student',
    changedFields: string[] | null,
    oldValues: any,
    newValues: any,
    performedBy: string
  ): Promise<void> {
    try {
      const auditData = {
        table_name: 'classes',
        record_id: classId.toString(),
        action,
        changed_fields: changedFields,
        old_values: oldValues,
        new_values: newValues,
        performed_by: performedBy,
        performed_at: new Date().toISOString(),
      };

      logger.debug('Creating audit trail entry', {
        operation: 'audit_log',
        userId: performedBy,
        classId,
        action
      });

      const { error } = await supabase
        .from('audit_logs')
        .insert(auditData);

      if (error) {
        logger.error('Audit trail logging failed', {
          operation: 'audit_log',
          userId: performedBy,
          classId,
          action,
          errorCode: error.code,
          errorMessage: error.message
        });
      } else {
        logger.info('Audit trail logged successfully', {
          operation: 'audit_log',
          userId: performedBy,
          classId,
          action
        });
      }
    } catch (error: any) {
      logger.warn('Audit trail logging failed (non-blocking)', {
        operation: 'audit_log',
        userId: performedBy,
        classId,
        action,
        errorMessage: error?.message
      });
    }
  }

  /**
   * Log class creation
   */
  static async logClassCreation(
    classId: number,
    classData: any,
    teacherId: string
  ): Promise<void> {
    await ClassAuditService.logAuditTrail(
      classId,
      'create',
      null,
      null,
      classData,
      teacherId
    );
  }

  /**
   * Log class update
   */
  static async logClassUpdate(
    classId: number,
    changedFields: string[],
    oldData: any,
    newData: any,
    teacherId: string
  ): Promise<void> {
    await ClassAuditService.logAuditTrail(
      classId,
      'update',
      changedFields,
      oldData,
      newData,
      teacherId
    );
  }

  /**
   * Log class deletion
   */
  static async logClassDeletion(
    classId: number,
    classData: any,
    teacherId: string
  ): Promise<void> {
    await ClassAuditService.logAuditTrail(
      classId,
      'delete',
      ['status', 'deleted_at'],
      classData,
      { ...classData, status: 'archived', deleted_at: new Date().toISOString() },
      teacherId
    );
  }

  /**
   * Log class restoration
   */
  static async logClassRestoration(
    classId: number,
    oldData: any,
    newData: any,
    teacherId: string
  ): Promise<void> {
    await ClassAuditService.logAuditTrail(
      classId,
      'restore',
      ['status', 'deleted_at'],
      oldData,
      newData,
      teacherId
    );
  }

  /**
   * Log student enrollment
   */
  static async logEnrollmentAction(
    classId: number,
    action: 'enroll_student' | 'remove_student',
    studentId: string,
    enrollmentData: any,
    teacherId: string
  ): Promise<void> {
    try {
      const auditData = {
        table_name: 'class_students',
        record_id: `${classId}-${studentId}`,
        action,
        changed_fields: action === 'enroll_student' ? ['student_id', 'enrollment_date'] : ['removed_at'],
        old_values: action === 'enroll_student' ? null : enrollmentData,
        new_values: action === 'enroll_student' ? enrollmentData : null,
        performed_by: teacherId,
        performed_at: new Date().toISOString(),
      };

      logger.debug('Creating enrollment audit entry', {
        operation: 'enrollment_audit',
        userId: teacherId,
        classId,
        studentId,
        action
      });

      const { error } = await supabase
        .from('audit_logs')
        .insert(auditData);

      if (error) {
        logger.error('Enrollment audit logging failed', {
          operation: 'enrollment_audit',
          userId: teacherId,
          classId,
          studentId,
          action,
          errorCode: error.code,
          errorMessage: error.message
        });
      } else {
        logger.info('Enrollment audit logged successfully', {
          operation: 'enrollment_audit',
          userId: teacherId,
          classId,
          studentId,
          action
        });
      }
    } catch (error: any) {
      logger.warn('Enrollment audit logging failed (non-blocking)', {
        operation: 'enrollment_audit',
        userId: teacherId,
        classId,
        studentId,
        action,
        errorMessage: error?.message
      });
    }
  }

  /**
   * Get audit history for a class
   */
  static async getClassAuditHistory(
    classId: number,
    options?: {
      limit?: number;
      offset?: number;
      action_type?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<{
    audits: Array<{
      id: number;
      action_type: string;
      old_values: any;
      new_values: any;
      performed_by: string;
      performed_at: string;
      metadata: any;
      performed_by_name: string | null;
    }>;
    total: number;
  }> {
    try {
      const limit = options?.limit || 50;
      const offset = options?.offset || 0;
      
      let query = supabase
        .from('audit_logs')
        .select(`
          id,
          action,
          old_values,
          new_values,
          performed_by,
          performed_at,
          changed_fields,
          profiles!left(full_name)
        `, { count: 'exact' })
        .eq('record_id', classId.toString())
        .order('performed_at', { ascending: false });

      // Apply filters if provided
      if (options?.action_type) {
        query = query.eq('action', options.action_type);
      }
      if (options?.start_date) {
        query = query.gte('performed_at', options.start_date);
      }
      if (options?.end_date) {
        query = query.lte('performed_at', options.end_date);
      }

      const { data: auditLogs, error, count } = await query.range(offset, offset + limit - 1);

      if (error) {
        throw ClassServiceError.create(
          'AUDIT_FETCH_FAILED',
          'Failed to fetch audit history',
          { originalError: error, classId }
        );
      }

      const formattedAudits = (auditLogs || []).map(log => ({
        id: log.id,
        action_type: log.action,
        old_values: log.old_values,
        new_values: log.new_values,
        performed_by: log.performed_by,
        performed_at: log.performed_at,
        metadata: log.changed_fields,
        performed_by_name: log.profiles?.[0]?.full_name || null
      }));

      return {
        audits: formattedAudits,
        total: count || 0
      };
    } catch (error) {
      if (error instanceof ClassServiceError) {
        throw error;
      }
      throw ClassServiceError.create(
        'UNEXPECTED_ERROR',
        'An unexpected error occurred while fetching audit history',
        { originalError: error, classId }
      );
    }
  }
}


