import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IncidentReportModal() {
  return (
    <View>
      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Laporkan Masalah</Text>
        <Text style={styles.incidentDescription}>
          Gunakan fitur ini untuk melaporkan masalah keamanan, kesejahteraan, atau perilaku yang mengkhawatirkan.
          Semua laporan akan ditangani dengan serius dan dijaga kerahasiaannya.
        </Text>
      </View>

      <TouchableOpacity style={styles.incidentTypeCard}>
        <View style={[styles.incidentIcon, { backgroundColor: '#e74c3c' }]}>
          <Ionicons name="warning" size={24} color="#ffffff" />
        </View>
        <View style={styles.incidentInfo}>
          <Text style={styles.incidentTitle}>Perilaku Bullying</Text>
          <Text style={styles.incidentSubtitle}>Laporkan intimidasi atau pelecehan</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#333333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.incidentTypeCard}>
        <View style={[styles.incidentIcon, { backgroundColor: '#f39c12' }]}>
          <Ionicons name="medkit" size={24} color="#ffffff" />
        </View>
        <View style={styles.incidentInfo}>
          <Text style={styles.incidentTitle}>Masalah Kesehatan</Text>
          <Text style={styles.incidentSubtitle}>Laporkan masalah kesehatan atau cedera</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#333333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.incidentTypeCard}>
        <View style={[styles.incidentIcon, { backgroundColor: '#3498db' }]}>
          <Ionicons name="build" size={24} color="#ffffff" />
        </View>
        <View style={styles.incidentInfo}>
          <Text style={styles.incidentTitle}>Fasilitas & Infrastruktur</Text>
          <Text style={styles.incidentSubtitle}>Laporkan kerusakan atau masalah fasilitas</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#333333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.incidentTypeCard}>
        <View style={[styles.incidentIcon, { backgroundColor: '#9b59b6' }]}>
          <Ionicons name="chatbubbles" size={24} color="#ffffff" />
        </View>
        <View style={styles.incidentInfo}>
          <Text style={styles.incidentTitle}>Masalah Lainnya</Text>
          <Text style={styles.incidentSubtitle}>Laporkan masalah lain yang perlu perhatian</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#333333" />
      </TouchableOpacity>

      <View style={styles.emergencyContact}>
        <Ionicons name="call" size={20} color="#e74c3c" />
        <Text style={styles.emergencyText}>
          Untuk keadaan darurat, hubungi Pembimbing Asrama di ext. 123
        </Text>
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
});