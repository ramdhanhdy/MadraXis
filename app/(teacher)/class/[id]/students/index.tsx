import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ClassStudentsIndex() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{
    pathname: "/screens/teacher/ClassStudents",
    params: { id }
  }} />;
} 