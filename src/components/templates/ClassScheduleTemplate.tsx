import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { mockClassData, ClassData as MockClassData, ClassScheduleItem } from '../../mocks/classData';

// No longer needed as we're using numeric UUID conversion

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function ClassSchedule() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = parseInt(id || '0');
  
  const [classData, setClassData] = useState<MockClassData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newNote, setNewNote] = useState('');
  
  // Fetch class data
  useEffect(() => {
    const foundClass = mockClassData.find(c => c.id === classId);
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
          <Text style={styles.loadingText}>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleAddSchedule = () => {
    // Trim whitespace from inputs
    const trimmedDay = newDay.trim();
    const trimmedTime = newTime.trim();
    const trimmedActivity = newActivity.trim();
    const trimmedNote = newNote ? newNote.trim() : newNote;

    // Validate empty inputs
    if (!trimmedDay || !trimmedTime || !trimmedActivity) {
      Alert.alert('Error', 'Mohon isi hari, waktu, dan aktivitas');
      return;
    }

    // Validate time format (HH:mm or H:mm)
    const timeRegex = /^(0?[1-9]|1[0-9]|2[0-4]):([0-5][0-9])$/;
    if (!timeRegex.test(trimmedTime)) {
      Alert.alert('Error', 'Format waktu tidak valid. Mohon gunakan format HH:mm (contoh: 09:30 atau 14:15)');
      return;
    }

    const newScheduleItem: ClassScheduleItem = {
      id: parseInt(uuidv4().replace(/-/g, '').substring(0, 8), 16),
      day: trimmedDay,
      time: trimmedTime,
      activity: trimmedActivity,
      note: trimmedNote || undefined,
    };

    setClassData(prev => prev ? {
      ...prev,
      schedule: [...(prev.schedule || []), newScheduleItem]
    } : null);

    // Reset form
    setNewDay('');
    setNewTime('');
    setNewActivity('');
    setNewNote('');
    setShowAddModal(false);
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    Alert.alert(
      'Hapus Jadwal',
      'Apakah Anda yakin ingin menghapus jadwal ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setClassData(prev => prev ? {
              ...prev,
              schedule: (prev.schedule || []).filter(item => item.id !== scheduleId)
            } : null);
          }
        }
      ]
    );
  };

  const renderScheduleItem = ({ item }: { item: ClassScheduleItem }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View style={styles.dayBadge}>
          <Text style={styles.dayText}>{item.day}</Text>
        </View>
        <View style={styles.scheduleInfo}>
          <Text style={styles.timeText}>{item.time}</Text>
          <Text style={styles.activityText}>{item.activity}</Text>
          {item.note && <Text style={styles.noteText}>{item.note}</Text>}
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => item.id && handleDeleteSchedule(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const groupedSchedule = daysOfWeek.map(day => ({
    day,
    items: (classData.schedule || []).filter(item => item.day === day)
  })).filter(group => group.items.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jadwal - {classData.name}</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="#005e7a" />
        </TouchableOpacity>
      </View>

      {/* Schedule List */}
      {groupedSchedule.length > 0 ? (
        <FlatList
          data={classData.schedule || []}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id?.toString() || `${item.day}-${item.time}-${item.activity}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyStateTitle}>Belum ada jadwal</Text>
          <Text style={styles.emptyStateMessage}>
            Tambahkan jadwal pertama untuk kelas ini
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.emptyStateButtonText}>Tambah Jadwal</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Schedule Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Jadwal Baru</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hari *</Text>
                <View style={styles.daySelector}>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayOption,
                        newDay === day && styles.selectedDayOption
                      ]}
                      onPress={() => setNewDay(day)}
                    >
                      <Text style={[
                        styles.dayOptionText,
                        newDay === day && styles.selectedDayOptionText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Waktu *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTime}
                  onChangeText={setNewTime}
                  placeholder="Contoh: 08:00 - 10:00"
                  placeholderTextColor="#999999"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Aktivitas *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newActivity}
                  onChangeText={setNewActivity}
                  placeholder="Contoh: Hafalan Baru"
                  placeholderTextColor="#999999"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Catatan</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newNote}
                  onChangeText={setNewNote}
                  placeholder="Catatan tambahan..."
                  placeholderTextColor="#999999"
                  multiline
                  numberOfLines={3}
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
  listContainer: {
    padding: 20,
  },
  scheduleCard: {
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
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayBadge: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  dayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scheduleInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff5f5',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  selectedDayOption: {
    backgroundColor: '#005e7a',
    borderColor: '#005e7a',
  },
  dayOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedDayOptionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#005e7a',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
