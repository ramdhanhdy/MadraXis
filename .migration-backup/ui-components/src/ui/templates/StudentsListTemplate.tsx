import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { convertNumberToString } from '../../utils/idConversion';
// Local interface for StudentsList display purposes
interface StudentsListItem {
  id: number;
  name: string;
  class: string;
  memorizedVerses: number;
  totalVerses: number;
  progress: number;
  lastActivity?: string;
}

// Sample Data
const sampleStudents: StudentsListItem[] = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    class: 'Tahfidz Al-Baqarah',
    memorizedVerses: 150,
    totalVerses: 200,
    progress: 75,
    lastActivity: '2024-01-15'
  },
  {
    id: 2,
    name: 'Fatimah Zahra',
    class: 'Tahfidz Al-Baqarah',
    memorizedVerses: 180,
    totalVerses: 200,
    progress: 90,
    lastActivity: '2024-01-14'
  },
  {
    id: 3,
    name: 'Muhammad Ali',
    class: 'Tahfidz Al-Imran',
    memorizedVerses: 120,
    totalVerses: 150,
    progress: 80,
    lastActivity: '2024-01-13'
  },
  {
    id: 4,
    name: 'Siti Aisyah',
    class: 'Tahfidz Al-Baqarah',
    memorizedVerses: 160,
    totalVerses: 200,
    progress: 80,
    lastActivity: '2024-01-15'
  },
  {
    id: 5,
    name: 'Omar bin Khattab',
    class: 'Tahfidz Al-Imran',
    memorizedVerses: 100,
    totalVerses: 150,
    progress: 67,
    lastActivity: '2024-01-12'
  },
];

const classes = ['Semua', 'Tahfidz Al-Baqarah', 'Tahfidz Al-Imran'];
const sortOptions = ['Nama (A-Z)', 'Nama (Z-A)', 'Progress (Tinggi)', 'Progress (Rendah)'];

export default function StudentsList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [selectedSort, setSelectedSort] = useState('Nama (A-Z)');
  const [students] = useState<StudentsListItem[]>(sampleStudents);
  const [isLoading] = useState(false);

  // Filter and sort students
  const filteredAndSortedStudents = students
    .filter((student: StudentsListItem) => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === 'Semua' || student.class === selectedClass;
      return matchesSearch && matchesClass;
    })
    .sort((a: StudentsListItem, b: StudentsListItem) => {
      switch (selectedSort) {
        case 'Nama (A-Z)':
          return a.name.localeCompare(b.name);
        case 'Nama (Z-A)':
          return b.name.localeCompare(a.name);
        case 'Progress (Tinggi)':
          return b.progress - a.progress;
        case 'Progress (Rendah)':
          return a.progress - b.progress;
        default:
          return 0;
      }
    });

  const renderStudentItem = ({ item }: { item: StudentsListItem }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => router.push({
        pathname: '/(teacher)/students/[id]',
        params: { id: convertNumberToString(item.id) }
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
          <Text style={styles.studentClass}>{item.class}</Text>
          <Text style={styles.studentProgress}>
            {item.memorizedVerses}/{item.totalVerses} ayat
          </Text>
          {item.lastActivity && (
            <Text style={styles.studentActivity}>
              Terakhir aktif: {item.lastActivity}
            </Text>
          )}
        </View>
        <View style={styles.studentStats}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress || 0}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress || 0}%</Text>
          </View>
          
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    filterVisible && (
      <View style={styles.filterModal}>
        <View style={styles.filterContent}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter & Urutkan</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Ionicons name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Kelas</Text>
            {classes.map((className) => (
              <TouchableOpacity
                key={className}
                style={styles.filterOption}
                onPress={() => setSelectedClass(className)}
              >
                <Ionicons 
                  name={selectedClass === className ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color="#005e7a" 
                />
                <Text style={styles.filterOptionText}>{className}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Urutkan</Text>
            {sortOptions.map((sortOption) => (
              <TouchableOpacity
                key={sortOption}
                style={styles.filterOption}
                onPress={() => setSelectedSort(sortOption)}
              >
                <Ionicons 
                  name={selectedSort === sortOption ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color="#005e7a" 
                />
                <Text style={styles.filterOptionText}>{sortOption}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.applyFilterButton}
            onPress={() => setFilterVisible(false)}
          >
            <Text style={styles.applyFilterButtonText}>Terapkan</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
          <Text style={styles.loadingText}>Memuat data siswa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Siswa</Text>
        <TouchableOpacity onPress={() => router.push('/(teacher)/students/add')}>
          <Ionicons name="add" size={24} color="#005e7a" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
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
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={20} color="#005e7a" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{students.length}</Text>
          <Text style={styles.statLabel}>Total Siswa</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredAndSortedStudents.length}</Text>
          <Text style={styles.statLabel}>Ditampilkan</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.round(filteredAndSortedStudents.reduce((acc, student) => acc + student.progress, 0) / filteredAndSortedStudents.length) || 0}%
          </Text>
          <Text style={styles.statLabel}>Rata-rata Progress</Text>
        </View>
      </View>

      {/* Students List */}
      {filteredAndSortedStudents.length > 0 ? (
        <FlatList
          data={filteredAndSortedStudents}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyStateTitle}>
            {searchQuery || selectedClass !== 'Semua' ? 'Siswa tidak ditemukan' : 'Belum ada siswa'}
          </Text>
          <Text style={styles.emptyStateMessage}>
            {searchQuery || selectedClass !== 'Semua' 
              ? 'Coba ubah kata kunci pencarian atau filter'
              : 'Tambahkan siswa pertama'
            }
          </Text>
          {!searchQuery && selectedClass === 'Semua' && (
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/(teacher)/students/add')}
            >
              <Text style={styles.emptyStateButtonText}>Tambah Siswa</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Filter Modal */}
      {renderFilterModal()}
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
    marginTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
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
  filterButton: {
    backgroundColor: '#f8f9fa',
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
    marginBottom: 2,
  },
  studentClass: {
    fontSize: 14,
    color: '#005e7a',
    marginBottom: 2,
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
  studentStats: {
    alignItems: 'flex-end',
  },
  progressContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
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
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
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
  filterModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  applyFilterButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyFilterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
