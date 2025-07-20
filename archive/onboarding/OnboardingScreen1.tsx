import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Import SVG as string
const onboarding1Svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="300" fill="#f8f8f8" />
  
  <!-- Mosque Silhouette -->
  <path d="M0 180H400V200H0V180Z" fill="#e0e0e0" />
  <path d="M150 180C150 180 150 100 200 80C250 100 250 180 250 180H150Z" fill="#005e7a" opacity="0.2" />
  <path d="M170 180V120H180V180H170Z" fill="#005e7a" opacity="0.3" />
  <path d="M220 180V120H230V180H220Z" fill="#005e7a" opacity="0.3" />
  <path d="M195 80L200 60L205 80H195Z" fill="#005e7a" opacity="0.3" />
  <circle cx="200" cy="90" r="10" fill="#005e7a" opacity="0.3" />
  
  <!-- Person Reading Quran -->
  <ellipse cx="200" cy="220" rx="40" ry="10" fill="#e0e0e0" />
  
  <!-- Body -->
  <path d="M180 220V170C180 170 190 160 200 160C210 160 220 170 220 170V220" fill="#005e7a" />
  
  <!-- Head -->
  <circle cx="200" cy="150" r="15" fill="#f0c75e" />
  
  <!-- Book -->
  <path d="M185 190H215V195H185V190Z" fill="#ffffff" />
  <path d="M185 190C185 190 185 180 200 180C215 180 215 190 215 190" fill="#ffffff" />
  <path d="M185 190V195C185 195 185 205 200 205C215 205 215 195 215 195V190" fill="#ffffff" />
  <path d="M200 180V205" stroke="#f0c75e" stroke-width="1" />
  <path d="M190 185L190 200" stroke="#005e7a" stroke-width="0.5" />
  <path d="M195 185L195 200" stroke="#005e7a" stroke-width="0.5" />
  <path d="M205 185L205 200" stroke="#005e7a" stroke-width="0.5" />
  <path d="M210 185L210 200" stroke="#005e7a" stroke-width="0.5" />
  
  <!-- Decorative Elements -->
  <circle cx="100" cy="100" r="20" fill="#f0c75e" opacity="0.2" />
  <circle cx="300" cy="100" r="20" fill="#f0c75e" opacity="0.2" />
  <circle cx="100" cy="250" r="15" fill="#005e7a" opacity="0.1" />
  <circle cx="300" cy="250" r="15" fill="#005e7a" opacity="0.1" />
  
  <!-- Arabic Calligraphy Style Decoration -->
  <path d="M50 50C50 50 70 30 90 50C110 70 130 50 130 50" stroke="#005e7a" stroke-width="2" opacity="0.3" />
  <path d="M270 50C270 50 290 30 310 50C330 70 350 50 350 50" stroke="#005e7a" stroke-width="2" opacity="0.3" />
</svg>`;

export default function OnboardingScreen1() {
  const router = useRouter();

  const handleNext = () => {
    router.push('screens/onboarding/screen2' as any);
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
          <SvgXml xml={onboarding1Svg} width="100%" height={300} />
        </View>

        <Text style={styles.headline}>Catat Hafalan dengan Mudah</Text>
        
        <Text style={styles.subtext}>
          Aplikasi ini membantu Anda mencatat hafalan Al-Quran dengan cepat dan praktis, 
          sehingga Anda dapat fokus pada peningkatan kualitas hafalan.
        </Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Selanjutnya</Text>
      </TouchableOpacity>

      <View style={styles.paginationContainer}>
        <View style={[styles.paginationDot, styles.activeDot]} />
        <View style={styles.paginationDot} />
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