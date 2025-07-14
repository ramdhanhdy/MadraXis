import { Redirect, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function ClassDetailIndex() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id || typeof id !== 'string') {
    // Gracefully handle cases where the ID is missing or invalid
    return <Text>Error: Invalid class ID provided.</Text>;
  }

  return <Redirect href={{
    pathname: "/screens/teacher/ClassDetail",
    params: { id }
  }} />;
} 