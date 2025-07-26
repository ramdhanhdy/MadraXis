/**
 * Date utility functions for accurate age and grade level calculations
 */

/**
 * Calculates the exact age in years from a birth date to today
 * Accounts for birth month and day for precise age calculation
 * 
 * @param birthDate - ISO date string or Date object
 * @returns Exact age in years
 */
export const calculateExactAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date(new Date().toISOString().split('T')[0]);
  
  // Validate the birth date
  if (isNaN(birth.getTime())) return 0;
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  return Math.max(0, age); // Ensure age is never negative
};

/**
 * Determines the appropriate grade level based on exact age
 * Uses Indonesian education system standards:
 * - SMP: Junior High School (ages 12-14)
 * - SMA: Senior High School (ages 15-18)
 * 
 * @param birthDate - ISO date string or Date object
 * @returns Grade level or null if age is outside standard ranges
 */
export const determineGradeLevel = (birthDate: string | Date): 'SMP' | 'SMA' | null => {
  if (!birthDate) return null;
  
  const age = calculateExactAge(birthDate);
  
  // Mutually exclusive age ranges
  if (age >= 12 && age < 15) return 'SMP';
  if (age >= 15 && age < 19) return 'SMA';
  
  return null; // Outside standard grade levels
};

/**
 * Gets both age and grade level for a student
 * 
 * @param birthDate - ISO date string or Date object
 * @returns Object containing age and grade level
 */
export const getStudentAgeAndGrade = (birthDate: string | Date): {
  age: number;
  gradeLevel: 'SMP' | 'SMA' | null;
} => {
  const age = calculateExactAge(birthDate);
  // Determine grade level from already calculated age
  let gradeLevel: 'SMP' | 'SMA' | null = null;
  if (age >= 12 && age < 15) gradeLevel = 'SMP';
  else if (age >= 15 && age < 19) gradeLevel = 'SMA';
  
  return { age, gradeLevel };
};

/**
 * Validates if a date string is a valid ISO date
 * 
 * @param dateString - Date string to validate
 * @returns true if valid date, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Formats age with proper handling of edge cases
 * 
 * @param birthDate - ISO date string or Date object
 * @returns Formatted age string or 'N/A' if invalid
 */
export const formatAge = (birthDate: string | Date): string => {
  if (!birthDate || !isValidDate(birthDate.toString())) {
    return 'N/A';
  }
  
  const age = calculateExactAge(birthDate);
  return `${age} years`;
};