# Deep Linking Implementation Plan for Add Students to Classes Feature

## Overview
This document outlines the implementation plan for task 11.2: "Add deep linking support" for the "Adding Students to Classes by Teachers" feature. The goal is to support direct links to the add students flow, handle navigation state restoration, and add proper error boundaries.

## Current State Analysis
- The basic navigation structure is already in place with `app/(teacher)/class/[id]/add-students.tsx`
- The route is configured in `app/(teacher)/_layout.tsx` with modal presentation
- The app already has a scheme configured ("madraxis") in app.config.js
- Basic navigation from ClassStudentsTemplate to the add students flow works

## Implementation Steps

### 1. Configure Deep Linking Support

#### 1.1. Update app.config.js
Add linking configuration to support deep links:
```javascript
export default {
  expo: {
    // ... existing configuration
    scheme: "madraxis",
    // Add linking configuration
    linking: {
      prefixes: ["madraxis://"],
      config: {
        screens: {
          // Root screens
          "(auth)": {
            path: "auth",
            screens: {
              "login": "login",
              "reset-password": "reset-password"
            }
          },
          "(teacher)": {
            path: "teacher",
            screens: {
              "class": {
                path: "class/:id",
                screens: {
                  "add-students": "add-students"
                }
              }
            }
          },
          // ... other role-based routes
        }
      }
    }
  }
};
```

### 2. Add Error Boundaries

#### 2.1. Create Error Boundary Component
Create a reusable error boundary component for handling navigation errors.

#### 2.2. Implement Error Boundary in Add Students Route
Add the error boundary to the `app/(teacher)/class/[id]/add-students.tsx` file.

### 3. Handle Navigation State Restoration

#### 3.1. Add State Persistence
Implement state persistence for the add students flow to handle app restarts or backgrounding.

#### 3.2. Add Return URL Handling
Enhance the returnUrl parameter handling to properly restore navigation state.

## Technical Details

### Deep Linking Configuration
The deep linking configuration will support URLs like:
- `madraxis://teacher/class/123/add-students` - Direct link to add students to class with ID 123

### Error Handling
- Invalid class IDs should show appropriate error messages
- Navigation errors should be caught and handled gracefully
- Network errors during student loading should show proper error states

### Navigation State Restoration
- When the app is opened from a deep link, it should navigate directly to the add students flow
- After adding students, the user should be navigated back to the appropriate location
- If the app is backgrounded during the flow, the state should be preserved

## Files to Modify

1. `app.config.js` (update)
2. `app/(teacher)/class/[id]/add-students.tsx` (update with error boundaries)
3. Create documentation for deep linking usage

## Testing Plan

### Deep Linking Tests
1. Test direct navigation to add students flow via deep link
2. Test invalid class ID handling in deep links
3. Test deep link navigation from cold start
4. Test deep link navigation from backgrounded app

### Error Boundary Tests
1. Test error boundary activation with simulated errors
2. Test error recovery and proper user feedback
3. Test logging of error events

### Navigation State Tests
1. Test state preservation during app backgrounding
2. Test proper return navigation after adding students
3. Test handling of invalid return URLs