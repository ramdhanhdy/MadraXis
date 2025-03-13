import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'contact';
  url?: string;
  imageUrl?: string;
}

export default function AntiBullyingResources() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'videos' | 'contacts'>('all');

  const resources: ResourceItem[] = [
    {
      id: '1',
      title: 'Mengenali Tanda-tanda Perundungan',
      description: 'Pelajari cara mengidentifikasi tanda-tanda bahwa anak Anda mungkin mengalami perundungan dan langkah-langkah yang dapat Anda ambil untuk membantu.',
      type: 'article',
      url: 'https://example.com/bullying-signs',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Cara Berbicara dengan Anak Anda tentang Perundungan',
      description: 'Panduan untuk memulai percakapan yang sulit namun penting dengan anak Anda tentang perundungan.',
      type: 'article',
      url: 'https://example.com/talking-about-bullying',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      title: 'Memahami Perundungan Siber',
      description: 'Video informatif tentang perundungan siber dan cara melindungi anak Anda di dunia digital.',
      type: 'video',
      url: 'https://example.com/cyberbullying-video',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      title: 'Membangun Ketahanan pada Anak-anak',
      description: 'Webinar tentang cara membantu anak-anak mengembangkan ketahanan dan keterampilan mengatasi masalah.',
      type: 'video',
      url: 'https://example.com/resilience-webinar',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '5',
      title: 'Hotline Konseling Sekolah',
      description: 'Hubungi konselor sekolah kami untuk mendapatkan dukungan dan saran tentang masalah perundungan.',
      type: 'contact',
      url: 'tel:+6281234567890',
    },
    {
      id: '6',
      title: 'Komisi Perlindungan Anak Indonesia (KPAI)',
      description: 'Sumber daya nasional untuk perlindungan anak dan masalah perundungan.',
      type: 'contact',
      url: 'https://www.kpai.go.id',
    },
  ];

  const filteredResources = activeTab === 'all' 
    ? resources 
    : resources.filter(item => {
        if (activeTab === 'articles') return item.type === 'article';
        if (activeTab === 'videos') return item.type === 'video';
        if (activeTab === 'contacts') return item.type === 'contact';
        return true;
      });

  const handleOpenResource = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Tidak dapat membuka URL:', err);
      alert('Tidak dapat membuka tautan. Silakan coba lagi nanti.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sumber Daya Anti-Perundungan</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.infoBox}>
        <MaterialIcons name="info-outline" size={24} color="#005e7a" />
        <Text style={styles.infoText}>
          Kami berkomitmen untuk menciptakan lingkungan yang aman dan mendukung bagi semua siswa.
          Gunakan sumber daya ini untuk membantu anak Anda mengatasi dan mencegah perundungan.
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'articles' && styles.activeTab]} 
          onPress={() => setActiveTab('articles')}
        >
          <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>Artikel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]} 
          onPress={() => setActiveTab('videos')}
        >
          <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'contacts' && styles.activeTab]} 
          onPress={() => setActiveTab('contacts')}
        >
          <Text style={[styles.tabText, activeTab === 'contacts' && styles.activeTabText]}>Kontak</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {filteredResources.map(resource => (
          <TouchableOpacity 
            key={resource.id} 
            style={styles.resourceCard}
            onPress={() => resource.url ? handleOpenResource(resource.url) : null}
          >
            <View style={styles.resourceContent}>
              {resource.type === 'article' && (
                <FontAwesome5 name="file-alt" size={24} color="#005e7a" style={styles.resourceIcon} />
              )}
              {resource.type === 'video' && (
                <FontAwesome5 name="video" size={24} color="#005e7a" style={styles.resourceIcon} />
              )}
              {resource.type === 'contact' && (
                <FontAwesome5 name="phone-alt" size={24} color="#005e7a" style={styles.resourceIcon} />
              )}
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
                <Text style={styles.resourceLink}>
                  {resource.type === 'article' && 'Baca artikel'}
                  {resource.type === 'video' && 'Tonton video'}
                  {resource.type === 'contact' && 'Hubungi sekarang'}
                </Text>
              </View>
            </View>
            {resource.imageUrl && (
              <Image source={{ uri: resource.imageUrl }} style={styles.resourceImage} />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.emergencySection}>
          <Text style={styles.emergencySectionTitle}>Sumber Daya Darurat</Text>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => Linking.openURL('tel:119')}
          >
            <FontAwesome5 name="phone" size={20} color="#ffffff" />
            <Text style={styles.emergencyButtonText}>Telepon Hotline Darurat Anak (119)</Text>
          </TouchableOpacity>
          
          <Text style={styles.additionalInfo}>
            Jika anak Anda dalam bahaya langsung atau mengalami krisis, segera hubungi layanan darurat.
            Untuk masalah perundungan yang memerlukan perhatian segera di sekolah, silakan hubungi kepala sekolah
            atau konselor sekolah kami.
          </Text>
        </View>

        <View style={styles.schoolPolicySection}>
          <Text style={styles.schoolPolicySectionTitle}>Kebijakan Sekolah tentang Perundungan</Text>
          <Text style={styles.schoolPolicyText}>
            Sekolah kami memiliki kebijakan toleransi nol terhadap perundungan. Semua laporan perundungan
            diselidiki secara menyeluruh, dan tindakan yang sesuai akan diambil untuk memastikan keselamatan
            dan kesejahteraan semua siswa kami.
          </Text>
          <TouchableOpacity 
            style={styles.policyButton}
            onPress={() => alert('Dokumen kebijakan akan ditampilkan di sini')}
          >
            <Text style={styles.policyButtonText}>Lihat Kebijakan Lengkap</Text>
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
  introContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005e7a',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  emergencyContainer: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyContent: {
    flex: 1,
    marginLeft: 12,
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
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#005e7a',
  },
  resourceItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  resourceLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceLink: {
    fontSize: 14,
    color: '#005e7a',
    fontWeight: '600',
    marginLeft: 6,
  },
  supportContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  supportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    padding: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  activeTabText: {
    color: '#005e7a',
  },
  resourceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIcon: {
    marginRight: 16,
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  emergencySection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  emergencySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  additionalInfo: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
  schoolPolicySection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  schoolPolicySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  schoolPolicyText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  policyButton: {
    backgroundColor: '#005e7a',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  policyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 