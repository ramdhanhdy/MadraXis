import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ActivityIndicator } from 'react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish?: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.timing(scale, {
      toValue: 0.8,
      duration: 1000,
      useNativeDriver: true,
    });

    animation.start(() => {
      // Call the callback function instead of navigating directly
      onAnimationFinish?.();
    });

    return () => {
      animation.stop();
    };
  }, [scale]); // Removed onAnimationFinish to prevent infinite restart

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animationContainer, { transform: [{ scale }] }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Or your app's background color
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedSplashScreen;
