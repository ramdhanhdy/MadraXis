/**
 * Login Feature Store
 * 
 * Local Zustand store for managing login feature state.
 * This store is scoped to the login feature and handles form state,
 * loading states, and error handling.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LoginState, LoginActions, LoginFormData, UserRole } from './model';
import { initialLoginState, validateLoginForm } from './model';

interface LoginStore extends LoginState, LoginActions {
  // Additional computed properties
  isFormValid: boolean;
  canSubmit: boolean;
  
  // Additional actions
  updateFormField: (field: keyof LoginFormData, value: string | UserRole) => void;
  validateForm: () => boolean;
  handleSubmit: (onSubmit: (data: LoginFormData) => Promise<void>) => Promise<void>;
}

export const useLoginStore = create<LoginStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialLoginState,
      
      // Computed properties
      get isFormValid() {
        const { formData } = get();
        const { isValid } = validateLoginForm(formData);
        return isValid;
      },
      
      get canSubmit() {
        const { isFormValid, isLoading } = get();
        return isFormValid && !isLoading;
      },
      
      // Actions
      setFormData: (data: Partial<LoginFormData>) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
          errors: null, // Clear errors when form data changes
        }), false, 'setFormData'),
      
      setLoading: (isLoading: boolean) =>
        set({ isLoading }, false, 'setLoading'),
      
      setErrors: (errors: Record<string, string> | null) =>
        set({ errors }, false, 'setErrors'),
      
      resetForm: () =>
        set(initialLoginState, false, 'resetForm'),
      
      updateFormField: (field: keyof LoginFormData, value: string | UserRole) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
          errors: null, // Correctly clear the 'errors' object
        }), false, `updateFormField:${field}`),
      
      validateForm: () => {
        const { formData } = get();
        const { isValid, errors } = validateLoginForm(formData);
        
        if (!isValid) {
          set({ errors }, false, 'validateForm:error');
        } else {
          set({ errors: null }, false, 'validateForm:success');
        }
        
        return isValid;
      },
      
      handleSubmit: async (onSubmit: (data: LoginFormData) => Promise<void>) => {
        const { formData, validateForm, setLoading } = get(); // Remove unused 'setError'
        
        // Validate form before submission
        if (!validateForm()) {
          return;
        }
        
        try {
          setLoading(true);
          get().setErrors(null);
          await onSubmit(formData);
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Terjadi kesalahan yang tidak diketahui';
          get().setErrors({ general: errorMessage });
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'login-store',
      // Only enable devtools in development
      enabled: __DEV__,
    }
  )
);

// Selector hooks for better performance
export const useLoginFormData = () => useLoginStore((state) => state.formData);
export const useLoginErrors = () => useLoginStore((state) => state.errors);
export const useLoginLoading = () => useLoginStore((state) => state.isLoading);
export const useLoginValidation = () => useLoginStore((state) => ({
  isFormValid: state.isFormValid,
  canSubmit: state.canSubmit,
}));

// Action hooks
export const useLoginActions = () => useLoginStore((state) => ({
  setFormData: state.setFormData,
  setLoading: state.setLoading,
  setErrors: state.setErrors,
  resetForm: state.resetForm,
  updateFormField: state.updateFormField,
  validateForm: state.validateForm,
  handleSubmit: state.handleSubmit,
}));
