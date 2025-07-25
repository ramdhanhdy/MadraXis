/**
 * BulkActionBar Storybook Stories
 * 
 * Interactive documentation and testing for the BulkActionBar component.
 * Demonstrates various states and configurations.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import { BulkActionBar } from './BulkActionBar';

// Story metadata
const meta: Meta<typeof BulkActionBar> = {
  title: 'Components/Molecules/BulkActionBar',
  component: BulkActionBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A bulk action bar component that displays selection count and provides bulk action buttons for managing multiple selections.

## Features
- Shows count of selected items
- "Select all" button to select all visible items
- "Clear" button to clear all selections (only shown when items are selected)
- Disabled state support
- Accessibility support with proper labels and hints

## Usage
This component is typically used in conjunction with selection lists to provide bulk operations on selected items.
        `,
      },
    },
  },
  argTypes: {
    selectedCount: {
      description: 'Number of currently selected items',
      control: { type: 'number', min: 0, max: 100 },
    },
    totalVisible: {
      description: 'Total number of visible items that can be selected',
      control: { type: 'number', min: 0, max: 100 },
    },
    disabled: {
      description: 'Whether the action buttons are disabled',
      control: { type: 'boolean' },
    },
    onSelectAll: {
      description: 'Callback when select all button is pressed',
      action: 'onSelectAll',
    },
    onClearSelection: {
      description: 'Callback when clear selection button is pressed',
      action: 'onClearSelection',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BulkActionBar>;

// Interactive wrapper component
const InteractiveWrapper = (args: any) => {
  const [selectedCount, setSelectedCount] = useState(args.selectedCount || 0);
  const totalVisible = args.totalVisible || 10;

  const handleSelectAll = () => {
    setSelectedCount(totalVisible);
    args.onSelectAll?.();
  };

  const handleClearSelection = () => {
    setSelectedCount(0);
    args.onClearSelection?.();
  };

  return (
    <View style={{ width: 350, padding: 16, backgroundColor: '#f5f5f5' }}>
      <BulkActionBar
        {...args}
        selectedCount={selectedCount}
        totalVisible={totalVisible}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />
    </View>
  );
};

// Default story - no selections
export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 0,
    totalVisible: 10,
    disabled: false,
  },
};

// With some selections
export const WithSelections: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 3,
    totalVisible: 10,
    disabled: false,
  },
};

// All items selected
export const AllSelected: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 10,
    totalVisible: 10,
    disabled: false,
  },
};

// Large numbers
export const LargeNumbers: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 47,
    totalVisible: 150,
    disabled: false,
  },
};

// Disabled state
export const Disabled: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 5,
    totalVisible: 10,
    disabled: true,
  },
};

// Empty list
export const EmptyList: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 0,
    totalVisible: 0,
    disabled: false,
  },
};

// Single item
export const SingleItem: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 0,
    totalVisible: 1,
    disabled: false,
  },
};

// Single item selected
export const SingleItemSelected: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    selectedCount: 1,
    totalVisible: 1,
    disabled: false,
  },
};

// Static examples (non-interactive)
export const StaticNoSelections: Story = {
  args: {
    selectedCount: 0,
    totalVisible: 10,
    disabled: false,
    onSelectAll: () => console.log('Select all clicked'),
    onClearSelection: () => console.log('Clear selection clicked'),
  },
  render: (args) => (
    <View style={{ width: 350, padding: 16, backgroundColor: '#f5f5f5' }}>
      <BulkActionBar {...args} />
    </View>
  ),
};

export const StaticWithSelections: Story = {
  args: {
    selectedCount: 7,
    totalVisible: 15,
    disabled: false,
    onSelectAll: () => console.log('Select all clicked'),
    onClearSelection: () => console.log('Clear selection clicked'),
  },
  render: (args) => (
    <View style={{ width: 350, padding: 16, backgroundColor: '#f5f5f5' }}>
      <BulkActionBar {...args} />
    </View>
  ),
};

// Mobile responsive view
export const MobileView: Story = {
  render: (args) => (
    <View style={{ width: 320, padding: 12, backgroundColor: '#f5f5f5' }}>
      <InteractiveWrapper {...args} />
    </View>
  ),
  args: {
    selectedCount: 3,
    totalVisible: 8,
    disabled: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet view
export const TabletView: Story = {
  render: (args) => (
    <View style={{ width: 600, padding: 20, backgroundColor: '#f5f5f5' }}>
      <InteractiveWrapper {...args} />
    </View>
  ),
  args: {
    selectedCount: 12,
    totalVisible: 25,
    disabled: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};