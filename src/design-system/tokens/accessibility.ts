/**
 * Accessibility Design Tokens
 * Comprehensive accessibility tokens for inclusive design and WCAG compliance
 */

// Touch Target Sizes - Minimum sizes for interactive elements
export const touchTargets = {
  minimum: 44,      // WCAG minimum touch target size
  comfortable: 48,  // Comfortable touch target size
  large: 56,        // Large touch target for better accessibility
  extraLarge: 64,   // Extra large for users with motor difficulties
} as const;

// Focus Ring Specifications - Visible focus indicators
export const focusRing = {
  width: 2,
  offset: 2,
  color: 'primary.main', // Will be resolved to actual color in theme
  style: 'solid',
  borderRadius: 4,
  // Alternative focus styles
  styles: {
    default: {
      width: 2,
      offset: 2,
      style: 'solid',
    },
    thick: {
      width: 3,
      offset: 3,
      style: 'solid',
    },
    dashed: {
      width: 2,
      offset: 2,
      style: 'dashed',
    },
    glow: {
      width: 0,
      offset: 0,
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
    },
  },
} as const;

// Contrast Requirements - WCAG compliance levels
export const contrast = {
  // Required properties for interface compatibility
  minimum: 4.5,
  enhanced: 7.0,

  // WCAG AA requirements
  aa: {
    normal: 4.5,      // Normal text (< 18pt or < 14pt bold)
    large: 3.0,       // Large text (≥ 18pt or ≥ 14pt bold)
    nonText: 3.0,     // Non-text elements (icons, borders, etc.)
  },
  // WCAG AAA requirements
  aaa: {
    normal: 7.0,      // Normal text
    large: 4.5,       // Large text
    nonText: 3.0,     // Non-text elements
  },
  // Enhanced contrast for better readability
  enhancedLevels: {
    normal: 8.0,      // Enhanced normal text
    large: 5.0,       // Enhanced large text
    nonText: 4.0,     // Enhanced non-text elements
  },
} as const;

// Typography Accessibility - Font sizes and line heights for readability
export const accessibleTypography = {
  // Minimum font sizes
  minFontSize: {
    mobile: 16,       // Minimum for mobile devices
    tablet: 14,       // Minimum for tablets
    desktop: 12,      // Minimum for desktop
  },
  
  // Line height ratios for readability
  lineHeight: {
    tight: 1.2,       // For headings
    normal: 1.5,      // For body text (WCAG recommended)
    loose: 1.8,       // For improved readability
  },
  
  // Letter spacing for readability
  letterSpacing: {
    tight: -0.025,    // For large headings
    normal: 0,        // Default
    wide: 0.025,      // For improved readability
    wider: 0.05,      // For accessibility
  },
} as const;

// Reduced Motion Preferences - Respect user motion preferences
export const reducedMotion = {
  duration: 0,
  easing: 'linear',
  // Alternative animations for reduced motion
  alternatives: {
    fade: { opacity: [0, 1], duration: 0 },
    slide: { opacity: [0, 1], duration: 0 },
    scale: { opacity: [0, 1], duration: 0 },
  },
  // Indicators for motion-sensitive content
  indicators: {
    autoplay: false,
    parallax: false,
    backgroundVideo: false,
  },
} as const;

// Color Accessibility - Color-blind friendly considerations
export const colorAccessibility = {
  // Color-blind safe color combinations
  colorBlindSafe: {
    // Red-green color blind safe alternatives
    redGreenSafe: {
      error: '#D32F2F',     // Red that's distinguishable
      success: '#1976D2',   // Blue instead of green
      warning: '#F57C00',   // Orange
    },
    // Blue-yellow color blind safe alternatives
    blueYellowSafe: {
      primary: '#8E24AA',   // Purple instead of blue
      warning: '#D32F2F',   // Red instead of yellow
      info: '#00796B',      // Teal
    },
  },
  
  // Pattern and texture alternatives for color coding
  patterns: {
    error: 'diagonal-lines',
    warning: 'dots',
    success: 'checkered',
    info: 'waves',
  },
} as const;

// Screen Reader Support - ARIA and semantic considerations
export const screenReader = {
  // ARIA label requirements
  ariaLabels: {
    required: true,
    descriptive: true,
    concise: true,
  },
  
  // Semantic HTML requirements
  semanticElements: {
    headings: 'hierarchical',  // h1 -> h2 -> h3, etc.
    landmarks: 'required',     // nav, main, aside, etc.
    lists: 'structured',       // ul, ol, dl
  },
  
  // Skip links for navigation
  skipLinks: {
    enabled: true,
    targets: ['main', 'navigation', 'search'],
    position: 'top-left',
    zIndex: 9999,
  },
} as const;

// Keyboard Navigation - Keyboard accessibility requirements
export const keyboardNavigation = {
  // Tab order requirements
  tabOrder: {
    logical: true,
    visible: true,
    trapped: false, // For modals
  },
  
  // Keyboard shortcuts
  shortcuts: {
    escape: 'close-modal',
    enter: 'activate',
    space: 'select',
    arrows: 'navigate',
  },
  
  // Focus management
  focusManagement: {
    visible: true,
    trapped: false,
    restored: true, // Return focus after modal close
  },
} as const;

// High Contrast Mode Support
export const highContrast = {
  // High contrast color scheme
  colors: {
    background: '#000000',
    foreground: '#FFFFFF',
    accent: '#FFFF00',
    border: '#FFFFFF',
  },
  
  // Border requirements for high contrast
  borders: {
    width: 2,
    style: 'solid',
    required: true,
  },
  
  // Text requirements
  text: {
    weight: 'bold',
    decoration: 'underline', // For links
  },
} as const;

// Mobile Accessibility - Touch and gesture considerations
export const mobileAccessibility = {
  // Gesture alternatives
  gestures: {
    swipe: 'button-alternative',
    pinch: 'button-alternative',
    longPress: 'double-tap-alternative',
  },
  
  // Touch feedback
  feedback: {
    haptic: true,
    visual: true,
    audio: false, // Optional
  },
  
  // Orientation support
  orientation: {
    portrait: true,
    landscape: true,
    locked: false,
  },
} as const;

// Voice Control and Speech Recognition
export const voiceControl = {
  // Voice command targets
  commands: {
    navigation: ['go to', 'navigate to', 'open'],
    actions: ['click', 'tap', 'select', 'activate'],
    forms: ['fill', 'enter', 'type', 'submit'],
    content: ['read', 'scroll', 'search'],
  },

  // Voice feedback
  feedback: {
    confirmation: true,
    error: true,
    progress: true,
    completion: true,
  },
} as const;

// Cognitive Accessibility
export const cognitiveAccessibility = {
  // Content simplification
  content: {
    plainLanguage: true,
    shortSentences: true,
    clearHeadings: true,
    consistentNavigation: true,
  },

  // Memory aids
  memoryAids: {
    breadcrumbs: true,
    progressIndicators: true,
    confirmationDialogs: true,
    undoActions: true,
  },

  // Attention and focus
  attention: {
    minimizeDistractions: true,
    clearFocusIndicators: true,
    logicalTabOrder: true,
    timeoutWarnings: true,
  },
} as const;

// Motor Accessibility
export const motorAccessibility = {
  // Alternative input methods
  inputMethods: {
    keyboard: true,
    voice: true,
    eyeTracking: false, // Future enhancement
    switchControl: true,
  },

  // Gesture alternatives
  gestureAlternatives: {
    swipe: 'button',
    pinch: 'button',
    longPress: 'double-tap',
    drag: 'button-sequence',
  },

  // Timing considerations
  timing: {
    noTimeouts: true,
    adjustableTimeouts: true,
    pauseableContent: true,
    extendedInteractionTime: true,
  },
} as const;

// Visual Accessibility
export const visualAccessibility = {
  // Low vision support
  lowVision: {
    highContrast: true,
    largeText: true,
    customColors: true,
    magnification: true,
  },

  // Blindness support
  blindness: {
    screenReader: true,
    altText: true,
    descriptiveLinks: true,
    structuredContent: true,
  },

  // Color vision deficiency
  colorVision: {
    colorBlindSafe: true,
    patternAlternatives: true,
    textLabels: true,
    iconSupport: true,
  },
} as const;

// Hearing Accessibility
export const hearingAccessibility = {
  // Deaf and hard of hearing support
  deafHardOfHearing: {
    captions: true,
    transcripts: true,
    signLanguage: false, // Future enhancement
    visualAlerts: true,
  },

  // Audio alternatives
  audioAlternatives: {
    visualFeedback: true,
    hapticFeedback: true,
    textNotifications: true,
    flashingAlerts: true,
  },
} as const;

// Accessibility Testing Utilities
export const testing = {
  // Automated testing requirements
  automated: {
    colorContrast: true,
    keyboardNavigation: true,
    screenReader: true,
    focusManagement: true,
    altText: true,
    headingStructure: true,
  },

  // Manual testing checklist
  manual: {
    screenReader: ['NVDA', 'JAWS', 'VoiceOver', 'TalkBack'],
    keyboard: 'tab-navigation',
    colorBlind: 'simulator-tools',
    zoom: '200-percent',
    voiceControl: 'dragon-naturally-speaking',
    switchControl: 'hardware-switches',
  },

  // Testing tools and simulators
  tools: {
    contrastCheckers: ['WebAIM', 'Colour Contrast Analyser'],
    screenReaders: ['NVDA', 'JAWS', 'VoiceOver', 'TalkBack'],
    colorBlindSimulators: ['Stark', 'Colorblinding'],
    keyboardTesting: 'manual-tab-navigation',
  },
} as const;

// Export all accessibility tokens
export const accessibility = {
  touchTargets,
  focusRing,
  contrast,
  accessibleTypography,
  reducedMotion,
  colorAccessibility,
  screenReader,
  keyboardNavigation,
  highContrast,
  mobileAccessibility,
  voiceControl,
  cognitiveAccessibility,
  motorAccessibility,
  visualAccessibility,
  hearingAccessibility,
  testing,
} as const;

// Type definitions
export type TouchTargetKey = keyof typeof touchTargets;
export type ContrastLevel = keyof typeof contrast;
export type FocusRingStyle = keyof typeof focusRing.styles;

export default accessibility;
