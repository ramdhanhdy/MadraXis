module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-.*|expo(nent)?|@expo(nent)?/.*|@unimodules|@sentry/.*|sentry-expo|native-base))',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@design-system/(.*)$': '<rootDir>/src/design-system/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jsdom',
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
