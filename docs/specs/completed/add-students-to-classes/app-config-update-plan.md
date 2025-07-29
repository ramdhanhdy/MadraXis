# App Config Update Plan for Deep Linking Support

## Overview
This document outlines the specific changes needed to update `app.config.js` to support deep linking for the "Add Students to Classes" feature.

## Current Configuration
The current `app.config.js` has the following relevant sections:
- `scheme: "madraxis"` - Already configured
- Missing `linking` configuration for deep linking support

## Required Changes

### Add Linking Configuration
Add the following `linking` configuration to the `expo` object in `app.config.js`:

```javascript
linking: {
  prefixes: ["madraxis://"],
  config: {
    screens: {
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
      "(management)": {
        path: "management",
        screens: {
          "dashboard": "dashboard",
          "user-management": "user-management",
          "setup": "setup"
        }
      },
      "(parent)": {
        path: "parent",
        screens: {
          "dashboard": "dashboard",
          "anti-bullying": "anti-bullying",
          "cctv-request": "cctv-request",
          "incident-report": "incident-report"
        }
      },
      "(student)": {
        path: "student",
        screens: {
          "dashboard": "dashboard",
          "anti-bullying": "anti-bullying",
          "boarding-info": "boarding-info",
          "schedule": "schedule",
          "quran-progress": "quran-progress",
          "incident-report": "incident-report"
        }
      }
    }
  }
}
```

## Expected Deep Link URLs
After this configuration is implemented, the following deep links will be supported:

1. `madraxis://teacher/class/123/add-students` - Opens the add students modal for class with ID 123
2. `madraxis://auth/login` - Opens the login screen
3. `madraxis://management/dashboard` - Opens the management dashboard
4. And other role-based routes as defined in the configuration

## Implementation Notes
- The configuration should be added to the existing `expo` object in `app.config.js`
- The `prefixes` array should include the existing scheme "madraxis://"
- Path parameters like `:id` in `class/:id` will be extracted and made available to the route
- The configuration should match the file-based routing structure in the `app/` directory