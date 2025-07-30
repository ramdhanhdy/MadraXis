import React, { useState, useEffect, useCallback } from 'react';
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

// Context and Services
import { useAuth } from '@lib/hooks/useAuth';
import { fetchStudents, fetchTeachers } from '@domains/users';

// Feature Model
import {
  type Student,
  type Teacher,
  type UserManagementState,
  type UserStats,
  USER_TABS,
  searchUsers,
  calculateUserStats,
  formatUserRole,
  formatGender,
  getUniqueClasses,
  getUniqueSubjects,
  sortUsersByName,
  initialUserManagementState,
  USER_MANAGEMENT_ERRORS,
  USER_MANAGEMENT_SUCCESS,
} from './model';

export default function UserManagementScreen() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [state, setState] = useState<UserManagementState>(initialUserManagementState);
  
  // Derived state
  const filteredStudents = searchUsers(state.students, state.searchTerm) as Student[];
  const filteredTeachers = searchUsers(state.teachers, state.searchTerm) as Teacher[];
  const userStats = calculateUserStats(state.students, state.teachers);

  // Update state helper
  const updateState = (updates: Partial<UserManagementState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Fetch data based on school ID
  const fetchData = useCallback(async () => {
    if (!user) return;

    // Check both user metadata and profile for school_id
    console.log('User metadata:', user.user_metadata);
    console.log('Profile:', profile);
    const rawSchoolId = user.user_metadata?.school_id || profile?.school_id;
    console.log('Raw school ID found:', rawSchoolId);
    
    if (!rawSchoolId) {
      updateState({ error: 'School ID not found for this user.' });
      return;
    }

    const schoolId = typeof rawSchoolId === 'string' ? parseInt(rawSchoolId, 10) : rawSchoolId;
    if (isNaN(schoolId) || schoolId < 0) {
      updateState({ error: 'Invalid School ID for this user.' });
      return;
    }

    try {
      updateState({ isLoading: true, error: null });

      // Fetch students and teachers
      console.log('Fetching data for school ID:', schoolId);
      const [studentsResponse, teachersResponse] = await Promise.all([
        fetchStudents(schoolId),
        fetchTeachers(schoolId)
      ]);

      console.log('Students response:', studentsResponse);
      console.log('Teachers response:', teachersResponse);

      if (studentsResponse.error) {
        throw new Error(`Failed to fetch students: ${studentsResponse.error.message}`);
      }
      if (teachersResponse.error) {
        throw new Error(`Failed to fetch teachers: ${teachersResponse.error.message}`);
      }

      console.log('Students data:', studentsResponse.data);
      console.log('Teachers data:', teachersResponse.data);
      
      updateState({
        students: studentsResponse.data || [],
        teachers: teachersResponse.data || [],
      });

    } catch (err: any) {
      console.error('Error fetching user data:', err);
      updateState({ error: err.message || USER_MANAGEMENT_ERRORS.LOAD_FAILED });
    } finally {
      updateState({ isLoading: false });
    }
  }, [user, profile]);

  // Handle user selection
  const handleUserSelect = (userId: string, userType: 'student' | 'teacher') => {
    // TODO: Navigate to user detail screen
    Alert.alert('Info', `Detail ${userType} ${userId} akan segera tersedia.`);
  };

  // Handle add user
  const handleAddUser = () => {
    updateState({ showAddModal: true });
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Handle search
  const handleSearch = (query: string) => {
    updateState({ searchTerm: query });
  };

  // Handle tab change
  const handleTabChange = (tab: 'students' | 'teachers') => {
    updateState({ activeTab: tab });
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, profile, fetchData]);

  // Render user stats
  const renderUserStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{userStats.totalStudents}</Text>
        <Text style={styles.statLabel}>Total Siswa</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{userStats.totalTeachers}</Text>
        <Text style={styles.statLabel}>Total Guru</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{userStats.newUsersThisMonth}</Text>
        <Text style={styles.statLabel}>Baru Bulan Ini</Text>
      </View>
    </View>
  );

  // Render user item
  const renderUserItem = (user: Student | Teacher, userType: 'student' | 'teacher') => (
    <TouchableOpacity
      key={user.id}
      style={styles.userItem}
      onPress={() => handleUserSelect(user.id, userType)}
    >
      <View style={styles.userAvatar}>
        <Ionicons name="person" size={24} color="#005e7a" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.full_name || 'Nama tidak tersedia'}</Text>
        {userType === 'student' ? (
          <Text style={styles.userDetail}>
            NIS: {(user as Student).details?.nis || 'Tidak tersedia'} • 
            Kelas: {(user as Student).details?.class_name || 'Tidak tersedia'}
          </Text>
        ) : (
          <Text style={styles.userDetail}>
            NIP: {(user as Teacher).details?.nip || 'Tidak tersedia'} • 
            Mata Pelajaran: {(user as Teacher).details?.subjects?.join(', ') || 'Tidak tersedia'}
          </Text>
        )}
        <Text style={styles.userDetail}>
          {userType === 'student' 
            ? `Jenis Kelamin: ${formatGender((user as Student).details?.gender)}`
            : `Email: ${user.email || 'Tidak tersedia'}`
          }
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cccccc" />
    </TouchableOpacity>
  );

  // Render loading state
  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manajemen Pengguna</Text>
          <TouchableOpacity onPress={handleAddUser}>
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
          <Text style={styles.loadingText}>Memuat data pengguna...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (state.error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manajemen Pengguna</Text>
          <TouchableOpacity onPress={handleAddUser}>
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={40} color="#e74c3c" />
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

      {/* User Stats */}
      {renderUserStats()}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari pengguna..."
          value={state.searchTerm}
          onChangeText={handleSearch}
          placeholderTextColor="#888"
        />
        {state.searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, state.activeTab === USER_TABS.STUDENTS && styles.activeTab]}
          onPress={() => handleTabChange(USER_TABS.STUDENTS)}
        >
          <Text style={[styles.tabText, state.activeTab === USER_TABS.STUDENTS && styles.activeTabText]}>
            Siswa ({filteredStudents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, state.activeTab === USER_TABS.TEACHERS && styles.activeTab]}
          onPress={() => handleTabChange(USER_TABS.TEACHERS)}
        >
          <Text style={[styles.tabText, state.activeTab === USER_TABS.TEACHERS && styles.activeTabText]}>
            Guru ({filteredTeachers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.userList}>
          {state.activeTab === USER_TABS.STUDENTS ? (
            filteredStudents.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={40} color="#cccccc" />
                <Text style={styles.emptyText}>
                  {state.searchTerm ? 'Tidak ada siswa yang sesuai pencarian' : 'Belum ada siswa terdaftar'}
                </Text>
              </View>
            ) : (
              sortUsersByName(filteredStudents).map((student) => renderUserItem(student, 'student'))
            )
          ) : (
            filteredTeachers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={40} color="#cccccc" />
                <Text style={styles.emptyText}>
                  {state.searchTerm ? 'Tidak ada guru yang sesuai pencarian' : 'Belum ada guru terdaftar'}
                </Text>
              </View>
            ) : (
              sortUsersByName(filteredTeachers).map((teacher) => renderUserItem(teacher, 'teacher'))
            )
          )}
        </View>
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={state.showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => updateState({ showAddModal: false })}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => updateState({ showAddModal: false })}>
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Tambah Pengguna</Text>
            <TouchableOpacity>
              <Text style={styles.modalSaveText}>Simpan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>
              Fitur tambah pengguna akan segera tersedia!
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#005e7a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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
  clearButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#005e7a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
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
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginVertical: 16,
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
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#005e7a',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
