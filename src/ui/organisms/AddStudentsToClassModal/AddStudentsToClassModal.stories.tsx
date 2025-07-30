import { logger } from '@lib/utils/logger';
/**
 * AddStudentsToClassModal Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { AddStudentsToClassModal } from './AddStudentsToClassModal';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ClassService } from '@domains/class';

// Mock ClassService for stories
jest.mock('../../../services/classService');
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: 'teacher@test.com',
      role: 'teacher'
    }
  })
}));

const mockClassService = ClassService as jest.Mocked<typeof ClassService>;

// Mock data - matching AvailableStudent interface
const mockStudents = [
{
  student_id: '1',
  full_name: 'John Doe',
  nis: '12345',
  gender: 'male' as const,
  boarding: 'boarding' as const
},
{
  student_id: '2',
  full_name: 'Jane Smith',
  nis: '12346',
  gender: 'female' as const,
  boarding: 'day' as const
},
{
  student_id: '3',
  full_name: 'Bob Johnson',
  nis: '12347',
  gender: 'male' as const,
  boarding: 'boarding' as const
},
{
  student_id: '4',
  full_name: 'Alice Brown',
  nis: '12348',
  gender: 'female' as const,
  boarding: 'day' as const
},
{
  student_id: '5',
  full_name: 'Charlie Wilson',
  nis: '12349',
  gender: 'male' as const,
  boarding: 'boarding' as const
}];


// Story wrapper
const StoryWrapper: React.FC<{children: React.ReactNode;}> = ({ children }) =>
<ThemeProvider>
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {children}
    </View>
  </ThemeProvider>;


const meta: Meta<typeof AddStudentsToClassModal> = {
  title: 'Organisms/AddStudentsToClassModal',
  component: AddStudentsToClassModal,
  decorators: [
  (Story) =>
  <StoryWrapper>
        <Story />
      </StoryWrapper>],


  parameters: {
    docs: {
      description: {
        component: 'A modal component for adding students to a class with search, filtering, and selection capabilities.'
      }
    }
  },
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Controls modal visibility'
    },
    classId: {
      control: 'number',
      description: 'ID of the class to add students to'
    },
    onClose: {
      action: 'onClose',
      description: 'Callback when modal is closed'
    },
    onStudentsAdded: {
      action: 'onStudentsAdded',
      description: 'Callback when students are successfully added'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with students loaded
export const Default: Story = {
  args: {
    visible: true,
    classId: 1,
    onClose: () => logger.debug('Modal closed'),
    onStudentsAdded: () => logger.debug('Students added')
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockResolvedValue({
      students: mockStudents,
      total: mockStudents.length
    });
    mockClassService.bulkEnrollStudents.mockResolvedValue({
      results: [],
      errors: []
    });
  }
};

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockImplementation(
      () => new Promise(() => {}) // Never resolves to show loading state
    );
  }
};

// Empty state (no students available)
export const EmptyState: Story = {
  args: {
    ...Default.args
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockResolvedValue({
      students: [],
      total: 0
    });
  }
};

// Error state
export const ErrorState: Story = {
  args: {
    ...Default.args
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockRejectedValue(
      new Error('Failed to load students')
    );
  }
};

// Large dataset with pagination
export const LargeDataset: Story = {
  args: {
    ...Default.args
  },
  beforeEach: () => {
    const largeStudentList = Array.from({ length: 50 }, (_, index) => ({
      student_id: `${index + 1}`,
      full_name: `Student ${index + 1}`,
      nis: `${10000 + index}`,
      gender: index % 2 === 0 ? 'male' as const : 'female' as const,
      boarding: index % 2 === 0 ? 'boarding' as const : 'day' as const
    }));

    mockClassService.getAvailableStudents.mockResolvedValue({
      students: largeStudentList.slice(0, 20), // First page
      total: largeStudentList.length
    });
  }
};

// Modal closed (not visible)
export const Closed: Story = {
  args: {
    ...Default.args,
    visible: false
  }
};

// With search results
export const WithSearchResults: Story = {
  args: {
    ...Default.args
  },
  beforeEach: () => {
    // Simulate search results for "John"
    const searchResults = mockStudents.filter((student) =>
    student.full_name.toLowerCase().includes('john')
    );

    mockClassService.getAvailableStudents.mockResolvedValue({
      students: searchResults,
      total: searchResults.length
    });
  }
};

// Different class types
export const ElementaryClass: Story = {
  args: {
    ...Default.args,
    classId: 2
  },
  beforeEach: () => {
    const elementaryStudents = [
    {
      student_id: '10',
      full_name: 'Emma Davis',
      nis: '50001',
      gender: 'female' as const,
      boarding: 'day' as const
    },
    {
      student_id: '11',
      full_name: 'Liam Miller',
      nis: '50002',
      gender: 'male' as const,
      boarding: 'boarding' as const
    }];


    mockClassService.getAvailableStudents.mockResolvedValue({
      students: elementaryStudents,
      total: elementaryStudents.length
    });
  }
};

export const HighSchoolClass: Story = {
  args: {
    ...Default.args,
    classId: 3
  },
  beforeEach: () => {
    const highSchoolStudents = [
    {
      student_id: '20',
      full_name: 'Sophia Anderson',
      nis: '60001',
      gender: 'female' as const,
      boarding: 'boarding' as const
    },
    {
      student_id: '21',
      full_name: 'Mason Taylor',
      nis: '60002',
      gender: 'male' as const,
      boarding: 'day' as const
    }];


    mockClassService.getAvailableStudents.mockResolvedValue({
      students: highSchoolStudents,
      total: highSchoolStudents.length
    });
  }
};

// Interactive story for testing user interactions
export const Interactive: Story = {
  args: {
    ...Default.args
  },
  beforeEach: () => {
    // Set up realistic mock responses for interactive testing
    mockClassService.getAvailableStudents.mockImplementation(async (classId, userId, options) => {
      // Simulate search functionality
      let filteredStudents = mockStudents;

      if (options?.searchTerm) {
        filteredStudents = mockStudents.filter((student) =>
        student.full_name.toLowerCase().includes(options.searchTerm!.toLowerCase()) ||
        student.nis.includes(options.searchTerm!)
        );
      }

      // Simulate gender filter
      if (options?.gender) {
        filteredStudents = filteredStudents.filter((student) =>
        student.gender === options.gender
        );
      }

      // Simulate boarding status filter
      if (options?.boarding !== undefined) {
        filteredStudents = filteredStudents.filter((student) =>
        student.boarding === options.boarding
        );
      }

      // Simulate pagination
      const page = options?.page || 1;
      const limit = options?.limit || 20;
      const offset = (page - 1) * limit;
      const paginatedStudents = filteredStudents.slice(offset, offset + limit);

      return {
        students: paginatedStudents,
        total: filteredStudents.length
      };
    });

    mockClassService.bulkEnrollStudents.mockImplementation(async (classId, enrollmentData, userId) => {
      // Simulate successful addition
      logger.debug(`Added ${enrollmentData.student_ids.length} students to class ${classId}`);
      return Promise.resolve({
        results: enrollmentData.student_ids,
        errors: []
      });
    });
  }
};