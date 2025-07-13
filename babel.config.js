module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-flow'],
    plugins: [
      // Reanimated plugin is required for expo-router and other navigation libraries
      'react-native-reanimated/plugin',
    ],
  };
}; 