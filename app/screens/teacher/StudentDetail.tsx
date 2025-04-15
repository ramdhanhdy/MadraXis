import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface Memorization {
  id: number;
  range: string;
  date: string;
  note?: string;
  status: 'baik' | 'cukup' | 'kurang';
}

interface Note {
  date: string;
  content: string;
}

interface Student {
  id: string;
  name: string;
  class?: string;
  image_url?: string;
  quran_progress?: {
    memorized_verses: number;
    total_verses: number;
  };
  memorizations?: Memorization[];
  notes?: Note[];
  gender?: string;
  birth_date?: string;
  parent_name?: string;
  phone?: string;
  address?: string;
}

export default function StudentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('hafalan'); // 'hafalan', 'catatan', 'info'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemoRange, setNewMemoRange] = useState('');
  const [newMemoDate, setNewMemoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMemoNote, setNewMemoNote] = useState('');
  
  // Fetch student data
  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        setError('Sesi anda telah berakhir. Silakan login kembali.');
        setIsLoading(false);
        return;
      }
      
      // Fetch student details
      const response = await axios.get(`http://192.168.0.105:8000/api/v1/students/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        // Initialize memorizations and notes if they don't exist
        const studentData = {
          ...response.data,
          memorizations: response.data.memorizations || [],
          notes: response.data.notes || []
        };
        setStudent(studentData);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Gagal memuat data siswa. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddMemorization = async () => {
    if (!newMemoRange) {
      Alert.alert('Error', 'Mohon isi rentang ayat');
      return;
    }
    
    if (!student) return;
    
    setIsLoading(true);
    
    try {
      // Get auth token
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        Alert.alert('Error', 'Sesi anda telah berakhir. Silakan login kembali.');
        setIsLoading(false);
        return;
      }
      
      // In a real app, this would be an API call to update memorization
      // For now, we'll just update the local state
      const newMemo: Memorization = {
        id: Date.now(), // Temporary ID
        range: newMemoRange,
        date: newMemoDate,
        note: newMemoNote,
        status: 'baik',
      };
      
      // Update student data with new memorization
      const updatedStudent = {
        ...student,
        memorizations: [newMemo, ...(student.memorizations || [])],
      };
      
      setStudent(updatedStudent);
      setShowAddModal(false);
      setNewMemoRange('');
      setNewMemoNote('');
      
      // Here you would call the API to update the student's memorization
      // await axios.post(`http://192.168.0.105:8000/api/v1/students/${id}/memorizations`, newMemo, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
    } catch (error) {
      console.error('Error adding memorization:', error);
      Alert.alert('Error', 'Gagal menambahkan setoran hafalan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchStudentData();
  };
  
  if (isLoading && !student) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Siswa</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
          <Text style={styles.loadingText}>Memuat data siswa...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Siswa</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Siswa</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={50} color="#cccccc" />
          <Text style={styles.emptyText}>Siswa tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const renderHafalanTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progress Hafalan</Text>
          <Text style={styles.progressPercentage}>
            {student.quran_progress 
              ? Math.round((student.quran_progress.memorized_verses / (student.quran_progress.total_verses || 1)) * 100)
              : 0}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: student.quran_progress 
                ? `${(student.quran_progress.memorized_verses / (student.quran_progress.total_verses || 1)) * 100}%` 
                : '0%' 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressDetail}>
          {student.quran_progress 
            ? `${student.quran_progress.memorized_verses} dari ${student.quran_progress.total_verses || 0} ayat`
            : 'Belum ada data hafalan'
          }
        </Text>
      </View>
      
      <View style={styles.memorizationListHeader}>
        <Text style={styles.memorizationListTitle}>Riwayat Setoran</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      
      {student.memorizations && student.memorizations.length > 0 ? (
        student.memorizations.map((memo) => (
          <View key={memo.id} style={styles.memorizationItem}>
            <View style={styles.memorizationHeader}>
              <Text style={styles.memorizationRange}>{memo.range}</Text>
              <View style={[
                styles.statusBadge, 
                memo.status === 'baik' ? styles.statusGood : 
                memo.status === 'cukup' ? styles.statusMedium : 
                styles.statusPoor
              ]}>
                <Text style={styles.statusText}>{memo.status}</Text>
              </View>
            </View>
            <Text style={styles.memorizationDate}>{memo.date}</Text>
            {memo.note && (
              <Text style={styles.memorizationNote}>{memo.note}</Text>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={50} color="#cccccc" />
          <Text style={styles.emptyText}>Belum ada setoran hafalan</Text>
        </View>
      )}
    </View>
  );
  
  const renderCatatanTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.notesContainer}>
        {student.notes && student.notes.length > 0 ? (
          student.notes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteDate}>{note.date}</Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-vertical" size={16} color="#888888" />
                </TouchableOpacity>
              </View>
              <Text style={styles.noteContent}>{note.content}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={50} color="#cccccc" />
            <Text style={styles.emptyText}>Belum ada catatan</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.addNoteButton}>
        <Ionicons name="add-circle" size={24} color="#005e7a" />
        <Text style={styles.addNoteText}>Tambah Catatan</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Informasi Pribadi</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nama Lengkap</Text>
          <Text style={styles.infoValue}>{student.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Kelas</Text>
          <Text style={styles.infoValue}>{student.class || 'Tidak diketahui'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Jenis Kelamin</Text>
          <Text style={styles.infoValue}>{student.gender || 'Tidak diketahui'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tanggal Lahir</Text>
          <Text style={styles.infoValue}>{student.birth_date || 'Tidak diketahui'}</Text>
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Informasi Kontak</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nama Orang Tua</Text>
          <Text style={styles.infoValue}>{student.parent_name || 'Tidak diketahui'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nomor Telepon</Text>
          <Text style={styles.infoValue}>{student.phone || 'Tidak diketahui'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Alamat</Text>
          <Text style={styles.infoValue}>{student.address || 'Tidak diketahui'}</Text>
        </View>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Siswa</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      {/* Student Profile */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {student.image_url ? (
            <Image source={{ uri: student.image_url }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>
                {student.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{student.name}</Text>
          <Text style={styles.profileClass}>Kelas {student.class || 'N/A'}</Text>
        </View>
      </View>
      
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'hafalan' && styles.activeTab]}
          onPress={() => setActiveTab('hafalan')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'hafalan' && styles.activeTabText]}
          >
            Hafalan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'catatan' && styles.activeTab]}
          onPress={() => setActiveTab('catatan')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'catatan' && styles.activeTabText]}
          >
            Catatan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}
          >
            Info
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'hafalan' && renderHafalanTab()}
        {activeTab === 'catatan' && renderCatatanTab()}
        {activeTab === 'info' && renderInfoTab()}
      </ScrollView>
      
      {/* Add Memorization Modal */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Setoran Hafalan</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Rentang Ayat</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Al-Baqarah 1-5"
                  value={newMemoRange}
                  onChangeText={setNewMemoRange}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tanggal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={newMemoDate}
                  onChangeText={setNewMemoDate}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Catatan (Opsional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tambahkan catatan..."
                  value={newMemoNote}
                  onChangeText={setNewMemoNote}
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
                onPress={handleAddMemorization}
              >
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 16,
    color: '#888888',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 14,
    color: '#888888',
  },
  activeTabText: {
    color: '#005e7a',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  progressSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#005e7a',
    borderRadius: 5,
  },
  progressDetail: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  memorizationListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  memorizationListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 5,
  },
  memorizationItem: {
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
  memorizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  memorizationRange: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusGood: {
    backgroundColor: '#e6f7ee',
  },
  statusMedium: {
    backgroundColor: '#fff8e6',
  },
  statusPoor: {
    backgroundColor: '#ffe6e6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  memorizationDate: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  memorizationNote: {
    fontSize: 14,
    color: '#555555',
    marginTop: 5,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    marginTop: 10,
  },
  notesContainer: {
    marginBottom: 20,
  },
  noteItem: {
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
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 14,
    color: '#888888',
  },
  noteContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addNoteText: {
    fontSize: 16,
    color: '#005e7a',
    marginLeft: 10,
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: '#888888',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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