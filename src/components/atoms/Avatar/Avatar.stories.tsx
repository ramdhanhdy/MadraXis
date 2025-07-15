/**
 * Avatar Component Stories
 * Storybook stories showcasing all Avatar variants and use cases
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { ThemeProvider } from '../../../context/ThemeContext';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={styles.container}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'User profile images and initials with consistent sizing and fallbacks.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'User name for generating initials',
    },
    initials: {
      control: 'text',
      description: 'Custom initials (overrides name-based generation)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Avatar size',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square', 'rounded'],
      description: 'Avatar shape',
    },
    showStatus: {
      control: 'boolean',
      description: 'Show status indicator',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy'],
      description: 'Status indicator type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Mock image sources
const mockImageSource = { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' };
const mockImageSource2 = { uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' };

// Basic avatar with initials
export const Default: Story = {
  args: {
    name: 'John Doe',
  },
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar name="John Doe" size="xs" />
      <Avatar name="John Doe" size="sm" />
      <Avatar name="John Doe" size="md" />
      <Avatar name="John Doe" size="lg" />
      <Avatar name="John Doe" size="xl" />
      <Avatar name="John Doe" size="2xl" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars in different sizes: xs, sm, md, lg, xl, 2xl',
      },
    },
  },
};

// All shapes
export const Shapes: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar name="John Doe" shape="circle" size="lg" />
      <Avatar name="John Doe" shape="square" size="lg" />
      <Avatar name="John Doe" shape="rounded" size="lg" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with different shapes: circle, square, rounded',
      },
    },
  },
};

// With images
export const WithImages: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar source={mockImageSource} name="John Doe" />
      <Avatar source={mockImageSource2} name="Jane Smith" size="lg" />
      <Avatar source={mockImageSource} name="Bob Johnson" shape="rounded" size="xl" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars displaying user profile images',
      },
    },
  },
};

// Initials generation
export const InitialsGeneration: Story = {
  render: () => (
    <View style={styles.grid}>
      <Avatar name="John" />
      <Avatar name="John Doe" />
      <Avatar name="John Michael Doe" />
      <Avatar name="José María" />
      <Avatar initials="AB" name="Should be AB" />
      <Avatar name="" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different ways initials are generated from names',
      },
    },
  },
};

// Status indicators
export const StatusIndicators: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar name="John Doe" showStatus status="online" />
      <Avatar name="Jane Smith" showStatus status="away" />
      <Avatar name="Bob Johnson" showStatus status="busy" />
      <Avatar name="Alice Brown" showStatus status="offline" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with different status indicators',
      },
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar name="Red User" backgroundColor="#ff6b6b" />
      <Avatar name="Blue User" backgroundColor="#4ecdc4" />
      <Avatar name="Green User" backgroundColor="#45b7d1" />
      <Avatar name="Purple User" backgroundColor="#a8e6cf" />
      <Avatar name="Orange User" backgroundColor="#feca57" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with custom background colors',
      },
    },
  },
};

// With borders
export const WithBorders: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar name="John Doe" borderWidth={2} borderColor="#e0e0e0" />
      <Avatar name="Jane Smith" borderWidth={3} borderColor="#2196f3" size="lg" />
      <Avatar 
        source={mockImageSource} 
        name="Bob Johnson" 
        borderWidth={4} 
        borderColor="#4caf50" 
        size="xl" 
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with different border styles',
      },
    },
  },
};

// Interactive avatars
export const Interactive: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar 
        name="John Doe" 
        onPress={() => console.log('John pressed')} 
        accessibilityLabel="John Doe's profile"
      />
      <Avatar 
        source={mockImageSource2} 
        name="Jane Smith" 
        onPress={() => console.log('Jane pressed')} 
        size="lg"
        accessibilityLabel="Jane Smith's profile"
      />
      <Avatar 
        name="Bob Johnson" 
        onPress={() => console.log('Bob pressed')} 
        showStatus 
        status="online"
        size="xl"
        accessibilityLabel="Bob Johnson's profile"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive avatars that respond to press events',
      },
    },
  },
};

// Disabled state
export const Disabled: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar name="John Doe" disabled />
      <Avatar name="Jane Smith" onPress={() => {}} disabled />
      <Avatar source={mockImageSource} name="Bob Johnson" onPress={() => {}} disabled />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars in disabled state with reduced opacity',
      },
    },
  },
};

// Team/Group avatars
export const TeamAvatars: Story = {
  render: () => (
    <View style={styles.grid}>
      <Avatar name="Alice Johnson" showStatus status="online" />
      <Avatar name="Bob Smith" showStatus status="away" />
      <Avatar name="Carol Davis" showStatus status="busy" />
      <Avatar name="David Wilson" showStatus status="offline" />
      <Avatar name="Eva Brown" showStatus status="online" />
      <Avatar name="Frank Miller" showStatus status="away" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Team member avatars with status indicators',
      },
    },
  },
};

// Different roles/contexts
export const RoleBasedAvatars: Story = {
  render: () => (
    <View style={styles.column}>
      <View style={styles.section}>
        <Avatar name="Teacher Name" backgroundColor="#2196f3" size="lg" />
        <Avatar name="Student Name" backgroundColor="#4caf50" size="md" />
        <Avatar name="Parent Name" backgroundColor="#ff9800" size="md" />
        <Avatar name="Admin User" backgroundColor="#9c27b0" size="lg" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars styled for different user roles',
      },
    },
  },
};

// Complex combinations
export const ComplexCombinations: Story = {
  render: () => (
    <View style={styles.grid}>
      <Avatar
        source={mockImageSource}
        name="John Doe"
        size="xl"
        shape="rounded"
        showStatus
        status="online"
        borderWidth={2}
        borderColor="#4caf50"
        onPress={() => console.log('Complex avatar pressed')}
      />
      <Avatar
        name="Jane Smith"
        size="lg"
        shape="circle"
        backgroundColor="#e3f2fd"
        textColor="#1976d2"
        showStatus
        status="busy"
        borderWidth={1}
        borderColor="#1976d2"
      />
      <Avatar
        initials="AB"
        size="xl"
        shape="square"
        backgroundColor="#fff3e0"
        textColor="#f57c00"
        showStatus
        status="away"
        statusColor="#ff9800"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex avatar configurations with multiple features',
      },
    },
  },
};

// Fallback scenarios
export const FallbackScenarios: Story = {
  render: () => (
    <View style={styles.row}>
      <Avatar source={{ uri: 'invalid-url' }} name="Fallback User" />
      <Avatar name="" />
      <Avatar />
      <Avatar initials="" name="Empty Initials" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar fallback behavior when images fail or data is missing',
      },
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  column: {
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    maxWidth: 300,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});