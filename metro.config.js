const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const path = require('path');

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

module.exports = withStorybook(config);