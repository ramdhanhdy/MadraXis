import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { fetchStudentsLegacyFormat } from '../../../src/services/users';

// Types
interface Student {
  id: string;
  name: string;
  class?: string;
  quran_progress?: {
    memorized_verses: number;
    total_verses: number;
  };
  image_url?: string;
}

/**
 * Displays a searchable, filterable, and sortable list of students for the current school.
 *
 * Fetches student data based on the authenticated user's school, and provides UI controls for searching by name, filtering by class, and sorting by name, class, or Quran memorization progress. Handles loading and error states, and allows navigation to student detail and add student screens.
 *
 * @returns The rendered students list screen component.
 */
export default function StudentsList() {
  const router = useRouter();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [selectedSort, setSelectedSort] = useState('Nama (A-Z)');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<string[]>(['Semua']);
  
  // Fetch students from new unified schema
  useEffect(() => {
    if (profile?.school_id) {
      fetchStudents();
    }
  }, [profile]);

  const fetchStudents = async () => {
    if (!profile?.school_id) {
      setError('Profil sekolah tidak ditemukan. Silakan login kembali.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: serviceError } = await fetchStudentsLegacyFormat(profile.school_id);
      
      if (serviceError) {
        console.error('Error fetching students:', serviceError);
        setError('Gagal memuat data siswa. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }
      
      if (data) {
        setStudents(data);
        
        // Extract unique classes for filtering
        const uniqueClasses = ['Semua', ...new Set(data
          .map((student: Student) => student.class)
          .filter((cls: string | undefined) => cls !== undefined))] as string[];
        
        setClasses(uniqueClasses);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Gagal memuat data siswa. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter students based on search query and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'Semua' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });
  
  // Sort students based on selected sort option
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (selectedSort) {
      case 'Nama (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Nama (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Kelas (Naik)':
        return (a.class || '').localeCompare(b.class || '');
      case 'Kelas (Turun)':
        return (b.class || '').localeCompare(a.class || '');
      case 'Hafalan (Terbanyak)':
        return (b.quran_progress?.memorized_verses || 0) - (a.quran_progress?.memorized_verses || 0);
      case 'Hafalan (Tersedikit)':
        return (a.quran_progress?.memorized_verses || 0) - (b.quran_progress?.memorized_verses || 0);
      default:
        return 0;
    }
  });

  const handleStudentPress = (studentId: string) => {
    router.push(`screens/teacher/student-detail?id=${studentId}` as any);
  };

  const handleAddStudent = () => {
    // Navigate to the Add Student screen using the correct Expo Router path
    router.push('/screens/teacher/AddStudent'); 
  };

  const handleRetry = () => {
    fetchStudents();
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => handleStudentPress(item.id)}
    >
      <View style={styles.studentImageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.studentImage} />
        ) : (
          <View style={styles.studentImagePlaceholder}>
            <Text style={styles.studentImagePlaceholderText}>
              {item.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentClass}>Kelas {item.class || 'N/A'}</Text>
        {item.quran_progress ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(item.quran_progress.memorized_verses / (item.quran_progress.total_verses || 1)) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {item.quran_progress.memorized_verses}/{item.quran_progress.total_verses || 0} ayat
            </Text>
          </View>
        ) : (
          <Text style={styles.progressText}>Tidak ada data hafalan</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888888" />
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
        <Text style={styles.headerTitle}>Daftar Siswa</Text>
        <TouchableOpacity onPress={handleAddStudent}>
          <Ionicons name="add-circle-outline" size={24} color="#005e7a" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari siswa berdasarkan nama"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <Ionicons name="options-outline" size={20} color="#005e7a" />
        </TouchableOpacity>
      </View>
      
      {/* Filter Options */}
      {filterVisible && (
        <View style={styles.filterContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Kelas</Text>
            <View style={styles.filterOptions}>
              {classes.map(classOption => (
                <TouchableOpacity
                  key={classOption}
                  style={[
                    styles.filterOption,
                    selectedClass === classOption && styles.filterOptionSelected
                  ]}
                  onPress={() => setSelectedClass(classOption)}
                >
                  <Text 
                    style={[
                      styles.filterOptionText,
                      selectedClass === classOption && styles.filterOptionTextSelected
                    ]}
                  >
                    {classOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Urutkan</Text>
            <View style={styles.filterOptions}>
              {[
                'Nama (A-Z)', 
                'Nama (Z-A)', 
                'Kelas (Naik)', 
                'Kelas (Turun)',
                'Hafalan (Terbanyak)',
                'Hafalan (Tersedikit)'
              ].map(sortOption => (
                <TouchableOpacity
                  key={sortOption}
                  style={[
                    styles.filterOption,
                    selectedSort === sortOption && styles.filterOptionSelected
                  ]}
                  onPress={() => setSelectedSort(sortOption)}
                >
                  <Text 
                    style={[
                      styles.filterOptionText,
                      selectedSort === sortOption && styles.filterOptionTextSelected
                    ]}
                  >
                    {sortOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
      
      {/* Loading and Error States */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
          <Text style={styles.loadingText}>Memuat data siswa...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Students List */
        <FlatList
          data={sortedStudents}
          renderItem={renderStudentItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={fetchStudents}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={50} color="#cccccc" />
              <Text style={styles.emptyText}>Tidak ada siswa yang ditemukan</Text>
            </View>
          }
        />
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  searchBar: {
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
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#333333',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#005e7a',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#555555',
  },
  filterOptionTextSelected: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentImageContainer: {
    marginRight: 15,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  studentImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentImagePlaceholderText: {
    fontSize: 16,
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
  studentClass: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#eeeeee',
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#005e7a',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#888888',
    width: 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    marginTop: 10,
  },
}); 