import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Note: These packages would need to be installed in a real project
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';

// Mock components for demo purposes
const DateTimePicker = ({ value, mode, display, onChange }: any) => null;
const Picker = ({ selectedValue, onValueChange, style, children }: any) => null;
Picker.Item = ({ label, value }: any) => null;

interface Camera {
  id: string;
  name: string;
}

export default function CCTVAccessRequest() {
  const router = useRouter();
  const [selectedCamera, setSelectedCamera] = useState('hallway');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [justification, setJustification] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Mock camera locations
  const cameraLocations: Camera[] = [
    { id: 'hallway', name: 'Koridor Utama' },
    { id: 'playground', name: 'Taman Bermain' },
    { id: 'cafeteria', name: 'Kantin' },
    { id: 'entrance', name: 'Pintu Masuk Utama' },
    { id: 'library', name: 'Perpustakaan' },
  ];

  const handleSubmit = () => {
    // In a real app, this would send the request to the backend
    setSubmitted(true);
    
    // Reset form after 3 seconds and navigate back
    setTimeout(() => {
      router.back();
    }, 3000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Permintaan Akses CCTV</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {!submitted ? (
          <>
            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={24} color="#005e7a" />
              <Text style={styles.infoText}>
                Untuk keamanan siswa, orang tua dapat meminta akses terbatas ke rekaman CCTV di area umum.
                Semua permintaan akan ditinjau oleh manajemen sekolah dan tunduk pada persetujuan.
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Lokasi Kamera</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCamera}
                  onValueChange={(itemValue: string) => setSelectedCamera(itemValue)}
                  style={styles.picker}
                >
                  {cameraLocations.map((camera) => (
                    <Picker.Item key={camera.id} label={camera.name} value={camera.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Periode Waktu</Text>
              <Text style={styles.fieldLabel}>Tanggal & Waktu Mulai</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                <MaterialIcons name="event" size={24} color="#005e7a" />
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="datetime"
                  display="default"
                  onChange={(event: any, selectedDate?: Date) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      setStartDate(selectedDate);
                    }
                  }}
                />
              )}

              <Text style={styles.fieldLabel}>Tanggal & Waktu Selesai</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                <MaterialIcons name="event" size={24} color="#005e7a" />
              </TouchableOpacity>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="datetime"
                  display="default"
                  onChange={(event: any, selectedDate?: Date) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setEndDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Alasan</Text>
              <Text style={styles.fieldLabel}>
                Mohon berikan alasan untuk permintaan Anda
              </Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Masukkan alasan Anda untuk meminta akses..."
                value={justification}
                onChangeText={setJustification}
              />
            </View>

            <View style={styles.termsSection}>
              <MaterialIcons name="security" size={24} color="#005e7a" />
              <Text style={styles.termsText}>
                Dengan mengirimkan permintaan ini, Anda setuju untuk menggunakan akses ini hanya untuk tujuan
                memantau keselamatan dan kesejahteraan anak Anda. Penyalahgunaan atau berbagi rekaman
                sangat dilarang dan dapat mengakibatkan tindakan hukum.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedCamera || !justification) && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!selectedCamera || !justification}
            >
              <Text style={styles.submitButtonText}>Kirim Permintaan</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
            <Text style={styles.successTitle}>Permintaan Terkirim</Text>
            <Text style={styles.successText}>
              Permintaan akses CCTV Anda telah dikirim dan sedang menunggu persetujuan.
              Anda akan diberi tahu setelah permintaan ditinjau.
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
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
  textArea: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
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
  disabledButton: {
    backgroundColor: '#cccccc',
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