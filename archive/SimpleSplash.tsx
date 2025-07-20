import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';

interface SimpleSplashProps {
  onFinish?: () => void;
}

export default function SimpleSplash({ onFinish }: SimpleSplashProps) {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    console.log('SimpleSplash mounted');
    
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
      console.log('Animation completed');
      // Call onFinish callback
      if (onFinish) {
        console.log('Calling onFinish');
        onFinish();
      }
    });

    // Cleanup function
    return () => {
      console.log('SimpleSplash unmounted');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>Simple Splash Screen</Text>
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>ZBT</Text>
        </View>
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
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffffff',
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