import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleTeacherSelection = () => {
    router.push('/screens/teacher/TeacherDashboard');
  };

  const handleStudentSelection = () => {
    // Navigate to the student dashboard
    router.push('/screens/student/StudentDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.backgroundContainer}>
        <SvgXml xml={backgroundSvg} width="100%" height="100%" />
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <SvgXml xml={logoSvg} width={120} height={120} />
            <Text style={styles.appName}>Zaid Bin Tsabit</Text>
            <Text style={styles.appTagline}>Aplikasi Manajemen Hafalan Quran</Text>
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Masuk Sebagai</Text>
            <Text style={styles.subtitle}>Silakan pilih peran Anda untuk melanjutkan</Text>
            
            <View style={styles.roleButtonsContainer}>
              <TouchableOpacity 
                style={styles.roleButton}
                onPress={handleTeacherSelection}
              >
                <View style={styles.roleIconContainer}>
                  <SvgXml xml={teacherIconSvg} width={40} height={40} />
                </View>
                <Text style={styles.roleButtonText}>Guru</Text>
                <Text style={styles.roleDescription}>
                  Kelola kelas, siswa, dan pantau perkembangan hafalan
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.roleButton}
                onPress={handleStudentSelection}
              >
                <View style={styles.roleIconContainer}>
                  <SvgXml xml={studentIconSvg} width={40} height={40} />
                </View>
                <Text style={styles.roleButtonText}>Siswa</Text>
                <Text style={styles.roleDescription}>
                  Lihat jadwal, setoran hafalan, dan capaian Anda
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.footer}>© 2025 Zaid Bin Tsabit</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Background Mosque SVG
const backgroundSvg = `
<svg width="100%" height="100%" viewBox="0 0 800 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sky background with gradient -->
  <rect width="800" height="1600" fill="#003049"/>
  
  <!-- Stars in the sky -->
  <circle cx="100" cy="200" r="2" fill="#ffffff" opacity="0.8"/>
  <circle cx="200" cy="150" r="1.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="300" cy="250" r="2" fill="#ffffff" opacity="0.7"/>
  <circle cx="400" cy="100" r="1.5" fill="#ffffff" opacity="0.8"/>
  <circle cx="500" cy="180" r="2" fill="#ffffff" opacity="0.7"/>
  <circle cx="600" cy="220" r="1.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="700" cy="120" r="2" fill="#ffffff" opacity="0.8"/>
  <circle cx="150" cy="300" r="1.5" fill="#ffffff" opacity="0.7"/>
  <circle cx="250" cy="350" r="2" fill="#ffffff" opacity="0.6"/>
  <circle cx="350" cy="280" r="1.5" fill="#ffffff" opacity="0.8"/>
  <circle cx="450" cy="320" r="2" fill="#ffffff" opacity="0.7"/>
  <circle cx="550" cy="270" r="1.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="650" cy="330" r="2" fill="#ffffff" opacity="0.8"/>
  <circle cx="750" cy="290" r="1.5" fill="#ffffff" opacity="0.7"/>
  
  <!-- Moon -->
  <circle cx="650" cy="200" r="60" fill="#f0c75e" opacity="0.9"/>
  <circle cx="630" cy="180" r="15" fill="#003049" opacity="0.2"/>
  <circle cx="670" cy="220" r="10" fill="#003049" opacity="0.1"/>
  
  <!-- Distant mountains -->
  <path d="M0 600 L200 450 L400 550 L600 400 L800 500 L800 1600 L0 1600 Z" fill="#001a2c"/>
  
  <!-- Mosque silhouette -->
  <path d="M150 800 L150 1000 L200 1000 L200 900 L250 900 L250 1000 L650 1000 L650 900 L700 900 L700 1000 L750 1000 L750 800 L700 750 L650 800 L600 750 L550 800 L500 750 L450 800 L400 750 L350 800 L300 750 L250 800 L200 750 L150 800 Z" fill="#001525"/>
  
  <!-- Main dome -->
  <path d="M400 750 C400 650, 500 650, 500 750 L400 750 Z" fill="#001525"/>
  <circle cx="450" cy="650" r="15" fill="#f0c75e"/>
  
  <!-- Minarets -->
  <rect x="175" y="600" width="50" height="200" fill="#001525"/>
  <path d="M175 600 L200 550 L225 600 Z" fill="#001525"/>
  <circle cx="200" cy="550" r="5" fill="#f0c75e"/>
  
  <rect x="675" y="600" width="50" height="200" fill="#001525"/>
  <path d="M675 600 L700 550 L725 600 Z" fill="#001525"/>
  <circle cx="700" cy="550" r="5" fill="#f0c75e"/>
  
  <!-- Small domes -->
  <path d="M250 800 C250 775, 275 775, 275 800 L250 800 Z" fill="#001525"/>
  <path d="M350 800 C350 775, 375 775, 375 800 L350 800 Z" fill="#001525"/>
  <path d="M550 800 C550 775, 575 775, 575 800 L550 800 Z" fill="#001525"/>
  <path d="M650 800 C650 775, 675 775, 675 800 L650 800 Z" fill="#001525"/>
  
  <!-- Windows -->
  <rect x="200" y="850" width="25" height="50" rx="12.5" fill="#f0c75e" opacity="0.3"/>
  <rect x="300" y="850" width="25" height="50" rx="12.5" fill="#f0c75e" opacity="0.3"/>
  <rect x="400" y="850" width="25" height="50" rx="12.5" fill="#f0c75e" opacity="0.3"/>
  <rect x="500" y="850" width="25" height="50" rx="12.5" fill="#f0c75e" opacity="0.3"/>
  <rect x="600" y="850" width="25" height="50" rx="12.5" fill="#f0c75e" opacity="0.3"/>
  
  <!-- Foreground -->
  <path d="M0 1000 L800 1000 L800 1600 L0 1600 Z" fill="#001525" opacity="0.5"/>
  
  <!-- Decorative Islamic patterns -->
  <path d="M400 950 L410 970 L430 970 L415 985 L420 1005 L400 995 L380 1005 L385 985 L370 970 L390 970 Z" fill="#f0c75e" opacity="0.5"/>
  <path d="M300 970 L310 990 L330 990 L315 1005 L320 1025 L300 1015 L280 1025 L285 1005 L270 990 L290 990 Z" fill="#f0c75e" opacity="0.5"/>
  <path d="M500 970 L510 990 L530 990 L515 1005 L520 1025 L500 1015 L480 1025 L485 1005 L470 990 L490 990 Z" fill="#f0c75e" opacity="0.5"/>
</svg>
`;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 94, 122, 0.85)',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  roleButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  roleButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  roleIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 12,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 20,
  },
}); 