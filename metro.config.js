const { getDefaultConfig } = require('expo/metro-config');

  const config = getDefaultConfig(__dirname);

// Fix for @supabase/supabase-js package exports issue with React Native 0.79+
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// SVG support configuration
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config; 