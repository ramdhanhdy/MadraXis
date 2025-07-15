/**
 * BackgroundPattern Component Stories
 * Storybook stories demonstrating all BackgroundPattern component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { BackgroundPattern } from './BackgroundPattern';
import { Typography } from '../Typography';
import { Card } from '../../molecules/Card';

const meta: Meta<typeof BackgroundPattern> = {
  title: 'Atoms/BackgroundPattern',
  component: BackgroundPattern,
  parameters: {
    docs: {
      description: {
        component: 'Islamic geometric background pattern with design token integration and multiple variants.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['geometric', 'minimal', 'dots', 'waves', 'none'],
      description: 'Pattern variant',
    },
    intensity: {
      control: { type: 'select' },
      options: ['subtle', 'light', 'medium', 'strong'],
      description: 'Pattern intensity level',
    },
    color: {
      control: { type: 'color' },
      description: 'Custom pattern color',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Custom opacity (overrides intensity)',
    },
  },
  decorators: [
    (Story) => (
      <View style={{ 
        height: 400, 
        backgroundColor: '#f5f5f5',
        position: 'relative',
        padding: 20,
      }}>
        <Story />
        <View style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          right: 20,
          zIndex: 1,
        }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            Sample Content
          </Typography>
          <Typography variant="body1" color="secondary">
            This content sits above the background pattern
          </Typography>
        </View>
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BackgroundPattern>;

// Default geometric pattern
export const Default: Story = {
  args: {
    variant: 'geometric',
    intensity: 'subtle',
  },
};

// Different variants
export const GeometricPattern: Story = {
  args: {
    variant: 'geometric',
    intensity: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Traditional Islamic geometric pattern with triangular and star motifs.',
      },
    },
  },
};

export const MinimalPattern: Story = {
  args: {
    variant: 'minimal',
    intensity: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal pattern with simple dots and subtle lines.',
      },
    },
  },
};

export const DotsPattern: Story = {
  args: {
    variant: 'dots',
    intensity: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple dots pattern arranged in a grid.',
      },
    },
  },
};

export const WavesPattern: Story = {
  args: {
    variant: 'waves',
    intensity: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Flowing waves pattern with curved lines.',
      },
    },
  },
};

export const NoPattern: Story = {
  args: {
    variant: 'none',
  },
  parameters: {
    docs: {
      description: {
        story: 'No pattern - useful for clean layouts.',
      },
    },
  },
};

// Different intensities
export const IntensityLevels: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', height: 400 }}>
      {(['subtle', 'light', 'medium', 'strong'] as const).map((intensity, index) => (
        <View key={intensity} style={{ 
          flex: 1, 
          backgroundColor: '#f5f5f5',
          position: 'relative',
          marginRight: index < 3 ? 8 : 0,
        }}>
          <BackgroundPattern
            variant="geometric"
            intensity={intensity}
          />
          <View style={{ 
            position: 'absolute', 
            top: 20, 
            left: 10, 
            right: 10,
            zIndex: 1,
          }}>
            <Typography variant="h4" style={{ marginBottom: 4 }}>
              {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
            </Typography>
            <Typography variant="caption" color="secondary">
              {intensity} intensity
            </Typography>
          </View>
        </View>
      ))}
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different intensity levels from subtle to strong.',
      },
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', height: 400 }}>
      {[
        { color: '#005e7a', name: 'Primary' },
        { color: '#f0c75e', name: 'Secondary' },
        { color: '#4caf50', name: 'Success' },
        { color: '#ff9800', name: 'Warning' },
      ].map((item, index) => (
        <View key={item.name} style={{ 
          flex: 1, 
          backgroundColor: '#f5f5f5',
          position: 'relative',
          marginRight: index < 3 ? 8 : 0,
        }}>
          <BackgroundPattern
            variant="geometric"
            intensity="medium"
            color={item.color}
          />
          <View style={{ 
            position: 'absolute', 
            top: 20, 
            left: 10, 
            right: 10,
            zIndex: 1,
          }}>
            <Typography variant="h4" style={{ marginBottom: 4 }}>
              {item.name}
            </Typography>
            <Typography variant="caption" color="secondary">
              {item.color}
            </Typography>
          </View>
        </View>
      ))}
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Background patterns with different brand colors.',
      },
    },
  },
};

// Custom opacity
export const CustomOpacity: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', height: 400 }}>
      {[0.02, 0.05, 0.1, 0.2].map((opacity, index) => (
        <View key={opacity} style={{ 
          flex: 1, 
          backgroundColor: '#f5f5f5',
          position: 'relative',
          marginRight: index < 3 ? 8 : 0,
        }}>
          <BackgroundPattern
            variant="geometric"
            opacity={opacity}
          />
          <View style={{ 
            position: 'absolute', 
            top: 20, 
            left: 10, 
            right: 10,
            zIndex: 1,
          }}>
            <Typography variant="h4" style={{ marginBottom: 4 }}>
              {Math.round(opacity * 100)}%
            </Typography>
            <Typography variant="caption" color="secondary">
              opacity: {opacity}
            </Typography>
          </View>
        </View>
      ))}
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Background patterns with custom opacity values.',
      },
    },
  },
};

// Dark background
export const DarkBackground: Story = {
  args: {
    variant: 'geometric',
    intensity: 'medium',
    color: '#ffffff',
  },
  decorators: [
    (Story) => (
      <View style={{ 
        height: 400, 
        backgroundColor: '#1a1a1a',
        position: 'relative',
        padding: 20,
      }}>
        <Story />
        <View style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          right: 20,
          zIndex: 1,
        }}>
          <Typography variant="h3" style={{ marginBottom: 8, color: '#ffffff' }}>
            Dark Theme
          </Typography>
          <Typography variant="body1" style={{ color: '#cccccc' }}>
            White pattern on dark background
          </Typography>
        </View>
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Background pattern on dark theme with white pattern color.',
      },
    },
  },
};

// With content overlay
export const WithContentOverlay: Story = {
  args: {
    variant: 'geometric',
    intensity: 'light',
  },
  decorators: [
    (Story) => (
      <View style={{ 
        height: 500, 
        backgroundColor: '#f5f5f5',
        position: 'relative',
        padding: 20,
      }}>
        <Story />
        <View style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          right: 20,
          zIndex: 1,
          gap: 16,
        }}>
          <Typography variant="h2" style={{ marginBottom: 8 }}>
            Dashboard
          </Typography>
          
          <Card variant="elevated" padding="medium">
            <Typography variant="h4" style={{ marginBottom: 8 }}>
              Welcome Back!
            </Typography>
            <Typography variant="body2" color="secondary">
              This card sits above the background pattern, demonstrating how content layers properly.
            </Typography>
          </Card>
          
          <Card variant="default" padding="medium">
            <Typography variant="h4" style={{ marginBottom: 8 }}>
              Statistics
            </Typography>
            <Typography variant="body2" color="secondary">
              The pattern provides subtle visual interest without interfering with readability.
            </Typography>
          </Card>
        </View>
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Background pattern with realistic dashboard content overlay.',
      },
    },
  },
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['geometric', 'minimal', 'dots', 'waves'] as const).map((variant) => (
        <View key={variant} style={{ 
          height: 120, 
          backgroundColor: '#f5f5f5',
          position: 'relative',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <BackgroundPattern
            variant={variant}
            intensity="light"
          />
          <View style={{ 
            position: 'absolute', 
            top: 16, 
            left: 16,
            zIndex: 1,
          }}>
            <Typography variant="h4" style={{ marginBottom: 4 }}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)} Pattern
            </Typography>
            <Typography variant="caption" color="secondary">
              variant="{variant}"
            </Typography>
          </View>
        </View>
      ))}
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available pattern variants.',
      },
    },
  },
};

// Role-specific examples
export const StudentTheme: Story = {
  args: {
    variant: 'geometric',
    intensity: 'subtle',
    color: '#005e7a',
  },
  decorators: [
    (Story) => (
      <View style={{ 
        height: 400, 
        backgroundColor: '#f8f9fa',
        position: 'relative',
        padding: 20,
      }}>
        <Story />
        <View style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          right: 20,
          zIndex: 1,
        }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            Student Portal
          </Typography>
          <Typography variant="body1" color="secondary">
            Subtle geometric pattern for student dashboard
          </Typography>
        </View>
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Background pattern themed for student portal.',
      },
    },
  },
};

export const TeacherTheme: Story = {
  args: {
    variant: 'minimal',
    intensity: 'light',
    color: '#2e7d32',
  },
  decorators: [
    (Story) => (
      <View style={{ 
        height: 400, 
        backgroundColor: '#f1f8e9',
        position: 'relative',
        padding: 20,
      }}>
        <Story />
        <View style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          right: 20,
          zIndex: 1,
        }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            Teacher Portal
          </Typography>
          <Typography variant="body1" color="secondary">
            Clean minimal pattern for teacher dashboard
          </Typography>
        </View>
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Background pattern themed for teacher portal.',
      },
    },
  },
};

export const ParentTheme: Story = {
  args: {
    variant: 'waves',
    intensity: 'subtle',
    color: '#1976d2',
  },
  decorators: [
    (Story) => (
      <View style={{ 
        height: 400, 
        backgroundColor: '#e3f2fd',
        position: 'relative',
        padding: 20,
      }}>
        <Story />
        <View style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          right: 20,
          zIndex: 1,
        }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            Parent Portal
          </Typography>
          <Typography variant="body1" color="secondary">
            Gentle waves pattern for parent dashboard
          </Typography>
        </View>
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Background pattern themed for parent portal.',
      },
    },
  },
};

export const ManagementTheme: Story = {
  args: {
    variant: 'dots',
    intensity: 'light',
    color: '#424242',
  },
  decorators: [
    (Story) => (
      <View style={{ 
        height: 400, 
        backgroundColor: '#fafafa',
        position: 'relative',
        padding: 20,
      }}>
        <Story />
        <View style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          right: 20,
          zIndex: 1,
        }}>
          <Typography variant="h3" style={{ marginBottom: 8 }}>
            Management Portal
          </Typography>
          <Typography variant="body1" color="secondary">
            Professional dots pattern for management dashboard
          </Typography>
        </View>
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Background pattern themed for management portal.',
      },
    },
  },
};