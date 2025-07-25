import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Modal } from '../Modal';
import { Ionicons } from '@expo/vector-icons';
import { ClassService } from '../../../services/classService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './AddStudentsToClassModal.styles';

// Available student type from ClassService
interface AvailableStudent {
  id: string;
  full_name: string;
  nis: string;
  gender: string;
  boarding: boolean;
  date_of_birth: string;
}

// Component Props Interface
export interface AddStudentsToClassModalProps {
  visible: boolean;
  onClose: () => void;
  classId: number;
  onStudentsAdded?: () => void;
}

// Filter state interface
interface FilterState {
  search: string;
  boarding?: boolean;
  gender?: string;
}

export const AddStudentsToClassModal: React.FC<AddStudentsToClassModalProps> = ({
  visible,
  onClose,
  classId,
  onStudentsAdded,
}) => {
  // Hooks
  const { user } = useAuth();

  // State management
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<AvailableStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    boarding: undefined,
    gender: undefined,
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Load students function
  const loadStudents = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await ClassService.getAvailableStudents(
        classId,
        user.id,
        {
          search: debouncedSearch || undefined,
          boarding: filters.boarding,
          gender: filters.gender,
        },
        {
          page: pagination.page,
          limit: pagination.limit,
        }
      );
      
      setStudents(result.students);
      setPagination({
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (err: any) {
      console.error('Error loading students:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [classId, user?.id, debouncedSearch, filters.boarding, filters.gender, pagination.page, pagination.limit]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Load students when modal opens or debounced search/filters change
  useEffect(() => {
    if (visible) {
      loadStudents();
    }
  }, [visible, debouncedSearch, filters.boarding, filters.gender, pagination.page, pagination.limit, loadStudents]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedStudents(new Set());
      setError(null);
      setFilters({
        search: '',
        boarding: undefined,
        gender: undefined,
      });
      setPagination({ page: 1, limit: 20, total: 0 });
    }
  }, [visible]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedStudents(new Set()); // Clear selections when filters change
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle search with debouncing
  const handleSearchChange = useCallback((text: string) => {
    // Update the search input immediately for UI responsiveness
    setFilters(prev => ({ ...prev, search: text }));
    setSelectedStudents(new Set()); // Clear selections when search changes
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStudents();
  }, [loadStudents]);

  // Handle student selection
  const toggleStudentSelection = useCallback((studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)));
    }
  }, [students, selectedStudents.size]);

  // Handle adding students
  const handleAddStudents = useCallback(async () => {
    if (!user?.id || selectedStudents.size === 0) return;

    try {
      setSubmitting(true);
      
      const studentIds = Array.from(selectedStudents);
      await ClassService.addStudentsToClass(classId, studentIds, user.id);
      
      Alert.alert(
        'Success',
        `Successfully added ${studentIds.length} student${studentIds.length !== 1 ? 's' : ''} to the class.`,
        [{ text: 'OK', onPress: () => {
          onStudentsAdded?.();
          onClose();
        }}]
      );
    } catch (err: any) {
      console.error('Error adding students:', err);
      Alert.alert(
        'Error',
        err.message || 'Failed to add students to class. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  }, [classId, selectedStudents, user?.id, onStudentsAdded, onClose]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Add Students to Class"
      subtitle={`Select students to add to this class`}
      size="large"
      scrollable={false}
    >
      <View style={styles.container}>
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or NIS..."
            value={filters.search}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            accessibilityLabel="Search students"
          />
        </View>

        {/* Filters Section */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.boarding === true && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterChange('boarding', filters.boarding === true ? undefined : true)}
            accessibilityRole="button"
            accessibilityLabel="Filter boarding students"
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.boarding === true && styles.activeFilterButtonText,
              ]}
            >
              Boarding
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.boarding === false && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterChange('boarding', filters.boarding === false ? undefined : false)}
            accessibilityRole="button"
            accessibilityLabel="Filter day students"
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.boarding === false && styles.activeFilterButtonText,
              ]}
            >
              Day Student
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.gender === 'M' && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterChange('gender', filters.gender === 'M' ? undefined : 'M')}
            accessibilityRole="button"
            accessibilityLabel="Filter male students"
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.gender === 'M' && styles.activeFilterButtonText,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.gender === 'F' && styles.activeFilterButton,
            ]}
            onPress={() => handleFilterChange('gender', filters.gender === 'F' ? undefined : 'F')}
            accessibilityRole="button"
            accessibilityLabel="Filter female students"
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.gender === 'F' && styles.activeFilterButtonText,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selection Summary */}
        {selectedStudents.size > 0 && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected
            </Text>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={handleSelectAll}
              accessibilityRole="button"
              accessibilityLabel="Select all students"
            >
              <Text style={styles.selectAllButtonText}>
                {selectedStudents.size === students.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Students List */}
        <View style={styles.studentsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading students...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadStudents}
                accessibilityRole="button"
                accessibilityLabel="Retry loading students"
                testID="retry-button"
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : students.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No available students found</Text>
              <Text style={styles.emptySubtext}>
                All students may already be enrolled in this class
              </Text>
            </View>
          ) : (
            <ScrollView
              testID="scroll-view"
              refreshControl={
                <RefreshControl
                  testID="refresh-control"
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#007AFF']}
                  tintColor="#007AFF"
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {students.map((student) => {
                const isSelected = selectedStudents.has(student.id);
                return (
                  <TouchableOpacity
                    key={student.id}
                    style={[styles.studentItem, isSelected && styles.selectedStudentItem]}
                    onPress={() => toggleStudentSelection(student.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={`${student.full_name}, ${student.nis || 'No NIS'}`}
                  >
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{student.full_name}</Text>
                      <Text style={styles.studentDetails}>
                        NIS: {student.nis || 'N/A'} • {student.gender || 'N/A'} • 
                        {student.boarding ? 'Boarding' : 'Day Student'}
                      </Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.addButton,
              (selectedStudents.size === 0 || submitting) && styles.addButtonDisabled,
            ]}
            onPress={handleAddStudents}
            disabled={selectedStudents.size === 0 || submitting}
            accessibilityRole="button"
            accessibilityLabel={`Add ${selectedStudents.size} students to class`}
            accessibilityState={{ disabled: selectedStudents.size === 0 || submitting }}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={[
                  styles.addButtonText,
                  selectedStudents.size === 0 && styles.addButtonTextDisabled,
                ]}
              >
                Add {selectedStudents.size} Student{selectedStudents.size === 1 ? '' : 's'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};