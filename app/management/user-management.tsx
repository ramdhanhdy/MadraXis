import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { fetchStudents, fetchTeachers } from '../../src/services/users';
import { Student, Teacher } from '../../src/types';

export default function UserManagementScreen() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter users based on search term
  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch data based on school ID
  const fetchData = async () => {
    if (!user) return;

    // Check both user metadata and profile for school_id
    console.log('User metadata:', user.user_metadata);
    console.log('Profile:', profile);
    const rawSchoolId = user.user_metadata?.school_id || profile?.school_id;
    console.log('Raw school ID found:', rawSchoolId);
    
    if (!rawSchoolId) {
      setError('School ID not found for this user.');
      return;
    }

    const schoolId = typeof rawSchoolId === 'string' ? parseInt(rawSchoolId, 10) : rawSchoolId;
    if (isNaN(schoolId) || schoolId < 0) {
      setError('Invalid School ID for this user.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch students and teachers
      const [studentsResponse, teachersResponse] = await Promise.all([
        fetchStudents(schoolId),
        fetchTeachers(schoolId)
      ]);

      if (studentsResponse.error) {
        throw new Error(`Failed to fetch students: ${studentsResponse.error.message}`);
      }
      if (teachersResponse.error) {
        throw new Error(`Failed to fetch teachers: ${teachersResponse.error.message}`);
      }

      setStudents(studentsResponse.data || []);
      setTeachers(teachersResponse.data || []);

    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Gagal memuat data pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (userId: string, userType: 'student' | 'teacher') => {
    // TODO: Navigate to user detail screen
    Alert.alert('Info', `Detail ${userType} ${userId} akan segera tersedia.`);
  };

  // Handle add user
  const handleAddUser = () => {
    setShowAddModal(true);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, profile]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manajemen Pengguna</Text>
        <TouchableOpacity onPress={handleAddUser}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari pengguna..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#888"
        />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => setActiveTab('students')}
        >
          <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
            Siswa ({filteredStudents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'teachers' && styles.activeTab]}
          onPress={() => setActiveTab('teachers')}
        >
          <Text style={[styles.tabText, activeTab === 'teachers' && styles.activeTabText]}>
            Guru ({filteredTeachers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005e7a" />
            <Text style={styles.loadingText}>Memuat data pengguna...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={40} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.userList}>
            {activeTab === 'students' ? (
              filteredStudents.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={40} color="#cccccc" />
                  <Text style={styles.emptyText}>
                    {searchTerm ? 'Tidak ada siswa yang sesuai pencarian' : 'Belum ada siswa terdaftar'}
                  </Text>
                </View>
              ) : (
                filteredStudents.map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    style={styles.userItem}
                    onPress={() => handleUserSelect(student.id, 'student')}
                  >
                    <View style={styles.userAvatar}>
                      <Ionicons name="person" size={24} color="#005e7a" />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{student.full_name || 'Nama tidak tersedia'}</Text>
                      <Text style={styles.userDetail}>
                        NIS: {student.details?.nis || 'Tidak tersedia'} • Kelas: {student.class_name || 'Tidak tersedia'}
                      </Text>
                      <Text style={styles.userDetail}>
                        Jenis Kelamin: {student.details?.gender === 'M' ? 'Laki-laki' : student.details?.gender === 'F' ? 'Perempuan' : 'Tidak tersedia'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#cccccc" />
                  </TouchableOpacity>
                ))
              )
            ) : (
              filteredTeachers.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={40} color="#cccccc" />
                  <Text style={styles.emptyText}>
                    {searchTerm ? 'Tidak ada guru yang sesuai pencarian' : 'Belum ada guru terdaftar'}
                  </Text>
                </View>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TouchableOpacity
                    key={teacher.id}
                    style={styles.userItem}
                    onPress={() => handleUserSelect(teacher.id, 'teacher')}
                  >
                    <View style={styles.userAvatar}>
                      <Ionicons name="person" size={24} color="#005e7a" />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{teacher.full_name || 'Nama tidak tersedia'}</Text>
                      <Text style={styles.userDetail}>
                        ID Karyawan: {teacher.details?.employee_id || 'Tidak tersedia'}
                      </Text>
                      <Text style={styles.userDetail}>
                        Spesialisasi: {teacher.details?.specialty || 'Tidak tersedia'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#cccccc" />
                  </TouchableOpacity>
                ))
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Pengguna</Text>
            <Text style={styles.modalText}>
              Fitur penambahan pengguna akan segera tersedia. Saat ini, pengguna dapat didaftarkan melalui sistem autentikasi.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#005e7a',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#005e7a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  userList: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 