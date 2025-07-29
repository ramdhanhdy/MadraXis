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


// Icons
export const WithIcons = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button 
        icon="home" 
        iconPosition="left" 
        onPress={() => logger.debug('Left icon')}
      >
        Left Icon
      </Button>
      <Button 
        icon="arrow-forward" 
        iconPosition="right" 
        onPress={() => logger.debug('Right icon')}
      >
        Right Icon
      </Button>
      <Button 
        icon="close" 
        iconOnly 
        accessibilityLabel="Close"
        onPress={() => logger.debug('Icon only')}
      />
    </View>
  </StoryWrapper>;


// Layout Options
export const Layout = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button onPress={() => logger.debug('Regular width')}>
        Regular Width
      </Button>
      <Button fullWidth onPress={() => logger.debug('Full width')}>
        Full Width Button
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
        icon="checkmark"
        iconPosition="left"
        onPress={() => logger.debug('Submit form')}
      >
        Submit Form
      </Button>
      
      <Button 
        variant="danger"
        icon="trash"
        iconPosition="left"
        onPress={() => logger.debug('Delete item')}
      >
        Delete Item
      </Button>
      
      <Button 
        variant="outline"
        size="small"
        icon="settings"
        iconOnly
        accessibilityLabel="Settings"
        onPress={() => logger.debug('Open settings')}
      />
      
      <Button 
        variant="ghost"
        loading
        onPress={() => logger.debug('Processing')}
      >
        Processing...
      </Button>
    </View>
  </StoryWrapper>;


// All Variants with All Sizes
export const VariantSizeCombinations = () =>
<StoryWrapper>
    <View style={styles.grid}>
      {/* Primary */}
      <View style={styles.row}>
        <Button variant="primary" size="small" onPress={() => logger.debug('Primary Small')}>
          Primary Small
        </Button>
        <Button variant="primary" size="medium" onPress={() => logger.debug('Primary Medium')}>
          Primary Medium
        </Button>
        <Button variant="primary" size="large" onPress={() => logger.debug('Primary Large')}>
          Primary Large
        </Button>
      </View>
      
      {/* Secondary */}
      <View style={styles.row}>
        <Button variant="secondary" size="small" onPress={() => logger.debug('Secondary Small')}>
          Secondary Small
        </Button>
        <Button variant="secondary" size="medium" onPress={() => logger.debug('Secondary Medium')}>
          Secondary Medium
        </Button>
        <Button variant="secondary" size="large" onPress={() => logger.debug('Secondary Large')}>
          Secondary Large
        </Button>
      </View>
      
      {/* Outline */}
      <View style={styles.row}>
        <Button variant="outline" size="small" onPress={() => logger.debug('Outline Small')}>
          Outline Small
        </Button>
        <Button variant="outline" size="medium" onPress={() => logger.debug('Outline Medium')}>
          Outline Medium
        </Button>
        <Button variant="outline" size="large" onPress={() => logger.debug('Outline Large')}>
          Outline Large
        </Button>
      </View>
    </View>
  </StoryWrapper>;


// Accessibility Examples
export const AccessibilityExamples = () =>
<StoryWrapper>
    <View style={styles.section}>
      <Button 
        accessibilityLabel="Save document"
        accessibilityHint="Saves the current document to your account"
        onPress={() => logger.debug('Save document')}
      >
        Save
      </Button>
      
      <Button 
        icon="close"
        iconOnly
        accessibilityLabel="Close dialog"
        accessibilityHint="Closes the current dialog without saving"
        onPress={() => logger.debug('Close dialog')}
      />
      
      <Button 
        disabled
        accessibilityLabel="Submit form"
        accessibilityHint="Form must be completed before submission"
        onPress={() => logger.debug('Submit form')}
      >
        Submit (Disabled)
      </Button>
    </View>
  </StoryWrapper>;


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
});

// Export default for Storybook
export default {
  title: 'UI/Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A comprehensive, accessible button component with multiple variants, sizes, and states.',
      },
    },
  },
};
