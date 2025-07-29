/**
 * Add Students to Class Feature Store
 * 
 * Local Zustand store for managing the add students to class feature state.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AddStudentsState, Student, AddStudentsFormData } from './model';
import { 
  initialAddStudentsState, 
  validateStudentSelection,
  ADD_STUDENTS_ERRORS 
} from './model';

interface AddStudentsStore extends AddStudentsState {
  // Actions
  setClassId: (classId: number | null) => void;
  setAvailableStudents: (students: Student[]) => void;
  setSelectedStudents: (studentIds: number[]) => void;
  toggleStudentSelection: (studentId: number) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  setHasAccess: (hasAccess: boolean) => void;
  reset: () => void;
  
  // Computed properties
  canSubmit: boolean;
  selectedStudentCount: number;
  
  // Complex actions
  handleSubmit: (onSubmit: (data: AddStudentsFormData) => Promise<void>) => Promise<void>;
}

export const useAddStudentsStore = create<AddStudentsStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialAddStudentsState,
      
      // Computed properties
      get canSubmit() {
        const { selectedStudents, isSubmitting, hasAccess, classId } = get();
        return (
          hasAccess &&
          classId !== null &&
          selectedStudents.length > 0 &&
          !isSubmitting
        );
      },
      
      get selectedStudentCount() {
        return get().selectedStudents.length;
      },
      
      // Actions
      setClassId: (classId: number | null) =>
        set({ classId }, false, 'setClassId'),
      
      setAvailableStudents: (availableStudents: Student[]) =>
        set({ availableStudents }, false, 'setAvailableStudents'),
      
      setSelectedStudents: (selectedStudents: number[]) =>
        set({ selectedStudents, error: null }, false, 'setSelectedStudents'),
      
      toggleStudentSelection: (studentId: number) =>
        set((state) => {
          const isSelected = state.selectedStudents.includes(studentId);
          const selectedStudents = isSelected
            ? state.selectedStudents.filter(id => id !== studentId)
            : [...state.selectedStudents, studentId];
          
          return { selectedStudents, error: null };
        }, false, 'toggleStudentSelection'),
      
      setLoading: (isLoading: boolean) =>
        set({ isLoading }, false, 'setLoading'),
      
      setSubmitting: (isSubmitting: boolean) =>
        set({ isSubmitting }, false, 'setSubmitting'),
      
      setError: (error: string | null) =>
        set({ error }, false, 'setError'),
      
      setHasAccess: (hasAccess: boolean) =>
        set({ hasAccess }, false, 'setHasAccess'),
      
      reset: () =>
        set(initialAddStudentsState, false, 'reset'),
      
      handleSubmit: async (onSubmit: (data: AddStudentsFormData) => Promise<void>) => {
        const { classId, selectedStudents, setSubmitting, setError } = get();
        
        // Validate class ID
        if (!classId) {
          setError(ADD_STUDENTS_ERRORS.INVALID_CLASS_ID);
          return;
        }
        
        // Validate student selection
        const validation = validateStudentSelection(selectedStudents);
        if (!validation.isValid) {
          setError(validation.error || ADD_STUDENTS_ERRORS.NO_STUDENTS_SELECTED);
          return;
        }
        
        try {
          setSubmitting(true);
          setError(null);
          
          await onSubmit({
            classId,
            studentIds: selectedStudents,
          });
          
          // Reset selection after successful submission
          set({ selectedStudents: [] }, false, 'handleSubmit:success');
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : ADD_STUDENTS_ERRORS.SUBMISSION_ERROR;
          setError(errorMessage);
        } finally {
          setSubmitting(false);
        }
      },
    }),
    {
      name: 'add-students-store',
      enabled: __DEV__,
    }
  )
);

// Selector hooks for better performance
export const useAddStudentsClassId = () => useAddStudentsStore((state) => state.classId);
export const useAddStudentsSelection = () => useAddStudentsStore((state) => ({
  selectedStudents: state.selectedStudents,
  selectedStudentCount: state.selectedStudentCount,
}));
export const useAddStudentsLoading = () => useAddStudentsStore((state) => ({
  isLoading: state.isLoading,
  isSubmitting: state.isSubmitting,
}));
export const useAddStudentsValidation = () => useAddStudentsStore((state) => ({
  canSubmit: state.canSubmit,
  error: state.error,
  hasAccess: state.hasAccess,
}));

// Action hooks
export const useAddStudentsActions = () => useAddStudentsStore((state) => ({
  setClassId: state.setClassId,
  setAvailableStudents: state.setAvailableStudents,
  setSelectedStudents: state.setSelectedStudents,
  toggleStudentSelection: state.toggleStudentSelection,
  setLoading: state.setLoading,
  setSubmitting: state.setSubmitting,
  setError: state.setError,
  setHasAccess: state.setHasAccess,
  reset: state.reset,
  handleSubmit: state.handleSubmit,
}));
