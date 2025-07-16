# Technology Stack

## Core Framework
- **React Native** with **Expo SDK 53** for cross-platform mobile development
- **Expo Router** for file-based navigation and routing
- **TypeScript** for type safety and better developer experience

## Backend & Services
- **Supabase** for authentication, database, and edge functions
- **Row Level Security (RLS)** for data access control
- **Invite-only authentication** system with email-based password setup

## Key Libraries
- **@supabase/supabase-js** for backend integration
- **@react-navigation** for navigation components
- **react-native-reanimated** for animations
- **expo-blur**, **expo-haptics** for native device features
- **react-native-svg** for vector graphics

## Development Tools
- **Jest** with **@testing-library/react-native** for testing
- **Storybook** for component development and documentation
- **Babel** with TypeScript preset for compilation
- **Metro** bundler with CSS and SVG support

## Common Commands

### Development
```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Android emulator
npm run ios        # iOS simulator  
npm run web        # Web browser
```

### Testing
```bash
# Run tests in watch mode
npm test

# Run linting
npm run lint
```

### Project Management
```bash
# Reset project (clean slate)
npm run reset-project
```

## Configuration Notes
- Environment variables in `.env` for Supabase credentials
- Custom scheme `madraxis://` for deep linking
- Metro config includes Supabase React Native 0.79+ support
- TypeScript strict mode enabled with path aliases (`@/*`)