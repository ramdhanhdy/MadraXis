import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunicationModal() {
  return (
    <View>
      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Guru</Text>
        <TouchableOpacity style={styles.contactCard}>
          <View style={[styles.contactIcon, { backgroundColor: '#005e7a' }]}>
            <Ionicons name="person" size={24} color="#ffffff" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Ustadz Ahmad</Text>
            <Text style={styles.contactRole}>Guru Tahfidz</Text>
          </View>
          <Ionicons name="chatbubble-outline" size={24} color="#005e7a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard}>
          <View style={[styles.contactIcon, { backgroundColor: '#005e7a' }]}>
            <Ionicons name="person" size={24} color="#ffffff" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Ustadzah Fatimah</Text>
            <Text style={styles.contactRole}>Guru Bahasa Arab</Text>
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
            <Text style={styles.contactName}>Orang Tua</Text>
            <Text style={styles.contactRole}>Ayah & Ibu</Text>
          </View>
          <Ionicons name="chatbubble-outline" size={24} color="#005e7a" />
        </TouchableOpacity>
      </View>

      <View style={styles.modalSection}>
        <Text style={styles.modalSectionTitle}>Pesan Terbaru</Text>
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender}>Ustadz Ahmad</Text>
            <Text style={styles.messageTime}>10:30</Text>
          </View>
          <Text style={styles.messageContent}>Jangan lupa persiapkan hafalan untuk besok ya</Text>
        </View>
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender}>Ibu</Text>
            <Text style={styles.messageTime}>Kemarin</Text>
          </View>
          <Text style={styles.messageContent}>Bagaimana kabarmu hari ini, nak?</Text>
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
});