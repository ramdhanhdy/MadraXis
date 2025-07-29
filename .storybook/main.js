const path = require('path');

module.exports = {
  stories: [
    '../src/ui/**/*.stories.@(js|jsx|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-native',
    options: {},
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    // Add path aliases support
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ui': path.resolve(__dirname, '../src/ui'),
      '@domains': path.resolve(__dirname, '../src/domains'),
      '@lib': path.resolve(__dirname, '../src/lib'),
      '@design-system': path.resolve(__dirname, '../src/design-system'),
      '@context': path.resolve(__dirname, '../src/context'),
      '@types': path.resolve(__dirname, '../src/types'),
      '@app': path.resolve(__dirname, '../app'),
    };

    // Handle React Native modules
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ];

    // Add React Native Web support
    config.resolve.alias['react-native$'] = 'react-native-web';

    return config;
  },
  docs: {
    autodocs: 'tag',
  },
};
