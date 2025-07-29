# Modal Component

A consistent overlay component that provides uniform header structure, close buttons, and content layouts for modal dialogs across all user roles.

## Features

- **Consistent Layout**: Standardized modal structure with header, content, and actions
- **Multiple Sizes**: Small, medium, large, and fullscreen options
- **Flexible Actions**: Support for multiple action buttons with different variants
- **Animation Support**: Slide, fade, or no animation options
- **Backdrop Control**: Configurable backdrop interaction and styling
- **Keyboard Avoidance**: Automatic keyboard handling for forms
- **Scrollable Content**: Support for long content with scrolling
- **Accessibility**: Full accessibility support with proper modal roles

## Usage

### Basic Modal

```tsx
import { Modal } from '../../../components/organisms/Modal';

const [visible, setVisible] = useState(false);

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Basic Modal"
  subtitle="This is a subtitle"
>
  <Typography variant="body1">
    This is the modal content.
  </Typography>
</Modal>
```

### Modal with Actions

```tsx
const actions = [
  {
    label: 'Cancel',
    onPress: () => setVisible(false),
    variant: 'outline',
  },
  {
    label: 'Save',
    onPress: () => handleSave(),
    variant: 'primary',
  },
];

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Modal with Actions"
  actions={actions}
>
  <Typography variant="body1">
    Modal content with action buttons.
  </Typography>
</Modal>
```

### Different Sizes

```tsx
// Small modal
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Small Modal"
  size="small"
>
  <Typography variant="body1">Small modal content</Typography>
</Modal>

// Medium modal (default)
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Medium Modal"
  size="medium"
>
  <Typography variant="body1">Medium modal content</Typography>
</Modal>

// Large modal
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Large Modal"
  size="large"
>
  <Typography variant="body1">Large modal content</Typography>
</Modal>

// Fullscreen modal
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Fullscreen Modal"
  size="fullscreen"
>
  <Typography variant="body1">Fullscreen modal content</Typography>
</Modal>
```

### Form Modal

```tsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');

const actions = [
  {
    label: 'Cancel',
    onPress: () => setVisible(false),
    variant: 'outline',
  },
  {
    label: 'Submit',
    onPress: () => handleSubmit(),
    variant: 'primary',
    disabled: !name || !email,
  },
];

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Contact Form"
  actions={actions}
  keyboardAvoidingBehavior="padding"
>
  <View style={{ gap: 16 }}>
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
  </View>
</Modal>
```

### Confirmation Modal

```tsx
const actions = [
  {
    label: 'Cancel',
    onPress: () => setVisible(false),
    variant: 'outline',
  },
  {
    label: 'Delete',
    onPress: () => handleDelete(),
    variant: 'danger',
  },
];

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Confirm Deletion"
  actions={actions}
  size="small"
>
  <Typography variant="body1">
    Are you sure you want to delete this item? This action cannot be undone.
  </Typography>
</Modal>
```

### Custom Animation

```tsx
// Slide animation (default)
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Slide Modal"
  animationType="slide"
>
  <Typography variant="body1">Slides up from bottom</Typography>
</Modal>

// Fade animation
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Fade Modal"
  animationType="fade"
>
  <Typography variant="body1">Fades in and out</Typography>
</Modal>

// No animation
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Instant Modal"
  animationType="none"
>
  <Typography variant="body1">Appears instantly</Typography>
</Modal>
```

### Custom Styling

```tsx
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Custom Modal"
  backgroundColor="#1a1a1a"
  backdropColor="rgba(0, 0, 0, 0.8)"
  backdropOpacity={0.8}
>
  <Typography variant="body1" color="#ffffff">
    Custom styled modal with dark theme
  </Typography>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Whether the modal is visible (required) |
| `onClose` | `() => void` | - | Close handler (required) |
| `title` | `string` | - | Modal title |
| `subtitle` | `string` | - | Optional subtitle |
| `children` | `React.ReactNode` | - | Modal content (required) |
| `actions` | `ModalAction[]` | `[]` | Action buttons |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `closeOnBackdrop` | `boolean` | `true` | Whether to close on backdrop press |
| `closeOnBackButton` | `boolean` | `true` | Whether to close on back button |
| `size` | `'small' \| 'medium' \| 'large' \| 'fullscreen'` | `'medium'` | Modal size |
| `scrollable` | `boolean` | `true` | Whether content is scrollable |
| `animationType` | `'slide' \| 'fade' \| 'none'` | `'slide'` | Animation type |
| `animationDuration` | `number` | `300` | Animation duration in ms |
| `backgroundColor` | `string` | Auto | Custom background color |
| `backdropColor` | `string` | Auto | Custom backdrop color |
| `backdropOpacity` | `number` | `0.5` | Backdrop opacity |
| `keyboardAvoidingBehavior` | `'height' \| 'position' \| 'padding'` | `'padding'` | Keyboard avoidance |
| `style` | `ViewStyle` | - | Additional modal styles |
| `contentStyle` | `ViewStyle` | - | Content area styles |
| `headerStyle` | `ViewStyle` | - | Header area styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `testID` | `string` | - | Test identifier |

### ModalAction Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Button label (required) |
| `onPress` | `() => void` | - | Press handler (required) |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Button variant |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `loading` | `boolean` | `false` | Whether button shows loading |
| `testID` | `string` | - | Test identifier |

## Design Specifications

- **Border Radius**: 20px (except fullscreen)
- **Shadow**: Modal shadow for elevation
- **Backdrop**: Semi-transparent overlay (50% opacity default)
- **Header Height**: 60px minimum
- **Padding**: 20px for content areas
- **Animation Duration**: 300ms default
- **Sizes**:
  - Small: Max 400px width, 60% height
  - Medium: Max 500px width, 80% height
  - Large: Max 700px width, 90% height
  - Fullscreen: Full screen dimensions

## Accessibility

- Uses proper modal accessibility roles
- Supports screen reader navigation
- Provides keyboard navigation support
- Auto-generates accessibility labels
- Supports custom accessibility labels
- Proper focus management

## Examples in Context

### Student Assignment Submission

```tsx
const [visible, setVisible] = useState(false);
const [answer, setAnswer] = useState('');

const actions = [
  {
    label: 'Save Draft',
    onPress: () => saveDraft(),
    variant: 'outline',
  },
  {
    label: 'Submit',
    onPress: () => submitAssignment(),
    variant: 'primary',
    disabled: !answer.trim(),
  },
];

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Mathematics Assignment"
  subtitle="Chapter 5: Quadratic Equations"
  actions={actions}
  size="large"
>
  <ScrollView>
    <Card style={{ marginBottom: 16 }}>
      <Typography variant="h4">Assignment Details</Typography>
      <Typography variant="body2" color="secondary">
        Due Date: Tomorrow, 11:59 PM
      </Typography>
    </Card>
    
    <Typography variant="body1" style={{ marginBottom: 16 }}>
      Complete the following problems:
    </Typography>
    
    <Input
      label="Your Answer"
      placeholder="Type your answers here..."
      value={answer}
      onChangeText={setAnswer}
      multiline
    />
  </ScrollView>
</Modal>
```

### Teacher Grading Modal

```tsx
const [visible, setVisible] = useState(false);
const [grade, setGrade] = useState('');
const [feedback, setFeedback] = useState('');

const actions = [
  {
    label: 'Cancel',
    onPress: () => setVisible(false),
    variant: 'outline',
  },
  {
    label: 'Save Grade',
    onPress: () => saveGrade(),
    variant: 'primary',
    disabled: !grade,
  },
];

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Grade Assignment"
  subtitle="Ahmed Al-Rashid - Mathematics"
  actions={actions}
  size="medium"
>
  <View style={{ gap: 16 }}>
    <Card>
      <Typography variant="body2" color="secondary">
        Student Answer:
      </Typography>
      <Typography variant="body1">
        "The solutions are x = -2 and x = -3..."
      </Typography>
    </Card>
    
    <Input
      label="Grade (0-100)"
      placeholder="Enter grade"
      value={grade}
      onChangeText={setGrade}
    />
    
    <Input
      label="Feedback"
      placeholder="Enter feedback for the student"
      value={feedback}
      onChangeText={setFeedback}
      multiline
    />
  </View>
</Modal>
```

### Parent Meeting Confirmation

```tsx
const [visible, setVisible] = useState(false);

const actions = [
  {
    label: 'Decline',
    onPress: () => declineMeeting(),
    variant: 'outline',
  },
  {
    label: 'Accept',
    onPress: () => acceptMeeting(),
    variant: 'primary',
  },
];

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Parent-Teacher Meeting"
  subtitle="Meeting Request from Ms. Sarah"
  actions={actions}
  size="medium"
>
  <View style={{ gap: 16 }}>
    <Card>
      <Typography variant="h4">Meeting Details</Typography>
      <Typography variant="body2" color="secondary">
        Date: Friday, March 15, 2024
      </Typography>
      <Typography variant="body2" color="secondary">
        Time: 3:00 PM - 3:30 PM
      </Typography>
      <Typography variant="body2" color="secondary">
        Location: Classroom 10A
      </Typography>
    </Card>
    
    <Typography variant="body1">
      I would like to discuss Ahmed's progress in Mathematics and his recent improvement in problem-solving skills.
    </Typography>
  </View>
</Modal>
```

### Management Incident Report

```tsx
const [visible, setVisible] = useState(false);
const [description, setDescription] = useState('');
const [severity, setSeverity] = useState('');

const actions = [
  {
    label: 'Cancel',
    onPress: () => setVisible(false),
    variant: 'outline',
  },
  {
    label: 'Create Report',
    onPress: () => createReport(),
    variant: 'primary',
    disabled: !description || !severity,
  },
];

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Incident Report"
  subtitle="Document a new incident"
  actions={actions}
  size="large"
>
  <View style={{ gap: 16 }}>
    <Input
      label="Incident Description"
      placeholder="Describe what happened..."
      value={description}
      onChangeText={setDescription}
      multiline
    />
    
    <Input
      label="Severity Level"
      placeholder="Low, Medium, High"
      value={severity}
      onChangeText={setSeverity}
    />
    
    <Typography variant="body2" color="secondary">
      All incident reports are reviewed by the administration team within 24 hours.
    </Typography>
  </View>
</Modal>
```

### List Selection Modal

```tsx
const [visible, setVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const items = [
  { id: '1', title: 'Mathematics', subtitle: 'Grade 10A - Room 201' },
  { id: '2', title: 'Science', subtitle: 'Grade 10A - Room 105' },
  { id: '3', title: 'English', subtitle: 'Grade 10A - Room 301' },
];

const handleSelect = (item) => {
  setSelectedItem(item);
  setVisible(false);
};

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Select Subject"
  subtitle="Choose a subject from the list"
  size="medium"
>
  <View>
    {items.map((item, index) => (
      <ListItem
        key={item.id}
        title={item.title}
        subtitle={item.subtitle}
        rightIcon="chevron-forward"
        onPress={() => handleSelect(item)}
        showDivider={index < items.length - 1}
      />
    ))}
  </View>
</Modal>
```