import React, { useCallback } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { AddStudentsToClassModal } from '../../../../src/components/organisms/AddStudentsToClassModal/AddStudentsToClassModal';

export default function AddStudentsModal() {
  const router = useRouter();
  const { id, returnUrl } = useLocalSearchParams();
  
  // Validate and parse class ID with error handling
  const parsedId = parseInt(typeof id === 'string' ? id : '0', 10);
  const classId = !isNaN(parsedId) && parsedId > 0 ? parsedId : null;

  const handleClose = useCallback(() => {
    if (typeof returnUrl === 'string') {
      router.replace(returnUrl as any);
    } else {
      router.back();
    }
  }, [router, returnUrl]);

  const handleStudentsAdded = useCallback(() => {
    // After students are added, close the modal
    handleClose();
  }, [handleClose]);

  if (!classId) {
    return (
      <>
        <Stack.Screen
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Invalid Class ID</Text>
          <Text style={styles.errorDescription}>
            The provided class ID is invalid. Please try again.
          </Text>
          <Text style={styles.goBackText} onPress={handleClose}>
            Go Back
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Add Students to Class',
          headerLeft: () => null,
          headerTintColor: '#007AFF',
        }} 
      />
      <View style={{ flex: 1 }}>
        {classId && (
          <AddStudentsToClassModal
            visible={true}
            onClose={handleClose}
            classId={classId}
            onStudentsAdded={handleStudentsAdded}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  goBackText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
});