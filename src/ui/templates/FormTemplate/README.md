# FormTemplate Component

A consistent form template that provides a unified structure with header, form sections, and action buttons for all form use cases across the MadraXis school application.

## Features

- **Consistent Structure**: Standardized form layout with header, content, and actions
- **Form Sections**: Organized sections with titles and descriptions
- **Flexible Actions**: Support for primary, secondary, and multiple action buttons
- **Multiple Variants**: Default, card, and modal variants for different contexts
- **Keyboard Handling**: Built-in keyboard avoidance and proper focus management
- **Scrollable Content**: Optional scrollable content area with proper spacing
- **Loading States**: Built-in support for loading and disabled action states
- **Custom Styling**: Extensive customization options for all form areas
- **Accessibility**: Full accessibility support with proper roles and labels

## Usage

### Basic Form Template

```tsx
import { FormTemplate } from '../../../components/templates/FormTemplate';

<FormTemplate
  title="Contact Form"
  description="Please fill out the form below."
  primaryAction={{
    label: 'Submit',
    onPress: () => handleSubmit(),
  }}
  secondaryAction={{
    label: 'Cancel',
    onPress: () => handleCancel(),
  }}
>
  <Input
    label="Name"
    value={name}
    onChangeText={setName}
    placeholder="Enter your name"
  />
  <Input
    label="Email"
    value={email}
    onChangeText={setEmail}
    placeholder="Enter your email"
  />
</FormTemplate>
```

### Form with Sections

```tsx
<FormTemplate
  title="Student Registration"
  subtitle="New Student Enrollment"
  sections={[
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic personal details',
      children: (
        <View style={{ gap: 16 }}>
          <Input label="First Name" value={firstName} onChangeText={setFirstName} />
          <Input label="Last Name" value={lastName} onChangeText={setLastName} />
        </View>
      ),
    },
    {
      id: 'contact',
      title: 'Contact Information',
      children: (
        <View style={{ gap: 16 }}>
          <Input label="Email" value={email} onChangeText={setEmail} />
          <Input label="Phone" value={phone} onChangeText={setPhone} />
        </View>
      ),
    },
  ]}
  primaryAction={{
    label: 'Register Student',
    onPress: () => handleRegister(),
    icon: 'person-add',
  }}
/>
```

### Card Variant

```tsx
<FormTemplate
  title="Login"
  subtitle="Sign in to your account"
  variant="card"
  primaryAction={{
    label: 'Sign In',
    onPress: () => handleLogin(),
    fullWidth: true,
  }}
>
  <View style={{ gap: 16 }}>
    <Input
      label="Email"
      value={email}
      onChangeText={setEmail}
      placeholder="Enter your email"
    />
    <Input
      label="Password"
      value={password}
      onChangeText={setPassword}
      placeholder="Enter your password"
      secureTextEntry
    />
  </View>
</FormTemplate>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Form title (required) |
| `subtitle` | `string` | - | Optional subtitle |
| `description` | `string` | - | Optional description |
| `children` | `React.ReactNode` | - | Form content |
| `sections` | `FormSection[]` | - | Form sections array |
| `primaryAction` | `FormAction` | - | Primary action button |
| `secondaryAction` | `FormAction` | - | Secondary action button |
| `actions` | `FormAction[]` | - | Additional action buttons |
| `variant` | `'default' \| 'card' \| 'modal'` | `'default'` | Form variant |
| `scrollable` | `boolean` | `true` | Whether content is scrollable |
| `keyboardAvoiding` | `boolean` | `true` | Whether to avoid keyboard |
| `contentPadding` | `boolean` | `true` | Whether to add content padding |
| `style` | `ViewStyle` | - | Additional form styles |
| `headerStyle` | `ViewStyle` | - | Header area styles |
| `contentStyle` | `ViewStyle` | - | Content area styles |
| `actionsStyle` | `ViewStyle` | - | Actions area styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `testID` | `string` | `'form-template'` | Test identifier |

### FormSection Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique section identifier (required) |
| `title` | `string` | - | Section title |
| `description` | `string` | - | Section description |
| `children` | `React.ReactNode` | - | Section content (required) |

### FormAction Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Button label (required) |
| `onPress` | `() => void` | - | Press handler (required) |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | Auto | Button variant |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `string` | - | Optional icon |
| `fullWidth` | `boolean` | `false` | Full width button |

## Form Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Standard form layout | General forms, settings |
| `card` | Form wrapped in a card | Login, registration, modals |
| `modal` | Optimized for modal display | Modal forms, dialogs |

## Examples in Context

### Student Assignment Form

```tsx
const AssignmentForm = () => {
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  
  return (
    <FormTemplate
      title="Submit Assignment"
      subtitle="Mathematics - Quadratic Equations"
      description="Complete and submit your assignment below."
      primaryAction={{
        label: 'Submit Assignment',
        onPress: () => handleSubmit(),
        icon: 'checkmark',
      }}
      secondaryAction={{
        label: 'Save Draft',
        onPress: () => saveDraft(),
        icon: 'save',
      }}
    >
      <View style={{ gap: 16 }}>
        <Typography variant="body2" color="secondary">
          Due: Tomorrow at 11:59 PM
        </Typography>
        
        <Input
          label="Assignment Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter assignment title"
        />
        
        <Input
          label="Your Solution"
          value={answer}
          onChangeText={setAnswer}
          placeholder="Enter your solution"
          multiline
        />
      </View>
    </FormTemplate>
  );
};
```

### Teacher Grading Form

```tsx
const GradingForm = ({ submission }) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  
  return (
    <FormTemplate
      title="Grade Assignment"
      subtitle={`${submission.student.name} - ${submission.assignment.title}`}
      sections={[
        {
          id: 'student-work',
          title: 'Student Submission',
          children: (
            <Card variant="default" padding="medium">
              <Typography variant="body2" color="secondary">
                {submission.answer}
              </Typography>
            </Card>
          ),
        },
        {
          id: 'grading',
          title: 'Grading',
          children: (
            <View style={{ gap: 16 }}>
              <Input
                label="Grade (out of 100)"
                value={grade}
                onChangeText={setGrade}
                placeholder="Enter grade"
              />
              <Input
                label="Feedback"
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Provide feedback"
                multiline
              />
            </View>
          ),
        },
      ]}
      primaryAction={{
        label: 'Save Grade',
        onPress: () => saveGrade(),
        icon: 'checkmark',
      }}
      actions={[
        {
          label: 'Return for Revision',
          onPress: () => returnForRevision(),
          variant: 'outline',
          icon: 'refresh',
        },
      ]}
    />
  );
};
```

This template provides a consistent and flexible foundation for all form interactions while maintaining excellent usability and accessibility across all user roles.