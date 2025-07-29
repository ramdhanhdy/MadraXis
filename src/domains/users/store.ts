import { create } from 'zustand';
import { Student, Teacher, Profile, UserWithDetails, UserCounts } from './types';

interface UserState {
  // Current selected user
  selectedUser: UserWithDetails | null;
  setSelectedUser: (user: UserWithDetails | null) => void;

  // Students
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (studentId: string, updates: Partial<Student>) => void;
  removeStudent: (studentId: string) => void;

  // Teachers
  teachers: Teacher[];
  setTeachers: (teachers: Teacher[]) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacherId: string, updates: Partial<Teacher>) => void;
  removeTeacher: (teacherId: string) => void;

  // Search results
  searchResults: UserWithDetails[];
  setSearchResults: (results: UserWithDetails[]) => void;
  clearSearchResults: () => void;

  // User counts
  userCounts: UserCounts | null;
  setUserCounts: (counts: UserCounts) => void;

  // Selected users for bulk operations
  selectedUserIds: string[];
  setSelectedUserIds: (userIds: string[]) => void;
  toggleUserSelection: (userId: string) => void;
  clearSelectedUsers: () => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Filters and search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: 'all' | 'student' | 'teacher' | 'parent' | 'management';
  setRoleFilter: (role: 'all' | 'student' | 'teacher' | 'parent' | 'management') => void;
  genderFilter: 'all' | 'male' | 'female';
  setGenderFilter: (gender: 'all' | 'male' | 'female') => void;
  boardingFilter: 'all' | 'day' | 'boarding';
  setBoardingFilter: (boarding: 'all' | 'day' | 'boarding') => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
  setTotalItems: (items: number) => void;

  // Reset functions
  resetUserState: () => void;
  resetFilters: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Current selected user
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Students
  students: [],
  setStudents: (students) => set({ students }),
  addStudent: (student) => set((state) => ({ 
    students: [...state.students, student] 
  })),
  updateStudent: (studentId, updates) => set((state) => ({
    students: state.students.map(student => 
      student.id === studentId ? { ...student, ...updates } : student
    ),
    selectedUser: state.selectedUser?.id === studentId 
      ? { ...state.selectedUser, ...updates }
      : state.selectedUser
  })),
  removeStudent: (studentId) => set((state) => ({
    students: state.students.filter(student => student.id !== studentId),
    selectedUser: state.selectedUser?.id === studentId ? null : state.selectedUser,
    selectedUserIds: state.selectedUserIds.filter(id => id !== studentId)
  })),

  // Teachers
  teachers: [],
  setTeachers: (teachers) => set({ teachers }),
  addTeacher: (teacher) => set((state) => ({ 
    teachers: [...state.teachers, teacher] 
  })),
  updateTeacher: (teacherId, updates) => set((state) => ({
    teachers: state.teachers.map(teacher => 
      teacher.id === teacherId ? { ...teacher, ...updates } : teacher
    ),
    selectedUser: state.selectedUser?.id === teacherId 
      ? { ...state.selectedUser, ...updates }
      : state.selectedUser
  })),
  removeTeacher: (teacherId) => set((state) => ({
    teachers: state.teachers.filter(teacher => teacher.id !== teacherId),
    selectedUser: state.selectedUser?.id === teacherId ? null : state.selectedUser,
    selectedUserIds: state.selectedUserIds.filter(id => id !== teacherId)
  })),

  // Search results
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  clearSearchResults: () => set({ searchResults: [] }),

  // User counts
  userCounts: null,
  setUserCounts: (counts) => set({ userCounts: counts }),

  // Selected users for bulk operations
  selectedUserIds: [],
  setSelectedUserIds: (userIds) => set({ selectedUserIds: userIds }),
  toggleUserSelection: (userId) => set((state) => ({
    selectedUserIds: state.selectedUserIds.includes(userId)
      ? state.selectedUserIds.filter(id => id !== userId)
      : [...state.selectedUserIds, userId]
  })),
  clearSelectedUsers: () => set({ selectedUserIds: [] }),

  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),

  // Filters and search
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  roleFilter: 'all',
  setRoleFilter: (role) => set({ roleFilter: role }),
  genderFilter: 'all',
  setGenderFilter: (gender) => set({ genderFilter: gender }),
  boardingFilter: 'all',
  setBoardingFilter: (boarding) => set({ boardingFilter: boarding }),

  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  totalPages: 1,
  setTotalPages: (pages) => set({ totalPages: pages }),
  itemsPerPage: 10,
  setItemsPerPage: (items) => set({ itemsPerPage: items }),
  totalItems: 0,
  setTotalItems: (items) => set({ totalItems: items }),

  // Reset functions
  resetUserState: () => set({
    selectedUser: null,
    students: [],
    teachers: [],
    searchResults: [],
    selectedUserIds: [],
    searchTerm: '',
    roleFilter: 'all',
    genderFilter: 'all',
    boardingFilter: 'all',
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    error: null
  }),
  resetFilters: () => set({
    searchTerm: '',
    roleFilter: 'all',
    genderFilter: 'all',
    boardingFilter: 'all',
    currentPage: 1
  })
}));

// Selectors for computed values
export const useUserSelectors = () => {
  const store = useUserStore();
  
  return {
    // Filtered students based on current filters
    filteredStudents: store.students.filter(student => {
      const matchesSearch = !store.searchTerm || 
        student.full_name.toLowerCase().includes(store.searchTerm.toLowerCase());
      const matchesGender = store.genderFilter === 'all' || 
        student.details?.gender === store.genderFilter;
      const matchesBoarding = store.boardingFilter === 'all' || 
        student.details?.boarding === store.boardingFilter;
      return matchesSearch && matchesGender && matchesBoarding;
    }),

    // Filtered teachers based on current filters
    filteredTeachers: store.teachers.filter(teacher => {
      const matchesSearch = !store.searchTerm || 
        teacher.full_name.toLowerCase().includes(store.searchTerm.toLowerCase());
      return matchesSearch;
    }),

    // Selected users count
    selectedUsersCount: store.selectedUserIds.length,

    // Has selected user
    hasSelectedUser: !!store.selectedUser,

    // Is any user selected for bulk operations
    hasSelectedUsers: store.selectedUserIds.length > 0,

    // Current user type counts
    currentCounts: {
      students: store.students.length,
      teachers: store.teachers.length,
      searchResults: store.searchResults.length
    },

    // Pagination info
    paginationInfo: {
      currentPage: store.currentPage,
      totalPages: store.totalPages,
      itemsPerPage: store.itemsPerPage,
      totalItems: store.totalItems,
      hasNextPage: store.currentPage < store.totalPages,
      hasPrevPage: store.currentPage > 1
    }
  };
};

// Actions for common operations
export const useUserActions = () => {
  const store = useUserStore();

  return {
    // Select all visible students
    selectAllStudents: () => {
      const studentIds = store.students.map(s => s.id);
      store.setSelectedUserIds(studentIds);
    },

    // Select all visible teachers
    selectAllTeachers: () => {
      const teacherIds = store.teachers.map(t => t.id);
      store.setSelectedUserIds(teacherIds);
    },

    // Select all search results
    selectAllSearchResults: () => {
      const resultIds = store.searchResults.map(r => r.id);
      store.setSelectedUserIds(resultIds);
    },

    // Clear all selections and reset to first page
    resetFiltersAndPagination: () => {
      store.resetFilters();
      store.clearSelectedUsers();
    },

    // Update pagination based on search results
    updatePaginationFromResults: (total: number, page: number, limit: number) => {
      const totalPages = Math.ceil(total / limit);
      store.setTotalItems(total);
      store.setCurrentPage(page);
      store.setTotalPages(totalPages);
      store.setItemsPerPage(limit);
    }
  };
};
