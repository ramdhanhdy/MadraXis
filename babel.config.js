module.exports = function (api) {
  api.cache(true);
  
  const isTest = api.env('test');
  
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript',
      ...(isTest ? ['@babel/preset-env'] : [])
    ],
    plugins: [
      // Reanimated plugin is required for expo-router and other navigation libraries
      // But disable it during testing to avoid issues
      ...(isTest ? [] : ['react-native-reanimated/plugin']),
    ],
  };
};