import React, { useCallback } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AddStudentsToClassModal } from '../../../../src/components/organisms/AddStudentsToClassModal/AddStudentsToClassModal';
import { ErrorBoundary } from '../../../../src/components/organisms/ErrorBoundary';

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

  const ErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Unable to Load Add Students</Text>
      <Text style={styles.errorDescription}>
        We encountered an error while preparing the add students interface.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

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
          <TouchableOpacity style={styles.goBackButton} onPress={handleClose}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
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
        <ErrorBoundary fallback={<ErrorFallback onRetry={() => window.location.reload()} />}>
          <AddStudentsToClassModal
            visible={true}
            onClose={handleClose}
            classId={classId}
            onStudentsAdded={handleStudentsAdded}
          />
        </ErrorBoundary>
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
  goBackButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#666666',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});