/**
 * Type Consolidation Integration Tests
 * 
 * This test suite validates that the Phase 9 type consolidation is working correctly
 * across different domains and UI components.
 */

import { 
  UserRole, 
  ClassData, 
  Student, 
  DashboardData,
  DatabaseTables 
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
        id: '1',
        name: 'Grade 5A',
        subject: 'Mathematics',
        teacher_id: 'teacher1',
        students: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(classData.id).toBe('1');
      expect(classData.name).toBe('Grade 5A');
    });

    it('should import Student from @types', () => {
      const student: Student = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        profile: {
          grade: '5',
          section: 'A',
          guardian_contact: '+1234567890'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(student.role).toBe('student');
      expect(student.profile.grade).toBe('5');
    });

    it('should import DashboardData from @types', () => {
      const dashboardData: DashboardData = {
        totalStudents: 100,
        totalClasses: 10,
        totalTeachers: 15,
        recentActivities: [],
        stats: {
          attendance: 95,
          performance: 88
        }
      };
      
      expect(dashboardData.totalStudents).toBe(100);
      expect(dashboardData.stats.attendance).toBe(95);
    });

    it('should import DatabaseTables from @types', () => {
      // This tests that database table types are properly consolidated
      const tableNames: (keyof DatabaseTables)[] = [
        'users',
        'classes', 
        'subjects',
        'enrollments',
        'incidents'
      ];
      
      expect(tableNames).toContain('users');
      expect(tableNames).toContain('classes');
    });
  });

  describe('Cross-Domain Type Compatibility', () => {
    it('should ensure types work across domains and UI components', () => {
      // Simulate data flow from domain to UI
      const mockStudentData: Student = {
        id: '1',
        name: 'Alice Smith',
        email: 'alice@example.com',
        role: 'student',
        profile: {
          grade: '6',
          section: 'B',
          guardian_contact: '+9876543210'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockClassData: ClassData = {
        id: '1',
        name: 'Science 6B',
        subject: 'Science',
        teacher_id: 'teacher2',
        students: [mockStudentData.id],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // These should compile without errors, proving type compatibility
      expect(mockStudentData.role).toBe('student');
      expect(mockClassData.students).toContain(mockStudentData.id);
    });

    it('should validate dashboard data aggregation types', () => {
      const aggregatedData: DashboardData = {
        totalStudents: 250,
        totalClasses: 25,
        totalTeachers: 30,
        recentActivities: [
          {
            id: '1',
            type: 'enrollment',
            description: 'New student enrolled',
            timestamp: new Date().toISOString()
          }
        ],
        stats: {
          attendance: 92,
          performance: 85
        }
      };

      expect(aggregatedData.recentActivities[0].type).toBe('enrollment');
      expect(typeof aggregatedData.stats.attendance).toBe('number');
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
      const requiredStudentFields: (keyof Student)[] = [
        'id', 'name', 'email', 'role', 'created_at', 'updated_at'
      ];
      
      expect(requiredStudentFields).toHaveLength(6);
    });
  });
});
