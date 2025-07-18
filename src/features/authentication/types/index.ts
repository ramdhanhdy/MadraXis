export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role?: 'teacher' | 'student' | 'parent' | 'management';
  schoolId?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface AuthContextType {
  session: any | null;
  user: any | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  clearSession: () => Promise<void>;
}