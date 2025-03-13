import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ManagementDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Dashboard Manajemen</Text>
        <TouchableOpacity onPress={toggleNotifications}>
          <Ionicons name="notifications" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {/* Notification Panel */}
      {showNotifications && (
        <View style={styles.notificationPanel}>
          <Text style={styles.notificationTitle}>Notifikasi</Text>
          <View style={styles.notificationItem}>
            <Ionicons name="information-circle" size={20} color="#005e7a" />
            <Text style={styles.notificationText}>Laporan bulanan siap untuk ditinjau</Text>
          </View>
          <View style={styles.notificationItem}>
            <Ionicons name="alert-circle" size={20} color="#e74c3c" />
            <Text style={styles.notificationText}>3 insiden baru memerlukan perhatian</Text>
          </View>
          <View style={styles.notificationItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.notificationText}>Evaluasi kinerja guru selesai</Text>
          </View>
        </View>
      )}
      
      <ScrollView style={styles.scrollView}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Selamat Datang, Admin</Text>
            <Text style={styles.welcomeSubtitle}>Pantau dan kelola operasional sekolah</Text>
          </View>
          <Image 
            source={{ uri: 'https://via.placeholder.com/60' }} 
            style={styles.profileImage} 
          />
        </View>
        
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,250</Text>
            <Text style={styles.statLabel}>Total Siswa</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85</Text>
            <Text style={styles.statLabel}>Guru</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Kelas</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="people" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Manajemen Pengguna</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="bar-chart" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Laporan & Analitik</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="calendar" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Jadwal Akademik</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="settings" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Pengaturan Sistem</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Incidents */}
        <Text style={styles.sectionTitle}>Insiden Terbaru</Text>
        <View style={styles.incidentsContainer}>
          <View style={styles.incidentItem}>
            <View style={[styles.incidentPriority, { backgroundColor: '#e74c3c' }]} />
            <View style={styles.incidentContent}>
              <Text style={styles.incidentTitle}>Laporan Bullying</Text>
              <Text style={styles.incidentDetails}>Kelas 8A - Dilaporkan oleh Guru BK</Text>
              <Text style={styles.incidentTime}>2 jam yang lalu</Text>
            </View>
            <TouchableOpacity style={styles.incidentAction}>
              <Ionicons name="arrow-forward" size={20} color="#005e7a" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.incidentItem}>
            <View style={[styles.incidentPriority, { backgroundColor: '#f39c12' }]} />
            <View style={styles.incidentContent}>
              <Text style={styles.incidentTitle}>Kerusakan Fasilitas</Text>
              <Text style={styles.incidentDetails}>Lab Komputer - Dilaporkan oleh Staff</Text>
              <Text style={styles.incidentTime}>5 jam yang lalu</Text>
            </View>
            <TouchableOpacity style={styles.incidentAction}>
              <Ionicons name="arrow-forward" size={20} color="#005e7a" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.incidentItem}>
            <View style={[styles.incidentPriority, { backgroundColor: '#3498db' }]} />
            <View style={styles.incidentContent}>
              <Text style={styles.incidentTitle}>Permintaan Izin Khusus</Text>
              <Text style={styles.incidentDetails}>Kelas 9B - Dilaporkan oleh Wali Kelas</Text>
              <Text style={styles.incidentTime}>1 hari yang lalu</Text>
            </View>
            <TouchableOpacity style={styles.incidentAction}>
              <Ionicons name="arrow-forward" size={20} color="#005e7a" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Performance Overview */}
        <Text style={styles.sectionTitle}>Performa Akademik</Text>
        <View style={styles.performanceContainer}>
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceTitle}>Rata-rata Hafalan</Text>
              <Text style={styles.performanceValue}>7.8</Text>
            </View>
            <View style={styles.performanceBarContainer}>
              <View style={[styles.performanceBar, { width: '78%', backgroundColor: '#27ae60' }]} />
            </View>
            <Text style={styles.performanceSubtext}>Naik 0.3 dari bulan lalu</Text>
          </View>
          
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceTitle}>Kehadiran Siswa</Text>
              <Text style={styles.performanceValue}>92%</Text>
            </View>
            <View style={styles.performanceBarContainer}>
              <View style={[styles.performanceBar, { width: '92%', backgroundColor: '#3498db' }]} />
            </View>
            <Text style={styles.performanceSubtext}>Stabil dari bulan lalu</Text>
          </View>
          
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceTitle}>Keterlibatan Orang Tua</Text>
              <Text style={styles.performanceValue}>65%</Text>
            </View>
            <View style={styles.performanceBarContainer}>
              <View style={[styles.performanceBar, { width: '65%', backgroundColor: '#f39c12' }]} />
            </View>
            <Text style={styles.performanceSubtext}>Naik 5% dari bulan lalu</Text>
          </View>
        </View>
        
        {/* Upcoming Events */}
        <Text style={styles.sectionTitle}>Agenda Mendatang</Text>
        <View style={styles.eventsContainer}>
          <View style={styles.eventItem}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>15</Text>
              <Text style={styles.eventMonth}>JUN</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Rapat Dewan Guru</Text>
              <Text style={styles.eventDetails}>09:00 - 12:00 • Ruang Rapat Utama</Text>
            </View>
          </View>
          
          <View style={styles.eventItem}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>22</Text>
              <Text style={styles.eventMonth}>JUN</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Evaluasi Kurikulum</Text>
              <Text style={styles.eventDetails}>13:00 - 15:00 • Ruang Multimedia</Text>
            </View>
          </View>
          
          <View style={styles.eventItem}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>30</Text>
              <Text style={styles.eventMonth}>JUN</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Pertemuan Orang Tua</Text>
              <Text style={styles.eventDetails}>08:00 - 14:00 • Aula Sekolah</Text>
            </View>
          </View>
        </View>
        
        {/* Bottom Spacing */}
        <View style={{ height: 30 }} />
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
    backgroundColor: '#005e7a',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  notificationPanel: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    padding: 20,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#f0c75e',
    marginTop: 4,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f0c75e',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 94, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  incidentsContainer: {
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
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 16,
  },
  incidentPriority: {
    width: 4,
    height: '100%',
    marginRight: 12,
  },
  incidentContent: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  incidentDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  incidentTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  incidentAction: {
    padding: 8,
  },
  performanceContainer: {
    margin: 16,
    marginTop: 8,
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  performanceBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  performanceBar: {
    height: '100%',
    borderRadius: 4,
  },
  performanceSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  eventsContainer: {
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
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 16,
  },
  eventDate: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  eventMonth: {
    fontSize: 12,
    color: '#f0c75e',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 