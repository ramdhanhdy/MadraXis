/**
 * StudentSelectionList Storybook Stories
 * 
 * Interactive documentation and testing for the StudentSelectionList component.
 * Demonstrates various states, configurations, and use cases.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StudentSelectionList, StudentFilters } from './StudentSelectionList';
import { StudentWithDetails } from '../../../types';

// Mock student data
const mockStudents: StudentWithDetails[] = [
  {
    id: '1',
    full_name: 'Ahmad Rizki Pratama',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    nis: '2024001',
    boarding: true,
    gender: 'M',
    date_of_birth: '2005-03-15',
  },
  {
    id: '2',
    full_name: 'Siti Nurhaliza Putri',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    nis: '2024002',
    boarding: false,
    gender: 'F',
    date_of_birth: '2005-07-22',
  },
  {
    id: '3',
    full_name: 'Muhammad Fajar Sidiq',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    nis: '2024003',
    boarding: true,
    gender: 'M',
    date_of_birth: '2005-11-08',
  },
  {
    id: '4',
    full_name: 'Fatimah Az-Zahra',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    nis: '2024004',
    boarding: false,
    gender: 'F',
    date_of_birth: '2005-12-03',
  },
  {
    id: '5',
    full_name: 'Abdullah Rahman',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    nis: '2024005',
    boarding: true,
    gender: 'M',
    date_of_birth: '2005-04-18',
  },
  {
    id: '6',
    full_name: 'Khadijah Aminah',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    nis: '2024006',
    boarding: false,
    gender: 'F',
    date_of_birth: '2005-09-12',
  },
];

// Story metadata
const meta: Meta<typeof StudentSelectionList> = {
  title: 'Components/Molecules/StudentSelectionList',
  component: StudentSelectionList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A comprehensive student selection interface that allows teachers to browse, search, filter, and select students for class enrollment.

## Features
- Real-time search by name or NIS
- Grade level and boarding status filtering
- Multi-selection with checkboxes
- Bulk actions (select all, clear selection)
- Performance optimizations with virtualization
- Responsive design for phone and tablet

## Usage
This component is primarily used in the "Add Students to Class" modal where teachers can select multiple students to enroll in their classes.
        `,
      },
    },
  },
  argTypes: {
    students: {
      description: 'Array of available students for selection',
      control: { type: 'object' },
    },
    selectedStudentIds: {
      description: 'Set of currently selected student IDs',
      control: { type: 'object' },
    },
    loading: {
      description: 'Whether the component is in loading state',
      control: { type: 'boolean' },
    },
    refreshing: {
      description: 'Whether the component is refreshing data',
      control: { type: 'boolean' },
    },
    hasMore: {
      description: 'Whether there are more students to load',
      control: { type: 'boolean' },
    },
    classLevel: {
      description: 'Default grade level filter based on class',
      control: { type: 'select' },
      options: ['SMA', 'SMP'],
    },
    showFilters: {
      description: 'Whether to show filter controls',
      control: { type: 'boolean' },
    },
    enableVirtualization: {
      description: 'Whether to enable virtual scrolling for performance',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StudentSelectionList>;

// Interactive wrapper component
const InteractiveWrapper = (args: any) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<StudentFilters>({});
  const [refreshing, setRefreshing] = useState(false);

  const handleStudentSelect = (studentId: string) => {
    setSelectedIds(prev => new Set([...prev, studentId]));
  };

  const handleStudentDeselect = (studentId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
  };

  const handleBulkSelect = (studentIds: string[]) => {
    setSelectedIds(new Set(studentIds));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <View style={{ flex: 1, height: 600 }}>
      <StudentSelectionList
        {...args}
        selectedStudentIds={selectedIds}
        onStudentSelect={handleStudentSelect}
        onStudentDeselect={handleStudentDeselect}
        onBulkSelect={handleBulkSelect}
        onClearSelection={handleClearSelection}
        onRefresh={handleRefresh}
        onFiltersChange={setFilters}
        refreshing={refreshing}
        filters={filters}
      />
    </View>
  );
};

// Default story
export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    students: mockStudents,
    loading: false,
    hasMore: false,
    showFilters: true,
    enableVirtualization: true,
  },
};

// Empty state story
export const EmptyState: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    students: [],
    loading: false,
    hasMore: false,
    showFilters: true,
    enableVirtualization: true,
  },
};

// Loading state story
export const LoadingState: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    students: [],
    loading: true,
    hasMore: false,
    showFilters: true,
    enableVirtualization: true,
  },
};

// With selections story
const WithSelectionsComponent = (args: any) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1', '3', '5']));
  const [filters, setFilters] = useState<StudentFilters>({});

    const handleStudentSelect = (studentId: string) => {
      setSelectedIds(prev => new Set([...prev, studentId]));
    };

    const handleStudentDeselect = (studentId: string) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    };

    const handleBulkSelect = (studentIds: string[]) => {
      setSelectedIds(new Set(studentIds));
    };

    const handleClearSelection = () => {
      setSelectedIds(new Set());
    };

    return (
      <View style={{ flex: 1, height: 600 }}>
        <StudentSelectionList
          {...args}
          selectedStudentIds={selectedIds}
          onStudentSelect={handleStudentSelect}
          onStudentDeselect={handleStudentDeselect}
          onBulkSelect={handleBulkSelect}
          onClearSelection={handleClearSelection}
          onFiltersChange={setFilters}
          filters={filters}
        />
      </View>
    );
};

export const WithSelections: Story = {
  render: (args) => <WithSelectionsComponent {...args} />,
  args: {
    students: mockStudents,
    loading: false,
    hasMore: false,
    showFilters: true,
    enableVirtualization: true,
  },
};

// SMA class filter story
export const SMAClassFilter: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    students: mockStudents,
    classLevel: 'SMA',
    loading: false,
    hasMore: false,
    showFilters: true,
    enableVirtualization: true,
  },
};

// Without filters story
export const WithoutFilters: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    students: mockStudents,
    loading: false,
    hasMore: false,
    showFilters: false,
    enableVirtualization: true,
  },
};

// Large dataset story (simulated)
export const LargeDataset: Story = {
  render: (args) => {
    // Generate more students for testing performance
    const largeStudentList = Array.from({ length: 100 }, (_, index) => ({
      id: `student-${index + 1}`,
      full_name: `Student ${index + 1}`,
      role: 'student' as const,
      school_id: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      nis: `2024${String(index + 1).padStart(3, '0')}`,
      boarding: index % 2 === 0,
      gender: index % 2 === 0 ? 'M' : 'F' as 'M' | 'F',
      date_of_birth: '2005-01-01',
    }));

    return <InteractiveWrapper {...args} students={largeStudentList} />;
  },
  args: {
    loading: false,
    hasMore: true,
    showFilters: true,
    enableVirtualization: true,
  },
};

// Mobile responsive story
export const MobileView: Story = {
  render: (args) => (
    <View style={{ width: 375, height: 600, backgroundColor: '#f5f5f5' }}>
      <InteractiveWrapper {...args} />
    </View>
  ),
  args: {
    students: mockStudents,
    loading: false,
    hasMore: false,
    showFilters: true,
    enableVirtualization: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};