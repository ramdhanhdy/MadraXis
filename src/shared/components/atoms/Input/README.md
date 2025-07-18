# Input Component

A comprehensive, accessible input component built with the MadraXis design system. Provides consistent form field styling across all user roles with validation, states, and extensive customization options.

## Features

- ✅ **2 Variants**: Outlined (default), Filled
- ✅ **3 Sizes**: Small, Medium, Large
- ✅ **Multiple States**: Normal, Disabled, Error, Focused
- ✅ **Icon Support**: Left, Right icons with press handling
- ✅ **Labels & Helper Text**: Labels, helper text, error messages
- ✅ **Character Count**: Optional character counting with limit validation
- ✅ **Validation**: Built-in error states and custom validation
- ✅ **Full Accessibility**: WCAG compliant with proper ARIA attributes
- ✅ **Input Types**: Text, Password, Email, Phone, Multiline support
- ✅ **Theme Integration**: Uses design system tokens consistently
- ✅ **TypeScript**: Fully typed with comprehensive interfaces
- ✅ **Ref Support**: ForwardRef for TextInput access

## Basic Usage

```tsx
import { Input } from '@/src/components/atoms/Input';

// Basic input
<Input placeholder="Enter text..." />

// With label and helper text
<Input 
  label="Email Address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>

// With validation
<Input 
  label="Password"
  placeholder="Enter password"
  error={hasError}
  errorText="Password is required"
  secureTextEntry
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label text |
| `helperText` | `string` | - | Helper text below input |
| `errorText` | `string` | - | Error message (overrides helperText when error=true) |
| `error` | `boolean` | `false` | Shows error state styling |
| `disabled` | `boolean` | `false` | Disables input interaction |
| `required` | `boolean` | `false` | Shows required indicator (*) |
| `leftIcon` | `keyof typeof Ionicons.glyphMap` | - | Left icon name |
| `rightIcon` | `keyof typeof Ionicons.glyphMap` | - | Right icon name |
| `onRightIconPress` | `() => void` | - | Right icon press handler |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Input style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Input size |
| `showCharacterCount` | `boolean` | `false` | Shows character count |
| `maxLength` | `number` | - | Maximum character limit |
| `containerStyle` | `ViewStyle` | - | Custom container styles |
| `inputStyle` | `TextStyle` | - | Custom input text styles |
| `labelStyle` | `TextStyle` | - | Custom label styles |
| `helperTextStyle` | `TextStyle` | - | Custom helper text styles |
| `errorTextStyle` | `TextStyle` | - | Custom error text styles |
| `accessibilityLabel` | `string` | - | Custom accessibility label |
| `accessibilityHint` | `string` | - | Custom accessibility hint |

*Plus all standard TextInput props (placeholder, value, onChangeText, etc.)*

## Variants

### Outlined (Default)
Standard input with border outline.

```tsx
<Input 
  variant="outlined"
  label="Email Address"
  placeholder="Enter your email"
/>
```

### Filled
Input with filled background.

```tsx
<Input 
  variant="filled"
  label="Search"
  placeholder="Search for something..."
/>
```

## Sizes

### Small (36px height)
Compact input for tight spaces.

```tsx
<Input 
  size="small"
  placeholder="Small input"
  label="Compact Field"
/>
```

### Medium (40px height)
Default size for most use cases.

```tsx
<Input 
  size="medium"
  placeholder="Medium input"
  label="Standard Field"
/>
```

### Large (48px height)
Prominent input for important fields.

```tsx
<Input 
  size="large"
  placeholder="Large input"
  label="Important Field"
/>
```

## States

### Normal
Default input state.

```tsx
<Input 
  label="Normal Input"
  placeholder="Enter text..."
/>
```

### Disabled
Prevents user interaction.

```tsx
<Input 
  disabled
  label="Disabled Input"
  value="Cannot edit this"
/>
```

### Error
Shows error styling and message.

```tsx
<Input 
  error
  errorText="This field is required"
  label="Error Input"
  placeholder="Required field"
/>
```

### Required
Shows required indicator.

```tsx
<Input 
  required
  label="Required Input"
  placeholder="This field is required"
/>
```

## Labels and Helper Text

### Basic Label
```tsx
<Input 
  label="Email Address"
  placeholder="Enter your email"
/>
```

### With Helper Text
```tsx
<Input 
  label="Password"
  placeholder="Enter your password"
  helperText="Must be at least 8 characters long"
  secureTextEntry
/>
```

### With Error Message
```tsx
<Input 
  label="Email Address"
  placeholder="Enter your email"
  error
  errorText="Please enter a valid email address"
/>
```

### Required Field
```tsx
<Input 
  label="Full Name"
  placeholder="Enter your full name"
  required
/>
```

## Icons

### Left Icon
```tsx
<Input 
  leftIcon="mail"
  placeholder="Email address"
  label="Email"
/>
```

### Right Icon
```tsx
<Input 
  rightIcon="eye"
  placeholder="Password"
  label="Password"
  secureTextEntry
/>
```

### Interactive Right Icon
```tsx
const [showPassword, setShowPassword] = useState(false);

<Input 
  rightIcon={showPassword ? "eye-off" : "eye"}
  onRightIconPress={() => setShowPassword(!showPassword)}
  placeholder="Password"
  label="Password"
  secureTextEntry={!showPassword}
/>
```

### Both Icons
```tsx
<Input 
  leftIcon="person"
  rightIcon="checkmark-circle"
  placeholder="Username"
  label="Username"
/>
```

## Character Count

### Basic Character Count
```tsx
<Input 
  showCharacterCount
  maxLength={100}
  placeholder="Enter message"
  label="Message"
/>
```

### With Helper Text
```tsx
<Input 
  showCharacterCount
  maxLength={50}
  helperText="Keep it brief"
  placeholder="Short message"
  label="Brief Message"
/>
```

### Over Limit Styling
When text exceeds maxLength, the character count shows in error color.

```tsx
<Input 
  showCharacterCount
  maxLength={20}
  value="This text is way too long for the limit"
  placeholder="Short text only"
  label="Limited Text"
/>
```

## Input Types

### Text Input (Default)
```tsx
<Input 
  placeholder="Enter any text"
  label="Text Field"
/>
```

### Email Input
```tsx
<Input 
  placeholder="Enter your email"
  label="Email Address"
  keyboardType="email-address"
  autoCapitalize="none"
  leftIcon="mail"
/>
```

### Password Input
```tsx
<Input 
  placeholder="Enter your password"
  label="Password"
  secureTextEntry
  leftIcon="lock-closed"
/>
```

### Phone Input
```tsx
<Input 
  placeholder="Enter your phone number"
  label="Phone Number"
  keyboardType="phone-pad"
  leftIcon="call"
/>
```

### Multiline Input
```tsx
<Input 
  placeholder="Enter your message"
  label="Message"
  multiline
  numberOfLines={4}
  showCharacterCount
  maxLength={500}
/>
```

### Numeric Input
```tsx
<Input 
  placeholder="Enter amount"
  label="Amount"
  keyboardType="numeric"
  leftIcon="card"
/>
```

## Validation Examples

### Email Validation
```tsx
const [email, setEmail] = useState('');
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

<Input 
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  error={email.length > 0 && !isValidEmail(email)}
  errorText={email.length > 0 && !isValidEmail(email) ? "Invalid email format" : undefined}
  leftIcon="mail"
  keyboardType="email-address"
/>
```

### Password Validation
```tsx
const [password, setPassword] = useState('');
const isValidPassword = (pwd: string) => pwd.length >= 8;

<Input 
  label="Password"
  value={password}
  onChangeText={setPassword}
  error={password.length > 0 && !isValidPassword(password)}
  errorText={password.length > 0 && !isValidPassword(password) ? "Password must be at least 8 characters" : undefined}
  secureTextEntry
  leftIcon="lock-closed"
/>
```

### Confirm Password
```tsx
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const passwordsMatch = password === confirmPassword;

<Input 
  label="Confirm Password"
  value={confirmPassword}
  onChangeText={setConfirmPassword}
  error={confirmPassword.length > 0 && !passwordsMatch}
  errorText={confirmPassword.length > 0 && !passwordsMatch ? "Passwords do not match" : undefined}
  secureTextEntry
  leftIcon="lock-closed"
/>
```

## Form Examples

### Login Form
```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

<View>
  <Input 
    label="Email Address"
    placeholder="Enter your email"
    value={email}
    onChangeText={setEmail}
    leftIcon="mail"
    keyboardType="email-address"
    autoCapitalize="none"
    required
  />
  
  <Input 
    label="Password"
    placeholder="Enter your password"
    value={password}
    onChangeText={setPassword}
    leftIcon="lock-closed"
    rightIcon={showPassword ? "eye-off" : "eye"}
    onRightIconPress={() => setShowPassword(!showPassword)}
    secureTextEntry={!showPassword}
    required
  />
</View>
```

### Contact Form
```tsx
<View>
  <Input 
    label="Full Name"
    placeholder="Enter your full name"
    required
  />
  
  <Input 
    label="Email Address"
    placeholder="Enter your email"
    leftIcon="mail"
    keyboardType="email-address"
    required
  />
  
  <Input 
    label="Phone Number"
    placeholder="Enter your phone number"
    leftIcon="call"
    keyboardType="phone-pad"
  />
  
  <Input 
    label="Message"
    placeholder="How can we help you?"
    multiline
    numberOfLines={4}
    showCharacterCount
    maxLength={500}
    required
  />
</View>
```

### Search Input
```tsx
const [search, setSearch] = useState('');

<Input 
  placeholder="Search for something..."
  value={search}
  onChangeText={setSearch}
  leftIcon="search"
  rightIcon={search ? "close" : undefined}
  onRightIconPress={() => setSearch('')}
  variant="filled"
/>
```

## Accessibility

The Input component is fully accessible and includes:

- **Proper Labels**: Automatic accessibility label from label prop
- **State Communication**: Error and disabled states communicated to screen readers
- **Focus Management**: Proper focus indication and keyboard navigation
- **Error Announcements**: Error messages are announced to screen readers
- **Touch Targets**: Adequate touch targets for interactive elements

```tsx
<Input 
  label="Email Address"
  accessibilityLabel="Email address input field"
  accessibilityHint="Enter your email address for account access"
  placeholder="Enter your email"
  error={hasError}
  errorText="Please enter a valid email address"
/>
```

## Ref Usage

Access the underlying TextInput ref for advanced functionality:

```tsx
import { useRef } from 'react';

const inputRef = useRef<TextInput>(null);

const focusInput = () => {
  inputRef.current?.focus();
};

<Input 
  ref={inputRef}
  label="Focus Me"
  placeholder="Click button to focus"
/>
```

## Custom Styling

### Container Styling
```tsx
<Input 
  containerStyle={{ marginBottom: 20 }}
  label="Custom Container"
  placeholder="Custom spacing"
/>
```

### Input Text Styling
```tsx
<Input 
  inputStyle={{ fontSize: 18, color: 'blue' }}
  label="Custom Text Style"
  placeholder="Custom font size and color"
/>
```

### Label Styling
```tsx
<Input 
  label="Custom Label"
  labelStyle={{ color: 'purple', fontSize: 16 }}
  placeholder="Custom label styling"
/>
```

### Helper Text Styling
```tsx
<Input 
  label="Custom Helper"
  helperText="Custom helper text"
  helperTextStyle={{ color: 'green', fontStyle: 'italic' }}
  placeholder="Custom helper styling"
/>
```

## Design System Integration

The Input component automatically uses design system tokens:

- **Colors**: Border, text, and background colors from theme
- **Typography**: Font sizes and weights from typography scale
- **Spacing**: Padding and margins from spacing system
- **Border Radius**: Consistent corner radius from theme
- **Shadows**: Focus states use theme shadows

## Testing

The component includes comprehensive tests covering:

- All variants and sizes
- All states (normal, disabled, error, focused)
- Icon functionality and interactions
- Character count and validation
- Accessibility features
- Custom styling
- Text input functionality

Run tests with:
```bash
npm test Input.test.tsx
```

## Performance Considerations

- Input components are optimized for performance
- Styles are calculated once and cached
- No unnecessary re-renders when theme doesn't change
- Efficient text input handling and validation
- Proper cleanup of event listeners

## Migration from Existing Inputs

Replace existing input implementations:

```tsx
// Before
<View>
  <Text>Email</Text>
  <TextInput 
    style={customInputStyle}
    placeholder="Enter email"
    onChangeText={setEmail}
  />
  {error && <Text style={errorStyle}>Error message</Text>}
</View>

// After
<Input 
  label="Email"
  placeholder="Enter email"
  onChangeText={setEmail}
  error={error}
  errorText="Error message"
/>
```

## Browser Support

- ✅ iOS Safari
- ✅ Android Chrome  
- ✅ React Native
- ✅ Expo