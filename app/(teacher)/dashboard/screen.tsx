import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
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
import { useAuth } from '@lib/hooks/useAuth';
import { supabase } from '@lib/utils/supabase';
import { colors } from '@design-system/tokens/colors';
import { useSafeToQuery } from '@lib/utils/navigationGuard';

// Logo SVG
const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="95" fill="#005e7a" />
  <circle cx="100" cy="100" r="85" fill="#ffffff" />
  <path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill="#f0c75e" />
  <path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill="#f0c75e" />
  <path d="M120 45C120 45 130 50 120 55C110 50 120 45 120 45Z" fill="#f0c75e" />
</svg>`;

// Modal Components
import TeacherProfileView from '@ui/organisms/TeacherProfileView';
import ClassesList from '@ui/templates/ClassesListTemplate';

// Feature Model
import {
  type IoniconsIcon,
  type ActivityItem,
  type TeacherScheduleItem,
  type QuickActionItem,
  type HeaderAction,
  type TabItem,
  DASHBOARD_TABS,
  mockActivities,
  mockUpcomingSchedule,
  formatIndonesianDate,
  DASHBOARD_ERRORS,
} from './model';

// Create a union type for tab values to ensure type safety
type DashboardTabValue = typeof DASHBOARD_TABS[keyof typeof DASHBOARD_TABS];

export default function TeacherDashboardScreen() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const isSafeToQuery = useSafeToQuery();
  const [schoolName, setSchoolName] = useState('Zaid Bin Tsabit');
  const [activeTab, setActiveTab] = useState<DashboardTabValue>(DASHBOARD_TABS.DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<TeacherScheduleItem | null>(null);

  const [teacherData] = useState({
    name: profile?.full_name || 'Ustadz Guru',
  });

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch data if navigation is in progress
      if (!isSafeToQuery) {
        console.log('Skipping teacher dashboard data fetch - navigation in progress');
        setIsLoading(false); // Ensure loading state is reset
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch school name
        if (profile?.school_id) {
          const { data: schoolData, error: schoolError } = await supabase
            .from('schools')
            .select('name')
            .eq('id', profile.school_id)
            .single();
           
          if (schoolData && !schoolError) {
            setSchoolName(schoolData.name);
          }
        }

        // Use mock data for now
        setActivities(mockActivities);
        setUpcomingSchedule(mockUpcomingSchedule);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(DASHBOARD_ERRORS.LOAD_FAILED);
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

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as DashboardTabValue);
  };

  // Tab configuration
  const tabs: TabItem[] = [
    {
      id: DASHBOARD_TABS.DASHBOARD,
      label: 'Dashboard',
      icon: 'home-outline' as IoniconsIcon,
    },
    {
      id: DASHBOARD_TABS.STUDENTS,
      label: 'Siswa',
      icon: 'people-outline' as IoniconsIcon,
    },
    {
      id: DASHBOARD_TABS.CLASSES,
      label: 'Kelas',
      icon: 'school-outline' as IoniconsIcon,
    },
    {
      id: DASHBOARD_TABS.HAFALAN,
      label: 'Hafalan',
      icon: 'book-outline' as IoniconsIcon,
    },
  ];

  // Header actions
  const headerActions: HeaderAction[] = [
    {
      icon: 'notifications-outline' as IoniconsIcon,
      onPress: () => console.log('Notifications pressed'),
      badge: 3,
      accessibilityLabel: 'Notifikasi',
    },
    {
      icon: 'person-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/'),
      accessibilityLabel: 'Profil',
    },
  ];

  // Quick actions configuration
  const quickActions: QuickActionItem[] = [
    {
      title: 'Siswa',
      icon: 'people-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/students'),
      variant: 'primary' as const,
    },
    {
      title: 'Kelas',
      icon: 'school-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/class'),
      variant: 'secondary' as const,
    },
    {
      title: 'Hafalan',
      icon: 'book-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/hafalan'),
      variant: 'primary' as const,
    },
    {
      title: 'Komunikasi',
      icon: 'chatbubbles-outline' as IoniconsIcon,
      onPress: () => handleOpenModal('communication'),
      variant: 'primary' as const,
    },
    {
      title: 'Info Asrama',
      icon: 'home-outline' as IoniconsIcon,
      onPress: () => handleOpenModal('boarding'),
      variant: 'primary' as const,
    },
    {
      title: 'Laporan Insiden',
      icon: 'warning-outline' as IoniconsIcon,
      onPress: () => handleOpenModal('incident'),
      variant: 'secondary' as const,
    },
    {
      title: 'Laporan',
      icon: 'document-text-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/reports'),
      variant: 'primary' as const,
    },
    {
      title: 'Profil',
      icon: 'person-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/'),
      variant: 'primary' as const,
    },
  ];

  // Loading state renderer
  const renderLoadingState = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SkeletonCard variant="large" style={{ marginBottom: 20 }} />
      <Typography variant="h4" style={{ marginBottom: 15 }}>Aksi Cepat</Typography>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} variant="medium" style={{ width: '48%', marginBottom: 12 }} />
        ))}
      </View>
      <Typography variant="h4" style={{ marginBottom: 15 }}>Aktivitas Terbaru</Typography>
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
          title: 'Dashboard Guru',
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
        onTabChange={handleTabChange}
        backgroundPattern={true}
        contentPadding={true}
        scrollable={activeTab !== 'classes'}
        testID="teacher-dashboard"
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
          title: 'Dashboard Guru',
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
        onTabChange={handleTabChange}
        backgroundPattern={true}
        contentPadding={true}
        scrollable={activeTab !== 'classes'}
        testID="teacher-dashboard"
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
              Assalamu&apos;alaikum,
            </Typography>
            <Typography variant="h3" weight="bold" color="primary" style={{ marginBottom: 4 }}>
              {teacherData.name}
            </Typography>
            <Typography variant="body2" color="secondary">
              {formatIndonesianDate(new Date())}
            </Typography>
          </View>
          <SvgXml xml={logoSvg} width={60} height={60} />
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Aksi Cepat
        </Typography>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {quickActions.slice(0, 4).map((action, index) => (
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {quickActions.slice(4).map((action, index) => (
            <QuickAction
              key={index + 4}
              title={action.title}
              icon={action.icon}
              onPress={action.onPress}
              style={{ width: '48%', marginBottom: 12 }}
              variant={action.variant}
            />
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Aktivitas Terbaru
        </Typography>
        {activities.length === 0 ? (
          <EmptyState
            title="Belum Ada Aktivitas"
            message="Belum ada aktivitas terbaru untuk ditampilkan"
            icon="time-outline"
          />
        ) : (
          <Card variant="default">
            {activities.map((activity) => (
              <ListItem
                key={activity.id}
                title={activity.title}
                subtitle={activity.detail}
                leftIcon={activity.icon}
                rightComponent={
                  <Typography variant="caption" color="textSecondary">
                    {activity.time}
                  </Typography>
                }
                showDivider={activity.id !== activities[activities.length - 1].id}
              />
            ))}
          </Card>
        )}
      </View>

      {/* Upcoming Schedule */}
      {upcomingSchedule && (
        <View style={{ marginBottom: 20 }}>
          <Typography variant="h4" style={{ marginBottom: 15 }}>
            Jadwal Mendatang
          </Typography>
          <Card variant="elevated">
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.secondary.main,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 15,
                }}
              >
                <Typography variant="body2" weight="bold" color="white">
                  {upcomingSchedule.day.substring(0, 2)}
                </Typography>
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="body1" weight="semibold">
                  {upcomingSchedule.activity}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {upcomingSchedule.time} • {upcomingSchedule.date}
                </Typography>
              </View>
            </View>
            <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
              {upcomingSchedule.note}
            </Typography>
          </Card>
        </View>
      )}
    </ScrollView>
  );

  const renderStudents = () => (
    <EmptyState
      title="Daftar Siswa"
      message="Fitur daftar siswa akan segera hadir"
      icon="people-outline"
    />
  );

  const renderClasses = () => {
    return <ClassesList />;
  };

  const renderHafalan = () => (
    <EmptyState
      title="Manajemen Hafalan"
      message="Fitur manajemen hafalan akan segera hadir"
      icon="book-outline"
    />
  );

  const renderProfile = () => (
    <TeacherProfileView profile={profile || undefined} loading={authLoading} schoolName={schoolName} />
  );

  // Content mapping based on active tab
  const getContent = () => {
    switch (activeTab) {
      case DASHBOARD_TABS.DASHBOARD:
        return renderDashboard();
      case DASHBOARD_TABS.STUDENTS:
        return renderStudents();
      case DASHBOARD_TABS.CLASSES:
        return renderClasses();
      case DASHBOARD_TABS.HAFALAN:
        return renderHafalan();
      case DASHBOARD_TABS.PROFILE:
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardTemplate
      header={{
        title: 'Dashboard Guru',
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
      onTabChange={handleTabChange}
      backgroundPattern={true}
      contentPadding={true}
      scrollable={activeTab !== 'classes'}
      testID="teacher-dashboard"
    >
      {getContent()}
    </DashboardTemplate>
  );
}
