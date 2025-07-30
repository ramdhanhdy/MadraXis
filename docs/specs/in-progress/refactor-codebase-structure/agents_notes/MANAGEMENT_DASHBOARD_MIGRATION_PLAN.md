# Management Dashboard Migration Plan

## Overview
This document outlines the plan to complete the migration of management routes to Feature-Sliced Design (FSD) architecture, achieving consistent patterns across all user roles.

## Current State
- ✅ Setup route migrated
- ❌ Dashboard route (complex, needs migration)
- ❌ User Management route (complex, needs migration)

## Migration Requirements

### 1. Management Dashboard Migration (6-8 SP)

#### **Complexity Analysis**
The management dashboard is the most complex dashboard in the system because it includes:

- **Multiple Data Sources**: Dashboard metrics, incidents, students, teachers
- **Real-time Updates**: Live metrics that refresh automatically
- **Complex State Management**: Loading states, error handling, data caching
- **Advanced UI Components**: Custom metrics cards, incident lists, profile management
- **Deep Integration**: User management, incident management, school settings

#### **Files to Create**

```
app/(management)/dashboard/
├── model.ts      # Business logic and state management
├── screen.tsx    # UI component (extracted from current dashboard.tsx)
└── index.ts      # Barrel exports
```

#### **Model.ts Requirements**

**Types to Define:**
```typescript
interface ManagementDashboardState {
  isLoading: boolean;
  error: string | null;
  dashboardMetrics: DashboardMetrics | null;
  incidents: Incident[];
  activeTab: 'dashboard' | 'profile';
  schoolName: string;
  refreshing: boolean;
}

interface DashboardMetrics {
  studentEnrollment: number;
  teacherCount: number;
  incidentSummary: {
    total: number;
    pending: number;
    resolved: number;
  };
  lastUpdated: Date;
}

interface Incident {
  id: string;
  incident_type: string;
  description: string;
  location: string;
  created_at: Date;
  status: 'pending' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
}
```

**Business Logic Functions:**
- `fetchDashboardMetrics()` - Load school metrics
- `fetchRecentIncidents()` - Load recent incidents
- `getIncidentPriorityColor()` - Color coding for incidents
- `getRelativeTime()` - Time formatting
- `refreshDashboardData()` - Refresh all data
- `validateDashboardData()` - Data validation
- `formatMetrics()` - Metrics formatting

**Constants:**
- Quick action configurations
- Tab definitions
- Header actions
- Color schemes
- Error messages

#### **Screen.tsx Requirements**

**Components to Extract:**
- Welcome section with user greeting
- Dashboard metrics cards
- Quick actions grid
- Recent incidents list
- Profile management section
- Loading states and skeletons
- Error handling components

**State Management:**
- Use model functions for data fetching
- Handle loading and error states
- Manage tab switching
- Handle refresh functionality

### 2. User Management Migration (4-6 SP)

#### **Complexity Analysis**
The user management route includes:

- **Dual User Types**: Students and teachers management
- **Search and Filtering**: Real-time search across user types
- **CRUD Operations**: Add, edit, delete users
- **Complex Data Fetching**: Multiple API calls with error handling
- **Modal Management**: Add user modals and forms

#### **Files to Create**

```
app/(management)/user-management/
├── model.ts      # Business logic for user management
├── screen.tsx    # UI component
└── index.ts      # Barrel exports
```

#### **Model.ts Requirements**

**Types to Define:**
```typescript
interface UserManagementState {
  isLoading: boolean;
  error: string | null;
  students: Student[];
  teachers: Teacher[];
  activeTab: 'students' | 'teachers';
  searchTerm: string;
  showAddModal: boolean;
  selectedUser: Student | Teacher | null;
}

interface Student {
  id: string;
  full_name: string;
  details: {
    nis: string;
    gender: 'M' | 'F';
    class_name: string;
  };
  created_at: Date;
}

interface Teacher {
  id: string;
  full_name: string;
  email: string;
  subjects: string[];
  created_at: Date;
}
```

**Business Logic Functions:**
- `fetchStudents()` - Load students by school
- `fetchTeachers()` - Load teachers by school
- `searchUsers()` - Filter users by search term
- `addUser()` - Add new user
- `editUser()` - Edit existing user
- `deleteUser()` - Delete user
- `validateUserData()` - User data validation

### 3. Implementation Steps

#### **Phase 1: Dashboard Model Creation (2-3 SP)**
1. Extract all business logic from current dashboard
2. Create comprehensive TypeScript interfaces
3. Implement data fetching functions
4. Add validation and error handling
5. Create constants and utilities

#### **Phase 2: Dashboard Screen Migration (2-3 SP)**
1. Extract UI components from current dashboard
2. Integrate with new model
3. Maintain all existing functionality
4. Add proper loading states
5. Implement error boundaries

#### **Phase 3: User Management Migration (2-3 SP)**
1. Create user management model
2. Extract UI components
3. Implement search and filtering
4. Add CRUD operations
5. Handle modal management

#### **Phase 4: Integration and Testing (1-2 SP)**
1. Create compatibility wrappers
2. Test all functionality
3. Ensure zero breaking changes
4. Update documentation
5. Verify consistent patterns

### 4. Benefits of Completion

#### **Architectural Consistency**
- All user roles (Student, Teacher, Parent, Management) follow identical FSD patterns
- Predictable code organization across the entire application
- Consistent business logic separation

#### **Maintainability**
- Centralized business logic in model files
- Easier testing and debugging
- Clear separation of concerns
- Reusable components and utilities

#### **Developer Experience**
- Consistent patterns reduce learning curve
- Easier onboarding for new developers
- Predictable file structure
- Better code discoverability

#### **Scalability**
- Easy to add new management features
- Modular architecture supports growth
- Clear extension points
- Reduced coupling between components

### 5. Risk Assessment

#### **Low Risk**
- Well-established patterns from previous migrations
- Comprehensive backward compatibility approach
- Incremental migration strategy

#### **Potential Challenges**
- Complex state management in dashboard
- Multiple data sources coordination
- Real-time data updates
- Modal and form management

#### **Mitigation Strategies**
- Follow established FSD patterns
- Maintain existing functionality exactly
- Comprehensive testing at each step
- Gradual migration with compatibility wrappers

### 6. Success Criteria

#### **Functional Requirements**
- ✅ All existing functionality preserved
- ✅ Zero breaking changes
- ✅ Consistent performance
- ✅ Proper error handling

#### **Architectural Requirements**
- ✅ Consistent FSD structure across all user roles
- ✅ Clean separation of business logic
- ✅ Comprehensive TypeScript coverage
- ✅ Proper barrel exports

#### **Quality Requirements**
- ✅ Zero diagnostic issues
- ✅ Comprehensive documentation
- ✅ Consistent naming conventions
- ✅ Maintainable code structure

## Conclusion

Completing the management dashboard migration would achieve the objective of having consistent patterns across all user roles. The estimated effort is 8-12 story points (1-2 days) and would provide significant long-term benefits for maintainability, scalability, and developer experience.

The migration follows the same proven patterns used successfully in previous phases, minimizing risk while maximizing architectural consistency.
