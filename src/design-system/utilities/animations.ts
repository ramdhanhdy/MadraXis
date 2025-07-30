/**
 * Animation Utilities for Component Theming
 * Provides helper functions for consistent animations across components
 */

import { Animated, Easing } from 'react-native';
import { Theme } from '../core/types';

// Animation configuration types
export interface AnimationConfig {
  duration: number;
  easing: any;
  useNativeDriver?: boolean;
  delay?: number;
}

export interface TransitionConfig extends AnimationConfig {
  property: 'opacity' | 'scale' | 'translateX' | 'translateY' | 'rotate';
  fromValue: number;
  toValue: number;
}

/**
 * Create animation configuration from theme
 */
export function createAnimationConfig(
  theme: Theme,
  speed: 'instant' | 'fast' | 'normal' | 'slow' = 'normal',
  easingType: 'linear' | 'ease' | 'spring' | 'bounce' = 'ease'
): AnimationConfig {
  const animations = theme.animations || {};
  const duration = animations.duration?.[speed] || theme.duration?.[speed] || 300;
  
  const easingMap = {
    linear: Easing.linear,
    ease: Easing.ease,
    spring: Easing.elastic(1),
    bounce: Easing.bounce,
  };
  
  return {
    duration,
    easing: easingMap[easingType] || Easing.ease,
    useNativeDriver: true,
  };
}

/**
 * Fade animation utilities
 */
export class FadeAnimation {
  private animatedValue: Animated.Value;
  
  constructor(initialValue = 0) {
    this.animatedValue = new Animated.Value(initialValue);
  }
  
  fadeIn(config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  fadeOut(config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  getValue() {
    return this.animatedValue;
  }
}

/**
 * Scale animation utilities
 */
export class ScaleAnimation {
  private animatedValue: Animated.Value;
  
  constructor(initialValue = 1) {
    this.animatedValue = new Animated.Value(initialValue);
  }
  
  scaleIn(config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.spring(this.animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  scaleOut(config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  pulse(config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(this.animatedValue, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
          ...config,
        }),
        Animated.timing(this.animatedValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          ...config,
        }),
      ]).start(() => resolve());
    });
  }
  
  getValue() {
    return this.animatedValue;
  }
}

/**
 * Slide animation utilities
 */
export class SlideAnimation {
  private animatedValue: Animated.Value;
  
  constructor(initialValue = 0) {
    this.animatedValue = new Animated.Value(initialValue);
  }
  
  slideInFromLeft(distance = 100, config?: Partial<AnimationConfig>): Promise<void> {
    this.animatedValue.setValue(-distance);
    return new Promise((resolve) => {
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  slideInFromRight(distance = 100, config?: Partial<AnimationConfig>): Promise<void> {
    this.animatedValue.setValue(distance);
    return new Promise((resolve) => {
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  slideOutToLeft(distance = 100, config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.timing(this.animatedValue, {
        toValue: -distance,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  slideOutToRight(distance = 100, config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.timing(this.animatedValue, {
        toValue: distance,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
        ...config,
      }).start(() => resolve());
    });
  }
  
  getValue() {
    return this.animatedValue;
  }
}

/**
 * Rotation animation utilities
 */
export class RotationAnimation {
  private animatedValue: Animated.Value;
  
  constructor(initialValue = 0) {
    this.animatedValue = new Animated.Value(initialValue);
  }
  
  rotate360(config?: Partial<AnimationConfig>): Promise<void> {
    return new Promise((resolve) => {
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
        ...config,
      }).start(() => {
        this.animatedValue.setValue(0);
        resolve();
      });
    });
  }
  
  getRotationStyle() {
    return {
      transform: [{
        rotate: this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      }],
    };
  }
  
  getValue() {
    return this.animatedValue;
  }
}

/**
 * Component-specific animation presets
 */
export class ComponentAnimations {
  constructor(private theme: Theme) {}
  
  /**
   * Button press animation
   */
  createButtonPressAnimation(): ScaleAnimation {
    const animation = new ScaleAnimation(1);
    const config = createAnimationConfig(this.theme, 'fast', 'spring');
    
    return {
      ...animation,
      press: () => animation.scaleOut({ ...config, toValue: 0.95 } as any),
      release: () => animation.scaleIn(config as any),
    } as any;
  }
  
  /**
   * Modal entrance animation
   */
  createModalAnimation() {
    const fadeAnimation = new FadeAnimation(0);
    const scaleAnimation = new ScaleAnimation(0.8);
    const config = createAnimationConfig(this.theme, 'normal', 'spring');
    
    return {
      show: async () => {
        await Promise.all([
          fadeAnimation.fadeIn(config),
          scaleAnimation.scaleIn(config),
        ]);
      },
      hide: async () => {
        await Promise.all([
          fadeAnimation.fadeOut(config),
          scaleAnimation.scaleOut(config),
        ]);
      },
      getStyle: () => ({
        opacity: fadeAnimation.getValue(),
        transform: [{ scale: scaleAnimation.getValue() }],
      }),
    };
  }
  
  /**
   * Card hover animation
   */
  createCardHoverAnimation() {
    const scaleAnimation = new ScaleAnimation(1);
    const config = createAnimationConfig(this.theme, 'fast', 'ease');
    
    return {
      hover: () => scaleAnimation.pulse(config),
      getStyle: () => ({
        transform: [{ scale: scaleAnimation.getValue() }],
      }),
    };
  }
  
  /**
   * Loading spinner animation
   */
  createSpinnerAnimation() {
    const rotationAnimation = new RotationAnimation(0);
    const config = createAnimationConfig(this.theme, 'normal', 'linear');
    
    const startSpinning = () => {
      const spin = () => {
        rotationAnimation.rotate360(config).then(() => {
          spin(); // Continue spinning
        });
      };
      spin();
    };
    
    return {
      start: startSpinning,
      getStyle: () => rotationAnimation.getRotationStyle(),
    };
  }
  
  /**
   * Tab transition animation
   */
  createTabTransition() {
    const slideAnimation = new SlideAnimation(0);
    const fadeAnimation = new FadeAnimation(1);
    const config = createAnimationConfig(this.theme, 'normal', 'ease');
    
    return {
      slideLeft: () => slideAnimation.slideInFromLeft(100, config),
      slideRight: () => slideAnimation.slideInFromRight(100, config),
      fade: () => fadeAnimation.fadeIn(config),
      getStyle: () => ({
        opacity: fadeAnimation.getValue(),
        transform: [{ translateX: slideAnimation.getValue() }],
      }),
    };
  }
}

/**
 * Micro-interaction animations
 */
export function createMicroInteraction(
  theme: Theme,
  type: 'tap' | 'hover' | 'focus' | 'success' | 'error'
) {
  const animations = theme.animations?.microInteractions || {};
  const config = createAnimationConfig(theme, 'fast', 'spring');
  
  const microInteractionMap = {
    tap: () => {
      const scale = new ScaleAnimation(1);
      return {
        start: () => scale.pulse(config),
        getStyle: () => ({ transform: [{ scale: scale.getValue() }] }),
      };
    },
    hover: () => {
      const scale = new ScaleAnimation(1);
      return {
        start: () => scale.scaleIn({ ...config, toValue: 1.05 } as any),
        end: () => scale.scaleIn({ ...config, toValue: 1 } as any),
        getStyle: () => ({ transform: [{ scale: scale.getValue() }] }),
      };
    },
    focus: () => {
      const scale = new ScaleAnimation(1);
      return {
        start: () => scale.scaleIn({ ...config, toValue: 1.02 } as any),
        end: () => scale.scaleIn({ ...config, toValue: 1 } as any),
        getStyle: () => ({ transform: [{ scale: scale.getValue() }] }),
      };
    },
    success: () => {
      const scale = new ScaleAnimation(1);
      return {
        start: () => scale.pulse({ ...config, duration: 200 }),
        getStyle: () => ({ transform: [{ scale: scale.getValue() }] }),
      };
    },
    error: () => {
      const shake = new SlideAnimation(0);
      return {
        start: () => {
          Animated.sequence([
            Animated.timing(shake.getValue(), { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shake.getValue(), { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shake.getValue(), { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shake.getValue(), { toValue: 0, duration: 50, useNativeDriver: true }),
          ]).start();
        },
        getStyle: () => ({ transform: [{ translateX: shake.getValue() }] }),
      };
    },
  };
  
  return microInteractionMap[type]();
}
