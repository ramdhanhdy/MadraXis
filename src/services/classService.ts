// Re-export everything from the new modular class service
export {
  ClassService,
  CreateClassRequest,
  UpdateClassRequest,
  BulkUpdateRequest,
  ClassWithDetails,
  ClassServiceError
} from './class';

// Maintain backward compatibility by providing the old interface
import { ClassService } from './class';

// Legacy exports for backward compatibility
export const createClass = ClassService.createClass;
export const getTeacherClasses = ClassService.getClasses;
export const getClassById = ClassService.getClassById;
export const updateClass = ClassService.updateClass;
export const deleteClass = ClassService.deleteClass;
export const restoreClass = ClassService.restoreClass;
export const addStudentsToClass = ClassService.enrollStudent;
export const removeStudentFromClass = ClassService.removeStudent;
export const getAvailableStudents = ClassService.getAvailableStudents;
export const bulkCreateClasses = ClassService.bulkUpdateClasses; // Note: no bulkCreateClasses exists
export const bulkUpdateClasses = ClassService.bulkUpdateClasses;
export const bulkDeleteClasses = ClassService.bulkDeleteClasses;
export const validateTeacherAccess = ClassService.validateTeacherAccess;
export const checkDuplicateClassName = ClassService.checkDuplicateClassName;

// Default export for backward compatibility
export default ClassService;