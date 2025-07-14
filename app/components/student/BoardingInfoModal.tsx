import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BoardingInfoModal() {
  return (
    <View>
      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Informasi Asrama</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Gedung:</Text>
          <Text style={styles.infoValue}>Al-Farabi</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Kamar:</Text>
          <Text style={styles.infoValue}>203</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Pembimbing Asrama:</Text>
          <Text style={styles.infoValue}>Ustadz Hasan</Text>
        </View>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Jadwal Makan</Text>
        <View style={styles.mealScheduleCard}>
          <View style={styles.mealRow}>
            <Text style={styles.mealType}>Sarapan</Text>
            <Text style={styles.mealTime}>06:00 - 07:00</Text>
          </View>
          <Text style={styles.mealMenu}>Menu: Nasi, telur dadar, sayur sop</Text>
        </View>
        <View style={styles.mealScheduleCard}>
          <View style={styles.mealRow}>
            <Text style={styles.mealType}>Makan Siang</Text>
            <Text style={styles.mealTime}>12:30 - 13:30</Text>
          </View>
          <Text style={styles.mealMenu}>Menu: Nasi, ayam goreng, sayur asem</Text>
        </View>
        <View style={styles.mealScheduleCard}>
          <View style={styles.mealRow}>
            <Text style={styles.mealType}>Makan Malam</Text>
            <Text style={styles.mealTime}>18:30 - 19:30</Text>
          </View>
          <Text style={styles.mealMenu}>Menu: Nasi, ikan bakar, sayur capcay</Text>
        </View>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Aktivitas Asrama</Text>
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
});