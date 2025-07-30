/**
 * Modal Component Stories
 * Storybook stories demonstrating all Modal component variants and use cases
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Modal } from './Modal';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { ListItem } from '../../molecules/ListItem';
import { Card } from '../../molecules/Card';

const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: 'A consistent overlay component with header structure, close buttons, and content layouts.',
      },
    },
  },
  argTypes: {
    visible: {
      control: { type: 'boolean' },
      description: 'Whether the modal is visible',
    },
    title: {
      control: { type: 'text' },
      description: 'Modal title',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Optional subtitle',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Modal size',
    },
    animationType: {
      control: { type: 'select' },
      options: ['slide', 'fade', 'none'],
      description: 'Animation type',
    },
    closeOnBackdrop: {
      control: { type: 'boolean' },
      description: 'Whether to close on backdrop press',
    },
    showCloseButton: {
      control: { type: 'boolean' },
      description: 'Whether to show close button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Basic modal
export const Default: Story = {
  render: function DefaultRender() {
    const [visible, setVisible] = React.useState(false);

    return (
      <View>
        <Button onPress={() => setVisible(true)}>
          Open Modal
        </Button>

        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          title="Default Modal"
          subtitle="This is a basic modal example"
        >
          <Typography variant="body1">
            This is the modal content. You can put any content here including text, forms, lists, or other components.
          </Typography>

          <Typography variant="body2" color="secondary" style={{ marginTop: 16 }}>
            The modal will close when you tap the close button, press the back button, or tap outside the modal area.
          </Typography>
        </Modal>
      </View>
    );
  },
};

// Modal with actions
export const WithActions: Story = {
  render: function WithActionsRender() {
    const [visible, setVisible] = React.useState(false);

    const actions = [
      {
        label: 'Cancel',
        onPress: () => setVisible(false),
        variant: 'outline' as const,
      },
      {
        label: 'Save',
        onPress: () => {
          alert('Saved!');
          setVisible(false);
        },
        variant: 'primary' as const,
      },
    ];

    return (
      <View>
        <Button onPress={() => setVisible(true)}>
          Open Modal with Actions
        </Button>

        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          title="Modal with Actions"
          subtitle="This modal has action buttons"
          actions={actions}
        >
          <Typography variant="body1">
            This modal includes action buttons at the bottom. You can customize the buttons with different variants and behaviors.
          </Typography>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with action buttons at the bottom.',
      },
    },
  },
};

// Different sizes
export const DifferentSizes: Story = {
  render: function DifferentSizesRender() {
    const [smallVisible, setSmallVisible] = React.useState(false);
    const [mediumVisible, setMediumVisible] = React.useState(false);
    const [largeVisible, setLargeVisible] = React.useState(false);
    const [fullscreenVisible, setFullscreenVisible] = React.useState(false);

    return (
      <View style={{ gap: 12 }}>
        <Button onPress={() => setSmallVisible(true)}>
          Small Modal
        </Button>

        <Button onPress={() => setMediumVisible(true)}>
          Medium Modal
        </Button>

        <Button onPress={() => setLargeVisible(true)}>
          Large Modal
        </Button>

        <Button onPress={() => setFullscreenVisible(true)}>
          Fullscreen Modal
        </Button>

        <Modal
          visible={smallVisible}
          onClose={() => setSmallVisible(false)}
          title="Small Modal"
          size="small"
        >
          <Typography variant="body1">
            This is a small modal, perfect for simple confirmations or brief messages.
          </Typography>
        </Modal>

        <Modal
          visible={mediumVisible}
          onClose={() => setMediumVisible(false)}
          title="Medium Modal"
          size="medium"
        >
          <Typography variant="body1">
            This is a medium modal, good for forms and detailed content.
          </Typography>
        </Modal>

        <Modal
          visible={largeVisible}
          onClose={() => setLargeVisible(false)}
          title="Large Modal"
          size="large"
        >
          <Typography variant="body1">
            This is a large modal, suitable for complex forms or detailed information displays.
          </Typography>
        </Modal>

        <Modal
          visible={fullscreenVisible}
          onClose={() => setFullscreenVisible(false)}
          title="Fullscreen Modal"
          size="fullscreen"
        >
          <Typography variant="body1">
            This is a fullscreen modal that takes up the entire screen. Perfect for immersive experiences or complex workflows.
          </Typography>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Different modal sizes for various use cases.',
      },
    },
  },
};

// Form modal example
export const FormModal: Story = {
  render: function FormModalRender() {
    const [visible, setVisible] = React.useState(false);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSubmit = () => {
      alert(`Form submitted!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
      setVisible(false);
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    };

    const actions = [
      {
        label: 'Cancel',
        onPress: () => setVisible(false),
        variant: 'outline' as const,
      },
      {
        label: 'Submit',
        onPress: handleSubmit,
        variant: 'primary' as const,
        disabled: !name || !email,
      },
    ];

    return (
      <View>
        <Button onPress={() => setVisible(true)}>
          Open Contact Form
        </Button>

        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          title="Contact Form"
          subtitle="Send us a message"
          actions={actions}
          size="medium"
        >
          <View style={{ gap: 16 }}>
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label="Message"
              placeholder="Enter your message"
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with a form and validation.',
      },
    },
  },
};

// Confirmation modal
export const ConfirmationModal: Story = {
  render: function ConfirmationModalRender() {
    const [visible, setVisible] = React.useState(false);

    const actions = [
      {
        label: 'Cancel',
        onPress: () => setVisible(false),
        variant: 'outline' as const,
      },
      {
        label: 'Delete',
        onPress: () => {
          alert('Item deleted!');
          setVisible(false);
        },
        variant: 'danger' as const,
      },
    ];

    return (
      <View>
        <Button variant="danger" onPress={() => setVisible(true)}>
          Delete Item
        </Button>

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
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirmation modal for destructive actions.',
      },
    },
  },
};

// List modal
export const ListModal: Story = {
  render: function ListModalRender() {
    const [visible, setVisible] = React.useState(false);

    const items = [
      { id: '1', title: 'Mathematics', subtitle: 'Grade 10A - Room 201' },
      { id: '2', title: 'Science', subtitle: 'Grade 10A - Room 105' },
      { id: '3', title: 'English', subtitle: 'Grade 10A - Room 301' },
      { id: '4', title: 'History', subtitle: 'Grade 10A - Room 205' },
      { id: '5', title: 'Islamic Studies', subtitle: 'Grade 10A - Room 101' },
    ];

    const handleSelect = (itemId: string) => {
      const item = items.find(i => i.id === itemId);
      alert(`Selected: ${item?.title}`);
      setVisible(false);
    };

    return (
      <View>
        <Button onPress={() => setVisible(true)}>
          Select Subject
        </Button>

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
                onPress={() => handleSelect(item.id)}
                showDivider={index < items.length - 1}
              />
            ))}
          </View>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with a list of selectable items.',
      },
    },
  },
};

// Animation types
export const AnimationTypes: Story = {
  render: function AnimationTypesRender() {
    const [slideVisible, setSlideVisible] = React.useState(false);
    const [fadeVisible, setFadeVisible] = React.useState(false);
    const [noneVisible, setNoneVisible] = React.useState(false);

    return (
      <View style={{ gap: 12 }}>
        <Button onPress={() => setSlideVisible(true)}>
          Slide Animation
        </Button>

        <Button onPress={() => setFadeVisible(true)}>
          Fade Animation
        </Button>

        <Button onPress={() => setNoneVisible(true)}>
          No Animation
        </Button>

        <Modal
          visible={slideVisible}
          onClose={() => setSlideVisible(false)}
          title="Slide Animation"
          animationType="slide"
        >
          <Typography variant="body1">
            This modal slides up from the bottom with a smooth animation.
          </Typography>
        </Modal>

        <Modal
          visible={fadeVisible}
          onClose={() => setFadeVisible(false)}
          title="Fade Animation"
          animationType="fade"
        >
          <Typography variant="body1">
            This modal fades in and out with opacity animation.
          </Typography>
        </Modal>

        <Modal
          visible={noneVisible}
          onClose={() => setNoneVisible(false)}
          title="No Animation"
          animationType="none"
        >
          <Typography variant="body1">
            This modal appears instantly without any animation.
          </Typography>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Different animation types for modal appearance.',
      },
    },
  },
};

// Student assignment modal
export const StudentAssignmentModal: Story = {
  render: function StudentAssignmentModalRender() {
    const [visible, setVisible] = React.useState(false);

    const actions = [
      {
        label: 'Save Draft',
        onPress: () => {
          alert('Draft saved!');
          setVisible(false);
        },
        variant: 'outline' as const,
      },
      {
        label: 'Submit',
        onPress: () => {
          alert('Assignment submitted!');
          setVisible(false);
        },
        variant: 'primary' as const,
      },
    ];

    return (
      <View>
        <Button onPress={() => setVisible(true)}>
          View Assignment
        </Button>

        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          title="Mathematics Assignment"
          subtitle="Chapter 5: Quadratic Equations"
          actions={actions}
          size="large"
        >
          <ScrollView style={{ flex: 1 }}>
            <Card style={{ marginBottom: 16 }}>
              <Typography variant="h4" style={{ marginBottom: 8 }}>
                Assignment Details
              </Typography>
              <Typography variant="body2" color="secondary" style={{ marginBottom: 4 }}>
                Due Date: Tomorrow, 11:59 PM
              </Typography>
              <Typography variant="body2" color="secondary">
                Points: 100
              </Typography>
            </Card>

            <Typography variant="body1" style={{ marginBottom: 16 }}>
              Complete the following problems from Chapter 5 of your textbook:
            </Typography>

            <Typography variant="body1" style={{ marginBottom: 8 }}>
              1. Solve the quadratic equation: x² + 5x + 6 = 0
            </Typography>
            <Typography variant="body1" style={{ marginBottom: 8 }}>
              2. Find the roots of: 2x² - 7x + 3 = 0
            </Typography>
            <Typography variant="body1" style={{ marginBottom: 16 }}>
              3. Graph the function: f(x) = x² - 4x + 3
            </Typography>

            <Input
              label="Your Answer"
              placeholder="Type your answers here..."
              multiline
              value=""
              onChangeText={() => { }}
            />
          </ScrollView>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Student assignment modal with scrollable content.',
      },
    },
  },
};

// Teacher grade modal
export const TeacherGradeModal: Story = {
  render: function TeacherGradeModalRender() {
    const [visible, setVisible] = React.useState(false);
    const [grade, setGrade] = React.useState('');
    const [feedback, setFeedback] = React.useState('');

    const actions = [
      {
        label: 'Cancel',
        onPress: () => setVisible(false),
        variant: 'outline' as const,
      },
      {
        label: 'Save Grade',
        onPress: () => {
          alert(`Grade saved: ${grade}\nFeedback: ${feedback}`);
          setVisible(false);
        },
        variant: 'primary' as const,
        disabled: !grade,
      },
    ];

    return (
      <View>
        <Button onPress={() => setVisible(true)}>
          Grade Assignment
        </Button>

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
              <Typography variant="body2" color="secondary" style={{ marginBottom: 4 }}>
                Student Answer:
              </Typography>
              <Typography variant="body1">
                &quot;The solutions to x² + 5x + 6 = 0 are x = -2 and x = -3, found using the quadratic formula.&quot;
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
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Teacher grading modal with form inputs.',
      },
    },
  },
};

// Parent meeting modal
export const ParentMeetingModal: Story = {
  render: function ParentMeetingModalRender() {
    const [visible, setVisible] = React.useState(false);

    const actions = [
      {
        label: 'Decline',
        onPress: () => {
          alert('Meeting declined');
          setVisible(false);
        },
        variant: 'outline' as const,
      },
      {
        label: 'Accept',
        onPress: () => {
          alert('Meeting accepted!');
          setVisible(false);
        },
        variant: 'primary' as const,
      },
    ];

    return (
      <View>
        <Button onPress={() => setVisible(true)}>
          Meeting Invitation
        </Button>

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
              <Typography variant="h4" style={{ marginBottom: 8 }}>
                Meeting Details
              </Typography>
              <Typography variant="body2" color="secondary" style={{ marginBottom: 4 }}>
                Date: Friday, March 15, 2024
              </Typography>
              <Typography variant="body2" color="secondary" style={{ marginBottom: 4 }}>
                Time: 3:00 PM - 3:30 PM
              </Typography>
              <Typography variant="body2" color="secondary">
                Location: Classroom 10A
              </Typography>
            </Card>

            <Typography variant="body1">
              I would like to discuss Ahmed&apos;s progress in Mathematics and his recent improvement in problem-solving skills.
              We can also talk about upcoming projects and how to support his learning at home.
            </Typography>

            <Typography variant="body2" color="secondary">
              Please confirm your attendance by responding to this invitation.
            </Typography>
          </View>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Parent meeting invitation modal.',
      },
    },
  },
};

// Custom styling
export const CustomStyling: Story = {
  render: function CustomStylingRender() {
    const [visible1, setVisible1] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);

    return (
      <View style={{ gap: 12 }}>
        <Button onPress={() => setVisible1(true)}>
          Dark Theme Modal
        </Button>

        <Button onPress={() => setVisible2(true)}>
          Custom Colors Modal
        </Button>

        <Modal
          visible={visible1}
          onClose={() => setVisible1(false)}
          title="Dark Theme Modal"
          subtitle="Custom dark styling"
          backgroundColor="#1a1a1a"
          backdropColor="rgba(0, 0, 0, 0.8)"
        >
          <Typography variant="body1" color="#ffffff">
            This modal uses a dark theme with custom background and backdrop colors.
          </Typography>
        </Modal>

        <Modal
          visible={visible2}
          onClose={() => setVisible2(false)}
          title="Custom Colors"
          subtitle="Brand colors"
          backgroundColor="#e3f2fd"
          backdropColor="rgba(25, 118, 210, 0.3)"
        >
          <Typography variant="body1">
            This modal uses custom brand colors for a unique appearance.
          </Typography>
        </Modal>
      </View>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modals with custom colors and theming.',
      },
    },
  },
};