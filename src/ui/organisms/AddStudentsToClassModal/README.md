# AddStudentsToClassModal

A comprehensive modal component for adding students to a class with advanced search, filtering, and selection capabilities.

## Overview

The `AddStudentsToClassModal` provides teachers and administrators with an intuitive interface to add students to their classes. It features real-time search, filtering options, bulk selection, and seamless integration with the ClassService.

## Features

- **Real-time Search**: Search students by name or NIS (Student ID)
- **Advanced Filtering**: Filter by grade level, boarding status, and other criteria
- **Bulk Selection**: Select individual students or all available students
- **Responsive Design**: Optimized for both phone and tablet layouts
- **Error Handling**: Comprehensive error states with retry functionality
- **Loading States**: Smooth loading indicators and skeleton screens
- **Pull-to-Refresh**: Refresh student data with pull gesture
- **Accessibility**: Full accessibility support with proper labels and navigation

## Usage

```tsx
import { AddStudentsToClassModal } from '@/components/organisms/AddStudentsToClassModal';

function ClassManagement() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleStudentsAdded = (count: number) => {
    console.log(`Successfully added ${count} students`);
    setModalVisible(false);
    // Refresh class data or show success message
  };

  return (
    <>
      <Button 
        title="Add Students" 
        onPress={() => setModalVisible(true)} 
      />
      
      <AddStudentsToClassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        classId={selectedClass?.id}
        className={selectedClass?.name}
        onStudentsAdded={handleStudentsAdded}
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Callback when modal is closed |
| `classId` | `number` | Yes | ID of the class to add students to |
| `className` | `string` | Yes | Name of the class for display |
| `onStudentsAdded` | `(count: number) => void` | Yes | Callback when students are successfully added |

## State Management

The component manages several internal states:

- **Loading State**: Shows loading indicators while fetching data
- **Student Data**: Manages the list of available students
- **Search State**: Handles search input and debouncing
- **Filter State**: Manages active filters (grade level, boarding status)
- **Selection State**: Tracks selected students
- **Error State**: Handles and displays error messages

## Data Flow

1. **Initial Load**: Fetches available students using `ClassService.getAvailableStudents()`
2. **Search**: Debounced search queries trigger new data fetches
3. **Filter**: Filter changes immediately trigger new data fetches
4. **Selection**: Student selection is managed locally until submission
5. **Submission**: Selected students are added using `ClassService.addStudentsToClass()`

## Integration with ClassService

The component integrates with the following ClassService methods:

- `getAvailableStudents()`: Fetches students not enrolled in the class
- `addStudentsToClass()`: Adds selected students to the class
- `validateTeacherAccess()`: Ensures user has permission to modify the class

## Error Handling

The component handles various error scenarios:

- **Network Errors**: Shows retry button with error message
- **Permission Errors**: Displays appropriate access denied message
- **Validation Errors**: Shows specific validation error messages
- **Service Errors**: Handles ClassService-specific errors

## Performance Optimizations

- **Debounced Search**: Prevents excessive API calls during typing
- **Memoized Components**: Uses React.memo for child components
- **Optimized Re-renders**: Careful state management to minimize re-renders
- **Lazy Loading**: Implements pagination for large student lists

## Accessibility Features

- **Screen Reader Support**: Proper accessibility labels and hints
- **Keyboard Navigation**: Full keyboard navigation support
- **Focus Management**: Proper focus handling for modal interactions
- **High Contrast**: Supports high contrast mode
- **Voice Over**: Optimized for iOS VoiceOver
- **TalkBack**: Optimized for Android TalkBack

## Testing

The component includes comprehensive tests covering:

- **Rendering**: Modal visibility and content rendering
- **Data Loading**: Student data fetching and error handling
- **Search**: Search functionality and debouncing
- **Filtering**: Filter application and clearing
- **Selection**: Student selection and bulk operations
- **Submission**: Adding students and success/error handling
- **Accessibility**: Screen reader and keyboard navigation

### Running Tests

```bash
# Run all tests
bun test AddStudentsToClassModal.test.tsx

# Run tests in watch mode
bun test AddStudentsToClassModal.test.tsx --watch

# Run tests with coverage
bun test AddStudentsToClassModal.test.tsx --coverage
```

## Storybook Stories

The component includes various Storybook stories for development and testing:

- **Default**: Standard modal with students loaded
- **Loading**: Shows loading state
- **Empty State**: No students available
- **Error State**: Error loading students
- **Large Dataset**: Many students with pagination
- **Search Results**: Filtered search results
- **Interactive**: Full interactive demo

### Viewing Stories

```bash
# Start Storybook
bun run storybook

# Navigate to Organisms > AddStudentsToClassModal
```

## Dependencies

### Internal Dependencies
- `@/components/organisms/Modal`: Base modal component
- `@/components/molecules/StudentSelectionList`: Student list component (Task 7)
- `@/components/molecules/BulkActionBar`: Bulk action component (Task 8)
- `@/services/classService`: Class management service
- `@/hooks/useAuth`: Authentication hook
- `@/context/ThemeContext`: Theme context

### External Dependencies
- `react`: Core React library
- `react-native`: React Native framework
- `expo`: Expo SDK

## File Structure

```
AddStudentsToClassModal/
├── AddStudentsToClassModal.tsx     # Main component
├── AddStudentsToClassModal.test.tsx # Test file
├── AddStudentsToClassModal.stories.tsx # Storybook stories
├── index.ts                        # Export file
└── README.md                       # This documentation
```

## Future Enhancements

- **Advanced Filters**: Additional filtering options (class history, performance)
- **Bulk Import**: CSV/Excel import functionality
- **Student Preview**: Quick preview of student information
- **Undo Functionality**: Ability to undo recent additions
- **Drag & Drop**: Drag and drop student selection
- **Real-time Updates**: Live updates when other users modify the class

## Related Components

- [`StudentSelectionList`](../StudentSelectionList/README.md): Displays selectable student list
- [`BulkActionBar`](../BulkActionBar/README.md): Handles bulk operations
- [`ClassStudentsTemplate`](../../templates/ClassStudentsTemplate/README.md): Main class students view
- [`Modal`](../Modal/README.md): Base modal component

## Contributing

When contributing to this component:

1. **Follow TypeScript**: Maintain strict typing
2. **Add Tests**: Include tests for new functionality
3. **Update Stories**: Add relevant Storybook stories
4. **Document Changes**: Update this README for significant changes
5. **Performance**: Consider performance impact of changes
6. **Accessibility**: Ensure accessibility compliance

## Troubleshooting

### Common Issues

**Modal not showing**
- Ensure `visible` prop is `true`
- Check if modal is rendered within proper navigation context

**Students not loading**
- Verify `classId` is valid
- Check user permissions with ClassService
- Ensure network connectivity

**Search not working**
- Check debounce timing (500ms default)
- Verify search parameters in ClassService

**Selection not working**
- Ensure StudentSelectionList is properly integrated
- Check selection state management

### Debug Mode

Enable debug logging by setting:

```tsx
const DEBUG_MODE = __DEV__ && true;
```

This will log component state changes and API calls to the console.