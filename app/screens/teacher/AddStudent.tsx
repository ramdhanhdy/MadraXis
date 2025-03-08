import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddStudent() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId: string }>();
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const handleSave = () => {
    if (!name) {
      Alert.alert('Error', 'Nama siswa harus diisi');
      return;
    }
    
    // In a real app, this would be an API call to save the student
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
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nama Lengkap <Text style={styles.requiredStar}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Jenis Kelamin</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setGender('Laki-laki')}
              >
                <View style={[
                  styles.radioButton,
                  gender === 'Laki-laki' && styles.radioButtonSelected
                ]}>
                  {gender === 'Laki-laki' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Laki-laki</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setGender('Perempuan')}
              >
                <View style={[
                  styles.radioButton,
                  gender === 'Perempuan' && styles.radioButtonSelected
                ]}>
                  {gender === 'Perempuan' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Perempuan</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tanggal Lahir</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={birthDate}
              onChangeText={setBirthDate}
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informasi Kontak</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nama Orang Tua</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama orang tua"
              value={parentName}
              onChangeText={setParentName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nomor Telepon</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nomor telepon"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Alamat</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Masukkan alamat lengkap"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informasi Hafalan</Text>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#005e7a" />
            <Text style={styles.infoText}>
              Informasi hafalan akan diisi setelah siswa mulai menyetorkan hafalan.
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  requiredStar: {
    color: '#ff0000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: '#005e7a',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#005e7a',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333333',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#888888',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#005e7a',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
}); 