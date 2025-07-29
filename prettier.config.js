module.exports = {
  // Basic formatting
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  
  // JSX specific
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  
  // Other formatting options
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript',
      },
    },
  ],
};
