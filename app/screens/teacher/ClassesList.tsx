import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ClassesList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [classes, setClasses] = useState<ClassData[]>(sampleClasses);

  const filteredClasses = classes.filter(
    (classItem) => 
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClass = () => {
    if (!newClassName || !newClassLevel) {
      alert('Mohon isi nama kelas dan tingkat');
      return;
    }

    const newClass: ClassData = {
      id: classes.length + 1,
      name: newClassName,
      level: newClassLevel,
      description: newClassDescription,
      studentCount: 0,
      progress: 0,
    };

    setClasses([...classes, newClass]);
    setShowAddModal(false);
    setNewClassName('');
    setNewClassLevel('');
    setNewClassDescription('');
  };

  const renderClassItem = ({ item }: { item: ClassData }) => (
    <TouchableOpacity 
      style={styles.classCard}
      onPress={() => router.push({
        pathname: '/teacher/class/[id]',
        params: { id: item.id }
      })}
    >
      <View style={styles.classHeader}>
        <View style={styles.classNameContainer}>
          <View style={styles.classIcon}>
            <Ionicons name="book" size={24} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.classLevel}>Tingkat {item.level}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#888888" />
        </TouchableOpacity>
      </View>

      {item.description && (
        <Text style={styles.classDescription}>{item.description}</Text>
      )}

      <View style={styles.classStats}>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={16} color="#888888" />
          <Text style={styles.statText}>{item.studentCount} Siswa</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="bar-chart-outline" size={16} color="#888888" />
          <Text style={styles.statText}>Progress {item.progress}%</Text>
        </View>
      </View>

      <View style={styles.classFooter}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => router.push({
            pathname: '/teacher/class/[id]/students',
            params: { id: item.id }
          })}
        >
          <Ionicons name="people" size={16} color="#005e7a" />
          <Text style={styles.footerButtonText}>Siswa</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => router.push({
            pathname: '/teacher/class/[id]/schedule',
            params: { id: item.id }
          })}
        >
          <Ionicons name="calendar" size={16} color="#005e7a" />
          <Text style={styles.footerButtonText}>Jadwal</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => router.push({
            pathname: '/teacher/class/[id]/reports',
            params: { id: item.id }
          })}
        >
          <Ionicons name="document-text" size={16} color="#005e7a" />
          <Text style={styles.footerButtonText}>Laporan</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Daftar Kelas</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Search and Add */}
      <View style={styles.actionContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kelas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {/* Classes List */}
      {filteredClasses.length > 0 ? (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={60} color="#cccccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Tidak ada kelas yang sesuai' : 'Belum ada kelas'}
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.emptyButtonText}>Tambah Kelas Baru</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Add Class Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Kelas Baru</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nama Kelas</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Tahfidz Al-Baqarah"
                  value={newClassName}
                  onChangeText={setNewClassName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tingkat</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Pemula, Menengah, Lanjutan"
                  value={newClassLevel}
                  onChangeText={setNewClassLevel}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Deskripsi (Opsional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tambahkan deskripsi kelas..."
                  value={newClassDescription}
                  onChangeText={setNewClassDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddClass}
              >
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Types
interface ClassData {
  id: number;
  name: string;
  level: string;
  description?: string;
  studentCount: number;
  progress: number;
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
  },
  {
    id: 2,
    name: 'Tahfidz Juz 30',
    level: 'Pemula',
    description: 'Kelas untuk pemula yang fokus pada hafalan Juz 30 (Juz Amma).',
    studentCount: 20,
    progress: 60,
  },
  {
    id: 3,
    name: 'Tahfidz Lanjutan',
    level: 'Lanjutan',
    description: 'Kelas untuk siswa yang telah menyelesaikan hafalan minimal 5 juz.',
    studentCount: 8,
    progress: 40,
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
  classCard: {
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
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  classNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  classDescription: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 15,
    lineHeight: 20,
  },
  classStats: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 5,
  },
  classFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 15,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    color: '#005e7a',
    marginLeft: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalContent: {
    padding: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#eeeeee',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#888888',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderLeftColor: '#eeeeee',
    backgroundColor: '#005e7a',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
}); 