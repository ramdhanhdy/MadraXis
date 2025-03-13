import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import RadialMenu from '../components/RadialMenu';
import BackgroundPattern from '../components/BackgroundPattern';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleTeacherSelection = () => {
    router.push('/screens/teacher/TeacherDashboard');
  };

  const handleStudentSelection = () => {
    // Navigate to the student dashboard
    router.push('/student/dashboard');
  };

  const handleParentSelection = () => {
    // Navigate to the parent dashboard
    router.push('/parent/dashboard');
  };

  const handleManagementSelection = () => {
    // Navigate to the management dashboard
    router.push('/management/dashboard');
  };

  const menuItems = [
    {
      id: 'teacher',
      label: 'Guru',
      description: 'Kelola kelas, siswa, dan pantau perkembangan hafalan',
      icon: teacherIconSvg,
      onPress: handleTeacherSelection
    },
    {
      id: 'student',
      label: 'Siswa',
      description: 'Lihat jadwal, setoran hafalan, dan capaian Anda',
      icon: studentIconSvg,
      onPress: handleStudentSelection
    },
    {
      id: 'parent',
      label: 'Orang Tua',
      description: 'Pantau perkembangan anak, keamanan, dan komunikasi dengan guru',
      icon: parentIconSvg,
      onPress: handleParentSelection
    },
    {
      id: 'management',
      label: 'Manajemen',
      description: 'Kelola operasional sekolah, laporan, dan pengawasan keseluruhan',
      icon: managementIconSvg,
      onPress: handleManagementSelection
    }
  ];

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
            
            <RadialMenu items={menuItems} />
          </View>
          
          <Text style={styles.footer}>© 2025 Zaid Bin Tsabit</Text>
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

// Teacher Icon SVG
const teacherIconSvg = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Teacher with book icon -->
  <circle cx="20" cy="12" r="8" fill="#005e7a"/>
  <path d="M10 34C10 27.373 14.477 22 20 22C25.523 22 30 27.373 30 34" stroke="#005e7a" stroke-width="2"/>
  <rect x="12" y="26" width="16" height="8" rx="1" fill="#005e7a"/>
  <path d="M16 26 L16 34" stroke="#ffffff" stroke-width="1"/>
  <path d="M24 26 L24 34" stroke="#ffffff" stroke-width="1"/>
  <path d="M12 30 L28 30" stroke="#ffffff" stroke-width="1"/>
</svg>
`;

// Student Icon SVG
const studentIconSvg = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Student with graduation cap -->
  <circle cx="20" cy="12" r="8" fill="#005e7a"/>
  <path d="M10 34C10 27.373 14.477 22 20 22C25.523 22 30 27.373 30 34" stroke="#005e7a" stroke-width="2"/>
  <path d="M10 18L20 14L30 18L20 22L10 18Z" fill="#005e7a"/>
  <path d="M20 22L20 28" stroke="#005e7a" stroke-width="2"/>
  <circle cx="20" cy="29" r="1" fill="#005e7a"/>
</svg>
`;

// Parent Icon SVG
const parentIconSvg = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Parent with child icon -->
  <circle cx="15" cy="12" r="6" fill="#005e7a"/>
  <circle cx="25" cy="14" r="4" fill="#005e7a"/>
  <path d="M7 34C7 28.477 10.582 24 15 24C19.418 24 23 28.477 23 34" stroke="#005e7a" stroke-width="2"/>
  <path d="M19 32C19 28.686 21.686 26 25 26C28.314 26 31 28.686 31 32" stroke="#005e7a" stroke-width="2"/>
  <path d="M15 18L25 18" stroke="#005e7a" stroke-width="1.5"/>
</svg>
`;

// Management Icon SVG
const managementIconSvg = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Management icon with building and gear -->
  <rect x="8" y="16" width="24" height="18" rx="2" fill="#005e7a"/>
  
  <!-- Windows -->
  <rect x="12" y="20" width="4" height="4" fill="#ffffff"/>
  <rect x="18" y="20" width="4" height="4" fill="#ffffff"/>
  <rect x="24" y="20" width="4" height="4" fill="#ffffff"/>
  <rect x="12" y="26" width="4" height="4" fill="#ffffff"/>
  <rect x="18" y="26" width="4" height="4" fill="#ffffff"/>
  <rect x="24" y="26" width="4" height="4" fill="#ffffff"/>
  
  <!-- Door -->
  <rect x="18" y="30" width="4" height="4" rx="1" fill="#ffffff"/>
  
  <!-- Roof -->
  <path d="M6 16L20 6L34 16" stroke="#005e7a" stroke-width="2"/>
  
  <!-- Gear -->
  <circle cx="30" cy="10" r="6" fill="#005e7a" stroke="#ffffff" stroke-width="1"/>
  <path d="M30 7L30 13" stroke="#ffffff" stroke-width="1"/>
  <path d="M27 10L33 10" stroke="#ffffff" stroke-width="1"/>
  <path d="M28 8L32 12" stroke="#ffffff" stroke-width="1"/>
  <path d="M28 12L32 8" stroke="#ffffff" stroke-width="1"/>
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
  footer: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 20,
  },
}); 