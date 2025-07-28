import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
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
      title: 'Hotline Anti-Perundungan',
      description: 'Hubungi layanan konseling 24/7 untuk mendapatkan bantuan segera.',
      type: 'contact',
      url: 'tel:+62-800-123-4567',
    },
    {
      id: '6',
      title: 'Konselor Sekolah',
      description: 'Jadwalkan pertemuan dengan konselor sekolah untuk mendiskusikan kekhawatiran Anda.',
      type: 'contact',
      url: 'mailto:counselor@school.edu',
    },
  ];

  const filteredResources = resources.filter(resource => {
    if (activeTab === 'all') return true;
    if (activeTab === 'articles') return resource.type === 'article';
    if (activeTab === 'videos') return resource.type === 'video';
    if (activeTab === 'contacts') return resource.type === 'contact';
    return false;
  });

  const handleResourcePress = (resource: ResourceItem) => {
    if (resource.url) {
      Linking.openURL(resource.url);
    }
  };

  const renderResourceItem = (resource: ResourceItem) => (
    <TouchableOpacity
      key={resource.id}
      style={styles.resourceItem}
      onPress={() => handleResourcePress(resource)}
    >
      <View style={styles.resourceContent}>
        <View style={styles.resourceHeader}>
          <View style={[styles.resourceTypeIcon, { backgroundColor: getTypeColor(resource.type) }]}>
            {getTypeIcon(resource.type)}
          </View>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceType}>{getTypeLabel(resource.type)}</Text>
          </View>
        </View>
        <Text style={styles.resourceDescription}>{resource.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888888" />
    </TouchableOpacity>
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return '#e6f7ff';
      case 'video': return '#fff2e6';
      case 'contact': return '#f6ffed';
      default: return '#f5f5f5';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <Ionicons name="document-text" size={20} color="#005e7a" />;
      case 'video':
        return <Ionicons name="play-circle" size={20} color="#ff9800" />;
      case 'contact':
        return <Ionicons name="call" size={20} color="#4caf50" />;
      default:
        return <Ionicons name="information-circle" size={20} color="#888888" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Artikel';
      case 'video': return 'Video';
      case 'contact': return 'Kontak';
      default: return 'Lainnya';
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
        <Text style={styles.headerTitle}>Sumber Daya Anti-Perundungan</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Semua
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'articles' && styles.activeTab]}
          onPress={() => setActiveTab('articles')}
        >
          <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>
            Artikel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
            Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contacts' && styles.activeTab]}
          onPress={() => setActiveTab('contacts')}
        >
          <Text style={[styles.tabText, activeTab === 'contacts' && styles.activeTabText]}>
            Kontak
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resourcesList}>
          {filteredResources.map(renderResourceItem)}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#005e7a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#005e7a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resourcesList: {
    paddingBottom: 20,
  },
  resourceItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
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
  resourceType: {
    fontSize: 12,
    color: '#888888',
    textTransform: 'uppercase',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
