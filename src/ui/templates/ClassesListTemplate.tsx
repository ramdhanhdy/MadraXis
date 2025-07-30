import { logger } from '@lib/utils/logger';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@lib/hooks/useAuth';
import { useSafeToQuery } from '@lib/utils/navigationGuard';
import { ClassService, ClassWithDetails } from '@domains/class';
import { Class } from '@/src/types/class';
import ClassFormModal from '@ui/organisms/ClassFormModal';
import { useStudentCountSubscription } from '@lib/hooks/useStudentCountSubscription';
import { useClassStudentBreakdown } from '@lib/hooks/useClassStudentBreakdown';



export default function ClassesList() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const isSafeToQuery = useSafeToQuery();
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

  // Get class IDs for real-time subscriptions
  const classIds = useMemo(() => classes.map((c) => c.id), [classes]);

  // Real-time student count subscription
  const { counts: realTimeCounts, loading: countsLoading } = useStudentCountSubscription({
    classIds,
    enabled: classes.length > 0
  });

  // Real-time student breakdown (boarding vs day students)
  const { breakdowns: studentBreakdowns, loading: breakdownLoading } = useClassStudentBreakdown({
    classIds,
    enabled: classes.length > 0
  });

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

    if (!isSafeToQuery) {
      logger.debug('Skipping classes fetch - navigation in progress');
      setLoading(false); // Ensure loading state is reset
      return;
    }

    logger.debug('User profile:', { userId: user.id, profile, schoolId: profile?.school_id });

    try {
      setLoading(true);
      setError(null);

      logger.debug('Fetching classes for user', { userId: user.id });
      const { classes } = await ClassService.getClasses(user.id, {
        searchTerm: debouncedSearchQuery,
        status: filterStatus === 'all' ? undefined : filterStatus,
        sortBy,
        sortOrder,
        limit: 50,
        offset: 0
      });

      logger.debug('Classes received:', {
        count: classes.length,
        classes: classes.map((c) => ({ id: c.id, name: c.name }))
      });

      setClasses(classes);
    } catch (err) {
      setError('Failed to load classes');
      logger.error('Error fetching classes', { userId: user?.id, error: err instanceof Error ? err.message : String(err) });
    } finally {
      setLoading(false);
    }
  }, [user, profile, debouncedSearchQuery, filterStatus, sortBy, sortOrder, isSafeToQuery]);

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

  // const handleOpenEditModal = (classItem: Class) => {
  //   if (!profile?.school_id) {
  //     Alert.alert('Error', 'School ID is required to edit a class');
  //     return;
  //   }
  //   // Convert Class to ClassWithDetails by adding required properties
  //   const classWithDetails: ClassWithDetails = {
  //     ...classItem,
  //     teachers: [] // Initialize with empty array, will be populated by the modal if needed
  //   };
  //   setEditingClass(classWithDetails);
  //   setShowAddModal(true);
  // };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingClass(null);
  };

  const handleFormSuccess = () => {
    handleCloseModal();
    fetchClasses();
  };

  const toggleClassSelection = (classId: number) => {
    setSelectedClasses((prev) =>
    prev.includes(classId) ?
    prev.filter((id) => id !== classId) :
    [...prev, classId]
    );
  };

  // Helper function to determine enrollment status
  const getEnrollmentStatus = (studentCount: number, capacity: number): 'empty' | 'partial' | 'full' => {
    const percentage = studentCount / capacity * 100;
    if (percentage < 10) return 'empty';
    if (percentage > 90) return 'full';
    return 'partial';
  };

  // Helper function to get progress bar color
  const getProgressColor = (percentage: number): string => {
    if (percentage < 30) return '#4CAF50'; // Green
    if (percentage < 70) return '#FF9800'; // Orange
    if (percentage < 90) return '#FF5722'; // Red-orange
    return '#F44336'; // Red
  };

  // Helper function to get status badge styles
  const getStatusBadgeStyle = (status: 'empty' | 'partial' | 'full') => {
    switch (status) {
      case 'empty':
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'partial':
        return { backgroundColor: '#fff3e0', color: '#f57c00' };
      case 'full':
        return { backgroundColor: '#ffebee', color: '#d32f2f' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666666' };
    }
  };

  // const toggleBulkSelectionMode = () => {
  //   setBulkSelectionMode(!bulkSelectionMode);
  //   setSelectedClasses([]);
  // };

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
            logger.error('Failed to delete classes', { error, selectedClasses, userId: user?.id });
            Alert.alert('Error', 'Failed to delete classes');
          } finally {
            setLoading(false);
          }
        }
      }]

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
      logger.error('Failed to update classes', { error, selectedClasses, status, userId: user?.id });
      Alert.alert('Error', 'Failed to update classes');
    } finally {
      setLoading(false);
    }
  };

  const EnhancedClassCard = React.memo(({ item }: {item: ClassWithDetails;}) => {
    // Use real-time counts if available, fallback to cached data
    const realTimeCount = realTimeCounts[item.id] ?? item.student_count;
    const breakdown = studentBreakdowns[item.id];

    const enrollmentStatus = getEnrollmentStatus(realTimeCount, item.student_capacity);
    const capacityPercentage = Math.min(realTimeCount / item.student_capacity * 100, 100);
    const progressColor = getProgressColor(capacityPercentage);

    return (
      <TouchableOpacity
        style={[
        styles.classCard,
        selectedClasses.includes(item.id) && styles.selectedCard,
        item.status === 'archived' && styles.archivedCard]
        }
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
        }}>
        
        {bulkSelectionMode &&
        <View style={styles.checkboxContainer}>
            <Ionicons
            name={selectedClasses.includes(item.id) ? "checkbox" : "square-outline"}
            size={24}
            color="#005e7a" />
          
          </View>
        }
        
        <View style={styles.classHeader}>
          <View style={styles.classInfo}>
            <View style={styles.classTitleRow}>
              <Text style={styles.className}>{item.name}</Text>
              <View style={[styles.enrollmentBadge, getStatusBadgeStyle(enrollmentStatus)]}>
                <Text style={[styles.enrollmentBadgeText, getStatusBadgeStyle(enrollmentStatus)]}>
                  {enrollmentStatus === 'empty' && 'Kosong'}
                  {enrollmentStatus === 'partial' && 'Isi'}
                  {enrollmentStatus === 'full' && 'Penuh'}
                </Text>
              </View>
            </View>
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
        </View>

        {/* Progress Bar for Capacity */}
        <View style={styles.capacitySection}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>Kapasitas</Text>
            <Text style={styles.capacityCount}>
              {countsLoading || breakdownLoading ?
              <ActivityIndicator size="small" color="#666" /> :

              `${realTimeCount}/${item.student_capacity} siswa`
              }
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: '#e0e0e0' }]}>
              <View
                style={[styles.progressFill, {
                  width: `${capacityPercentage}%`,
                  backgroundColor: progressColor
                }]} />
              
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round(capacityPercentage)}%
            </Text>
          </View>
        </View>

        {/* Boarding vs Day Student Breakdown */}
        {breakdown &&
        <View style={styles.breakdownSection}>
            <View style={styles.breakdownItem}>
              <Ionicons name="home" size={14} color="#4CAF50" />
              <Text style={styles.breakdownText}>
                Day: {breakdown.dayStudents}
              </Text>
            </View>
            <View style={styles.breakdownItem}>
              <Ionicons name="bed" size={14} color="#FF9800" />
              <Text style={styles.breakdownText}>
                Boarding: {breakdown.boardingStudents}
              </Text>
            </View>
          </View>
        }

        <View style={styles.classActions}>
          <TouchableOpacity
            style={[styles.actionButton, item.status === 'archived' && styles.disabledAction]}
            disabled={item.status === 'archived'}
            onPress={() => router.push({
              pathname: '/(teacher)/class/[id]/students',
              params: { id: item.id }
            })}>
            
            <Ionicons name="people" size={16} color={item.status === 'archived' ? '#ccc' : '#005e7a'} />
            <Text style={[styles.actionText, item.status === 'archived' && styles.disabledActionText]}>Siswa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, item.status === 'archived' && styles.disabledAction]}
            disabled={item.status === 'archived'}
            onPress={() => router.push({
              pathname: '/(teacher)/class/[id]',
              params: { id: item.id, tab: 'subjects' }
            })}>
            
            <Ionicons name="book" size={16} color={item.status === 'archived' ? '#ccc' : '#005e7a'} />
            <Text style={[styles.actionText, item.status === 'archived' && styles.disabledActionText]}>Mata Pelajaran</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, item.status === 'archived' && styles.disabledAction]}
            disabled={item.status === 'archived'}
            onPress={() => router.push({
              pathname: '/(teacher)/class/[id]',
              params: { id: item.id, tab: 'reports' }
            })}>
            
            <Ionicons name="document-text" size={16} color={item.status === 'archived' ? '#ccc' : '#005e7a'} />
            <Text style={[styles.actionText, item.status === 'archived' && styles.disabledActionText]}>Laporan</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>);

  });

  EnhancedClassCard.displayName = 'EnhancedClassCard';

  const renderClassItem = ({ item }: {item: ClassWithDetails;}) =>
  <EnhancedClassCard item={item} />;


  const renderEmptyState = () =>
  <View style={styles.emptyListContainer}>
      <Ionicons name="school" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Tidak ada kelas</Text>
      <Text style={styles.emptyDescription}>
        {error || 'Belum ada kelas yang dibuat. Tambahkan kelas baru untuk memulai.'}
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => setShowAddModal(true)}>
        <Text style={styles.emptyButtonText}>Tambah Kelas Baru</Text>
      </TouchableOpacity>
    </View>;


  const renderLoadingState = () =>
  <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color="#005e7a" />
      <Text style={[styles.emptyDescription, { marginTop: 16 }]}>
        Memuat daftar kelas...
      </Text>
    </View>;


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {loading && classes.length === 0 ?
      renderLoadingState() :

      <>
          {/* Header */}
          <View style={[styles.header, bulkSelectionMode && styles.bulkHeader]}>
            <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
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
              {bulkSelectionMode ? `${selectedClasses.length} dipilih` : "Daftar Kelas"}
            </Text>
            
            <View style={styles.headerActions}>
              {bulkSelectionMode ?
            <View style={styles.bulkActions}>
                  <TouchableOpacity
                style={styles.bulkActionButton}
                onPress={handleBulkDelete}
                disabled={selectedClasses.length === 0}>
                
                    <Ionicons name="trash" size={20} color={selectedClasses.length === 0 ? "#ccc" : "#ff3b30"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                style={styles.bulkActionButton}
                onPress={() => handleBulkUpdateStatus('archived')}
                disabled={selectedClasses.length === 0}>
                
                    <Ionicons name="archive" size={20} color={selectedClasses.length === 0 ? "#ccc" : "#ff9500"} />
                  </TouchableOpacity>
                </View> :

            <View style={styles.headerActions}>
                  <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowFilterModal(true)}>
                
                    <Ionicons name="filter" size={20} color="#005e7a" />
                    {(filterStatus !== 'all' || sortBy !== 'name' || sortOrder !== 'asc') &&
                <View style={styles.filterIndicator} />
                }
                  </TouchableOpacity>
                  <TouchableOpacity
                style={styles.headerButton}
                onPress={handleOpenAddModal}>
                
                    <Ionicons name="add" size={24} color="#005e7a" />
                  </TouchableOpacity>
                </View>
            }
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
                <TextInput
                style={styles.searchInput}
                placeholder="Cari nama kelas atau tingkat..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#8E8E93"
                returnKeyType="search"
                clearButtonMode="while-editing" />
              
                {searchQuery.length > 0 &&
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}>
                
                    <Ionicons name="close-circle" size={20} color="#8E8E93" />
                  </TouchableOpacity>
              }
              </View>
            </View>
          </View>

      {/* Classes List */}
      <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
          styles.listContainer,
          classes.length === 0 && !loading && styles.emptyListContainer]
          }
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={handleRefresh}
          ListEmptyComponent={loading ? null : renderEmptyState} />
        

      {/* Filter Modal */}
      <Modal
          visible={showFilterModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFilterModal(false)}>
          
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
                {['all', 'active', 'inactive', 'archived'].map((status) =>
                  <TouchableOpacity
                    key={status}
                    style={[
                    styles.filterOption,
                    filterStatus === status && styles.selectedFilterOption]
                    }
                    onPress={() => setFilterStatus(status as 'all' | 'active' | 'inactive' | 'archived')}>
                    
                    <Text style={[
                    styles.filterOptionText,
                    filterStatus === status && styles.selectedFilterOptionText]
                    }>
                      
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                  )}
              </View>
              
              <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Sort By</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'level', label: 'Level' },
                  { key: 'student_count', label: 'Student Count' },
                  { key: 'created_at', label: 'Created Date' }].
                  map((option) =>
                  <TouchableOpacity
                    key={option.key}
                    style={[
                    styles.filterOption,
                    sortBy === option.key && styles.selectedFilterOption]
                    }
                    onPress={() => setSortBy(option.key as 'name' | 'level' | 'student_count' | 'created_at')}>
                    
                    <Text style={[
                    styles.filterOptionText,
                    sortBy === option.key && styles.selectedFilterOptionText]
                    }>
                      
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                  )}
              </View>
              
              <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Sort Order</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'asc', label: 'Ascending' },
                  { key: 'desc', label: 'Descending' }].
                  map((option) =>
                  <TouchableOpacity
                    key={option.key}
                    style={[
                    styles.filterOption,
                    sortOrder === option.key && styles.selectedFilterOption]
                    }
                    onPress={() => setSortOrder(option.key as 'asc' | 'desc')}>
                    
                    <Text style={[
                    styles.filterOptionText,
                    sortOrder === option.key && styles.selectedFilterOptionText]
                    }>
                      
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                  )}
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowFilterModal(false)}>
                  
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setShowFilterModal(false);
                    fetchClasses();
                  }}>
                  
                <Text style={styles.saveButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        </>
      }
      <ClassFormModal
        visible={showAddModal}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
        classData={editingClass}
        schoolId={profile?.school_id || 1} />
      
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  bulkHeader: {
    backgroundColor: '#f0f9ff',
    borderBottomColor: '#bfdbfe'
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
    flex: 1,
    textAlign: 'center'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  bulkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  bulkActionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF'
  },
  bulkActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF'
  },
  disabledBulkActionText: {
    color: '#c7c7cc'
  },
  filterIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF'
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e7'
  },
  searchContainer: {
    flex: 1
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1d1d1f',
    fontWeight: '400'
  },
  clearButton: {
    padding: 4,
    marginLeft: 8
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20
  },
  classCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#f8fbff'
  },
  archivedCard: {
    opacity: 0.6,
    backgroundColor: '#f8f8f8'
  },
  checkboxContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  classInfo: {
    flex: 1,
    marginRight: 16
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 4,
    lineHeight: 24
  },
  classLevel: {
    fontSize: 14,
    color: '#005e7a',
    fontWeight: '600',
    marginBottom: 4
  },
  classDescription: {
    fontSize: 15,
    color: '#6d6d70',
    lineHeight: 20,
    marginBottom: 16
  },
  classStats: {
    alignItems: 'flex-end'
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  statText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4
  },
  progressContainer: {
    alignItems: 'flex-end'
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3
  },
  progressText: {
    fontSize: 12,
    color: '#666666'
  },
  classActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  actionText: {
    fontSize: 14,
    color: '#005e7a',
    marginLeft: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333'
  },
  modalBody: {
    padding: 16
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#e0e0e0'
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666'
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#005e7a'
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },

  classMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  status_active: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32'
  },
  status_inactive: {
    backgroundColor: '#fff3e0',
    color: '#f57c00'
  },
  status_archived: {
    backgroundColor: '#f5f5f5',
    color: '#666666'
  },
  academicInfo: {
    fontSize: 12,
    color: '#666666'
  },
  disabledAction: {
    opacity: 0.5
  },
  disabledActionText: {
    color: '#ccc'
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22
  },
  emptyButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12
  },
  sectionSpacing: {
    marginTop: 24
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff'
  },
  selectedFilterOption: {
    backgroundColor: '#005e7a',
    borderColor: '#005e7a'
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333333'
  },
  selectedFilterOptionText: {
    color: '#ffffff'
  },
  classTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  enrollmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center'
  },
  enrollmentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  capacitySection: {
    marginTop: 12,
    marginBottom: 12
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  capacityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333'
  },
  capacityCount: {
    fontSize: 14,
    color: '#666666'
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666666',
    minWidth: 35
  },
  breakdownSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  breakdownText: {
    fontSize: 12,
    color: '#666666'
  }
});