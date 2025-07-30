/**
 * Data Sanitization Utilities
 * Utilities for sanitizing and validating user input
 */

// HTML entities for escaping
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML entities to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  if (typeof text !== 'string') {
    return String(text);
  }
  
  return text.replace(/[&<>"'/]/g, (match) => HTML_ENTITIES[match] || match);
};

/**
 * Remove HTML tags from string
 */
export const stripHtml = (html: string): string => {
  if (typeof html !== 'string') {
    return String(html);
  }
  
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Sanitize string for use in URLs
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== 'string') {
    return '';
  }
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase().trim();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }
  
  return url;
};

/**
 * Sanitize filename for safe file operations
 */
export const sanitizeFilename = (filename: string): string => {
  if (typeof filename !== 'string') {
    return '';
  }
  
  // Remove or replace dangerous characters
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace dangerous chars with underscore
    .replace(/\.\./g, '_') // Replace .. with underscore
    .replace(/^\./, '_') // Replace leading dot
    .trim()
    .substring(0, 255); // Limit length
};

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    return '';
  }
  
  return email.toLowerCase().trim();
};

/**
 * Sanitize phone number (remove non-numeric characters except +)
 */
export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') {
    return '';
  }
  
  return phone.replace(/[^\d+\-\s()]/g, '').trim();
};

/**
 * Sanitize numeric input
 */
export const sanitizeNumber = (value: any): number | null => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
};

/**
 * Sanitize integer input
 */
export const sanitizeInteger = (value: any): number | null => {
  const num = sanitizeNumber(value);
  return num !== null ? Math.floor(num) : null;
};

/**
 * Sanitize text input (remove excessive whitespace, limit length)
 */
export const sanitizeText = (
  text: string,
  maxLength: number = 1000,
  allowHtml: boolean = false
): string => {
  if (typeof text !== 'string') {
    return '';
  }
  
  let sanitized = text.trim();
  
  // Remove HTML if not allowed
  if (!allowHtml) {
    sanitized = stripHtml(sanitized);
  }
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim();
  }
  
  return sanitized;
};

/**
 * Sanitize object by applying sanitization to all string properties
 */
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  options: {
    maxLength?: number;
    allowHtml?: boolean;
    sanitizeKeys?: boolean;
  } = {}
): T => {
  const { maxLength = 1000, allowHtml = false, sanitizeKeys = false } = options;
  
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeKeys ? sanitizeText(key, 100) : key;
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey as keyof T] = sanitizeText(value, maxLength, allowHtml) as T[keyof T];
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey as keyof T] = value.map(item => 
        typeof item === 'string' 
          ? sanitizeText(item, maxLength, allowHtml)
          : item
      ) as T[keyof T];
    } else if (value && typeof value === 'object') {
      sanitized[sanitizedKey as keyof T] = sanitizeObject(value, options) as T[keyof T];
    } else {
      sanitized[sanitizedKey as keyof T] = value;
    }
  }
  
  return sanitized;
};

/**
 * Validate and sanitize user profile data
 */
export const sanitizeUserProfile = (profile: any) => {
  if (!profile || typeof profile !== 'object') {
    return {};
  }
  
  return {
    firstName: sanitizeText(profile.firstName || '', 50),
    lastName: sanitizeText(profile.lastName || '', 50),
    email: sanitizeEmail(profile.email || ''),
    phone: sanitizePhone(profile.phone || ''),
    bio: sanitizeText(profile.bio || '', 500),
    website: sanitizeUrl(profile.website || ''),
    location: sanitizeText(profile.location || '', 100),
    company: sanitizeText(profile.company || '', 100),
    title: sanitizeText(profile.title || '', 100),
  };
};

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (typeof query !== 'string') {
    return '';
  }
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 200); // Limit length
};

/**
 * Sanitize SQL-like input (basic protection)
 */
export const sanitizeSqlInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove common SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|\/\*|\*\/)/g,
    /[';]/g,
  ];
  
  let sanitized = input;
  sqlPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
};

/**
 * Sanitize LIKE input for SQL queries
 */
export const sanitizeLikeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Escape special LIKE characters and remove SQL injection patterns
  return sanitizeSqlInput(input)
    .replace(/[%_]/g, '\\$&') // Escape LIKE wildcards
    .trim();
};

/**
 * Sanitize sort parameters for SQL ORDER BY clauses
 */
export const sanitizeSortParams = (
  field?: string, 
  direction?: string, 
  allowedFields: string[] = ['id', 'name', 'created_at', 'updated_at', 'level', 'status']
): { column: string; ascending: boolean } => {
  const sanitizedField = typeof field === 'string' && allowedFields.includes(field.toLowerCase()) 
    ? field.toLowerCase() 
    : 'id';
    
  const sanitizedDirection = typeof direction === 'string' && ['asc', 'desc'].includes(direction.toLowerCase())
    ? direction.toLowerCase()
    : 'asc';
  
  return { 
    column: sanitizedField, 
    ascending: sanitizedDirection === 'asc' 
  };
};

/**
 * Deep sanitize nested object structures
 */
export const deepSanitize = (obj: any, maxDepth: number = 10): any => {
  if (maxDepth <= 0) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item, maxDepth - 1));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeText(key, 100);
      sanitized[sanitizedKey] = deepSanitize(value, maxDepth - 1);
    }
    return sanitized;
  }
  
  return obj;
};

// Export sanitization utilities
export const sanitizationUtils = {
  escapeHtml,
  stripHtml,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  sanitizeInteger,
  sanitizeText,
  sanitizeObject,
  sanitizeUserProfile,
  sanitizeSearchQuery,
  sanitizeSqlInput,
  sanitizeLikeInput,
  sanitizeSortParams,
  deepSanitize,
} as const;
