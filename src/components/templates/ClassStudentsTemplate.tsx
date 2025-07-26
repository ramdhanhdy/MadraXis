import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClassService } from '../../services/classService';
import { useAuth } from '../../context/AuthContext';
import { useClassStudentsSubscription } from '../../hooks/useClassStudentsSubscription';
import { AddStudentsToClassModal } from '../organisms/AddStudentsToClassModal/AddStudentsToClassModal';
import { EmptyState } from '../molecules/EmptyState/EmptyState';
import { Student } from '../../types/student';

// Types for class data
interface ClassData {
  id: number;
  name: string;
  level: string;
  studentCount: number;
  schoolId: number;
}

export default function ClassStudentsTemplate() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  // Validate and parse class ID
  const parsedId = parseInt(id || '0', 10);
  const classId = !isNaN(parsedId) && parsedId > 0 ? parsedId : null;

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<Set<string>>(new Set());

  // Use real-time subscription for students
  const { students, loading: studentsLoading, error, refetch } = useClassStudentsSubscription({
    classId: classId || 0,
    enabled: !!classId && !!user?.id,
  });

  // Fetch class data
  const loadClassData = useCallback(async () => {
    if (!classId || !user?.id) return;

    try {
      // Fetch class details
      const classDetails = await ClassService.getClassById(classId, user.id);
      if (!classDetails) {
        throw new Error('Class not found');
      }

      setClassData({
        id: classDetails.id,
        name: classDetails.name,
        level: classDetails.level,
        studentCount: students.length,
        schoolId: classDetails.school_id,
      });
    } catch (error) {
      console.error('Error loading class data:', error);
      Alert.alert(
        'Error',
        'Failed to load class data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [classId, user?.id, students.length]);

  // Update class data when students change via real-time updates
  useEffect(() => {
    if (classData) {
      setClassData(prev => prev ? { ...prev, studentCount: students.length } : null);
    }
  }, [students.length]);

  // Load class data on mount
  useEffect(() => {
    loadClassData();
  }, [loadClassData]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refetch();
    await loadClassData();
  }, [refetch, loadClassData]);

  // Handle add students to class
  const handleAddStudents = useCallback(async () => {
    setModalVisible(true);
  }, []);

  // Handle students added successfully
  const handleStudentsAdded = useCallback(() => {
    // Real-time subscription will automatically update the students list
    // No manual refetch needed
  }, []);

  // Handle remove student
  const handleRemoveStudent = useCallback(async (studentId: string) => {
    if (!user?.id || !classId) return;

    Alert.alert(
      'Remove Student',
      'Are you sure you want to remove this student from the class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setRemoveLoading(prev => new Set(prev).add(studentId));
              await ClassService.removeStudent(classId, studentId, user.id);
              // Real-time subscription will automatically update the students list
            } catch (error) {
              console.error('Error removing student:', error);
              Alert.alert(
                'Error',
                'Failed to remove student. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setRemoveLoading(prev => {
                const newSet = new Set(prev);
                newSet.delete(studentId);
                return newSet;
              });
            }
          },
        },
      ]
    );
  }, [classId, user?.id]);

  // Handle student press
  const handleStudentPress = useCallback((studentId: string) => {
    router.push({
      pathname: '/(teacher)/students/[id]',
      params: { id: studentId },
    });
  }, [router]);

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.student_details?.nis && student.student_details.nis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format student for display
  const formatStudentForDisplay = (student: any) => ({
    id: student.id,
    full_name: student.full_name,
    nis: student.student_details?.nis,
    gender: undefined, // Not available in the Student type
    boarding: student.student_details?.boarding,
    role: 'student',
    school_id: student.school_id,
    created_at: student.created_at,
    updated_at: student.updated_at,
    memorizedVerses: 0,
    totalVerses: 0,
    lastActivity: new Date().toISOString(),
    progress: 0,
  });

  // Render student item with swipe to delete
  const renderStudentItem = ({ item }: { item: Student }) => {
    const displayItem = formatStudentForDisplay(item);
    const isRemoving = removeLoading.has(item.id);

    const renderRightActions = () => (
      <View style={styles.deleteContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveStudent(item.id)}
          disabled={isRemoving}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          {isRemoving && <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />}
        </TouchableOpacity>
      </View>
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        rightThreshold={80}
        overshootRight={false}
      >
        <TouchableOpacity
          style={styles.studentCard}
          onPress={() => handleStudentPress(item.id)}
        >
          <View style={styles.studentHeader}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentInitial}>
                {displayItem.full_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{displayItem.full_name}</Text>
              {displayItem.nis && (
                <Text style={styles.studentNis}>NIS: {displayItem.nis}</Text>
              )}
              <View style={styles.studentDetails}>
                {displayItem.boarding !== undefined && (
                  <Text style={styles.studentDetail}>
                    {displayItem.boarding ? 'Boarding' : 'Day Student'}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.studentActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleStudentPress(item.id)}
              >
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  // Handle invalid class ID
  if (classId === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4444" />
          <Text style={styles.errorTitle}>ID Kelas Tidak Valid</Text>
          <Text style={styles.errorMessage}>ID kelas yang diberikan tidak valid atau tidak ditemukan.</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state
  if (studentsLoading && filteredStudents.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Siswa Kelas</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
          <Text style={styles.loadingText}>Memuat data siswa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {classData ? `Siswa - ${classData.name}` : 'Siswa Kelas'}
          </Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* Action Bar */}
        <View style={styles.actionContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari siswa..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999999"
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddStudents}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{students.length}</Text>
            <Text style={styles.statLabel}>Total Siswa</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredStudents.length}</Text>
            <Text style={styles.statLabel}>Ditampilkan</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* Students List */}
        <FlatList
          data={filteredStudents}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={studentsLoading}
              onRefresh={handleRefresh}
              colors={['#005e7a']}
              tintColor="#005e7a"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="Belum ada siswa"
              message="Tambahkan siswa pertama ke kelas ini"
              icon="people-outline"
              onAction={handleAddStudents}
              actionLabel="Tambah Siswa"
            />
          }
        />

        {/* Add Students Modal */}
        {classData && (
          <AddStudentsToClassModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            classId={classData.id}
            onStudentsAdded={handleStudentsAdded}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#005e7a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  studentNis: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  studentDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  studentDetail: {
    fontSize: 12,
    color: '#999999',
  },
  studentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 4,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  loadingIndicator: {
    position: 'absolute',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
