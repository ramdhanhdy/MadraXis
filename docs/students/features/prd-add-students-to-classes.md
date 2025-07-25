# Product Requirements Document: Adding Students to Classes by Teachers

## Executive Summary

This PRD defines the feature that enables teachers to add existing students to their assigned classes within the MadraXis platform. The feature integrates with the existing class management system and provides teachers with an intuitive interface to manage class enrollment.

## Current System Analysis

### Existing Database Schema
The current Supabase schema supports the required functionality:
- `classes` table: Contains class information with grade level (SMA/SMP) classification
- `profiles` table: User profiles with role-based access (students, teachers) and grade level information
- `class_students` table: Junction table for many-to-many student-class relationships
- `class_teachers` table: Links teachers to their assigned classes
- Row Level Security (RLS) policies for secure data access

### Existing UI Components
1. **ClassesListTemplate**: Displays teacher's classes with student counts and quick actions
2. **ClassStudentsTemplate**: Shows students within a specific class with add button
3. **StudentsListTemplate**: Lists all students with search and filter capabilities
4. **AddStudentTemplate**: Form for creating new students (currently creates new students, not adding existing ones)

### Current Services
1. **ClassService**: Handles class CRUD operations with teacher permission validation
2. **Users Service**: Manages student and teacher data fetching
3. **Supabase Integration**: Real-time database operations with authentication

## Feature Requirements

### Core User Stories

**As a teacher, I want to:**
1. **Add Existing Students**: "Add students who are already registered in the system to my classes"
2. **Search Students**: "Search and filter available students to find the ones I need to add"
3. **Bulk Add Students**: "Select multiple students and add them to a class at once"
4. **Manage Class Roster**: "Easily manage my class roster as students transfer between classes or grade levels"
5. **Remove Students**: "Remove students from my classes when they transfer or drop out or finished the class"

### Functional Requirements

#### 1. Student Selection Interface
- **Available Students List**: Display students not currently enrolled in the selected class
- **Search Functionality**: Real-time search by student name or student ID
- **Filter Options**: Filter by grade level (SMA/SMP), boarding status, or dormitory
- **Multi-Selection**: Checkbox interface for bulk operations
- **Student Information**: Show relevant details (name, grade level, boarding status, current classes)

#### 2. Add Students Flow
- **Class Context**: Initiated from class detail view or class students list
- **Grade Level Filtering**: Show only students from appropriate grade levels (SMA/SMP)
- **Duplicate Prevention**: Prevent adding students already enrolled in the class
- **Confirmation Dialog**: Show summary before executing bulk additions
- **Success Feedback**: Clear confirmation of successful additions

#### 3. Remove Students Flow
- **Remove Option**: Swipe-to-delete or long-press menu on student items
- **Confirmation Dialog**: Prevent accidental removals
- **Audit Trail**: Log removal actions for accountability

### Technical Implementation

#### 1. Database Operations
```sql
-- Add student to class
INSERT INTO class_students (class_id, student_id, enrolled_at)
VALUES (?, ?, NOW());

-- Remove student from class
DELETE FROM class_students 
WHERE class_id = ? AND student_id = ?;

-- Get current class enrollment count
SELECT 
  COUNT(cs.student_id) as current_count
FROM class_students cs
WHERE cs.class_id = ?;
```

#### 2. Service Layer Enhancement
```typescript
// Extend ClassService with student management
export class ClassService {
  static async addStudentsToClass(
    classId: number, 
    studentIds: string[], 
    teacherId: string
  ): Promise<void> {
    // Verify teacher permissions
    // Validate student availability and grade level compatibility
    // Insert into class_students
    // Update audit log
  }

  static async removeStudentFromClass(
    classId: number, 
    studentId: string, 
    teacherId: string
  ): Promise<void> {
    // Verify teacher permissions
    // Remove from class_students
    // Update audit log
  }

  static async getAvailableStudents(
    classId: number, 
    schoolId: number,
    gradeLevel?: 'SMA' | 'SMP'
  ): Promise<Student[]> {
    // Get students not in the specified class
    // Filter by school and grade level (SMA/SMP)
    // Return with relevant details including boarding status
  }
}
```

#### 3. UI Component Architecture

**New Components:**
- `AddStudentsToClassModal`: Main interface for student selection
- `StudentSelectionList`: Searchable, filterable student list with multi-select
- `StudentSelectionItem`: Individual student card with selection checkbox
- `BulkActionBar`: Shows selected count and action buttons

**Enhanced Components:**
- `ClassStudentsTemplate`: Add "Add Students" button and remove functionality
- `ClassesListTemplate`: Update student count display after additions/removals

#### 4. Navigation Flow
```
Classes List → Class Detail → Class Students → Add Students Modal
                                            → Student Selection
                                            → Confirmation
                                            → Success/Back to Class Students
```

### Security & Permissions

#### Row Level Security Policies
```sql
-- Teachers can add students to their classes
CREATE POLICY "Teachers can manage class students" 
ON class_students FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM class_teachers ct 
    WHERE ct.class_id = class_students.class_id 
    AND ct.user_id = auth.uid()
  )
);

-- Teachers can view students in their school
CREATE POLICY "Teachers can view school students" 
ON profiles FOR SELECT TO authenticated 
USING (
  role = 'student' AND 
  school_id IN (
    SELECT school_id FROM profiles 
    WHERE id = auth.uid()
  )
);
```

### User Experience Design

#### 1. Add Students Flow
1. **Entry Point**: "Add Students" button in ClassStudentsTemplate
2. **Modal Interface**: Full-screen modal with search and filter
3. **Grade Level Filter**: Automatic filtering by appropriate grade level (SMA/SMP)
4. **Selection Interface**: Checkbox-based multi-select with visual feedback
5. **Confirmation**: Summary of students to be added with grade level verification
6. **Success State**: Toast notification and updated student list

#### 2. Remove Students Flow
1. **Entry Point**: Swipe action or long-press menu on student item
2. **Confirmation**: Alert dialog with student name
3. **Success State**: Student removed from list with undo option

### Error Handling

#### Common Error Scenarios
- **Grade Level Mismatch**: Clear message when trying to add SMA student to SMP class or vice versa
- **Network Issues**: Offline queue with sync when connection restored
- **Permission Denied**: Redirect to login or show access denied message
- **Student Already Enrolled**: Filter out or show warning message
- **Database Conflicts**: Retry mechanism with exponential backoff

### Performance Considerations

#### Optimization Strategies
- **Lazy Loading**: Load student list on demand
- **Search Debouncing**: Delay search queries to reduce API calls
- **Caching**: Cache student lists with TTL
- **Pagination**: Load students in batches for large schools
- **Real-time Updates**: Use Supabase subscriptions for live updates

### Testing Strategy

#### Unit Tests
- Service layer functions (add/remove students)
- Validation logic (capacity, permissions)
- Error handling scenarios

#### Integration Tests
- Database operations with RLS policies
- API endpoints with authentication
- Real-time subscription updates

#### E2E Tests
- Complete add students flow
- Remove students flow
- Error scenarios (capacity, permissions)
- Multi-device synchronization

### Success Metrics

#### Operational Metrics
- **Add Success Rate**: >99% successful student additions
- **Response Time**: <2 seconds for student list loading
- **Error Rate**: <1% of operations result in errors
- **User Satisfaction**: 4.5+ rating for ease of use
- **Grade Level Accuracy**: 100% prevention of cross-grade enrollments

#### Usage Metrics
- **Feature Adoption**: 90%+ of teachers use student management weekly
- **Bulk Operations**: 60%+ of additions use multi-select
- **Search Usage**: 70%+ of sessions include search functionality
- **Grade Level Filtering**: 95%+ accuracy in grade-appropriate student suggestions

### Future Enhancements

#### Phase 2 Features
- **Student Import**: Bulk import from CSV/Excel files with grade level validation
- **Dormitory Integration**: Assign students based on boarding house arrangements
- **Automatic Enrollment**: Rules-based student assignment by grade level and curriculum track
- **Parent Notifications**: Automatic alerts for enrollment changes via WhatsApp/SMS
- **Analytics Dashboard**: Class composition, boarding vs day student ratios, and grade distribution

#### Advanced Features
- **Mobile Offline Mode**: Full functionality without internet for remote boarding school areas
- **Advanced Reporting**:  Grade progression tracking