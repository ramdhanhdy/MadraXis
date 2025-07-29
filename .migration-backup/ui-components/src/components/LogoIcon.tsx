import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

interface LogoIconProps {
  width?: number;
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  width = 200,
  height = 200,
  primaryColor = '#005e7a',
  secondaryColor = '#ffffff',
  accentColor = '#f0c75e'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200" fill="none">
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="95" fill={primaryColor} />
      <Circle cx="100" cy="100" r="85" fill={secondaryColor} />
      
      {/* Open Book Symbol */}
      <Path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill={primaryColor} />
      <Path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill={primaryColor} />
      <Path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill={secondaryColor} />
      <Path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill={secondaryColor} />
      
      {/* Arabic-inspired Decorative Element */}
      <Path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill={accentColor} />
      <Path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill={accentColor} />
      <Path d="M120 45C120 45 110 50 120 55C130 50 120 45 120 45Z" fill={accentColor} />
      
      {/* Text "ZBT" */}
      <Path d="M70 160H130V170H70V160Z" fill={primaryColor} />
      <Path d="M70 160L130 160L100 145L70 160Z" fill={primaryColor} />
      <Path d="M85 170V180H115V170" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
    </Svg>
  );
}; 