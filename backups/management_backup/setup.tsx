import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/utils/supabase';
import { saveSchool, School } from '../../src/services/schools';

export default function SchoolSetupScreen() {
  const router = useRouter();

  const [schoolName, setSchoolName] = useState('');
  const [npsn, setNpsn] = useState('');
  const [managerName, setManagerName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

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
    if (!schoolName || !npsn || !managerName) {
      Alert.alert('Error', 'Nama Sekolah, NPSN, dan Nama Anda wajib diisi.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // In a production app, this logic should be moved to a secure Supabase Edge Function
    // to ensure atomicity (all steps succeed or none do) and to avoid granting broad
    // table permissions to the client.
    try {
      // 1. Create the school using the service
      const schoolData: School = {
        name: schoolName,
        npsn: npsn,
        address: '', // Placeholder as it's not collected in the form yet
        phone: '',   // Placeholder as it's not collected in the form yet
        email: ''    // Placeholder as it's not collected in the form yet
      };
      const { data: savedSchool, error: schoolError } = await saveSchool(schoolData);

      if (schoolError) throw schoolError;
      if (!savedSchool) throw new Error("Gagal membuat data sekolah.");

      // 2. Update the current user's metadata with the new school_id and full_name
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          school_id: savedSchool.id,
          full_name: managerName,
        }
      });
      
      if (userError) throw userError;

      Alert.alert('Sukses!', 'Profil sekolah dan akun Anda telah berhasil dibuat.');
      
      // Force a refresh of the session to get new metadata.
      // The AuthContext listener will pick up the change and the root layout will redirect to the dashboard.
      await supabase.auth.refreshSession();

    } catch (err: any) {
      console.error("Setup error:", err);
      const errorMessage = err.message || 'Terjadi kesalahan saat proses pengaturan.';
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

        <TextInput style={styles.input} placeholder="Nama Lengkap Anda (Manajemen)" value={managerName} onChangeText={setManagerName} placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Nama Sekolah" value={schoolName} onChangeText={setSchoolName} placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="NPSN (Nomor Pokok Sekolah Nasional)" value={npsn} onChangeText={setNpsn} placeholderTextColor="#888" keyboardType="numeric" />

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
