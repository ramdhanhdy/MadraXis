import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ActivityList, { Activity } from './ActivityList';

interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

export default function DashboardHomeScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // This data would typically come from a state management solution or be fetched with other screen data
  const activities: Activity[] = [
    {
      id: '1',
      iconName: 'document-text-outline',
      iconContainerBg: '#005e7a',
      title: 'Guru menambahkan sertifikat',
      description: 'Ahmad Fauzi menambahkan sertifikat untuk siswa Budi Santoso',
      time: '10 menit yang lalu',
    },
    {
      id: '2',
      iconName: 'create-outline',
      iconContainerBg: '#f0c75e',
      title: 'Guru mengunggah laporan',
      description: 'Siti Aminah mengunggah laporan hafalan untuk kelas 5A',
      time: '1 jam yang lalu',
    },
    {
      id: '3',
      iconName: 'person-add-outline',
      iconContainerBg: '#4caf50',
      title: 'Admin menambahkan guru baru',
      description: 'Admin menambahkan Rudi Hermawan sebagai guru baru',
      time: '2 jam yang lalu',
    },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        // Simulate API call to fetch dynamic notification data
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const dynamicNotifications: Notification[] = [
          { id: 1, title: 'New teacher account created', time: '15 minutes ago', read: false },
          { id: 2, title: 'New grade report available', time: '2 hours ago', read: false },
          { id: 3, title: 'System maintenance scheduled', time: '1 day ago', read: true },
        ];
        setNotifications(dynamicNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        // In a real app, you might set an error state here to show a message
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = () => {
    // In a real app, this would also be an API call to update the backend
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
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
          <Text style={styles.date}>{formattedDate}</Text>
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
          
          {loadingNotifications ? (
            <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#005e7a" />
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
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
            <Text style={styles.noNotifications}>Tidak ada notifikasi baru</Text>
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
        <ActivityList activities={activities} onViewAll={handleViewAllActivities} />
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