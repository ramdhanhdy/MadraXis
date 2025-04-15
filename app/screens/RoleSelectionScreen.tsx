import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import BackgroundPattern from '../components/BackgroundPattern';
import { FontAwesome5 } from '@expo/vector-icons';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleTeacherSelection = () => {
    router.push('/screens/teacher/TeacherDashboard');
  };

  const handleStudentSelection = () => {
    router.push('/student/dashboard');
  };

  const handleParentSelection = () => {
    router.push('/parent/dashboard');
  };

  const handleManagementSelection = () => {
    router.push('/management/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.backgroundContainer}>
        {/* Solid background color */}
        <View style={styles.solidBackground} />
        
        {/* Decorative pattern */}
        <BackgroundPattern color="#006e8a" opacity={0.1} />
        
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <SvgXml xml={logoSvg} width={120} height={120} />
            <Text style={styles.appName}>Zaid Bin Tsabit</Text>
            <Text style={styles.appTagline}>Aplikasi Manajemen Hafalan Quran</Text>
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>Silakan pilih peran Anda untuk melanjutkan</Text>
            
            <View style={styles.roleButtonsContainer}>
              <TouchableOpacity 
                style={[styles.roleButton, styles.selectedRoleButton]} 
                onPress={handleTeacherSelection}
              >
                <View style={styles.roleIconContainer}>
                  <FontAwesome5 name="chalkboard-teacher" size={24} color="#005e7a" />
                </View>
                <Text style={styles.roleButtonText}>Guru</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.roleButton, styles.managementButton]} 
                onPress={handleManagementSelection}
              >
                <View style={styles.roleIconContainer}>
                  <FontAwesome5 name="building" size={24} color="#005e7a" />
                </View>
                <Text style={styles.roleButtonText}>Manajemen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.roleButton, styles.studentButton]} 
                onPress={handleStudentSelection}
              >
                <View style={styles.roleIconContainer}>
                  <FontAwesome5 name="user-graduate" size={24} color="#005e7a" />
                </View>
                <Text style={styles.roleButtonText}>Siswa</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.roleButton, styles.parentButton]} 
                onPress={handleParentSelection}
              >
                <View style={styles.roleIconContainer}>
                  <FontAwesome5 name="user-friends" size={24} color="#005e7a" />
                </View>
                <Text style={styles.roleButtonText}>Orang Tua</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.footer}>Kelola kelas, siswa, dan pantau perkembangan</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Logo SVG
const logoSvg = `
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="60" fill="#005e7a"/>
  <circle cx="60" cy="60" r="50" fill="#005e7a" stroke="#f0c75e" stroke-width="2"/>
  
  <!-- Open Book -->
  <path d="M30 45 L30 75 L60 65 L90 75 L90 45 L60 35 L30 45Z" fill="#f0c75e"/>
  <path d="M30 45 L60 35 L60 65 L30 75 L30 45Z" fill="#f0c75e" stroke="#005e7a" stroke-width="1"/>
  <path d="M60 35 L90 45 L90 75 L60 65 L60 35Z" fill="#ffffff" stroke="#005e7a" stroke-width="1"/>
  
  <!-- Book Pages Lines -->
  <path d="M40 48 L50 45" stroke="#005e7a" stroke-width="1"/>
  <path d="M40 53 L50 50" stroke="#005e7a" stroke-width="1"/>
  <path d="M40 58 L50 55" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 45 L80 48" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 50 L80 53" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 55 L80 58" stroke="#005e7a" stroke-width="1"/>
  
  <!-- Decorative Elements -->
  <circle cx="60" cy="85" r="5" fill="#f0c75e"/>
  <path d="M55 25 Q60 15 65 25" stroke="#f0c75e" stroke-width="2" fill="none"/>
  <path d="M50 28 Q60 15 70 28" stroke="#f0c75e" stroke-width="2" fill="none"/>
</svg>
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  solidBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#005e7a',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  appTagline: {
    fontSize: 16,
    color: '#f0c75e',
    marginTop: 5,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  roleButtonsContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginVertical: 10,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    width: '100%',
    marginVertical: 8,
    paddingVertical: 18,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  selectedRoleButton: {
    backgroundColor: '#FFCC33',
  },
  managementButton: {
    backgroundColor: '#ffffff',
  },
  studentButton: {
    backgroundColor: '#ffffff',
  },
  parentButton: {
    backgroundColor: '#ffffff',
  },
  roleIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  footer: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
}); 