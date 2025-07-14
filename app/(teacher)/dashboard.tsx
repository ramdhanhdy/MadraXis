import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import LogoutButton from '../components/auth/LogoutButton';
import ProfileView from '../components/teacher/ProfileView';
import BoardingInfoModal from '../components/teacher/BoardingInfoModal';
import CommunicationModal from '../components/teacher/CommunicationModal';
import IncidentReportModal from '../components/teacher/IncidentReportModal';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/utils/supabase';
import { logoSvg, generateBackgroundPatternSvg } from '../../src/utils/svgPatterns';

export default function TeacherDashboard() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [schoolName, setSchoolName] = useState('Zaid Bin Tsabit');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Siswa menyelesaikan hafalan baru', time: '10 menit yang lalu', read: false },
    { id: 2, title: 'Pengumuman rapat guru', time: '1 jam yang lalu', read: false },
    { id: 3, title: 'Jadwal ujian hafalan diperbarui', time: '2 jam yang lalu', read: true },
    { id: 4, title: 'Laporan insiden baru diterima', time: '30 menit yang lalu', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch school name from database
  useEffect(() => {
    const fetchSchoolName = async () => {
      if (profile?.school_id) {
        try {
          const { data, error } = await supabase
            .from('schools')
            .select('name')
            .eq('id', profile.school_id)
            .single();
          
          if (data && !error) {
            setSchoolName(data.name);
          }
        } catch (error) {
          console.error('Error fetching school name:', error);
        }
      }
    };

    fetchSchoolName();
  }, [profile?.school_id]);

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleNavigateToStudents = () => {
    setActiveTab('students');
    router.push('/students');
  };

  const handleNavigateToClasses = () => {
    setActiveTab('classes');
    router.push('/classes');
  };

  const handleNavigateToHafalan = () => {
    setActiveTab('hafalan');
    // This would navigate to the hafalan management screen
    alert('Fitur manajemen hafalan akan segera hadir!');
  };

  const handleNavigateToProfile = () => {
    setActiveTab('profile');
  };

  const handleNavigateToReports = () => {
    // This would navigate to the reports screen
    alert('Fitur laporan akan segera hadir!');
  };

  const handleBackToRoleSelection = () => {
    router.replace('/login');
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };

  // Render profile section
  const renderProfile = () => {
    return <ProfileView profile={profile || undefined} loading={loading} schoolName={schoolName} />;
  };

  // Boarding Information Modal Content - now using BoardingInfoModal component


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Pattern */}
      <View style={styles.backgroundContainer}>
        <SvgXml xml={backgroundPatternSvg} width="100%" height="100%" />
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToRoleSelection}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard Guru</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotificationToggle} style={styles.headerAction}>
            <View style={styles.notificationIconContainer}>
              <Ionicons name="notifications-outline" size={24} color="#333333" />
              {notifications.some(n => !n.read) && (
                <View style={styles.notificationBadge} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Notifications Panel */}
      {showNotifications && (
        <View style={styles.notificationsPanel}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>Notifikasi</Text>
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text style={styles.markAllAsReadText}>Tandai semua telah dibaca</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.notificationsList}>
            {notifications.map((notification) => (
              <View 
                key={notification.id} 
                style={[
                  styles.notificationItem,
                  notification.read ? styles.notificationRead : styles.notificationUnread
                ]}
              >
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationMessage}>{notification.title}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                <TouchableOpacity style={styles.notificationAction}>
                  <Ionicons name="ellipsis-vertical" size={16} color="#888888" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      {activeTab === 'dashboard' ? (
        <ScrollView style={styles.contentContainer}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>Assalamu'alaikum,</Text>
            <Text style={styles.userName}>Ustadz Ahmad</Text>
            <Text style={styles.welcomeSubtext}>
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <SvgXml xml={logoSvg} width={80} height={80} />
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={handleNavigateToStudents}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#005e7a' }]}>
                <Ionicons name="people" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Siswa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={handleNavigateToClasses}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#f0c75e' }]}>
                <Ionicons name="school" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Kelas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={handleNavigateToHafalan}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#4caf50' }]}>
                <Ionicons name="book" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Hafalan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => openModal('Komunikasi', <CommunicationModal />)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#9c27b0' }]}>
                <Ionicons name="chatbubbles" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Komunikasi</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Additional Features */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fitur Tambahan</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => openModal('Informasi Asrama', <BoardingInfoModal />)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#3498db' }]}>
                <Ionicons name="home" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Info Asrama</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => openModal('Manajemen Insiden', <IncidentReportModal />)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#e74c3c' }]}>
                <Ionicons name="warning" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Laporan Insiden</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={handleNavigateToReports}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#f39c12' }]}>
                <Ionicons name="document-text" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Laporan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={handleNavigateToProfile}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#1abc9c' }]}>
                <Ionicons name="person" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recent Activities */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <View style={styles.activitiesContainer}>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#005e7a" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Ahmad Fauzi telah menyelesaikan hafalan Al-Baqarah 255-257</Text>
                <Text style={styles.activityTime}>10 menit yang lalu</Text>
                <Text style={styles.activityName}>Al-Baqarah 255-257</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="alert-circle" size={20} color="#f0c75e" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Budi Santoso belum menyetorkan hafalan minggu ini</Text>
                <Text style={styles.activityTime}>2 jam yang lalu</Text>
                <Text style={styles.activityName}>Minggu ini</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="calendar" size={20} color="#005e7a" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Jadwal kelas Tahfidz Al-Baqarah telah diperbarui</Text>
                <Text style={styles.activityTime}>1 hari yang lalu</Text>
                <Text style={styles.activityName}>Jadwal Tahfidz</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Upcoming Schedule */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Jadwal Mendatang</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleDay}>
                <Text style={styles.scheduleDayText}>Senin</Text>
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTime}>08:00 - 10:00</Text>
                <Text style={styles.scheduleActivity}>Kelas Tahfidz Al-Baqarah</Text>
              </View>
            </View>
            <Text style={styles.scheduleNote}>
              Setoran hafalan Al-Baqarah ayat 255-257
            </Text>
          </View>
        </View>
      </ScrollView>
      ) : (
        renderProfile()
      )}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'students' && styles.activeNavItem]} 
          onPress={handleNavigateToStudents}
        >
          <Ionicons 
            name={activeTab === 'students' ? 'people' : 'people-outline'} 
            size={24} 
            color={activeTab === 'students' ? "#005e7a" : "#666666"} 
          />
          <Text style={[styles.navText, activeTab === 'students' && styles.activeNavText]}>Siswa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'classes' && styles.activeNavItem]} 
          onPress={handleNavigateToClasses}
        >
          <Ionicons 
            name={activeTab === 'classes' ? 'school' : 'school-outline'} 
            size={24} 
            color={activeTab === 'classes' ? "#005e7a" : "#666666"} 
          />
          <Text style={[styles.navText, activeTab === 'classes' && styles.activeNavText]}>Kelas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'hafalan' && styles.activeNavItem]} 
          onPress={handleNavigateToHafalan}
        >
          <Ionicons 
            name={activeTab === 'hafalan' ? 'book' : 'book-outline'} 
            size={24} 
            color={activeTab === 'hafalan' ? "#005e7a" : "#666666"} 
          />
          <Text style={[styles.navText, activeTab === 'hafalan' && styles.activeNavText]}>Hafalan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
          onPress={handleNavigateToProfile}
        >
          <Ionicons 
            name={activeTab === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={activeTab === 'profile' ? "#005e7a" : "#666666"} 
          />
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for detailed views */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalContent.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {modalContent.content}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const backgroundPatternSvg = generateBackgroundPatternSvg();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginRight: 12,
  },
  logoutButton: {
    padding: 4,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
  },
  notificationsPanel: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: '80%',
    maxHeight: 300,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  markAllAsReadText: {
    fontSize: 12,
    color: '#005e7a',
  },
  notificationsList: {
    maxHeight: 250,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  notificationUnread: {
    backgroundColor: '#f0f9ff',
  },
  notificationRead: {
    backgroundColor: '#ffffff',
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888888',
  },
  notificationAction: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeBanner: {
    flexDirection: 'row',
    backgroundColor: '#005e7a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#f0c75e',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333333',
  },
  activitiesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  activityTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  activityName: {
    fontSize: 14,
    color: '#555555',
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleDay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0c75e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scheduleDayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  scheduleActivity: {
    fontSize: 14,
    color: '#555555',
  },
  scheduleNote: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#005e7a',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 15,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555555',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  activityCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#005e7a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  contactRole: {
    fontSize: 12,
    color: '#888888',
  },
  messageCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  messageTime: {
    fontSize: 12,
    color: '#888888',
  },
  messageContent: {
    fontSize: 14,
    color: '#555555',
  },
  incidentCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  incidentTypeTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  incidentTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  incidentTime: {
    fontSize: 12,
    color: '#888888',
  },
  incidentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  incidentDescription: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 15,
    lineHeight: 20,
  },
  incidentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incidentActionButton: {
    backgroundColor: '#005e7a',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  incidentActionButtonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#005e7a',
    marginRight: 0,
  },
  incidentActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  incidentActionTextSecondary: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#005e7a',
  },
  activeNavText: {
    color: '#005e7a',
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    marginTop: 12,
  },
  profileRole: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  profileSchool: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  profileLogoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});