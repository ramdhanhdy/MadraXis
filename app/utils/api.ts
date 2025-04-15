import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - replace with production URL when deploying
const API_URL = 'http://192.168.0.105:8000/api/v1';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a 10-second timeout for all requests
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication service functions
export const authService = {
  // Login with email and password
  login: async (email: string, password: string, role: string) => {
    try {
      // Only send email and password, not role
      const response = await api.post('/auth/login', { 
        email, 
        password
      });
      
      if (response.data && response.data.access_token) {
        // Store the token for future requests
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        
        // Store user info if available
        if (response.data.user) {
          await AsyncStorage.setItem('user_info', JSON.stringify(response.data.user));
        }
        
        // Store the selected role
        await AsyncStorage.setItem('user_role', role);
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      // Log the entire error object first for detailed debugging
      console.error('Login error object:', error);

      if (axios.isAxiosError(error) && error.response) {
        // Log specific details if available
        console.error('Backend status code:', error.response.status);
        console.error('Backend error response:', error.response.data);
        // Extract a user-friendly message if possible
        const message = error.response.data.detail || error.message || 'Login failed';
        // setErrorMessage(message); // This line is commented out because setErrorMessage is not defined in this context
      } else {
        // Handle non-Axios errors or errors without a response
        console.error('Non-Axios error during login:', error.message);
        // setErrorMessage(error.message || 'An unexpected error occurred'); // This line is commented out because setErrorMessage is not defined in this context
      }
      // No need to throw the error here if we handle it by setting state
      // throw error; 
      return null; // Indicate login failure
    }
  },
  
  // Check if user is logged in
  isLoggedIn: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token; // Return true if token exists
  },
  
  // Get the current user role
  getUserRole: async () => {
    return await AsyncStorage.getItem('user_role');
  },
  
  // Logout
  logout: async () => {
    // Clear stored tokens and user info
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_info');
    await AsyncStorage.removeItem('user_role');
  },
  
  // Get current user info
  getCurrentUser: async () => {
    const userInfo = await AsyncStorage.getItem('user_info');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }
};

// Export the API instance for other services to use
export default api; 