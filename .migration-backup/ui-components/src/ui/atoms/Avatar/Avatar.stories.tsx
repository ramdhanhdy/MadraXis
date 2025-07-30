import { logger } from '../../../utils/logger';
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
  (Story) =>
  <ThemeProvider>
        <View style={styles.container}>
          <Story />
        </View>
      </ThemeProvider>],


  parameters: {
    docs: {
      description: {
        component: 'User profile images and initials with consistent sizing and fallbacks.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'User name for generating initials'
    },
    initials: {
      control: 'text',
      description: 'Custom initials (overrides name-based generation)'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Avatar size'
    },
    shape: {
      control: 'select',
      options: ['circle', 'square', 'rounded'],
      description: 'Avatar shape'
    },
    showStatus: {
      control: 'boolean',
      description: 'Show status indicator'
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy'],
      description: 'Status indicator type'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Mock image sources
const mockImageSource = { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' };
const mockImageSource2 = { uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' };

// Basic avatar with initials
export const Default: Story = {
  args: {
    name: 'John Doe'
  }
};

// All sizes
export const Sizes: Story = {
  render: () =>
  <View style={styles.row}>
      <Avatar name="John Doe" size="xs" />
      <Avatar name="John Doe" size="sm" />
      <Avatar name="John Doe" size="md" />
      <Avatar name="John Doe" size="lg" />
      <Avatar name="John Doe" size="xl" />
      <Avatar name="John Doe" size="2xl" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Avatars in different sizes: xs, sm, md, lg, xl, 2xl'
      }
    }
  }
};

// All shapes
export const Shapes: Story = {
  render: () =>
  <View style={styles.row}>
      <Avatar name="John Doe" shape="circle" size="lg" />
      <Avatar name="John Doe" shape="square" size="lg" />
      <Avatar name="John Doe" shape="rounded" size="lg" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Avatars with different shapes: circle, square, rounded'
      }
    }
  }
};

// With images
export const WithImages: Story = {
  render: () =>
  <View style={styles.row}>
      <Avatar source={mockImageSource} name="John Doe" size="lg" />
      <Avatar source={mockImageSource2} name="Jane Smith" size="lg" />
      <Avatar source={{ uri: 'invalid-url' }} name="Fallback User" size="lg" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Avatars with images and fallback to initials when image fails'
      }
    }
  }
};

// Status indicators
export const WithStatus: Story = {
  render: () =>
  <View style={styles.row}>
      <Avatar name="Online User" showStatus status="online" size="lg" />
      <Avatar name="Away User" showStatus status="away" size="lg" />
      <Avatar name="Busy User" showStatus status="busy" size="lg" />
      <Avatar name="Offline User" showStatus status="offline" size="lg" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Avatars with status indicators: online, away, busy, offline'
      }
    }
  }
};

// Interactive avatars
export const Interactive: Story = {
  render: () =>
  <View style={styles.row}>
      <Avatar 
        name="Clickable User" 
        size="lg" 
        onPress={() => logger.debug('Avatar clicked')}
      />
      <Avatar 
        name="Disabled User" 
        size="lg" 
        onPress={() => logger.debug('Should not fire')}
        disabled
      />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Interactive avatars with onPress handlers and disabled state'
      }
    }
  }
};

// Custom styling
export const CustomStyling: Story = {
  render: () =>
  <View style={styles.row}>
      <Avatar 
        name="Custom BG" 
        size="lg" 
        backgroundColor="#ff6b6b"
        textColor="white"
      />
      <Avatar 
        name="With Border" 
        size="lg" 
        borderWidth={3}
        borderColor="#4ecdc4"
      />
      <Avatar 
        initials="CS" 
        size="lg" 
        backgroundColor="#45b7d1"
        textColor="white"
      />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Avatars with custom colors, borders, and styling'
      }
    }
  }
};

// All combinations showcase
export const Showcase: Story = {
  render: () =>
  <View style={styles.grid}>
      <View style={styles.section}>
        <Avatar name="Alice Johnson" size="xs" />
        <Avatar name="Bob Smith" size="sm" showStatus status="online" />
        <Avatar name="Carol Davis" size="md" shape="square" />
        <Avatar name="David Wilson" size="lg" showStatus status="away" />
        <Avatar name="Eva Brown" size="xl" shape="rounded" />
        <Avatar name="Frank Miller" size="2xl" showStatus status="busy" />
      </View>
      
      <View style={styles.section}>
        <Avatar source={mockImageSource} name="Image User 1" size="md" />
        <Avatar source={mockImageSource2} name="Image User 2" size="md" showStatus status="online" />
        <Avatar initials="AB" size="md" backgroundColor="#9c27b0" />
        <Avatar name="Long Name User" size="md" shape="square" />
        <Avatar name="Interactive" size="md" onPress={() => logger.debug('Clicked')} />
        <Avatar name="Disabled" size="md" onPress={() => {}} disabled />
      </View>
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of all avatar variations and combinations'
      }
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  grid: {
    gap: 24,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
});
