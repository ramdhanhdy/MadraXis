import { logger } from '../../utils/logger';
import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
  const hasFinished = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const handleFinish = useCallback(() => {
    if (hasFinished.current) return; // Prevent multiple calls
    hasFinished.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    logger.debug('🎬 Simple animation finished, calling onAnimationFinish');
    onAnimationFinish?.();
  }, [onAnimationFinish]);

  useEffect(() => {
    // Start the simple animation
    logger.debug('🎬 Starting simple splash animation');

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-finish after animation completes
    timeoutRef.current = setTimeout(() => {
      handleFinish();
    }, 1500); // 1.5 second total duration

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleFinish, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={styles.logoText}>MadraXis</Text>
        <Text style={styles.taglineText}>Sistem Manajemen Madrasah</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 12,
    letterSpacing: 1
  },
  taglineText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '300'
  }
});

export default AnimatedSplashScreen;