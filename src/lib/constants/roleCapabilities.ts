/**
 * Role-Based Access Control (RBAC) Constants
 * 
 * This module defines the comprehensive role capabilities and permissions
 * for the MadraXis school management system. It provides a single source
 * of truth for all role-based access control decisions.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * User roles supported by the system
 */
export type UserRole = 'student' | 'teacher' | 'parent' | 'management';

/**
 * Resource types that can be accessed
 */
export type ResourceType = 
  | 'class'
  | 'student' 
  | 'teacher'
  | 'parent'
  | 'incident'
  | 'subject'
  | 'schedule'
  | 'report'
  | 'dashboard'
  | 'user_management'
  | 'school_setup'
  | 'anti_bullying'
  | 'cctv_request'
  | 'boarding_info'
  | 'quran_progress';

/**
 * Actions that can be performed on resources
 */
export type Action = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | 'assign'
  | 'unassign'
  | 'approve'
  | 'reject'
  | 'export'
  | 'import'
  | 'bulk_update'
  | 'audit';

/**
 * Permission definition
 */
export interface Permission {
  resource: ResourceType;
  actions: Action[];
  conditions?: PermissionCondition[];
  description?: string;
}

/**
 * Permission conditions for fine-grained access control
 */
export interface PermissionCondition {
  type: 'ownership' | 'school_scope' | 'class_assignment' | 'parent_child' | 'custom';
  field?: string;
  value?: any;
  description?: string;
}

/**
 * Role capability definition
 */
export interface RoleCapability {
  role: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
  routes: string[];
  defaultRoute: string;
  setupRequired?: boolean;
}

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

/**
 * Student permissions - Limited to own data and assigned resources
 */
const STUDENT_PERMISSIONS: Permission[] = [
  {
    resource: 'dashboard',
    actions: ['read'],
    description: 'Access student dashboard'
  },
  {
    resource: 'schedule',
    actions: ['read'],
    conditions: [{ type: 'ownership', field: 'student_id', description: 'Own schedule only' }],
    description: 'View own class schedule'
  },
  {
    resource: 'quran_progress',
    actions: ['read', 'update'],
    conditions: [{ type: 'ownership', field: 'student_id', description: 'Own progress only' }],
    description: 'View and update own Quran progress'
  },
  {
    resource: 'boarding_info',
    actions: ['read'],
    conditions: [{ type: 'ownership', field: 'student_id', description: 'Own boarding info only' }],
    description: 'View own boarding information'
  },
  {
    resource: 'incident',
    actions: ['create', 'read'],
    conditions: [{ type: 'ownership', field: 'student_id', description: 'Own incidents only' }],
    description: 'Report and view own incidents'
  },
  {
    resource: 'anti_bullying',
    actions: ['read'],
    description: 'Access anti-bullying resources'
  }
];

/**
 * Teacher permissions - Access to assigned classes and students
 */
const TEACHER_PERMISSIONS: Permission[] = [
  {
    resource: 'dashboard',
    actions: ['read'],
    description: 'Access teacher dashboard'
  },
  {
    resource: 'class',
    actions: ['read', 'update', 'list'],
    conditions: [{ type: 'class_assignment', description: 'Assigned classes only' }],
    description: 'Manage assigned classes'
  },
  {
    resource: 'student',
    actions: ['read', 'list', 'assign', 'unassign'],
    conditions: [{ 
      type: 'class_assignment', 
      description: 'Students in assigned classes only' 
    }],
    description: 'Manage students in assigned classes'
  },
  {
    resource: 'subject',
    actions: ['create', 'read', 'update', 'delete', 'list'],
    conditions: [{ type: 'ownership', field: 'teacher_id', description: 'Own subjects only' }],
    description: 'Manage own subjects'
  },
  {
    resource: 'schedule',
    actions: ['create', 'read', 'update', 'delete', 'list'],
    conditions: [{ type: 'class_assignment', description: 'Assigned classes only' }],
    description: 'Manage schedules for assigned classes'
  },
  {
    resource: 'report',
    actions: ['create', 'read', 'export'],
    conditions: [{ type: 'class_assignment', description: 'Assigned classes only' }],
    description: 'Generate reports for assigned classes'
  },
  {
    resource: 'incident',
    actions: ['create', 'read', 'update'],
    conditions: [{ 
      type: 'class_assignment', 
      description: 'Students in assigned classes only' 
    }],
    description: 'Manage incidents for assigned students'
  }
];

/**
 * Parent permissions - Access to own children's data
 */
const PARENT_PERMISSIONS: Permission[] = [
  {
    resource: 'dashboard',
    actions: ['read'],
    description: 'Access parent dashboard'
  },
  {
    resource: 'student',
    actions: ['read'],
    conditions: [{ type: 'parent_child', description: 'Own children only' }],
    description: 'View own children information'
  },
  {
    resource: 'schedule',
    actions: ['read'],
    conditions: [{ type: 'parent_child', description: 'Own children only' }],
    description: 'View children class schedules'
  },
  {
    resource: 'incident',
    actions: ['create', 'read'],
    conditions: [{ type: 'parent_child', description: 'Own children only' }],
    description: 'Report and view incidents involving own children'
  },
  {
    resource: 'anti_bullying',
    actions: ['read'],
    description: 'Access anti-bullying resources'
  },
  {
    resource: 'cctv_request',
    actions: ['create', 'read'],
    conditions: [{ type: 'parent_child', description: 'Own children only' }],
    description: 'Request CCTV access for own children'
  },
  {
    resource: 'report',
    actions: ['read'],
    conditions: [{ type: 'parent_child', description: 'Own children only' }],
    description: 'View reports for own children'
  }
];

/**
 * Management permissions - Full system access with school scope
 */
const MANAGEMENT_PERMISSIONS: Permission[] = [
  {
    resource: 'dashboard',
    actions: ['read'],
    description: 'Access management dashboard'
  },
  {
    resource: 'school_setup',
    actions: ['create', 'read', 'update'],
    description: 'Configure school settings'
  },
  {
    resource: 'user_management',
    actions: ['create', 'read', 'update', 'delete', 'list', 'bulk_update'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all users in school'
  },
  {
    resource: 'class',
    actions: ['create', 'read', 'update', 'delete', 'list', 'assign', 'bulk_update'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all classes in school'
  },
  {
    resource: 'student',
    actions: ['create', 'read', 'update', 'delete', 'list', 'assign', 'unassign', 'bulk_update'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all students in school'
  },
  {
    resource: 'teacher',
    actions: ['create', 'read', 'update', 'delete', 'list', 'assign', 'unassign', 'bulk_update'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all teachers in school'
  },
  {
    resource: 'parent',
    actions: ['create', 'read', 'update', 'delete', 'list', 'bulk_update'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all parents in school'
  },
  {
    resource: 'subject',
    actions: ['create', 'read', 'update', 'delete', 'list', 'bulk_update'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all subjects in school'
  },
  {
    resource: 'schedule',
    actions: ['create', 'read', 'update', 'delete', 'list', 'bulk_update'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all schedules in school'
  },
  {
    resource: 'incident',
    actions: ['create', 'read', 'update', 'delete', 'list', 'approve', 'reject', 'audit'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage all incidents in school'
  },
  {
    resource: 'report',
    actions: ['create', 'read', 'export', 'audit'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Generate and audit all school reports'
  },
  {
    resource: 'cctv_request',
    actions: ['read', 'approve', 'reject', 'list'],
    conditions: [{ type: 'school_scope', description: 'Same school only' }],
    description: 'Manage CCTV access requests'
  }
];

// ============================================================================
// ROLE CAPABILITIES
// ============================================================================

/**
 * Complete role capability definitions
 */
export const ROLE_CAPABILITIES: Record<UserRole, RoleCapability> = {
  student: {
    role: 'student',
    displayName: 'Siswa',
    description: 'Student with access to own academic data and resources',
    permissions: STUDENT_PERMISSIONS,
    routes: [
      '/(student)/dashboard',
      '/(student)/schedule',
      '/(student)/quran-progress',
      '/(student)/boarding-info',
      '/(student)/incident-report',
      '/(student)/anti-bullying'
    ],
    defaultRoute: '/(student)/dashboard'
  },

  teacher: {
    role: 'teacher',
    displayName: 'Guru',
    description: 'Teacher with access to assigned classes and students',
    permissions: TEACHER_PERMISSIONS,
    routes: [
      '/(teacher)/dashboard',
      '/(teacher)/class',
      '/(teacher)/class/[id]',
      '/(teacher)/class/[id]/add-students',
      '/(teacher)/class/[id]/students',
      '/(teacher)/class/[id]/schedule',
      '/(teacher)/class/[id]/reports',
      '/(teacher)/students',
      '/(teacher)/students/[id]',
      '/(teacher)/students/add'
    ],
    defaultRoute: '/(teacher)/dashboard'
  },

  parent: {
    role: 'parent',
    displayName: 'Orang Tua',
    description: 'Parent with access to own children data and school communication',
    permissions: PARENT_PERMISSIONS,
    routes: [
      '/(parent)/dashboard',
      '/(parent)/anti-bullying',
      '/(parent)/cctv-request',
      '/(parent)/incident-report'
    ],
    defaultRoute: '/(parent)/dashboard'
  },

  management: {
    role: 'management',
    displayName: 'Manajemen',
    description: 'School management with full system access',
    permissions: MANAGEMENT_PERMISSIONS,
    routes: [
      '/(management)/dashboard',
      '/(management)/setup',
      '/(management)/user-management'
    ],
    defaultRoute: '/(management)/dashboard',
    setupRequired: true
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a user role has permission to perform an action on a resource
 */
export function hasPermission(
  role: UserRole,
  resource: ResourceType,
  action: Action
): boolean {
  const roleCapability = ROLE_CAPABILITIES[role];
  if (!roleCapability) return false;

  const permission = roleCapability.permissions.find(p => p.resource === resource);
  if (!permission) return false;

  return permission.actions.includes(action);
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  const roleCapability = ROLE_CAPABILITIES[role];
  return roleCapability?.permissions || [];
}

/**
 * Get allowed routes for a specific role
 */
export function getAllowedRoutes(role: UserRole): string[] {
  const roleCapability = ROLE_CAPABILITIES[role];
  return roleCapability?.routes || [];
}

/**
 * Get default route for a specific role
 */
export function getDefaultRoute(role: UserRole, schoolId?: string | number): string {
  const roleCapability = ROLE_CAPABILITIES[role];
  if (!roleCapability) return '/(auth)/login';

  // Special handling for management role
  if (role === 'management') {
    return schoolId ? '/(management)/dashboard' : '/(management)/setup';
  }

  return roleCapability.defaultRoute;
}

/**
 * Check if a route is allowed for a specific role
 */
export function isRouteAllowed(role: UserRole, route: string): boolean {
  const allowedRoutes = getAllowedRoutes(role);

  // Check exact match first
  if (allowedRoutes.includes(route)) return true;

  // Check dynamic route patterns
  return allowedRoutes.some(allowedRoute => {
    // Convert route pattern to regex (e.g., /class/[id] -> /class/\d+)
    const pattern = allowedRoute
      .replace(/\[id\]/g, '\\d+')
      .replace(/\[.*?\]/g, '[^/]+')
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${pattern}$`);
    return regex.test(route);
  });
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleCapability = ROLE_CAPABILITIES[role];
  return roleCapability?.displayName || role;
}

/**
 * Check if role requires setup
 */
export function requiresSetup(role: UserRole): boolean {
  const roleCapability = ROLE_CAPABILITIES[role];
  return roleCapability?.setupRequired || false;
}

/**
 * Get all available user roles
 */
export function getAllRoles(): UserRole[] {
  return Object.keys(ROLE_CAPABILITIES) as UserRole[];
}

/**
 * Get role capabilities for display purposes
 */
export function getRoleCapability(role: UserRole): RoleCapability | null {
  return ROLE_CAPABILITIES[role] || null;
}

// ============================================================================
// CONSTANTS FOR EASY ACCESS
// ============================================================================

/**
 * Supported user roles
 */
export const SUPPORTED_ROLES: readonly UserRole[] = ['student', 'teacher', 'parent', 'management'] as const;

/**
 * Role display names mapping
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  student: 'Siswa',
  teacher: 'Guru',
  parent: 'Orang Tua',
  management: 'Manajemen'
} as const;

/**
 * Default routes by role
 */
export const DEFAULT_ROUTES: Record<UserRole, string> = {
  student: '/(student)/dashboard',
  teacher: '/(teacher)/dashboard',
  parent: '/(parent)/dashboard',
  management: '/(management)/dashboard'
} as const;
