module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxRuntime: 'automatic' }],
      '@babel/preset-typescript'
    ],
    plugins: [
      'react-native-reanimated/plugin'
    ],
    env: {
      test: {
        presets: [
          ['babel-preset-expo', { jsxRuntime: 'automatic' }],
          '@babel/preset-typescript',
          ['@babel/preset-env', { targets: { node: 'current' } }]
        ],
        plugins: []
      }
    }
  };
};