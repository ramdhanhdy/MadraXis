import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { ClassService } from '@/src/services/classService';
import { Class } from '@/src/types/class';
import { ClassWithDetails } from '@/src/services/classService';
import SubjectManager from '@/src/components/organisms/SubjectManager';
import ClassFormModal from '@/src/components/organisms/ClassFormModal';

export default function ClassDetailView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, profile } = useAuth();
  const [classData, setClassData] = useState<ClassWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'subjects' | 'students' | 'reports'>('details');

  // Handle edit modal when school_id is missing
  useEffect(() => {
    if (showEditModal && !profile?.school_id) {
      Alert.alert(
        'Error',
        'School ID is required to edit class. Please contact administrator.',
        [{ text: 'OK', onPress: () => setShowEditModal(false) }]
      );
    }
  }, [showEditModal, profile?.school_id]);

  const fetchClassDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const parsedId = parseInt(id as string);
      if (isNaN(parsedId)) {
        setError('Invalid class ID provided');
        return;
      }

      if (!user?.id) {
        setError('User not authenticated');
        return;
      }

      const classData = await ClassService.getClassById(parsedId, user.id);
      setClassData(classData);
    } catch (error: any) {
      setError(error.message || 'Failed to load class details');
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  const handleEditClass = () => {
    setShowEditModal(true);
  };

  const handleArchiveClass = async () => {
    if (!classData) return;

    Alert.alert(
      'Archive Class',
      'Are you sure you want to archive this class? This action can be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.id) {
                Alert.alert('Error', 'User not authenticated');
                return;
              }
              await ClassService.updateClass(classData.id, { status: 'archived' }, user.id);
              Alert.alert('Success', 'Class has been archived');
              fetchClassDetails();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to archive class');
            }
          },
        },
      ]
    );
  };

  const handleActivateClass = async () => {
    if (!classData) return;

    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      await ClassService.updateClass(classData.id, { status: 'active' }, user.id);
      Alert.alert('Success', 'Class has been activated');
      fetchClassDetails();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to activate class');
    }
  };

  const handleDeleteClass = async () => {
    if (!classData) return;

    Alert.alert(
      'Delete Class',
      'Are you sure you want to permanently delete this class? This action cannot be undone.',
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
              await ClassService.deleteClass(classData.id, user.id);
              Alert.alert('Success', 'Class has been deleted');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete class');
            }
          },
        },
      ]
    );
  };

  const handleTabChange = (tab: 'details' | 'subjects' | 'students' | 'reports') => {
    setActiveTab(tab);
  };

  const handleFormSuccess = () => {
    setShowEditModal(false);
    fetchClassDetails();
  };

  const handleSubjectCountChange = (count: number) => {
    if (classData) {
      setClassData({ ...classData, subject_count: count });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !classData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ff3b30" />
          <Text style={styles.errorText}>{error || 'Class not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchClassDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderDetails = () => (
    <ScrollView style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Kelas</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Kelas</Text>
            <Text style={styles.infoValue}>{classData.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tingkat</Text>
            <Text style={styles.infoValue}>{classData.level}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={[styles.statusBadge, styles[`status_${classData.status}`]]}>
              <Text style={styles.statusText}>{classData.status.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kapasitas Siswa</Text>
            <Text style={styles.infoValue}>
              {classData.student_count} / {classData.student_capacity}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tahun Akademik</Text>
            <Text style={styles.infoValue}>{classData.academic_year}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Semester</Text>
            <Text style={styles.infoValue}>{classData.semester}</Text>
          </View>
          
          {classData.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.infoLabel}>Deskripsi</Text>
              <Text style={styles.descriptionText}>{classData.description}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistik</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#005e7a" />
            <Text style={styles.statNumber}>{classData.student_count || 0}</Text>
            <Text style={styles.statLabel}>Siswa</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="book" size={24} color="#005e7a" />
            <Text style={styles.statNumber}>{classData.subject_count || 0}</Text>
            <Text style={styles.statLabel}>Mata Pelajaran</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="person" size={24} color="#005e7a" />
            <Text style={styles.statNumber}>{classData.teacher_count || 0}</Text>
            <Text style={styles.statLabel}>Guru</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dibuat pada</Text>
            <Text style={styles.infoValue}>{new Date(classData.created_at).toLocaleDateString('id-ID')}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Terakhir diperbarui</Text>
            <Text style={styles.infoValue}>{new Date(classData.updated_at).toLocaleDateString('id-ID')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{classData.name}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEditClass} style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color="#005e7a" />
          </TouchableOpacity>
          
          {classData.status === 'active' && (
            <TouchableOpacity onPress={handleArchiveClass} style={styles.actionButton}>
              <Ionicons name="archive-outline" size={20} color="#ff9500" />
            </TouchableOpacity>
          )}
          
          {classData.status === 'archived' && (
            <TouchableOpacity onPress={handleActivateClass} style={styles.actionButton}>
              <Ionicons name="refresh-outline" size={20} color="#4CAF50" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleDeleteClass} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => handleTabChange('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            Detail
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'subjects' && styles.activeTab]}
          onPress={() => handleTabChange('subjects')}
        >
          <Text style={[styles.tabText, activeTab === 'subjects' && styles.activeTabText]}>
            Mata Pelajaran
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => handleTabChange('students')}
        >
          <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
            Siswa
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => handleTabChange('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Laporan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'details' && renderDetails()}
      {activeTab === 'subjects' && (
        <SubjectManager
          classId={classData.id}
          onSubjectCountChange={handleSubjectCountChange}
        />
      )}
      {activeTab === 'students' && (
        <View style={styles.content}>
          <Text style={styles.comingSoon}>Fitur Manajemen Siswa akan segera hadir</Text>
        </View>
      )}
      {activeTab === 'reports' && (
        <View style={styles.content}>
          <Text style={styles.comingSoon}>Fitur Laporan akan segera hadir</Text>
        </View>
      )}

      {/* Edit Modal */}
      {profile?.school_id && (
        <ClassFormModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleFormSuccess}
          classData={classData}
          schoolId={profile.school_id}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: '#005e7a',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  descriptionSection: {
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status_active: {
    backgroundColor: '#e8f5e8',
  },
  status_inactive: {
    backgroundColor: '#fff3e0',
  },
  status_archived: {
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  comingSoon: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 50,
  },
});