import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock component for date picker
const DatePicker = ({ value, onChange }: any) => (
  <TouchableOpacity 
    style={styles.datePickerButton}
    onPress={() => onChange(new Date())}
  >
    <Text style={styles.dateText}>{value.toLocaleDateString('id-ID')}</Text>
    <MaterialIcons name="event" size={24} color="#005e7a" />
  </TouchableOpacity>
);

interface IncidentType {
  id: string;
  label: string;
  icon: string;
}

export default function IncidentReport() {
  const router = useRouter();
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [studentsInvolved, setStudentsInvolved] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const incidentTypes: IncidentType[] = [
    { id: 'bullying', label: 'Perundungan', icon: 'user-injured' },
    { id: 'safety', label: 'Masalah Keamanan', icon: 'exclamation-triangle' },
    { id: 'property', label: 'Kerusakan Properti', icon: 'hammer' },
    { id: 'other', label: 'Lainnya', icon: 'question-circle' },
  ];

  const handleSubmit = () => {
    if (!incidentType || !location || !description) {
      Alert.alert(
        'Informasi Tidak Lengkap',
        'Mohon isi semua kolom yang wajib diisi sebelum mengirim.',
        [{ text: 'OK' }]
      );
      return;
    }

    // In a real app, this would send the report to the backend
    setSubmitted(true);
    
    // Reset form after 3 seconds and navigate back
    setTimeout(() => {
      router.back();
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Insiden</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {!submitted ? (
          <>
            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={24} color="#005e7a" />
              <Text style={styles.infoText}>
                Formulir ini memungkinkan Anda melaporkan insiden terkait keselamatan dan kesejahteraan anak Anda.
                Semua laporan akan ditangani secara rahasia dan akan diselidiki oleh manajemen sekolah.
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Detail Insiden</Text>
              
              <Text style={styles.fieldLabel}>Tanggal Insiden <Text style={styles.requiredStar}>*</Text></Text>
              <DatePicker 
                value={incidentDate}
                onChange={setIncidentDate}
              />

              <Text style={styles.fieldLabel}>Jenis Insiden <Text style={styles.requiredStar}>*</Text></Text>
              <View style={styles.incidentTypesContainer}>
                {incidentTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.incidentTypeButton,
                      incidentType === type.id && styles.selectedIncidentType,
                    ]}
                    onPress={() => setIncidentType(type.id)}
                  >
                    <FontAwesome5
                      name={type.icon}
                      size={20}
                      color={incidentType === type.id ? '#ffffff' : '#005e7a'}
                    />
                    <Text
                      style={[
                        styles.incidentTypeText,
                        incidentType === type.id && styles.selectedIncidentTypeText,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Lokasi <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="Di mana insiden terjadi?"
                value={location}
                onChangeText={setLocation}
              />

              <Text style={styles.fieldLabel}>Deskripsi <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Mohon jelaskan apa yang terjadi secara detail..."
                value={description}
                onChangeText={setDescription}
              />

              <Text style={styles.fieldLabel}>Siswa yang Terlibat</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nama siswa yang terlibat (jika diketahui)"
                value={studentsInvolved}
                onChangeText={setStudentsInvolved}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Bukti</Text>
              <Text style={styles.fieldLabel}>Unggah Foto atau Dokumen (Opsional)</Text>
              
              <TouchableOpacity style={styles.uploadButton} onPress={() => alert('Fungsi unggah akan diimplementasikan di sini')}>
                <MaterialIcons name="file-upload" size={24} color="#005e7a" />
                <Text style={styles.uploadButtonText}>Unggah Berkas</Text>
              </TouchableOpacity>
              
              <Text style={styles.noteText}>
                Catatan: Jika Anda memiliki rekaman CCTV yang mungkin merekam insiden ini, silakan ajukan permintaan akses CCTV terpisah.
              </Text>
            </View>

            <View style={styles.termsSection}>
              <MaterialIcons name="security" size={24} color="#005e7a" />
              <Text style={styles.termsText}>
                Dengan mengirimkan laporan ini, Anda mengonfirmasi bahwa informasi yang diberikan akurat sejauh pengetahuan Anda.
                Pelaporan palsu dapat mengakibatkan tindakan disipliner.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Kirim Laporan</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
            <Text style={styles.successTitle}>Laporan Terkirim</Text>
            <Text style={styles.successText}>
              Laporan insiden Anda telah berhasil dikirim.
              Manajemen sekolah akan meninjau laporan Anda dan mengambil tindakan yang sesuai.
              Anda akan diberi tahu tentang pembaruan apa pun.
            </Text>
          </View>
        )}
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
    backgroundColor: '#005e7a',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  infoBox: {
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#005e7a',
    fontSize: 14,
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
  fieldLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  incidentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  incidentTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#005e7a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedIncidentType: {
    backgroundColor: '#005e7a',
  },
  incidentTypeText: {
    fontSize: 14,
    color: '#005e7a',
    marginLeft: 8,
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
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#005e7a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#005e7a',
    marginLeft: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  termsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  termsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 