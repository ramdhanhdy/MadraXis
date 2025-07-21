import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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

  const validateDateRange = () => {
    if (!startDate || !endDate) return false;
    
    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    const maxAllowedDays = 7;
    const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / DAY_IN_MS);
    
    return daysDifference > 0 && daysDifference <= maxAllowedDays;
  };

  const validateJustification = () => {
    const trimmed = justification.trim();
    return trimmed.length >= 20 && trimmed.length <= 500;
  };

  // Enhanced validation based on UI guidelines
  const MAX_JUSTIFICATION_LENGTH = 500;
  const MAX_DATE_RANGE_DAYS = 90; // Maximum 90 days allowed
  const MIN_DATE_RANGE_DAYS = 1; // Minimum 1 day required

  const isFormValid = () => {
    const trimmedJustification = justification.trim();
    if (trimmedJustification.length < 10 || trimmedJustification.length > MAX_JUSTIFICATION_LENGTH) {
      return false;
    }
    if (!selectedCamera) return false;
    
    // Date range validation
    if (!startDate || !endDate) return false;
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) return false;

    const daysDiff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < MIN_DATE_RANGE_DAYS || daysDiff > MAX_DATE_RANGE_DAYS) return false;

    // Ensure dates are not in the future
    if (new Date(startDate).getTime() > new Date().getTime()) return false;
    if (new Date(endDate).getTime() > new Date().getTime()) return false;

    return true;
  };

  const getDateError = () => {
    if (!startDate || !endDate) return null;
    
    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / DAY_IN_MS);
    
    if (daysDifference <= 0) {
      return 'Tanggal selesai harus setelah tanggal mulai';
    }
    if (daysDifference > 7) {
      return 'Maksimal 7 hari akses diperbolehkan';
    }
    return null;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    
    // In a real app, this would send the request to the backend
    setSubmitted(true);
    
    // Reset form after 3 seconds and navigate back
    setTimeout(() => {
      router.back();
    }, 3000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.successTitle}>Permintaan Berhasil Dikirim!</Text>
          <Text style={styles.successMessage}>
            Permintaan akses CCTV Anda telah diterima dan akan diproses oleh tim keamanan sekolah.
            Anda akan mendapat notifikasi melalui aplikasi ketika permintaan telah disetujui atau ditolak.
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
        <Text style={styles.headerTitle}>Permintaan Akses CCTV</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <Text style={styles.infoTitle}>Informasi Penting</Text>
          </View>
          <Text style={styles.infoText}>
            Permintaan akses CCTV hanya dapat diajukan untuk keperluan yang berkaitan dengan keamanan dan kesejahteraan anak Anda di sekolah. 
            Semua permintaan akan ditinjau oleh tim keamanan sekolah.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Detail Permintaan</Text>
          
          {/* Camera Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Lokasi Kamera *</Text>
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

          {/* Date Range */}
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputGroup}>
              <Text style={styles.inputLabel}>Tanggal Mulai *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                <Ionicons name="calendar" size={20} color="#666666" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputGroup}>
              <Text style={styles.inputLabel}>Tanggal Selesai *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                <Ionicons name="calendar" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Justification */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Alasan Permintaan *</Text>
            <TextInput
              style={styles.textArea}
              value={justification}
              onChangeText={setJustification}
              placeholder="Jelaskan alasan Anda memerlukan akses rekaman CCTV (minimal 10, maksimal 500 karakter)..."
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {justification.trim().length}/500 karakter (minimal 10)
            </Text>
          </View>

          {/* Guidelines */}
          <View style={styles.guidelinesSection}>
            <Text style={styles.guidelinesTitle}>Panduan Permintaan:</Text>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>Permintaan harus berkaitan dengan keamanan anak</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>Maksimal rentang waktu 7 hari</Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.guidelineText}>Proses persetujuan 1-3 hari kerja</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            !isFormValid() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid()}
        >
          <Text style={styles.submitButtonText}>Kirim Permintaan</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event: any, selectedDate?: Date) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event: any, selectedDate?: Date) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
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
    backgroundColor: '#e6f7ff',
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
    color: '#2196F3',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#005e7a',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  picker: {
    height: 50,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInputGroup: {
    flex: 0.48,
  },
  dateInput: {
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
    fontSize: 14,
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
    backgroundColor: '#ffffff',
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
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});
