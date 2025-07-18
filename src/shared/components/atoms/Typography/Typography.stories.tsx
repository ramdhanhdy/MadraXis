/**
 * Typography Component Stories
 * Documentation and examples for the Typography component
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { 
  Typography, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Body1, 
  Body2, 
  Caption, 
  Overline 
} from './Typography';

// Story wrapper
const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <ScrollView style={styles.container}>
      {children}
    </ScrollView>
  </ThemeProvider>
);

// Default Typography
export const Default = () => (
  <StoryWrapper>
    <Typography>Default typography (body1)</Typography>
  </StoryWrapper>
);

// All Variants
export const AllVariants = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography variant="h1">Heading 1 - Main page title</Typography>
      <Typography variant="h2">Heading 2 - Section title</Typography>
      <Typography variant="h3">Heading 3 - Subsection title</Typography>
      <Typography variant="h4">Heading 4 - Card title</Typography>
      <Typography variant="body1">Body 1 - Main body text for paragraphs and content</Typography>
      <Typography variant="body2">Body 2 - Secondary body text for descriptions</Typography>
      <Typography variant="caption">Caption - Small text for labels and metadata</Typography>
      <Typography variant="overline">OVERLINE - UPPERCASE LABELS</Typography>
      <Typography variant="button">Button - Button text styling</Typography>
      <Typography variant="buttonSmall">Button Small - Small button text</Typography>
      <Typography variant="buttonLarge">Button Large - Large button text</Typography>
    </View>
  </StoryWrapper>
);

// Convenience Components
export const ConvenienceComponents = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Heading1>Heading 1 Component</Heading1>
      <Heading2>Heading 2 Component</Heading2>
      <Heading3>Heading 3 Component</Heading3>
      <Heading4>Heading 4 Component</Heading4>
      <Body1>Body 1 Component - Main body text</Body1>
      <Body2>Body 2 Component - Secondary body text</Body2>
      <Caption>Caption Component - Small text</Caption>
      <Overline>OVERLINE COMPONENT</Overline>
    </View>
  </StoryWrapper>
);

// Color Variations
export const Colors = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography color="primary">Primary color text</Typography>
      <Typography color="secondary">Secondary color text</Typography>
      <Typography color="tertiary">Tertiary color text</Typography>
      <Typography color="disabled">Disabled color text</Typography>
      <Typography color="success">Success color text</Typography>
      <Typography color="warning">Warning color text</Typography>
      <Typography color="error">Error color text</Typography>
      <Typography color="#ff6b35">Custom hex color text</Typography>
      <Typography color="rgb(255, 107, 53)">Custom RGB color text</Typography>
    </View>
  </StoryWrapper>
);

// Text Alignment
export const Alignment = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography align="left">Left aligned text (default)</Typography>
      <Typography align="center">Center aligned text</Typography>
      <Typography align="right">Right aligned text</Typography>
      <Typography align="justify">Justified text that will wrap to multiple lines and be justified across the full width of the container when it becomes long enough to demonstrate the justification behavior.</Typography>
    </View>
  </StoryWrapper>
);

// Font Weights
export const FontWeights = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography weight="normal">Normal weight text</Typography>
      <Typography weight="medium">Medium weight text</Typography>
      <Typography weight="semibold">Semibold weight text</Typography>
      <Typography weight="bold">Bold weight text</Typography>
    </View>
  </StoryWrapper>
);

// Text Transforms
export const TextTransforms = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography transform="none">No transform applied</Typography>
      <Typography transform="uppercase">UPPERCASE TRANSFORM</Typography>
      <Typography transform="lowercase">lowercase transform</Typography>
      <Typography transform="capitalize">Capitalize Transform</Typography>
    </View>
  </StoryWrapper>
);

// Text Decorations
export const TextDecorations = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography decoration="none">No decoration</Typography>
      <Typography decoration="underline">Underlined text</Typography>
      <Typography decoration="line-through">Strikethrough text</Typography>
    </View>
  </StoryWrapper>
);

// Line Heights
export const LineHeights = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography lineHeight="tight">
        Tight line height - This text has tight line spacing which is good for headings and compact layouts where space is at a premium.
      </Typography>
      <Typography lineHeight="normal">
        Normal line height - This text has normal line spacing which is the default and works well for most body text and general content.
      </Typography>
      <Typography lineHeight="relaxed">
        Relaxed line height - This text has relaxed line spacing which provides more breathing room and is good for improved readability in longer content.
      </Typography>
      <Typography lineHeight={32}>
        Custom line height (32px) - This text uses a custom numeric line height value for precise control over spacing.
      </Typography>
    </View>
  </StoryWrapper>
);

// Text Truncation
export const TextTruncation = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography numberOfLines={1}>
        Single line truncation - This is a very long text that will be truncated to a single line with an ellipsis at the end when it exceeds the container width.
      </Typography>
      <Typography numberOfLines={2}>
        Two line truncation - This is a longer text that will be truncated to exactly two lines with an ellipsis at the end when it exceeds the specified number of lines in the container.
      </Typography>
      <Typography numberOfLines={1} ellipsizeMode="head">
        ...Head ellipsis - This text will be truncated at the beginning with ellipsis at the start.
      </Typography>
      <Typography numberOfLines={1} ellipsizeMode="middle">
        Middle ellip...sis - This text will be truncated in the middle with ellipsis in the center.
      </Typography>
      <Typography numberOfLines={1} ellipsizeMode="tail">
        Tail ellipsis... - This text will be truncated at the end with ellipsis at the tail.
      </Typography>
    </View>
  </StoryWrapper>
);

// Complex Examples
export const ComplexExamples = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography
        variant="h1"
        color="primary"
        align="center"
        weight="bold"
        transform="uppercase"
      >
        Main Title
      </Typography>
      
      <Typography
        variant="h3"
        color="secondary"
        align="center"
        decoration="underline"
      >
        Subtitle with Underline
      </Typography>
      
      <Typography
        variant="body1"
        color="tertiary"
        lineHeight="relaxed"
        align="justify"
      >
        This is a paragraph of body text that demonstrates multiple typography properties working together. It uses body1 variant with tertiary color, relaxed line height, and justified alignment for a professional appearance.
      </Typography>
      
      <Typography
        variant="caption"
        color="disabled"
        transform="uppercase"
        align="right"
      >
        Metadata Caption
      </Typography>
      
      <Typography
        variant="overline"
        color="error"
        decoration="line-through"
      >
        DEPRECATED FEATURE
      </Typography>
    </View>
  </StoryWrapper>
);

// Typography Scale Demonstration
export const TypographyScale = () => (
  <StoryWrapper>
    <View style={styles.section}>
      <Typography variant="h1" style={styles.scaleItem}>H1 - 32px</Typography>
      <Typography variant="h2" style={styles.scaleItem}>H2 - 24px</Typography>
      <Typography variant="h3" style={styles.scaleItem}>H3 - 20px</Typography>
      <Typography variant="h4" style={styles.scaleItem}>H4 - 18px</Typography>
      <Typography variant="body1" style={styles.scaleItem}>Body1 - 16px</Typography>
      <Typography variant="body2" style={styles.scaleItem}>Body2 - 14px</Typography>
      <Typography variant="caption" style={styles.scaleItem}>Caption - 12px</Typography>
    </View>
  </StoryWrapper>
);

// Real-world Usage Examples
export const RealWorldExamples = () => (
  <StoryWrapper>
    <View style={styles.section}>
      {/* Article Header */}
      <View style={styles.articleHeader}>
        <Heading1 color="primary">Article Title</Heading1>
        <Caption color="secondary">Published on March 15, 2024</Caption>
        <Body2 color="tertiary">By John Doe</Body2>
      </View>
      
      {/* Article Content */}
      <View style={styles.articleContent}>
        <Heading3>Introduction</Heading3>
        <Body1 lineHeight="relaxed">
          This is the introduction paragraph that provides context and overview of the article content. It uses proper typography hierarchy and spacing.
        </Body1>
        
        <Heading3>Main Content</Heading3>
        <Body1 lineHeight="relaxed">
          This is the main content section with detailed information. The typography is optimized for readability with appropriate line height and font size.
        </Body1>
        
        <Caption color="disabled" align="center">
          Figure 1: Example diagram
        </Caption>
      </View>
      
      {/* UI Elements */}
      <View style={styles.uiElements}>
        <Overline color="primary">SETTINGS</Overline>
        <Body1>Enable notifications</Body1>
        <Caption color="secondary">Receive updates about your account</Caption>
      </View>
    </View>
  </StoryWrapper>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    gap: 16,
    marginBottom: 32,
  },
  scaleItem: {
    marginBottom: 8,
  },
  articleHeader: {
    marginBottom: 24,
    gap: 4,
  },
  articleContent: {
    gap: 12,
    marginBottom: 24,
  },
  uiElements: {
    gap: 4,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
});

// Export all stories
export default {
  Default,
  AllVariants,
  ConvenienceComponents,
  Colors,
  Alignment,
  FontWeights,
  TextTransforms,
  TextDecorations,
  LineHeights,
  TextTruncation,
  ComplexExamples,
  TypographyScale,
  RealWorldExamples,
};