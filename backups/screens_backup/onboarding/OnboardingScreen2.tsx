import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Import SVG as string
const onboarding2Svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="300" fill="#f8f8f8" />
  
  <!-- Table -->
  <path d="M100 200H300V210C300 210 280 220 200 220C120 220 100 210 100 210V200Z" fill="#e0e0e0" />
  <path d="M100 200H300V205H100V200Z" fill="#005e7a" opacity="0.2" />
  
  <!-- Teacher (Left) -->
  <ellipse cx="120" cy="230" rx="20" ry="5" fill="#e0e0e0" />
  <path d="M110 230V200C110 200 115 190 120 190C125 190 130 200 130 200V230" fill="#005e7a" />
  <circle cx="120" cy="180" r="10" fill="#f0c75e" />
  
  <!-- Student 1 (Middle) -->
  <ellipse cx="200" cy="230" rx="20" ry="5" fill="#e0e0e0" />
  <path d="M190 230V200C190 200 195 190 200 190C205 190 210 200 210 200V230" fill="#f0c75e" opacity="0.8" />
  <circle cx="200" cy="180" r="10" fill="#f0c75e" opacity="0.6" />
  
  <!-- Student 2 (Right) -->
  <ellipse cx="280" cy="230" rx="20" ry="5" fill="#e0e0e0" />
  <path d="M270 230V200C270 200 275 190 280 190C285 190 290 200 290 200V230" fill="#f0c75e" opacity="0.8" />
  <circle cx="280" cy="180" r="10" fill="#f0c75e" opacity="0.6" />
  
  <!-- Progress Chart -->
  <rect x="150" y="140" width="100" height="50" rx="5" fill="#ffffff" stroke="#005e7a" />
  
  <!-- Chart Bars -->
  <rect x="160" y="150" width="10" height="30" fill="#005e7a" opacity="0.3" />
  <rect x="175" y="160" width="10" height="20" fill="#005e7a" opacity="0.5" />
  <rect x="190" y="145" width="10" height="35" fill="#005e7a" opacity="0.7" />
  <rect x="205" y="155" width="10" height="25" fill="#005e7a" opacity="0.5" />
  <rect x="220" y="165" width="10" height="15" fill="#005e7a" opacity="0.3" />
  <rect x="235" y="140" width="10" height="40" fill="#005e7a" />
  
  <!-- Teacher's Pointer -->
  <path d="M130 190L150 150" stroke="#005e7a" stroke-width="1" />
  <circle cx="150" cy="150" r="3" fill="#005e7a" />
  
  <!-- Decorative Elements -->
  <circle cx="80" cy="100" r="15" fill="#f0c75e" opacity="0.2" />
  <circle cx="320" cy="100" r="15" fill="#f0c75e" opacity="0.2" />
  <circle cx="80" cy="250" r="10" fill="#005e7a" opacity="0.1" />
  <circle cx="320" cy="250" r="10" fill="#005e7a" opacity="0.1" />
  
  <!-- Progress Indicators -->
  <circle cx="50" cy="80" r="20" fill="#ffffff" stroke="#005e7a" stroke-width="2" />
  <path d="M40 80L50 90L60 70" stroke="#005e7a" stroke-width="2" />
  
  <circle cx="350" cy="80" r="20" fill="#ffffff" stroke="#005e7a" stroke-width="2" />
  <path d="M340 80L350 90L360 70" stroke="#005e7a" stroke-width="2" />
  
  <!-- Arabic Text Representation -->
  <path d="M170 120C170 120 180 110 190 120C200 130 210 120 210 120" stroke="#005e7a" stroke-width="1" opacity="0.5" />
  <path d="M220 120C220 120 230 110 240 120" stroke="#005e7a" stroke-width="1" opacity="0.5" />
</svg>`;

export default function OnboardingScreen2() {
  const router = useRouter();

  const handleNext = () => {
    router.push('screens/onboarding/screen3' as any);
  };

  const handleSkip = () => {
    router.push('screens/auth/role-selection' as any);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Lewati</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <SvgXml xml={onboarding2Svg} width="100%" height={300} />
        </View>

        <Text style={styles.headline}>Pantau Perkembangan Hafalan</Text>
        
        <Text style={styles.subtext}>
          Lihat kemajuan hafalan dengan mudah melalui laporan yang jelas dan mudah dipahami.
          Guru dan siswa dapat memantau perkembangan bersama.
        </Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Selanjutnya</Text>
      </TouchableOpacity>

      <View style={styles.paginationContainer}>
        <View style={styles.paginationDot} />
        <View style={[styles.paginationDot, styles.activeDot]} />
        <View style={styles.paginationDot} />
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
  skipButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  skipText: {
    color: '#888888',
    fontSize: 16,
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
  },
  nextButton: {
    backgroundColor: '#f0c75e',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
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