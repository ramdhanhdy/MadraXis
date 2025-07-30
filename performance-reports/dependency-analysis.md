# MadraXis Dependency Analysis Report

**Generated:** 2025-07-30  
**Phase:** 11.1.2 - Bundle Size Analysis & Optimization Opportunities

## Executive Summary

The MadraXis application has **87 total dependencies** with several optimization opportunities identified:

- **44 extraneous packages** detected (potential for cleanup)
- **Heavy dependencies** that could impact bundle size
- **Storybook configuration issues** affecting build process
- **Duplicate/conflicting versions** in some packages

## Dependency Breakdown

### Production Dependencies (25)
Core dependencies required for the application to run:

#### **Heavy Dependencies (>1MB estimated)**
- `@supabase/supabase-js` (2.50.0) - Database client
- `react-native-reanimated` (3.17.5) - Animation library
- `react-native-svg` (15.11.2) - SVG support
- `@expo/vector-icons` (14.1.0) - Icon library
- `expo` (53.0.19) - Core Expo framework

#### **Medium Dependencies (100KB-1MB estimated)**
- `react-native-gesture-handler` (2.27.2)
- `react-native-screens` (4.11.1)
- `@react-navigation/native` (7.1.6)
- `react-native-webview` (13.13.5)
- `axios` (1.8.4)

#### **Light Dependencies (<100KB estimated)**
- `zustand` (5.0.6) - State management
- `uuid` (11.1.0) - UUID generation
- `zod` (4.0.5) - Schema validation
- Various Expo modules

### Development Dependencies (18)
Testing, building, and development tools.

### Extraneous Dependencies (44)
**⚠️ CRITICAL ISSUE:** 44 packages are marked as extraneous, indicating:
- Storybook installation conflicts
- Unused packages taking up space
- Potential security vulnerabilities

## Key Optimization Opportunities

### 1. **Immediate Actions (High Impact)**

#### Clean Up Extraneous Dependencies
```bash
# Remove extraneous Storybook packages
bun remove @storybook/addon-backgrounds @storybook/addon-highlight @storybook/addon-measure @storybook/addon-outline @storybook/addon-toolbars @storybook/blocks

# Remove unused build tools
bun remove vite rollup @rollup/pluginutils webpack-virtual-modules

# Remove unused type definitions
bun remove @types/doctrine @types/mdx @types/resolve @types/uuid
```

#### Fix Storybook Configuration
- Resolve `withStorybook` import issues in metro.config.js
- Ensure proper Storybook setup for React Native

### 2. **Bundle Size Optimizations (Medium Impact)**

#### Consider Lighter Alternatives
- **Axios → Fetch API**: Native fetch could reduce bundle size by ~100KB
- **UUID → Crypto.randomUUID()**: Native API available in modern environments
- **@expo/vector-icons optimization**: Use only required icon sets

#### Enable Tree Shaking
```javascript
// metro.config.js optimization
module.exports = {
  transformer: {
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
  },
  resolver: {
    // Enable tree shaking for ES modules
    unstable_enablePackageExports: true,
  },
};
```

### 3. **Performance Optimizations (Long-term)**

#### Lazy Loading Implementation
- Implement dynamic imports for heavy components
- Use React.lazy() for route-based code splitting
- Lazy load Storybook only in development

#### Asset Optimization
- Optimize SVG icons (current: react-native-svg)
- Implement image lazy loading
- Use WebP format for images where supported

## Dependency Risk Assessment

### **High Risk Dependencies**
1. **@supabase/supabase-js** - Large but essential
   - **Risk**: Bundle size impact
   - **Mitigation**: Ensure tree shaking is working
   
2. **react-native-reanimated** - Performance critical
   - **Risk**: Large bundle size
   - **Mitigation**: Use Hermes engine for optimization

### **Medium Risk Dependencies**
1. **Storybook packages** - Development only
   - **Risk**: Leaking into production bundle
   - **Mitigation**: Proper dev/prod separation

2. **@expo/vector-icons** - Large icon library
   - **Risk**: Including unused icons
   - **Mitigation**: Use selective imports

### **Low Risk Dependencies**
- Most Expo modules are well-optimized
- React Navigation is essential and optimized
- Zustand is lightweight state management

## Recommendations

### **Immediate (This Sprint)**
1. ✅ Clean up 44 extraneous dependencies
2. ✅ Fix Storybook metro configuration
3. ✅ Audit and remove unused imports

### **Short-term (Next Sprint)**
1. 🔄 Implement bundle analysis automation
2. 🔄 Set up bundle size monitoring
3. 🔄 Enable Hermes engine for Android

### **Long-term (Future Sprints)**
1. 📋 Implement lazy loading for heavy components
2. 📋 Optimize asset loading strategies
3. 📋 Consider micro-frontend architecture for large features

## Bundle Size Estimates

Based on typical React Native app analysis:

| Category | Estimated Size | Percentage |
|----------|---------------|------------|
| React Native Core | ~2MB | 40% |
| Supabase Client | ~800KB | 16% |
| Expo Modules | ~600KB | 12% |
| Navigation | ~400KB | 8% |
| Reanimated | ~500KB | 10% |
| Other Dependencies | ~700KB | 14% |
| **Total Estimated** | **~5MB** | **100%** |

## Next Steps

1. **Execute cleanup script** for extraneous dependencies
2. **Fix metro.config.js** Storybook integration
3. **Run bundle analysis** after cleanup
4. **Implement monitoring** for future dependency additions
5. **Document dependency guidelines** for the team

---

**Note:** This analysis is based on dependency manifest. Actual bundle sizes may vary based on tree shaking effectiveness and build optimizations.
