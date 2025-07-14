import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import LogoutButton from '../components/auth/LogoutButton';
import BoardingInfoModal from '../components/student/BoardingInfoModal';
import CommunicationModal from '../components/student/CommunicationModal';
import IncidentReportModal from '../components/student/IncidentReportModal';
import { useAuth } from '../../src/context/AuthContext';

export default function StudentDashboard() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const navigateToQuranProgress = () => {
    router.push('/student/quran-progress');
  };

  const navigateToSchedule = () => {
    router.push('/student/schedule');
  };

  const navigateToBoardingInfo = () => {
    router.push('/student/boarding-info');
  };

  const navigateToIncidentReport = () => {
    router.push('/student/incident-report');
  };

  const navigateToAntiBullying = () => {
    router.push('/student/anti-bullying');
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };
  
  // Components are now imported from separate files
  
  const renderDashboard = () => (
    <ScrollView style={styles.contentContainer}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeText}>Assalamu'alaikum,</Text>
          <Text style={styles.userName}>Ahmad Fauzi</Text>
          <Text style={styles.welcomeSubtext}>Semangat menghafal Al-Quran hari ini!</Text>
        </View>
        <View style={styles.logoContainer}>
          <SvgXml xml={logoSvg} width={80} height={80} />
        </View>
      </View>
      
      {/* Progress Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Progress Hafalan</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Al-Baqarah</Text>
            <Text style={styles.progressPercentage}>60%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressDetail}>120 dari 200 ayat</Text>
        </View>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToQuranProgress}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#005e7a' }]}>
              <Ionicons name="book" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Hafalan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToSchedule}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#f0c75e' }]}>
              <Ionicons name="calendar" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Jadwal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => openModal('Komunikasi', <CommunicationModal />)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#4caf50' }]}>
              <Ionicons name="chatbubbles" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Komunikasi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#9c27b0' }]}>
              <Ionicons name="person" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* New Feature Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Fitur Tambahan</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToBoardingInfo}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#3498db' }]}>
              <Ionicons name="home" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Info Asrama</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToIncidentReport}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#e74c3c' }]}>
              <Ionicons name="warning" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Lapor Masalah</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToAntiBullying}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#9b59b6' }]}>
              <Ionicons name="shield" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Anti-Perundungan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#f39c12' }]}>
              <Ionicons name="document-text" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Izin Keluar</Text>
          </TouchableOpacity>
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
              <Text style={styles.scheduleActivity}>Setoran Hafalan</Text>
            </View>
          </View>
          <Text style={styles.scheduleNote}>
            Persiapkan hafalan Al-Baqarah ayat 255-257
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderMessages = () => (
    <View style={styles.centeredContainer}>
      <MaterialIcons name="message" size={80} color="#cccccc" />
      <Text style={styles.placeholderText}>Fitur Pesan Segera Hadir</Text>
      <Text style={styles.placeholderSubtext}>
        Anda akan dapat berkomunikasi dengan guru dan orang tua di sini.
      </Text>
    </View>
  );

  const renderSchedule = () => (
    <View style={styles.centeredContainer}>
      <MaterialIcons name="event-note" size={80} color="#cccccc" />
      <Text style={styles.placeholderText}>Jadwal Lengkap Segera Hadir</Text>
      <Text style={styles.placeholderSubtext}>
        Anda akan dapat melihat jadwal harian, mingguan, dan bulanan di sini.
      </Text>
    </View>
  );

  const renderProfile = () => {
    if (loading) {
      return (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.profileHeader}>
            <Ionicons name="person-circle-outline" size={80} color="#005e7a" />
            <Text style={styles.profileName}>Loading...</Text>
            <Text style={styles.profileRole}>Loading...</Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.contentContainer}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle-outline" size={80} color="#005e7a" />
          <Text style={styles.profileName}>{profile?.full_name || 'Nama Siswa'}</Text>
          <Text style={styles.profileRole}>
            {profile?.role === 'student' ? 'Siswa' : profile?.role || 'Role tidak diketahui'}
          </Text>
        </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => alert('Fitur edit profil akan segera hadir!')}
        >
          <Ionicons name="person" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Edit Profil</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => alert('Fitur ubah password akan segera hadir!')}
        >
          <Ionicons name="lock-closed" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Ubah Password</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => alert('Fitur pengaturan notifikasi akan segera hadir!')}
        >
          <Ionicons name="notifications" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Pengaturan Notifikasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => alert('Fitur pengaturan bahasa akan segera hadir!')}
        >
          <Ionicons name="language" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Bahasa</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Bantuan</Text>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => alert('Fitur pusat bantuan akan segera hadir!')}
        >
          <Ionicons name="help-circle" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Pusat Bantuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => alert('Fitur syarat & ketentuan akan segera hadir!')}
        >
          <Ionicons name="document-text" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Syarat & Ketentuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => alert('Fitur kebijakan privasi akan segera hadir!')}
        >
          <Ionicons name="shield-checkmark" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Kebijakan Privasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
        <View style={styles.profileSection}>
          <LogoutButton variant="button" style={styles.logoutButton} />
        </View>
      </ScrollView>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Dashboard Siswa" 
      }} />
      <StatusBar style="dark" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundContainer}>
        <SvgXml xml={backgroundPatternSvg} width="100%" height="100%" />
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Dashboard Siswa</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'messages' && renderMessages()}
      {activeTab === 'schedule' && renderSchedule()}
      {activeTab === 'profile' && renderProfile()}

      {/* Bottom Tab Bar */}
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
          style={[styles.tabItem, activeTab === 'schedule' && styles.activeTabItem]}
          onPress={() => setActiveTab('schedule')}
        >
          <Ionicons
            name={activeTab === 'schedule' ? 'calendar' : 'calendar-outline'}
            size={24}
            color={activeTab === 'schedule' ? '#005e7a' : '#666666'}
          />
          <Text style={[styles.tabLabel, activeTab === 'schedule' && styles.activeTabLabel]}>
            Jadwal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTabItem]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? '#005e7a' : '#666666'}
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
            Profil
          </Text>
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
  <!-- Pattern 1: Top section -->
  <g opacity="0.05">
    <g transform="translate(0, 0)">
      ${generateGeometricPattern(8, 8, 50)}
    </g>
  </g>
  
  <!-- Pattern 2: Middle section -->
  <g opacity="0.05">
    <g transform="translate(0, 800)">
      ${generateStarPattern(8, 4, 100)}
    </g>
  </g>
  
  <!-- Pattern 3: Bottom section -->
  <g opacity="0.05">
    <g transform="translate(0, 1200)">
      ${generateArabicPattern(8, 4, 100)}
    </g>
  </g>
</svg>
`;

// Helper function to generate geometric pattern
function generateGeometricPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * size;
      const y = i * size;
      pattern += `
        <path d="M${x} ${y} L${x + size/2} ${y + size/2} L${x} ${y + size} L${x - size/2} ${y + size/2} Z" fill="#005e7a"/>
        <path d="M${x + size} ${y} L${x + size/2} ${y + size/2} L${x + size} ${y + size} L${x + size*1.5} ${y + size/2} Z" fill="#005e7a"/>
        <path d="M${x} ${y + size} L${x + size/2} ${y + size/2} L${x + size} ${y + size} L${x + size/2} ${y + size*1.5} Z" fill="#005e7a"/>
        <path d="M${x} ${y} L${x + size/2} ${y + size/2} L${x + size} ${y} L${x + size/2} ${y - size/2} Z" fill="#005e7a"/>
      `;
    }
  }
  return pattern;
}

// Helper function to generate star pattern
function generateStarPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * size * 2;
      const y = i * size * 2;
      const centerX = x + size;
      const centerY = y + size;
      
      // 8-point star
      pattern += `
        <path d="M${centerX} ${centerY - size} L${centerX + size/3} ${centerY - size/3} L${centerX + size} ${centerY} L${centerX + size/3} ${centerY + size/3} L${centerX} ${centerY + size} L${centerX - size/3} ${centerY + size/3} L${centerX - size} ${centerY} L${centerX - size/3} ${centerY - size/3} Z" fill="#005e7a"/>
      `;
      
      // Connecting lines
      pattern += `
        <path d="M${centerX - size} ${centerY} L${centerX - size*2} ${centerY}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY} L${centerX + size*2} ${centerY}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX} ${centerY - size} L${centerX} ${centerY - size*2}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX} ${centerY + size} L${centerX} ${centerY + size*2}" stroke="#005e7a" stroke-width="1"/>
      `;
    }
  }
  return pattern;
}

// Helper function to generate Arabic-inspired pattern
function generateArabicPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const centerX = j * size * 3 + size * 1.5;
      const centerY = i * size * 3 + size * 1.5;
      
      pattern += `
        <path d="M${centerX - size} ${centerY - size} L${centerX} ${centerY - size*1.5} L${centerX + size} ${centerY - size} L${centerX + size} ${centerY + size/2} L${centerX} ${centerY + size} L${centerX - size} ${centerY + size/2} Z" stroke="#005e7a" stroke-width="1" fill="none"/>
        <path d="M${centerX - size} ${centerY - size} L${centerX - size} ${centerY + size/2}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY - size} L${centerX + size} ${centerY + size/2}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX - size} ${centerY + size/2} L${centerX - size} ${centerY + size}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY + size/2} L${centerX + size} ${centerY + size}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX - size} ${centerY + size} Q${centerX} ${centerY + size*1.2}, ${centerX + size} ${centerY + size}" stroke="#005e7a" stroke-width="1" fill="none"/>
      `;
    }
  }
  return pattern;
}

// Logo SVG
const logoSvg = `
<svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="60" fill="#005e7a"/>
  <circle cx="60" cy="60" r="50" fill="#005e7a" stroke="#f0c75e" stroke-width="2"/>
  
  <!-- Open Book -->
  <path d="M30 45 L30 75 L60 65 L90 75 L90 45 L60 35 L30 45Z" fill="#f0c75e"/>
  <path d="M30 45 L60 35 L60 65 L30 75 L30 45Z" fill="#f0c75e" stroke="#005e7a" stroke-width="1"/>
  <path d="M60 35 L90 45 L90 75 L60 65 L60 35Z" fill="#ffffff" stroke="#005e7a" stroke-width="1"/>
  
  <!-- Book Pages Lines -->
  <path d="M40 48 L50 45" stroke="#005e7a" stroke-width="1"/>
  <path d="M40 53 L50 50" stroke="#005e7a" stroke-width="1"/>
  <path d="M40 58 L50 55" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 45 L80 48" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 50 L80 53" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 55 L80 58" stroke="#005e7a" stroke-width="1"/>
  
  <!-- Decorative Elements -->
  <circle cx="60" cy="85" r="5" fill="#f0c75e"/>
  <path d="M55 25 Q60 15 65 25" stroke="#f0c75e" stroke-width="2" fill="none"/>
  <path d="M50 28 Q60 15 70 28" stroke="#f0c75e" stroke-width="2" fill="none"/>
</svg>
`;

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
    padding: 20,
  },
  welcomeBanner: {
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
    color: '#005e7a',
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005e7a',
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
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 10,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
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
  developmentNote: {
    flexDirection: 'row',
    backgroundColor: '#e6f7ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  developmentNoteText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  modalBody: {
    padding: 16,
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
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
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
  mealScheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  mealType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  mealTime: {
    fontSize: 14,
    color: '#555555',
  },
  mealMenu: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
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
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
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
  incidentDescription: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 15,
    lineHeight: 20,
  },
  incidentTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  incidentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  incidentSubtitle: {
    fontSize: 12,
    color: '#888888',
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  emergencyText: {
    fontSize: 14,
    color: '#e74c3c',
    marginLeft: 10,
    flex: 1,
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
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
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
  profileSection: {
    marginBottom: 24,
  },
  profileItem: {
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
  profileItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
});
