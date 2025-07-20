import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Import SVG as string
const onboarding3Svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="300" fill="#f8f8f8" />
  
  <!-- Certificate -->
  <rect x="100" y="70" width="200" height="160" rx="5" fill="#ffffff" stroke="#005e7a" stroke-width="2" />
  <rect x="110" y="80" width="180" height="140" rx="3" fill="#ffffff" stroke="#f0c75e" stroke-width="1" stroke-dasharray="2 2" />
  
  <!-- Certificate Content -->
  <path d="M150 100H250" stroke="#005e7a" stroke-width="1" />
  <path d="M130 120H270" stroke="#e0e0e0" stroke-width="1" />
  <path d="M130 140H270" stroke="#e0e0e0" stroke-width="1" />
  <path d="M130 160H270" stroke="#e0e0e0" stroke-width="1" />
  <path d="M130 180H270" stroke="#e0e0e0" stroke-width="1" />
  
  <!-- Certificate Title -->
  <circle cx="200" cy="110" r="15" fill="#f0c75e" opacity="0.2" />
  <path d="M180 110H220" stroke="#005e7a" stroke-width="2" />
  
  <!-- Certificate Seal -->
  <circle cx="200" cy="200" r="15" fill="#f0c75e" opacity="0.5" />
  <circle cx="200" cy="200" r="10" fill="#f0c75e" opacity="0.3" />
  <path d="M190 200L195 205L210 190" stroke="#005e7a" stroke-width="1" />
  
  <!-- Decorative Elements -->
  <circle cx="80" cy="50" r="15" fill="#f0c75e" opacity="0.2" />
  <circle cx="320" cy="50" r="15" fill="#f0c75e" opacity="0.2" />
  <circle cx="80" cy="250" r="15" fill="#005e7a" opacity="0.1" />
  <circle cx="320" cy="250" r="15" fill="#005e7a" opacity="0.1" />
  
  <!-- Ribbon -->
  <path d="M180 230L200 250L220 230" stroke="#f0c75e" stroke-width="3" />
  <path d="M180 230V260" stroke="#f0c75e" stroke-width="3" />
  <path d="M220 230V260" stroke="#f0c75e" stroke-width="3" />
  
  <!-- Stars -->
  <path d="M50 100L55 110L65 110L57 117L60 127L50 122L40 127L43 117L35 110L45 110L50 100Z" fill="#f0c75e" opacity="0.5" />
  <path d="M350 100L355 110L365 110L357 117L360 127L350 122L340 127L343 117L335 110L345 110L350 100Z" fill="#f0c75e" opacity="0.5" />
  <path d="M50 200L55 210L65 210L57 217L60 227L50 222L40 227L43 217L35 210L45 210L50 200Z" fill="#f0c75e" opacity="0.5" />
  <path d="M350 200L355 210L365 210L357 217L360 227L350 222L340 227L343 217L335 210L345 210L350 200Z" fill="#f0c75e" opacity="0.5" />
  
  <!-- Quran Symbol -->
  <path d="M200 40C200 40 180 30 160 40V60C180 50 200 60 200 60V40Z" fill="#005e7a" opacity="0.3" />
  <path d="M200 40C200 40 220 30 240 40V60C220 50 200 60 200 60V40Z" fill="#005e7a" opacity="0.3" />
</svg>`;

export default function OnboardingScreen3() {
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
        <View style={styles.imageContainer}>
          <SvgXml xml={onboarding3Svg} width="100%" height={300} />
        </View>

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

      <View style={styles.paginationContainer}>
        <View style={styles.paginationDot} />
        <View style={styles.paginationDot} />
        <View style={[styles.paginationDot, styles.activeDot]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
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
    marginBottom: 40,
  },
  buttonContainer: {
    marginBottom: 30,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#dddddd',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#f0c75e',
    width: 20,
  },
}); 