import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ClassReports() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = parseInt(id || '0');
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReportType>('monthly');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDescription, setNewDescription] = useState('');
  
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
          <Text style={styles.headerTitle}>Laporan Kelas</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleAddReport = () => {
    if (!newTitle || !newDate) {
      alert('Mohon isi judul dan tanggal laporan');
      return;
    }
    
    // In a real app, this would be an API call
    const newReportItem: Report = {
      id: (classData.reports?.length || 0) + 1,
      title: newTitle,
      type: newType,
      date: newDate,
      description: newDescription || undefined,
    };
    
    const updatedReports = [...(classData.reports || []), newReportItem];
    const updatedClass = {
      ...classData,
      reports: updatedReports,
    };
    
    setClassData(updatedClass);
    setShowAddModal(false);
    setNewTitle('');
    setNewType('monthly');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewDescription('');
  };
  
  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'daily':
        return 'today';
      case 'weekly':
        return 'calendar';
      case 'monthly':
        return 'calendar-number';
      case 'semester':
        return 'school';
      default:
        return 'document-text';
    }
  };
  
  const getReportTypeColor = (type: ReportType) => {
    switch (type) {
      case 'daily':
        return '#4caf50';
      case 'weekly':
        return '#2196f3';
      case 'monthly':
        return '#f0c75e';
      case 'semester':
        return '#9c27b0';
      default:
        return '#005e7a';
    }
  };
  
  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case 'daily':
        return 'Harian';
      case 'weekly':
        return 'Mingguan';
      case 'monthly':
        return 'Bulanan';
      case 'semester':
        return 'Semester';
      default:
        return 'Lainnya';
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Kelas</Text>
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
      
      {/* Reports Header */}
      <View style={styles.reportsHeader}>
        <Text style={styles.reportsTitle}>Laporan Kelas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      
      {/* Reports List */}
      {classData.reports && classData.reports.length > 0 ? (
        <FlatList
          data={classData.reports}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.reportItem}
              onPress={() => {
                // In a real app, this would navigate to report detail
                alert(`Melihat detail laporan: ${item.title}`);
              }}
            >
              <View 
                style={[
                  styles.reportIcon,
                  { backgroundColor: getReportTypeColor(item.type) }
                ]}
              >
                <Ionicons 
                  name={getReportTypeIcon(item.type)} 
                  size={24} 
                  color="#ffffff" 
                />
              </View>
              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>{item.title}</Text>
                <View style={styles.reportMeta}>
                  <View style={styles.reportType}>
                    <Text style={styles.reportTypeText}>
                      {getReportTypeLabel(item.type)}
                    </Text>
                  </View>
                  <Text style={styles.reportDate}>{item.date}</Text>
                </View>
                {item.description && (
                  <Text style={styles.reportDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={50} color="#cccccc" />
          <Text style={styles.emptyText}>Belum ada laporan untuk kelas ini</Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.emptyButtonText}>Buat Laporan Baru</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Add Report Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buat Laporan Baru</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Judul Laporan <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan judul laporan"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Jenis Laporan</Text>
                <View style={styles.reportTypeSelector}>
                  <TouchableOpacity 
                    style={[
                      styles.reportTypeOption,
                      newType === 'daily' && styles.reportTypeOptionSelected
                    ]}
                    onPress={() => setNewType('daily')}
                  >
                    <Text 
                      style={[
                        styles.reportTypeOptionText,
                        newType === 'daily' && styles.reportTypeOptionTextSelected
                      ]}
                    >
                      Harian
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.reportTypeOption,
                      newType === 'weekly' && styles.reportTypeOptionSelected
                    ]}
                    onPress={() => setNewType('weekly')}
                  >
                    <Text 
                      style={[
                        styles.reportTypeOptionText,
                        newType === 'weekly' && styles.reportTypeOptionTextSelected
                      ]}
                    >
                      Mingguan
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.reportTypeOption,
                      newType === 'monthly' && styles.reportTypeOptionSelected
                    ]}
                    onPress={() => setNewType('monthly')}
                  >
                    <Text 
                      style={[
                        styles.reportTypeOptionText,
                        newType === 'monthly' && styles.reportTypeOptionTextSelected
                      ]}
                    >
                      Bulanan
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.reportTypeOption,
                      newType === 'semester' && styles.reportTypeOptionSelected
                    ]}
                    onPress={() => setNewType('semester')}
                  >
                    <Text 
                      style={[
                        styles.reportTypeOptionText,
                        newType === 'semester' && styles.reportTypeOptionTextSelected
                      ]}
                    >
                      Semester
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tanggal <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={newDate}
                  onChangeText={setNewDate}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Deskripsi (Opsional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tambahkan deskripsi laporan..."
                  value={newDescription}
                  onChangeText={setNewDescription}
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

// Types
type ReportType = 'daily' | 'weekly' | 'monthly' | 'semester' | 'other';

interface Report {
  id: number;
  title: string;
  type: ReportType;
  date: string;
  description?: string;
}

interface ClassData {
  id: number;
  name: string;
  level: string;
  description?: string;
  studentCount: number;
  progress: number;
  reports?: Report[];
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
    reports: [
      {
        id: 1,
        title: 'Laporan Bulanan Maret 2025',
        type: 'monthly',
        date: '2025-03-31',
        description: 'Laporan perkembangan hafalan siswa selama bulan Maret 2025. Mencakup pencapaian target hafalan dan evaluasi kualitas hafalan.',
      },
      {
        id: 2,
        title: 'Laporan Mingguan #10',
        type: 'weekly',
        date: '2025-03-07',
        description: 'Laporan kegiatan dan pencapaian hafalan siswa selama minggu ke-10.',
      },
      {
        id: 3,
        title: 'Laporan Harian 5 Maret',
        type: 'daily',
        date: '2025-03-05',
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
    reports: [],
  },
  {
    id: 3,
    name: 'Tahfidz Lanjutan',
    level: 'Lanjutan',
    description: 'Kelas untuk siswa yang telah menyelesaikan hafalan minimal 5 juz.',
    studentCount: 8,
    progress: 40,
    reports: [],
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
  reportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  reportsTitle: {
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
  reportItem: {
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
  reportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  reportDetails: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reportType: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  reportTypeText: {
    fontSize: 12,
    color: '#555555',
  },
  reportDate: {
    fontSize: 12,
    color: '#888888',
  },
  reportDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
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
  reportTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  reportTypeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginRight: 8,
    marginBottom: 8,
  },
  reportTypeOptionSelected: {
    backgroundColor: '#005e7a',
    borderColor: '#005e7a',
  },
  reportTypeOptionText: {
    fontSize: 14,
    color: '#555555',
  },
  reportTypeOptionTextSelected: {
    color: '#ffffff',
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