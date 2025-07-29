/**
 * Login Feature Store
 * 
 * Local Zustand store for managing login feature state.
 * This store is scoped to the login feature and handles form state,
 * loading states, and error handling.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LoginState, LoginActions, LoginFormData } from './model';
import { initialLoginState, validateLoginForm } from './model';

interface LoginStore extends LoginState, LoginActions {
  // Additional computed properties
  isFormValid: boolean;
  canSubmit: boolean;
  
  // Additional actions
  updateFormField: (field: keyof LoginFormData, value: string) => void;
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
          error: null, // Clear error when form data changes
        }), false, 'setFormData'),
      
      setLoading: (isLoading: boolean) =>
        set({ isLoading }, false, 'setLoading'),
      
      setError: (error: string | null) =>
        set({ error }, false, 'setError'),
      
      resetForm: () =>
        set(initialLoginState, false, 'resetForm'),
      
      updateFormField: (field: keyof LoginFormData, value: string) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
          error: null,
        }), false, `updateFormField:${field}`),
      
      validateForm: () => {
        const { formData } = get();
        const { isValid, errors } = validateLoginForm(formData);
        
        if (!isValid) {
          // Set the first error as the general error
          const firstError = Object.values(errors)[0];
          set({ error: firstError }, false, 'validateForm:error');
        } else {
          set({ error: null }, false, 'validateForm:success');
        }
        
        return isValid;
      },
      
      handleSubmit: async (onSubmit: (data: LoginFormData) => Promise<void>) => {
        const { formData, validateForm, setLoading, setError } = get();
        
        // Validate form before submission
        if (!validateForm()) {
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          await onSubmit(formData);
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Terjadi kesalahan yang tidak diketahui';
          setError(errorMessage);
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
export const useLoginError = () => useLoginStore((state) => state.error);
export const useLoginLoading = () => useLoginStore((state) => state.isLoading);
export const useLoginValidation = () => useLoginStore((state) => ({
  isFormValid: state.isFormValid,
  canSubmit: state.canSubmit,
}));

// Action hooks
export const useLoginActions = () => useLoginStore((state) => ({
  setFormData: state.setFormData,
  setLoading: state.setLoading,
  setError: state.setError,
  resetForm: state.resetForm,
  updateFormField: state.updateFormField,
  validateForm: state.validateForm,
  handleSubmit: state.handleSubmit,
}));
