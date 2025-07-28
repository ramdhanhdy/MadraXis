import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import DateTimePicker from '@react-native-community/datetimepicker';

interface IncidentType {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
}

export default function StudentIncidentReport() {
  const router = useRouter();
  const [incidentDate, setIncidentDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const incidentTypes: IncidentType[] = [
    { id: 'bullying', label: 'Perundungan', icon: 'user-injured' },
    { id: 'safety', label: 'Masalah Keamanan', icon: 'exclamation-triangle' },
    { id: 'property', label: 'Kerusakan Properti', icon: 'hammer' },
    { id: 'other', label: 'Lainnya', icon: 'question-circle' },
  ];

  const handleSubmit = async () => {
    if (!incidentType || !location || !description) {
      Alert.alert(
        'Informasi Tidak Lengkap',
        'Mohon isi semua kolom yang wajib diisi sebelum mengirim.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, this would send the report to the backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setSubmitted(true);
      
      // Reset form after 3 seconds and navigate back
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch {
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderIncidentTypeOption = (type: IncidentType) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.incidentTypeOption,
        incidentType === type.id && styles.selectedIncidentType
      ]}
      onPress={() => setIncidentType(type.id)}
    >
      <FontAwesome5 
        name={type.icon} 
        size={20} 
        color={incidentType === type.id ? '#ffffff' : '#005e7a'} 
      />
      <Text style={[
        styles.incidentTypeText,
        incidentType === type.id && styles.selectedIncidentTypeText
      ]}>
        {type.label}
      </Text>
    </TouchableOpacity>
  );

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.successTitle}>Laporan Berhasil Dikirim!</Text>
          <Text style={styles.successMessage}>
            Terima kasih telah melaporkan insiden ini. Laporan Anda akan ditangani dengan serius 
            dan kerahasiaan terjamin. Tim sekolah akan menindaklanjuti sesuai prosedur.
          </Text>
          <Text style={styles.successNote}>
            Kembali ke dashboard dalam beberapa detik...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lapor Masalah</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <Text style={styles.infoTitle}>Laporan Aman & Terpercaya</Text>
          </View>
          <Text style={styles.infoText}>
            Laporkan masalah atau insiden yang kamu alami atau saksikan. Identitas kamu akan dilindungi 
            dan laporan akan ditangani dengan serius oleh tim sekolah.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Detail Laporan</Text>
          
          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tanggal Kejadian *</Text>
            <TouchableOpacity 
  style={styles.datePickerButton}
  onPress={() => setShowDatePicker(true)}
>
  <Text style={styles.dateText}>{incidentDate.toLocaleDateString('id-ID')}</Text>
  <MaterialIcons name="event" size={24} color="#005e7a" />
</TouchableOpacity>
{showDatePicker && (
  <DateTimePicker
    value={incidentDate}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setIncidentDate(selectedDate);
      }
    }}
  />
)}
          </View>

          {/* Incident Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jenis Masalah *</Text>
            <View style={styles.incidentTypesContainer}>
              {incidentTypes.map(renderIncidentTypeOption)}
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Lokasi Kejadian *</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Contoh: Kelas 5A, Kantin, Taman Bermain"
              placeholderTextColor="#999999"
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Deskripsi Kejadian *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Jelaskan secara detail apa yang terjadi, kapan, dan siapa saja yang terlibat..."
              placeholderTextColor="#999999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Anonymous Option */}
          <TouchableOpacity 
            style={styles.anonymousOption}
            onPress={() => setAnonymous(!anonymous)}
          >
            <Ionicons 
              name={anonymous ? "checkbox" : "square-outline"} 
              size={24} 
              color="#005e7a" 
            />
            <View style={styles.anonymousTextContainer}>
              <Text style={styles.anonymousTitle}>Laporan Anonim</Text>
              <Text style={styles.anonymousDescription}>
                Identitas saya tidak akan diungkapkan kepada siapapun
              </Text>
            </View>
          </TouchableOpacity>

          {/* Guidelines */}
          <View style={styles.guidelinesSection}>
            <Text style={styles.guidelinesTitle}>Panduan Melaporkan:</Text>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>Berikan informasi sejelas dan selengkap mungkin</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>Sertakan waktu dan lokasi yang tepat</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>Hindari tuduhan tanpa bukti yang jelas</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>Laporan akan ditangani dalam 1-3 hari kerja</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!incidentType || !location || !description || isLoading) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!incidentType || !location || !description || isLoading}
        >
          {isLoading ? (
            <Text style={styles.submitButtonText}>Mengirim...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Kirim Laporan</Text>
          )}
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: 50 }} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoSection: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  incidentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  incidentTypeOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#005e7a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  selectedIncidentType: {
    backgroundColor: '#005e7a',
  },
  incidentTypeText: {
    fontSize: 14,
    color: '#005e7a',
    marginLeft: 8,
    textAlign: 'center',
  },
  selectedIncidentTypeText: {
    color: '#ffffff',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
  },
  anonymousOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  anonymousTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  anonymousDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  guidelinesSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  successNote: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
