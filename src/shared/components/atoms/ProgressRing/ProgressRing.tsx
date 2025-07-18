import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-100
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  duration?: number;
  pulse?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = '#E5E7EB',
  duration = 1000,
  pulse = false,
}) => {
  const animatedProgress = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, duration]);

  useEffect(() => {
    if (pulse) {
      const pulseLoop = () => {
        pulseAnimation.value = withTiming(1.1, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }, () => {
          pulseAnimation.value = withTiming(1, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }, () => {
            // Repeat the pulse every 2 seconds
            setTimeout(pulseLoop, 2000);
          });
        });
      };
      pulseLoop();
    }
  }, [pulse]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (animatedProgress.value / 100) * circumference;
    
    return {
      strokeDashoffset,
      transform: pulse ? [{ scale: pulseAnimation.value }] : undefined,
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
    </View>
  );
};

export default ProgressRing;
