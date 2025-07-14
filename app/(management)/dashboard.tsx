import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { fetchIncidentsForSchool } from '../../src/services/incidents';
import { fetchDashboardMetrics, DashboardMetrics } from '../../src/services/dashboard';
import LogoutButton from '../components/auth/LogoutButton';

// Updated interface to match Supabase query result
interface Incident {
  id: number;
  incident_type: string;
  description: string;
  location: string;
  status: string;
  created_at: string;
  student_name?: string;
  is_anonymous?: boolean;
  reporter: {
    full_name: string;
  }[]; // Array of reporter objects
}

export default function ManagementDashboard() {
  const router = useRouter();
  const { user, profile, signOut, loading: authLoading } = useAuth(); // Use auth context, get loading state
  const [showNotifications, setShowNotifications] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Function to get incident priority color based on type
  const getIncidentPriorityColor = (type: string) => {
    switch(type) {
      case 'bullying':
        return '#e74c3c'; // Red for bullying
      case 'safety':
        return '#f39c12'; // Orange for safety issues
      case 'property':
        return '#3498db'; // Blue for property damage
      default:
        return '#9b59b6'; // Purple for other issues
    }
  };

  // Function to format relative time (e.g. "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} menit yang lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else {
      return `${diffDays} hari yang lalu`;
    }
  };

  // Unified data fetching function to prevent loading state race conditions
  const fetchDashboardData = async () => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }

    // Check both user metadata and profile for school_id
    const rawSchoolId = user.user_metadata?.school_id || profile?.school_id;
    if (rawSchoolId === undefined || rawSchoolId === null) {
      setError('School ID not found for this user.');
      return;
    }

    // Normalize school_id to ensure it's a number, handling all input types
    let schoolId: number;
    if (typeof rawSchoolId === 'string') {
      schoolId = parseInt(rawSchoolId, 10);
    } else if (typeof rawSchoolId === 'number') {
      schoolId = rawSchoolId;
    } else {
      setError('Invalid School ID format for this user.');
      return;
    }

    // Check if the conversion resulted in a valid number (including 0)
    if (isNaN(schoolId) || schoolId < 0) {
      setError('Invalid School ID for this user.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching dashboard data for school ID:', schoolId);

      // Fetch both incidents and metrics concurrently using Promise.all
      const [incidentsResponse, metricsResponse] = await Promise.all([
        fetchIncidentsForSchool(schoolId, 5),
        fetchDashboardMetrics(schoolId)
      ]);

      console.log('Incidents response:', incidentsResponse);
      console.log('Metrics response:', metricsResponse);

      // Handle incidents response
      if (incidentsResponse.data && !incidentsResponse.error) {
        setIncidents(incidentsResponse.data);
      } else {
        console.error('Failed to fetch incidents:', incidentsResponse.error);
        setError(incidentsResponse.error?.message || 'Failed to fetch incidents');
      }

      // Handle metrics response
      if (metricsResponse.data && !metricsResponse.error) {
        setDashboardMetrics(metricsResponse.data);
      } else {
        console.error('Failed to fetch dashboard metrics:', metricsResponse.error);
        // Don't set error for metrics failure, just log it
        console.warn('Dashboard metrics unavailable, continuing with incidents only');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to incident detail
  const navigateToIncidentDetail = (incidentId: number) => {
    console.log('Navigating to incident detail:', incidentId);
    // TODO: Implement navigation to incident detail screen
    Alert.alert('Info', `Detail insiden #${incidentId} akan segera tersedia`);
  };

  // Render profile section
  const renderProfile = () => {
    if (authLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
          <Text style={styles.loadingText}>Memuat profil...</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#005e7a" />
          </View>
          <Text style={styles.profileName}>
            {profile?.full_name || 'Nama Pengguna'}
          </Text>
          <Text style={styles.profileRole}>
            {profile?.role === 'management' ? 'Manajemen Sekolah' : 'Pengguna'}
          </Text>
          <Text style={styles.profileSchool}>Zaid Bin Tsabit</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => Alert.alert('Info', 'Fitur edit profil akan segera hadir!')}
          >
            <Ionicons name="person-outline" size={24} color="#005e7a" />
            <Text style={styles.profileItemText}>Edit Profil</Text>
            <Ionicons name="chevron-forward" size={20} color="#cccccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => Alert.alert('Info', 'Fitur pengaturan notifikasi akan segera hadir!')}
          >
            <Ionicons name="notifications-outline" size={24} color="#005e7a" />
            <Text style={styles.profileItemText}>Pengaturan Notifikasi</Text>
            <Ionicons name="chevron-forward" size={20} color="#cccccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => Alert.alert('Info', 'Fitur pengaturan bahasa akan segera hadir!')}
          >
            <Ionicons name="language-outline" size={24} color="#005e7a" />
            <Text style={styles.profileItemText}>Bahasa</Text>
            <Ionicons name="chevron-forward" size={20} color="#cccccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => Alert.alert('Info', 'Fitur pusat bantuan akan segera hadir!')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#005e7a" />
            <Text style={styles.profileItemText}>Pusat Bantuan</Text>
            <Ionicons name="chevron-forward" size={20} color="#cccccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => Alert.alert('Info', 'Fitur syarat & ketentuan akan segera hadir!')}
          >
            <Ionicons name="document-text-outline" size={24} color="#005e7a" />
            <Text style={styles.profileItemText}>Syarat & Ketentuan</Text>
            <Ionicons name="chevron-forward" size={20} color="#cccccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => Alert.alert('Info', 'Fitur kebijakan privasi akan segera hadir!')}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#005e7a" />
            <Text style={styles.profileItemText}>Kebijakan Privasi</Text>
            <Ionicons name="chevron-forward" size={20} color="#cccccc" />
          </TouchableOpacity>
        </View>

        <LogoutButton />
      </ScrollView>
    );
  };

  // Render dashboard content
  const renderDashboard = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005e7a" />
          <Text style={styles.loadingText}>Memuat data dashboard...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Selamat datang,</Text>
            <Text style={styles.userName}>
              {profile?.full_name || 'Pengguna'}
            </Text>
          </View>
          <TouchableOpacity onPress={toggleNotifications}>
            <Ionicons name="notifications-outline" size={24} color="#005e7a" />
          </TouchableOpacity>
        </View>

        {/* Dashboard Metrics */}
        {dashboardMetrics && (
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{dashboardMetrics.studentEnrollment}</Text>
              <Text style={styles.metricLabel}>Total Siswa</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{dashboardMetrics.teacherCount}</Text>
              <Text style={styles.metricLabel}>Total Guru</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{dashboardMetrics.incidentSummary.total}</Text>
              <Text style={styles.metricLabel}>Total Insiden</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{dashboardMetrics.incidentSummary.pending}</Text>
              <Text style={styles.metricLabel}>Insiden Pending</Text>
            </View>
          </View>
        )}

        {/* Recent Incidents */}
        <View style={styles.incidentsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Insiden Terbaru</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {incidents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#cccccc" />
              <Text style={styles.emptyText}>Tidak ada insiden terbaru</Text>
            </View>
          ) : (
            incidents.slice(0, 5).map((incident) => (
              <TouchableOpacity
                key={incident.id}
                style={styles.incidentItem}
                onPress={() => navigateToIncidentDetail(incident.id)}
              >
                <View 
                  style={[
                    styles.incidentPriority, 
                    { backgroundColor: getIncidentPriorityColor(incident.incident_type) }
                  ]} 
                />
                <View style={styles.incidentContent}>
                  <Text style={styles.incidentTitle}>
                    {incident.incident_type.charAt(0).toUpperCase() + incident.incident_type.slice(1)}
                  </Text>
                  <Text style={styles.incidentDetails} numberOfLines={2}>
                    {incident.description}
                  </Text>
                  <Text style={styles.incidentTime}>
                    {getRelativeTime(incident.created_at)} • {incident.location}
                  </Text>
                </View>
                <TouchableOpacity style={styles.incidentAction}>
                  <Ionicons name="chevron-forward" size={20} color="#cccccc" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionItem}>
              <Ionicons name="add-circle-outline" size={24} color="#005e7a" />
              <Text style={styles.actionText}>Tambah Insiden</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Ionicons name="people-outline" size={24} color="#005e7a" />
              <Text style={styles.actionText}>Kelola Pengguna</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Ionicons name="stats-chart-outline" size={24} color="#005e7a" />
              <Text style={styles.actionText}>Laporan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Ionicons name="settings-outline" size={24} color="#005e7a" />
              <Text style={styles.actionText}>Pengaturan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  // Load data when component mounts or user/profile changes
  useEffect(() => {
    if (user && !authLoading) {
      fetchDashboardData();
    }
  }, [user, profile, authLoading]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Dashboard Manajemen" 
      }} />
      {renderContent()}
      
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dashboard' && styles.activeTabItem]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons 
            name={activeTab === 'dashboard' ? 'home' : 'home-outline'} 
            size={24} 
            color={activeTab === 'dashboard' ? '#005e7a' : '#666666'} 
          />
          <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.activeTabLabel]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTabItem]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons 
            name={activeTab === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={activeTab === 'profile' ? '#005e7a' : '#666666'} 
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
            Profil
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005e7a',
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#005e7a',
  },
  quickActionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  incidentsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 16,
  },
  incidentPriority: {
    width: 4,
    height: '100%',
    marginRight: 12,
  },
  incidentContent: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  incidentDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  incidentTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  incidentAction: {
    padding: 8,
  },
  performanceContainer: {
    margin: 16,
    marginTop: 8,
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#005e7a',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    height: 60,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#005e7a',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#005e7a',
    fontWeight: '600',
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
    elevation: 3,
    overflow: 'hidden',
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
  avatarContainer: {
    marginBottom: 8,
  },
}); 
