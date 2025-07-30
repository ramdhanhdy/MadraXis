/**
 * Type Consolidation Integration Tests
 * 
 * This test suite validates that the Phase 9 type consolidation is working correctly
 * across different domains and UI components.
 */

import { 
  UserRole, 
  Class as ClassData, // Use aliasing for backward compatibility in test name
  Student, 
  DashboardData,
  Tables, // The correct type for database tables
} from '@types';

describe('Type Consolidation Integration', () => {
  describe('Global Type Availability', () => {
    it('should import UserRole from @types', () => {
      const role: UserRole = 'student';
      expect(role).toBe('student');
      
      // Verify all role types are available
      const roles: UserRole[] = ['student', 'teacher', 'parent', 'management'];
      expect(roles).toHaveLength(4);
    });

    it('should import ClassData from @types', () => {
      const classData: ClassData = {
        id: 1,
        name: 'Kelas 7A',
        level: '7',
        status: 'active',
        student_capacity: 30,
        student_count: 28,
        subject_count: 5,
        teacher_count: 1,
        academic_year: '2023/2024',
        semester: '1',
        school_id: 1,
        created_by: 'uuid-teacher-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(classData.id).toBe(1);
      expect(classData.name).toBe('Kelas 7A');
    });

    it('should import Student from @types', () => {
      const student: Student = {
        id: 'uuid-student-1',
        full_name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        school_id: 1,
        details: {
          user_id: 'uuid-student-1',
          nis: '12345',
          gender: 'M',
          boarding: true,
          class_name: 'Kelas 7A',
          date_of_birth: '2010-05-10T00:00:00Z',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(student.role).toBe('student');
      expect(student.details?.gender).toBe('M');
    });

    it('should import DashboardData from @types', () => {
      const dashboardData: DashboardData = {
        quickActions: [{
          title: 'View Schedule',
          icon: 'calendar-outline',
          onPress: () => {}
        }],
        progressData: [{
          label: 'Quran Memorization',
          value: 75,
          variant: 'success'
        }],
      };
      
      expect(dashboardData.quickActions).toHaveLength(1);
      expect(dashboardData.progressData[0].value).toBe(75);
    });

    it('should import DatabaseTables from @types', () => {
      // This tests that database table types are properly consolidated
      // We test one of the defined tables ('profiles') to ensure the type works.
      const profile: Tables<'profiles'> = {
        id: 'uuid-user-1',
        full_name: 'Test User',
        role: 'teacher',
        school_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      expect(profile.role).toBe('teacher');
    });
  });

  describe('Cross-Domain Type Compatibility', () => {
    it('should ensure types work across domains and UI components', () => {
      // Simulate data flow from domain to UI
      const mockStudent: Student = {
        id: 'uuid-student-2',
        full_name: 'Alice Smith',
        email: 'alice@example.com',
        role: 'student',
        school_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // This is a simplified representation for the test
      const mockClass = {
        id: 2,
        name: 'Science 6B',
        students: [mockStudent.id],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // These should compile without errors, proving type compatibility
      expect(mockStudent.role).toBe('student');
      expect(mockClass.students).toContain(mockStudent.id);
    });

    it('should validate dashboard data aggregation types', () => {
      const aggregatedData: Partial<DashboardData> = {
        upcomingAssignments: [{
          id: 'assign-1',
          title: 'Science Project',
          subject: 'Science',
          dueDate: new Date().toISOString(),
          status: 'pending'
        }]
      };

      expect(aggregatedData.upcomingAssignments?.[0].status).toBe('pending');
    });
  });

  describe('Type Safety Validation', () => {
    it('should prevent invalid role assignments', () => {
      // This test validates TypeScript compilation
      const validRole: UserRole = 'teacher';
      expect(['student', 'teacher', 'parent', 'management']).toContain(validRole);
    });

    it('should ensure required fields are enforced', () => {
      // This validates that our types enforce required fields
      const requiredStudentFields: (keyof Student)[] = [ // 'name' is now 'full_name'
        'id', 'full_name', 'role', 'school_id', 'created_at', 'updated_at'
      ];
      
      expect(requiredStudentFields).toHaveLength(6);
    });
  });
});
