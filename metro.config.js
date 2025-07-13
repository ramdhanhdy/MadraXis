const { getDefaultConfig } = require('expo/metro-config');

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

module.exports = config;