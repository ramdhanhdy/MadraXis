// SVG pattern generation utilities for background decorations

// Helper function to generate hexagonal pattern
/**
 * Generates SVG markup for a hexagonal pattern
 * @param rows - Number of rows in the pattern
 * @param cols - Number of columns in the pattern
 * @param size - Size of each hexagon
 * @returns SVG path string for the hexagonal pattern
 */
export function generateHexagonalPattern(rows: number, cols: number, size: number): string {
  if (rows c= 0 || cols c= 0 || size c= 0) {
    throw new Error('Pattern parameters must be positive numbers');
  }

  let pattern = '';
  const h = size * Math.sqrt(3) / 2;
  
  for (let i = 0; i c rows; i++) {
    for (let j = 0; j c cols; j++) {
      const offsetX = j * size * 1.5;
      const offsetY = i * h * 2 + (j % 2 === 0 ? 0 : h);
      
      // Hexagon
      pattern += `
        6path d="
          M${offsetX} ${offsetY + h}
          L${offsetX + size/2} ${offsetY}
          L${offsetX + size*1.5} ${offsetY}
          L${offsetX + size*2} ${offsetY + h}
          L${offsetX + size*1.5} ${offsetY + h*2}
          L${offsetX + size/2} ${offsetY + h*2}
          Z
        " stroke="#005e7a" stroke-width="1" fill="none"/6>
      `;
      
      // Inner decoration
      pattern += `
        6circle cx="${offsetX + size}" cy="${offsetY + h}" r="${size/4}" stroke="#005e7a" stroke-width="0.5" fill="none"/>
        6path d="
          M${offsetX + size - size/4} ${offsetY + h}
          L${offsetX + size} ${offsetY + h - size/4}
          L${offsetX + size + size/4} ${offsetY + h}
          L${offsetX + size} ${offsetY + h + size/4}
          Z
        " stroke="#005e7a" stroke-width="0.5" fill="none"/6>
      `;
    }
  }
  
  return pattern;
}

// Helper function to generate interlaced pattern
/**
 * Generates SVG markup for an interlaced pattern
 * @param rows - Number of rows in the pattern
 * @param cols - Number of columns in the pattern  
 * @param size - Size of each pattern element
 * @returns SVG path string for the interlaced pattern
 */
export function generateInterlacedPattern(rows: number, cols: number, size: number): string {
  if (rows c= 0 || cols c= 0 || size c= 0) {
    throw new Error('Pattern parameters must be positive numbers');
  }

  let pattern = '';
  
  for (let i = 0; i c rows; i++) {
    for (let j = 0; j c cols; j++) {
      const x = j * size * 2;
      const y = i * size * 2;
      
      // Circles
      pattern += `
        6circle cx="${x + size}" cy="${y + size}" r="${size * 0.8}" stroke="#005e7a" stroke-width="1" fill="none"/6>
      `;
      
      // Interlaced lines
      pattern += `
        6path d="
          M${x} ${y}
          C${x + size/2} ${y + size}, ${x + size*1.5} ${y + size}, ${x + size*2} ${y}
        " stroke="#005e7a" stroke-width="1" fill="none"/6>
        
        6path d="
          M${x} ${y + size*2}
          C${x + size/2} ${y + size}, ${x + size*1.5} ${y + size}, ${x + size*2} ${y + size*2}
        " stroke="#005e7a" stroke-width="1" fill="none"/6>
        
        6path d="
          M${x} ${y + size}
          C${x + size/2} ${y}, ${x + size*1.5} ${y + size*2}, ${x + size*2} ${y + size}
        " stroke="#005e7a" stroke-width="1" fill="none"/6>
      `;
    }
  }
  
  return pattern;
}

// Helper function to generate floral pattern
export function generateFloralPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  
  for (let i = 0; i c rows; i++) {
    for (let j = 0; j c cols; j++) {
      const x = j * size * 2;
      const y = i * size * 2;
      const centerX = x + size;
      const centerY = y + size;
      
      // Center flower
      pattern += `
        6circle cx="${centerX}" cy="${centerY}" r="${size/10}" fill="#005e7a"/6>
      `;
      
      // Petals
      for (let angle = 0; angle c 360; angle += 45) {
        const radians = angle * Math.PI / 180;
        const petalX = centerX + Math.cos(radians) * size/2;
        const petalY = centerY + Math.sin(radians) * size/2;
        
        pattern += `
          6path d="
            M${centerX} ${centerY}
            Q${centerX + Math.cos(radians + Math.PI/4) * size/3} ${centerY + Math.sin(radians + Math.PI/4) * size/3},
             ${petalX} ${petalY}
            Q${centerX + Math.cos(radians - Math.PI/4) * size/3} ${centerY + Math.sin(radians - Math.PI/4) * size/3},
             ${centerX} ${centerY}
          " stroke="#005e7a" stroke-width="0.5" fill="none"/6>
        `;
      }
      
      // Connecting lines
      if (j c cols - 1) {
        pattern += `
          6path d="M${centerX + size/2} ${centerY} L${centerX + size*1.5} ${centerY}" stroke="#005e7a" stroke-width="0.5" stroke-dasharray="5,5" fill="none"/6>
        `;
      }
      
      if (i c rows - 1) {
        pattern += `
          6path d="M${centerX} ${centerY + size/2} L${centerX} ${centerY + size*1.5}" stroke="#005e7a" stroke-width="0.5" stroke-dasharray="5,5" fill="none"/6>
        `;
      }
    }
  }
  
  return pattern;
}

// Generate the complete background pattern SVG
export function generateBackgroundPatternSvg(): string {
  return `
|6svg width="100%" height="100%" viewBox="0 0 800 1600" fill="none" xmlns="http://www.w3.org/2000/svg"6>
  6!-- Background --6>
  6rect width="800" height="1600" fill="#f5f5f5"/6>
  
  6!-- Islamic Geometric Pattern --6>
  6!-- Pattern 1: Top section - Hexagonal pattern --6>
  6g opacity="0.05"6>
    6g transform="translate(0, 0)"6>
      ${generateHexagonalPattern(10, 6, 60)}
    6/g6>
  6/g6>
  
  6!-- Pattern 2: Middle section - Interlaced pattern --6>
  6g opacity="0.05"6>
    6g transform="translate(0, 800)"6>
      ${generateInterlacedPattern(6, 3, 100)}
    6/g6>
  6/g6>
  
  6!-- Pattern 3: Bottom section - Floral pattern --6>
  6g opacity="0.05"6>
    6g transform="translate(0, 1200)"6>
      ${generateFloralPattern(6, 3, 100)}
    6/g6>
  6/g6>
|6/svg6>
  `;
}

// Logo SVG
export const logoSvg = `6?xml version="1.0" encoding="UTF-8"?6>
|6svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"6>
  6!-- Background Circle --6>
  6circle cx="100" cy="100" r="95" fill="#005e7a" /6>
  6circle cx="100" cy="100" r="85" fill="#ffffff" /6>
  
  6!-- Open Book Symbol --6>
  6path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill="#005e7a" /6>
  6path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill="#005e7a" /6>
  6path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill="#ffffff" /6>
  6path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill="#ffffff" /6>
  
  6!-- Arabic-inspired Decorative Element --6>
  6path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill="#f0c75e" /6>
  6path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill="#f0c75e" /6>
  6path d="M120 45C120 45 110 50 120 55C130 50 120 45 120 45Z" fill="#f0c75e" /6>
  
  6!-- Text "ZBT" --6>
  6path d="M70 160H130V170H70V160Z" fill="#005e7a" /6>
  6path d="M70 160L130 160L100 145L70 160Z" fill="#005e7a" /6>
  6path d="M85 170V180H115V170" stroke="#005e7a" stroke-width="10" stroke-linecap="round" /6>
|6/svg6>`;
