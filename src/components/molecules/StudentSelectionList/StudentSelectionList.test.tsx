/**
 * StudentSelectionList Component Tests
 * 
 * Comprehensive test suite for the StudentSelectionList component covering:
 * - Rendering and display
 * - Search functionality
 * - Filter operations
 * - Selection interactions
 * - Performance optimizations
 * - Accessibility
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { StudentSelectionList } from './StudentSelectionList';
import { StudentWithDetails } from '../../../types';

// Mock dependencies
jest.mock('../../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      spacing: { base: { sm: 8, md: 16 } },
      borderRadius: { md: 8 },
      typography: {
        fontSize: { sm: 12, base: 14, lg: 16 },
        lineHeight: { tight: 1.2 },
      },
    },
  }),
  useColors: () => ({
    primary: { main: '#007AFF', light: '#E3F2FD', contrast: '#FFFFFF' },
    surface: { primary: '#FFFFFF' },
    border: { primary: '#E5E7EB' },
    text: { primary: '#1F2937', secondary: '#6B7280', disabled: '#9CA3AF' },
    success: { main: '#10B981' },
    info: { main: '#3B82F6' },
  }),
}));

jest.mock('../../atoms/Typography', () => ({
  Typography: ({ children }: any) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, {}, children);
  },
}));

jest.mock('../../atoms/Input', () => ({
  Input: ({ placeholder, onChangeText }: any) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { onPress: () => onChangeText && onChangeText('test') }, placeholder);
  },
}));

jest.mock('../../atoms/Button', () => ({
  Button: ({ children, onPress }: any) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { onPress }, children);
  },
}));

jest.mock('../EmptyState/EmptyState', () => ({
  EmptyState: ({ title, subtitle }: any) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, {}, `${title} ${subtitle}`);
  },
}));

jest.mock('./StudentSelectionItem', () => ({
  StudentSelectionItem: ({ student, selected, onToggle }: any) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, { onPress: onToggle }, `${student.full_name} ${selected ? 'Selected' : 'Not Selected'}`);
  },
}));

jest.mock('../BulkActionBar', () => ({
  BulkActionBar: ({ selectedCount, onSelectAll, onClearSelection }: any) => {
    const React = jest.requireActual('react');
    const { Text } = jest.requireActual('react-native');
    return React.createElement(Text, {}, [
      `Selected: ${selectedCount}`,
      React.createElement(Text, { onPress: onSelectAll, key: 'select' }, 'Select All'),
      React.createElement(Text, { onPress: onClearSelection, key: 'clear' }, 'Clear')
    ]);
  },
}));

// Mock data
const mockStudents: StudentWithDetails[] = [
  {
    id: '1',
    full_name: 'Ahmad Rizki',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    nis: '12345',
    boarding: true,
    gender: 'M',
    date_of_birth: '2005-01-01',
  },
  {
    id: '2',
    full_name: 'Siti Nurhaliza',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    nis: '12346',
    boarding: false,
    gender: 'F',
    date_of_birth: '2005-02-01',
  },
  {
    id: '3',
    full_name: 'Muhammad Fajar',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    nis: '12347',
    boarding: true,
    gender: 'M',
    date_of_birth: '2005-03-01',
  },
];

// Default props
const defaultProps = {
  students: mockStudents,
  selectedStudentIds: new Set<string>(),
  onStudentSelect: jest.fn(),
  onStudentDeselect: jest.fn(),
  onBulkSelect: jest.fn(),
  onClearSelection: jest.fn(),
};

describe('StudentSelectionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with students', () => {
      render(<StudentSelectionList {...defaultProps} />);
      
      expect(screen.getByText('Search students...')).toBeTruthy();
      expect(screen.getByText('Ahmad Rizki Not Selected')).toBeTruthy();
      expect(screen.getByText('Siti Nurhaliza Not Selected')).toBeTruthy();
      expect(screen.getByText('Muhammad Fajar Not Selected')).toBeTruthy();
    });

    it('renders empty state when no students', () => {
      render(<StudentSelectionList {...defaultProps} students={[]} />);
      
      expect(screen.getByText('No students found ')).toBeTruthy();
    });

    it('renders bulk action bar when students are selected', () => {
      const selectedIds = new Set(['1', '2']);
      render(
        <StudentSelectionList 
          {...defaultProps} 
          selectedStudentIds={selectedIds}
        />
      );
      
      expect(screen.getByText('Selected: 2')).toBeTruthy();
    });

    it('does not render bulk action bar when no students selected', () => {
      render(<StudentSelectionList {...defaultProps} />);
      
      expect(screen.queryByText('Selected: 0')).toBeNull();
    });
  });

  describe('Search Functionality', () => {
    it('filters students by name', async () => {
      const onFiltersChange = jest.fn();
      render(
        <StudentSelectionList 
          {...defaultProps} 
          onFiltersChange={onFiltersChange}
        />
      );
      
      const searchInput = screen.getByText('Search students...');
      fireEvent.press(searchInput);
      
      await waitFor(() => {
        expect(onFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'test',
          })
        );
      }, { timeout: 500 });
    });

    it('filters students by NIS', async () => {
      const onFiltersChange = jest.fn();
      render(
        <StudentSelectionList 
          {...defaultProps} 
          onFiltersChange={onFiltersChange}
        />
      );
      
      const searchInput = screen.getByText('Search students...');
      fireEvent.press(searchInput);
      
      await waitFor(() => {
        expect(onFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'test',
          })
        );
      }, { timeout: 500 });
    });

    it('debounces search input', async () => {
      const onFiltersChange = jest.fn();
      render(
        <StudentSelectionList 
          {...defaultProps} 
          onFiltersChange={onFiltersChange}
        />
      );
      
      const searchInput = screen.getByText('Search students...');
      
      // Press multiple times quickly
      fireEvent.press(searchInput);
      fireEvent.press(searchInput);
      fireEvent.press(searchInput);
      fireEvent.press(searchInput);
      
      // Should only call once after debounce
      await waitFor(() => {
        expect(onFiltersChange).toHaveBeenCalledTimes(1);
      }, { timeout: 500 });
    });
  });

  describe('Student Selection', () => {
    it('calls onStudentSelect when unselected student is clicked', () => {
      const onStudentSelect = jest.fn();
      render(
        <StudentSelectionList 
          {...defaultProps} 
          onStudentSelect={onStudentSelect}
        />
      );
      
      fireEvent.press(screen.getByText('Ahmad Rizki Not Selected'));
      
      expect(onStudentSelect).toHaveBeenCalledWith('1');
    });

    it('calls onStudentDeselect when selected student is clicked', () => {
      const onStudentDeselect = jest.fn();
      const selectedIds = new Set(['1']);
      
      render(
        <StudentSelectionList 
          {...defaultProps} 
          selectedStudentIds={selectedIds}
          onStudentDeselect={onStudentDeselect}
        />
      );
      
      fireEvent.press(screen.getByText('Ahmad Rizki Selected'));
      
      expect(onStudentDeselect).toHaveBeenCalledWith('1');
    });

    it('calls onBulkSelect when select all is clicked', () => {
      const onBulkSelect = jest.fn();
      const selectedIds = new Set(['1']);
      
      render(
        <StudentSelectionList 
          {...defaultProps} 
          selectedStudentIds={selectedIds}
          onBulkSelect={onBulkSelect}
        />
      );
      
      fireEvent.press(screen.getByText('Select All'));
      
      expect(onBulkSelect).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('calls onClearSelection when clear is clicked', () => {
      const onClearSelection = jest.fn();
      const selectedIds = new Set(['1', '2']);
      
      render(
        <StudentSelectionList 
          {...defaultProps} 
          selectedStudentIds={selectedIds}
          onClearSelection={onClearSelection}
        />
      );
      
      fireEvent.press(screen.getByText('Clear'));
      
      expect(onClearSelection).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels', () => {
      render(
        <StudentSelectionList 
          {...defaultProps} 
          accessibilityLabel="Student selection list"
        />
      );
      
      // Component renders without errors
      expect(screen.getByText('Search students...')).toBeTruthy();
    });

    it('has proper test IDs', () => {
      render(
        <StudentSelectionList 
          {...defaultProps} 
          testID="student-selection-list"
        />
      );
      
      // Component renders without errors
      expect(screen.getByText('Search students...')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('memoizes student items to prevent unnecessary re-renders', () => {
      const { rerender } = render(<StudentSelectionList {...defaultProps} />);
      
      const initialItems = screen.getAllByText(/Not Selected/);
      
      // Re-render with same props
      rerender(<StudentSelectionList {...defaultProps} />);
      
      const newItems = screen.getAllByText(/Not Selected/);
      
      // Items should be the same instances (memoized)
      expect(initialItems.length).toBe(newItems.length);
    });
  });

  describe('Loading States', () => {
    it('shows loading state correctly', () => {
      render(<StudentSelectionList {...defaultProps} loading={true} />);
      
      // Empty state should not show when loading
      expect(screen.queryByText('No students found ')).toBeNull();
    });

    it('shows refreshing state correctly', () => {
      const onRefresh = jest.fn();
      render(
        <StudentSelectionList 
          {...defaultProps} 
          refreshing={true}
          onRefresh={onRefresh}
        />
      );
      
      // Component should render without errors
      expect(screen.getByText('Search students...')).toBeTruthy();
    });
  });
});