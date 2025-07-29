import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Design System Components
import { DashboardTemplate } from '@ui/templates/DashboardTemplate';
import { Card } from '@ui/molecules/Card';
import { QuickAction } from '@ui/molecules/QuickAction';
import { ListItem } from '@ui/molecules/ListItem';
import { Typography } from '@ui/atoms/Typography';
import { ErrorMessage } from '@ui/molecules/ErrorMessage/ErrorMessage';
import { EmptyState } from '@ui/molecules/EmptyState/EmptyState';
import { SkeletonCard } from '@ui/molecules/SkeletonCard/SkeletonCard';

// Context and Services
import { useAuth } from '../../../src/hooks/useAuth';
import { fetchIncidentsForSchool } from '../../../src/services/incidents';
import { fetchDashboardMetrics, DashboardMetrics } from '../../../src/services/dashboard';
import { logoSvg } from '../../../src/utils/svgPatterns';
import { colors } from '../../../src/styles/colors';
import { useSafeToQuery } from '../../../src/utils/navigationGuard';
import { Incident } from '../../../src/types';

// Feature Model
import {
  type IoniconsIcon,
  type QuickActionItem,
  type HeaderAction,
  type TabItem,
  DASHBOARD_TABS,
  getIncidentPriorityColor,
  getRelativeTime,
  getPendingIncidentsCount,
  getRecentIncidents,
  formatIncidentType,
  MANAGEMENT_DASHBOARD_ERRORS,
} from './model';

export default function ManagementDashboardScreen() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const isSafeToQuery = useSafeToQuery();
  const [schoolName] = useState('Zaid Bin Tsabit');
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch data if navigation is in progress
      if (!isSafeToQuery) {
        console.log('Skipping management dashboard data fetch - navigation in progress');
        setIsLoading(false); // Ensure loading state is reset
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (profile?.school_id) {
          // Fetch incidents
          const { data: incidentsData, error: incidentsError } = await fetchIncidentsForSchool(profile.school_id);
          if (incidentsError) {
            console.error('Error fetching incidents:', incidentsError);
          } else {
            setIncidents(incidentsData || []);
          }

          // Fetch dashboard metrics
          const { data: metricsData, error: metricsError } = await fetchDashboardMetrics(profile.school_id);
          if (metricsError) {
            console.error('Error fetching dashboard metrics:', metricsError);
          } else {
            setDashboardMetrics(metricsData);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(MANAGEMENT_DASHBOARD_ERRORS.LOAD_FAILED);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profile?.school_id, isSafeToQuery]);

  // Handle navigation
  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  // Handle modal opening
  const handleOpenModal = (modalType: string) => {
    console.log('Opening modal:', modalType);
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
  };

  // Navigate to incident detail
  const navigateToIncidentDetail = (incidentId: string) => {
    console.log('Navigate to incident detail:', incidentId);
    // TODO: Implement navigation to incident detail
  };

  // Tab configuration
  const tabs: TabItem[] = [
    {
      id: DASHBOARD_TABS.DASHBOARD,
      label: 'Dashboard',
      icon: 'home-outline' as IoniconsIcon,
    },
    {
      id: DASHBOARD_TABS.PROFILE,
      label: 'Profil',
      icon: 'person-outline' as IoniconsIcon,
    },
  ];

  // Header actions
  const headerActions: HeaderAction[] = [
    {
      icon: 'notifications-outline' as IoniconsIcon,
      onPress: () => console.log('Notifications pressed'),
      badge: getPendingIncidentsCount(incidents),
      accessibilityLabel: 'Notifikasi',
    },
    {
      icon: 'settings-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/user-management'),
      accessibilityLabel: 'Pengaturan',
    },
  ];

  // Quick actions configuration
  const quickActions: QuickActionItem[] = [
    {
      title: 'Kelola Pengguna',
      icon: 'people-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/user-management'),
      variant: 'primary' as const,
    },
    {
      title: 'Laporan Insiden',
      icon: 'warning-outline' as IoniconsIcon,
      onPress: () => handleOpenModal('incidents'),
      variant: 'secondary' as const,
    },
    {
      title: 'Pengaturan Sekolah',
      icon: 'school-outline' as IoniconsIcon,
      onPress: () => handleOpenModal('school-settings'),
      variant: 'primary' as const,
    },
    {
      title: 'Laporan Sistem',
      icon: 'document-text-outline' as IoniconsIcon,
      onPress: () => handleOpenModal('system-reports'),
      variant: 'primary' as const,
    },
  ];

  // Loading state renderer
  const renderLoadingState = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SkeletonCard variant="large" style={{ marginBottom: 20 }} />
      <Typography variant="h4" style={{ marginBottom: 15 }}>Metrik Sekolah</Typography>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} variant="medium" style={{ width: '48%', marginBottom: 12 }} />
        ))}
      </View>
      <Typography variant="h4" style={{ marginBottom: 15 }}>Aksi Cepat</Typography>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} variant="medium" style={{ width: '48%', marginBottom: 12 }} />
        ))}
      </View>
      <Typography variant="h4" style={{ marginBottom: 15 }}>Insiden Terbaru</Typography>
      <SkeletonCard variant="large" />
    </ScrollView>
  );

  // Error state renderer
  const renderErrorState = () => (
    <ErrorMessage
      title="Gagal Memuat Data"
      message={error || "Terjadi kesalahan saat memuat data dashboard"}
      onRetry={handleRetry}
    />
  );

  // Loading state
  if (authLoading || isLoading) {
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
        scrollable={true}
        testID="management-dashboard"
      >
        {renderLoadingState()}
      </DashboardTemplate>
    );
  }

  // Error state
  if (error) {
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
        scrollable={true}
        testID="management-dashboard"
      >
        {renderErrorState()}
      </DashboardTemplate>
    );
  }

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <Card variant="elevated" style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Typography variant="h4" style={{ marginBottom: 4 }}>
              Selamat datang,
            </Typography>
            <Typography variant="h3" weight="bold" color="primary" style={{ marginBottom: 4 }}>
              {profile?.full_name || 'Admin'}
            </Typography>
            <Typography variant="body2" color="secondary">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </View>
          <SvgXml xml={logoSvg} width={60} height={60} />
        </View>
      </Card>

      {/* Dashboard Metrics */}
      {dashboardMetrics && (
        <View style={{ marginBottom: 20 }}>
          <Typography variant="h4" style={{ marginBottom: 15 }}>
            Metrik Sekolah
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Card variant="default" style={{ width: '48%', marginBottom: 12 }}>
              <Typography variant="h2" weight="bold" color="primary">
                {dashboardMetrics.studentEnrollment}
              </Typography>
              <Typography variant="body2" color="secondary">
                Total Siswa
              </Typography>
            </Card>
            <Card variant="default" style={{ width: '48%', marginBottom: 12 }}>
              <Typography variant="h2" weight="bold" color="primary">
                {dashboardMetrics.teacherCount}
              </Typography>
              <Typography variant="body2" color="secondary">
                Total Guru
              </Typography>
            </Card>
            <Card variant="default" style={{ width: '48%', marginBottom: 12 }}>
              <Typography variant="h2" weight="bold" color="warning">
                {dashboardMetrics.incidentSummary.pending}
              </Typography>
              <Typography variant="body2" color="secondary">
                Insiden Pending
              </Typography>
            </Card>
            <Card variant="default" style={{ width: '48%', marginBottom: 12 }}>
              <Typography variant="h2" weight="bold" color="success">
                {dashboardMetrics.incidentSummary.resolved}
              </Typography>
              <Typography variant="body2" color="secondary">
                Insiden Selesai
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              icon={action.icon}
              onPress={action.onPress}
              style={{ width: '48%', marginBottom: 12 }}
              variant={action.variant}
            />
          ))}
        </View>
      </View>

      {/* Recent Incidents */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Insiden Terbaru
        </Typography>
        {incidents.length === 0 ? (
          <EmptyState
            title="Belum Ada Insiden"
            message="Belum ada insiden yang dilaporkan"
            icon="shield-checkmark-outline"
          />
        ) : (
          <Card variant="default">
            {getRecentIncidents(incidents).map((incident) => (
              <ListItem
                key={incident.id}
                title={incident.description}
                subtitle={`${formatIncidentType(incident.incident_type)} • ${incident.location}`}
                leftIcon="warning-outline"
                leftIconColor={getIncidentPriorityColor(incident.incident_type)}
                rightComponent={
                  <View style={{ alignItems: 'flex-end' }}>
                    <Typography variant="caption" color="textSecondary">
                      {getRelativeTime(incident.created_at)}
                    </Typography>
                    <View
                      style={{
                        backgroundColor: getIncidentPriorityColor(incident.incident_type),
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 12,
                        marginTop: 4,
                      }}
                    >
                      <Typography variant="caption" color="white">
                        {incident.status}
                      </Typography>
                    </View>
                  </View>
                }
                onPress={() => navigateToIncidentDetail(incident.id)}
                showDivider={incident.id !== getRecentIncidents(incidents)[getRecentIncidents(incidents).length - 1].id}
              />
            ))}
          </Card>
        )}
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Profile Information */}
      <Card variant="elevated" style={{ marginBottom: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary.main,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <Typography variant="h2" weight="bold" color="white">
              {(profile?.full_name || 'A').charAt(0).toUpperCase()}
            </Typography>
          </View>
          <Typography variant="h3" weight="bold" style={{ marginBottom: 4 }}>
            {profile?.full_name || 'Admin'}
          </Typography>
          <Typography variant="body2" color="secondary">
            Administrator
          </Typography>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Typography variant="body2" color="secondary" style={{ marginBottom: 4 }}>
            Email
          </Typography>
          <Typography variant="body1">
            {user?.email || 'Tidak tersedia'}
          </Typography>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Typography variant="body2" color="secondary" style={{ marginBottom: 4 }}>
            Sekolah
          </Typography>
          <Typography variant="body1">
            {schoolName}
          </Typography>
        </View>

        <View>
          <Typography variant="body2" color="secondary" style={{ marginBottom: 4 }}>
            Bergabung Sejak
          </Typography>
          <Typography variant="body1">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) : 'Tidak tersedia'}
          </Typography>
        </View>
      </Card>

      {/* Quick Settings */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Pengaturan Cepat
        </Typography>
        <Card variant="default">
          <ListItem
            title="Kelola Pengguna"
            subtitle="Tambah, edit, atau hapus pengguna"
            leftIcon="people-outline"
            rightIcon="chevron-forward-outline"
            onPress={() => handleNavigate('/user-management')}
            showDivider={true}
          />
          <ListItem
            title="Pengaturan Sekolah"
            subtitle="Konfigurasi informasi sekolah"
            leftIcon="school-outline"
            rightIcon="chevron-forward-outline"
            onPress={() => handleOpenModal('school-settings')}
            showDivider={true}
          />
          <ListItem
            title="Laporan Sistem"
            subtitle="Lihat laporan dan analitik"
            leftIcon="document-text-outline"
            rightIcon="chevron-forward-outline"
            onPress={() => handleOpenModal('system-reports')}
            showDivider={false}
          />
        </Card>
      </View>
    </ScrollView>
  );

  // Content mapping based on active tab
  const getContent = () => {
    switch (activeTab) {
      case DASHBOARD_TABS.DASHBOARD:
        return renderDashboard();
      case DASHBOARD_TABS.PROFILE:
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
      scrollable={true}
      testID="management-dashboard"
    >
      {getContent()}
    </DashboardTemplate>
  );
}
