import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Student as GlobalStudent } from '../../types';

// Types - extending global Student type for local component needs
interface Student extends Omit<GlobalStudent, 'id'> {
  id: number; // Local component uses number instead of string
  name: string; // Alias for full_name for backward compatibility
  memorizedVerses: number;
  totalVerses: number;
  lastActivity?: string;
  progress?: number;
}

interface ClassData {
  id: number;
  name: string;
  level: string;
  studentCount: number;
  students?: Student[];
}

// Sample Data
const sampleClasses: ClassData[] = [
  {
    id: 1,
    name: 'Tahfidz Al-Baqarah',
    level: 'Menengah',
    studentCount: 25,
    students: [
      { 
        id: 1, 
        name: 'Ahmad Fauzi',
        full_name: 'Ahmad Fauzi',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        memorizedVerses: 150, 
        totalVerses: 200, 
        lastActivity: '2024-01-15',
        progress: 75 
      },
      { 
        id: 2, 
        name: 'Fatimah Zahra',
        full_name: 'Fatimah Zahra',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-14T00:00:00Z',
        memorizedVerses: 180, 
        totalVerses: 200, 
        lastActivity: '2024-01-14',
        progress: 90 
      },
      { 
        id: 3, 
        name: 'Muhammad Ali',
        full_name: 'Muhammad Ali',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-13T00:00:00Z',
        memorizedVerses: 120, 
        totalVerses: 200, 
        lastActivity: '2024-01-13',
        progress: 60 
      },
      { 
        id: 4, 
        name: 'Siti Aisyah',
        full_name: 'Siti Aisyah',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        memorizedVerses: 160, 
        totalVerses: 200, 
        lastActivity: '2024-01-15',
        progress: 80 
      },
      { 
        id: 5, 
        name: 'Omar bin Khattab',
        full_name: 'Omar bin Khattab',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-12T00:00:00Z',
        memorizedVerses: 140, 
        totalVerses: 200, 
        lastActivity: '2024-01-12',
        progress: 70 
      },
    ],
  },
  {
    id: 2,
    name: 'Tahfidz Al-Imran',
    level: 'Lanjutan',
    studentCount: 20,
    students: [
      { 
        id: 6, 
        name: 'Khadijah binti Khuwailid',
        full_name: 'Khadijah binti Khuwailid',
        role: 'student' as const,
        school_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        memorizedVerses: 100, 
        totalVerses: 150, 
        lastActivity: '2024-01-15',
        progress: 67 
      },
    ],
  },
];

export default function ClassStudents() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = parseInt(id || '0');
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch class data
  useEffect(() => {
    const foundClass = sampleClasses.find(c => c.id === classId);
    if (foundClass) {
      setClassData(foundClass);
    }
  }, [classId]);
  
  if (!classData) {
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
          <Text style={styles.loadingText}>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const filteredStudents = classData.students?.filter(
    (student) => student.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => router.push({
        pathname: '/(teacher)/students/[id]',
        params: { id: item.id }
      })}
    >
      <View style={styles.studentHeader}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentInitial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentProgress}>
            {item.memorizedVerses}/{item.totalVerses} ayat ({item.progress}%)
          </Text>
          {item.lastActivity && (
            <Text style={styles.studentActivity}>
              Aktivitas terakhir: {item.lastActivity}
            </Text>
          )}
        </View>
        <View style={styles.studentActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Handle quick action
            }}
          >
            <Ionicons name="create-outline" size={20} color="#005e7a" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress || 0}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.progress || 0}%</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Siswa - {classData.name}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Search and Add */}
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
          onPress={() => router.push({
            pathname: '/(teacher)/students/add',
            params: { classId }
          })}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{classData.studentCount}</Text>
          <Text style={styles.statLabel}>Total Siswa</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredStudents.length}</Text>
          <Text style={styles.statLabel}>Ditampilkan</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.round(filteredStudents.reduce((acc, student) => acc + (student.progress || 0), 0) / filteredStudents.length) || 0}%
          </Text>
          <Text style={styles.statLabel}>Rata-rata Progress</Text>
        </View>
      </View>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyStateTitle}>
            {searchQuery ? 'Siswa tidak ditemukan' : 'Belum ada siswa'}
          </Text>
          <Text style={styles.emptyStateMessage}>
            {searchQuery 
              ? 'Coba ubah kata kunci pencarian'
              : 'Tambahkan siswa pertama ke kelas ini'
            }
          </Text>
          {!searchQuery && (
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push({
                pathname: '/(teacher)/students/add',
                params: { classId }
              })}
            >
              <Text style={styles.emptyStateButtonText}>Tambah Siswa</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
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
    marginBottom: 12,
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
  studentProgress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  studentActivity: {
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
