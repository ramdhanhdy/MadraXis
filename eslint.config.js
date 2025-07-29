// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*", "coverage/*"],
    languageOptions: {
      globals: {
        Bun: "readonly"
      }
    },
    rules: {
      // Architectural pattern enforcement
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../../*'],
              message: 'Avoid deep relative imports. Use path aliases (@ui, @domains, @lib, etc.) instead.'
            },
            {
              group: ['src/services/*'],
              message: 'Direct service imports are deprecated. Use domain imports (@domains/*) instead.'
            },
            {
              group: ['src/components/*'],
              message: 'Direct component imports are deprecated. Use UI imports (@ui/*) instead.'
            }
          ]
        }
      ],
      // Code quality rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      // React Native specific rules
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      // Import organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          pathGroups: [
            {
              pattern: '@ui/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@domains/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@lib/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@design-system/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@context/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@types/**',
              group: 'internal',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  }
]);
