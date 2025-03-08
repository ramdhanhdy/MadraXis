import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardHomeScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Guru baru ditambahkan', time: '10 menit yang lalu', read: false },
    { id: 2, title: 'Laporan hafalan baru', time: '1 jam yang lalu', read: false },
    { id: 3, title: 'Sertifikat baru diterbitkan', time: '2 jam yang lalu', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleNavigateToTeachers = () => {
    router.push('screens/dashboard/teachers' as any);
  };

  const handleNavigateToStudents = () => {
    router.push('screens/dashboard/students' as any);
  };

  const handleNavigateToClasses = () => {
    router.push('screens/dashboard/classes' as any);
  };

  const handleNavigateToProfile = () => {
    router.push('screens/dashboard/profile' as any);
  };

  const handleViewAllActivities = () => {
    router.push('screens/dashboard/activities' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Pagi, Admin Sekolah</Text>
          <Text style={styles.date}>Senin, 8 Maret 2025</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationToggle}>
          <Ionicons name="notifications-outline" size={24} color="#005e7a" />
          {notifications.some(n => !n.read) && (
            <View style={styles.notificationBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications Panel */}
      {showNotifications && (
        <View style={styles.notificationsPanel}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>Notifikasi</Text>
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Ionicons name="checkmark-done-outline" size={24} color="#005e7a" />
            </TouchableOpacity>
          </View>
          
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <View 
                key={notification.id} 
                style={[
                  styles.notificationItem, 
                  notification.read && styles.notificationItemRead
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons name="alert-circle-outline" size={24} color="#005e7a" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noNotifications}>Tidak ada notifikasi</Text>
          )}
        </View>
      )}
      
      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard} 
            onPress={handleNavigateToTeachers}
          >
            <View style={[styles.statIconContainer, { backgroundColor: '#e6f7ff' }]}>
              <Ionicons name="people-outline" size={24} color="#005e7a" />
            </View>
            <Text style={styles.statTitle}>Guru</Text>
            <Text style={styles.statValue}>12</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statCard}
            onPress={handleNavigateToStudents}
          >
            <View style={[styles.statIconContainer, { backgroundColor: '#fff2e6' }]}>
              <Ionicons name="school-outline" size={24} color="#f0c75e" />
            </View>
            <Text style={styles.statTitle}>Siswa</Text>
            <Text style={styles.statValue}>248</Text>
          </TouchableOpacity>
        </View>
        
        {/* Activity Log */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Log Aktivitas</Text>
            <TouchableOpacity onPress={handleViewAllActivities}>
              <Text style={styles.viewAllLink}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="document-text-outline" size={20} color="#ffffff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Guru menambahkan sertifikat</Text>
                <Text style={styles.activityDescription}>
                  Ahmad Fauzi menambahkan sertifikat untuk siswa Budi Santoso
                </Text>
                <Text style={styles.activityTime}>10 menit yang lalu</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIconContainer, { backgroundColor: '#f0c75e' }]}>
                <Ionicons name="create-outline" size={20} color="#ffffff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Guru mengunggah laporan</Text>
                <Text style={styles.activityDescription}>
                  Siti Aminah mengunggah laporan hafalan untuk kelas 5A
                </Text>
                <Text style={styles.activityTime}>1 jam yang lalu</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIconContainer, { backgroundColor: '#4caf50' }]}>
                <Ionicons name="person-add-outline" size={20} color="#ffffff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Admin menambahkan guru baru</Text>
                <Text style={styles.activityDescription}>
                  Admin menambahkan Rudi Hermawan sebagai guru baru
                </Text>
                <Text style={styles.activityTime}>2 jam yang lalu</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="home" size={24} color="#005e7a" />
          <Text style={[styles.navText, styles.activeNavText]}>Beranda</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleNavigateToTeachers}>
          <Ionicons name="people-outline" size={24} color="#888888" />
          <Text style={styles.navText}>Guru</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleNavigateToStudents}>
          <Ionicons name="school-outline" size={24} color="#888888" />
          <Text style={styles.navText}>Siswa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleNavigateToClasses}>
          <Ionicons name="list-outline" size={24} color="#888888" />
          <Text style={styles.navText}>Kelas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleNavigateToProfile}>
          <Ionicons name="person-outline" size={24} color="#888888" />
          <Text style={styles.navText}>Akun Saya</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  date: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  notificationButton: {
    padding: 5,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b6b',
  },
  notificationsPanel: {
    position: 'absolute',
    top: 70,
    right: 20,
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  notificationItemRead: {
    opacity: 0.6,
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888888',
  },
  noNotifications: {
    textAlign: 'center',
    color: '#888888',
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  viewAllLink: {
    fontSize: 14,
    color: '#005e7a',
  },
  activityList: {
    
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 12,
    color: '#888888',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  activeNavText: {
    color: '#005e7a',
    fontWeight: 'bold',
  },
}); 