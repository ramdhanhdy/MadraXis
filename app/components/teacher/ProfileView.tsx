import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LogoutButton from '../components/auth/LogoutButton';

interface Profile {
  full_name?: string;
  role?: string;
}

interface ProfileViewProps {
  profile?: Profile;
  loading: boolean;
  schoolName: string;
}

export default function ProfileView({ profile, loading, schoolName }: ProfileViewProps) {
  if (loading) {
    return (
      <ScrollView style={styles.contentContainer}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle-outline" size={80} color="#005e7a" />
          <Text style={styles.profileName}>Loading...</Text>
          <Text style={styles.profileRole}>Loading...</Text>
          <Text style={styles.profileSchool}>Loading...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={80} color="#005e7a" />
        <Text style={styles.profileName}>{profile?.full_name || 'Nama Pengguna'}</Text>
        <Text style={styles.profileRole}>
          {profile?.role === 'teacher' ? 'Guru Tahfidz' : profile?.role || 'Role tidak diketahui'}
        </Text>
        <Text style={styles.profileSchool}>{schoolName}</Text>
      </View>
    
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="person" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Edit Profil</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="lock-closed" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Ubah Password</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="notifications" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Pengaturan Notifikasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="language" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Bahasa</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Bantuan</Text>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="help-circle" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Pusat Bantuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="document-text" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Syarat & Ketentuan</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileItem}>
          <Ionicons name="shield-checkmark" size={24} color="#005e7a" />
          <Text style={styles.profileItemText}>Kebijakan Privasi</Text>
          <Ionicons name="chevron-forward" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <LogoutButton variant="button" style={styles.profileLogoutButton} />
      </View>
      
      {/* Bottom Spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    marginTop: 12,
  },
  profileRole: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  profileSchool: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  profileLogoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});