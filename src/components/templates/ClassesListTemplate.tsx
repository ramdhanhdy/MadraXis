import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { ClassService } from '@/src/services/classService';
import { Class } from '@/src/types/class';
import { ClassWithDetails } from '@/src/services/classService';
import ClassFormModal from '@/src/components/organisms/ClassFormModal';



export default function ClassesList() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassWithDetails | null>(null);
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'student_count' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const classes = await ClassService.getTeacherClasses(user.id, {
          searchTerm: debouncedSearchQuery,
          status: filterStatus === 'all' ? undefined : filterStatus,
          sortBy,
        sortOrder,
        limit: 50,
        offset: 0
      });

      setClasses(classes);
    } catch (err) {
      setError('Failed to load classes');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  }, [user, debouncedSearchQuery, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleRefresh = useCallback(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleOpenAddModal = () => {
    if (!profile?.school_id) {
      Alert.alert('Error', 'School ID is required to create a class');
      return;
    }
    setEditingClass(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (classItem: Class) => {
    if (!profile?.school_id) {
      Alert.alert('Error', 'School ID is required to edit a class');
      return;
    }
    // Convert Class to ClassWithDetails by adding required properties
    const classWithDetails: ClassWithDetails = {
      ...classItem,
      teachers: [] // Initialize with empty array, will be populated by the modal if needed
    };
    setEditingClass(classWithDetails);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingClass(null);
  };

  const handleFormSuccess = () => {
    handleCloseModal();
    fetchClasses();
  };

  const toggleClassSelection = (classId: number) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const toggleBulkSelectionMode = () => {
    setBulkSelectionMode(!bulkSelectionMode);
    setSelectedClasses([]);
  };

  const handleBulkDelete = async () => {
    if (selectedClasses.length === 0) return;

    Alert.alert(
      'Delete Classes',
      `Are you sure you want to delete ${selectedClasses.length} class(es)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.id) {
                Alert.alert('Error', 'User not authenticated');
                return;
              }
              setLoading(true);
              await ClassService.bulkDeleteClasses(selectedClasses, user.id);
              setSelectedClasses([]);
              setBulkSelectionMode(false);
              fetchClasses();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete classes');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleBulkUpdateStatus = async (status: 'active' | 'inactive' | 'archived') => {
    if (selectedClasses.length === 0) return;

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setLoading(true);
      await ClassService.bulkUpdateClasses({
        class_ids: selectedClasses,
        updates: { status }
      }, user.id);
      setSelectedClasses([]);
      setBulkSelectionMode(false);
      fetchClasses();
    } catch (error) {
      Alert.alert('Error', 'Failed to update classes');
    } finally {
      setLoading(false);
    }
  };

  const renderClassItem = ({ item }: { item: ClassWithDetails }) => (
    <TouchableOpacity 
      style={[
        styles.classCard,
        selectedClasses.includes(item.id) && styles.selectedCard,
        item.status === 'archived' && styles.archivedCard
      ]}
      onPress={() => {
        if (bulkSelectionMode) {
          toggleClassSelection(item.id);
        } else {
          router.push({
            pathname: '/(teacher)/class/[id]',
            params: { id: item.id }
          });
        }
      }}
      onLongPress={() => {
        if (!bulkSelectionMode) {
          setBulkSelectionMode(true);
          toggleClassSelection(item.id);
        }
      }}
    >
      {bulkSelectionMode && (
        <View style={styles.checkboxContainer}>
          <Ionicons 
            name={selectedClasses.includes(item.id) ? "checkbox" : "square-outline"} 
            size={24} 
            color="#005e7a" 
          />
        </View>
      )}
      
      <View style={styles.classHeader}>
        <View style={styles.classInfo}>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.classLevel}>{item.level}</Text>
          <Text style={styles.classDescription}>{item.description}</Text>
          <View style={styles.classMeta}>
            <Text style={[styles.statusBadge, styles[`status_${item.status}`]]}>
              {item.status}
            </Text>
            <Text style={styles.academicInfo}>
              {item.academic_year} - Semester {item.semester}
            </Text>
          </View>
        </View>
        <View style={styles.classStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color="#666666" />
            <Text style={styles.statText}>{item.student_count || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="book" size={16} color="#666666" />
            <Text style={styles.statText}>{item.subject_count || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="person" size={16} color="#666666" />
            <Text style={styles.statText}>{item.teacher_count || 0}</Text>
          </View>
        </View>
      </View>
      <View style={styles.classActions}>
        <TouchableOpacity 
          style={[styles.actionButton, item.status === 'archived' && styles.disabledAction]}
          disabled={item.status === 'archived'}
          onPress={() => router.push({
            pathname: '/(teacher)/class/[id]/students',
            params: { id: item.id }
          })}
        >
          <Ionicons name="people" size={16} color={item.status === 'archived' ? '#ccc' : '#005e7a'} />
          <Text style={[styles.actionText, item.status === 'archived' && styles.disabledActionText]}>Siswa</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, item.status === 'archived' && styles.disabledAction]}
          disabled={item.status === 'archived'}
          onPress={() => router.push({
            pathname: '/(teacher)/class/[id]',
            params: { id: item.id, tab: 'subjects' }
          })}
        >
          <Ionicons name="book" size={16} color={item.status === 'archived' ? '#ccc' : '#005e7a'} />
          <Text style={[styles.actionText, item.status === 'archived' && styles.disabledActionText]}>Mata Pelajaran</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, item.status === 'archived' && styles.disabledAction]}
          disabled={item.status === 'archived'}
          onPress={() => router.push({
            pathname: '/(teacher)/class/[id]',
            params: { id: item.id, tab: 'reports' }
          })}
        >
          <Ionicons name="document-text" size={16} color={item.status === 'archived' ? '#ccc' : '#005e7a'} />
          <Text style={[styles.actionText, item.status === 'archived' && styles.disabledActionText]}>Laporan</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="school" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Tidak ada kelas</Text>
      <Text style={styles.emptyDescription}>
        {error || 'Belum ada kelas yang dibuat. Tambahkan kelas baru untuk memulai.'}
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => setShowAddModal(true)}>
        <Text style={styles.emptyButtonText}>Tambah Kelas Baru</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, bulkSelectionMode && styles.bulkHeader]}>
        <TouchableOpacity onPress={() => {
          if (bulkSelectionMode) {
            setBulkSelectionMode(false);
            setSelectedClasses([]);
          } else {
            router.back();
          }
        }}>
          <Ionicons name={bulkSelectionMode ? "close" : "arrow-back"} size={24} color="#333333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {bulkSelectionMode ? `${selectedClasses.length} selected` : "Daftar Kelas"}
        </Text>
        
        <View style={styles.headerActions}>
          {bulkSelectionMode ? (
            <View style={styles.bulkActions}>
              <TouchableOpacity onPress={handleBulkDelete}>
                <Ionicons name="trash" size={24} color="#ff3b30" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleBulkUpdateStatus('archived')}>
                <Ionicons name="archive" size={24} color="#ff9500" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleBulkSelectionMode}>
                <Ionicons name="checkbox" size={24} color="#005e7a" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenAddModal}>
                <Ionicons name="add" size={24} color="#005e7a" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kelas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color="#005e7a" />
        </TouchableOpacity>
      </View>

      {/* Classes List */}
      <FlatList
        data={classes}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          classes.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.filterOptions}>
                {['all', 'active', 'inactive', 'archived'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      filterStatus === status && styles.selectedFilterOption
                    ]}
                    onPress={() => setFilterStatus(status as 'all' | 'active' | 'inactive' | 'archived')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filterStatus === status && styles.selectedFilterOptionText
                    ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Sort By</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'level', label: 'Level' },
                  { key: 'student_count', label: 'Student Count' },
                  { key: 'created_at', label: 'Created Date' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      sortBy === option.key && styles.selectedFilterOption
                    ]}
                    onPress={() => setSortBy(option.key as 'name' | 'level' | 'student_count' | 'created_at')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      sortBy === option.key && styles.selectedFilterOptionText
                    ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Sort Order</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'asc', label: 'Ascending' },
                  { key: 'desc', label: 'Descending' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      sortOrder === option.key && styles.selectedFilterOption
                    ]}
                    onPress={() => setSortOrder(option.key as 'asc' | 'desc')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      sortOrder === option.key && styles.selectedFilterOptionText
                    ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => {
                  setShowFilterModal(false);
                  fetchClasses();
                }}
              >
                <Text style={styles.saveButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ClassFormModal
        visible={showAddModal}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
        classData={editingClass}
        schoolId={profile?.school_id || 1}
      />
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  classCard: {
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
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  classInfo: {
    flex: 1,
    marginRight: 16,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  classLevel: {
    fontSize: 14,
    color: '#005e7a',
    fontWeight: '600',
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  classStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  progressContainer: {
    alignItems: 'flex-end',
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
  },
  classActions: {
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
  actionText: {
    fontSize: 14,
    color: '#005e7a',
    marginLeft: 4,
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
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  bulkHeader: {
    backgroundColor: '#f0f8ff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bulkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkboxContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  selectedCard: {
    borderColor: '#005e7a',
    borderWidth: 2,
  },
  archivedCard: {
    opacity: 0.7,
  },
  classMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  status_active: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  status_inactive: {
    backgroundColor: '#fff3e0',
    color: '#f57c00',
  },
  status_archived: {
    backgroundColor: '#f5f5f5',
    color: '#666666',
  },
  academicInfo: {
    fontSize: 12,
    color: '#666666',
  },
  disabledAction: {
    opacity: 0.5,
  },
  disabledActionText: {
    color: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  sectionSpacing: {
    marginTop: 24,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  selectedFilterOption: {
    backgroundColor: '#005e7a',
    borderColor: '#005e7a',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedFilterOptionText: {
    color: '#ffffff',
  },
});
