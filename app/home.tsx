import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Zaid Bin Tsabit</Text>
          <Text style={styles.headerSubtitle}>Aplikasi Sekolah</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#005e7a" />
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeText}>Selamat Datang di</Text>
          <Text style={styles.schoolName}>Sekolah Zaid Bin Tsabit</Text>
          <Text style={styles.welcomeDescription}>
            Memberdayakan siswa dengan ilmu dan karakter
          </Text>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionItem}>
                <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#ffffff" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Announcements */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pengumuman</Text>
          {announcements.map((announcement, index) => (
            <View key={index} style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementDate}>{announcement.date}</Text>
              </View>
              <Text style={styles.announcementContent}>{announcement.content}</Text>
              {announcement.hasAttachment && (
                <View style={styles.attachmentIndicator}>
                  <Ionicons name="document-attach-outline" size={16} color="#005e7a" />
                  <Text style={styles.attachmentText}>Lampiran</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        
        {/* Upcoming Events */}
        <View style={[styles.sectionContainer, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Acara Mendatang</Text>
          {events.map((event, index) => (
            <TouchableOpacity key={index} style={styles.eventCard}>
              <View style={styles.eventDateContainer}>
                <Text style={styles.eventMonth}>{event.month}</Text>
                <Text style={styles.eventDay}>{event.day}</Text>
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {bottomNavItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <Ionicons name={item.icon as any} size={24} color={index === 0 ? "#005e7a" : "#888"} />
            <Text style={[styles.navText, index === 0 && styles.activeNavText]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// Sample Data
const quickActions = [
  { title: 'Kehadiran', icon: 'calendar-outline', color: '#005e7a' },
  { title: 'PR', icon: 'book-outline', color: '#f0c75e' },
  { title: 'Nilai', icon: 'stats-chart-outline', color: '#4caf50' },
  { title: 'Jadwal', icon: 'time-outline', color: '#ff7043' },
  { title: 'Perpustakaan', icon: 'library-outline', color: '#9c27b0' },
  { title: 'Kontak', icon: 'call-outline', color: '#2196f3' },
];

const announcements = [
  {
    title: 'Pembukaan Kembali Sekolah',
    date: 'Hari Ini',
    content: 'Sekolah akan dibuka kembali pada hari Senin setelah pekerjaan pemeliharaan. Semua siswa diharapkan hadir.',
    hasAttachment: true,
  },
  {
    title: 'Pertemuan Orang Tua-Guru',
    date: 'Kemarin',
    content: 'Pertemuan orang tua-guru dijadwalkan pada hari Jumat depan. Silakan periksa email Anda untuk detailnya.',
    hasAttachment: false,
  },
];

const events = [
  {
    title: 'Pameran Sains',
    month: 'MAR',
    day: '15',
    time: '09:00 - 12:00',
    location: 'Aula Sekolah',
  },
  {
    title: 'Hari Olahraga',
    month: 'MAR',
    day: '22',
    time: '08:00 - 16:00',
    location: 'Lapangan Sekolah',
  },
];

const bottomNavItems = [
  { label: 'Beranda', icon: 'home' },
  { label: 'Kalender', icon: 'calendar-outline' },
  { label: 'Pesan', icon: 'chatbubble-outline' },
  { label: 'Profil', icon: 'person-outline' },
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  profileButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  welcomeBanner: {
    backgroundColor: '#005e7a',
    padding: 20,
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#f0c75e',
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 4,
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  lastSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
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
  announcementCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#005e7a',
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  announcementDate: {
    fontSize: 12,
    color: '#888888',
  },
  announcementContent: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  attachmentText: {
    fontSize: 12,
    color: '#005e7a',
    marginLeft: 4,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  eventDateContainer: {
    width: 50,
    height: 60,
    backgroundColor: '#005e7a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventMonth: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f0c75e',
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: '#888888',
    flexDirection: 'row',
    alignItems: 'center',
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
  },
}); 