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
        onPlay={() => {
          console.log('Rive animation started');
        }}
        onStop={() => {
          console.log('Rive animation completed');
          handleFinish();
        }}
        onError={(error) => {
          console.error('Rive animation error:', error);
          // Trigger fallback UI by finishing the animation
          handleFinish();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  animation: {
    width: 300,
    height: 300,
  },
});

export default AnimatedSplashScreen;
