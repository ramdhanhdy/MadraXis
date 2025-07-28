# Navigation Implementation Plan for Adding Students to Classes

## Overview
This document outlines the implementation plan for task 11.1: "Set up modal navigation" for the "Adding Students to Classes by Teachers" feature. The goal is to properly configure expo-router for modal presentation, add proper navigation params passing, and implement back navigation handling.

## Current State Analysis
- The AddStudentsToClassModal component already exists
- Currently, the modal is presented as a regular component within ClassStudentsTemplate
- The modal is controlled by a visibility state rather than being a separate route
- Task requires creating a new modal route at `app/(teacher)/class/[id]/add-students.tsx`

## Implementation Steps

### 1. Create the Modal Route File
Create `app/(teacher)/class/[id]/add-students.tsx` with proper expo-router configuration for modal presentation.

### 2. Update Teacher Layout
Modify `app/(teacher)/_layout.tsx` to include the new modal route with appropriate screen options for modal presentation.

### 3. Update Navigation in ClassStudentsTemplate
Replace the current modal visibility state approach with proper navigation to the new modal route.

### 4. Implement Back Navigation Handling
Ensure proper back navigation handling in the modal route.

## Technical Details

### Route Configuration
The new route should be configured with:
- Modal presentation style
- Proper header configuration (close button, title)
- Navigation parameters for class ID

### Parameter Passing
- Pass class ID as route parameter
- Ensure proper type validation for parameters

### Back Navigation
- Implement close button functionality
- Handle hardware back button on Android
- Ensure proper navigation stack management

## Files to Modify

1. `app/(teacher)/class/[id]/add-students.tsx` (new file)
2. `app/(teacher)/_layout.tsx` (update)
3. `src/components/templates/ClassStudentsTemplate.tsx` (update)