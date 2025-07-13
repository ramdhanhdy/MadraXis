import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { fetchIncidentsForSchool } from '../../../src/services/incidents';
import { fetchDashboardMetrics, DashboardMetrics } from '../../../src/services/dashboard';
import LogoutButton from '../../components/auth/LogoutButton';

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
  } | null;
}

export default function ManagementDashboard() {
  const router = useRouter();
  const { user, profile, signOut, loading: authLoading } = useAuth(); // Use auth context, get loading state
  const [showNotifications, setShowNotifications] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

      // Handle incidents response
      if (incidentsResponse.error) {
        throw new Error(`Failed to fetch incidents: ${incidentsResponse.error.message}`);
      }
      if (incidentsResponse.data) {
        setIncidents(incidentsResponse.data as any);
      }

      // Handle metrics response
      if (metricsResponse.error) {
        throw new Error(`Failed to fetch metrics: ${metricsResponse.error.message}`);
      }
      if (metricsResponse.data) {
        console.log('Dashboard metrics received:', metricsResponse.data);
        setDashboardMetrics(metricsResponse.data);
      } else {
        console.warn('No dashboard metrics data received');
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Gagal memuat data dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to incident detail
  const navigateToIncidentDetail = (incidentId: number) => {
    // TODO: Create incident detail page at app/management/incidents/[id].tsx
    Alert.alert('Info', `Halaman detail insiden ${incidentId} akan segera tersedia.`);
    // router.push("/management/incidents/" + incidentId);
  };



  // Fetch dashboard data when component mounts and auth state is resolved
  useEffect(() => {
    if (authLoading) {
      return; // Wait for authentication to resolve
    }
    if (user && (user.user_metadata?.school_id || profile?.school_id)) {
      fetchDashboardData();
    }
  }, [authLoading, user, profile]); // Re-fetch if authLoading, user, or profile changes

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Dashboard Manajemen</Text>
        <TouchableOpacity onPress={toggleNotifications}>
          <Ionicons name="notifications" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {/* Notification Panel */}
      {showNotifications && (
        <View style={styles.notificationPanel}>
          <Text style={styles.notificationTitle}>Notifikasi</Text>
          <View style={styles.notificationItem}>
            <Ionicons name="information-circle" size={20} color="#005e7a" />
            <Text style={styles.notificationText}>Laporan bulanan siap untuk ditinjau</Text>
          </View>
          <View style={styles.notificationItem}>
            <Ionicons name="alert-circle" size={20} color="#e74c3c" />
            <Text style={styles.notificationText}>3 insiden baru memerlukan perhatian</Text>
          </View>
          <View style={styles.notificationItem}>
            <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            <Text style={styles.notificationText}>Evaluasi kinerja guru selesai</Text>
          </View>
        </View>
      )}
      
      <ScrollView style={styles.scrollView}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Selamat Datang, Admin</Text>
            <Text style={styles.welcomeSubtitle}>Pantau dan kelola operasional sekolah</Text>
          </View>
          <Image 
            source={{ uri: 'https://via.placeholder.com/60' }} 
            style={styles.profileImage} 
          />
        </View>
        
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {isLoading ? '...' : (dashboardMetrics?.studentEnrollment !== undefined ? dashboardMetrics.studentEnrollment : 'N/A')}
            </Text>
            <Text style={styles.statLabel}>Total Siswa</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {isLoading ? '...' : (dashboardMetrics?.teacherCount !== undefined ? dashboardMetrics.teacherCount : 'N/A')}
            </Text>
            <Text style={styles.statLabel}>Guru</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {isLoading ? '...' : (dashboardMetrics?.teacherToStudentRatio !== undefined ? dashboardMetrics.teacherToStudentRatio : 'N/A')}
            </Text>
            <Text style={styles.statLabel}>Rasio Guru:Siswa</Text>
          </View>
        </View>
        
        {/* Performance Metrics */}
        <Text style={styles.sectionTitle}>Metrik Kinerja</Text>
        <View style={styles.performanceContainer}>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceValue}>
              {isLoading ? '...' : (dashboardMetrics?.academicPerformance?.averageScore !== undefined ? dashboardMetrics.academicPerformance.averageScore : 'N/A')}
            </Text>
            <Text style={styles.performanceLabel}>Skor Akademik Rata-rata</Text>
          </View>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceValue}>
              {isLoading ? '...' : (dashboardMetrics?.studentAttendance?.averagePercentage !== undefined ? `${dashboardMetrics.studentAttendance.averagePercentage}%` : 'N/A')}
            </Text>
            <Text style={styles.performanceLabel}>Kehadiran Siswa</Text>
          </View>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceValue}>
              {isLoading ? '...' : (dashboardMetrics?.teacherPerformance?.averageScore !== undefined ? dashboardMetrics.teacherPerformance.averageScore : 'N/A')}
            </Text>
            <Text style={styles.performanceLabel}>Kinerja Guru</Text>
          </View>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceValue}>
              {isLoading ? '...' : (dashboardMetrics?.parentEngagement?.meetingsHeld !== undefined ? dashboardMetrics.parentEngagement.meetingsHeld : 'N/A')}
            </Text>
            <Text style={styles.performanceLabel}>Pertemuan Orang Tua</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/management/user-management')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="people" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Manajemen Pengguna</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="bar-chart" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Laporan & Analitik</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="calendar" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Jadwal Akademik</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="settings" size={24} color="#005e7a" />
            </View>
            <Text style={styles.actionText}>Pengaturan Sistem</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Incidents */}
        <Text style={styles.sectionTitle}>Insiden Terbaru</Text>
        <View style={styles.incidentsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#005e7a" />
              <Text style={styles.loadingText}>Memuat data insiden...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={40} color="#e74c3c" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : incidents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={40} color="#cccccc" />
              <Text style={styles.emptyText}>Tidak ada insiden yang dilaporkan</Text>
            </View>
          ) : (
            incidents.map((incident) => (
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
                    {incident.incident_type === 'bullying' 
                      ? 'Laporan Perundungan' 
                      : incident.incident_type === 'safety' 
                        ? 'Masalah Keamanan' 
                        : incident.incident_type === 'property' 
                          ? 'Kerusakan Fasilitas' 
                          : 'Masalah Lainnya'}
                  </Text>
                  <Text style={styles.incidentDetails}>Dilaporkan oleh: {incident.is_anonymous ? 'Anonim' : incident.reporter?.full_name || 'Tidak diketahui'}</Text>
                  <Text style={styles.incidentTime}>{getRelativeTime(incident.created_at)}</Text>
                </View>
                <TouchableOpacity style={styles.incidentAction}>
                  <Ionicons name="arrow-forward" size={20} color="#005e7a" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
        
        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <LogoutButton variant="button" style={styles.logoutButton} />
        </View>
        
        {/* Bottom Spacing */}
        <View style={{ height: 30 }} />
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
    backgroundColor: '#005e7a',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  notificationPanel: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#005e7a',
    padding: 20,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#f0c75e',
    marginTop: 4,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f0c75e',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 94, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  signOutContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
}); 