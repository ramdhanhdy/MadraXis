import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Define a no-op storage adapter for server-side rendering.
const noopStorage = {
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, _value: string) => Promise.resolve(),
  removeItem: (_key: string) => Promise.resolve(),
};

// It's recommended to use environment variables for these
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  // You can show a message to the user or handle this error appropriately.
  // For now, we'll throw an error during development if the keys are missing.
  throw new Error("Supabase URL and Anon Key are not set. Please add them to your .env file.");
}

// Use the no-op storage on the server, and AsyncStorage elsewhere.
const storage =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? noopStorage
    : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage, // Use AsyncStorage for session persistence in React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Required for React Native
  },
});
