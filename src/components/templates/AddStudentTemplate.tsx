import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const classes = [
  'Tahfidz Al-Baqarah',
  'Tahfidz Al-Imran',
  'Tahfidz An-Nisa',
  'Tahfidz Al-Maidah',
];

const genderOptions = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

export default function AddStudent() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId: string }>();
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialVerses, setInitialVerses] = useState('0');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama siswa harus diisi');
      return;
    }
    
    if (!selectedClass) {
      Alert.alert('Error', 'Kelas harus dipilih');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to save the student
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      Alert.alert(
        'Sukses',
        'Siswa berhasil ditambahkan',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal menambahkan siswa. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Siswa Baru</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Dasar</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Lengkap *</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama lengkap siswa"
              placeholderTextColor="#999999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jenis Kelamin *</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    gender === option.value && styles.selectedGenderOption
                  ]}
                  onPress={() => setGender(option.value)}
                >
                  <Ionicons 
                    name={gender === option.value ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color="#005e7a" 
                  />
                  <Text style={styles.genderOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tanggal Lahir</Text>
            <TextInput
              style={styles.textInput}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kelas *</Text>
            <View style={styles.classContainer}>
              {classes.map((className) => (
                <TouchableOpacity
                  key={className}
                  style={[
                    styles.classOption,
                    selectedClass === className && styles.selectedClassOption
                  ]}
                  onPress={() => setSelectedClass(className)}
                >
                  <Text style={[
                    styles.classOptionText,
                    selectedClass === className && styles.selectedClassOptionText
                  ]}>
                    {className}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Parent Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Orang Tua</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Orang Tua/Wali</Text>
            <TextInput
              style={styles.textInput}
              value={parentName}
              onChangeText={setParentName}
              placeholder="Masukkan nama orang tua/wali"
              placeholderTextColor="#999999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>No. Telepon</Text>
            <TextInput
              style={styles.textInput}
              value={parentPhone}
              onChangeText={setParentPhone}
              placeholder="Masukkan nomor telepon"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Alamat</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Masukkan alamat lengkap"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Akademik</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hafalan Awal (Jumlah Ayat)</Text>
            <TextInput
              style={styles.textInput}
              value={initialVerses}
              onChangeText={setInitialVerses}
              placeholder="0"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Catatan Tambahan</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Catatan khusus tentang siswa (opsional)"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!name.trim() || !selectedClass || isLoading) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!name.trim() || !selectedClass || isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Menyimpan...' : 'Simpan Siswa'}
          </Text>
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
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
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
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedGenderOption: {
    // Additional styling for selected gender if needed
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  classContainer: {
    gap: 8,
  },
  classOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  selectedClassOption: {
    backgroundColor: '#005e7a',
    borderColor: '#005e7a',
  },
  classOptionText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  selectedClassOptionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
