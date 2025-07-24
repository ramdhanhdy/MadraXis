import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Rive from 'rive-react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish?: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
  useEffect(() => {
    // Auto finish after 3 seconds to allow animation to complete
    const timer = setTimeout(() => {
      onAnimationFinish?.();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onAnimationFinish]);

  return (
    <View style={styles.container}>
      <Rive
        resourceName="splash_screen"
        autoplay={true}
        style={styles.animation}
        onPlay={() => {
          console.log('Rive animation started');
        }}
        onPause={() => {
          console.log('Rive animation paused');
          onAnimationFinish?.();
        }}
        onStop={() => {
          console.log('Rive animation stopped');
          onAnimationFinish?.();
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
