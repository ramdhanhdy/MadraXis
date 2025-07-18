import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { roleThemes } from '@/src/styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const theme = roleThemes.teacher;

const ClassDetailsPage = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Class Details</Text>
        <Text style={styles.subtitle}>Details for Class ID: {id}</Text>
        <Text style={styles.body}>This page is under construction.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.base.lg,
  },
  title: {
    ...theme.typography.variants.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base.sm,
  },
  subtitle: {
    ...theme.typography.variants.h4,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.base.lg,
  },
  body: {
    ...theme.typography.variants.body1,
    color: theme.colors.text.primary,
  },
});

export default ClassDetailsPage;
