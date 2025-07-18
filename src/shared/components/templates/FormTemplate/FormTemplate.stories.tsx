/**
 * FormTemplate Component Stories
 * Storybook stories demonstrating all FormTemplate component variants and use cases
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { FormTemplate } from './FormTemplate';
import { Typography } from '@/src/shared/components/atoms/Typography';
import { Input } from '@/src/shared/components/atoms/Input';
import { Button } from '@/src/shared/components/atoms/Button';

const meta: Meta<typeof FormTemplate> = {
  title: 'Templates/FormTemplate',
  component: FormTemplate,
  parameters: {
    docs: {
      description: {
        component: 'A consistent form template with header, form fields, and action buttons for all form use cases.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'card', 'modal'],
      description: 'Form variant',
    },
    scrollable: {
      control: { type: 'boolean' },
      description: 'Whether content is scrollable',
    },
    keyboardAvoiding: {
      control: { type: 'boolean' },
      description: 'Whether to avoid keyboard',
    },
    contentPadding: {
      control: { type: 'boolean' },
      description: 'Whether to add content padding',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormTemplate>;

// Sample form content
const BasicFormContent: React.FC = () => {
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

const StudentFormContent: React.FC = () => {
  const [studentId, setStudentId] = React.useState('');
  const [grade, setGrade] = React.useState('');
  const [subject, setSubject] = React.useState('');
  
  return (
    <View style={{ gap: 16 }}>
      <Input
        label="Student ID"
        value={studentId}
        onChangeText={setStudentId}
        placeholder="Enter student ID"
      />
      <Input
        label="Grade Level"
        value={grade}
        onChangeText={setGrade}
        placeholder="Enter grade level"
      />
      <Input
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        placeholder="Enter subject"
      />
    </View>
  );
};

// Basic form template
export const Default: Story = {
  args: {
    title: 'Contact Form',
    description: 'Please fill out the form below to get in touch with us.',
    primaryAction: {
      label: 'Submit',
      onPress: () => alert('Form submitted'),
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Form cancelled'),
    },
    children: <BasicFormContent />,
  },
};

// With subtitle
export const WithSubtitle: Story = {
  args: {
    title: 'Student Registration',
    subtitle: 'New Student Enrollment',
    description: 'Please provide the required information to register a new student.',
    primaryAction: {
      label: 'Register Student',
      onPress: () => alert('Student registered'),
      icon: 'person-add',
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Registration cancelled'),
    },
    children: <StudentFormContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form template with subtitle and description.',
      },
    },
  },
};

// Card variant
export const CardVariant: Story = {
  args: {
    title: 'Login',
    subtitle: 'Sign in to your account',
    variant: 'card',
    primaryAction: {
      label: 'Sign In',
      onPress: () => alert('Signed in'),
      fullWidth: true,
    },
    children: (
      <View style={{ gap: 16 }}>
        <Input
          label="Email"
          value=""
          onChangeText={() => {}}
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          value=""
          onChangeText={() => {}}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Form template with card styling.',
      },
    },
  },
};

// With sections
export const WithSections: Story = {
  args: {
    title: 'Student Profile',
    subtitle: 'Complete Student Information',
    sections: [
      {
        id: 'personal',
        title: 'Personal Information',
        description: 'Basic personal details',
        children: (
          <View style={{ gap: 16 }}>
            <Input
              label="First Name"
              value=""
              onChangeText={() => {}}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              value=""
              onChangeText={() => {}}
              placeholder="Enter last name"
            />
            <Input
              label="Date of Birth"
              value=""
              onChangeText={() => {}}
              placeholder="Select date of birth"
            />
          </View>
        ),
      },
      {
        id: 'contact',
        title: 'Contact Information',
        description: 'How we can reach you',
        children: (
          <View style={{ gap: 16 }}>
            <Input
              label="Email Address"
              value=""
              onChangeText={() => {}}
              placeholder="Enter email address"
            />
            <Input
              label="Phone Number"
              value=""
              onChangeText={() => {}}
              placeholder="Enter phone number"
            />
          </View>
        ),
      },
      {
        id: 'academic',
        title: 'Academic Information',
        children: (
          <View style={{ gap: 16 }}>
            <Input
              label="Grade Level"
              value=""
              onChangeText={() => {}}
              placeholder="Select grade level"
            />
            <Input
              label="Previous School"
              value=""
              onChangeText={() => {}}
              placeholder="Enter previous school name"
            />
          </View>
        ),
      },
    ],
    primaryAction: {
      label: 'Save Profile',
      onPress: () => alert('Profile saved'),
      icon: 'save',
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Form template with organized sections.',
      },
    },
  },
};

// Multiple actions
export const MultipleActions: Story = {
  args: {
    title: 'Assignment Submission',
    subtitle: 'Mathematics Chapter 5',
    actions: [
      {
        label: 'Save Draft',
        onPress: () => alert('Draft saved'),
        variant: 'outline',
        icon: 'save',
      },
      {
        label: 'Preview',
        onPress: () => alert('Preview opened'),
        variant: 'ghost',
        icon: 'eye',
      },
      {
        label: 'Submit',
        onPress: () => alert('Assignment submitted'),
        variant: 'primary',
        icon: 'checkmark',
      },
    ],
    children: (
      <View style={{ gap: 16 }}>
        <Input
          label="Assignment Title"
          value="Quadratic Equations Practice"
          onChangeText={() => {}}
          placeholder="Enter assignment title"
        />
        <Input
          label="Your Solution"
          value=""
          onChangeText={() => {}}
          placeholder="Enter your solution here"
          multiline
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Form template with multiple action buttons.',
      },
    },
  },
};

// Full width actions
export const FullWidthActions: Story = {
  args: {
    title: 'Quick Login',
    variant: 'card',
    primaryAction: {
      label: 'Sign In',
      onPress: () => alert('Signed in'),
      fullWidth: true,
    },
    secondaryAction: {
      label: 'Create Account',
      onPress: () => alert('Account creation'),
      variant: 'outline',
      fullWidth: true,
    },
    children: (
      <View style={{ gap: 16 }}>
        <Input
          label="Email"
          value=""
          onChangeText={() => {}}
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          value=""
          onChangeText={() => {}}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Form template with full-width action buttons.',
      },
    },
  },
};

// Loading states
export const LoadingStates: Story = {
  args: {
    title: 'Submitting Form',
    description: 'Please wait while we process your information.',
    primaryAction: {
      label: 'Submitting...',
      onPress: () => alert('Submit clicked'),
      loading: true,
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
      disabled: true,
    },
    children: <BasicFormContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form template with loading and disabled states.',
      },
    },
  },
};

// Role-specific examples
export const StudentAssignmentForm: Story = {
  args: {
    title: 'Submit Assignment',
    subtitle: 'Mathematics - Quadratic Equations',
    description: 'Complete and submit your assignment below. Make sure to show all your work.',
    primaryAction: {
      label: 'Submit Assignment',
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
        <Typography variant="body2" color="secondary">
          Due: Tomorrow at 11:59 PM
        </Typography>
        
        <Input
          label="Problem 1"
          value=""
          onChangeText={() => {}}
          placeholder="Solve: x² + 5x + 6 = 0"
          multiline
        />
        
        <Input
          label="Problem 2"
          value=""
          onChangeText={() => {}}
          placeholder="Solve: 2x² - 7x + 3 = 0"
          multiline
        />
        
        <Input
          label="Problem 3"
          value=""
          onChangeText={() => {}}
          placeholder="Graph: y = x² - 4x + 3"
          multiline
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Student assignment submission form.',
      },
    },
  },
};

export const TeacherGradingForm: Story = {
  args: {
    title: 'Grade Assignment',
    subtitle: 'Ahmed Al-Rashid - Mathematics Exercise 5',
    sections: [
      {
        id: 'student-work',
        title: 'Student Submission',
        children: (
          <View style={{ 
            backgroundColor: '#f8f9fa', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16 
          }}>
            <Typography variant="body2" color="secondary">
              Student's solution: The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. 
              For x² + 5x + 6 = 0, we have a=1, b=5, c=6...
            </Typography>
          </View>
        ),
      },
      {
        id: 'grading',
        title: 'Grading',
        children: (
          <View style={{ gap: 16 }}>
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
              placeholder="Provide feedback to the student"
              multiline
            />
          </View>
        ),
      },
    ],
    primaryAction: {
      label: 'Save Grade',
      onPress: () => alert('Grade saved'),
      icon: 'checkmark',
    },
    actions: [
      {
        label: 'Return for Revision',
        onPress: () => alert('Returned for revision'),
        variant: 'outline',
        icon: 'refresh',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Teacher grading form with student work review.',
      },
    },
  },
};

export const ParentContactForm: Story = {
  args: {
    title: 'Contact Teacher',
    subtitle: 'Send a message to Ahmed\'s teacher',
    variant: 'card',
    primaryAction: {
      label: 'Send Message',
      onPress: () => alert('Message sent'),
      icon: 'send',
      fullWidth: true,
    },
    children: (
      <View style={{ gap: 16 }}>
        <Input
          label="Teacher"
          value="Ms. Sarah Johnson - Mathematics"
          onChangeText={() => {}}
          disabled
        />
        
        <Input
          label="Subject"
          value=""
          onChangeText={() => {}}
          placeholder="What is this message about?"
        />
        
        <Input
          label="Message"
          value=""
          onChangeText={() => {}}
          placeholder="Type your message here"
          multiline
        />
        
        <Typography variant="caption" color="secondary">
          Your message will be sent directly to the teacher and you'll receive a response within 24 hours.
        </Typography>
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Parent contact form for messaging teachers.',
      },
    },
  },
};

export const ManagementIncidentForm: Story = {
  args: {
    title: 'Incident Report',
    subtitle: 'Report a new incident',
    description: 'Please provide detailed information about the incident for proper documentation and follow-up.',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        children: (
          <View style={{ gap: 16 }}>
            <Input
              label="Incident Type"
              value=""
              onChangeText={() => {}}
              placeholder="Select incident type"
            />
            
            <Input
              label="Location"
              value=""
              onChangeText={() => {}}
              placeholder="Where did this occur?"
            />
            
            <Input
              label="Date & Time"
              value=""
              onChangeText={() => {}}
              placeholder="When did this occur?"
            />
          </View>
        ),
      },
      {
        id: 'details',
        title: 'Incident Details',
        children: (
          <View style={{ gap: 16 }}>
            <Input
              label="Students Involved"
              value=""
              onChangeText={() => {}}
              placeholder="List students involved"
            />
            
            <Input
              label="Staff Witnesses"
              value=""
              onChangeText={() => {}}
              placeholder="List staff who witnessed the incident"
            />
            
            <Input
              label="Description"
              value=""
              onChangeText={() => {}}
              placeholder="Provide a detailed description of what happened"
              multiline
            />
          </View>
        ),
      },
      {
        id: 'action',
        title: 'Immediate Action Taken',
        children: (
          <Input
            label="Action Description"
            value=""
            onChangeText={() => {}}
            placeholder="Describe any immediate actions taken"
            multiline
          />
        ),
      },
    ],
    primaryAction: {
      label: 'Submit Report',
      onPress: () => alert('Report submitted'),
      icon: 'document',
    },
    secondaryAction: {
      label: 'Save Draft',
      onPress: () => alert('Draft saved'),
      icon: 'save',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Management incident reporting form with multiple sections.',
      },
    },
  },
};

// Non-scrollable form
export const NonScrollable: Story = {
  args: {
    title: 'Quick Action',
    scrollable: false,
    primaryAction: {
      label: 'Execute',
      onPress: () => alert('Executed'),
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
    },
    children: (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Input
          label="Action Parameter"
          value=""
          onChangeText={() => {}}
          placeholder="Enter parameter"
        />
      </View>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Non-scrollable form with fixed layout.',
      },
    },
  },
};

// Without keyboard avoiding
export const NoKeyboardAvoiding: Story = {
  args: {
    title: 'Simple Form',
    keyboardAvoiding: false,
    primaryAction: {
      label: 'Submit',
      onPress: () => alert('Submitted'),
    },
    children: <BasicFormContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form without keyboard avoiding behavior.',
      },
    },
  },
};

// Modal variant
export const ModalVariant: Story = {
  args: {
    title: 'Modal Form',
    subtitle: 'Form displayed in modal context',
    variant: 'modal',
    primaryAction: {
      label: 'Save',
      onPress: () => alert('Saved'),
    },
    secondaryAction: {
      label: 'Cancel',
      onPress: () => alert('Cancelled'),
    },
    children: <BasicFormContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form template optimized for modal display.',
      },
    },
  },
};