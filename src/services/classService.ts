// Re-export everything from the new modular class service
import { ClassService } from './class';
export {
  ClassService,
  CreateClassRequest,
  UpdateClassRequest,
  BulkUpdateRequest,
  ClassWithDetails,
  ClassServiceError
} from './class';

// Legacy exports for backward compatibility
export const createClass = ClassService.createClass;
export const getTeacherClasses = ClassService.getClasses;
export const getClassById = ClassService.getClassById;
export const updateClass = ClassService.updateClass;
export const deleteClass = ClassService.deleteClass;
export const restoreClass = ClassService.restoreClass;
export const addStudentsToClass = ClassService.bulkEnrollStudents;
export const removeStudentFromClass = ClassService.removeStudent;
export const getAvailableStudents = ClassService.getAvailableStudents;
export const bulkUpdateClasses = ClassService.bulkUpdateClasses;
export const bulkDeleteClasses = ClassService.bulkDeleteClasses;
export const validateTeacherAccess = ClassService.validateTeacherAccess;
export const checkDuplicateClassName = ClassService.checkDuplicateClassName;

// Default export for backward compatibility
export default ClassService;