import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ClassReportsIndex() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{
    pathname: "/screens/teacher/ClassReports",
    params: { id }
  }} />;
} 