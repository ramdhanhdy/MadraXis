import { create } from 'zustand';
import { ClassWithDetails, StudentWithDetails } from './types';

interface ClassState {
  // Current selected class
  selectedClass: ClassWithDetails | null;
  setSelectedClass: (classData: ClassWithDetails | null) => void;

  // Classes list
  classes: ClassWithDetails[];
  setClasses: (classes: ClassWithDetails[]) => void;
  addClass: (classData: ClassWithDetails) => void;
  updateClass: (classId: number, updates: Partial<ClassWithDetails>) => void;
  removeClass: (classId: number) => void;

  // Available students for enrollment
  availableStudents: StudentWithDetails[];
  setAvailableStudents: (students: StudentWithDetails[]) => void;

  // Enrolled students in selected class
  enrolledStudents: StudentWithDetails[];
  setEnrolledStudents: (students: StudentWithDetails[]) => void;
  addEnrolledStudent: (student: StudentWithDetails) => void;
  removeEnrolledStudent: (studentId: string) => void;

  // Selected students for bulk operations
  selectedStudents: string[];
  setSelectedStudents: (studentIds: string[]) => void;
  toggleStudentSelection: (studentId: string) => void;
  clearSelectedStudents: () => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Filters and search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive' | 'archived';
  setStatusFilter: (status: 'all' | 'active' | 'inactive' | 'archived') => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;

  // Reset functions
  resetClassState: () => void;
  resetStudentState: () => void;
}

export const useClassStore = create<ClassState>((set, get) => ({
  // Current selected class
  selectedClass: null,
  setSelectedClass: (classData) => set({ selectedClass: classData }),

  // Classes list
  classes: [],
  setClasses: (classes) => set({ classes }),
  addClass: (classData) => set((state) => ({ 
    classes: [...state.classes, classData] 
  })),
  updateClass: (classId, updates) => set((state) => ({
    classes: state.classes.map(cls => 
      cls.id === classId ? { ...cls, ...updates } : cls
    ),
    selectedClass: state.selectedClass?.id === classId 
      ? { ...state.selectedClass, ...updates }
      : state.selectedClass
  })),
  removeClass: (classId) => set((state) => ({
    classes: state.classes.filter(cls => cls.id !== classId),
    selectedClass: state.selectedClass?.id === classId ? null : state.selectedClass
  })),

  // Available students for enrollment
  availableStudents: [],
  setAvailableStudents: (students) => set({ availableStudents: students }),

  // Enrolled students in selected class
  enrolledStudents: [],
  setEnrolledStudents: (students) => set({ enrolledStudents: students }),
  addEnrolledStudent: (student) => set((state) => ({
    enrolledStudents: [...state.enrolledStudents, student],
    availableStudents: state.availableStudents.filter(s => s.id !== student.id)
  })),
  removeEnrolledStudent: (studentId) => set((state) => {
    const removedStudent = state.enrolledStudents.find(s => s.id === studentId);
    return {
      enrolledStudents: state.enrolledStudents.filter(s => s.id !== studentId),
      availableStudents: removedStudent 
        ? [...state.availableStudents, removedStudent]
        : state.availableStudents
    };
  }),

  // Selected students for bulk operations
  selectedStudents: [],
  setSelectedStudents: (studentIds) => set({ selectedStudents: studentIds }),
  toggleStudentSelection: (studentId) => set((state) => ({
    selectedStudents: state.selectedStudents.includes(studentId)
      ? state.selectedStudents.filter(id => id !== studentId)
      : [...state.selectedStudents, studentId]
  })),
  clearSelectedStudents: () => set({ selectedStudents: [] }),

  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),

  // Filters and search
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  statusFilter: 'all',
  setStatusFilter: (status) => set({ statusFilter: status }),

  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  totalPages: 1,
  setTotalPages: (pages) => set({ totalPages: pages }),
  itemsPerPage: 10,
  setItemsPerPage: (items) => set({ itemsPerPage: items }),

  // Reset functions
  resetClassState: () => set({
    selectedClass: null,
    classes: [],
    searchTerm: '',
    statusFilter: 'all',
    currentPage: 1,
    totalPages: 1,
    error: null
  }),
  resetStudentState: () => set({
    availableStudents: [],
    enrolledStudents: [],
    selectedStudents: [],
    error: null
  })
}));

// Selectors for computed values
export const useClassSelectors = () => {
  const store = useClassStore();
  
  return {
    // Filtered classes based on current filters
    filteredClasses: store.classes.filter(cls => {
      const matchesSearch = !store.searchTerm || 
        cls.name.toLowerCase().includes(store.searchTerm.toLowerCase());
      const matchesStatus = store.statusFilter === 'all' || 
        cls.status === store.statusFilter;
      return matchesSearch && matchesStatus;
    }),

    // Selected students count
    selectedStudentsCount: store.selectedStudents.length,

    // Available students count
    availableStudentsCount: store.availableStudents.length,

    // Enrolled students count
    enrolledStudentsCount: store.enrolledStudents.length,

    // Has selected class
    hasSelectedClass: !!store.selectedClass,

    // Is any student selected
    hasSelectedStudents: store.selectedStudents.length > 0,

    // Current class capacity info
    classCapacityInfo: store.selectedClass ? {
      current: store.selectedClass.student_count,
      capacity: store.selectedClass.student_capacity || 0,
      available: Math.max(0, (store.selectedClass.student_capacity || 0) - store.selectedClass.student_count),
      isAtCapacity: store.selectedClass.student_count >= (store.selectedClass.student_capacity || 0)
    } : null
  };
};

// Actions for common operations
export const useClassActions = () => {
  const store = useClassStore();

  return {
    // Select all available students
    selectAllAvailableStudents: () => {
      const availableIds = store.availableStudents.map(s => s.id);
      store.setSelectedStudents(availableIds);
    },

    // Select all enrolled students
    selectAllEnrolledStudents: () => {
      const enrolledIds = store.enrolledStudents.map(s => s.id);
      store.setSelectedStudents(enrolledIds);
    },

    // Clear all selections and reset to first page
    resetFiltersAndPagination: () => {
      store.setSearchTerm('');
      store.setStatusFilter('all');
      store.setCurrentPage(1);
      store.clearSelectedStudents();
    },

    // Update class student count after enrollment changes
    updateClassStudentCount: (classId: number, newCount: number) => {
      store.updateClass(classId, { student_count: newCount });
    }
  };
};
