module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.spec.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'e2e/reports',
      outputName: 'junit.xml',
    }],
  ],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/e2e/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@design-system/(.*)$': '<rootDir>/src/design-system/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
  },
};
