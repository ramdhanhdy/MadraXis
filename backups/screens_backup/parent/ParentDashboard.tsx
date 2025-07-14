import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LogoutButton from '../../components/auth/LogoutButton';

export default function ParentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for student
  const studentData = {
    name: 'Ahmad Farhan',
    grade: '8',
    class: 'VIII-A',
    dorm: 'Al-Farabi',
    room: '203',
    quranProgress: 68,
    academicProgress: 85,
    attendanceRate: 98,
    recentActivities: [
      { id: 1, type: 'academic', title: 'Ujian Matematika', score: '85/100', date: '2 jam yang lalu' },
      { id: 2, type: 'quran', title: 'Surah Al-Baqarah', progress: '75-82', date: '5 jam yang lalu' },
      { id: 3, type: 'dorm', title: 'Sholat Maghrib', status: 'Hadir', date: 'Kemarin' },
      { id: 4, type: 'academic', title: 'Proyek Sains', status: 'Diserahkan', date: 'Kemarin' },
    ],
    upcomingEvents: [
      { id: 1, title: 'Pertemuan Orang Tua-Guru', date: '15 Maret, 2025', time: '10:00' },
      { id: 2, title: 'Lomba Tilawah Al-Quran', date: '20 Maret, 2025', time: '14:00' },
    ],
  };

  const renderDashboard = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Selamat Datang, Orang Tua dari</Text>
        <Text style={styles.studentName}>{studentData.name}</Text>
        <View style={styles.studentInfoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kelas</Text>
            <Text style={styles.infoValue}>{studentData.grade}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ruang</Text>
            <Text style={styles.infoValue}>{studentData.class}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Asrama</Text>
            <Text style={styles.infoValue}>{studentData.dorm}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kamar</Text>
            <Text style={styles.infoValue}>{studentData.room}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Ringkasan Perkembangan</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressValue}>{studentData.quranProgress}%</Text>
            </View>
            <Text style={styles.progressLabel}>Hafalan Quran</Text>
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressValue}>{studentData.academicProgress}%</Text>
            </View>
            <Text style={styles.progressLabel}>Akademik</Text>
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressValue}>{studentData.attendanceRate}%</Text>
            </View>
            <Text style={styles.progressLabel}>Kehadiran</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        {studentData.recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
              {getActivityIcon(activity.type)}
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDetail}>
                {activity.score || activity.progress || activity.status}
              </Text>
              <Text style={styles.activityTime}>{activity.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Acara Mendatang</Text>
        {studentData.upcomingEvents.map((event) => (
          <View key={event.id} style={styles.eventItem}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventDate}>{event.date.split(',')[0]}</Text>
              <Text style={styles.eventMonth}>{event.date.split(',')[1]}</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Keamanan & Pemantauan</Text>
        <TouchableOpacity 
          style={styles.safetyButton} 
          onPress={() => router.push('/parent/cctv-request')}
        >
          <MaterialIcons name="video-library" size={24} color="#ffffff" />
          <Text style={styles.safetyButtonText}>Permintaan Akses CCTV</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.safetyButton} 
          onPress={() => router.push('/parent/incident-report')}
        >
          <MaterialIcons name="report-problem" size={24} color="#ffffff" />
          <Text style={styles.safetyButtonText}>Laporkan Insiden</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.safetyButton} 
          onPress={() => router.push('/parent/anti-bullying')}
        >
          <FontAwesome5 name="book-reader" size={24} color="#ffffff" />
          <Text style={styles.safetyButtonText}>Sumber Anti-Perundungan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderMessages = () => (
    <View style={styles.centeredContainer}>
      <MaterialIcons name="message" size={80} color="#cccccc" />
      <Text style={styles.placeholderText}>Fitur Pesan Segera Hadir</Text>
      <Text style={styles.placeholderSubtext}>
        Anda akan dapat berkomunikasi dengan guru dan staf di sini.
      </Text>
    </View>
  );

  const renderLeaveRequests = () => (
    <View style={styles.centeredContainer}>
      <MaterialIcons name="event-busy" size={80} color="#cccccc" />
      <Text style={styles.placeholderText}>Permintaan Izin Segera Hadir</Text>
      <Text style={styles.placeholderSubtext}>
        Anda akan dapat mengajukan dan melacak izin ketidakhadiran anak Anda di sini.
      </Text>
    </View>
  );

  const renderSettings = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => alert('Fitur edit profil akan segera hadir!')}
        >
          <Ionicons name="person" size={24} color="#005e7a" />
          <Text style={styles.settingItemText}>Edit Profil</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => alert('Fitur pengaturan notifikasi akan segera hadir!')}
        >
          <Ionicons name="notifications" size={24} color="#005e7a" />
          <Text style={styles.settingItemText}>Pengaturan Notifikasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => alert('Fitur pengaturan bahasa akan segera hadir!')}
        >
          <Ionicons name="language" size={24} color="#005e7a" />
          <Text style={styles.settingItemText}>Bahasa</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Bantuan</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => alert('Fitur pusat bantuan akan segera hadir!')}
        >
          <Ionicons name="help-circle" size={24} color="#005e7a" />
          <Text style={styles.settingItemText}>Pusat Bantuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => alert('Fitur syarat & ketentuan akan segera hadir!')}
        >
          <Ionicons name="document-text" size={24} color="#005e7a" />
          <Text style={styles.settingItemText}>Syarat & Ketentuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => alert('Fitur kebijakan privasi akan segera hadir!')}
        >
          <Ionicons name="shield-checkmark" size={24} color="#005e7a" />
          <Text style={styles.settingItemText}>Kebijakan Privasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.sectionContainer}>
        <LogoutButton variant="button" style={styles.logoutButton} />
      </View>
    </ScrollView>
  );

  // Helper functions
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'academic': return '#4CAF50';
      case 'quran': return '#2196F3';
      case 'dorm': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <Ionicons name="school" size={20} color="#ffffff" />;
      case 'quran':
        return <FontAwesome5 name="book-open" size={20} color="#ffffff" />;
      case 'dorm':
        return <MaterialIcons name="home" size={20} color="#ffffff" />;
      default:
        return <Ionicons name="information-circle" size={20} color="#ffffff" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Dashboard Orang Tua</Text>
        <TouchableOpacity onPress={() => alert('Notifikasi')}>
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'messages' && renderMessages()}
      {activeTab === 'leave' && renderLeaveRequests()}
      {activeTab === 'settings' && renderSettings()}

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dashboard' && styles.activeTabItem]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons
            name={activeTab === 'dashboard' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'dashboard' ? '#005e7a' : '#666666'}
          />
          <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.activeTabLabel]}>
            Beranda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'messages' && styles.activeTabItem]}
          onPress={() => setActiveTab('messages')}
        >
          <Ionicons
            name={activeTab === 'messages' ? 'chatbubble' : 'chatbubble-outline'}
            size={24}
            color={activeTab === 'messages' ? '#005e7a' : '#666666'}
          />
          <Text style={[styles.tabLabel, activeTab === 'messages' && styles.activeTabLabel]}>
            Pesan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'leave' && styles.activeTabItem]}
          onPress={() => setActiveTab('leave')}
        >
          <MaterialIcons
            name="event-note"
            size={24}
            color={activeTab === 'leave' ? '#005e7a' : '#666666'}
          />
          <Text style={[styles.tabLabel, activeTab === 'leave' && styles.activeTabLabel]}>
            Izin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'settings' && styles.activeTabItem]}
          onPress={() => setActiveTab('settings')}
        >
          <Ionicons
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
            size={24}
            color={activeTab === 'settings' ? '#005e7a' : '#666666'}
          />
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.activeTabLabel]}>
            Pengaturan
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#005e7a',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
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
  welcomeText: {
    fontSize: 16,
    color: '#666666',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 12,
  },
  studentInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  sectionContainer: {
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
    color: '#005e7a',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
    width: '30%',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#005e7a',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  progressLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666666',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  activityDetail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  eventDateContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  eventMonth: {
    fontSize: 12,
    color: '#ffffff',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  eventTime: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  safetyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  safetyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    height: 60,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#005e7a',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#005e7a',
    fontWeight: '600',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
}); 