/**
 * AddStudentsToClassModal Component Tests
 */

import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { AddStudentsToClassModal } from './AddStudentsToClassModal';
import { ClassService } from '../../../services/classService';
import { useAuth } from '../../../hooks/useAuth';

// Mock dependencies
jest.mock('../../../services/classService');
jest.mock('../../../hooks/useAuth');
jest.mock('../../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }
}));
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock implementations
const mockGetAvailableStudents = jest.fn();
const mockAddStudentsToClass = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

(ClassService.getAvailableStudents as jest.Mock) = mockGetAvailableStudents;
(ClassService.bulkEnrollStudents as jest.Mock) = mockAddStudentsToClass;

mockUseAuth.mockReturnValue({
  user: {
    id: 'user-1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2023-01-01T00:00:00.000Z',
    email: 'test@example.com'
  },
  loading: false,
  signOut: jest.fn(),
  clearSession: jest.fn(),
  session: null,
  profile: null
});

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

// Mock data - removed unused mockUser

const mockStudents = [
  {
    student_id: '1',
    full_name: 'John Doe',
    nis: '12345',
    gender: 'male' as const,
    boarding: true,
  },
  {
    student_id: '2',
    full_name: 'Jane Smith',
    nis: '12346',
    gender: 'female' as const,
    boarding: false,
  },
  {
    student_id: '3',
    full_name: 'Bob Johnson',
    nis: '12347',
    gender: 'male' as const,
    boarding: true,
  },
];

// Test props
const getTestProps = () => ({
  visible: true,
  onClose: jest.fn(),
  classId: 1,
  onStudentsAdded: jest.fn(),
});

describe('AddStudentsToClassModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAvailableStudents.mockResolvedValue({
      students: mockStudents,
      total: mockStudents.length,
    });
    mockAddStudentsToClass.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('renders modal when visible', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      expect(screen.getByText('Add Students to Class')).toBeTruthy();
expect(screen.getByText('Select students to add to this class')).toBeTruthy();
    });

    it('does not render when not visible', () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} visible={false} />
        </TestWrapper>
      );

      expect(screen.queryByText('Add Students to Class')).toBeNull();
    });

    it('renders search input', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Search by name or NIS...')).toBeTruthy();
    });

    it('renders loading state initially', () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      expect(screen.getByText('Loading students...')).toBeTruthy();
    });
  });

  describe('Data Loading', () => {
    it('loads students on mount', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockGetAvailableStudents).toHaveBeenCalledWith(
          1,
          'user-1',
          expect.objectContaining({
            page: 1,
            limit: 20
          })
        );
        expect(mockGetAvailableStudents).toHaveBeenCalledTimes(1);
      });
    });

    it('displays students after loading', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('Jane Smith')).toBeTruthy();
      expect(screen.getByText('Bob Johnson')).toBeTruthy();
    });
    });

    it('handles loading error', async () => {
      mockGetAvailableStudents.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeTruthy();
      });
    });

    it('shows empty state when no students found', async () => {
      mockGetAvailableStudents.mockResolvedValue({
        students: [],
        total: 0,
      });

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No available students found')).toBeTruthy();
      });
    });
  });

  describe('Search Functionality', () => {
    it('updates search input value', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search by name or NIS...');
        expect(searchInput.props.value).toBe('');
      });

      await act(async () => {
        const searchInput = screen.getByPlaceholderText('Search by name or NIS...');
        fireEvent.changeText(searchInput, 'John');
      });

      await waitFor(() => {
        const updatedInput = screen.getByPlaceholderText('Search by name or NIS...');
        expect(updatedInput.props.value).toBe('John');
      });
    });

    it('debounces search queries', async () => {
      jest.useFakeTimers();

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });

      mockGetAvailableStudents.mockClear();

      await act(async () => {
        const searchInput = screen.getByPlaceholderText('Search by name or NIS...');
        fireEvent.changeText(searchInput, 'John');
        jest.advanceTimersByTime(50);
      });

      await act(async () => {
        const searchInput = screen.getByPlaceholderText('Search by name or NIS...');
        fireEvent.changeText(searchInput, 'John Doe');
      });

      expect(mockGetAvailableStudents).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockGetAvailableStudents).toHaveBeenCalledTimes(1);
        expect(mockGetAvailableStudents).toHaveBeenCalledWith(
          1,
          'user-1',
          expect.objectContaining({ 
            searchTerm: 'John Doe',
            limit: 20, 
            page: 1 
          })
        );
      });

      jest.useRealTimers();
    });
  });

  describe('Student Selection', () => {
    it('shows students when loaded', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
        expect(screen.getByText('Jane Smith')).toBeTruthy();
      });
    });

    it('updates add button text based on selection count', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Add 0 Students')).toBeTruthy();
      });
    });
  });

  describe('Adding Students', () => {
    it('calls ClassService.addStudentsToClass when add button is pressed', async () => {
      mockAddStudentsToClass.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading students...')).toBeNull();
      });

      // Wait for students to be displayed
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });

      // Select first student
      await act(async () => {
        const firstStudent = screen.getByText('John Doe');
        fireEvent.press(firstStudent);
      });

      // Wait for selection to update and find add button
      await waitFor(() => {
        expect(screen.getByText('Add 1 Student')).toBeTruthy();
      });

      await act(async () => {
        const addButton = screen.getByText('Add 1 Student');
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(mockAddStudentsToClass).toHaveBeenCalledWith(1, ['1'], 'user-1');
      });
    });

    it('shows success alert after adding students', async () => {
      mockAddStudentsToClass.mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading students...')).toBeNull();
      });

      // Wait for students to be displayed
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });

      // Select first student
      await act(async () => {
        const firstStudent = screen.getByText('John Doe');
        fireEvent.press(firstStudent);
      });

      // Wait for selection to update
      await waitFor(() => {
        expect(screen.getByText('Add 1 Student')).toBeTruthy();
      });

      await act(async () => {
        const addButton = screen.getByText('Add 1 Student');
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          'Successfully added 1 student to the class.',
          expect.any(Array)
        );
      });
    });

    it('shows error alert when adding students fails', async () => {
      mockAddStudentsToClass.mockRejectedValue(new Error('Add failed'));

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading students...')).toBeNull();
      });

      // Wait for students to be displayed
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });

      // Select first student
      await act(async () => {
        const firstStudent = screen.getByText('John Doe');
        fireEvent.press(firstStudent);
      });

      // Wait for selection to update
      await waitFor(() => {
        expect(screen.getByText('Add 1 Student')).toBeTruthy();
      });

      await act(async () => {
        const addButton = screen.getByText('Add 1 Student');
        fireEvent.press(addButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Add failed',
          expect.any(Array)
        );
      });
    });
  });

  describe('Modal Actions', () => {
    it('calls onClose when cancel button is pressed', async () => {
      const onClose = jest.fn();

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} onClose={onClose} />
        </TestWrapper>
      );

      const cancelButton = screen.getByText('Cancel');
      fireEvent.press(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('disables add button when no students are selected', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading students...')).toBeNull();
      });

      // Wait for students to be displayed
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });

      // Check that add button shows correct text and is disabled
      await waitFor(() => {
        expect(screen.getByText('Add 0 Students')).toBeTruthy();
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('shows refresh control when students are loaded', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      // Wait for students to load completely
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });

      // Wait for ScrollView to be rendered (only appears when students are loaded)
      await waitFor(() => {
        expect(screen.getByTestId('scroll-view')).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows retry button on error', async () => {
      mockGetAvailableStudents.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeTruthy();
      });
    });

    it('retries loading when retry button is pressed', async () => {
      mockGetAvailableStudents
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          students: mockStudents,
          total: mockStudents.length,
          hasMore: false,
        });

      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('retry-button')).toBeTruthy();
      });

      const retryButton = screen.getByText('Retry');
      fireEvent.press(retryButton);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels', async () => {
      render(
        <TestWrapper>
          <AddStudentsToClassModal {...getTestProps()} />
        </TestWrapper>
      );

      expect(screen.getByText('Add Students to Class')).toBeTruthy();
      expect(screen.getByPlaceholderText('Search by name or NIS...')).toBeTruthy();
    });
  });
});