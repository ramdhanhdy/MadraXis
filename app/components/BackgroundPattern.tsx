import React from 'react';
import { BackgroundPattern as DesignSystemBackgroundPattern } from '../../src/components/atoms/BackgroundPattern';

// Update app/components/BackgroundPattern.tsx to use the atomic design system
const BackgroundPattern: React.FC<{ color?: string; opacity?: number }> = ({ 
  color, 
  opacity = 0.1 
}) => {
  return (
    <DesignSystemBackgroundPattern
      color={color}
      opacity={opacity}
      variant="geometric"
      intensity={opacity <= 0.05 ? "subtle" : opacity <= 0.08 ? "light" : opacity <= 0.12 ? "medium" : "strong"}
    />
  );
};

export default BackgroundPattern;