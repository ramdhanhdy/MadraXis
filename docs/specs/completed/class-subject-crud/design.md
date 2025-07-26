# Design Document: Class & Subject CRUD Operations

## Overview

This document outlines the architectural design and implementation approach for the Class & Subject CRUD (Create, Read, Update, Delete) operations within the MadraXis teacher portal. The feature enables teachers to efficiently manage their class assignments and subject configurations while maintaining data integrity and system performance.

## System Architecture

### Current System Context

The MadraXis platform currently has:
- **Database**: Supabase PostgreSQL with existing tables: `classes`, `class_schedules`, `class_students`, `class_teachers`
- **Frontend**: React Native with Expo Router
- **Authentication**: Supabase Auth with role-based access control
- **UI Framework**: Custom component library with templates (DashboardTemplate, FormTemplate, ClassesListTemplate)

### Proposed Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │  Service Layer  │    │  Database Layer │
│                 │    │                 │    │                 │
│ ClassesList     │◄──►│ ClassService    │◄──►│ Supabase DB     │
│ ClassForm       │    │ SubjectService  │    │ - classes       │
│ ClassDetail     │    │ ValidationSvc   │    │ - class_schedules│
│ BulkOperations  │    │ AuditService    │    │ - class_teachers │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Components and Features

### 1. Enhanced Database Schema

#### New Tables
```sql
-- Subject management
CREATE TABLE class_subjects (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id),
  subject_name VARCHAR(100) NOT NULL,
  subject_code VARCHAR(20),
  grading_scale ENUM('points', 'percentage', 'standards') DEFAULT 'percentage',
  standards_alignment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit trail
CREATE TABLE class_audit_log (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id),
  action ENUM('create', 'update', 'delete', 'restore'),
  changed_fields JSONB,
  old_values JSONB,
  new_values JSONB,
  performed_by UUID REFERENCES profiles(id),
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Enhanced Existing Tables
```sql
-- Add new columns to classes table
ALTER TABLE classes ADD COLUMN (
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  deleted_at TIMESTAMP NULL,
  student_capacity INTEGER DEFAULT 30,
  academic_year VARCHAR(10),
  semester ENUM('1', '2') DEFAULT '1'
);

-- Add role column to class_teachers
ALTER TABLE class_teachers ADD COLUMN (
  role ENUM('primary', 'assistant', 'co-teacher') DEFAULT 'primary',
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Service Layer Architecture

#### ClassService
```typescript
class ClassService {
  // CRUD Operations
  async createClass(classData: CreateClassRequest): Promise<Class>
  async getTeacherClasses(teacherId: string): Promise<Class[]>
  async getClassById(classId: number): Promise<Class>
  async updateClass(classId: number, updates: UpdateClassRequest): Promise<Class>
  async deleteClass(classId: number, teacherId: string): Promise<void>
  async restoreClass(classId: number, teacherId: string): Promise<Class>
  
  // Bulk Operations
  async bulkCreateClasses(classes: CreateClassRequest[]): Promise<Class[]>
  async bulkUpdateClasses(updates: BulkUpdateRequest[]): Promise<Class[]>
  async bulkDeleteClasses(classIds: number[], teacherId: string): Promise<void>
  
  // Validation
  async validateScheduleConflicts(schedule: ClassSchedule): Promise<ConflictResult>
  async validateClassCapacity(classId: number, capacity: number): Promise<boolean>
}
```

#### SubjectService
```typescript
class SubjectService {
  async addSubjectToClass(classId: number, subject: SubjectData): Promise<ClassSubject>
  async updateClassSubject(subjectId: number, updates: SubjectUpdate): Promise<ClassSubject>
  async removeSubjectFromClass(subjectId: number): Promise<void>
  async getClassSubjects(classId: number): Promise<ClassSubject[]>
  async getAvailableSubjects(): Promise<Subject[]>
}
```

### 3. UI Component Architecture

#### Enhanced ClassesListTemplate
```typescript
interface ClassesListProps {
  onClassSelect: (classId: number) => void;
  onAddClass: () => void;
  onBulkAction: (action: BulkAction, classIds: number[]) => void;
  searchEnabled?: boolean;
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
}
```

#### New Components
- **ClassFormModal**: Create/Edit class form with validation
- **SubjectManager**: Manage subjects within a class
- **BulkActionBar**: Handle multiple class operations
- **ClassDetailView**: Comprehensive class information display
- **ScheduleConflictDialog**: Handle scheduling conflicts

## Design Decisions

### 1. Soft Delete Implementation
**Decision**: Implement soft delete using `deleted_at` timestamp
**Rationale**: 
- Preserve historical data for reporting
- Allow data recovery
- Maintain referential integrity
- Support audit requirements

### 2. Audit Trail Strategy
**Decision**: Comprehensive audit logging with JSONB storage
**Rationale**:
- Track all changes for compliance
- Support rollback functionality
- Enable detailed reporting
- Flexible schema for different change types

### 3. Validation Approach
**Decision**: Multi-layer validation (client + server + database)
**Rationale**:
- Immediate user feedback (client-side)
- Security and data integrity (server-side)
- Constraint enforcement (database-level)

### 4. Permission Model
**Decision**: Role-based access with teacher ownership
**Rationale**:
- Teachers can only manage their assigned classes
- Administrators have override capabilities
- Clear ownership and responsibility
- Scalable permission structure

## Integration Points

### 1. Existing Systems
- **Student Management**: Class-student relationships
- **Attendance System**: Class roster integration
- **Grading System**: Subject-grade associations
- **Schedule Management**: Timetable coordination

### 2. External Dependencies
- **Supabase**: Database operations and real-time updates
- **Expo Router**: Navigation and deep linking
- **React Query**: Data fetching and caching
- **Zod**: Schema validation

## Performance Considerations

### 1. Database Optimization
- **Indexing Strategy**:
  ```sql
  CREATE INDEX idx_classes_teacher_status ON classes(created_by, status);
  CREATE INDEX idx_class_schedules_class_day ON class_schedules(class_id, day_of_week);
  CREATE INDEX idx_class_audit_class_date ON class_audit_log(class_id, performed_at);
  ```

### 2. Caching Strategy
- Cache teacher's class list with 5-minute TTL
- Invalidate cache on CRUD operations
- Use optimistic updates for better UX

### 3. Pagination and Filtering
- Server-side pagination for large class lists
- Debounced search with minimum 3 characters
- Efficient filtering using database queries

## Security Architecture

### 1. Row Level Security (RLS)
```sql
-- Teachers can only access their assigned classes
CREATE POLICY teacher_class_access ON classes
  FOR ALL TO authenticated
  USING (
    id IN (
      SELECT class_id FROM class_teachers 
      WHERE user_id = auth.uid()
    )
  );
```

### 2. API Security
- JWT token validation
- Rate limiting (100 requests/minute per user)
- Input sanitization and validation
- SQL injection prevention

### 3. Data Protection
- Encrypt sensitive data at rest
- Audit all data access
- Implement data retention policies
- GDPR compliance measures

## Scalability Considerations

### 1. Database Scaling
- Horizontal partitioning by school_id
- Read replicas for reporting queries
- Connection pooling optimization

### 2. Application Scaling
- Stateless service design
- Microservice architecture readiness
- CDN for static assets
- Load balancing capabilities

### 3. Performance Monitoring
- Database query performance tracking
- API response time monitoring
- User interaction analytics
- Error rate monitoring

## Error Handling Strategy

### 1. Client-Side Error Handling
```typescript
interface ErrorState {
  type: 'validation' | 'network' | 'server' | 'permission';
  message: string;
  field?: string;
  recoverable: boolean;
}
```

### 2. Server-Side Error Responses
```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
}
```

### 3. Graceful Degradation
- Offline capability for viewing classes
- Retry mechanisms for failed operations
- Fallback UI states
- Progressive enhancement

## Testing Strategy

### 1. Unit Testing
- Service layer functions
- Validation logic
- Utility functions
- Component logic

### 2. Integration Testing
- API endpoint testing
- Database operations
- Authentication flows
- Permission validation

### 3. E2E Testing
- Complete CRUD workflows
- Bulk operations
- Error scenarios
- Mobile responsiveness

## Deployment Considerations

### 1. Database Migrations
- Versioned migration scripts
- Rollback procedures
- Data migration validation
- Zero-downtime deployment

### 2. Feature Flags
- Gradual rollout capability
- A/B testing support
- Emergency disable switches
- User segment targeting

### 3. Monitoring and Alerting
- Performance metrics
- Error rate thresholds
- User adoption tracking
- System health checks

## Future Enhancements

### 1. Advanced Features
- AI-powered schedule optimization
- Predictive analytics for class performance
- Integration with external LMS systems
- Advanced reporting and analytics

### 2. Mobile Optimization
- Offline-first architecture
- Push notifications
- Biometric authentication
- Voice commands

### 3. Collaboration Features
- Real-time collaborative editing
- Comment and annotation system
- Approval workflows
- Team management tools

---

*This design document serves as the architectural foundation for implementing robust and scalable Class & Subject CRUD operations that align with the MadraXis platform's technical standards and user experience goals.*