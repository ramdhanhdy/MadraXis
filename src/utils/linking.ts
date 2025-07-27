import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

export interface DeepLinkConfig {
  prefixes: string[];
  config: {
    screens: Record<string, any>;
  };
}

export interface ParsedDeepLink {
  path: string;
  params: Record<string, string | number>;
  screen: string;
  queryParams?: Record<string, string>;
}

export const linkingConfig = {
  prefixes: ['madraxis://'],
  config: {
    screens: {
      '(auth)': {
        path: 'auth',
        screens: {
          'login': 'login',
          'reset-password': 'reset-password'
        }
      },
      '(teacher)': {
        path: 'teacher',
        screens: {
          'dashboard': 'dashboard',
          'students': {
            path: 'students',
            screens: {
              'index': '',
              '[id]': ':id'
            }
          },
          'class': {
            path: 'class',
            screens: {
              'index': '',
              '[id]': {
                path: ':id',
                screens: {
                  'index': '',
                  'add-students': 'add-students',
                  'students': 'students',
                  'schedule': 'schedule',
                  'reports': 'reports'
                }
              }
            }
          }
        }
      },
      '(management)': {
        path: 'management',
        screens: {
          'dashboard': 'dashboard',
          'setup': 'setup',
          'user-management': 'user-management'
        }
      },
      '(parent)': {
        path: 'parent',
        screens: {
          'dashboard': 'dashboard',
          'anti-bullying': 'anti-bullying',
          'cctv-request': 'cctv-request',
          'incident-report': 'incident-report'
        }
      },
      '(student)': {
        path: 'student',
        screens: {
          'dashboard': 'dashboard',
          'anti-bullying': 'anti-bullying',
          'boarding-info': 'boarding-info',
          'schedule': 'schedule',
          'quran-progress': 'quran-progress',
          'incident-report': 'incident-report'
        }
      }
    }
  }
};

/**
 * Parse a deep link URL using Expo Router's linking configuration
 */
export function parseDeepLink(url: string): ParsedDeepLink | null {
  try {
    if (!url || typeof url !== 'string') {
      return null;
    }

    // Check if URL starts with madraxis://
    if (!url.startsWith('madraxis://')) {
      return null;
    }

    // Remove the scheme and get the path
    const urlWithoutScheme = url.replace('madraxis://', '');
    const [pathPart, queryPart] = urlWithoutScheme.split('?');
    const segments = pathPart.split('/').filter(Boolean);
    
    if (segments.length === 0) {
      return null;
    }

    const params: Record<string, string | number> = {};

    // Parse path segments and extract parameters
    if (segments[0] === 'teacher' && segments[1] === 'class') {
      if (segments.length >= 3) {
        const classId = segments[2];
        params.id = isNaN(Number(classId)) ? classId : Number(classId);
        
        return {
          path: pathPart,
          params: params,
          screen: 'teacher/class/[id]/add-students'
        };
      } else {
        // Handle case where we have teacher/class but no ID
        return {
          path: pathPart,
          params: params,
          screen: 'teacher/class'
        };
      }
    }

    // Handle other routes as needed
    return {
      path: pathPart,
      params: params,
      screen: segments.join('/')
    };
  } catch (error) {
    return null;
  }
}

/**
 * Generate a deep link URL for a specific route
 */
export function generateDeepLink(route: string, params?: Record<string, string | number>): string {
  const baseUrl = Constants.expoConfig?.scheme || 'madraxis';
  
  switch (route) {
    case 'teacher/class/add-students':
      const classId = params?.id || ':id';
      return `${baseUrl}://teacher/class/${classId}/add-students`;
    
    case 'teacher/class':
      return `${baseUrl}://teacher/class`;
    
    case 'teacher/dashboard':
      return `${baseUrl}://teacher/dashboard`;
    
    case 'management/dashboard':
      return `${baseUrl}://management/dashboard`;
    
    case 'parent/dashboard':
      return `${baseUrl}://parent/dashboard`;
    
    case 'student/dashboard':
      return `${baseUrl}://student/dashboard`;
    
    default:
      return `${baseUrl}://${route}`;
  }
}

/**
 * Validate if a URL is a valid deep link
 */
export function isValidDeepLink(url: string): boolean {
  try {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    const validPrefixes = ['madraxis://teacher/', 'madraxis://management/', 'madraxis://parent/', 'madraxis://student/', 'madraxis://auth/'];
    return validPrefixes.some(prefix => url.startsWith(prefix));
  } catch (error) {
    return false;
  }
}

/**
 * Extract query parameters from a deep link URL
 */
export function getQueryParams(url: string): Record<string, string> {
  try {
    const parsed = Linking.parse(url);
    const queryParams = parsed.queryParams || {};
    
    // Convert QueryParams (string | string[] | undefined) to Record<string, string>
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        // Handle both string and string[] cases
        result[key] = Array.isArray(value) ? value[0] : value;
      }
    }
    
    return result;
  } catch (error) {
    return {};
  }
}

/**
 * Get the full linking configuration for Expo Router
 */
export function getLinkingConfig() {
  return linkingConfig;
}