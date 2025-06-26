import React from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

const AnimatedSplashScreen = ({ onAnimationFinish }: AnimatedSplashScreenProps) => {
  return (
    <LottieView
      source={require('../../assets/animations/splash.json')}
      style={styles.container}
      autoPlay
      loop={false}
      onAnimationFinish={onAnimationFinish}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Match this to your animation's background or app theme
  },
});

export default AnimatedSplashScreen;
