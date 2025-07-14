import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import LogoutButton from '../../components/auth/LogoutButton';

// Import SVG as string
const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="100" cy="100" r="95" fill="#005e7a" />
  <circle cx="100" cy="100" r="85" fill="#ffffff" />
  
  <!-- Open Book Symbol -->
  <path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill="#ffffff" />
  
  <!-- Arabic-inspired Decorative Element -->
  <path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill="#f0c75e" />
  <path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill="#f0c75e" />
  <path d="M120 45C120 45 110 50 120 55C130 50 120 45 120 45Z" fill="#f0c75e" />
  
  <!-- Text "ZBT" -->
  <path d="M70 160H130V170H70V160Z" fill="#005e7a" />
  <path d="M70 160L130 160L100 145L70 160Z" fill="#005e7a" />
  <path d="M85 170V180H115V170" stroke="#005e7a" stroke-width="10" stroke-linecap="round" />
</svg>`;

export default function TeacherDashboard() {
  const router = useRouter();
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

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleNavigateToStudents = () => {
    router.push('/screens/teacher/StudentsList');
  };

  const handleNavigateToClasses = () => {
    router.push('/screens/teacher/ClassesList');
  };

  const handleNavigateToHafalan = () => {
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
    router.push('/screens/auth/login');
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };

  // Render profile section
  const renderProfile = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={80} color="#005e7a" />
        <Text style={styles.profileName}>Ustadz Ahmad</Text>
        <Text style={styles.profileRole}>Guru Tahfidz</Text>
        <Text style={styles.profileSchool}>Zaid Bin Tsabit</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="person" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Edit Profil</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="lock-closed" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Ubah Password</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="notifications" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Pengaturan Notifikasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="language" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Bahasa</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Bantuan</Text>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="help-circle" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Pusat Bantuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="document-text" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Syarat & Ketentuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="shield-checkmark" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Kebijakan Privasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <LogoutButton variant="button" style={styles.profileLogoutButton} />
      </View>
      
      {/* Bottom Spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // Boarding Information Modal Content
  const renderBoardingInfo = () => (
    <View>
      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Informasi Asrama</Text>
        <Text style={styles.modalDescription}>
          Berikut adalah informasi asrama yang Anda kelola sebagai pembimbing asrama.
        </Text>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Gedung & Kamar</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Gedung:</Text>
          <Text style={styles.infoValue}>Al-Farabi</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Jumlah Kamar:</Text>
          <Text style={styles.infoValue}>10</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Jumlah Siswa:</Text>
          <Text style={styles.infoValue}>40</Text>
        </View>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Jadwal Piket Asrama</Text>
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleDay}>
              <Text style={styles.scheduleDayText}>Sen</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTime}>19:00 - 22:00</Text>
              <Text style={styles.scheduleActivity}>Pengawasan Belajar Malam</Text>
            </View>
          </View>
        </View>
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleDay}>
              <Text style={styles.scheduleDayText}>Rab</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTime}>19:00 - 22:00</Text>
              <Text style={styles.scheduleActivity}>Pengawasan Belajar Malam</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Aktivitas Asrama Hari Ini</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTime}>05:00 - 05:30</Text>
          <Text style={styles.activityName}>Sholat Subuh Berjamaah</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTime}>19:30 - 21:00</Text>
          <Text style={styles.activityName}>Belajar Mandiri</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTime}>21:00 - 21:30</Text>
          <Text style={styles.activityName}>Persiapan Tidur</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Kelola Asrama</Text>
      </TouchableOpacity>
    </View>
  );

  // Communication Modal Content
  const renderCommunication = () => (
    <View>
      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Komunikasi</Text>
        <Text style={styles.modalDescription}>
          Komunikasi dengan siswa dan orang tua untuk memantau perkembangan siswa.
        </Text>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Siswa</Text>
        <TouchableOpacity style={styles.contactCard}>
          <View style={[styles.contactIcon, { backgroundColor: '#005e7a' }]}>
            <Ionicons name="person" size={24} color="#ffffff" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Ahmad Fauzi</Text>
            <Text style={styles.contactRole}>Kelas 8A</Text>
          </View>
          <Ionicons name="chatbubble-outline" size={24} color="#005e7a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard}>
          <View style={[styles.contactIcon, { backgroundColor: '#005e7a' }]}>
            <Ionicons name="person" size={24} color="#ffffff" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Muhammad Rizki</Text>
            <Text style={styles.contactRole}>Kelas 8A</Text>
          </View>
          <Ionicons name="chatbubble-outline" size={24} color="#005e7a" />
        </TouchableOpacity>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Orang Tua</Text>
        <TouchableOpacity style={styles.contactCard}>
          <View style={[styles.contactIcon, { backgroundColor: '#f0c75e' }]}>
            <Ionicons name="people" size={24} color="#ffffff" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Orang Tua Ahmad</Text>
            <Text style={styles.contactRole}>Wali dari Ahmad Fauzi</Text>
          </View>
          <Ionicons name="chatbubble-outline" size={24} color="#005e7a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard}>
          <View style={[styles.contactIcon, { backgroundColor: '#f0c75e' }]}>
            <Ionicons name="people" size={24} color="#ffffff" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Orang Tua Rizki</Text>
            <Text style={styles.contactRole}>Wali dari Muhammad Rizki</Text>
          </View>
          <Ionicons name="chatbubble-outline" size={24} color="#005e7a" />
        </TouchableOpacity>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Pesan Terbaru</Text>
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender}>Orang Tua Ahmad</Text>
            <Text style={styles.messageTime}>10:30</Text>
          </View>
          <Text style={styles.messageContent}>Bagaimana perkembangan hafalan Ahmad minggu ini?</Text>
        </View>
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender}>Muhammad Rizki</Text>
            <Text style={styles.messageTime}>Kemarin</Text>
          </View>
          <Text style={styles.messageContent}>Ustadz, saya ingin konsultasi tentang hafalan saya</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Buka Semua Pesan</Text>
      </TouchableOpacity>
    </View>
  );

  // Incident Report Modal Content
  const renderIncidentReport = () => (
    <View>
      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Manajemen Insiden</Text>
        <Text style={styles.modalDescription}>
          Kelola laporan insiden dari siswa dan orang tua terkait keamanan, kesejahteraan, atau perilaku yang mengkhawatirkan.
        </Text>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Laporan Baru</Text>
        <View style={styles.incidentCard}>
          <View style={styles.incidentHeader}>
            <View style={[styles.incidentTypeTag, { backgroundColor: '#e74c3c' }]}>
              <Text style={styles.incidentTypeText}>Bullying</Text>
            </View>
            <Text style={styles.incidentTime}>30 menit yang lalu</Text>
          </View>
          <Text style={styles.incidentTitle}>Laporan dari Orang Tua Ahmad</Text>
          <Text style={styles.incidentDescription}>
            Ahmad melaporkan bahwa dia merasa tidak nyaman dengan perilaku beberapa teman di asrama...
          </Text>
          <View style={styles.incidentActions}>
            <TouchableOpacity style={styles.incidentActionButton}>
              <Text style={styles.incidentActionText}>Lihat Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.incidentActionButton, styles.incidentActionButtonSecondary]}>
              <Text style={styles.incidentActionTextSecondary}>Tandai Ditangani</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Dalam Proses</Text>
        <View style={styles.incidentCard}>
          <View style={styles.incidentHeader}>
            <View style={[styles.incidentTypeTag, { backgroundColor: '#f39c12' }]}>
              <Text style={styles.incidentTypeText}>Kesehatan</Text>
            </View>
            <Text style={styles.incidentTime}>2 hari yang lalu</Text>
          </View>
          <Text style={styles.incidentTitle}>Laporan dari Muhammad Rizki</Text>
          <Text style={styles.incidentDescription}>
            Rizki melaporkan bahwa dia mengalami sakit kepala yang berkelanjutan...
          </Text>
          <View style={styles.incidentActions}>
            <TouchableOpacity style={styles.incidentActionButton}>
              <Text style={styles.incidentActionText}>Lihat Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.incidentActionButton, styles.incidentActionButtonSecondary]}>
              <Text style={styles.incidentActionTextSecondary}>Perbarui Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Lihat Semua Laporan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
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
              onPress={() => openModal('Komunikasi', renderCommunication())}
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
              onPress={() => openModal('Informasi Asrama', renderBoardingInfo())}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#3498db' }]}>
                <Ionicons name="home" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Info Asrama</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => openModal('Manajemen Insiden', renderIncidentReport())}
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
          style={styles.navItem} 
          onPress={handleNavigateToStudents}
        >
          <Ionicons 
            name="people" 
            size={24} 
            color="#666666" 
          />
          <Text style={styles.navText}>Siswa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={handleNavigateToClasses}
        >
          <Ionicons 
            name="school" 
            size={24} 
            color="#666666" 
          />
          <Text style={styles.navText}>Kelas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={handleNavigateToHafalan}
        >
          <Ionicons 
            name="book" 
            size={24} 
            color="#666666" 
          />
          <Text style={styles.navText}>Hafalan</Text>
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

// Background Pattern SVG
const backgroundPatternSvg = `
<svg width="100%" height="100%" viewBox="0 0 800 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="1600" fill="#f5f5f5"/>
  
  <!-- Islamic Geometric Pattern -->
  <!-- Pattern 1: Top section - Hexagonal pattern -->
  <g opacity="0.05">
    <g transform="translate(0, 0)">
      ${generateHexagonalPattern(10, 6, 60)}
    </g>
  </g>
  
  <!-- Pattern 2: Middle section - Interlaced pattern -->
  <g opacity="0.05">
    <g transform="translate(0, 800)">
      ${generateInterlacedPattern(6, 3, 100)}
    </g>
  </g>
  
  <!-- Pattern 3: Bottom section - Floral pattern -->
  <g opacity="0.05">
    <g transform="translate(0, 1200)">
      ${generateFloralPattern(6, 3, 100)}
    </g>
  </g>
</svg>
`;

// Helper function to generate hexagonal pattern
function generateHexagonalPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  const h = size * Math.sqrt(3) / 2;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const offsetX = j * size * 1.5;
      const offsetY = i * h * 2 + (j % 2 === 0 ? 0 : h);
      
      // Hexagon
      pattern += `
        <path d="
          M${offsetX} ${offsetY + h}
          L${offsetX + size/2} ${offsetY}
          L${offsetX + size*1.5} ${offsetY}
          L${offsetX + size*2} ${offsetY + h}
          L${offsetX + size*1.5} ${offsetY + h*2}
          L${offsetX + size/2} ${offsetY + h*2}
          Z
        " stroke="#005e7a" stroke-width="1" fill="none"/>
      `;
      
      // Inner decoration
      pattern += `
        <circle cx="${offsetX + size}" cy="${offsetY + h}" r="${size/4}" stroke="#005e7a" stroke-width="0.5" fill="none"/>
        <path d="
          M${offsetX + size - size/4} ${offsetY + h}
          L${offsetX + size} ${offsetY + h - size/4}
          L${offsetX + size + size/4} ${offsetY + h}
          L${offsetX + size} ${offsetY + h + size/4}
          Z
        " stroke="#005e7a" stroke-width="0.5" fill="none"/>
      `;
    }
  }
  
  return pattern;
}

// Helper function to generate interlaced pattern
function generateInterlacedPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * size * 2;
      const y = i * size * 2;
      
      // Circles
      pattern += `
        <circle cx="${x + size}" cy="${y + size}" r="${size * 0.8}" stroke="#005e7a" stroke-width="1" fill="none"/>
      `;
      
      // Interlaced lines
      pattern += `
        <path d="
          M${x} ${y}
          C${x + size/2} ${y + size}, ${x + size*1.5} ${y + size}, ${x + size*2} ${y}
        " stroke="#005e7a" stroke-width="1" fill="none"/>
        
        <path d="
          M${x} ${y + size*2}
          C${x + size/2} ${y + size}, ${x + size*1.5} ${y + size}, ${x + size*2} ${y + size*2}
        " stroke="#005e7a" stroke-width="1" fill="none"/>
        
        <path d="
          M${x} ${y + size}
          C${x + size/2} ${y}, ${x + size*1.5} ${y + size*2}, ${x + size*2} ${y + size}
        " stroke="#005e7a" stroke-width="1" fill="none"/>
      `;
    }
  }
  
  return pattern;
}

// Helper function to generate floral pattern
function generateFloralPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * size * 2;
      const y = i * size * 2;
      const centerX = x + size;
      const centerY = y + size;
      
      // Center flower
      pattern += `
        <circle cx="${centerX}" cy="${centerY}" r="${size/10}" fill="#005e7a"/>
      `;
      
      // Petals
      for (let angle = 0; angle < 360; angle += 45) {
        const radians = angle * Math.PI / 180;
        const petalX = centerX + Math.cos(radians) * size/2;
        const petalY = centerY + Math.sin(radians) * size/2;
        
        pattern += `
          <path d="
            M${centerX} ${centerY}
            Q${centerX + Math.cos(radians + Math.PI/4) * size/3} ${centerY + Math.sin(radians + Math.PI/4) * size/3},
             ${petalX} ${petalY}
            Q${centerX + Math.cos(radians - Math.PI/4) * size/3} ${centerY + Math.sin(radians - Math.PI/4) * size/3},
             ${centerX} ${centerY}
          " stroke="#005e7a" stroke-width="0.5" fill="none"/>
        `;
      }
      
      // Connecting lines
      if (j < cols - 1) {
        pattern += `
          <path d="M${centerX + size/2} ${centerY} L${centerX + size*1.5} ${centerY}" stroke="#005e7a" stroke-width="0.5" stroke-dasharray="5,5" fill="none"/>
        `;
      }
      
      if (i < rows - 1) {
        pattern += `
          <path d="M${centerX} ${centerY + size/2} L${centerX} ${centerY + size*1.5}" stroke="#005e7a" stroke-width="0.5" stroke-dasharray="5,5" fill="none"/>
        `;
      }
    }
  }
  
  return pattern;
}

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
    elevation: 3,
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
