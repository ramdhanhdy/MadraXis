import React from 'react';
import { SvgXml } from 'react-native-svg';

interface BackgroundPatternProps {
  color?: string;
  opacity?: number;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ 
  color = '#006e8a', 
  opacity = 0.1 
}) => {
  const patternSvg = `
    <svg width="100%" height="100%" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="375" height="812" fill="none"/>
      
      <!-- Islamic Geometric Pattern -->
      <g opacity="${opacity}">
        <!-- Repeating Pattern -->
        <g fill="${color}">
          <!-- Row 1 -->
          <path d="M0 0 L50 0 L25 43.3 Z" />
          <path d="M50 0 L100 0 L75 43.3 Z" />
          <path d="M100 0 L150 0 L125 43.3 Z" />
          <path d="M150 0 L200 0 L175 43.3 Z" />
          <path d="M200 0 L250 0 L225 43.3 Z" />
          <path d="M250 0 L300 0 L275 43.3 Z" />
          <path d="M300 0 L350 0 L325 43.3 Z" />
          <path d="M350 0 L400 0 L375 43.3 Z" />
          
          <!-- Row 2 -->
          <path d="M25 43.3 L75 43.3 L50 86.6 Z" />
          <path d="M75 43.3 L125 43.3 L100 86.6 Z" />
          <path d="M125 43.3 L175 43.3 L150 86.6 Z" />
          <path d="M175 43.3 L225 43.3 L200 86.6 Z" />
          <path d="M225 43.3 L275 43.3 L250 86.6 Z" />
          <path d="M275 43.3 L325 43.3 L300 86.6 Z" />
          <path d="M325 43.3 L375 43.3 L350 86.6 Z" />
          
          <!-- Row 3 -->
          <path d="M0 86.6 L50 86.6 L25 129.9 Z" />
          <path d="M50 86.6 L100 86.6 L75 129.9 Z" />
          <path d="M100 86.6 L150 86.6 L125 129.9 Z" />
          <path d="M150 86.6 L200 86.6 L175 129.9 Z" />
          <path d="M200 86.6 L250 86.6 L225 129.9 Z" />
          <path d="M250 86.6 L300 86.6 L275 129.9 Z" />
          <path d="M300 86.6 L350 86.6 L325 129.9 Z" />
          <path d="M350 86.6 L400 86.6 L375 129.9 Z" />
          
          <!-- Repeating for more rows -->
          <!-- Row 4 -->
          <path d="M25 129.9 L75 129.9 L50 173.2 Z" />
          <path d="M75 129.9 L125 129.9 L100 173.2 Z" />
          <path d="M125 129.9 L175 129.9 L150 173.2 Z" />
          <path d="M175 129.9 L225 129.9 L200 173.2 Z" />
          <path d="M225 129.9 L275 129.9 L250 173.2 Z" />
          <path d="M275 129.9 L325 129.9 L300 173.2 Z" />
          <path d="M325 129.9 L375 129.9 L350 173.2 Z" />
          
          <!-- Row 5 -->
          <path d="M0 173.2 L50 173.2 L25 216.5 Z" />
          <path d="M50 173.2 L100 173.2 L75 216.5 Z" />
          <path d="M100 173.2 L150 173.2 L125 216.5 Z" />
          <path d="M150 173.2 L200 173.2 L175 216.5 Z" />
          <path d="M200 173.2 L250 173.2 L225 216.5 Z" />
          <path d="M250 173.2 L300 173.2 L275 216.5 Z" />
          <path d="M300 173.2 L350 173.2 L325 216.5 Z" />
          <path d="M350 173.2 L400 173.2 L375 216.5 Z" />
          
          <!-- Continue pattern for full height -->
          <!-- Additional rows would follow the same pattern -->
          
          <!-- Star patterns scattered throughout -->
          <path d="M100 300 L110 320 L130 320 L115 335 L120 355 L100 345 L80 355 L85 335 L70 320 L90 320 Z" />
          <path d="M250 400 L260 420 L280 420 L265 435 L270 455 L250 445 L230 455 L235 435 L220 420 L240 420 Z" />
          <path d="M150 500 L160 520 L180 520 L165 535 L170 555 L150 545 L130 555 L135 535 L120 520 L140 520 Z" />
          <path d="M300 600 L310 620 L330 620 L315 635 L320 655 L300 645 L280 655 L285 635 L270 620 L290 620 Z" />
          <path d="M200 700 L210 720 L230 720 L215 735 L220 755 L200 745 L180 755 L185 735 L170 720 L190 720 Z" />
        </g>
      </g>
      
      <!-- Decorative circles -->
      <circle cx="350" cy="150" r="100" fill="${color}" opacity="${opacity * 5}"/>
      <circle cx="50" cy="400" r="150" fill="${color}" opacity="${opacity * 3}"/>
      <circle cx="300" cy="700" r="120" fill="${color}" opacity="${opacity * 4}"/>
    </svg>
  `;

  return <SvgXml xml={patternSvg} width="100%" height="100%" />;
};

export default BackgroundPattern; 