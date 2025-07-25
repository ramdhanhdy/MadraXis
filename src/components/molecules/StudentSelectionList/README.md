# StudentSelectionList Component

A comprehensive student selection interface that allows teachers to browse, search, filter, and select students for class enrollment.

## Overview

The `StudentSelectionList` component is designed for the "Add Students to Class" feature, providing an intuitive interface for teachers to manage student enrollment. It combines search functionality, filtering options, multi-selection capabilities, and performance optimizations to handle large student datasets efficiently.

## Features

- **Real-time Search**: Search students by name or NIS (Student ID) with debounced input
- **Advanced Filtering**: Filter by grade level (SMA/SMP) and boarding status
- **Multi-Selection**: Select individual students or use bulk actions (select all, clear selection)
- **Performance Optimized**: Virtual scrolling and memoization for large datasets
- **Responsive Design**: Adapts to different screen sizes (phone, tablet)
- **Accessibility**: Full screen reader support and keyboard navigation
- **Loading States**: Proper loading and refreshing indicators
- **Empty States**: Graceful handling of empty search results

## Components

### StudentSelectionList
The main component that orchestrates the entire student selection interface.

### StudentSelectionItem
Individual student item component with selection checkbox and student information display.

### BulkActionBar
Action bar showing selection count and bulk action buttons (select all, clear selection).

## Usage

```typescript
import { StudentSelectionList } from '@/components/molecules/StudentSelectionList';
import { StudentWithDetails } from '@/types';

const AddStudentsModal = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<StudentFilters>({});
  
  const handleStudentSelect = (studentId: string) => {
    setSelectedIds(prev => new Set([...prev, studentId]));
  };
  
  const handleStudentDeselect = (studentId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
  };
  
  return (
    <StudentSelectionList
      students={students}
      selectedStudentIds={selectedIds}
      onStudentSelect={handleStudentSelect}
      onStudentDeselect={handleStudentDeselect}
      onBulkSelect={(ids) => setSelectedIds(new Set(ids))}
      onClearSelection={() => setSelectedIds(new Set())}
      onFiltersChange={setFilters}
      filters={filters}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={loadMoreStudents}
      classLevel="SMA"
      showFilters={true}
      enableVirtualization={true}
    />
  );
};
```

## Props

### StudentSelectionList Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `students` | `StudentWithDetails[]` | Yes | Array of available students |
| `selectedStudentIds` | `Set<string>` | Yes | Set of selected student IDs |
| `onStudentSelect` | `(id: string) => void` | Yes | Callback when student is selected |
| `onStudentDeselect` | `(id: string) => void` | Yes | Callback when student is deselected |
| `onBulkSelect` | `(ids: string[]) => void` | Yes | Callback for bulk selection |
| `onClearSelection` | `() => void` | Yes | Callback to clear all selections |
| `onFiltersChange` | `(filters: StudentFilters) => void` | No | Callback when filters change |
| `onLoadMore` | `() => void` | No | Callback to load more students |
| `onRefresh` | `() => void` | No | Callback for pull-to-refresh |
| `filters` | `StudentFilters` | No | Current filter state |
| `loading` | `boolean` | No | Loading state |
| `refreshing` | `boolean` | No | Refreshing state |
| `hasMore` | `boolean` | No | Whether more students can be loaded |
| `classLevel` | `'SMA' \| 'SMP'` | No | Default grade level filter |
| `showFilters` | `boolean` | No | Whether to show filter controls |
| `enableVirtualization` | `boolean` | No | Enable virtual scrolling |
| `style` | `ViewStyle` | No | Custom container styles |
| `testID` | `string` | No | Test identifier |

### StudentFilters Type

```typescript
interface StudentFilters {
  search?: string;
  gradeLevel?: 'SMA' | 'SMP';
  boardingStatus?: 'boarding' | 'day' | 'all';
}
```

## Performance Considerations

### Virtual Scrolling
The component uses `FlatList` with `getItemLayout` for efficient rendering of large student lists. Enable `enableVirtualization` prop for datasets with 100+ items.

### Memoization
- `StudentSelectionItem` is wrapped with `React.memo`
- Filter and search operations use `useMemo`
- Event handlers use `useCallback` to prevent unnecessary re-renders

### Debounced Search
Search input is debounced with a 300ms delay to reduce API calls and improve performance.

## Accessibility

- Full screen reader support with descriptive labels
- Keyboard navigation support
- High contrast mode compatibility
- Proper focus management
- Semantic HTML structure

## Testing

The component includes comprehensive tests covering:
- Rendering with different data states
- Search functionality with debouncing
- Filter operations
- Selection state management
- Performance optimizations
- Accessibility features

Run tests with:
```bash
bun test StudentSelectionList.test.tsx
```

## Storybook

Interactive documentation and testing available in Storybook:
```bash
bun run storybook
```

Stories include:
- Default state with sample data
- Empty state
- Loading state
- Pre-selected students
- Different filter configurations
- Large dataset simulation
- Mobile responsive view

## Design System Integration

The component follows the MadraXis design system:
- Uses `ThemeContext` for consistent theming
- Integrates with atomic components (`Typography`, `Input`, `Button`, `Icon`)
- Follows spacing and color guidelines
- Responsive breakpoints for different screen sizes

## Related Components

- `AddStudentsToClassModal` - Parent modal component
- `ClassStudentsTemplate` - Displays enrolled students
- `EmptyState` - Used for empty search results
- `ListItem` - Base component for student items

## Future Enhancements

- Advanced sorting options (by name, NIS, grade)
- Export selected students list
- Batch operations (assign to multiple classes)
- Student profile quick preview
- Recent selections history
- Saved filter presets