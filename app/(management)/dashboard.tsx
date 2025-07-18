import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Design System Components
import { DashboardTemplate } from '../../src/components/templates/DashboardTemplate';
import { Card } from '../../src/components/molecules/Card';
import { QuickAction } from '../../src/components/molecules/QuickAction';
import { ListItem } from '../../src/components/molecules/ListItem';
import { Typography } from '../../src/components/atoms/Typography';
import { LoadingSpinner } from '../../src/components/atoms/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../src/components/molecules/ErrorMessage/ErrorMessage';
import { EmptyState } from '../../src/components/molecules/EmptyState/EmptyState';
import { SkeletonCard } from '../../src/components/molecules/SkeletonCard/SkeletonCard';

// Context and Services
import { useAuth } from '../../src/context/AuthContext';
import { fetchIncidentsForSchool } from '../../src/services/incidents';
import { fetchDashboardMetrics, DashboardMetrics } from '../../src/services/dashboard';
import { logoSvg } from '../../src/utils/svgPatterns';
import { colors } from '../../src/styles/colors';

// Icon types for proper typing
type IoniconsIcon = keyof typeof Ionicons.glyphMap;

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
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [schoolName, setSchoolName] = useState('Zaid Bin Tsabit');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Function to get incident priority color based on type
  const getIncidentPriorityColor = (type: string) => {
    switch(type) {
      case 'bullying':
        return colors.error.main; // Red for bullying
      case 'safety':
        return colors.warning.main; // Orange for safety issues
      case 'property':
        return colors.info.main; // Blue for property damage
      default:
        return colors.secondary.main; // Purple for other issues
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
      setDashboardLoading(false);
    }
  };

  // Navigate to incident detail
  const navigateToIncidentDetail = (incidentId: number) => {
    console.log('Navigating to incident detail:', incidentId);
    Alert.alert('Info', `Detail insiden #${incidentId} akan segera tersedia`);
  };

  // Handle navigation
  const handleNavigate = (route: string) => {
    router.push(route as Parameters<typeof router.push>[0]);
  };

  // Tab configuration
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home-outline' as IoniconsIcon,
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: 'person-outline' as IoniconsIcon,
    },
  ];

  // Header actions
  const headerActions = [
    {
      icon: 'notifications-outline' as IoniconsIcon,
      onPress: () => console.log('Notifications pressed'),
      badge: 3,
      accessibilityLabel: 'Notifikasi',
    },
    {
      icon: 'person-outline' as IoniconsIcon,
      onPress: () => setActiveTab('profile'),
      accessibilityLabel: 'Profil',
    },
  ];

  // Quick actions configuration
  const quickActions = [
    {
      title: 'Tambah Insiden',
      icon: 'add-circle-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/management/incident/create'),
      variant: 'primary' as const,
    },
    {
      title: 'Kelola Pengguna',
      icon: 'people-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/management/users'),
      variant: 'primary' as const,
    },
    {
      title: 'Laporan',
      icon: 'stats-chart-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/management/reports'),
      variant: 'secondary' as const,
    },
    {
      title: 'Pengaturan',
      icon: 'settings-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/management/settings'),
      variant: 'primary' as const,
    },
  ];

  // Load data when component mounts or user/profile changes
  useEffect(() => {
    if (user && !authLoading) {
      fetchDashboardData();
    }
  }, [user, profile, authLoading]);

  // No additional refresh needed - data loads on mount and user change

  const renderDashboard = () => {
    if (isLoading && dashboardLoading) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Welcome Section Skeleton */}
          <SkeletonCard style={{ marginBottom: 20, height: 100 }} />
          
          {/* Metrics Skeleton */}
          <View style={{ marginBottom: 20 }}>
            <SkeletonCard style={{ width: 200, height: 30, marginBottom: 15 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 120 }} />
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 120 }} />
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 120 }} />
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 120 }} />
            </View>
          </View>

          {/* Quick Actions Skeleton */}
          <View style={{ marginBottom: 20 }}>
            <SkeletonCard style={{ width: 150, height: 30, marginBottom: 15 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 80 }} />
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 80 }} />
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 80 }} />
              <SkeletonCard style={{ flex: 1, minWidth: '45%', height: 80 }} />
            </View>
          </View>

          {/* Recent Incidents Skeleton */}
          <View style={{ marginBottom: 20 }}>
            <SkeletonCard style={{ width: 180, height: 30, marginBottom: 15 }} />
            <SkeletonCard style={{ height: 300 }} />
          </View>
        </ScrollView>
      );
    }

    if (error) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ErrorMessage
            message={error}
            onRetry={fetchDashboardData}
          />
        </ScrollView>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Card variant="elevated" style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Typography variant="h4" color="textSecondary" style={{ marginBottom: 4 }}>
                Selamat datang,
              </Typography>
              <Typography variant="h3" weight="bold" color="primary">
                {profile?.full_name || 'Pengguna'}
              </Typography>
            </View>
            <SvgXml xml={logoSvg} width={60} height={60} />
          </View>
        </Card>

        {/* Dashboard Metrics */}
        {dashboardMetrics && (
          <View style={{ marginBottom: 20 }}>
            <Typography variant="h4" style={{ marginBottom: 15 }}>
              Ringkasan Sekolah
            </Typography>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <Card variant="default" style={{ flex: 1, minWidth: '45%', alignItems: 'center', padding: 20 }}>
                <Typography variant="h2" weight="bold" color="primary">
                  {dashboardMetrics.studentEnrollment}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Siswa
                </Typography>
              </Card>
              <Card variant="default" style={{ flex: 1, minWidth: '45%', alignItems: 'center', padding: 20 }}>
                <Typography variant="h2" weight="bold" color="primary">
                  {dashboardMetrics.teacherCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Guru
                </Typography>
              </Card>
              <Card variant="default" style={{ flex: 1, minWidth: '45%', alignItems: 'center', padding: 20 }}>
                <Typography variant="h2" weight="bold" color="error">
                  {dashboardMetrics.incidentSummary.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Insiden
                </Typography>
              </Card>
              <Card variant="default" style={{ flex: 1, minWidth: '45%', alignItems: 'center', padding: 20 }}>
                <Typography variant="h2" weight="bold" color="warning">
                  {dashboardMetrics.incidentSummary.pending}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Insiden Pending
                </Typography>
              </Card>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ marginBottom: 20 }}>
          <Typography variant="h4" style={{ marginBottom: 15 }}>
            Aksi Cepat
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                title={action.title}
                icon={action.icon}
                onPress={action.onPress}
                style={{ flex: 1, minWidth: '45%' }}
                variant={action.variant}
              />
            ))}
          </View>
        </View>

        {/* Recent Incidents */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Typography variant="h4">Insiden Terbaru</Typography>
            <TouchableOpacity>
              <Typography variant="body2" color="primary">Lihat Semua</Typography>
            </TouchableOpacity>
          </View>
          
          <Card variant="default">
            {incidents.length === 0 ? (
              <EmptyState
                title="Tidak ada insiden terbaru"
                message="Insiden baru akan muncul di sini"
                icon="document-outline"
              />
            ) : (
              incidents.slice(0, 5).map((incident, index) => (
                <View key={incident.id}>
                  <ListItem
                    title={incident.incident_type.charAt(0).toUpperCase() + incident.incident_type.slice(1)}
                    subtitle={incident.description}
                    leftComponent={
                      <View style={{
                        width: 4,
                        height: 40,
                        backgroundColor: getIncidentPriorityColor(incident.incident_type),
                        borderRadius: 2,
                      }} />
                    }
                    rightComponent={
                      <Typography variant="caption" color="textSecondary">
                        {getRelativeTime(incident.created_at)} • {incident.location}
                      </Typography>
                    }
                    onPress={() => navigateToIncidentDetail(incident.id)}
                  />
                  {index < incidents.slice(0, 5).length - 1 && (
                    <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
                  )}
                </View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    );
  };

  const renderProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card variant="elevated" style={{ marginBottom: 20, alignItems: 'center', padding: 40 }}>
        <Ionicons name="person-circle" size={80} color={colors.primary.main} />
        <Typography variant="h3" weight="bold" color="primary" style={{ marginTop: 12 }}>
          {profile?.full_name || 'Nama Pengguna'}
        </Typography>
        <Typography variant="body1" color="textSecondary" style={{ marginTop: 4 }}>
          {profile?.role === 'management' ? 'Manajemen Sekolah' : 'Pengguna'}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
          {schoolName}
        </Typography>
      </Card>

      <Card variant="default" style={{ marginBottom: 16 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          Pengaturan Akun
        </Typography>
        
        <ListItem
          title="Edit Profil"
          leftIcon="person-outline"
          rightIcon="chevron-forward"
          onPress={() => Alert.alert('Info', 'Fitur edit profil akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Pengaturan Notifikasi"
          leftIcon="notifications-outline"
          rightIcon="chevron-forward"
          onPress={() => Alert.alert('Info', 'Fitur pengaturan notifikasi akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Bahasa"
          leftIcon="language-outline"
          rightIcon="chevron-forward"
          onPress={() => Alert.alert('Info', 'Fitur pengaturan bahasa akan segera hadir!')}
        />
      </Card>
      
      <Card variant="default" style={{ marginBottom: 16 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          Bantuan
        </Typography>
        
        <ListItem
          title="Pusat Bantuan"
          leftIcon="help-circle-outline"
          rightIcon="chevron-forward"
          onPress={() => Alert.alert('Info', 'Fitur pusat bantuan akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Syarat & Ketentuan"
          leftIcon="document-text-outline"
          rightIcon="chevron-forward"
          onPress={() => Alert.alert('Info', 'Fitur syarat & ketentuan akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Kebijakan Privasi"
          leftIcon="shield-checkmark-outline"
          rightIcon="chevron-forward"
          onPress={() => Alert.alert('Info', 'Fitur kebijakan privasi akan segera hadir!')}
        />
      </Card>
    </ScrollView>
  );

  // Content mapping based on active tab
  const getContent = () => {
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
    <DashboardTemplate
      header={{
        title: 'Dashboard Manajemen',
        subtitle: schoolName,
        leftAction: {
          icon: 'arrow-back-outline' as IoniconsIcon,
          onPress: () => router.replace('/login'),
          accessibilityLabel: 'Kembali ke login',
        },
        rightActions: headerActions,
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      backgroundPattern={true}
      contentPadding={true}
      testID="management-dashboard"
    >
      {getContent()}
    </DashboardTemplate>
  );
}
