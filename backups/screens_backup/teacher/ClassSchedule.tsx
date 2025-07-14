import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ClassSchedule() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = parseInt(id || '0');
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newNote, setNewNote] = useState('');
  
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
          <Text style={styles.headerTitle}>Jadwal Kelas</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleAddSchedule = () => {
    if (!newDay || !newTime || !newActivity) {
      alert('Mohon isi hari, waktu, dan aktivitas');
      return;
    }
    
    // In a real app, this would be an API call
    const newScheduleItem: ScheduleItem = {
      day: newDay,
      time: newTime,
      activity: newActivity,
      note: newNote || undefined,
    };
    
    const updatedSchedule = [...(classData.schedule || []), newScheduleItem];
    const updatedClass = {
      ...classData,
      schedule: updatedSchedule,
    };
    
    setClassData(updatedClass);
    setShowAddModal(false);
    setNewDay('');
    setNewTime('');
    setNewActivity('');
    setNewNote('');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jadwal Kelas</Text>
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
      
      {/* Schedule Header */}
      <View style={styles.scheduleHeader}>
        <Text style={styles.scheduleTitle}>Jadwal Kelas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      
      {/* Schedule List */}
      {classData.schedule && classData.schedule.length > 0 ? (
        <FlatList
          data={classData.schedule}
          keyExtractor={(item, index) => `${item.day}-${index}`}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleDay}>
                <Text style={styles.scheduleDayText}>{item.day}</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTime}>{item.time}</Text>
                <Text style={styles.scheduleActivity}>{item.activity}</Text>
                {item.note && (
                  <Text style={styles.scheduleNote}>{item.note}</Text>
                )}
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#888888" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={50} color="#cccccc" />
          <Text style={styles.emptyText}>Belum ada jadwal untuk kelas ini</Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.emptyButtonText}>Tambah Jadwal Baru</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Add Schedule Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Jadwal Baru</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Hari <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Senin, Selasa, dll."
                  value={newDay}
                  onChangeText={setNewDay}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Waktu <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: 08:00 - 10:00"
                  value={newTime}
                  onChangeText={setNewTime}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Aktivitas <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Setoran Hafalan, Muroja'ah, dll."
                  value={newActivity}
                  onChangeText={setNewActivity}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Catatan (Opsional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tambahkan catatan..."
                  value={newNote}
                  onChangeText={setNewNote}
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
                onPress={handleAddSchedule}
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
interface ScheduleItem {
  day: string;
  time: string;
  activity: string;
  note?: string;
}

interface ClassData {
  id: number;
  name: string;
  level: string;
  description?: string;
  studentCount: number;
  progress: number;
  schedule?: ScheduleItem[];
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
    schedule: [
      {
        day: 'Senin',
        time: '08:00 - 10:00',
        activity: 'Setoran Hafalan',
      },
      {
        day: 'Rabu',
        time: '08:00 - 10:00',
        activity: 'Muroja\'ah (Pengulangan)',
        note: 'Fokus pada juz yang telah dihafal sebelumnya',
      },
      {
        day: 'Jumat',
        time: '08:00 - 10:00',
        activity: 'Setoran Hafalan Baru',
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
    schedule: [],
  },
  {
    id: 3,
    name: 'Tahfidz Lanjutan',
    level: 'Lanjutan',
    description: 'Kelas untuk siswa yang telah menyelesaikan hafalan minimal 5 juz.',
    studentCount: 8,
    progress: 40,
    schedule: [],
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  scheduleTitle: {
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
  listContainer: {
    padding: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
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
  scheduleDay: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0c75e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scheduleDayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  scheduleActivity: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  scheduleNote: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
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
  requiredStar: {
    color: '#ff0000',
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