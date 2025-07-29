# ModalTemplate Component

A consistent modal template that provides a unified structure with header, content, and action areas for all modal use cases across the MadraXis school application.

## Features

- **Consistent Structure**: Standardized modal layout with header, content, and actions
- **Flexible Actions**: Support for primary, secondary, and multiple action buttons
- **Multiple Sizes**: Small, medium, large, and fullscreen modal sizes
- **Scrollable Content**: Optional scrollable content area with proper spacing
- **Loading States**: Built-in support for loading and disabled action states
- **Custom Styling**: Extensive customization options for all modal areas
- **Accessibility**: Full accessibility support with proper roles and labels
- **Close Button**: Optional close button with consistent styling

## Usage

### Basic Modal Template

```tsx
import { ModalTemplate } from '../../../components/templates/ModalTemplate';

const [visible, setVisible] = useState(false);

<ModalTemplate
  visible={visible}
  title="Confirm Action"
  onClose={() => setVisible(false)}
  primaryAction={{
    label: 'Confirm',
    onPress: () => handleConfirm(),
  }}
  secondaryAction={{
    label: 'Cancel',
    onPress: () => setVisible(false),
  }}
>
  <Typography variant="body1">
    Are you sure you want to perform this action?
  </Typography>
</ModalTemplate>
```

### Form Modal

```tsx
<ModalTemplate
  visible={visible}
  title="Create Assignment"
  subtitle="Mathematics Chapter 5"
  size="large"
  onClose={() => setVisible(false)}
  primaryAction={{
    label: 'Create Assignment',
    onPress: () => handleCreate(),
    icon: 'add',
  }}
  secondaryAction={{
    label: 'Cancel',
    onPress: () => setVisible(false),
  }}
>
  <View style={{ gap: 16 }}>
    <Input
      label="Assignment Title"
      value={title}
      onChangeText={setTitle}
      placeholder="Enter assignment title"
    />
    <Input
      label="Description"
      value={description}
      onChangeText={setDescription}
      placeholder="Enter assignment description"
      multiline
    />
  </View>
</ModalTemplate>
```

### Multiple Actions Modal

```tsx
<ModalTemplate
  visible={visible}
  title="Assignment Options"
  onClose={() => setVisible(false)}
  actions={[
    {
      label: 'Delete',
      onPress: () => handleDelete(),
      variant: 'danger',
      icon: 'trash',
    },
    {
      label: 'Duplicate',
      onPress: () => handleDuplicate(),
      variant: 'outline',
      icon: 'copy',
    },
    {
      label: 'Edit',
      onPress: () => handleEdit(),
      variant: 'primary',
      icon: 'create',
    },
  ]}
>
  <Typography variant="body1">
    Choose an action for this assignment.
  </Typography>
</ModalTemplate>
```

### Loading State Modal

```tsx
<ModalTemplate
  visible={visible}
  title="Saving Changes"
  showCloseButton={false}
  onClose={() => setVisible(false)}
  primaryAction={{
    label: 'Saving...',
    onPress: () => {},
    loading: true,
  }}
  secondaryAction={{
    label: 'Cancel',
    onPress: () => {},
    disabled: true,
  }}
>
  <Typography variant="body1">
    Please wait while we save your changes.
  </Typography>
</ModalTemplate>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Whether the modal is visible (required) |
| `onClose` | `() => void` | - | Close handler (required) |
| `title` | `string` | - | Modal title (required) |
| `subtitle` | `string` | - | Optional subtitle |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `children` | `React.ReactNode` | - | Modal content (required) |
| `primaryAction` | `ModalAction` | - | Primary action button |
| `secondaryAction` | `ModalAction` | - | Secondary action button |
| `actions` | `ModalAction[]` | - | Additional action buttons |
| `size` | `'small' \| 'medium' \| 'large' \| 'fullscreen'` | `'medium'` | Modal size |
| `scrollable` | `boolean` | `true` | Whether content is scrollable |
| `contentPadding` | `boolean` | `true` | Whether to add content padding |
| `style` | `ViewStyle` | - | Additional modal styles |
| `headerStyle` | `ViewStyle` | - | Header area styles |
| `contentStyle` | `ViewStyle` | - | Content area styles |
| `actionsStyle` | `ViewStyle` | - | Actions area styles |
| `accessibilityLabel` | `string` | Auto | Accessibility label |
| `testID` | `string` | `'modal-template'` | Test identifier |

### ModalAction Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Button label (required) |
| `onPress` | `() => void` | - | Press handler (required) |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | Auto | Button variant |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `string` | - | Optional icon |

## Modal Sizes

| Size | Description | Use Case |
|------|-------------|----------|
| `small` | Compact modal | Confirmations, simple actions |
| `medium` | Standard modal | Forms, content display |
| `large` | Expanded modal | Complex forms, detailed content |
| `fullscreen` | Full screen | Comprehensive forms, detailed views |

## Design Specifications

- **Header Height**: Auto with proper padding
- **Content Padding**: 24px horizontal, 16px vertical (when enabled)
- **Actions Padding**: 24px horizontal, 16px vertical
- **Border**: 1px solid border between sections
- **Close Button**: 40x40px touch target
- **Action Buttons**: Consistent spacing and sizing

## Accessibility

- Uses proper modal accessibility with `accessibilityViewIsModal`
- Provides meaningful accessibility labels for all interactive elements
- Supports custom accessibility labels for actions
- Includes proper focus management and navigation
- Close button has descriptive accessibility label

## Examples in Context

### Student Assignment Submission

```tsx
const SubmitAssignmentModal = ({ visible, onClose, assignment }) => {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitAssignment(assignment.id, answer);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <ModalTemplate
      visible={visible}
      title="Submit Assignment"
      subtitle={assignment.title}
      size="large"
      onClose={onClose}
      primaryAction={{
        label: submitting ? 'Submitting...' : 'Submit Assignment',
        onPress: handleSubmit,
        loading: submitting,
        icon: 'checkmark',
      }}
      secondaryAction={{
        label: 'Save Draft',
        onPress: () => saveDraft(),
        disabled: submitting,
        icon: 'save',
      }}
    >
      <View style={{ gap: 16 }}>
        <Typography variant="body2" color="secondary">
          Due: {assignment.dueDate}
        </Typography>
        
        <Input
          label="Your Answer"
          value={answer}
          onChangeText={setAnswer}
          placeholder="Enter your solution"
          multiline
        />
      </View>
    </ModalTemplate>
  );
};
```

### Teacher Grading Modal

```tsx
const GradingModal = ({ visible, onClose, submission }) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  
  return (
    <ModalTemplate
      visible={visible}
      title="Grade Assignment"
      subtitle={`${submission.student.name} - ${submission.assignment.title}`}
      size="large"
      onClose={onClose}
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
    >
      <View style={{ gap: 16 }}>
        <Card variant="default" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Student Answer
          </Typography>
          <Typography variant="body2" color="secondary">
            {submission.answer}
          </Typography>
        </Card>
        
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
          placeholder="Provide feedback to student"
          multiline
        />
      </View>
    </ModalTemplate>
  );
};
```

### Parent Meeting Request Modal

```tsx
const MeetingRequestModal = ({ visible, onClose, teacher }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  
  return (
    <ModalTemplate
      visible={visible}
      title="Request Meeting"
      subtitle={`Meet with ${teacher.name}`}
      onClose={onClose}
      primaryAction={{
        label: 'Send Request',
        onPress: () => sendMeetingRequest(),
        icon: 'calendar',
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}
    >
      <View style={{ gap: 16 }}>
        <Typography variant="body1">
          Request a meeting to discuss your child's progress.
        </Typography>
        
        <Input
          label="Preferred Date"
          value={date}
          onChangeText={setDate}
          placeholder="Select preferred date"
        />
        
        <Input
          label="Preferred Time"
          value={time}
          onChangeText={setTime}
          placeholder="Select preferred time"
        />
        
        <Input
          label="Meeting Topic"
          value={topic}
          onChangeText={setTopic}
          placeholder="What would you like to discuss?"
          multiline
        />
      </View>
    </ModalTemplate>
  );
};
```

### Management Incident Modal

```tsx
const IncidentModal = ({ visible, onClose, incident }) => {
  const [resolution, setResolution] = useState('');
  
  return (
    <ModalTemplate
      visible={visible}
      title="Incident Report"
      subtitle={`${incident.location} - ${incident.severity} Priority`}
      size="large"
      onClose={onClose}
      primaryAction={{
        label: 'Resolve Incident',
        onPress: () => resolveIncident(),
        variant: 'primary',
      }}
      actions={[
        {
          label: 'Escalate',
          onPress: () => escalateIncident(),
          variant: 'danger',
          icon: 'warning',
        },
        {
          label: 'Assign Investigator',
          onPress: () => assignInvestigator(),
          variant: 'outline',
          icon: 'person-add',
        },
      ]}
    >
      <View style={{ gap: 16 }}>
        <Card variant="elevated" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Incident Details
          </Typography>
          <Typography variant="body2" color="secondary">
            Reported by: {incident.reporter}
          </Typography>
          <Typography variant="body2" color="secondary">
            Time: {incident.timestamp}
          </Typography>
          <Typography variant="body2" color="secondary">
            Students Involved: {incident.studentsInvolved.join(', ')}
          </Typography>
        </Card>
        
        <Typography variant="body1">
          {incident.description}
        </Typography>
        
        <Input
          label="Resolution Notes"
          value={resolution}
          onChangeText={setResolution}
          placeholder="Enter resolution details"
          multiline
        />
      </View>
    </ModalTemplate>
  );
};
```

### Confirmation Modal

```tsx
const ConfirmationModal = ({ visible, onClose, onConfirm, title, message, danger = false }) => {
  return (
    <ModalTemplate
      visible={visible}
      title={title}
      size="small"
      onClose={onClose}
      primaryAction={{
        label: 'Confirm',
        onPress: onConfirm,
        variant: danger ? 'danger' : 'primary',
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}
    >
      <Typography variant="body1">
        {message}
      </Typography>
    </ModalTemplate>
  );
};

// Usage
<ConfirmationModal
  visible={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={() => handleDelete()}
  title="Delete Assignment"
  message="Are you sure you want to delete this assignment? This action cannot be undone."
  danger={true}
/>
```

### Image/Media Modal

```tsx
const MediaModal = ({ visible, onClose, mediaUrl, title }) => {
  return (
    <ModalTemplate
      visible={visible}
      title={title}
      size="fullscreen"
      contentPadding={false}
      onClose={onClose}
      primaryAction={{
        label: 'Close',
        onPress: onClose,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={{ uri: mediaUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
    </ModalTemplate>
  );
};
```

### Multi-Step Modal

```tsx
const MultiStepModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const getStepContent = () => {
    switch (step) {
      case 1:
        return <Step1Content />;
      case 2:
        return <Step2Content />;
      case 3:
        return <Step3Content />;
      default:
        return null;
    }
  };
  
  const getActions = () => {
    const actions = [];
    
    if (step > 1) {
      actions.push({
        label: 'Previous',
        onPress: () => setStep(step - 1),
        variant: 'outline',
      });
    }
    
    if (step < totalSteps) {
      actions.push({
        label: 'Next',
        onPress: () => setStep(step + 1),
        variant: 'primary',
      });
    } else {
      actions.push({
        label: 'Complete',
        onPress: () => handleComplete(),
        variant: 'primary',
      });
    }
    
    return actions;
  };
  
  return (
    <ModalTemplate
      visible={visible}
      title="Setup Wizard"
      subtitle={`Step ${step} of ${totalSteps}`}
      size="large"
      onClose={onClose}
      actions={getActions()}
    >
      {getStepContent()}
    </ModalTemplate>
  );
};
```

## Performance Considerations

- **Lazy Loading**: Modal content is only rendered when visible
- **Animation**: Smooth transitions with proper timing
- **Memory Management**: Proper cleanup when modal is closed
- **Keyboard Handling**: Automatic keyboard dismissal on backdrop press
- **Focus Management**: Proper focus handling for accessibility

## Migration Guide

### From Basic Modal

```tsx
// Old usage
<Modal visible={visible} onClose={onClose}>
  <View style={styles.header}>
    <Text style={styles.title}>Title</Text>
    <Button onPress={onClose}>Close</Button>
  </View>
  <View style={styles.content}>
    {content}
  </View>
  <View style={styles.actions}>
    <Button onPress={onSave}>Save</Button>
    <Button onPress={onClose}>Cancel</Button>
  </View>
</Modal>

// New usage
<ModalTemplate
  visible={visible}
  title="Title"
  onClose={onClose}
  primaryAction={{ label: 'Save', onPress: onSave }}
  secondaryAction={{ label: 'Cancel', onPress: onClose }}
>
  {content}
</ModalTemplate>
```

This template provides a consistent and flexible foundation for all modal interactions while maintaining excellent usability and accessibility across all user roles.