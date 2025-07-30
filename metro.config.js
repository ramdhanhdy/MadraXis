const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Try to import Storybook metro config, fallback if not available
let withStorybook;
try {
  const storybookModule = require('@storybook/react-native/metro/withStorybook');
  withStorybook = storybookModule.withStorybook || storybookModule.default || storybookModule;
} catch (error) {
  console.warn('Storybook metro config not available, using fallback');
  withStorybook = (config) => config;
}

const config = getDefaultConfig(__dirname, {
  // Enable CSS support.
  isCSSEnabled: true,
});

// Add Supabase support for React Native 0.79+
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add SVG support
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Add path aliases
config.resolver.alias = {
  '@design-system': path.resolve(__dirname, 'src/design-system'),
  '@ui': path.resolve(__dirname, 'src/ui'),
  '@domains': path.resolve(__dirname, 'src/domains'),
  '@lib': path.resolve(__dirname, 'src/lib'),
  '@context': path.resolve(__dirname, 'src/context'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@app': path.resolve(__dirname, 'app'),
};

// Export config with Storybook if available, otherwise plain config
module.exports = typeof withStorybook === 'function' ? withStorybook(config) : config;