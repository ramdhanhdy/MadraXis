/**
 * ModalTemplate Component Stories
 * Storybook stories demonstrating all ModalTemplate component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ModalTemplate } from './ModalTemplate';
import { Typography } from '@/src/shared/components/atoms/Typography';
import { Input } from '@/src/shared/components/atoms/Input';
import { Card } from '@/src/shared/components/molecules/Card';

const meta: Meta<typeof ModalTemplate> = {
  title: 'Templates/ModalTemplate',
  component: ModalTemplate,
  parameters: {
    docs: {
      description: {
        component: 'A consistent modal template with header, content, and action areas for all modal use cases.',
      },
    },
  },
  argTypes: {
    visible: {
      control: { type: 'boolean' },
      description: 'Whether the modal is visible',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Modal size',
    },
    scrollable: {
      control: { type: 'boolean' },
      description: 'Whether content is scrollable',
    },
    showCloseButton: {
      control: { type: 'boolean' },
      description: 'Whether to show close button in header',
    },
    contentPadding: {
      control: { type: 'boolean' },
      description: 'Whether to add padding to content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalTemplate>;

// Sample content components
const SampleContent: React.FC = () => (
  <View style={{ gap: 16 }}>
    <Typography variant="body1">
      This is sample content for the modal template. It demonstrates how content is displayed within the modal structure.
    </Typography>
    <Typography variant="body2" color="secondary">
      The modal template provides consistent header, content, and action areas for all modal use cases.
    </Typography>
  </View>
);

const FormContent: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  
  return (
    <View style={{ gap: 16 }}>
      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
      />
      <Input
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
    </View>
  );
};

const LongContent: React.FC = () => (
  <View style={{ gap: 16 }}>
    {Array.from({ length: 10 }, (_, i) => (
      <Card key={i} variant="default" padding="medium">
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          Section {i + 1}
        </Typography>
        <Typography variant="body2" color="secondary">
          This is a long content section to demonstrate scrollable behavior in the modal template.
        </Typography>
      </Card>
    ))}
  </View>
);

// Basic modal template
export const Default: Story = {
  args: {
    visible: true,
    title: 'Modal Title',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Save',
      onPress: () => alert('Save clicked'),
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancel clicked'),
    },
    children: <SampleContent />,
  },
};

// With subtitle
export const WithSubtitle: Story = {
  args: {
    visible: true,
    title: 'Create New Assignment',
    subtitle: 'Mathematics Chapter 5',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Create',
      onPress: () => alert('Create clicked'),
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancel clicked'),
    },
    children: <FormContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal template with subtitle in header.',
      },
    },
  },
};

// Different sizes
export const SmallSize: Story = {
  args: {
    visible: true,
    title: 'Confirm Action',
    size: 'small',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Confirm',
      onPress: () => alert('Confirmed'),
      variant: 'danger',
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
    },
    children: (
      <Typography variant="body1">
        Are you sure you want to delete this item? This action cannot be undone.
      </Typography>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Small modal for confirmations and simple actions.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    visible: true,
    title: 'Assignment Details',
    subtitle: 'Mathematics Chapter 5 - Quadratic Equations',
    size: 'large',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Submit Assignment',
      onPress: () => alert('Assignment submitted'),
    },
    secondaryAction: {
      label: 'Save Draft',
      onPress: () => alert('Draft saved'),
    },
    children: <LongContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large modal for detailed content and forms.',
      },
    },
  },
};

export const FullscreenSize: Story = {
  args: {
    visible: true,
    title: 'Student Profile',
    subtitle: 'Complete student information',
    size: 'fullscreen',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Save Changes',
      onPress: () => alert('Changes saved'),
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
    },
    children: <LongContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Fullscreen modal for complex forms and detailed views.',
      },
    },
  },
};

// Without close button
export const NoCloseButton: Story = {
  args: {
    visible: true,
    title: 'Required Action',
    subtitle: 'Please complete this step to continue',
    showCloseButton: false,
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Continue',
      onPress: () => alert('Continued'),
    },
    children: (
      <Typography variant="body1">
        This modal requires user action before it can be closed.
      </Typography>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal without close button for required actions.',
      },
    },
  },
};

// Multiple actions
export const MultipleActions: Story = {
  args: {
    visible: true,
    title: 'Assignment Options',
    onClose: () => alert('Modal closed'),
    actions: [
      {
        label: 'Delete',
        onPress: () => alert('Delete clicked'),
        variant: 'danger',
        icon: 'trash',
      },
      {
        label: 'Duplicate',
        onPress: () => alert('Duplicate clicked'),
        variant: 'outline',
        icon: 'copy',
      },
      {
        label: 'Edit',
        onPress: () => alert('Edit clicked'),
        variant: 'primary',
        icon: 'create',
      },
    ],
    children: (
      <Typography variant="body1">
        Choose an action for this assignment.
      </Typography>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with multiple action buttons.',
      },
    },
  },
};

// Loading states
export const LoadingActions: Story = {
  args: {
    visible: true,
    title: 'Saving Changes',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Saving...',
      onPress: () => alert('Save clicked'),
      loading: true,
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancel clicked'),
      disabled: true,
    },
    children: (
      <Typography variant="body1">
        Please wait while we save your changes.
      </Typography>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with loading and disabled action states.',
      },
    },
  },
};

// Scrollable content
export const ScrollableContent: Story = {
  args: {
    visible: true,
    title: 'Terms and Conditions',
    subtitle: 'Please read carefully',
    scrollable: true,
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Accept',
      onPress: () => alert('Accepted'),
    },
    secondaryAction: {
      label: 'Decline',
      onPress: () => alert('Declined'),
    },
    children: <LongContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with scrollable content area.',
      },
    },
  },
};

// Non-scrollable content
export const NonScrollableContent: Story = {
  args: {
    visible: true,
    title: 'Quick Action',
    scrollable: false,
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Execute',
      onPress: () => alert('Executed'),
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
    },
    children: (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" align="center">
          Fixed Layout
        </Typography>
        <Typography variant="body1" color="secondary" align="center" style={{ marginTop: 8 }}>
          This content doesn't scroll
        </Typography>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with non-scrollable, fixed layout content.',
      },
    },
  },
};

// Form modal examples
export const StudentFormModal: Story = {
  args: {
    visible: true,
    title: 'Submit Assignment',
    subtitle: 'Mathematics Chapter 5 Exercises',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Submit',
      onPress: () => alert('Assignment submitted'),
      icon: 'checkmark',
    },
    secondaryAction: {
      label: 'Save Draft',
      onPress: () => alert('Draft saved'),
      icon: 'save',
    },
    children: (
      <View style={{ gap: 16 }}>
        <Input
          label="Assignment Title"
          value="Quadratic Equations Practice"
          onChangeText={() => {}}
          placeholder="Enter assignment title"
        />
        <Input
          label="Your Answer"
          value=""
          onChangeText={() => {}}
          placeholder="Enter your solution"
          multiline
        />
        <Typography variant="body2" color="secondary">
          Due: Tomorrow at 11:59 PM
        </Typography>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Student assignment submission modal.',
      },
    },
  },
};

export const TeacherGradingModal: Story = {
  args: {
    visible: true,
    title: 'Grade Assignment',
    subtitle: 'Ahmed Al-Rashid - Mathematics Exercise 5',
    size: 'large',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Save Grade',
      onPress: () => alert('Grade saved'),
      icon: 'checkmark',
    },
    secondaryAction: {
      label: 'Return for Revision',
      onPress: () => alert('Returned for revision'),
      variant: 'outline',
    },
    children: (
      <View style={{ gap: 16 }}>
        <Card variant="default" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Student Answer
          </Typography>
          <Typography variant="body2" color="secondary">
            The quadratic formula is x = (-b ± √(b²-4ac)) / 2a...
          </Typography>
        </Card>
        
        <Input
          label="Grade (out of 100)"
          value="92"
          onChangeText={() => {}}
          placeholder="Enter grade"
        />
        
        <Input
          label="Feedback"
          value=""
          onChangeText={() => {}}
          placeholder="Enter feedback for student"
          multiline
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Teacher grading modal with student work review.',
      },
    },
  },
};

export const ParentMeetingModal: Story = {
  args: {
    visible: true,
    title: 'Schedule Parent Meeting',
    subtitle: 'Meet with Ahmed\'s Mathematics Teacher',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Schedule Meeting',
      onPress: () => alert('Meeting scheduled'),
      icon: 'calendar',
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
    },
    children: (
      <View style={{ gap: 16 }}>
        <Typography variant="body1">
          Request a meeting with Ms. Sarah Johnson to discuss Ahmed's progress in Mathematics.
        </Typography>
        
        <Input
          label="Preferred Date"
          value=""
          onChangeText={() => {}}
          placeholder="Select preferred date"
        />
        
        <Input
          label="Preferred Time"
          value=""
          onChangeText={() => {}}
          placeholder="Select preferred time"
        />
        
        <Input
          label="Meeting Topic"
          value=""
          onChangeText={() => {}}
          placeholder="What would you like to discuss?"
          multiline
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Parent meeting scheduling modal.',
      },
    },
  },
};

export const ManagementReportModal: Story = {
  args: {
    visible: true,
    title: 'Incident Report',
    subtitle: 'Grade 10 Classroom - Urgent Review Required',
    size: 'large',
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Resolve Incident',
      onPress: () => alert('Incident resolved'),
      variant: 'primary',
    },
    actions: [
      {
        label: 'Escalate',
        onPress: () => alert('Escalated'),
        variant: 'danger',
        icon: 'warning',
      },
      {
        label: 'Assign Investigator',
        onPress: () => alert('Investigator assigned'),
        variant: 'outline',
        icon: 'person-add',
      },
    ],
    children: (
      <View style={{ gap: 16 }}>
        <Card variant="elevated" padding="medium">
          <Typography variant="h4" style={{ marginBottom: 8 }}>
            Incident Details
          </Typography>
          <Typography variant="body2" color="secondary">
            Reported by: Ms. Sarah Johnson
          </Typography>
          <Typography variant="body2" color="secondary">
            Time: Today at 2:30 PM
          </Typography>
          <Typography variant="body2" color="secondary">
            Location: Grade 10A Classroom
          </Typography>
        </Card>
        
        <Typography variant="body1">
          Disruption during mathematics class. Student refused to follow instructions and was disrespectful to teacher.
        </Typography>
        
        <Input
          label="Resolution Notes"
          value=""
          onChangeText={() => {}}
          placeholder="Enter resolution details"
          multiline
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Management incident report modal with multiple actions.',
      },
    },
  },
};

// No content padding
export const NoContentPadding: Story = {
  args: {
    visible: true,
    title: 'Image Gallery',
    contentPadding: false,
    onClose: () => alert('Modal closed'),
    primaryAction: {
      label: 'Close',
      onPress: () => alert('Closed'),
    },
    children: (
      <View style={{ backgroundColor: '#f0f0f0', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4">Full Width Content</Typography>
        <Typography variant="body2" color="secondary" style={{ marginTop: 8 }}>
          This content extends to the edges
        </Typography>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal without content padding for full-width layouts.',
      },
    },
  },
};