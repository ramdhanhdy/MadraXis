import { logger } from '../../utils/logger';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Rive from 'rive-react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
  const hasFinished = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animationError, setAnimationError] = useState(false);

  const handleFinish = useCallback(() => {
    if (hasFinished.current) return; // Prevent multiple calls
    hasFinished.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    logger.debug('🎬 Animation finishing, calling onAnimationFinish');
    onAnimationFinish?.();
  }, [onAnimationFinish]);

  useEffect(() => {
    // Fallback timeout in case animation doesn't trigger completion
    timeoutRef.current = setTimeout(() => {
      handleFinish();
    }, 3000); // 3 second timeout for better UX

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleFinish]);

  // Render fallback UI if animation fails
  if (animationError) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>MadraXis</Text>
          <Text style={styles.fallbackSubtext}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Rive
        resourceName="splash_screen"
        autoplay={true}
        style={styles.animation}
        artboardName="Artboard"
        stateMachineName="State Machine 1"
        onPlay={() => {
          logger.debug('Rive animation started');
        }}
        onStop={() => {
          logger.debug('Rive animation completed');
          handleFinish();
        }}
        onError={(error) => {
          logger.warn('Rive animation error (continuing anyway):', error);
          setAnimationError(true);
          // Continue with a timeout fallback instead of immediately finishing
          setTimeout(() => {
            handleFinish();
          }, 1500); // Shorter timeout for error case
        }} />

    </View>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  animation: {
    width: 300,
    height: 300
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  fallbackText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 8
  },
  fallbackSubtext: {
    fontSize: 16,
    color: '#666666'
  }
});

export default AnimatedSplashScreen;