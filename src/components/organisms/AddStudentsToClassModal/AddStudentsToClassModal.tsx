import { logger } from '../../../utils/logger';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Alert,
  StyleSheet } from
'react-native';
import { useRouter } from 'expo-router';
import { Modal } from '../Modal';
import { ClassService } from '../../../services/classService';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { StudentSelectionList, StudentFilters } from '../../molecules/StudentSelectionList/StudentSelectionList';
import { BreadcrumbNavigation } from '../../molecules/BreadcrumbNavigation';
import { StudentWithDetails } from '../../../types';
import { Button } from '../../atoms/Button';
import { Typography } from '../../atoms/Typography';

// Available student type from ClassService
interface AvailableStudent {
  student_id: string;
  full_name: string;
  nis?: string;
  gender?: 'male' | 'female';
  boarding?: 'day' | 'boarding';
}

// Component Props Interface
export interface AddStudentsToClassModalProps {
  visible: boolean;
  onClose: () => void;
  classId: number;
  onStudentsAdded?: () => void;
}

// Data adapter to convert AvailableStudent to StudentWithDetails
const adaptAvailableStudentToStudentWithDetails = (student: AvailableStudent, school_id: number): StudentWithDetails => {
  // Handle boarding type conversion more robustly
  let boarding: boolean | undefined;
  if (student.boarding === 'boarding') {
    boarding = true;
  } else if (student.boarding === 'day') {
    boarding = false;
  } else {
    boarding = undefined;
  }

  return {
    id: student.student_id,
    full_name: student.full_name,
    role: 'student' as const,
    school_id, // Use the actual school_id from class data
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nis: student.nis,
    gender: student.gender === 'male' ? 'M' : student.gender === 'female' ? 'F' : undefined,
    boarding
  };
};

export const AddStudentsToClassModal: React.FC<AddStudentsToClassModalProps> = ({
  visible,
  onClose,
  classId,
  onStudentsAdded
}) => {
  // Hooks
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Create styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8
    },
    breadcrumbContainer: {
      marginBottom: 16,
      marginHorizontal: -16,
    },
    errorContainer: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.error.light,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: 'center'
    },
    errorText: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 8
    },
    retryButton: {
      marginTop: 8
    },
    studentsContainer: {
      flex: 1,
      marginBottom: 16
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.primary
    },
    cancelButton: {
      flex: 1
    },
    addButton: {
      flex: 2
    },
    addButtonDisabled: {
      opacity: 0.6
    }
  });

  // State management
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    boarding: 'all',
    gradeLevel: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  });
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState<{
    label: string;
    path: string;
    params?: Record<string, any>;
  }[]>([]);

  // Load students function
  const loadStudents = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch class data to get school_id and class name
      const classData = await ClassService.getClassById(classId, user.id);
      if (!classData) {
        throw new Error('Class not found');
      }

      // Class name is used in breadcrumb generation below

      // Generate breadcrumb items
      setBreadcrumbItems([
        { label: 'Dashboard', path: '/(teacher)/dashboard' },
        { label: 'Classes', path: '/(teacher)/class' },
        { label: classData.name, path: `/(teacher)/class/${classId}`, params: { id: classId } },
        { label: 'Add Students', path: `/(teacher)/class/${classId}/add-students`, params: { id: classId } }
      ]);

      const result = await ClassService.getAvailableStudents(
        classId,
        user.id,
        {
          searchTerm: filters.search || undefined,
          boarding: filters.boarding === true ? 'boarding' : filters.boarding === false ? 'day' : undefined,
          gender: undefined, // Grade level filtering will be handled client-side for now
          page: pagination.page,
          limit: pagination.limit
        }
      );

      // Adapt the data to StudentWithDetails format with actual school_id
      const adaptedStudents = result.students.map((student) =>
      adaptAvailableStudentToStudentWithDetails(student, classData.school_id)
      );
      setStudents(adaptedStudents);
      setPagination((prev) => ({
        ...prev,
        total: result.total,
        hasMore: result.students.length === pagination.limit
      }));
    } catch (err: any) {
      const context = err instanceof Error ? {
        operation: 'loadStudents',
        error: err.message,
        stack: err.stack
      } : {
        operation: 'loadStudents',
        error: 'Unknown error occurred'
      };
      logger.error('Error loading students:', context);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [classId, user?.id, filters.search, filters.boarding, pagination.page, pagination.limit]);

  // Load students when modal opens or filters change
  useEffect(() => {
    if (visible) {
      loadStudents();
    }
  }, [visible, loadStudents]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedStudents(new Set());
      setError(null);
      setFilters({
        search: '',
        boarding: 'all',
        gradeLevel: 'all'
      });
      setPagination({ page: 1, limit: 20, total: 0, hasMore: false });
    }
  }, [visible]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: StudentFilters) => {
    setFilters(newFilters);
    setSelectedStudents(new Set()); // Clear selections when filters change
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStudents();
  }, [loadStudents]);

  // Handle student selection
  const handleStudentSelect = useCallback((studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      newSet.add(studentId);
      return newSet;
    });
  }, []);

  // Handle student deselection
  const handleStudentDeselect = useCallback((studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
  }, []);

  // Handle bulk selection
  const handleBulkSelect = useCallback((studentIds: string[]) => {
    setSelectedStudents(new Set(studentIds));
  }, []);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedStudents(new Set());
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [loading, pagination.hasMore]);

  // Handle adding students
  const handleAddStudents = useCallback(async () => {
    if (!user?.id || selectedStudents.size === 0) return;

    try {
      setSubmitting(true);

      const studentIds = Array.from(selectedStudents);
      await ClassService.bulkEnrollStudents(
        classId,
        {
          student_ids: studentIds,
          enrollment_date: new Date().toISOString(),
          notes: undefined
        },
        user.id
      );

      Alert.alert(
        'Success',
        `Successfully added ${studentIds.length} student${studentIds.length !== 1 ? 's' : ''} to the class.`,
        [{ text: 'OK', onPress: () => {
            onStudentsAdded?.();
            onClose();
          } }]
      );
    } catch (err: any) {
      const context = err instanceof Error ? {
        operation: 'addStudents',
        error: err.message,
        stack: err.stack
      } : {
        operation: 'addStudents',
        error: 'Unknown error occurred'
      };
      logger.error('Error adding students:', context);
      Alert.alert(
        'Error',
        err.message || 'Failed to add students to class. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  }, [classId, selectedStudents, user?.id, onStudentsAdded, onClose]);

  // Memoize the adapted students to prevent unnecessary re-renders
  const adaptedStudents = useMemo(() => students, [students]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Add Students to Class"
      subtitle={`Select students to add to this class`}
      size="large"
      scrollable={false}>
      
      <View style={styles.container}>
        {/* Breadcrumb Navigation */}
        {breadcrumbItems.length > 0 && (
          <View style={styles.breadcrumbContainer}>
            <BreadcrumbNavigation
              items={breadcrumbItems}
              onNavigate={(path, params) => {
                // Close the modal before navigation
                onClose();
                
                // Use setTimeout to ensure modal closes before navigation
                setTimeout(() => {
                  if (params) {
                    router.push({ pathname: path as any, params });
                  } else {
                    router.push(path as any);
                  }
                }, 100);
              }}
              maxVisibleItems={3}
            />
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Typography variant="body2" color="error" style={styles.errorText}>
              {error}
            </Typography>
            <Button
              variant="outline"
              size="small"
              onPress={loadStudents}
              style={styles.retryButton}
            >
              Retry
            </Button>
          </View>
        )}

        {/* Student Selection List */}
        <View style={styles.studentsContainer}>
          <StudentSelectionList
            students={adaptedStudents}
            selectedStudentIds={selectedStudents}
            onStudentSelect={handleStudentSelect}
            onStudentDeselect={handleStudentDeselect}
            onBulkSelect={handleBulkSelect}
            onClearSelection={handleClearSelection}
            onRefresh={handleRefresh}
            onLoadMore={handleLoadMore}
            loading={loading}
            refreshing={refreshing}
            hasMore={pagination.hasMore}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            showFilters={true}
            enableVirtualization={true}
            accessibilityLabel="Available students for class enrollment"
            testID="student-selection-list" />
          
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={onClose}
            style={styles.cancelButton}
            accessibilityLabel="Cancel">
            
            Cancel
          </Button>
          
          <Button
            variant="primary"
            onPress={handleAddStudents}
            disabled={selectedStudents.size === 0 || submitting}
            loading={submitting}
            style={{
              ...styles.addButton,
              ...(selectedStudents.size === 0 && styles.addButtonDisabled)
            }}
            accessibilityLabel={`Add ${selectedStudents.size} students to class`}>
            
              Add {selectedStudents.size} Student{selectedStudents.size === 1 ? '' : 's'}
            </Button>
        </View>
      </View>
    </Modal>);

};