import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunicationModal() {
  return (
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