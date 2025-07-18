/**
 * ProgressBar Component Stories
 * Storybook stories demonstrating all ProgressBar component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ProgressBar } from './ProgressBar';
import { Typography } from '../../atoms/Typography';
import { Card } from '../Card';

const meta: Meta<typeof ProgressBar> = {
  title: 'Molecules/ProgressBar',
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: 'A consistent progress indicator component with visual patterns and color coding.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error'],
      description: 'Visual variant with color coding',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Height of the progress bar',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Whether to show the label',
    },
    showPercentage: {
      control: { type: 'boolean' },
      description: 'Whether to show percentage',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Whether to animate progress changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// Basic progress bar
export const Default: Story = {
  args: {
    value: 75,
  },
};

// Progress bar with label and percentage
export const WithLabelAndPercentage: Story = {
  args: {
    value: 85,
    label: 'Course Progress',
    showLabel: true,
    showPercentage: true,
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Default (Primary)
        </Typography>
        <ProgressBar value={60} variant="default" />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Success (Green)
        </Typography>
        <ProgressBar value={100} variant="success" />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Warning (Orange)
        </Typography>
        <ProgressBar value={30} variant="warning" />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Error (Red)
        </Typography>
        <ProgressBar value={15} variant="error" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variants for various states and contexts.',
      },
    },
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Small (4px)
        </Typography>
        <ProgressBar value={50} size="small" />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Medium (8px) - Default
        </Typography>
        <ProgressBar value={50} size="medium" />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Large (12px)
        </Typography>
        <ProgressBar value={50} size="large" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes for various use cases and visual hierarchy.',
      },
    },
  },
};

// With labels and percentages
export const WithLabels: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <ProgressBar
        value={78}
        label="Overall Grade"
        showLabel
        showPercentage
        variant="success"
      />
      
      <ProgressBar
        value={65}
        label="Attendance"
        showLabel
        showPercentage
        variant="warning"
      />
      
      <ProgressBar
        value={92}
        label="Assignment Completion"
        showLabel
        showPercentage
        variant="success"
      />
      
      <ProgressBar
        value={45}
        label="Participation"
        showLabel
        showPercentage
        variant="error"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars with labels and percentage display.',
      },
    },
  },
};

// Student progress card example
export const StudentProgressCard: Story = {
  render: () => (
    <Card>
      <Typography variant="h4" style={{ marginBottom: 16 }}>
        Ahmed's Semester Progress
      </Typography>
      
      <View style={{ gap: 12 }}>
        <ProgressBar
          value={88}
          label="Overall Grade"
          showLabel
          showPercentage
          variant="success"
          size="large"
        />
        
        <ProgressBar
          value={72}
          label="Attendance"
          showLabel
          showPercentage
          variant="warning"
        />
        
        <ProgressBar
          value={95}
          label="Assignment Completion"
          showLabel
          showPercentage
          variant="success"
        />
        
        <ProgressBar
          value={68}
          label="Class Participation"
          showLabel
          showPercentage
          variant="warning"
        />
      </View>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of progress bars used in a student progress card.',
      },
    },
  },
};

// Class performance overview
export const ClassPerformanceOverview: Story = {
  render: () => (
    <Card>
      <Typography variant="h4" style={{ marginBottom: 16 }}>
        Grade 10A - Subject Performance
      </Typography>
      
      <View style={{ gap: 16 }}>
        <ProgressBar
          value={85}
          label="Mathematics"
          showLabel
          showPercentage
          size="large"
          variant="success"
        />
        
        <ProgressBar
          value={72}
          label="Science"
          showLabel
          showPercentage
          size="large"
          variant="warning"
        />
        
        <ProgressBar
          value={95}
          label="English"
          showLabel
          showPercentage
          size="large"
          variant="success"
        />
        
        <ProgressBar
          value={58}
          label="History"
          showLabel
          showPercentage
          size="large"
          variant="error"
        />
        
        <ProgressBar
          value={79}
          label="Islamic Studies"
          showLabel
          showPercentage
          size="large"
          variant="default"
        />
      </View>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of progress bars used for class performance overview.',
      },
    },
  },
};

// Loading progress example
export const LoadingProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0; // Reset for demo
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <Card>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          File Upload Progress
        </Typography>
        
        <ProgressBar
          value={progress}
          label="Uploading assignment.pdf"
          showLabel
          showPercentage
          size="large"
        />
        
        <Typography variant="body2" color="secondary" style={{ marginTop: 8 }}>
          {progress < 100 ? 'Uploading...' : 'Upload complete!'}
        </Typography>
      </Card>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of animated progress bar for loading states.',
      },
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Custom Purple Progress
        </Typography>
        <ProgressBar
          value={70}
          progressColor="#9c27b0"
          backgroundColor="#e1bee7"
          showPercentage
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Custom Blue Progress
        </Typography>
        <ProgressBar
          value={45}
          progressColor="#2196f3"
          backgroundColor="#bbdefb"
          showPercentage
        />
      </View>
      
      <View>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          Custom Teal Progress
        </Typography>
        <ProgressBar
          value={90}
          progressColor="#009688"
          backgroundColor="#b2dfdb"
          showPercentage
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars with custom colors for specific branding needs.',
      },
    },
  },
};

// Without animation
export const WithoutAnimation: Story = {
  render: () => {
    const [value, setValue] = React.useState(25);
    
    return (
      <View style={{ gap: 16 }}>
        <Card>
          <Typography variant="h4" style={{ marginBottom: 16 }}>
            Animation Comparison
          </Typography>
          
          <View style={{ gap: 12 }}>
            <View>
              <Typography variant="body2" style={{ marginBottom: 8 }}>
                With Animation (Default)
              </Typography>
              <ProgressBar
                value={value}
                showPercentage
                animated={true}
              />
            </View>
            
            <View>
              <Typography variant="body2" style={{ marginBottom: 8 }}>
                Without Animation
              </Typography>
              <ProgressBar
                value={value}
                showPercentage
                animated={false}
              />
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            <Typography variant="body2">Test Values:</Typography>
            {[25, 50, 75, 100].map(testValue => (
              <Typography
                key={testValue}
                variant="body2"
                color="primary"
                style={{ 
                  textDecorationLine: value === testValue ? 'underline' : 'none',
                  fontWeight: value === testValue ? 'bold' : 'normal'
                }}
                onPress={() => setValue(testValue)}
              >
                {testValue}%
              </Typography>
            ))}
          </View>
        </Card>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison between animated and non-animated progress bars.',
      },
    },
  },
};