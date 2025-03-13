import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AntiBullying() {
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
                <Text style={styles.bulletText}>Memukul, mendorong, menendang, atau merusak barang milik orang lain</Text>
              </View>
            </View>
            
            <View style={styles.bulletPoint}>
              <FontAwesome5 name="comment-alt" size={20} color="#f39c12" style={styles.bulletIcon} />
              <View style={styles.bulletTextContainer}>
                <Text style={styles.bulletTitle}>Perundungan Verbal</Text>
                <Text style={styles.bulletText}>Mengejek, menghina, mengancam, atau memberi julukan yang menyakitkan</Text>
              </View>
            </View>
            
            <View style={styles.bulletPoint}>
              <FontAwesome5 name="users" size={20} color="#3498db" style={styles.bulletIcon} />
              <View style={styles.bulletTextContainer}>
                <Text style={styles.bulletTitle}>Perundungan Sosial</Text>
                <Text style={styles.bulletText}>Mengucilkan, menyebarkan rumor, atau memanipulasi hubungan sosial</Text>
              </View>
            </View>
            
            <View style={styles.bulletPoint}>
              <FontAwesome5 name="mobile-alt" size={20} color="#9b59b6" style={styles.bulletIcon} />
              <View style={styles.bulletTextContainer}>
                <Text style={styles.bulletTitle}>Perundungan Siber</Text>
                <Text style={styles.bulletText}>Mengirim pesan jahat, menyebarkan foto/video tanpa izin, atau mengintimidasi online</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dampak Perundungan pada Korban</Text>
          <Text style={styles.paragraph}>
            Perundungan dapat menyebabkan dampak serius dan jangka panjang pada korban. Memahami dampak ini membantu kita menyadari betapa pentingnya mencegah perundungan.
          </Text>
          
          <View style={styles.impactContainer}>
            <View style={styles.impactCard}>
              <View style={[styles.impactIcon, { backgroundColor: '#e74c3c' }]}>
                <FontAwesome5 name="heart-broken" size={24} color="#ffffff" />
              </View>
              <Text style={styles.impactTitle}>Dampak Emosional</Text>
              <Text style={styles.impactText}>
                • Merasa sedih dan kesepian{'\n'}
                • Kehilangan kepercayaan diri{'\n'}
                • Merasa malu dan terhina{'\n'}
                • Mengalami kecemasan dan depresi
              </Text>
            </View>
            
            <View style={styles.impactCard}>
              <View style={[styles.impactIcon, { backgroundColor: '#3498db' }]}>
                <FontAwesome5 name="brain" size={24} color="#ffffff" />
              </View>
              <Text style={styles.impactTitle}>Dampak Akademis</Text>
              <Text style={styles.impactText}>
                • Kesulitan berkonsentrasi{'\n'}
                • Nilai menurun{'\n'}
                • Takut pergi ke sekolah{'\n'}
                • Kehilangan minat belajar
              </Text>
            </View>
            
            <View style={styles.impactCard}>
              <View style={[styles.impactIcon, { backgroundColor: '#9b59b6' }]}>
                <FontAwesome5 name="users" size={24} color="#ffffff" />
              </View>
              <Text style={styles.impactTitle}>Dampak Sosial</Text>
              <Text style={styles.impactText}>
                • Kesulitan berteman{'\n'}
                • Menarik diri dari pergaulan{'\n'}
                • Takut berinteraksi dengan orang lain{'\n'}
                • Kehilangan kepercayaan pada orang lain
              </Text>
            </View>
            
            <View style={styles.impactCard}>
              <View style={[styles.impactIcon, { backgroundColor: '#f39c12' }]}>
                <FontAwesome5 name="user-shield" size={24} color="#ffffff" />
              </View>
              <Text style={styles.impactTitle}>Dampak Jangka Panjang</Text>
              <Text style={styles.impactText}>
                • Trauma yang berkelanjutan{'\n'}
                • Kesulitan dalam hubungan di masa depan{'\n'}
                • Risiko masalah kesehatan mental{'\n'}
                • Dampak pada perkembangan kepribadian
              </Text>
            </View>
          </View>
          
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>
              "Luka fisik bisa sembuh dalam hitungan hari, tapi luka dari kata-kata bisa bertahan seumur hidup."
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kenali Tanda-tanda Perundungan</Text>
          
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <MaterialIcons name="visibility" size={24} color="#005e7a" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Jika Kamu Melihat</Text>
              <Text style={styles.cardText}>
                • Seseorang diperlakukan kasar secara berulang{'\n'}
                • Seseorang diejek atau dihina{'\n'}
                • Seseorang dikucilkan dari kelompok{'\n'}
                • Seseorang terlihat takut atau cemas
              </Text>
            </View>
            
            <View style={styles.card}>
              <MaterialIcons name="sentiment-very-dissatisfied" size={24} color="#005e7a" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Jika Kamu Mengalami</Text>
              <Text style={styles.cardText}>
                • Merasa takut pergi ke sekolah{'\n'}
                • Kehilangan barang atau uang{'\n'}
                • Mendapat pesan atau komentar jahat{'\n'}
                • Merasa sedih, cemas, atau kesepian
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apa yang Harus Dilakukan?</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Bicara dengan Orang Dewasa yang Dipercaya</Text>
                <Text style={styles.stepText}>
                  Ceritakan kepada guru, pembimbing asrama, orang tua, atau orang dewasa lain yang kamu percaya.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Laporkan Melalui Aplikasi</Text>
                <Text style={styles.stepText}>
                  Gunakan fitur "Lapor Masalah" di aplikasi ini untuk melaporkan kejadian perundungan.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Dukung Korban Perundungan</Text>
                <Text style={styles.stepText}>
                  Jika kamu melihat seseorang dirundung, tunjukkan dukungan dan bantuan kepadanya.
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Jangan Membalas dengan Kekerasan</Text>
                <Text style={styles.stepText}>
                  Membalas dengan kekerasan hanya akan memperburuk situasi. Cari bantuan dari orang dewasa.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membangun Budaya Pertemanan yang Mendukung</Text>
          <Text style={styles.paragraph}>
            Kita semua memiliki peran dalam menciptakan lingkungan yang aman dan mendukung. Berikut adalah cara-cara untuk membangun budaya pertemanan yang positif:
          </Text>
          
          <View style={styles.friendshipContainer}>
            <View style={styles.friendshipCard}>
              <Image 
                source={{ uri: 'https://placehold.co/300x200/4CAF50/ffffff?text=Empati' }} 
                style={styles.friendshipImage}
              />
              <View style={styles.friendshipContent}>
                <Text style={styles.friendshipTitle}>Tumbuhkan Empati</Text>
                <Text style={styles.friendshipText}>
                  Cobalah memahami perasaan orang lain. Bayangkan bagaimana rasanya jika kamu berada di posisi mereka. Empati adalah langkah pertama untuk mencegah perundungan.
                </Text>
              </View>
            </View>
            
            <View style={styles.friendshipCard}>
              <Image 
                source={{ uri: 'https://placehold.co/300x200/2196F3/ffffff?text=Inklusi' }} 
                style={styles.friendshipImage}
              />
              <View style={styles.friendshipContent}>
                <Text style={styles.friendshipTitle}>Praktikkan Inklusi</Text>
                <Text style={styles.friendshipText}>
                  Ajak semua orang untuk bergabung dalam aktivitas. Jangan biarkan siapapun merasa dikucilkan. Ingat, perbedaan membuat kita semua istimewa.
                </Text>
              </View>
            </View>
            
            <View style={styles.friendshipCard}>
              <Image 
                source={{ uri: 'https://placehold.co/300x200/FF9800/ffffff?text=Komunikasi' }} 
                style={styles.friendshipImage}
              />
              <View style={styles.friendshipContent}>
                <Text style={styles.friendshipTitle}>Komunikasi dengan Baik</Text>
                <Text style={styles.friendshipText}>
                  Gunakan kata-kata yang baik dan positif. Dengarkan dengan sungguh-sungguh saat orang lain berbicara. Komunikasi yang baik membangun hubungan yang kuat.
                </Text>
              </View>
            </View>
            
            <View style={styles.friendshipCard}>
              <Image 
                source={{ uri: 'https://placehold.co/300x200/9C27B0/ffffff?text=Dukungan' }} 
                style={styles.friendshipImage}
              />
              <View style={styles.friendshipContent}>
                <Text style={styles.friendshipTitle}>Berikan Dukungan</Text>
                <Text style={styles.friendshipText}>
                  Dukung temanmu saat mereka sedang kesulitan. Terkadang, hanya dengan mendengarkan dan hadir untuk mereka sudah sangat berarti.
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.activityContainer}>
            <Text style={styles.activityTitle}>Aktivitas Membangun Pertemanan</Text>
            <View style={styles.activityCard}>
              <Text style={styles.activityName}>Lingkaran Apresiasi</Text>
              <Text style={styles.activityDescription}>
                Setiap minggu, luangkan waktu untuk memberikan apresiasi kepada teman-temanmu. Katakan hal-hal positif yang kamu sukai dari mereka.
              </Text>
            </View>
            <View style={styles.activityCard}>
              <Text style={styles.activityName}>Proyek Kolaborasi</Text>
              <Text style={styles.activityDescription}>
                Bekerja sama dalam proyek kelompok dengan teman-teman yang belum kamu kenal dengan baik. Ini membantu membangun hubungan baru.
              </Text>
            </View>
            <View style={styles.activityCard}>
              <Text style={styles.activityName}>Janji Pertemanan</Text>
              <Text style={styles.activityDescription}>
                Buat janji dengan teman-temanmu untuk selalu mendukung satu sama lain dan melawan perundungan bersama-sama.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jadilah Bagian dari Solusi</Text>
          
          <View style={styles.roleContainer}>
            <View style={styles.roleCard}>
              <FontAwesome5 name="shield-alt" size={30} color="#ffffff" style={styles.roleIcon} />
              <Text style={styles.roleTitle}>Pembela</Text>
              <Text style={styles.roleText}>
                Berani membela teman yang dirundung dan melaporkan kejadian perundungan.
              </Text>
            </View>
            
            <View style={styles.roleCard}>
              <FontAwesome5 name="hands-helping" size={30} color="#ffffff" style={styles.roleIcon} />
              <Text style={styles.roleTitle}>Pendukung</Text>
              <Text style={styles.roleText}>
                Memberikan dukungan dan persahabatan kepada teman yang menjadi korban perundungan.
              </Text>
            </View>
            
            <View style={styles.roleCard}>
              <FontAwesome5 name="user-friends" size={30} color="#ffffff" style={styles.roleIcon} />
              <Text style={styles.roleTitle}>Teladan</Text>
              <Text style={styles.roleText}>
                Menjadi contoh dengan memperlakukan semua orang dengan baik dan hormat.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumber Daya Tambahan</Text>
          
          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => openLink('https://www.unicef.org/indonesia/id/child-protection/kekerasan-terhadap-anak')}
          >
            <FontAwesome5 name="globe" size={20} color="#ffffff" style={styles.resourceIcon} />
            <Text style={styles.resourceText}>UNICEF Indonesia - Perlindungan Anak</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => openLink('https://www.kemenpppa.go.id/index.php/page/view/38')}
          >
            <FontAwesome5 name="globe" size={20} color="#ffffff" style={styles.resourceIcon} />
            <Text style={styles.resourceText}>Kementerian PPPA - Perlindungan Anak</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => router.push('/student/incident-report')}
        >
          <View style={styles.reportButtonContent}>
            <FontAwesome5 name="file-alt" size={24} color="#ffffff" style={styles.reportIcon} />
            <View style={styles.reportTextContainer}>
              <Text style={styles.reportButtonTitle}>Laporkan Masalah</Text>
              <Text style={styles.reportButtonSubtitle}>Gunakan fitur ini untuk melaporkan kejadian perundungan</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ffffff" />
          </View>
        </TouchableOpacity>
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
  cardContainer: {
    marginTop: 8,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  stepContainer: {
    marginTop: 8,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#005e7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  roleCard: {
    width: '31%',
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  roleIcon: {
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 16,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  resourceIcon: {
    marginRight: 12,
  },
  resourceText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  emergencySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  emergencyContent: {
    marginLeft: 12,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  impactContainer: {
    marginTop: 12,
  },
  impactCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  impactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  impactText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  quoteContainer: {
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#005e7a',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#005e7a',
    lineHeight: 24,
  },
  friendshipContainer: {
    marginTop: 12,
  },
  friendshipCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  friendshipImage: {
    width: '100%',
    height: 150,
  },
  friendshipContent: {
    padding: 16,
  },
  friendshipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  friendshipText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  activityContainer: {
    marginTop: 20,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  activityName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 6,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  reportButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  reportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  reportIcon: {
    marginRight: 16,
  },
  reportTextContainer: {
    flex: 1,
  },
  reportButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reportButtonSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
}); 