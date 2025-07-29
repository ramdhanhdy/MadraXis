import { View } from 'react-native';
import { ThemeProvider } from '../src/context/ThemeContext';

// Global parameters for all stories
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    extractComponentDescription: (component, { notes }) => {
      if (notes) {
        return typeof notes === 'string' ? notes : notes.markdown || notes.text;
      }
      return null;
    },
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px',
        },
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1024px',
          height: '768px',
        },
      },
    },
    defaultViewport: 'mobile',
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#f8f9fa',
      },
      {
        name: 'dark',
        value: '#212529',
      },
      {
        name: 'white',
        value: '#ffffff',
      },
    ],
  },
};

// Global decorators for all stories
export const decorators = [
  (Story) => (
    <ThemeProvider>
      <View style={{ padding: 16, minHeight: 200 }}>
        <Story />
      </View>
    </ThemeProvider>
  ),
];

// Global arg types
export const argTypes = {
  // Common props that many components might have
  testID: {
    control: 'text',
    description: 'Test identifier for automated testing',
  },
  accessibilityLabel: {
    control: 'text',
    description: 'Accessibility label for screen readers',
  },
  accessibilityHint: {
    control: 'text',
    description: 'Accessibility hint for screen readers',
  },
};
