# Real-time Subscription Hooks

## Overview

This directory contains custom React hooks for managing real-time subscriptions with Supabase in the "Add Students to Classes" feature.

## Available Hooks

### useClassStudentsSubscription
Provides real-time updates for students enrolled in a specific class.

**Usage:**
```typescript
const { students, loading, error, refetch } = useClassStudentsSubscription({
  classId: 123,
  enabled: true,
});
```

**Returns:**
- `students`: Array of student objects with real-time updates
- `loading`: Boolean indicating loading state
- `error`: Error object if subscription fails
- `refetch`: Function to manually refresh data

### useStudentCountSubscription
Provides real-time student count updates for multiple classes.

**Usage:**
```typescript
const { counts, loading, error, refetch } = useStudentCountSubscription({
  classIds: [123, 124, 125],
  enabled: true,
});
```

**Returns:**
- `counts`: Object mapping class IDs to student counts
- `loading`: Boolean indicating loading state
- `error`: Error object if subscription fails
- `refetch`: Function to manually refresh counts

## Implementation Details

### Connection Management
- Automatic reconnection handling
- Error recovery for lost connections
- Cleanup on component unmount
- Memory leak prevention

### Performance Optimizations
- Debounced updates for batch operations
- Efficient change detection
- Optimized re-renders

### Error Handling
- Graceful degradation when offline
- Retry mechanisms for failed connections
- User-friendly error messages