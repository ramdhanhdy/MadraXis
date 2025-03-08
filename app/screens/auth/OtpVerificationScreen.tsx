import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
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

export default function OtpVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Pindah ke input berikutnya jika ada teks
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // Pindah ke input sebelumnya jika backspace dan input kosong
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 5) {
      alert('Mohon masukkan kode OTP 5 digit');
      return;
    }
    
    // Simulasi verifikasi berhasil
    router.push('screens/dashboard/home' as any);
  };

  const handleResendOtp = () => {
    if (canResend) {
      // Reset OTP dan timer
      setOtp(['', '', '', '', '']);
      setTimer(60);
      setCanResend(false);
      
      // Simulasi pengiriman ulang OTP
      alert('Kode OTP baru telah dikirim ke email Anda');
    }
  };

  const handleChangeEmail = () => {
    // Kembali ke layar login/register
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgXml xml={logoSvg} width={80} height={80} />
        <Text style={styles.appName}>Pondok Pesantren Tahfidz ZAID BIN TSAABIT</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verifikasi Akun Anda</Text>
        
        <Text style={styles.description}>
          Kode verifikasi 5 digit telah dikirim ke email Anda
          <Text style={styles.email}> user@example.com </Text>
          <TouchableOpacity onPress={handleChangeEmail}>
            <Text style={styles.changeLink}>Ubah</Text>
          </TouchableOpacity>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={styles.otpInput}
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          Kode OTP akan kedaluwarsa dalam {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
        </Text>

        <TouchableOpacity 
          style={styles.resendContainer} 
          onPress={handleResendOtp}
          disabled={!canResend}
        >
          <Text style={[styles.resendText, !canResend && styles.disabledText]}>
            Tidak menerima kode? Kirim Ulang
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verifikasi</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 40,
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
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  email: {
    fontWeight: 'bold',
  },
  changeLink: {
    color: '#f0c75e',
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 20,
  },
  resendContainer: {
    marginBottom: 30,
  },
  resendText: {
    color: '#005e7a',
    fontSize: 16,
  },
  disabledText: {
    color: '#cccccc',
  },
  verifyButton: {
    backgroundColor: '#005e7a',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 