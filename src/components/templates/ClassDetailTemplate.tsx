import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Student as GlobalStudent } from '../../types';
import { convertNumberToString } from '../../utils/idConversion';
import { mockClassData, ClassData as MockClassData, Student as MockStudent, ClassScheduleItem, Activity } from '../../mocks/classData';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// Types - extending global Student type for local component needs
interface Student extends Omit<GlobalStudent, 'id'> {
  id: number; // Local component uses number for internal operations
  name: string; // Alias for full_name for backward compatibility
  memorizedVerses: number;
  totalVerses: number;
}



export default function ClassDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const parsedId = Number(id);
  const classId = isNaN(parsedId) ? 0 : parsedId;
  
  const [classData, setClassData] = useState<MockClassData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
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
          <Text style={styles.headerTitle}>Detail Kelas</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informasi Kelas</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nama Kelas</Text>
          <Text style={styles.infoValue}>{classData.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tingkat</Text>
          <Text style={styles.infoValue}>{classData.level}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Jumlah Siswa</Text>
          <Text style={styles.infoValue}>{classData.studentCount} siswa</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${classData.progress || 0}%` }]} />
            </View>
            <Text style={styles.progressText}>{classData.progress || 0}%</Text>
          </View>
        </View>
        {classData.description && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Deskripsi</Text>
            <Text style={styles.infoValue}>{classData.description}</Text>
          </View>
        )}
      </View>

      {classData.recentActivities && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          {classData.recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Ionicons 
                name={activity.type === 'memorization' ? 'book' : activity.type === 'attendance' ? 'people' : 'document-text'} 
                size={20} 
                color="#005e7a" 
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
  
  const renderStudentsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daftar Siswa</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push({
            pathname: '/(teacher)/students/add',
            params: { classId: classData.id }
          })}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      
      {classData.students && classData.students.length > 0 ? (
        <FlatList
          data={classData.students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.studentItem}
              onPress={() => router.push({
                pathname: '/(teacher)/students/[id]',
                params: { id: convertNumberToString(item.id) }
              })}
            >
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentProgress}>
                  {item.memorizedVerses}/{item.totalVerses} ayat
                </Text>
              </View>
              <View style={styles.studentStats}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill, 
                    { width: `${(item.memorizedVerses / item.totalVerses) * 100}%` }
                  ]} />
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="#cccccc" />
          <Text style={styles.emptyStateText}>Belum ada siswa di kelas ini</Text>
        </View>
      )}
    </View>
  );
  
  const renderScheduleTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Jadwal Kelas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      
      {classData.schedule && classData.schedule.length > 0 ? (
        <View>
          {classData.schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.scheduleDay}>
                <Text style={styles.scheduleDayText}>{item.day}</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTime}>{item.time}</Text>
                <Text style={styles.scheduleActivity}>{item.activity}</Text>
                {item.note && <Text style={styles.scheduleNote}>{item.note}</Text>}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#cccccc" />
          <Text style={styles.emptyStateText}>Belum ada jadwal untuk kelas ini</Text>
        </View>
      )}
    </View>
  );

  const tabs: { id: string; label: string; icon: IoniconName }[] = [
    { id: 'overview', label: 'Ringkasan', icon: 'information-circle-outline' },
    { id: 'students', label: 'Siswa', icon: 'people-outline' },
    { id: 'schedule', label: 'Jadwal', icon: 'calendar-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{classData.name}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333333" />
        </TouchableOpacity>
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
              name={tab.icon} 
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
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'students' && renderStudentsTab()}
        {activeTab === 'schedule' && renderScheduleTab()}
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
  infoSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#666666',
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
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  studentProgress: {
    fontSize: 14,
    color: '#666666',
  },
  studentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  scheduleItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  scheduleDay: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005e7a',
    borderRadius: 6,
    paddingVertical: 8,
    marginRight: 16,
  },
  scheduleDayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  scheduleActivity: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  scheduleNote: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 12,
  },
});
