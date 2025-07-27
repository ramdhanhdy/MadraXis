import { logger } from '../../utils/logger';
import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Rive from 'rive-react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
  const hasFinished = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFinish = useCallback(() => {
    if (!hasFinished.current && onAnimationFinish) {
      hasFinished.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      onAnimationFinish();
    }
  }, [onAnimationFinish]);

  useEffect(() => {
    // Fallback timeout in case animation doesn't trigger completion
    timeoutRef.current = setTimeout(() => {
      handleFinish();
    }, 4000); // Slightly longer to allow animation to complete naturally

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleFinish]);

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
          // Continue with a timeout fallback instead of immediately finishing
          setTimeout(() => {
            handleFinish();
          }, 2000);
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
  }
});

export default AnimatedSplashScreen;