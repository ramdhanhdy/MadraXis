import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { authService } from '../../utils/api';

// Import SVG as string
const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="100" cy="100" r="95" fill="#005e7a" />
  <circle cx="100" cy="100" r="85" fill="#ffffff" />
  
  <!-- Open Book Symbol -->
  <path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill="#ffffff" />
  
  <!-- Arabic-inspired Decorative Element -->
  <path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill="#f0c75e" />
  <path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill="#f0c75e" />
  <path d="M120 45C120 45 110 50 120 55C130 50 120 45 120 45Z" fill="#f0c75e" />
  
  <!-- Text "ZBT" -->
  <path d="M70 160H130V170H70V160Z" fill="#005e7a" />
  <path d="M70 160L130 160L100 145L70 160Z" fill="#005e7a" />
  <path d="M85 170V180H115V170" stroke="#005e7a" stroke-width="10" stroke-linecap="round" />
</svg>`;

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await authService.isLoggedIn();
      if (isLoggedIn) {
        const userRole = await authService.getUserRole();
        navigateToRoleDashboard(userRole || '');
      }
    };
    
    checkLoginStatus();
  }, []);
  
  // Function to navigate based on role
  const navigateToRoleDashboard = (userRole: string) => {
    switch(userRole) {
      case 'teacher':
        router.push('/screens/teacher/TeacherDashboard');
        break;
      case 'student':
        router.push('/student/dashboard');
        break;
      case 'parent':
        router.push('/parent/dashboard');
        break;
      case 'management':
        router.push('/management/dashboard');
        break;
      default:
        // If no valid role, stay on login page
        break;
    }
  };

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Make the login request
      console.log('Attempting login with email:', email, 'and role:', role);
      const result = await authService.login(email, password, role || '');
      
      console.log('Login result:', result); // Log the result for debugging
      
      if (result && result.success) {
        // Login successful, navigate to appropriate dashboard
        console.log('Login successful, navigating to dashboard for role:', role);
        navigateToRoleDashboard(role || '');
      } else {
        // Handle login error
        console.log('LoginScreen: Login failed or error occurred.');
        setErrorMessage('Login failed. Check console for details.');
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error('Login error:', error.response.status, error.response.data);
        setErrorMessage('Login failed: ' + (error.response.data?.message || error.response.data || error.response.status));
        Alert.alert('Login Failed', error.response.data?.message || JSON.stringify(error.response.data) || 'Unknown error');
      } else if (error.request) {
        // No response received
        console.error('Login error: No response received', error.request);
        setErrorMessage('Login failed: No response from server');
        Alert.alert('Network Error', 'No response from server. Please check your connection.');
      } else {
        // Other error
        console.error('Login error:', error.message);
        setErrorMessage('Login failed: ' + error.message);
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('screens/auth/school-register' as any);
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    Alert.alert('Forgot Password', 'Password reset functionality will be available soon.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgXml xml={logoSvg} width={100} height={100} />
        <Text style={styles.appName}>Pondok Pesantren Tahfidz ZAID BIN TSAABIT</Text>
        {role && (
          <View style={styles.roleChip}>
            <Text style={styles.roleText}>
              Login as: {role === 'teacher' ? 'Guru' : 
                role === 'management' ? 'Manajemen' : 
                role === 'student' ? 'Siswa' : 
                role === 'parent' ? 'Orang Tua' : 'User'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'login' && styles.activeTab]} 
          onPress={() => setActiveTab('login')}
        >
          <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'register' && styles.activeTab]} 
          onPress={() => setActiveTab('register')}
        >
          <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Daftar</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'login' ? (
        <View style={styles.formContainer}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email Anda"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password Anda"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={styles.forgotPasswordContainer} 
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.registerPromptContainer}>
          <Text style={styles.registerPromptText}>
            Untuk mendaftar sebagai sekolah, silakan klik tombol di bawah ini
          </Text>
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>Daftar Sekolah</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005e7a',
    textAlign: 'center',
  },
  roleChip: {
    backgroundColor: '#005e7a',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  roleText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 16,
    color: '#888888',
  },
  activeTabText: {
    color: '#005e7a',
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#005e7a',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#005e7a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerPromptContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  registerPromptText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  registerButton: {
    backgroundColor: '#f0c75e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 