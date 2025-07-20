import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Import SVG as string
const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="100" cy="100" r="95" fill="#005e7a" />
  <circle cx="100" cy="100" r="85" fill="#ffffff" />
  
  <!-- Open Book Symbol -->
  <path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill="#ffffff" />
  
  <!-- Arabic-inspired Decorative Element -->
  <path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill="#f0c75e" />
  <path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill="#f0c75e" />
  <path d="M120 45C120 45 110 50 120 55C130 50 120 45 120 45Z" fill="#f0c75e" />
  
  <!-- Text "ZBT" -->
  <path d="M70 160H130V170H70V160Z" fill="#005e7a" />
  <path d="M70 160L130 160L100 145L70 160Z" fill="#005e7a" />
  <path d="M85 170V180H115V170" stroke="#005e7a" stroke-width="10" stroke-linecap="round" />
</svg>`;

export default function SchoolRegisterScreen() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState('');
  const [npsn, setNpsn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleRegister = () => {
    // Validasi sederhana
    if (!schoolName || !npsn || !email || !password || !confirmPassword) {
      alert('Mohon isi semua field');
      return;
    }

    if (password !== confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (!agreeToTerms) {
      alert('Anda harus menyetujui syarat dan ketentuan');
      return;
    }
    
    // Simulasi pendaftaran berhasil
    router.push('/screens/auth/login' as any);
  };

  const handleLogin = () => {
    router.push('screens/auth/login' as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgXml xml={logoSvg} width={80} height={80} />
        <Text style={styles.appName}>Pondok Pesantren Tahfidz ZAID BIN TSAABIT</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab]} 
          onPress={handleLogin}
        >
          <Text style={[styles.tabText]}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, styles.activeTab]} 
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Daftar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nama Sekolah</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama sekolah"
            value={schoolName}
            onChangeText={setSchoolName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>NPSN</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan NPSN sekolah"
            value={npsn}
            onChangeText={setNpsn}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email sekolah"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ulangi Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan ulang password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.termsContainer}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            {agreeToTerms && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            Saya telah membaca dan menyetujui syarat dan ketentuan yang berlaku
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.registerButton, !agreeToTerms && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={!agreeToTerms}
        >
          <Text style={styles.registerButtonText}>Daftar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005e7a',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 16,
    color: '#888888',
  },
  activeTabText: {
    color: '#005e7a',
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#005e7a',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#005e7a',
    borderRadius: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#555555',
  },
  registerButton: {
    backgroundColor: '#f0c75e',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 