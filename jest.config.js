module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|expo-router|react-native-.*|expo(nent)?|@expo(nent)?/.*|@unimodules|@sentry/.*|sentry-expo|native-base))',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.migration-backup/',
    '<rootDir>/.security-backups/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  moduleNameMapper: {
    // Path aliases
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@design-system/(.*)$': '<rootDir>/src/design-system/$1',
    '^@design-system$': '<rootDir>/src/design-system/index.ts',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@/(.*)$': '<rootDir>/$1',
    // Asset mocks
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/mocks/fileMock.js',
    '\\.svg$': '<rootDir>/jest/mocks/svgMock.js',
  },
  testEnvironment: 'jsdom',
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
