import { logger } from '../../../utils/logger';
/**
 * Button Component Stories
 * Documentation and examples for the Button component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { Button } from './Button';

// Story wrapper
const StoryWrapper: React.FC<{children: React.ReactNode;}> = ({ children }) =>
<ThemeProvider>
    <View style={styles.container}>
      {children}
    </View>
  </ThemeProvider>;


// Default Button
export const Default = () =>
<StoryWrapper>
    <Button onPress={() => logger.debug('Default button pressed')}>
      Default Button
    </Button>
  </StoryWrapper>;


// All Variants
export const Variants = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button variant="primary" onPress={() => logger.debug('Primary')}>
        Primary
      </Button>
      <Button variant="secondary" onPress={() => logger.debug('Secondary')}>
        Secondary
      </Button>
      <Button variant="outline" onPress={() => logger.debug('Outline')}>
        Outline
      </Button>
      <Button variant="ghost" onPress={() => logger.debug('Ghost')}>
        Ghost
      </Button>
      <Button variant="danger" onPress={() => logger.debug('Danger')}>
        Danger
      </Button>
    </View>
  </StoryWrapper>;


// All Sizes
export const Sizes = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button size="small" onPress={() => logger.debug('Small')}>
        Small Button
      </Button>
      <Button size="medium" onPress={() => logger.debug('Medium')}>
        Medium Button
      </Button>
      <Button size="large" onPress={() => logger.debug('Large')}>
        Large Button
      </Button>
    </View>
  </StoryWrapper>;


// States
export const States = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button onPress={() => logger.debug('Normal')}>
        Normal
      </Button>
      <Button disabled onPress={() => logger.debug('Disabled')}>
        Disabled
      </Button>
      <Button loading onPress={() => logger.debug('Loading')}>
        Loading
      </Button>
    </View>
  </StoryWrapper>;


// With Icons
export const WithIcons = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button
      icon="home"
      iconPosition="left"
      onPress={() => logger.debug('Left icon')}>
      
        Left Icon
      </Button>
      <Button
      icon="arrow-forward"
      iconPosition="right"
      onPress={() => logger.debug('Right icon')}>
      
        Right Icon
      </Button>
      <Button
      icon="close"
      iconOnly
      onPress={() => logger.debug('Icon only')}>
      
        Icon Only
      </Button>
    </View>
  </StoryWrapper>;


// Full Width
export const FullWidth = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button fullWidth onPress={() => logger.debug('Full width')}>
        Full Width Button
      </Button>
      <Button
      fullWidth
      variant="outline"
      onPress={() => logger.debug('Full width outline')}>
      
        Full Width Outline
      </Button>
    </View>
  </StoryWrapper>;


// Complex Examples
export const ComplexExamples = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button
      variant="primary"
      size="large"
      icon="download"
      iconPosition="left"
      fullWidth
      onPress={() => logger.debug('Download')}>
      
        Download File
      </Button>
      
      <Button
      variant="danger"
      size="small"
      icon="trash"
      iconPosition="left"
      onPress={() => logger.debug('Delete')}>
      
        Delete
      </Button>
      
      <Button
      variant="ghost"
      icon="settings"
      iconOnly
      onPress={() => logger.debug('Settings')} />
    
      
      <Button
      variant="outline"
      loading
      onPress={() => logger.debug('Saving')}>
      
        Saving...
      </Button>
    </View>
  </StoryWrapper>;


// All Variants with All Sizes
export const VariantSizeCombinations = () =>
<StoryWrapper>
    <View style={styles.grid}>
      {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) =>
    <View key={variant} style={styles.variantSection}>
          {(['small', 'medium', 'large'] as const).map((size) =>
      <Button
        key={`${variant}-${size}`}
        variant={variant}
        size={size}
        onPress={() => logger.debug(`${variant} ${size}`)}
        style={styles.gridButton}>
        
              {variant} {size}
            </Button>
      )}
        </View>
    )}
    </View>
  </StoryWrapper>;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  section: {
    gap: 12,
    marginBottom: 24
  },
  grid: {
    gap: 16
  },
  variantSection: {
    gap: 8
  },
  gridButton: {
    marginBottom: 8
  }
});

// Export all stories
export default {
  Default,
  Variants,
  Sizes,
  States,
  WithIcons,
  FullWidth,
  ComplexExamples,
  VariantSizeCombinations
};