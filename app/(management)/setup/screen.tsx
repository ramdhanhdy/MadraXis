import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';

// Services
import { supabase } from '@lib/utils/supabase';
import { saveSchool, School } from '@domains/schools';

// Feature Model
import {
  type SchoolSetupFormData,
  validateCompleteSetup,
  convertFormDataToSchool,
  initialSchoolSetupFormData,
  SETUP_ERRORS,
  SETUP_SUCCESS,
} from './model';

export default function SchoolSetupScreen() {
  const [formData, setFormData] = useState<SchoolSetupFormData>(initialSchoolSetupFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Update form data helper
  const updateFormData = (field: keyof SchoolSetupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckClaims = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-auth-claims');
      if (error) throw error;
      
      const claims = JSON.stringify(data.claims, null, 2);
      console.log('User JWT Claims:', claims);
      setDebugInfo(claims);
      Alert.alert('JWT Claims', claims);
    } catch (err: any) {
      console.error('Error checking claims:', err);
      Alert.alert('Error', `Gagal memeriksa claims: ${err.message}`);
    }
  };

  const handleSetup = async () => {
    // Validate required fields
    if (!formData.schoolName || !formData.npsn || !formData.managerName) {
      Alert.alert('Error', 'Nama Sekolah, NPSN, dan Nama Anda wajib diisi.');
      return;
    }

    // Validate form data
    const { isValid, errors } = validateCompleteSetup(formData);
    if (!isValid) {
      const errorMessage = Object.values(errors)[0] || SETUP_ERRORS.VALIDATION_ERROR;
      Alert.alert('Error', errorMessage);
      return;
    }

    setIsLoading(true);
    setError(null);

    // In a production app, this logic should be moved to a secure Supabase Edge Function
    // to ensure atomicity (all steps succeed or none do) and to avoid granting broad
    // table permissions to the client.
    try {
      // 1. Create the school using the service
      const schoolData: School = convertFormDataToSchool(formData);
      const { data: savedSchool, error: schoolError } = await saveSchool(schoolData);

      if (schoolError) throw schoolError;
      if (!savedSchool) throw new Error(SETUP_ERRORS.SAVE_FAILED);

      // 2. Update the current user's metadata with the new school_id and full_name
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          school_id: savedSchool.id,
          full_name: formData.managerName,
        }
      });
      
      if (userError) throw userError;

      Alert.alert('Sukses!', SETUP_SUCCESS.SETUP_COMPLETE);
      
      // Force a refresh of the session to get new metadata.
      // The AuthContext listener will pick up the change and the root layout will redirect to the dashboard.
      await supabase.auth.refreshSession();

    } catch (err: any) {
      console.error("Setup error:", err);
      const errorMessage = err.message || SETUP_ERRORS.UNKNOWN_ERROR;
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Selamat Datang!</Text>
        <Text style={styles.subtitle}>Lengkapi profil sekolah Anda untuk memulai.</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Nama Lengkap Anda (Manajemen)" 
          value={formData.managerName} 
          onChangeText={(value) => updateFormData('managerName', value)}
          placeholderTextColor="#888" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Nama Sekolah" 
          value={formData.schoolName} 
          onChangeText={(value) => updateFormData('schoolName', value)}
          placeholderTextColor="#888" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="NPSN (Nomor Pokok Sekolah Nasional)" 
          value={formData.npsn} 
          onChangeText={(value) => updateFormData('npsn', value)}
          placeholderTextColor="#888" 
          keyboardType="numeric" 
          maxLength={8}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Alamat Sekolah (Opsional)" 
          value={formData.address} 
          onChangeText={(value) => updateFormData('address', value)}
          placeholderTextColor="#888" 
          multiline
          numberOfLines={3}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Nomor Telepon Sekolah (Opsional)" 
          value={formData.phone} 
          onChangeText={(value) => updateFormData('phone', value)}
          placeholderTextColor="#888" 
          keyboardType="phone-pad"
        />

        <TextInput 
          style={styles.input} 
          placeholder="Email Sekolah (Opsional)" 
          value={formData.email} 
          onChangeText={(value) => updateFormData('email', value)}
          placeholderTextColor="#888" 
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.debugButton} onPress={handleCheckClaims}>
          <Text style={styles.buttonText}>Debug: Check JWT Claims</Text>
        </TouchableOpacity>

        {debugInfo && <Text style={styles.debugText}>{debugInfo}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSetup} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Simpan dan Lanjutkan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#005e7a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  debugButton: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  debugText: {
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderRadius: 4,
    fontFamily: 'monospace',
    color: '#2c3e50',
    fontSize: 12,
  },
});
