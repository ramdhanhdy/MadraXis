import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ClassDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const classId = parseInt(id || '0');
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'students', 'schedule'
  
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
          <Text style={styles.headerTitle}>Detail Kelas</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Memuat data kelas...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Informasi Kelas</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nama Kelas</Text>
          <Text style={styles.infoValue}>{classData.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tingkat</Text>
          <Text style={styles.infoValue}>{classData.level}</Text>
        </View>
        {classData.description && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Deskripsi</Text>
            <Text style={styles.infoValue}>{classData.description}</Text>
          </View>
        )}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Jumlah Siswa</Text>
          <Text style={styles.infoValue}>{classData.studentCount} Siswa</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Progress</Text>
          <Text style={styles.infoValue}>{classData.progress}%</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Progress Hafalan Kelas</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${classData.progress}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressDetail}>
          {classData.progress}% dari target hafalan telah tercapai
        </Text>
      </View>
      
      <View style={styles.actionsSection}>
        <Text style={styles.actionsSectionTitle}>Aksi Cepat</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/teacher/class/[id]/students',
              params: { id: classData.id }
            })}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="people" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Kelola Siswa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/teacher/class/[id]/schedule',
              params: { id: classData.id }
            })}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#f0c75e' }]}>
              <Ionicons name="calendar" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Jadwal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/teacher/class/[id]/reports',
              params: { id: classData.id }
            })}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#4caf50' }]}>
              <Ionicons name="document-text" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Laporan</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.recentActivitiesSection}>
        <Text style={styles.recentActivitiesTitle}>Aktivitas Terbaru</Text>
        {classData.recentActivities && classData.recentActivities.length > 0 ? (
          classData.recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons 
                  name={
                    activity.type === 'attendance' ? 'checkmark-circle' : 
                    activity.type === 'memorization' ? 'book' : 
                    'document-text'
                  } 
                  size={20} 
                  color="#005e7a" 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.description}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Belum ada aktivitas terbaru</Text>
        )}
      </View>
    </View>
  );
  
  const renderStudentsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.studentsHeader}>
        <Text style={styles.studentsTitle}>Daftar Siswa</Text>
        <TouchableOpacity 
          style={styles.addStudentButton}
          onPress={() => router.push('/screens/teacher/AddStudent')}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addStudentText}>Tambah Siswa</Text>
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
                pathname: '/screens/teacher/StudentDetail',
                params: { id: item.id }
              })}
            >
              <View style={styles.studentInfo}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentAvatarText}>
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentProgress}>
                    Progress: {Math.round((item.memorizedVerses / item.totalVerses) * 100)}%
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={50} color="#cccccc" />
          <Text style={styles.emptyText}>Belum ada siswa di kelas ini</Text>
        </View>
      )}
    </View>
  );
  
  const renderScheduleTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.scheduleHeader}>
        <Text style={styles.scheduleTitle}>Jadwal Kelas</Text>
        <TouchableOpacity style={styles.addScheduleButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addScheduleText}>Tambah Jadwal</Text>
        </TouchableOpacity>
      </View>
      
      {classData.schedule && classData.schedule.length > 0 ? (
        classData.schedule.map((item, index) => (
          <View key={index} style={styles.scheduleItem}>
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
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={50} color="#cccccc" />
          <Text style={styles.emptyText}>Belum ada jadwal untuk kelas ini</Text>
        </View>
      )}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Kelas</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      {/* Class Title */}
      <View style={styles.classHeader}>
        <View style={styles.classIconLarge}>
          <Ionicons name="book" size={32} color="#ffffff" />
        </View>
        <View style={styles.classTitleContainer}>
          <Text style={styles.classTitle}>{classData.name}</Text>
          <Text style={styles.classSubtitle}>Tingkat {classData.level}</Text>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}
          >
            Ikhtisar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => setActiveTab('students')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}
          >
            Siswa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
          onPress={() => setActiveTab('schedule')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}
          >
            Jadwal
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'students' && renderStudentsTab()}
        {activeTab === 'schedule' && renderScheduleTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

// Types
interface Student {
  id: number;
  name: string;
  memorizedVerses: number;
  totalVerses: number;
}

interface ScheduleItem {
  day: string;
  time: string;
  activity: string;
  note?: string;
}

interface Activity {
  type: 'attendance' | 'memorization' | 'report';
  description: string;
  date: string;
}

interface ClassData {
  id: number;
  name: string;
  level: string;
  description?: string;
  studentCount: number;
  progress: number;
  students?: Student[];
  schedule?: ScheduleItem[];
  recentActivities?: Activity[];
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
    students: [
      {
        id: 1,
        name: 'Ahmad Fauzi',
        memorizedVerses: 120,
        totalVerses: 200,
      },
      {
        id: 2,
        name: 'Budi Santoso',
        memorizedVerses: 150,
        totalVerses: 200,
      },
      {
        id: 3,
        name: 'Siti Aminah',
        memorizedVerses: 180,
        totalVerses: 200,
      },
    ],
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
    recentActivities: [
      {
        type: 'attendance',
        description: 'Kehadiran kelas tercatat 100%',
        date: '2025-03-10',
      },
      {
        type: 'memorization',
        description: 'Ahmad Fauzi menyelesaikan hafalan Al-Baqarah 255-257',
        date: '2025-03-07',
      },
      {
        type: 'report',
        description: 'Laporan bulanan telah dibuat',
        date: '2025-03-01',
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
  },
  {
    id: 3,
    name: 'Tahfidz Lanjutan',
    level: 'Lanjutan',
    description: 'Kelas untuk siswa yang telah menyelesaikan hafalan minimal 5 juz.',
    studentCount: 8,
    progress: 40,
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
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  classIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  classTitleContainer: {
    flex: 1,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  classSubtitle: {
    fontSize: 16,
    color: '#888888',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 14,
    color: '#888888',
  },
  activeTabText: {
    color: '#005e7a',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: '#888888',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  progressSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#005e7a',
    borderRadius: 5,
  },
  progressDetail: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  actionsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  recentActivitiesSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentActivitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#888888',
  },
  studentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  addStudentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addStudentText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 5,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  studentAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  studentProgress: {
    fontSize: 14,
    color: '#888888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    marginTop: 10,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addScheduleText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 5,
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
}); 