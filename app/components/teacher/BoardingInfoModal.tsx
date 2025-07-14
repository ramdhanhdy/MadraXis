import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BoardingInfoModal() {
  return (
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
}

const styles = StyleSheet.create({
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
  scheduleCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
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
  activityCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
});