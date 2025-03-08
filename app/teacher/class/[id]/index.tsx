import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ClassDetailIndex() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{
    pathname: "/screens/teacher/ClassDetail",
    params: { id }
  }} />;
} 