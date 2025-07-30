import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { mockClassData, MockClassViewData as ClassData, Report } from '../../mocks/classData';
import { convertStringToNumber } from '@lib/utils';

// Types
type ReportType = 'academic' | 'behavior' | 'attendance';

const reportTypes = [
  { value: 'academic', label: 'Akademik', icon: 'school' },
  { value: 'behavior', label: 'Perilaku', icon: 'people' },
  { value: 'attendance', label: 'Kehadiran', icon: 'checkmark-circle' },
];

export default function ClassReports() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = convertStringToNumber(id || '0');
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReportType>('academic');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDescription, setNewDescription] = useState('');
  const [filterType, setFilterType] = useState<ReportType | 'all'>('all');
  
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
          <Text style={styles.headerTitle}>Laporan Kelas</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const isValidDate = (dateString: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleAddReport = () => {
    if (!newTitle || !newDate) {
      Alert.alert('Error', 'Mohon isi judul dan tanggal laporan');
      return;
    }

    if (!isValidDate(newDate)) {
      Alert.alert('Error', 'Tanggal harus dalam format YYYY-MM-DD dan merupakan tanggal yang valid');
      return;
    }

    const newReport: Report = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      date: newDate,
      description: newDescription,
      status: 'draft',
    };

    setClassData(prev => prev ? {
      ...prev,
      reports: [newReport, ...(prev.reports || [])]
    } : null);

    // Reset form
    setNewTitle('');
    setNewType('academic');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewDescription('');
    setShowAddModal(false);
  };

  const handleDeleteReport = (reportId: number) => {
    Alert.alert(
      'Hapus Laporan',
      'Apakah Anda yakin ingin menghapus laporan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setClassData(prev => prev ? {
              ...prev,
              reports: (prev.reports || []).filter(report => report.id !== reportId)
            } : null);
          }
        }
      ]
    );
  };

  const toggleReportStatus = (reportId: number) => {
    setClassData(prev => prev ? {
      ...prev,
      reports: (prev.reports || []).map(report => 
        report.id === reportId 
          ? { ...report, status: report.status === 'draft' ? 'published' : 'draft' }
          : report
      )
    } : null);
  };

  const filteredReports = filterType === 'all' 
    ? (classData?.reports || []) 
    : (classData?.reports || []).filter(report => report.type === filterType);

  const getReportTypeInfo = (type: ReportType) => {
    return reportTypes.find(rt => rt.value === type) || reportTypes[0];
  };

  const renderReportItem = ({ item }: { item: Report }) => {
    const typeInfo = getReportTypeInfo(item.type);
    
    return (
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={styles.reportTypeContainer}>
            <View style={[styles.typeBadge, { backgroundColor: item.status === 'published' ? '#4CAF50' : '#FF9800' }]}>
              <Ionicons name={typeInfo.icon as any} size={16} color="#ffffff" />
              <Text style={styles.typeBadgeText}>{typeInfo.label}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'published' ? '#e8f5e8' : '#fff3e0' }]}>
              <Text style={[styles.statusText, { color: item.status === 'published' ? '#4CAF50' : '#FF9800' }]}>
                {item.status === 'published' ? 'Dipublikasi' : 'Draft'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => handleDeleteReport(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.reportDate}>{new Date(item.date).toLocaleDateString('id-ID')}</Text>
        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.reportActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Handle edit
            }}
          >
            <Ionicons name="create-outline" size={16} color="#005e7a" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleReportStatus(item.id)}
          >
            <Ionicons 
              name={item.status === 'published' ? 'eye-off-outline' : 'eye-outline'} 
              size={16} 
              color="#005e7a" 
            />
            <Text style={styles.actionButtonText}>
              {item.status === 'published' ? 'Unpublish' : 'Publish'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Handle share
            }}
          >
            <Ionicons name="share-outline" size={16} color="#005e7a" />
            <Text style={styles.actionButtonText}>Bagikan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan - {classData.name}</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="#005e7a" />
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilterButton]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterButtonText, filterType === 'all' && styles.activeFilterButtonText]}>
            Semua
          </Text>
        </TouchableOpacity>
        {reportTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[styles.filterButton, filterType === type.value && styles.activeFilterButton]}
            onPress={() => setFilterType(type.value as ReportType)}
          >
            <Text style={[styles.filterButtonText, filterType === type.value && styles.activeFilterButtonText]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reports List */}
      {(filteredReports || []).length > 0 ? (
        <FlatList
          data={filteredReports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyStateTitle}>
            {filterType === 'all' ? 'Belum ada laporan' : `Belum ada laporan ${getReportTypeInfo(filterType as ReportType).label.toLowerCase()}`}
          </Text>
          <Text style={styles.emptyStateMessage}>
            Buat laporan pertama untuk kelas ini
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.emptyStateButtonText}>Buat Laporan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Report Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buat Laporan Baru</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Judul Laporan *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="Contoh: Laporan Bulanan Februari 2024"
                  placeholderTextColor="#999999"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Jenis Laporan *</Text>
                <View style={styles.typeSelector}>
                  {reportTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        newType === type.value && styles.selectedTypeOption
                      ]}
                      onPress={() => setNewType(type.value as ReportType)}
                    >
                      <Ionicons 
                        name={type.icon as any} 
                        size={20} 
                        color={newType === type.value ? '#ffffff' : '#005e7a'} 
                      />
                      <Text style={[
                        styles.typeOptionText,
                        newType === type.value && styles.selectedTypeOptionText
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tanggal *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newDate}
                  onChangeText={setNewDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999999"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Deskripsi</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newDescription}
                  onChangeText={setNewDescription}
                  placeholder="Deskripsi laporan..."
                  placeholderTextColor="#999999"
                  multiline
                  numberOfLines={4}
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
                onPress={handleAddReport}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#005e7a',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  activeFilterButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#005e7a',
    marginLeft: 4,
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
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#005e7a',
    backgroundColor: '#ffffff',
  },
  selectedTypeOption: {
    backgroundColor: '#005e7a',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#005e7a',
    marginLeft: 6,
  },
  selectedTypeOptionText: {
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
