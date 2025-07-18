/**
 * Input Component Stories
 * Documentation and examples for the Input component
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { Input } from './Input';
import { Typography } from '../Typography';

// Story wrapper
const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <ScrollView style={styles.container}>
      {children}
    </ScrollView>
  </ThemeProvider>
);

// Section wrapper for organizing stories
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Typography variant="h3" style={styles.sectionTitle}>{title}</Typography>
    {children}
  </View>
);

// Default Input
export const Default = () => (
  <StoryWrapper>
    <Input placeholder="Enter text..." />
  </StoryWrapper>
);

// All Variants
export const Variants = () => (
  <StoryWrapper>
    <Section title="Input Variants">
      <Input 
        variant="outlined" 
        placeholder="Outlined input (default)"
        label="Outlined Input"
      />
      <Input 
        variant="filled" 
        placeholder="Filled input"
        label="Filled Input"
      />
    </Section>
  </StoryWrapper>
);

// All Sizes
export const Sizes = () => (
  <StoryWrapper>
    <Section title="Input Sizes">
      <Input 
        size="small" 
        placeholder="Small input"
        label="Small Input"
      />
      <Input 
        size="medium" 
        placeholder="Medium input (default)"
        label="Medium Input"
      />
      <Input 
        size="large" 
        placeholder="Large input"
        label="Large Input"
      />
    </Section>
  </StoryWrapper>
);

// States
export const States = () => (
  <StoryWrapper>
    <Section title="Input States">
      <Input 
        placeholder="Normal state"
        label="Normal Input"
      />
      <Input 
        disabled
        placeholder="Disabled state"
        label="Disabled Input"
        value="Cannot edit this"
      />
      <Input 
        error
        errorText="This field is required"
        placeholder="Error state"
        label="Error Input"
      />
      <Input 
        required
        placeholder="Required field"
        label="Required Input"
      />
    </Section>
  </StoryWrapper>
);

// With Labels and Helper Text
export const LabelsAndHelperText = () => (
  <StoryWrapper>
    <Section title="Labels and Helper Text">
      <Input 
        label="Email Address"
        placeholder="Enter your email"
        helperText="We'll never share your email with anyone else"
      />
      <Input 
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        helperText="Must be at least 8 characters long"
      />
      <Input 
        label="Required Field"
        placeholder="This field is required"
        required
        error
        errorText="This field cannot be empty"
      />
    </Section>
  </StoryWrapper>
);

// With Icons
export const WithIcons = () => (
  <StoryWrapper>
    <Section title="Input with Icons">
      <Input 
        leftIcon="mail"
        placeholder="Email with left icon"
        label="Email Address"
      />
      <Input 
        rightIcon="eye"
        placeholder="Password with right icon"
        label="Password"
        secureTextEntry
      />
      <Input 
        leftIcon="person"
        rightIcon="checkmark-circle"
        placeholder="Username with both icons"
        label="Username"
      />
      <Input 
        leftIcon="search"
        rightIcon="close"
        placeholder="Search with clear button"
        label="Search"
      />
    </Section>
  </StoryWrapper>
);

// Interactive Examples
export const InteractiveExamples = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <StoryWrapper>
      <Section title="Interactive Examples">
        <Input 
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
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
        />
        
        <Input 
          label="Search"
          placeholder="Search for something..."
          value={search}
          onChangeText={setSearch}
          leftIcon="search"
          rightIcon={search ? "close" : undefined}
          onRightIconPress={() => setSearch('')}
        />
      </Section>
    </StoryWrapper>
  );
};

// Character Count
export const CharacterCount = () => {
  const [text, setText] = useState('');
  const [longText, setLongText] = useState('This text is already quite long and exceeds the limit');

  return (
    <StoryWrapper>
      <Section title="Character Count">
        <Input 
          label="Short Message"
          placeholder="Enter a short message"
          value={text}
          onChangeText={setText}
          showCharacterCount
          maxLength={50}
          helperText="Keep it brief"
        />
        
        <Input 
          label="Over Limit Example"
          placeholder="This will show error styling"
          value={longText}
          onChangeText={setLongText}
          showCharacterCount
          maxLength={30}
          helperText="This text exceeds the character limit"
        />
      </Section>
    </StoryWrapper>
  );
};

// Form Examples
export const FormExamples = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const updateField = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <StoryWrapper>
      <Section title="Form Example">
        <Input 
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChangeText={updateField('firstName')}
          required
        />
        
        <Input 
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChangeText={updateField('lastName')}
          required
        />
        
        <Input 
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={updateField('email')}
          leftIcon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
        
        <Input 
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChangeText={updateField('phone')}
          leftIcon="call"
          keyboardType="phone-pad"
        />
        
        <Input 
          label="Message"
          placeholder="Enter your message"
          value={formData.message}
          onChangeText={updateField('message')}
          multiline
          numberOfLines={4}
          showCharacterCount
          maxLength={500}
          helperText="Tell us how we can help you"
        />
      </Section>
    </StoryWrapper>
  );
};

// Validation Examples
export const ValidationExamples = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  const passwordsMatch = password === confirmPassword;

  return (
    <StoryWrapper>
      <Section title="Validation Examples">
        <Input 
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail"
          error={email.length > 0 && !isValidEmail(email)}
          errorText={email.length > 0 && !isValidEmail(email) ? "Please enter a valid email address" : undefined}
          helperText="We'll use this to send you updates"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input 
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed"
          secureTextEntry
          error={password.length > 0 && !isValidPassword(password)}
          errorText={password.length > 0 && !isValidPassword(password) ? "Password must be at least 8 characters" : undefined}
          helperText="Must be at least 8 characters long"
        />
        
        <Input 
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon="lock-closed"
          secureTextEntry
          error={confirmPassword.length > 0 && !passwordsMatch}
          errorText={confirmPassword.length > 0 && !passwordsMatch ? "Passwords do not match" : undefined}
          helperText="Re-enter your password to confirm"
        />
      </Section>
    </StoryWrapper>
  );
};

// All Combinations
export const AllCombinations = () => (
  <StoryWrapper>
    <Section title="Size and Variant Combinations">
      {(['outlined', 'filled'] as const).map(variant => (
        <View key={variant} style={styles.variantGroup}>
          <Typography variant="h4" style={styles.variantTitle}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)} Variant
          </Typography>
          {(['small', 'medium', 'large'] as const).map(size => (
            <Input
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              placeholder={`${variant} ${size} input`}
              label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} ${size.charAt(0).toUpperCase() + size.slice(1)}`}
              leftIcon="person"
            />
          ))}
        </View>
      ))}
    </Section>
  </StoryWrapper>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#005e7a',
  },
  variantGroup: {
    marginBottom: 24,
  },
  variantTitle: {
    marginBottom: 12,
    color: '#333333',
  },
});

// Export all stories
export default {
  Default,
  Variants,
  Sizes,
  States,
  LabelsAndHelperText,
  WithIcons,
  InteractiveExamples,
  CharacterCount,
  FormExamples,
  ValidationExamples,
  AllCombinations,
};