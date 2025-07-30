# MadraXis Storybook Setup

This directory contains the Storybook configuration for the MadraXis React Native application.

## 🎯 Overview

Storybook is integrated with our existing atomic design system structure:
- **Atoms**: `src/ui/atoms/*/` (Button, Typography, Input, etc.)
- **Molecules**: `src/ui/molecules/*/` (Card, ListItem, etc.)
- **Organisms**: `src/ui/organisms/*/` (Modal, Header, etc.)
- **Templates**: `src/ui/templates/*/` (ModalTemplate, etc.)

## 🚀 How to Use Storybook

### Method 1: Toggle in Code (Recommended for Development)
1. Open `app/index.tsx`
2. Change `const ENABLE_STORYBOOK = __DEV__ && false;` to `const ENABLE_STORYBOOK = __DEV__ && true;`
3. Run `bun start` or `expo start`
4. Your app will now show Storybook instead of the normal app

### Method 2: Quick Scripts
```bash
# Show instructions
bun run storybook

# Generate/update story list
bun run storybook-generate
```

## 📁 File Structure

```
.rnstorybook/
├── index.ts              # Storybook entry point
├── main.ts               # Storybook configuration
├── preview.tsx           # Global decorators and parameters
├── storybook.requires.ts # Auto-generated story imports
└── README.md            # This file
```

## 🎨 Our Component Stories

All stories are located alongside their components:
- `src/ui/atoms/Button/Button.stories.tsx`
- `src/ui/atoms/Typography/Typography.stories.tsx`
- `src/ui/molecules/Card/Card.stories.tsx`
- `src/ui/organisms/Modal/Modal.stories.tsx`
- And many more...

## 🔧 Configuration Details

### Theme Integration
- Stories automatically use our `ThemeProvider` from `src/context/ThemeContext`
- All components render with proper theme context
- Design system integration is seamless

### Path Aliases
Metro config is enhanced with Storybook support:
- `@ui/*` → `src/ui/*`
- `@design-system/*` → `src/design-system/*`
- `@context/*` → `src/context/*`
- And more...

### Addons Enabled
- `@storybook/addon-ondevice-controls` - Interactive controls
- `@storybook/addon-ondevice-actions` - Action logging

## 📝 Adding New Stories

When creating new components, add a `.stories.tsx` file:

```typescript
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Atoms/YourComponent', // or Molecules/Organisms/Templates
  component: YourComponent,
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    // Your component props
  },
};
```

Then run `bun run storybook-generate` to update the story list.

## 🔄 Switching Back to Normal App

1. Open `app/index.tsx`
2. Change `const ENABLE_STORYBOOK = __DEV__ && true;` back to `const ENABLE_STORYBOOK = __DEV__ && false;`
3. Reload your app

## 🎯 Benefits

- **Component Development**: Develop components in isolation
- **Design System Documentation**: Visual documentation of all components
- **Testing**: Test component variants and edge cases
- **Collaboration**: Share component library with designers and stakeholders
- **Quality Assurance**: Ensure components work across different states

## 📚 Learn More

- [Storybook for React Native](https://storybook.js.org/docs/react-native/get-started/introduction)
- [Our Design System Documentation](../src/design-system/README.md)
- [Component Development Guidelines](../docs/specs/in-progress/refactor-codebase-structure/design.md)
