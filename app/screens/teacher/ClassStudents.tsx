import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ClassStudents() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = parseInt(id || '0');
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch class data
  useEffect(() => {
    // In a real app, this would be an API call
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
          <Text>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const filteredStudents = classData.students?.filter(
    (student) => student.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Siswa Kelas</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Class Info */}
      <View style={styles.classInfoContainer}>
        <View style={styles.classIcon}>
          <Ionicons name="book" size={24} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.className}>{classData.name}</Text>
          <Text style={styles.classLevel}>Tingkat {classData.level}</Text>
        </View>
      </View>
      
      {/* Search and Add */}
      <View style={styles.actionContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari siswa..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push({
            pathname: "/screens/teacher/AddStudent",
            params: { classId }
          })}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.studentItem}
              onPress={() => router.push({
                pathname: "/screens/teacher/StudentDetail",
                params: { id: item.id }
              })}
            >
              <View style={styles.studentInfo}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentAvatarText}>
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentProgress}>
                    Progress: {Math.round((item.memorizedVerses / item.totalVerses) * 100)}%
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={50} color="#cccccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Tidak ada siswa yang sesuai' : 'Belum ada siswa di kelas ini'}
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => router.push({
              pathname: "/screens/teacher/AddStudent",
              params: { classId }
            })}
          >
            <Text style={styles.emptyButtonText}>Tambah Siswa Baru</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// Types
interface Student {
  id: number;
  name: string;
  memorizedVerses: number;
  totalVerses: number;
}

interface ClassData {
  id: number;
  name: string;
  level: string;
  description?: string;
  studentCount: number;
  progress: number;
  students?: Student[];
}

// Sample Data
const sampleClasses: ClassData[] = [
  {
    id: 1,
    name: 'Tahfidz Al-Baqarah',
    level: 'Menengah',
    description: 'Kelas fokus pada hafalan Surah Al-Baqarah dengan penekanan pada tajwid dan makna.',
    studentCount: 15,
    progress: 75,
    students: [
      {
        id: 1,
        name: 'Ahmad Fauzi',
        memorizedVerses: 120,
        totalVerses: 200,
      },
      {
        id: 2,
        name: 'Budi Santoso',
        memorizedVerses: 150,
        totalVerses: 200,
      },
      {
        id: 3,
        name: 'Siti Aminah',
        memorizedVerses: 180,
        totalVerses: 200,
      },
    ],
  },
  {
    id: 2,
    name: 'Tahfidz Juz 30',
    level: 'Pemula',
    description: 'Kelas untuk pemula yang fokus pada hafalan Juz 30 (Juz Amma).',
    studentCount: 20,
    progress: 60,
    students: [],
  },
  {
    id: 3,
    name: 'Tahfidz Lanjutan',
    level: 'Lanjutan',
    description: 'Kelas untuk siswa yang telah menyelesaikan hafalan minimal 5 juz.',
    studentCount: 8,
    progress: 40,
    students: [],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  classIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  classLevel: {
    fontSize: 14,
    color: '#888888',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  studentAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  studentProgress: {
    fontSize: 14,
    color: '#888888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#005e7a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 