/**
 * Animation Design Tokens
 * Comprehensive animation system with duration scales, easing functions, and transition presets
 */

import { Easing } from 'react-native';

// Duration Scale - Consistent timing across the application
export const duration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
  slowest: 1000,
} as const;

// Easing Functions - CSS values for web compatibility
export const easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  // Custom easing curves
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Native Animation Easing - React Native Easing functions
export const nativeEasing = {
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  // Custom native easing
  spring: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  sharp: Easing.bezier(0.4, 0, 0.6, 1),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
} as const;

// Common Transition Presets
export const transitions = {
  // Fade transitions
  fade: {
    opacity: [0, 1] as number[],
    duration: duration.normal,
    easing: easing.smooth,
  },
  fadeIn: {
    opacity: [0, 1] as number[],
    duration: duration.fast,
    easing: easing.easeOut,
  },
  fadeOut: {
    opacity: [1, 0] as number[],
    duration: duration.fast,
    easing: easing.easeIn,
  },
  
  // Slide transitions
  slide: {
    transform: [{ translateY: 20 }, { translateY: 0 }] as Array<{ translateY: number }>,
    opacity: [0, 1] as number[],
    duration: duration.normal,
    easing: easing.smooth,
  },
  slideUp: {
    transform: [{ translateY: 20 }, { translateY: 0 }] as Array<{ translateY: number }>,
    duration: duration.normal,
    easing: easing.easeOut,
  },
  slideDown: {
    transform: [{ translateY: -20 }, { translateY: 0 }] as Array<{ translateY: number }>,
    duration: duration.normal,
    easing: easing.easeOut,
  },
  slideLeft: {
    transform: [{ translateX: 20 }, { translateX: 0 }] as Array<{ translateX: number }>,
    duration: duration.normal,
    easing: easing.easeOut,
  },
  slideRight: {
    transform: [{ translateX: -20 }, { translateX: 0 }] as Array<{ translateX: number }>,
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Scale transitions
  scale: {
    transform: [{ scale: 0.95 }, { scale: 1 }] as Array<{ scale: number }>,
    opacity: [0, 1] as number[],
    duration: duration.normal,
    easing: easing.spring,
  },
  scaleIn: {
    transform: [{ scale: 0.8 }, { scale: 1 }] as Array<{ scale: number }>,
    duration: duration.fast,
    easing: easing.easeOut,
  },
  scaleOut: {
    transform: [{ scale: 1 }, { scale: 0.8 }] as Array<{ scale: number }>,
    duration: duration.fast,
    easing: easing.easeIn,
  },

  // Bounce transitions
  bounce: {
    transform: [{ scale: 0.3 }, { scale: 1.05 }, { scale: 0.9 }, { scale: 1 }] as Array<{ scale: number }>,
    duration: duration.slow,
    easing: easing.bounce,
  },

  // Rotation transitions
  rotate: {
    transform: [{ rotate: '0deg' }, { rotate: '360deg' }] as Array<{ rotate: string }>,
    duration: duration.slow,
    easing: easing.linear,
  },
  
  // Modal transitions
  modal: {
    backdrop: {
      opacity: [0, 1] as number[],
      duration: duration.normal,
      easing: easing.smooth,
    },
    content: {
      transform: [{ scale: 0.9 }, { scale: 1 }] as Array<{ scale: number }>,
      opacity: [0, 1] as number[],
      duration: duration.normal,
      easing: easing.easeOut,
    },
  },

  // Tab transitions
  tab: {
    opacity: [0, 1] as number[],
    transform: [{ translateX: 10 }, { translateX: 0 }] as Array<{ translateX: number }>,
    duration: duration.fast,
    easing: easing.smooth,
  },

  // Button press transitions
  buttonPress: {
    transform: [{ scale: 1 }, { scale: 0.95 }, { scale: 1 }] as Array<{ scale: number }>,
    duration: duration.fast,
    easing: easing.easeInOut,
  },

  // Loading transitions
  loading: {
    opacity: [0.3, 1, 0.3] as number[],
    duration: duration.slower,
    easing: easing.easeInOut,
    repeat: true,
  },

  // Skeleton loading
  skeleton: {
    opacity: [0.4, 0.8, 0.4] as number[],
    duration: duration.slower,
    easing: easing.easeInOut,
    repeat: true,
  },
} as const;

// Role-specific animation preferences
export const roleAnimations = {
  student: {
    // Energetic, bouncy animations for Gen-Z appeal
    defaultDuration: duration.normal,
    defaultEasing: easing.spring,
    buttonPress: transitions.bounce,
    cardHover: {
      transform: [{ scale: 1 }, { scale: 1.02 }],
      duration: duration.fast,
      easing: easing.spring,
    },
  },
  teacher: {
    // Calm, smooth animations for professional feel
    defaultDuration: duration.normal,
    defaultEasing: easing.smooth,
    buttonPress: transitions.scaleIn,
    cardHover: {
      transform: [{ scale: 1 }, { scale: 1.01 }],
      duration: duration.normal,
      easing: easing.smooth,
    },
  },
  parent: {
    // Gentle, comfortable animations
    defaultDuration: duration.normal,
    defaultEasing: easing.easeInOut,
    buttonPress: transitions.scaleIn,
    cardHover: {
      opacity: [1, 0.9],
      duration: duration.fast,
      easing: easing.easeInOut,
    },
  },
  management: {
    // Crisp, efficient animations
    defaultDuration: duration.fast,
    defaultEasing: easing.sharp,
    buttonPress: transitions.scaleIn,
    cardHover: {
      transform: [{ scale: 1 }, { scale: 1.005 }],
      duration: duration.fast,
      easing: easing.sharp,
    },
  },
} as const;

// Reduced motion preferences for accessibility
export const reducedMotion = {
  duration: 0,
  easing: easing.linear,
  transitions: {
    fade: { opacity: [0, 1] as number[], duration: 0 },
    slide: { opacity: [0, 1] as number[], duration: 0 },
    scale: { opacity: [0, 1] as number[], duration: 0 },
  },
} as const;

// Micro-interaction animations
export const microInteractions = {
  // Button interactions
  buttonHover: {
    transform: [{ scale: 1 }, { scale: 1.02 }] as Array<{ scale: number }>,
    duration: duration.fast,
    easing: easing.easeOut,
  },
  buttonPress: {
    transform: [{ scale: 1 }, { scale: 0.98 }] as Array<{ scale: number }>,
    duration: duration.fast,
    easing: easing.easeIn,
  },
  buttonRelease: {
    transform: [{ scale: 0.98 }, { scale: 1 }] as Array<{ scale: number }>,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Card interactions
  cardHover: {
    transform: [{ translateY: 0 }, { translateY: -2 }] as Array<{ translateY: number }>,
    shadowOpacity: [0.1, 0.15] as number[],
    duration: duration.normal,
    easing: easing.smooth,
  },
  cardPress: {
    transform: [{ scale: 1 }, { scale: 0.99 }] as Array<{ scale: number }>,
    duration: duration.fast,
    easing: easing.easeIn,
  },

  // Input interactions
  inputFocus: {
    borderColor: ['transparent', 'primary.main'] as string[],
    shadowOpacity: [0, 0.1] as number[],
    duration: duration.fast,
    easing: easing.easeOut,
  },
  inputBlur: {
    borderColor: ['primary.main', 'transparent'] as string[],
    shadowOpacity: [0.1, 0] as number[],
    duration: duration.fast,
    easing: easing.easeIn,
  },

  // Toggle interactions
  toggleOn: {
    transform: [{ translateX: 0 }, { translateX: 20 }] as Array<{ translateX: number }>,
    backgroundColor: ['neutral.300', 'primary.main'] as string[],
    duration: duration.normal,
    easing: easing.smooth,
  },
  toggleOff: {
    transform: [{ translateX: 20 }, { translateX: 0 }] as Array<{ translateX: number }>,
    backgroundColor: ['primary.main', 'neutral.300'] as string[],
    duration: duration.normal,
    easing: easing.smooth,
  },
} as const;

// Performance-optimized animations
export const performanceAnimations = {
  // GPU-accelerated transforms only
  gpuOptimized: {
    fade: {
      opacity: [0, 1] as number[],
      duration: duration.normal,
      useNativeDriver: true,
    },
    slide: {
      transform: [{ translateY: 20 }, { translateY: 0 }] as Array<{ translateY: number }>,
      duration: duration.normal,
      useNativeDriver: true,
    },
    scale: {
      transform: [{ scale: 0.9 }, { scale: 1 }] as Array<{ scale: number }>,
      duration: duration.normal,
      useNativeDriver: true,
    },
  },

  // Layout animations (non-GPU accelerated)
  layoutAnimations: {
    expand: {
      height: [0, 'auto'] as (number | string)[],
      duration: duration.normal,
      useNativeDriver: false,
    },
    collapse: {
      height: ['auto', 0] as (string | number)[],
      duration: duration.normal,
      useNativeDriver: false,
    },
  },
} as const;

// Animation utilities
export const animationUtils = {
  // Check if user prefers reduced motion
  shouldReduceMotion: () => {
    // In React Native, this would check system preferences
    // For now, return false (will be enhanced in future iterations)
    return false;
  },

  // Get duration based on reduced motion preference
  getDuration: (normalDuration: number) => {
    return animationUtils.shouldReduceMotion() ? 0 : normalDuration;
  },

  // Get easing based on reduced motion preference
  getEasing: (normalEasing: string) => {
    return animationUtils.shouldReduceMotion() ? easing.linear : normalEasing;
  },

  // Create responsive animation config
  createResponsiveAnimation: (config: {
    normal: any;
    reduced: any;
  }) => {
    return animationUtils.shouldReduceMotion() ? config.reduced : config.normal;
  },

  // Create staggered animations
  createStaggeredAnimation: (
    baseAnimation: any,
    itemCount: number,
    staggerDelay: number = 100
  ) => {
    return Array.from({ length: itemCount }, (_, index) => ({
      ...baseAnimation,
      delay: index * staggerDelay,
    }));
  },

  // Create spring animation config
  createSpringConfig: (tension: number = 300, friction: number = 30) => ({
    type: 'spring',
    tension,
    friction,
    useNativeDriver: true,
  }),

  // Create timing animation config
  createTimingConfig: (duration: number, easing: string = 'easeOut') => ({
    type: 'timing',
    duration,
    easing: easing,
    useNativeDriver: true,
  }),
} as const;

// Export all animation tokens
export const animations = {
  duration,
  easing,
  nativeEasing,
  transitions,
  roleAnimations,
  reducedMotion,
  microInteractions,
  performanceAnimations,
  animationUtils,
} as const;

// Type definitions
export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;
export type TransitionKey = keyof typeof transitions;
export type RoleAnimationKey = keyof typeof roleAnimations;

export default animations;
