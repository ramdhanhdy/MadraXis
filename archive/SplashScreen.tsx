import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { router } from 'expo-router';

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    console.log('SplashScreen dimuat');
    
    // Start animations in sequence
    Animated.sequence([
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]),
      
      // Hold for a moment
      Animated.delay(2000),
      
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start(() => {
      console.log('Animasi selesai');
      // Navigate to main screen or call onFinish callback
      if (onFinish) {
        console.log('Memanggil onFinish');
        onFinish();
      } else {
        console.log('Navigasi ke beranda');
        router.replace('home' as any);
      }
    });

    // Cleanup function
    return () => {
      console.log('SplashScreen dihapus');
    };
  }, []);

  // Calculate rotation interpolation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Render a simple logo instead of SVG
  const renderLogo = () => (
    <View style={styles.logoPlaceholder}>
      <View style={styles.bookContainer}>
        <View style={styles.bookLeft} />
        <View style={styles.bookRight} />
      </View>
      <Text style={styles.logoText}>ZBT</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>Memuat...</Text>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: spin }
            ],
          },
        ]}
      >
        {renderLogo()}
      </Animated.View>
      
      <Animated.Text
        style={[
          styles.schoolName,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })}],
          },
        ]}
      >
        Zaid Bin Tsabit
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 70,
  },
  bookLeft: {
    width: 50,
    height: 60,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    transform: [{skewY: '-15deg'}],
  },
  bookRight: {
    width: 50,
    height: 60,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    transform: [{skewY: '15deg'}],
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
  },
  schoolName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    letterSpacing: 1,
  },
  debugText: {
    position: 'absolute',
    top: 40,
    fontSize: 12,
    color: '#999',
  },
}); 