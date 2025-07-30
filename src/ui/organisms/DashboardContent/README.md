# DashboardContent Component

A reusable dashboard content container that provides consistent layout for quick actions, progress tracking, and custom content across different user roles.

## Features

- **Quick Actions Grid**: Displays action buttons in a responsive grid layout
- **Progress Tracking**: Shows academic or task progress with visual indicators
- **Custom Content**: Supports additional custom content sections
- **Loading States**: Built-in loading state handling
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

```tsx
import { DashboardContent } from '../../components/organisms/DashboardContent';

const quickActions = [
  {
    title: 'Hafalan',
    icon: 'book',
    onPress: () => navigateToQuranProgress(),
    accessibilityLabel: 'View Quran memorization progress',
  },
  {
    title: 'Jadwal',
    icon: 'calendar',
    onPress: () => navigateToSchedule(),
    accessibilityLabel: 'View class schedule',
  },
];

const progressData = [
  {
    label: 'Al-Baqarah',
    value: 60,
    variant: 'default',
    showLabel: true,
    showPercentage: true,
  },
];

<DashboardContent
  quickActions={quickActions}
  progressData={progressData}
  loading={false}
  testID="student-dashboard-content"
>
  {/* Custom content */}
  <Card>
    <Typography variant="h4">Additional Content</Typography>
  </Card>
</DashboardContent>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quickActions` | `QuickActionConfig[]` | - | Array of quick action configurations |
| `progressData` | `ProgressConfig[]` | - | Array of progress bar configurations |
| `loading` | `boolean` | `false` | Loading state indicator |
| `children` | `React.ReactNode` | - | Custom content to display |
| `testID` | `string` | - | Test identifier for testing |

## Type Definitions

### QuickActionConfig
```tsx
interface QuickActionConfig {
  title: string;
  subtitle?: string;
  icon: string;
  badge?: number;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

### ProgressConfig
```tsx
interface ProgressConfig {
  label: string;
  value: number;
  variant: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  showPercentage?: boolean;
}
```

## Design System Integration

This component uses the following design system components:
- `Card` for section containers
- `Typography` for consistent text styling
- `QuickAction` for action buttons
- `ProgressBar` for progress indicators

## Accessibility

- Proper semantic roles for sections and actions
- Screen reader friendly labels and hints
- Keyboard navigation support
- Focus management

## Testing

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { DashboardContent } from './DashboardContent';

test('renders quick actions correctly', () => {
  const mockActions = [
    { title: 'Test Action', icon: 'home', onPress: jest.fn() }
  ];
  
  const { getByText } = render(
    <DashboardContent quickActions={mockActions} progressData={[]} />
  );
  
  expect(getByText('Test Action')).toBeTruthy();
});
```