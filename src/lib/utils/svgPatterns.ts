/**
 * SVG Pattern Utilities
 * Utilities for creating and managing SVG patterns and graphics
 */

export interface SVGPatternConfig {
  id: string;
  width: number;
  height: number;
  patternUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  patternContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  patternTransform?: string;
}

export interface SVGElementConfig {
  type: 'circle' | 'rect' | 'line' | 'path' | 'polygon';
  attributes: Record<string, string | number>;
}

/**
 * Create SVG pattern definition
 */
export const createSVGPattern = (
  config: SVGPatternConfig,
  elements: SVGElementConfig[]
): string => {
  const {
    id,
    width,
    height,
    patternUnits = 'userSpaceOnUse',
    patternContentUnits = 'userSpaceOnUse',
    patternTransform,
  } = config;

  const transformAttr = patternTransform ? ` patternTransform="${patternTransform}"` : '';
  
  const elementsString = elements
    .map(element => createSVGElement(element))
    .join('\n    ');

  return `
    <pattern id="${id}" 
             width="${width}" 
             height="${height}"
             patternUnits="${patternUnits}"
             patternContentUnits="${patternContentUnits}"${transformAttr}>
      ${elementsString}
    </pattern>
  `;
};

/**
 * Create individual SVG element
 */
export const createSVGElement = (config: SVGElementConfig): string => {
  const { type, attributes } = config;
  
  const attributeString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  return `<${type} ${attributeString} />`;
};

/**
 * Predefined pattern generators
 */
export const patternGenerators = {
  dots: (size: number = 4, spacing: number = 20, color: string = '#000000', opacity: number = 0.1) => ({
    id: 'dots-pattern',
    width: spacing,
    height: spacing,
    elements: [
      {
        type: 'circle' as const,
        attributes: {
          cx: spacing / 2,
          cy: spacing / 2,
          r: size / 2,
          fill: color,
          opacity,
        },
      },
    ],
  }),

  grid: (strokeWidth: number = 1, spacing: number = 20, color: string = '#000000', opacity: number = 0.1) => ({
    id: 'grid-pattern',
    width: spacing,
    height: spacing,
    elements: [
      {
        type: 'path' as const,
        attributes: {
          d: `M ${spacing} 0 L 0 0 0 ${spacing}`,
          fill: 'none',
          stroke: color,
          'stroke-width': strokeWidth,
          opacity,
        },
      },
    ],
  }),

  diagonal: (strokeWidth: number = 2, spacing: number = 20, color: string = '#000000', opacity: number = 0.1) => ({
    id: 'diagonal-pattern',
    width: spacing,
    height: spacing,
    elements: [
      {
        type: 'path' as const,
        attributes: {
          d: `M 0,${spacing} L ${spacing},0`,
          stroke: color,
          'stroke-width': strokeWidth,
          opacity,
        },
      },
    ],
  }),

  crosshatch: (strokeWidth: number = 1, spacing: number = 20, color: string = '#000000', opacity: number = 0.1) => ({
    id: 'crosshatch-pattern',
    width: spacing,
    height: spacing,
    elements: [
      {
        type: 'path' as const,
        attributes: {
          d: `M 0,${spacing} L ${spacing},0 M 0,0 L ${spacing},${spacing}`,
          stroke: color,
          'stroke-width': strokeWidth,
          opacity,
        },
      },
    ],
  }),

  hexagon: (size: number = 8, spacing: number = 20, color: string = '#000000', opacity: number = 0.1) => {
    const hexSize = size;
    const centerX = spacing / 2;
    const centerY = spacing / 2;
    const points = [
      [centerX, centerY - hexSize],
      [centerX + hexSize * 0.866, centerY - hexSize / 2],
      [centerX + hexSize * 0.866, centerY + hexSize / 2],
      [centerX, centerY + hexSize],
      [centerX - hexSize * 0.866, centerY + hexSize / 2],
      [centerX - hexSize * 0.866, centerY - hexSize / 2],
    ].map(([x, y]) => `${x},${y}`).join(' ');

    return {
      id: 'hexagon-pattern',
      width: spacing,
      height: spacing,
      elements: [
        {
          type: 'polygon' as const,
          attributes: {
            points,
            fill: 'none',
            stroke: color,
            'stroke-width': 1,
            opacity,
          },
        },
      ],
    };
  },

  waves: (amplitude: number = 4, frequency: number = 2, spacing: number = 20, color: string = '#000000', opacity: number = 0.1) => {
    const path = `M 0,${spacing / 2} Q ${spacing / 4},${spacing / 2 - amplitude} ${spacing / 2},${spacing / 2} T ${spacing},${spacing / 2}`;
    
    return {
      id: 'waves-pattern',
      width: spacing,
      height: spacing,
      elements: [
        {
          type: 'path' as const,
          attributes: {
            d: path,
            stroke: color,
            'stroke-width': 2,
            fill: 'none',
            opacity,
          },
        },
      ],
    };
  },
};

/**
 * Generate complete SVG with pattern
 */
export const generatePatternSVG = (
  patternConfig: ReturnType<typeof patternGenerators[keyof typeof patternGenerators]>,
  svgWidth: number = 100,
  svgHeight: number = 100,
  fillColor?: string
): string => {
  const pattern = createSVGPattern(patternConfig, patternConfig.elements);
  const fillAttr = fillColor ? `fill="${fillColor}"` : `fill="url(#${patternConfig.id})"`;
  
  return `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${pattern}
      </defs>
      <rect width="100%" height="100%" ${fillAttr} />
    </svg>
  `;
};

/**
 * Convert SVG to data URL
 */
export const svgToDataUrl = (svgString: string): string => {
  const cleanSvg = svgString.replace(/\s+/g, ' ').trim();
  const encodedSvg = encodeURIComponent(cleanSvg);
  return `data:image/svg+xml,${encodedSvg}`;
};

/**
 * Generate CSS background from pattern
 */
export const generatePatternBackground = (
  patternType: keyof typeof patternGenerators,
  options: any = {}
): string => {
  const generator = patternGenerators[patternType] as any;

  // Use default parameters if options are not provided
  const patternConfig = generator(
    options.size || options.strokeWidth || options.amplitude || 4,
    options.spacing || options.frequency || 20,
    options.spacing || 20,
    options.color || '#000000',
    options.opacity || 0.1
  );

  const svg = generatePatternSVG(patternConfig);
  return svgToDataUrl(svg);
};

/**
 * Create gradient patterns
 */
export const createGradientPattern = (
  id: string,
  type: 'linear' | 'radial',
  stops: Array<{ offset: string; color: string; opacity?: number }>
): string => {
  const gradientType = type === 'linear' ? 'linearGradient' : 'radialGradient';
  const stopsString = stops
    .map(stop => {
      const opacityAttr = stop.opacity !== undefined ? ` stop-opacity="${stop.opacity}"` : '';
      return `<stop offset="${stop.offset}" stop-color="${stop.color}"${opacityAttr} />`;
    })
    .join('\n    ');

  return `
    <${gradientType} id="${id}">
      ${stopsString}
    </${gradientType}>
  `;
};

/**
 * Utility functions for common patterns
 */
export const patternUtils = {
  createDotPattern: (size?: number, spacing?: number, color?: string, opacity?: number) =>
    patternGenerators.dots(size, spacing, color, opacity),
  
  createGridPattern: (strokeWidth?: number, spacing?: number, color?: string, opacity?: number) =>
    patternGenerators.grid(strokeWidth, spacing, color, opacity),
  
  createDiagonalPattern: (strokeWidth?: number, spacing?: number, color?: string, opacity?: number) =>
    patternGenerators.diagonal(strokeWidth, spacing, color, opacity),
  
  createHexagonPattern: (size?: number, spacing?: number, color?: string, opacity?: number) =>
    patternGenerators.hexagon(size, spacing, color, opacity),
  
  createWavePattern: (amplitude?: number, frequency?: number, spacing?: number, color?: string, opacity?: number) =>
    patternGenerators.waves(amplitude, frequency, spacing, color, opacity),
};

// Export all utilities
export const svgPatternUtils = {
  createSVGPattern,
  createSVGElement,
  generatePatternSVG,
  svgToDataUrl,
  generatePatternBackground,
  createGradientPattern,
  patternGenerators,
  patternUtils,
} as const;

// Export logo SVG for login component
export const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="95" fill="#005e7a" />
  <circle cx="100" cy="100" r="85" fill="#ffffff" />
  <path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill="#f0c75e" />
  <path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill="#f0c75e" />
  <path d="M120 45C120 45 110 50 120 55C130 50 120 45 120 45Z" fill="#f0c75e" />
  <path d="M70 160H130V170H70V160Z" fill="#005e7a" />
  <path d="M70 160L130 160L100 145L70 160Z" fill="#005e7a" />
  <path d="M85 170V180H115V170" stroke="#005e7a" stroke-width="10" stroke-linecap="round" />
</svg>`;
