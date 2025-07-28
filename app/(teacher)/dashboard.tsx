import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Design System Components
import { DashboardTemplate } from '../../src/components/templates/DashboardTemplate';
import { Card } from '../../src/components/molecules/Card';
import { QuickAction } from '../../src/components/molecules/QuickAction';
import { ListItem } from '../../src/components/molecules/ListItem';
import { Typography } from '../../src/components/atoms/Typography';
import { ErrorMessage } from '../../src/components/molecules/ErrorMessage/ErrorMessage';
import { EmptyState } from '../../src/components/molecules/EmptyState/EmptyState';
import { SkeletonCard } from '../../src/components/molecules/SkeletonCard/SkeletonCard';

// Context and Services
import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/utils/supabase';
import { logoSvg } from '../../src/utils/svgPatterns';
import { colors } from '../../src/styles/colors';
import { useSafeToQuery } from '../../src/utils/navigationGuard';

// Modal Components
import TeacherProfileView from '../../src/components/organisms/TeacherProfileView';
import ClassesList from '../../src/components/templates/ClassesListTemplate';

// Icon types for proper typing
type IoniconsIcon = keyof typeof Ionicons.glyphMap;

export default function TeacherDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const isSafeToQuery = useSafeToQuery();
  const [schoolName, setSchoolName] = useState('Zaid Bin Tsabit');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<TeacherScheduleItem | null>(null);

  // Data interfaces
  interface ActivityItem {
    id: number;
    title: string;
    detail: string;
    time: string;
    icon: IoniconsIcon;
  }

  interface TeacherScheduleItem {
    day: string;
    date: string;
    time: string;
    activity: string;
    note: string;
  }

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

        // Mock activities - replace with actual API calls
        setActivities([
          {
            id: 1,
            title: 'Ahmad Fauzi menyelesaikan hafalan Al-Baqarah 255-257',
            detail: 'Al-Baqarah 255-257',
            time: '10 menit yang lalu',
            icon: 'checkmark-circle-outline' as IoniconsIcon,
          },
          {
            id: 2,
            title: 'Budi Santoso belum menyetorkan hafalan minggu ini',
            detail: 'Minggu ini',
            time: '2 jam yang lalu',
            icon: 'alert-circle-outline' as IoniconsIcon,
          },
          {
            id: 3,
            title: 'Jadwal kelas Tahfidz Al-Baqarah telah diperbarui',
            detail: 'Jadwal Tahfidz',
            time: '1 hari yang lalu',
            icon: 'calendar-outline' as IoniconsIcon,
          },
        ]);

        // Mock upcoming schedule
        setUpcomingSchedule({
          day: 'Senin',
          date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          time: '08:00 - 10:00',
          activity: 'Kelas Tahfidz Al-Baqarah',
          note: 'Setoran hafalan Al-Baqarah ayat 255-257',
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
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

  // Tab configuration
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home-outline' as IoniconsIcon,
    },
    {
      id: 'students',
      label: 'Siswa',
      icon: 'people-outline' as IoniconsIcon,
    },
    {
      id: 'classes',
      label: 'Kelas',
      icon: 'school-outline' as IoniconsIcon,
    },
    {
      id: 'hafalan',
      label: 'Hafalan',
      icon: 'book-outline' as IoniconsIcon,
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
      onPress: () => handleNavigate('/'),
      accessibilityLabel: 'Profil',
    },
  ];

  // Quick actions configuration
  const quickActions = [
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
        onTabChange={setActiveTab}
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
        onTabChange={setActiveTab}
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
      case 'dashboard':
        return renderDashboard();
      case 'students':
        return renderStudents();
      case 'classes':
        return renderClasses();
      case 'hafalan':
        return renderHafalan();
      case 'profile':
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
      onTabChange={setActiveTab}
      backgroundPattern={true}
      contentPadding={true}
      scrollable={activeTab !== 'classes'}
      testID="teacher-dashboard"
    >
      {getContent()}
    </DashboardTemplate>
  );
}