import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    // Our actual component stories following atomic design structure
    '../src/ui/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
