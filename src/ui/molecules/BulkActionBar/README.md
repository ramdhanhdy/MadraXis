# BulkActionBar Component

A bulk action bar component that displays selection count and provides bulk action buttons for managing multiple selections in lists and grids.

## Overview

The `BulkActionBar` component is designed to work with selection interfaces, providing users with quick actions to manage multiple selected items. It displays the current selection count and offers "Select all" and "Clear" actions with proper visual feedback and accessibility support.

## Features

- **Selection Count Display**: Shows the number of currently selected items
- **Select All Action**: Button to select all visible items at once
- **Clear Selection Action**: Button to clear all selections (only shown when items are selected)
- **Disabled State**: Support for disabling all actions
- **Accessibility**: Full screen reader support with descriptive labels and hints
- **Responsive Design**: Adapts to different screen sizes
- **Theme Integration**: Uses design system colors and typography

## Usage

```typescript
import { BulkActionBar } from '@/components/molecules/BulkActionBar';
import { useState } from 'react';

const SelectionInterface = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const totalVisible = 20;
  
  const handleSelectAll = () => {
    // Logic to select all visible items
    const allIds = visibleItems.map(item => item.id);
    setSelectedIds(new Set(allIds));
  };
  
  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };
  
  return (
    <BulkActionBar
      selectedCount={selectedIds.size}
      totalVisible={totalVisible}
      onSelectAll={handleSelectAll}
      onClearSelection={handleClearSelection}
      disabled={loading}
    />
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectedCount` | `number` | Yes | Number of currently selected items |
| `totalVisible` | `number` | Yes | Total number of visible items that can be selected |
| `onSelectAll` | `() => void` | Yes | Callback when select all button is pressed |
| `onClearSelection` | `() => void` | Yes | Callback when clear selection button is pressed |
| `disabled` | `boolean` | No | Whether the action buttons are disabled |
| `style` | `ViewStyle` | No | Custom container styles |
| `testID` | `string` | No | Test identifier |

## Component Behavior

### Selection Count
- Displays "0 selected" when no items are selected
- Shows "1 selected" for single selection
- Shows "N selected" for multiple selections
- Handles edge cases like negative counts (displays as 0)

### Button Visibility
- **Select All**: Always visible, allows selecting all visible items
- **Clear**: Only visible when `selectedCount > 0`

### Button States
- Both buttons are disabled when `disabled` prop is `true`
- Buttons show loading states during operations
- Proper visual feedback for press states

## Accessibility

### Screen Reader Support
- Selection count is announced as "X items selected"
- Select all button has hint: "Select all X visible items"
- Clear button has hint: "Clear all selected items"
- Proper role and state information

### Keyboard Navigation
- Buttons are focusable and activatable with Enter/Space
- Proper tab order
- Focus indicators follow design system

## Styling

The component uses the design system for consistent styling:

```typescript
// Container styling
const containerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
  backgroundColor: theme.colors.surface,
  borderTopWidth: 1,
  borderTopColor: theme.colors.border,
};
```

### Customization

You can customize the appearance using the `style` prop:

```typescript
<BulkActionBar
  selectedCount={5}
  totalVisible={20}
  onSelectAll={handleSelectAll}
  onClearSelection={handleClearSelection}
  style={{
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 16,
  }}
/>
```

## Integration Examples

### With StudentSelectionList

```typescript
const StudentSelection = () => {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [students, setStudents] = useState<Student[]>([]);
  
  return (
    <View>
      <StudentSelectionList
        students={students}
        selectedStudentIds={selectedStudents}
        onStudentSelect={(id) => setSelectedStudents(prev => new Set([...prev, id]))}
        onStudentDeselect={(id) => {
          const newSet = new Set(selectedStudents);
          newSet.delete(id);
          setSelectedStudents(newSet);
        }}
      />
      <BulkActionBar
        selectedCount={selectedStudents.size}
        totalVisible={students.length}
        onSelectAll={() => setSelectedStudents(new Set(students.map(s => s.id)))}
        onClearSelection={() => setSelectedStudents(new Set())}
      />
    </View>
  );
};
```

### With Loading States

```typescript
const LoadingExample = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSelectAll = async () => {
    setLoading(true);
    try {
      // Perform bulk selection operation
      await selectAllItems();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <BulkActionBar
      selectedCount={selectedCount}
      totalVisible={totalVisible}
      onSelectAll={handleSelectAll}
      onClearSelection={handleClearSelection}
      disabled={loading}
    />
  );
};
```

## Testing

The component includes comprehensive tests covering:
- Rendering with different selection states
- Button interactions and callbacks
- Disabled state behavior
- Accessibility features
- Edge cases (negative counts, zero items, etc.)

Run tests with:
```bash
bun test BulkActionBar.test.tsx
```

## Storybook

Interactive documentation and testing available in Storybook:
```bash
bun run storybook
```

Stories include:
- Default state (no selections)
- With selections
- All items selected
- Large numbers
- Disabled state
- Empty list
- Mobile and tablet responsive views

## Performance Considerations

- Component is lightweight and renders efficiently
- Uses `useCallback` for event handlers when used in parent components
- Minimal re-renders when selection count changes
- Optimized for frequent updates in large lists

## Design System Integration

The component follows the MadraXis design system:
- Uses `ThemeContext` for consistent theming
- Integrates with `Typography` and `Button` atomic components
- Follows spacing and color guidelines
- Responsive design patterns

## Related Components

- `StudentSelectionList` - Uses BulkActionBar for student selection
- `Button` - Atomic component used for actions
- `Typography` - Used for selection count display
- `ListItem` - Often used with bulk selection interfaces

## Future Enhancements

- Support for custom action buttons
- Batch operation progress indicators
- Undo/redo functionality for bulk actions
- Keyboard shortcuts for bulk operations
- Animation transitions for state changes