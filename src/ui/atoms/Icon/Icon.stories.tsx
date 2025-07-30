import { logger } from '@lib/utils/logger';
/**
 * Icon Component Stories
 * Storybook stories showcasing all Icon variants and use cases
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { ThemeProvider } from '../../../context/ThemeContext';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
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
        component: 'A consistent icon wrapper with sizing, colors, and accessibility features.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
      'home', 'settings', 'person', 'notifications', 'search', 'add', 'close',
      'checkmark', 'heart', 'star', 'bookmark', 'share', 'download', 'upload',
      'pencil', 'trash', 'camera', 'image', 'mail', 'call', 'location'],

      description: 'Ionicon name to display'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Icon size'
    },
    color: {
      control: 'select',
      options: [
      'primary', 'secondary', 'tertiary', 'disabled', 'inverse',
      'success', 'warning', 'error'],

      description: 'Icon color from theme'
    },
    background: {
      control: 'boolean',
      description: 'Show background circle'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Icon>;

// Basic icon
export const Default: Story = {
  args: {
    name: 'home'
  }
};

// All sizes
export const Sizes: Story = {
  render: () =>
  <View style={styles.row}>
      <Icon name="home" size="xs" />
      <Icon name="home" size="sm" />
      <Icon name="home" size="md" />
      <Icon name="home" size="lg" />
      <Icon name="home" size="xl" />
      <Icon name="home" size="2xl" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Icons in different sizes: xs, sm, md, lg, xl, 2xl'
      }
    }
  }
};

// All colors
export const Colors: Story = {
  render: () =>
  <View style={styles.grid}>
      <Icon name="heart" color="primary" />
      <Icon name="heart" color="secondary" />
      <Icon name="heart" color="tertiary" />
      <Icon name="heart" color="success" />
      <Icon name="heart" color="warning" />
      <Icon name="heart" color="error" />
      <Icon name="heart" color="disabled" />
      <Icon name="heart" color="inverse" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Icons with different semantic colors from the theme'
      }
    }
  }
};

// Custom colors
export const CustomColors: Story = {
  render: () =>
  <View style={styles.row}>
      <Icon name="star" color="#ff6b6b" />
      <Icon name="star" color="#4ecdc4" />
      <Icon name="star" color="#45b7d1" />
      <Icon name="star" color="#96ceb4" />
      <Icon name="star" color="#feca57" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Icons with custom hex colors'
      }
    }
  }
};

// With background
export const WithBackground: Story = {
  render: () =>
  <View style={styles.row}>
      <Icon name="settings" background />
      <Icon name="settings" background size="lg" />
      <Icon name="settings" background size="xl" color="primary" />
      <Icon name="settings" background backgroundColor="#e3f2fd" color="primary" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Icons with background circles in different sizes and colors'
      }
    }
  }
};

// Interactive icons
export const Interactive: Story = {
  render: () =>
  <View style={styles.row}>
      <Icon
      name="heart"
      onPress={() => logger.debug('Heart pressed')}
      accessibilityLabel="Like button" />
    
      <Icon
      name="bookmark"
      onPress={() => logger.debug('Bookmark pressed')}
      background
      accessibilityLabel="Bookmark button" />
    
      <Icon
      name="share"
      onPress={() => logger.debug('Share pressed')}
      size="lg"
      color="primary"
      accessibilityLabel="Share button" />
    
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Interactive icons that respond to press events'
      }
    }
  }
};

// Disabled state
export const Disabled: Story = {
  render: () =>
  <View style={styles.row}>
      <Icon name="settings" disabled />
      <Icon name="settings" onPress={() => {}} disabled />
      <Icon name="settings" background disabled />
      <Icon name="settings" background onPress={() => {}} disabled />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Icons in disabled state with reduced opacity'
      }
    }
  }
};

// Common use cases
export const CommonUseCases: Story = {
  render: () =>
  <View style={styles.grid}>
      <Icon name="home" accessibilityLabel="Home" />
      <Icon name="search" accessibilityLabel="Search" />
      <Icon name="notifications" accessibilityLabel="Notifications" />
      <Icon name="person" accessibilityLabel="Profile" />
      <Icon name="settings" accessibilityLabel="Settings" />
      <Icon name="add" background color="primary" accessibilityLabel="Add new" />
      <Icon name="close" onPress={() => {}} accessibilityLabel="Close" />
      <Icon name="checkmark" color="success" accessibilityLabel="Success" />
      <Icon name="heart" color="error" accessibilityLabel="Favorite" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Common icon use cases with proper accessibility labels'
      }
    }
  }
};

// Navigation icons
export const NavigationIcons: Story = {
  render: () =>
  <View style={styles.row}>
      <Icon name="arrow-back" onPress={() => {}} accessibilityLabel="Go back" />
      <Icon name="arrow-forward" onPress={() => {}} accessibilityLabel="Go forward" />
      <Icon name="arrow-up" onPress={() => {}} accessibilityLabel="Go up" />
      <Icon name="arrow-down" onPress={() => {}} accessibilityLabel="Go down" />
      <Icon name="menu" onPress={() => {}} accessibilityLabel="Open menu" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Navigation icons commonly used in app interfaces'
      }
    }
  }
};

// Action icons
export const ActionIcons: Story = {
  render: () =>
  <View style={styles.grid}>
      <Icon name="pencil" onPress={() => {}} accessibilityLabel="Edit" />
      <Icon name="trash" onPress={() => {}} color="error" accessibilityLabel="Delete" />
      <Icon name="download" onPress={() => {}} accessibilityLabel="Download" />
      <Icon name="share" onPress={() => {}} accessibilityLabel="Share" />
      <Icon name="copy" onPress={() => {}} accessibilityLabel="Copy" />
      <Icon name="save" onPress={() => {}} color="success" accessibilityLabel="Save" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Action icons for common user interactions'
      }
    }
  }
};

// Status icons
export const StatusIcons: Story = {
  render: () =>
  <View style={styles.row}>
      <Icon name="checkmark-circle" color="success" accessibilityLabel="Success" />
      <Icon name="warning" color="warning" accessibilityLabel="Warning" />
      <Icon name="close-circle" color="error" accessibilityLabel="Error" />
      <Icon name="information-circle" color="primary" accessibilityLabel="Information" />
      <Icon name="help-circle" color="secondary" accessibilityLabel="Help" />
    </View>,

  parameters: {
    docs: {
      description: {
        story: 'Status icons with appropriate semantic colors'
      }
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    maxWidth: 200
  }
});