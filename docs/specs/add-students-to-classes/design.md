# Design Document: Adding Students to Classes by Teachers

## Overview

This feature enables teachers to manage class enrollment by adding existing students to their assigned classes within the MadraXis platform. The implementation leverages the existing database schema and UI components while introducing new interfaces for student selection and management.

## System Architecture

### Database Schema Integration

The feature utilizes the existing Supabase schema:

- **`classes`** table: Contains class information with level field for SMA/SMP classification
- **`profiles`** table: User profiles with role-based access and school association
- **`student_details`** table: Extended student information including NIS, boarding status, and grade details
- **`class_students`** table: Junction table managing many-to-many student-class relationships
- **`class_teachers`** table: Links teachers to their assigned classes for permission validation

### Component Architecture

#### New Components

1. **`AddStudentsToClassModal`**
   - Full-screen modal interface for student selection
   - Integrates search, filtering, and multi-selection capabilities
   - Handles confirmation flow and success feedback

2. **`StudentSelectionList`**
   - Searchable and filterable student list component
   - Supports real-time search by name or NIS
   - Grade level (SMA/SMP) and boarding status filters
   - Pagination for large student datasets

3. **`StudentSelectionItem`**
   - Individual student card with selection checkbox
   - Displays student name, NIS, grade level, and boarding status
   - Visual feedback for selection state

4. **`BulkActionBar`**
   - Shows selected student count
   - Provides bulk action buttons (Add Selected, Clear Selection)
   - Confirmation dialog integration

#### Enhanced Components

1. **`ClassStudentsTemplate`**
   - Add "Add Students" button in header
   - Implement swipe-to-delete for student removal
   - Real-time student count updates

2. **`ClassesListTemplate`**
   - Update student count display after enrollment changes
   - Real-time synchronization with class_students table

### Service Layer Design

#### ClassService Extensions

```typescript
export class ClassService {
  // Add multiple students to a class
  static async addStudentsToClass(
    classId: number,
    studentIds: string[],
    teacherId: string
  ): Promise<{ success: string[], failed: string[] }>

  // Remove student from class
  static async removeStudentFromClass(
    classId: number,
    studentId: string,
    teacherId: string
  ): Promise<void>

  // Get available students for class enrollment
  static async getAvailableStudents(
    classId: number,
    schoolId: number,
    filters: {
      gradeLevel?: 'SMA' | 'SMP';
      boarding?: boolean;
      search?: string;
    }
  ): Promise<Student[]>

  // Validate teacher permissions for class
  static async validateTeacherAccess(
    classId: number,
    teacherId: string
  ): Promise<boolean>
}
```

### Navigation Flow Design

```
Classes List (ClassesListTemplate)
    ↓ (tap class)
Class Detail View
    ↓ (tap "Students" tab)
Class Students (ClassStudentsTemplate)
    ↓ (tap "Add Students" button)
Add Students Modal (AddStudentsToClassModal)
    ↓ (search/filter/select)
Student Selection (StudentSelectionList)
    ↓ (tap "Add Selected")
Confirmation Dialog
    ↓ (confirm)
Success Toast → Back to Class Students
```

## Security Design

### Row Level Security (RLS) Policies

1. **Class Students Management**
   ```sql
   CREATE POLICY "Teachers can manage class students"
   ON class_students FOR ALL TO authenticated
   USING (
     EXISTS (
       SELECT 1 FROM class_teachers ct
       WHERE ct.class_id = class_students.class_id
       AND ct.user_id = auth.uid()
     )
   );
   ```

2. **Student Visibility**
   ```sql
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

### Permission Validation

- Teacher access validation before any class modification
- Grade level compatibility checks (SMA students only in SMA classes)
- School boundary enforcement (teachers can only manage students from their school)

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Student lists loaded on-demand with pagination
2. **Search Debouncing**: 300ms delay for search queries to reduce API calls
3. **Caching**: Student lists cached with 5-minute TTL
4. **Real-time Updates**: Supabase subscriptions for live enrollment changes
5. **Batch Operations**: Bulk student additions processed in single transaction

### Database Optimization

- Composite indexes on `class_students(class_id, student_id)`
- Index on `profiles(school_id, role)` for student filtering
- Index on `student_details(boarding)` for boarding status filters

## Error Handling Design

### Error Categories

1. **Permission Errors**: Teacher not authorized for class
2. **Validation Errors**: Grade level mismatch, duplicate enrollment
3. **Network Errors**: Connection issues, timeout handling
4. **Database Errors**: Constraint violations, transaction failures

### Error Recovery

- Retry mechanism with exponential backoff for network issues
- Offline queue for enrollment actions when connection is lost
- Graceful degradation with cached data when real-time updates fail

## Integration Points

### Existing System Integration

1. **Authentication**: Leverages existing Supabase auth context
2. **Theme System**: Uses existing design tokens and color schemes
3. **Navigation**: Integrates with expo-router navigation structure
4. **State Management**: Utilizes existing React context patterns

### External Dependencies

- Supabase client for database operations
- React Native components for UI
- Expo Router for navigation
- React Hook Form for form validation

## Scalability Considerations

### Large School Support

- Pagination for schools with 1000+ students
- Virtual scrolling for large student lists
- Efficient search with database-level filtering
- Batch processing for bulk operations

### Future Extensibility

- Plugin architecture for custom enrollment rules
- API endpoints for external system integration
- Webhook support for enrollment notifications
- Audit trail system for compliance requirements

## Testing Strategy

### Component Testing

- Unit tests for all new components
- Integration tests for modal workflows
- Accessibility testing for screen readers

### Service Testing

- Unit tests for ClassService methods
- Integration tests with Supabase
- Permission validation testing
- Error scenario testing

### End-to-End Testing

- Complete enrollment workflow testing
- Multi-user concurrent access testing
- Performance testing with large datasets
- Cross-platform compatibility testing