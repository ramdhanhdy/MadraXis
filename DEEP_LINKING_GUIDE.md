# Deep Linking Implementation Guide

## Overview
This guide explains the deep linking implementation for the "Add Students to Classes" feature in MadraXis. The implementation supports direct navigation to the add students flow from external links.

## Deep Link URLs

### Add Students to Class
```
madraxis://teacher/class/{classId}/add-students
```

**Example:**
```
madraxis://teacher/class/123/add-students
```

### Other Supported URLs
- `madraxis://teacher/class/{classId}` - Class details
- `madraxis://teacher/dashboard` - Teacher dashboard
- `madraxis://auth/login` - Login screen

## Configuration

### App Configuration
The deep linking configuration is defined in `app.config.js` with the following structure:

```javascript
linking: {
  prefixes: ["madraxis://"],
  config: {
    screens: {
      "(teacher)": {
        path: "teacher",
        screens: {
          "class": {
            path: "class",
            screens: {
              "[id]": {
                path: ":id",
                screens: {
                  "add-students": "add-students"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Navigation State Restoration

### Return URL Handling
The add students flow supports return URL handling for proper navigation state restoration:

1. **From ClassStudentsTemplate**: Includes `returnUrl` parameter
2. **From Deep Links**: Uses router.back() for fallback
3. **Error Handling**: Graceful fallback to previous screen

### Parameters
- `id`: Class ID (required)
- `returnUrl`: Optional return URL for navigation state restoration

## Error Boundaries

### Error Handling Components
- **ErrorBoundary**: Generic error boundary for component-level errors
- **ErrorFallback**: Custom error UI for the add students flow

### Error Types Handled
1. Invalid class ID
2. Component rendering errors
3. Network errors
4. Navigation errors

## Testing Deep Links

### Test URLs
You can test deep links using:

1. **Expo Dev Client**: Run `expo start --dev-client` and use the URL
2. **Simulator**: Use the simulator's browser or terminal
3. **Physical Device**: Use a QR code or share URL

### Test Commands
```bash
# iOS Simulator
xcrun simctl openurl booted "madraxis://teacher/class/123/add-students"

# Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "madraxis://teacher/class/123/add-students"
```

## Implementation Details

### File Structure
```
app/
  (teacher)/
    class/
      [id]/
        add-students.tsx          # Deep link target
    _layout.tsx                   # Modal configuration

src/
  components/
    organisms/
      ErrorBoundary/
        ErrorBoundary.tsx         # Error boundary component
        index.ts                  # Export file
```

### Key Features
1. **Deep Link Support**: Direct navigation to add students flow
2. **Error Boundaries**: Comprehensive error handling
3. **State Restoration**: Proper navigation flow restoration
4. **Security**: Input validation for URLs and parameters

## Usage Examples

### From External App
```javascript
// Open deep link from another app
Linking.openURL('madraxis://teacher/class/123/add-students');
```

### From Web
```html
<a href="madraxis://teacher/class/123/add-students">Add Students to Class 123</a>
```

### From Email/SMS
```
Tap to add students to class: madraxis://teacher/class/123/add-students
```

## Security Considerations
- Class ID validation before displaying UI
- Input sanitization for URL parameters
- Proper error handling for invalid URLs
- Navigation guards for permission checks

## Troubleshooting

### Common Issues
1. **Link not opening**: Check if app scheme is properly configured
2. **Invalid class ID**: Verify class exists and user has access
3. **Navigation issues**: Check returnUrl parameter encoding

### Debug Steps
1. Verify app.config.js has correct linking configuration
2. Check if app is properly installed (scheme registered)
3. Test with simple URLs first
4. Use console logging for URL parameters