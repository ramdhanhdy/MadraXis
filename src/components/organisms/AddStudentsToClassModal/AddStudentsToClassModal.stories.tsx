/**
 * AddStudentsToClassModal Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { AddStudentsToClassModal } from './AddStudentsToClassModal';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ClassService } from '../../../services/classService';

// Mock ClassService for stories
jest.mock('../../../services/classService');
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: 'teacher@test.com',
      role: 'teacher',
    },
  }),
}));

const mockClassService = ClassService as jest.Mocked<typeof ClassService>;

// Mock data - matching AvailableStudent interface
const mockStudents = [
  {
    id: '1',
    full_name: 'John Doe',
    nis: '12345',
    gender: 'male',
    boarding: true,
    date_of_birth: '2008-05-15',
  },
  {
    id: '2',
    full_name: 'Jane Smith',
    nis: '12346',
    gender: 'female',
    boarding: false,
    date_of_birth: '2008-03-22',
  },
  {
    id: '3',
    full_name: 'Bob Johnson',
    nis: '12347',
    gender: 'male',
    boarding: true,
    date_of_birth: '2007-11-08',
  },
  {
    id: '4',
    full_name: 'Alice Brown',
    nis: '12348',
    gender: 'female',
    boarding: false,
    date_of_birth: '2009-01-30',
  },
  {
    id: '5',
    full_name: 'Charlie Wilson',
    nis: '12349',
    gender: 'male',
    boarding: true,
    date_of_birth: '2008-07-12',
  },
];

// Story wrapper
const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {children}
    </View>
  </ThemeProvider>
);

const meta: Meta<typeof AddStudentsToClassModal> = {
  title: 'Organisms/AddStudentsToClassModal',
  component: AddStudentsToClassModal,
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'A modal component for adding students to a class with search, filtering, and selection capabilities.',
      },
    },
  },
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    classId: {
      control: 'number',
      description: 'ID of the class to add students to',
    },
    onClose: {
      action: 'onClose',
      description: 'Callback when modal is closed',
    },
    onStudentsAdded: {
      action: 'onStudentsAdded',
      description: 'Callback when students are successfully added',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with students loaded
export const Default: Story = {
  args: {
    visible: true,
    classId: 1,
    onClose: () => console.log('Modal closed'),
    onStudentsAdded: () => console.log('Students added'),
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockResolvedValue({
      students: mockStudents,
      total: mockStudents.length,
      page: 1,
      limit: 20,
    });
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockImplementation(
      () => new Promise(() => {}) // Never resolves to show loading state
    );
  },
};

// Empty state (no students available)
export const EmptyState: Story = {
  args: {
    ...Default.args,
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockResolvedValue({
      students: [],
      total: 0,
      page: 1,
      limit: 20,
    });
  },
};

// Error state
export const ErrorState: Story = {
  args: {
    ...Default.args,
  },
  beforeEach: () => {
    mockClassService.getAvailableStudents.mockRejectedValue(
      new Error('Failed to load students')
    );
  },
};

// Large dataset with pagination
export const LargeDataset: Story = {
  args: {
    ...Default.args,
  },
  beforeEach: () => {
    const largeStudentList = Array.from({ length: 50 }, (_, index) => ({
      id: `${index + 1}`,
      full_name: `Student ${index + 1}`,
      nis: `${10000 + index}`,
      gender: index % 2 === 0 ? 'male' : 'female',
      boarding: index % 2 === 0,
      date_of_birth: `200${8 + (index % 4)}-0${(index % 12) + 1}-15`,
    }));

    mockClassService.getAvailableStudents.mockResolvedValue({
      students: largeStudentList.slice(0, 20), // First page
      total: largeStudentList.length,
      page: 1,
      limit: 20,
    });
  },
};

// Modal closed (not visible)
export const Closed: Story = {
  args: {
    ...Default.args,
    visible: false,
  },
};

// With search results
export const WithSearchResults: Story = {
  args: {
    ...Default.args,
  },
  beforeEach: () => {
    // Simulate search results for "John"
    const searchResults = mockStudents.filter(student => 
      student.full_name.toLowerCase().includes('john')
    );
    
    mockClassService.getAvailableStudents.mockResolvedValue({
      students: searchResults,
      total: searchResults.length,
      page: 1,
      limit: 20,
    });
  },
};

// Different class types
export const ElementaryClass: Story = {
  args: {
    ...Default.args,
    classId: 2,
  },
  beforeEach: () => {
    const elementaryStudents = [
      {
        id: '10',
        full_name: 'Emma Davis',
        nis: '50001',
        gender: 'female',
        boarding: false,
        date_of_birth: '2013-04-10',
      },
      {
        id: '11',
        full_name: 'Liam Miller',
        nis: '50002',
        gender: 'male',
        boarding: true,
        date_of_birth: '2013-08-22',
      },
    ];

    mockClassService.getAvailableStudents.mockResolvedValue({
      students: elementaryStudents,
      total: elementaryStudents.length,
      page: 1,
      limit: 20,
    });
  },
};

export const HighSchoolClass: Story = {
  args: {
    ...Default.args,
    classId: 3,
  },
  beforeEach: () => {
    const highSchoolStudents = [
      {
        id: '20',
        full_name: 'Sophia Anderson',
        nis: '60001',
        gender: 'female',
        boarding: true,
        date_of_birth: '2006-12-05',
      },
      {
        id: '21',
        full_name: 'Mason Taylor',
        nis: '60002',
        gender: 'male',
        boarding: false,
        date_of_birth: '2006-09-18',
      },
    ];

    mockClassService.getAvailableStudents.mockResolvedValue({
      students: highSchoolStudents,
      total: highSchoolStudents.length,
      page: 1,
      limit: 20,
    });
  },
};

// Interactive story for testing user interactions
export const Interactive: Story = {
  args: {
    ...Default.args,
  },
  beforeEach: () => {
    // Set up realistic mock responses for interactive testing
    mockClassService.getAvailableStudents.mockImplementation(async (classId, userId, filters, pagination) => {
      // Simulate search functionality
      let filteredStudents = mockStudents;
      
      if (filters?.search) {
        filteredStudents = mockStudents.filter(student =>
          student.full_name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          student.nis.includes(filters.search!)
        );
      }

      // Simulate gender filter
      if (filters?.gender) {
        filteredStudents = filteredStudents.filter(student =>
          student.gender === filters.gender
        );
      }

      // Simulate boarding status filter
      if (filters?.boarding !== undefined) {
        filteredStudents = filteredStudents.filter(student =>
          student.boarding === filters.boarding
        );
      }

      // Simulate pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const offset = (page - 1) * limit;
      const paginatedStudents = filteredStudents.slice(offset, offset + limit);

      return {
        students: paginatedStudents,
        total: filteredStudents.length,
        page,
        limit,
      };
    });

    mockClassService.addStudentsToClass.mockImplementation(async (classId, studentIds, userId) => {
      // Simulate successful addition
      console.log(`Added ${studentIds.length} students to class ${classId}`);
      return Promise.resolve({
        success: studentIds,
        errors: [],
      });
    });
  },
};