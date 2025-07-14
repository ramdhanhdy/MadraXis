import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ClassScheduleIndex() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{
    pathname: "/screens/teacher/ClassSchedule",
    params: { id }
  }} />;
} 