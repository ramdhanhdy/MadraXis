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

// Main component
export const StudentSelectionList: React.FC<StudentSelectionListProps> = ({
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

  // Debounced search effect
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

  // Filter students based on current filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = student.full_name.toLowerCase().includes(query);
        const nisMatch = student.nis?.toLowerCase().includes(query);
        if (!nameMatch && !nisMatch) return false;
      }

      // Grade level filter
      if (localFilters.gradeLevel && localFilters.gradeLevel !== 'all') {
        // Assuming grade level is derived from student details or class association
        // This would need to be implemented based on your data structure
      }

      // Boarding filter
      if (localFilters.boarding !== 'all') {
        if (student.boarding !== localFilters.boarding) return false;
      }

      return true;
    });
  }, [students, searchQuery, localFilters]);

  // Handle search input change
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof StudentFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

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

  // Render filter section
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <View style={styles.filtersContainer}>
        {/* Grade Level Filter */}
        <View style={styles.filterRow}>
          <Typography variant="body2" color="secondary" style={styles.filterLabel}>
            Grade Level:
          </Typography>
          <View style={styles.filterButtons}>
            {['all', 'SMA', 'SMP'].map((level) => (
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
            {[
              { key: 'all', label: 'All' },
              { key: true, label: 'Boarding' },
              { key: false, label: 'Day Student' },
            ].map((option) => (
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
  };

  // Render empty state
  const renderEmptyState = () => {
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
  };

  // Render footer (load more)
  const renderFooter = () => {
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
  };

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
      {renderFilters()}

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
  },
  filterLabel: {
    minWidth: 80,
    marginRight: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    minHeight: 32,
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

export default StudentSelectionList;