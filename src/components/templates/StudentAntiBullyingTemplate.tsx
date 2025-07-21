import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function StudentAntiBullying() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edukasi Anti-Perundungan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://placehold.co/600x200/005e7a/ffffff?text=Stop+Bullying' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Bersama Hentikan Perundungan</Text>
            <Text style={styles.bannerSubtitle}>Mari ciptakan lingkungan sekolah yang aman dan nyaman untuk semua</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apa itu Perundungan?</Text>
          <Text style={styles.paragraph}>
            Perundungan (bullying) adalah perilaku agresif yang disengaja dan berulang yang melibatkan ketidakseimbangan kekuatan. 
            Perundungan dapat berupa fisik, verbal, sosial, atau melalui media digital (cyberbullying).
          </Text>
          
          <View style={styles.bulletPointContainer}>
            <View style={styles.bulletPoint}>
              <FontAwesome5 name="fist-raised" size={20} color="#e74c3c" style={styles.bulletIcon} />
              <View style={styles.bulletTextContainer}>
                <Text style={styles.bulletTitle}>Perundungan Fisik</Text>
                <Text style={styles.bulletText}>Memukul, menendang, mendorong, atau menyakiti secara fisik</Text>
              </View>
            </View>
            
            <View style={styles.bulletPoint}>
              <FontAwesome5 name="comment-slash" size={20} color="#f39c12" style={styles.bulletIcon} />
              <View style={styles.bulletTextContainer}>
                <Text style={styles.bulletTitle}>Perundungan Verbal</Text>
                <Text style={styles.bulletText}>Mengejek, menghina, mengancam, atau memanggil dengan nama yang menyakitkan</Text>
              </View>
            </View>
            
            <View style={styles.bulletPoint}>
              <FontAwesome5 name="users-slash" size={20} color="#9b59b6" style={styles.bulletIcon} />
              <View style={styles.bulletTextContainer}>
                <Text style={styles.bulletTitle}>Perundungan Sosial</Text>
                <Text style={styles.bulletText}>Mengucilkan, menyebarkan rumor, atau merusak reputasi seseorang</Text>
              </View>
            </View>
            
            <View style={styles.bulletPoint}>
              <FontAwesome5 name="mobile-alt" size={20} color="#3498db" style={styles.bulletIcon} />
              <View style={styles.bulletTextContainer}>
                <Text style={styles.bulletTitle}>Cyberbullying</Text>
                <Text style={styles.bulletText}>Perundungan melalui media sosial, pesan, atau platform digital lainnya</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tanda-tanda Perundungan</Text>
          <Text style={styles.paragraph}>
            Penting untuk mengenali tanda-tanda bahwa seseorang sedang mengalami perundungan:
          </Text>
          
          <View style={styles.warningSignsContainer}>
            <View style={styles.warningSign}>
              <Ionicons name="sad" size={24} color="#e74c3c" />
              <Text style={styles.warningSignText}>Perubahan perilaku atau suasana hati</Text>
            </View>
            <View style={styles.warningSign}>
              <Ionicons name="school" size={24} color="#e74c3c" />
              <Text style={styles.warningSignText}>Tidak mau pergi ke sekolah</Text>
            </View>
            <View style={styles.warningSign}>
              <Ionicons name="people" size={24} color="#e74c3c" />
              <Text style={styles.warningSignText}>Kehilangan teman atau menarik diri</Text>
            </View>
            <View style={styles.warningSign}>
              <Ionicons name="medical" size={24} color="#e74c3c" />
              <Text style={styles.warningSignText}>Luka atau cedera yang tidak dapat dijelaskan</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apa yang Harus Dilakukan?</Text>
          
          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <FontAwesome5 name="shield-alt" size={24} color="#27ae60" />
              <Text style={styles.actionTitle}>Jika Kamu Mengalami Perundungan</Text>
            </View>
            <View style={styles.actionSteps}>
              <Text style={styles.actionStep}>1. Jangan diam, ceritakan kepada orang dewasa yang dipercaya</Text>
              <Text style={styles.actionStep}>2. Catat kejadian yang terjadi (waktu, tempat, pelaku)</Text>
              <Text style={styles.actionStep}>3. Jangan membalas dengan kekerasan</Text>
              <Text style={styles.actionStep}>4. Cari dukungan dari teman dan keluarga</Text>
            </View>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <FontAwesome5 name="eye" size={24} color="#3498db" />
              <Text style={styles.actionTitle}>Jika Kamu Melihat Perundungan</Text>
            </View>
            <View style={styles.actionSteps}>
              <Text style={styles.actionStep}>1. Jangan hanya menjadi penonton</Text>
              <Text style={styles.actionStep}>2. Bantu korban dengan aman</Text>
              <Text style={styles.actionStep}>3. Laporkan kepada guru atau orang dewasa</Text>
              <Text style={styles.actionStep}>4. Dukung korban dan jangan ikut menyebarkan rumor</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontak Darurat</Text>
          <View style={styles.emergencyContactsContainer}>
            <TouchableOpacity style={styles.emergencyContact} onPress={() => openLink('tel:+62-800-123-4567')}>
              <Ionicons name="call" size={24} color="#27ae60" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Hotline Sekolah</Text>
                <Text style={styles.contactNumber}>0800-123-4567</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.emergencyContact} onPress={() => openLink('mailto:help@school.edu')}>
              <Ionicons name="mail" size={24} color="#3498db" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Email Konseling</Text>
                <Text style={styles.contactNumber}>help@school.edu</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumber Daya Tambahan</Text>
          <View style={styles.resourcesContainer}>
            <TouchableOpacity style={styles.resourceItem} onPress={() => openLink('https://example.com/anti-bullying-guide')}>
              <FontAwesome5 name="book" size={20} color="#9b59b6" />
              <Text style={styles.resourceText}>Panduan Lengkap Anti-Perundungan</Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceItem} onPress={() => openLink('https://example.com/support-groups')}>
              <FontAwesome5 name="users" size={20} color="#e67e22" />
              <Text style={styles.resourceText}>Grup Dukungan Online</Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceItem} onPress={() => openLink('https://example.com/report-bullying')}>
              <FontAwesome5 name="flag" size={20} color="#e74c3c" />
              <Text style={styles.resourceText}>Laporkan Perundungan</Text>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.motivationalSection}>
          <FontAwesome5 name="heart" size={40} color="#e74c3c" />
          <Text style={styles.motivationalTitle}>Ingat!</Text>
          <Text style={styles.motivationalText}>
            Kamu tidak sendirian. Setiap orang berhak merasa aman dan dihormati. 
            Jangan ragu untuk mencari bantuan ketika membutuhkannya.
          </Text>
        </View>

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
  bannerContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 94, 122, 0.7)',
    padding: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 16,
  },
  bulletPointContainer: {
    marginTop: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bulletIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  bulletTextContainer: {
    flex: 1,
  },
  bulletTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  warningSignsContainer: {
    marginTop: 8,
  },
  warningSign: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  warningSignText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  actionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 12,
  },
  actionSteps: {
    marginLeft: 36,
  },
  actionStep: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  emergencyContactsContainer: {
    marginTop: 8,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: '#666666',
  },
  resourcesContainer: {
    marginTop: 8,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  resourceText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  motivationalSection: {
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 12,
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
  },
});
