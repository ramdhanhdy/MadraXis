/**
 * StudentSelectionList Component
 * 
 * A comprehensive student selection interface that allows teachers to browse,
 * search, filter, and select students for class enrollment. Features include:
 * - Real-time search by name or NIS
 * - Grade level and boarding status filtering
 * - Multi-selection with checkboxes
 * - Pagination and virtual scrolling for performance
 * - Optimized re-renders and memoization
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { EmptyState } from '../EmptyState/EmptyState';
import { StudentWithDetails } from '../../../types';
import { StudentSelectionItem } from './StudentSelectionItem';
import { BulkActionBar } from '../BulkActionBar';
import { determineGradeLevel } from '../../../utils/dateHelpers';

// Filter options for student selection
export interface StudentFilters {
  gradeLevel?: 'SMA' | 'SMP' | 'all';
  boarding?: boolean | 'all';
  search?: string;
}

// Props interface for StudentSelectionList
export interface StudentSelectionListProps {
  // Data
  students: StudentWithDetails[];
  selectedStudentIds: Set<string>;
  
  // Callbacks
  onStudentSelect: (studentId: string) => void;
  onStudentDeselect: (studentId: string) => void;
  onBulkSelect: (studentIds: string[]) => void;
  onClearSelection: () => void;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  
  // State
  loading?: boolean;
  refreshing?: boolean;
  hasMore?: boolean;
  
  // Filters
  filters?: StudentFilters;
  onFiltersChange?: (filters: StudentFilters) => void;
  
  // Configuration
  classLevel?: 'SMA' | 'SMP';
  showFilters?: boolean;
  enableVirtualization?: boolean;
  
  // Styling
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

// Main component with React.memo optimization
const StudentSelectionListComponent: React.FC<StudentSelectionListProps> = ({
  students,
  selectedStudentIds,
  onStudentSelect,
  onStudentDeselect,
  onBulkSelect,
  onClearSelection,
  onRefresh,
  onLoadMore,
  loading = false,
  refreshing = false,
  hasMore = false,
  filters = {},
  onFiltersChange,
  classLevel,
  showFilters = true,
  enableVirtualization = true,
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  
  // Local state for search input
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [localFilters, setLocalFilters] = useState<StudentFilters>({
    gradeLevel: classLevel || 'all',
    boarding: 'all',
    ...filters,
  });

  // Debounced search and filter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onFiltersChange) {
        onFiltersChange({
          ...localFilters,
          search: searchQuery.trim(),
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, localFilters, onFiltersChange]);

   // Sync local state with external filters prop changes
  useEffect(() => {
    setSearchQuery(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setLocalFilters(prev => ({
      gradeLevel: classLevel || 'all',
      boarding: 'all',
      ...filters,
    }));
  }, [filters, classLevel]);

  // Helper function to determine student grade level
  const getStudentGradeLevel = useCallback((student: StudentWithDetails): 'SMA' | 'SMP' | null => {
    // Use the new accurate grade level determination
    if (student.date_of_birth) {
      const gradeLevel = determineGradeLevel(student.date_of_birth);
      return gradeLevel as 'SMA' | 'SMP' | null;
    }
    
    // Fallback to class level if no birth date available
    return classLevel || null;
  }, [classLevel]);

  // Filter students based on current filters (client-side only for non-search filters)
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Note: Search filtering is handled server-side via onFiltersChange
      // Only apply client-side filters that are not handled by the server

      // Grade level filter
      if (localFilters.gradeLevel && localFilters.gradeLevel !== 'all') {
        const studentGradeLevel = getStudentGradeLevel(student);
        if (!studentGradeLevel || studentGradeLevel !== localFilters.gradeLevel) {
          return false;
        }
      }

      // Boarding filter (if not handled server-side)
      if (localFilters.boarding !== 'all') {
        const studentBoardingStatus = student.boarding;
        // Explicitly handle undefined/null values
        if (studentBoardingStatus === undefined || studentBoardingStatus === null) {
          return false; // Exclude students with undefined boarding status from all boarding filters
        }
        if (localFilters.boarding === true && !studentBoardingStatus) return false;
        if (localFilters.boarding === false && studentBoardingStatus) return false;
      }

      return true;
    });
  }, [students, localFilters, getStudentGradeLevel]);

  // Handle search input change
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof StudentFilters, value: any) => {
    const newFilters = {
      ...localFilters,
      [key]: value,
    };
    
    setLocalFilters(newFilters);
    
    // Trigger server-side filtering for supported filters
    if (onFiltersChange) {
      onFiltersChange({
        ...newFilters,
        search: searchQuery.trim(),
      });
    }
  }, [localFilters, searchQuery, onFiltersChange]);

  // Handle student selection toggle
  const handleStudentToggle = useCallback((studentId: string) => {
    if (selectedStudentIds.has(studentId)) {
      onStudentDeselect(studentId);
    } else {
      onStudentSelect(studentId);
    }
  }, [selectedStudentIds, onStudentSelect, onStudentDeselect]);

  // Handle select all visible students
  const handleSelectAllVisible = useCallback(() => {
    const visibleStudentIds = filteredStudents.map(student => student.id);
    onBulkSelect(visibleStudentIds);
  }, [filteredStudents, onBulkSelect]);

  // Render student item
  const renderStudentItem: ListRenderItem<StudentWithDetails> = useCallback(({ item }) => {
    return (
      <StudentSelectionItem
        student={item}
        selected={selectedStudentIds.has(item.id)}
        onToggle={() => handleStudentToggle(item.id)}
      />
    );
  }, [selectedStudentIds, handleStudentToggle]);

  // Get item layout for virtualization
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80, // Estimated item height
    offset: 80 * index,
    index,
  }), []);

  // Key extractor
  const keyExtractor = useCallback((item: StudentWithDetails) => item.id, []);

  // Filter configurations - memoized to prevent recreation
  const gradeLevelOptions = useMemo(() => ['all', 'SMA', 'SMP'], []);
  const boardingOptions = useMemo(() => [
    { key: 'all', label: 'All' },
    { key: true, label: 'Boarding' },
    { key: false, label: 'Day Student' },
  ], []);

  // Render filter section with useMemo
  const renderFilters = useMemo(() => {
    if (!showFilters) return null;

    return (
      <View style={styles.filtersContainer}>
        {/* Grade Level Filter */}
        <View style={styles.filterRow}>
          <Typography variant="body2" color="secondary" style={styles.filterLabel}>
            Grade Level:
          </Typography>
          <View style={styles.filterButtons}>
            {gradeLevelOptions.map((level) => (
              <Button
                key={level}
                variant={localFilters.gradeLevel === level ? 'primary' : 'outline'}
                size="small"
                onPress={() => handleFilterChange('gradeLevel', level)}
                style={styles.filterButton}
              >
                {level === 'all' ? 'All' : level}
              </Button>
            ))}
          </View>
        </View>

        {/* Boarding Filter */}
        <View style={styles.filterRow}>
          <Typography variant="body2" color="secondary" style={styles.filterLabel}>
            Boarding:
          </Typography>
          <View style={styles.filterButtons}>
            {boardingOptions.map((option) => (
              <Button
                key={String(option.key)}
                variant={localFilters.boarding === option.key ? 'primary' : 'outline'}
                size="small"
                onPress={() => handleFilterChange('boarding', option.key)}
                style={styles.filterButton}
              >
                {option.label}
              </Button>
            ))}
          </View>
        </View>
      </View>
    );
  }, [showFilters, localFilters.gradeLevel, localFilters.boarding, handleFilterChange]);

  // Render empty state with useMemo
  const renderEmptyState = useMemo(() => {
    if (loading) return null;
    
    const isFiltered = searchQuery.trim() || 
      localFilters.gradeLevel !== 'all' || 
      localFilters.boarding !== 'all';

    return (
      <EmptyState
        title={isFiltered ? 'No students found' : 'No students available'}
        message={
          isFiltered 
            ? 'Try adjusting your search or filters'
            : 'There are no students available for selection'
        }
        icon="people-outline"
      />
    );
  }, [loading, searchQuery, localFilters.gradeLevel, localFilters.boarding]);

  // Render footer (load more) with useMemo
  const renderFooter = useMemo(() => {
    if (!hasMore || loading) return null;
    
    return (
      <View style={styles.footerContainer}>
        <Button
          variant="outline"
          onPress={onLoadMore}
          loading={loading}
        >
          Load More Students
        </Button>
      </View>
    );
  }, [hasMore, loading, onLoadMore]);

  return (
    <View 
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search by name or NIS..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          leftIcon="search-outline"
          clearButtonMode="while-editing"
          returnKeyType="search"
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Filters */}
      {renderFilters}

      {/* Bulk Action Bar */}
      {selectedStudentIds.size > 0 && (
        <BulkActionBar
          selectedCount={selectedStudentIds.size}
          totalVisible={filteredStudents.length}
          onSelectAll={handleSelectAllVisible}
          onClearSelection={onClearSelection}
        />
      )}

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={keyExtractor}
        getItemLayout={enableVirtualization ? getItemLayout : undefined}
        removeClippedSubviews={enableVirtualization}
        maxToRenderPerBatch={20}
        windowSize={10}
        initialNumToRender={15}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          ) : undefined
        }
        contentContainerStyle={[
          styles.listContent,
          filteredStudents.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: -4,
  },
  filterLabel: {
    minWidth: 80,
    marginRight: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  filterButton: {
    flex: 1,
    minHeight: 32,
    marginHorizontal: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
});

// Export memoized component to prevent unnecessary re-renders
export const StudentSelectionList = React.memo(StudentSelectionListComponent, (prevProps, nextProps) => {
  const selectedIdsEqual = 
    prevProps.selectedStudentIds.size === nextProps.selectedStudentIds.size &&
    Array.from(prevProps.selectedStudentIds).every(id => nextProps.selectedStudentIds.has(id));
  
  const filtersEqual = 
    prevProps.filters?.gradeLevel === nextProps.filters?.gradeLevel &&
    prevProps.filters?.boarding === nextProps.filters?.boarding &&
    prevProps.filters?.search === nextProps.filters?.search;
  
  return (
    prevProps.students === nextProps.students &&
    selectedIdsEqual &&
    prevProps.loading === nextProps.loading &&
    prevProps.refreshing === nextProps.refreshing &&
    prevProps.hasMore === nextProps.hasMore &&
    prevProps.showFilters === nextProps.showFilters &&
    prevProps.enableVirtualization === nextProps.enableVirtualization &&
    prevProps.classLevel === nextProps.classLevel &&
    filtersEqual
  );
});

// Default export for backwards compatibility
export default StudentSelectionList;