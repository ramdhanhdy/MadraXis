import { logger } from '../../utils/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubjectService, ClassSubject, Subject } from '@/src/services/subjectService';

interface SubjectManagerProps {
  classId: number;
  onSubjectCountChange?: (count: number) => void;
}

export default function SubjectManager({ classId, onSubjectCountChange }: SubjectManagerProps) {
  const [subjects, setSubjects] = useState<ClassSubject[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newGradingScale, setNewGradingScale] = useState<'points' | 'percentage' | 'standards'>('percentage');
  const [newStandardsAlignment, setNewStandardsAlignment] = useState('');
  const [editingSubject, setEditingSubject] = useState<ClassSubject | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const subjects = await SubjectService.getClassSubjects(classId);
      setSubjects(subjects);
      onSubjectCountChange?.(subjects.length || 0);
    } catch (error: unknown) {
      const context = error instanceof Error ? {
        operation: 'fetchSubjects',
        error: error.message,
        stack: error.stack
      } : {
        operation: 'fetchSubjects',
        error: 'Unknown error occurred'
      };
      logger.error('Error fetching subjects:', context);
    } finally {
      setLoading(false);
    }
  }, [classId, onSubjectCountChange]);

  const fetchAvailableSubjects = useCallback(async () => {
    try {
      const subjects = await SubjectService.getAvailableSubjects();
      setAvailableSubjects(subjects);
    } catch (error: unknown) {
      const context = error instanceof Error ? {
        operation: 'fetchAvailableSubjects',
        error: error.message,
        stack: error.stack
      } : {
        operation: 'fetchAvailableSubjects',
        error: 'Unknown error occurred'
      };
      logger.error('Error fetching available subjects:', context);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchAvailableSubjects();
  }, [fetchSubjects, fetchAvailableSubjects]);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) {
      Alert.alert('Error', 'Nama dan kode mata pelajaran wajib diisi');
      return;
    }

    try {
      await SubjectService.addSubjectToClass(classId, {
        subject_name: newSubjectName,
        subject_code: newSubjectCode,
        grading_scale: newGradingScale,
        standards_alignment: newStandardsAlignment
      });

      Alert.alert('Success', 'Mata pelajaran berhasil ditambahkan');
      setNewSubjectName('');
      setNewSubjectCode('');
      setNewGradingScale('percentage');
      setNewStandardsAlignment('');
      setShowAddModal(false);
      fetchSubjects();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan mata pelajaran';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject || !newSubjectName.trim() || !newSubjectCode.trim()) {
      Alert.alert('Error', 'Nama dan kode mata pelajaran wajib diisi');
      return;
    }

    try {
      await SubjectService.updateClassSubject(editingSubject.id, {
        subject_name: newSubjectName,
        subject_code: newSubjectCode,
        grading_scale: newGradingScale,
        standards_alignment: newStandardsAlignment
      });

      Alert.alert('Success', 'Mata pelajaran berhasil diperbarui');
      setEditingSubject(null);
      fetchSubjects();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui mata pelajaran';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    Alert.alert(
      'Hapus Mata Pelajaran',
      'Apakah Anda yakin ingin menghapus mata pelajaran ini?',
      [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await SubjectService.removeSubjectFromClass(subjectId);
            Alert.alert('Success', 'Mata pelajaran berhasil dihapus');
            fetchSubjects();
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus mata pelajaran';
            Alert.alert('Error', errorMessage);
          }
        }
      }]

    );
  };

  const handleAddFromAvailable = (availableSubject: Subject) => {
    setNewSubjectName(availableSubject.subject_name);
    setNewSubjectCode(availableSubject.subject_code || '');
    setNewGradingScale(availableSubject.grading_scale);
    setShowAddModal(true);
  };

  const handleEditSubject = (subject: ClassSubject) => {
    setEditingSubject(subject);
    setNewSubjectName(subject.subject_name);
    setNewSubjectCode(subject.subject_code || '');
    setNewGradingScale(subject.grading_scale);
    setNewStandardsAlignment(subject.standards_alignment || '');
  };

  const renderSubjectItem = ({ item }: {item: ClassSubject;}) =>
  <View style={styles.subjectItem}>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.subject_name}</Text>
        <Text style={styles.subjectCode}>{item.subject_code || 'N/A'}</Text>
        <Text style={styles.subjectDetails}>{`Skala: ${item.grading_scale}`}</Text>
        {item.standards_alignment &&
      <Text style={styles.subjectDetails}>{`Standar: ${item.standards_alignment}`}</Text>
      }
      </View>
      <View style={styles.subjectActions}>
        <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleEditSubject(item)}>
        
          <Ionicons name="create-outline" size={18} color="#005e7a" />
        </TouchableOpacity>
        <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDeleteSubject(item.id)}>
        
          <Ionicons name="trash-outline" size={18} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </View>;


  const renderEmptyState = () =>
  <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={48} color="#666666" />
      <Text style={styles.emptyTitle}>Belum ada mata pelajaran</Text>
      <Text style={styles.emptyDescription}>
        Tambahkan mata pelajaran untuk kelas ini
      </Text>
    </View>;


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mata Pelajaran ({subjects.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {loading ?
      <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
        </View> :

      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
        styles.listContainer,
        subjects.length === 0 && styles.emptyListContainer]
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState} />

      }

      {/* Add/Edit Subject Modal */}
      {(showAddModal || editingSubject) &&
      <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
            </Text>
            
            <TextInput
            style={styles.input}
            value={newSubjectName}
            onChangeText={setNewSubjectName}
            placeholder="Nama Mata Pelajaran" />
          
            
            <TextInput
            style={styles.input}
            value={newSubjectCode}
            onChangeText={setNewSubjectCode}
            placeholder="Kode Mata Pelajaran" />
          
            
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Skala Penilaian:</Text>
              <TouchableOpacity
              style={[styles.pickerOption, newGradingScale === 'percentage' && styles.pickerSelected]}
              onPress={() => setNewGradingScale('percentage')}>
              
                <Text style={[styles.pickerText, newGradingScale === 'percentage' && styles.pickerTextSelected]}>Persentase</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.pickerOption, newGradingScale === 'points' && styles.pickerSelected]}
              onPress={() => setNewGradingScale('points')}>
              
                <Text style={[styles.pickerText, newGradingScale === 'points' && styles.pickerTextSelected]}>Poin</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.pickerOption, newGradingScale === 'standards' && styles.pickerSelected]}
              onPress={() => setNewGradingScale('standards')}>
              
                <Text style={[styles.pickerText, newGradingScale === 'standards' && styles.pickerTextSelected]}>Standar</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
            style={styles.input}
            value={newStandardsAlignment}
            onChangeText={setNewStandardsAlignment}
            placeholder="Standar Penilaian (opsional)" />
          
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddModal(false);
                setEditingSubject(null);
                setNewSubjectName('');
                setNewSubjectCode('');
                setNewGradingScale('percentage');
                setNewStandardsAlignment('');
              }}>
              
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.saveButton}
              onPress={editingSubject ? handleUpdateSubject : handleAddSubject}>
              
                <Text style={styles.saveButtonText}>{editingSubject ? 'Update' : 'Simpan'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }

      {/* Available Subjects */}
      {!showAddModal && !editingSubject && availableSubjects.length > 0 &&
      <View style={styles.availableContainer}>
          <Text style={styles.availableTitle}>Mata Pelajaran Tersedia</Text>
          <FlatList
          data={availableSubjects}
          renderItem={({ item }) =>
          <TouchableOpacity
            style={styles.availableItem}
            onPress={() => handleAddFromAvailable(item)}>
            
                <Text style={styles.availableName}>{item.subject_name}</Text>
                <Text style={styles.availableCode}>{item.subject_code || 'N/A'}</Text>
              </TouchableOpacity>
          }
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.availableList} />
        
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    padding: 16
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8
  },
  subjectItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  subjectInfo: {
    flex: 1
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333'
  },
  subjectCode: {
    fontSize: 14,
    color: '#005e7a',
    fontWeight: '600'
  },
  subjectDetails: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  },
  subjectActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    padding: 8,
    borderRadius: 4
  },
  deleteButton: {
    backgroundColor: '#ff3b30'
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333333',
    marginRight: 12
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8
  },
  pickerSelected: {
    backgroundColor: '#005e7a',
    borderColor: '#005e7a'
  },
  pickerText: {
    fontSize: 14,
    color: '#333333'
  },
  pickerTextSelected: {
    color: '#ffffff'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666'
  },
  saveButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#005e7a',
    borderRadius: 8,
    marginLeft: 8
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  availableContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  availableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12
  },
  availableList: {
    paddingRight: 16
  },
  availableItem: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 100
  },
  availableName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#005e7a'
  },
  availableCode: {
    fontSize: 12,
    color: '#666666'
  }
});