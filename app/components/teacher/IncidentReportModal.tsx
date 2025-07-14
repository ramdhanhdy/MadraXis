import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function IncidentReportModal() {
  return (
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