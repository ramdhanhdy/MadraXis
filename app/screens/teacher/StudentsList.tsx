import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function StudentsList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [selectedSort, setSelectedSort] = useState('Nama (A-Z)');
  
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
        return a.class.localeCompare(b.class);
      case 'Kelas (Turun)':
        return b.class.localeCompare(a.class);
      case 'Hafalan (Terbanyak)':
        return b.memorizedVerses - a.memorizedVerses;
      case 'Hafalan (Tersedikit)':
        return a.memorizedVerses - b.memorizedVerses;
      default:
        return 0;
    }
  });

  const handleStudentPress = (studentId: number) => {
    router.push(`screens/teacher/student-detail?id=${studentId}` as any);
  };

  const handleAddStudent = () => {
    router.push('screens/teacher/add-student' as any);
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => handleStudentPress(item.id)}
    >
      <View style={styles.studentImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.studentImage} />
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
        <Text style={styles.studentClass}>Kelas {item.class}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(item.memorizedVerses / item.totalVerses) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.memorizedVerses}/{item.totalVerses} ayat
          </Text>
        </View>
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
              {['Semua', '5A', '5B', '6A', '6B'].map(classOption => (
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
      
      {/* Students List */}
      <FlatList
        data={sortedStudents}
        renderItem={renderStudentItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={50} color="#cccccc" />
            <Text style={styles.emptyText}>Tidak ada siswa yang ditemukan</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Types
interface Student {
  id: number;
  name: string;
  class: string;
  image?: string;
  memorizedVerses: number;
  totalVerses: number;
}

// Sample Data
const students: Student[] = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    class: '5A',
    memorizedVerses: 120,
    totalVerses: 200,
  },
  {
    id: 2,
    name: 'Budi Santoso',
    class: '5A',
    memorizedVerses: 150,
    totalVerses: 200,
  },
  {
    id: 3,
    name: 'Siti Aminah',
    class: '5B',
    memorizedVerses: 180,
    totalVerses: 200,
  },
  {
    id: 4,
    name: 'Dewi Putri',
    class: '5B',
    memorizedVerses: 90,
    totalVerses: 200,
  },
  {
    id: 5,
    name: 'Rudi Hermawan',
    class: '6A',
    memorizedVerses: 220,
    totalVerses: 300,
  },
  {
    id: 6,
    name: 'Andi Wijaya',
    class: '6A',
    memorizedVerses: 250,
    totalVerses: 300,
  },
  {
    id: 7,
    name: 'Rina Marlina',
    class: '6B',
    memorizedVerses: 280,
    totalVerses: 300,
  },
  {
    id: 8,
    name: 'Doni Kusuma',
    class: '6B',
    memorizedVerses: 200,
    totalVerses: 300,
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