import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleTeacherRole = () => {
    router.push('screens/auth/login' as any);
  };

  const handleSchoolRole = () => {
    router.push('screens/auth/school-register' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headline}>Sesuaikan Pengalaman Anda</Text>
        
        <Text style={styles.subtext}>
          Pilih akses yang sesuai dengan kebutuhan Anda untuk mencatat dan memantau hafalan.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.roleButton, styles.teacherButton]} 
          onPress={handleTeacherRole}
        >
          <Text style={styles.roleButtonText}>Guru</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleButton, styles.schoolButton]} 
          onPress={handleSchoolRole}
        >
          <Text style={styles.roleButtonText}>Sekolah</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  roleButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  teacherButton: {
    backgroundColor: '#005e7a',
  },
  schoolButton: {
    backgroundColor: '#f0c75e',
  },
  roleButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 