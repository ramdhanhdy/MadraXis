import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Student as GlobalStudent } from '../../types';
import { convertStringToNumber } from '../../utils/idConversion';

// Types
interface Memorization {
  id: number;
  range: string;
  date: string;
  note?: string;
  status: 'baik' | 'cukup' | 'kurang';
}

interface Note {
  id: number;
  date: string;
  content: string;
}

// Types - extending global Student type for local component needs
interface Student extends Omit<GlobalStudent, 'id'> {
  id: number; // Local component uses number for internal operations
  name: string; // Alias for full_name for backward compatibility
  class: string;
  memorizedVerses: number;
  totalVerses: number;
  progress: number;
  memorizations: Memorization[];
  notes: Note[];
  parentName?: string;
  parentPhone?: string;
  joinDate?: string;
}

// Sample Data
const sampleStudents: Student[] = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    full_name: 'Ahmad Fauzi',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    class: 'Tahfidz Al-Baqarah',
    memorizedVerses: 150,
    totalVerses: 200,
    progress: 75,
    parentName: 'Bapak Fauzi',
    parentPhone: '081234567890',
    joinDate: '2023-09-01',
    memorizations: [
      { id: 1, range: 'Ayat 1-10', date: '2024-01-15', status: 'baik', note: 'Hafalan lancar' },
      { id: 2, range: 'Ayat 11-20', date: '2024-01-10', status: 'cukup', note: 'Perlu perbaikan tajwid' },
      { id: 3, range: 'Ayat 21-30', date: '2024-01-05', status: 'baik' },
    ],
    notes: [
      { id: 1, date: '2024-01-15', content: 'Ahmad menunjukkan kemajuan yang baik dalam hafalan.' },
      { id: 2, date: '2024-01-10', content: 'Perlu latihan tambahan untuk tajwid.' },
    ],
  },
  {
    id: 2,
    name: 'Fatimah Zahra',
    full_name: 'Fatimah Zahra',
    role: 'student' as const,
    school_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
    class: 'Tahfidz Al-Baqarah',
    memorizedVerses: 180,
    totalVerses: 200,
    progress: 90,
    parentName: 'Ibu Zahra',
    parentPhone: '081234567891',
    joinDate: '2023-09-01',
    memorizations: [
      { id: 4, range: 'Ayat 1-15', date: '2024-01-14', status: 'baik', note: 'Sangat baik' },
    ],
    notes: [
      { id: 3, date: '2024-01-14', content: 'Fatimah adalah siswa yang sangat rajin.' },
    ],
  },
];

export default function StudentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const studentId = convertStringToNumber(id || '0');
  
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('hafalan');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemoRange, setNewMemoRange] = useState('');
  const [newMemoDate, setNewMemoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMemoNote, setNewMemoNote] = useState('');
  const [newNote, setNewNote] = useState('');
  
  // Fetch student data
  useEffect(() => {
    const foundStudent = sampleStudents.find(s => s.id === studentId);
    if (foundStudent) {
      setStudent(foundStudent);
    }
  }, [studentId]);
  
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
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat data siswa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddMemorization = () => {
    if (!newMemoRange || !newMemoDate) {
      Alert.alert('Error', 'Mohon isi range dan tanggal hafalan');
      return;
    }

    const newMemorization: Memorization = {
      id: Date.now(),
      range: newMemoRange,
      date: newMemoDate,
      note: newMemoNote || undefined,
      status: 'baik',
    };

    setStudent(prev => prev ? {
      ...prev,
      memorizations: [newMemorization, ...prev.memorizations]
    } : null);

    setNewMemoRange('');
    setNewMemoDate(new Date().toISOString().split('T')[0]);
    setNewMemoNote('');
    setShowAddModal(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      Alert.alert('Error', 'Mohon isi catatan');
      return;
    }

    const note: Note = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      content: newNote,
    };

    setStudent(prev => prev ? {
      ...prev,
      notes: [note, ...prev.notes]
    } : null);

    setNewNote('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baik': return '#4CAF50';
      case 'cukup': return '#FF9800';
      case 'kurang': return '#f44336';
      default: return '#666666';
    }
  };

  const renderHafalanTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Riwayat Hafalan</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      
      {student.memorizations.map((memo) => (
        <View key={memo.id} style={styles.memorizationItem}>
          <View style={styles.memorizationHeader}>
            <Text style={styles.memorizationRange}>{memo.range}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(memo.status) }]}>
              <Text style={styles.statusText}>{memo.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.memorizationDate}>{new Date(memo.date).toLocaleDateString('id-ID')}</Text>
          {memo.note && <Text style={styles.memorizationNote}>{memo.note}</Text>}
        </View>
      ))}
    </View>
  );

  const renderCatatanTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.addNoteContainer}>
        <TextInput
          style={styles.noteInput}
          value={newNote}
          onChangeText={setNewNote}
          placeholder="Tambah catatan baru..."
          placeholderTextColor="#999999"
          multiline
        />
        <TouchableOpacity 
          style={styles.addNoteButton}
          onPress={handleAddNote}
        >
          <Ionicons name="send" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {student.notes.map((note) => (
        <View key={note.id} style={styles.noteItem}>
          <Text style={styles.noteDate}>{new Date(note.date).toLocaleDateString('id-ID')}</Text>
          <Text style={styles.noteContent}>{note.content}</Text>
        </View>
      ))}
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Siswa</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nama Lengkap</Text>
          <Text style={styles.infoValue}>{student.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Kelas</Text>
          <Text style={styles.infoValue}>{student.class}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Progress Hafalan</Text>
          <Text style={styles.infoValue}>{student.memorizedVerses}/{student.totalVerses} ayat ({student.progress || 0}%)</Text>
        </View>
        {student.parentName && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nama Orang Tua</Text>
            <Text style={styles.infoValue}>{student.parentName}</Text>
          </View>
        )}
        {student.parentPhone && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>No. Telepon Orang Tua</Text>
            <Text style={styles.infoValue}>{student.parentPhone}</Text>
          </View>
        )}
        {student.joinDate && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tanggal Bergabung</Text>
            <Text style={styles.infoValue}>{new Date(student.joinDate).toLocaleDateString('id-ID')}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const tabs = [
    { id: 'hafalan', label: 'Hafalan', icon: 'book-outline' },
    { id: 'catatan', label: 'Catatan', icon: 'document-text-outline' },
    { id: 'info', label: 'Info', icon: 'information-circle-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{student.name}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Student Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentInitial}>
            {student.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryName}>{student.name}</Text>
          <Text style={styles.summaryClass}>{student.class}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${student.progress || 0}%` }]} />
            </View>
            <Text style={styles.progressText}>{student.progress || 0}%</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.id ? '#005e7a' : '#666666'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'hafalan' && renderHafalanTab()}
        {activeTab === 'catatan' && renderCatatanTab()}
        {activeTab === 'info' && renderInfoTab()}
      </ScrollView>
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
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  studentAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#005e7a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  studentInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  summaryInfo: {
    flex: 1,
  },
  summaryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  summaryClass: {
    fontSize: 16,
    color: '#005e7a',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#005e7a',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  memorizationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  memorizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memorizationRange: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memorizationDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  memorizationNote: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    maxHeight: 100,
    marginRight: 12,
  },
  addNoteButton: {
    backgroundColor: '#005e7a',
    borderRadius: 20,
    padding: 8,
  },
  noteItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  noteDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
});
