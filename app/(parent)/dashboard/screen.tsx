import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Design System Components
import { DashboardTemplate } from '@ui/templates/DashboardTemplate';
import { Card } from '@ui/molecules/Card';
import { QuickAction } from '@ui/molecules/QuickAction';
import { ListItem } from '@ui/molecules/ListItem';
import { Typography } from '@ui/atoms/Typography';
import { ProgressBar } from '@ui/molecules/ProgressBar';
import { LoadingSpinner } from '@ui/atoms/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '@ui/molecules/ErrorMessage/ErrorMessage';
import { EmptyState } from '@ui/molecules/EmptyState/EmptyState';

// Context and Services
import { useAuth } from '@lib/hooks/useAuth';
import { supabase } from '@lib/utils/supabase';
import { logoSvg } from '@lib/utils/svgPatterns';
import { colors } from '@design-system/tokens/colors';
import { useSafeToQuery } from '@lib/utils/navigationGuard';

// Feature models
import { 
  PARENT_DASHBOARD_TABS,
  MOCK_STUDENT_DATA,
  MOCK_ACTIVITIES,
  MOCK_EVENTS,
  type ActivityItem,
  type EventItem,
  type StudentData
} from './model';

export default function ParentDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Header configuration
  const headerConfig = {
    title: 'Dashboard Orang Tua',
    rightActions: [
      {
        icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
        onPress: () => {
          console.log('Notifications pressed');
        },
        accessibilityLabel: 'Notifikasi',
        testID: 'notifications-button',
      },
    ],
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would fetch from API
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setStudentData(MOCK_STUDENT_DATA);
      setActivities(MOCK_ACTIVITIES);
      setEvents(MOCK_EVENTS);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const navigateToIncidentReport = () => {
    router.push('/(parent)/incident-report');
  };

  const navigateToAntiBullying = () => {
    router.push('/(parent)/anti-bullying');
  };

  const navigateToCCTVRequest = () => {
    router.push('/(parent)/cctv-request');
  };

  const navigateToSchedule = () => {
    router.push('/(parent)/schedule');
  };

  const navigateToProgress = () => {
    router.push('/(parent)/progress');
  };

  const navigateToMessages = () => {
    router.push('/(parent)/messages');
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Render functions for different tabs
  const renderDashboard = () => {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <LoadingSpinner size="large" />
          <Typography variant="body1" color="secondary" style={{ marginTop: 16 }}>
            Memuat data dashboard...
          </Typography>
        </View>
      );
    }

    if (error) {
      return (
        <ErrorMessage
          message={error}
          onRetry={loadDashboardData}
          style={{ margin: 20 }}
        />
      );
    }

    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Welcome Banner */}
        <Card variant="default" padding="large" style={{ 
          backgroundColor: colors.role.parent.primary,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <View style={{ flex: 1 }}>
            <Typography variant="body2" color={colors.text.inverse}>
              Assalamu'alaikum,
            </Typography>
            <Typography variant="h3" color={colors.text.inverse} weight="bold" style={{ marginVertical: 4 }}>
              {profile?.full_name || 'Bapak/Ibu'}
            </Typography>
            <Typography variant="body2" color={colors.secondary.light}>
              Pantau perkembangan putra/putri Anda
            </Typography>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <SvgXml xml={logoSvg} width={80} height={80} />
          </View>
        </Card>

        {/* Student Info */}
        {studentData && (
          <Card variant="default" padding="medium" style={{ marginBottom: 16 }}>
            <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 12 }}>
              Informasi Anak
            </Typography>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Typography variant="body1" weight="bold">Nama:</Typography>
              <Typography variant="body1">{studentData.name}</Typography>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Typography variant="body1" weight="bold">Kelas:</Typography>
              <Typography variant="body1">{studentData.grade} - {studentData.class}</Typography>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant="body1" weight="bold">Asrama:</Typography>
              <Typography variant="body1">{studentData.dorm}</Typography>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={{ marginBottom: 16 }}>
          <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 12 }}>
            Aksi Cepat
          </Typography>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between' 
          }}>
            <QuickAction
              title="Lapor Insiden"
              icon="warning"
              variant="primary"
              size="medium"
              onPress={navigateToIncidentReport}
              style={{ width: '23%' }}
              testID="quick-action-incident"
            />
            
            <QuickAction
              title="Anti-Bullying"
              icon="shield"
              variant="secondary"
              size="medium"
              onPress={navigateToAntiBullying}
              style={{ width: '23%' }}
              testID="quick-action-antibullying"
            />
            
            <QuickAction
              title="CCTV Request"
              icon="videocam"
              variant="primary"
              size="medium"
              onPress={navigateToCCTVRequest}
              style={{ width: '23%' }}
              testID="quick-action-cctv"
            />
            
            <QuickAction
              title="Jadwal"
              icon="calendar"
              variant="default"
              size="medium"
              onPress={navigateToSchedule}
              style={{ width: '23%' }}
              testID="quick-action-schedule"
            />
          </View>
        </View>

        {/* Recent Activities */}
        <View style={{ marginBottom: 16 }}>
          <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 12 }}>
            Aktivitas Terbaru
          </Typography>
          <Card variant="default" padding="medium">
            {activities.length > 0 ? (
              activities.slice(0, 3).map((activity, index) => (
                <ListItem
                  key={activity.id}
                  title={activity.title}
                  subtitle={activity.date}
                  rightText={activity.score || activity.progress || activity.status}
                  leftIcon={
                    activity.type === 'academic' ? 'book' :
                    activity.type === 'quran' ? 'book-open' : 'home'
                  }
                  showDivider={index < activities.length - 1}
                  testID={`activity-${activity.id}`}
                />
              ))
            ) : (
              <EmptyState
                title="Belum ada aktivitas"
                description="Aktivitas anak akan muncul di sini"
                icon="list"
              />
            )}
          </Card>
        </View>

        {/* Upcoming Events */}
        <View style={{ marginBottom: 16 }}>
          <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 12 }}>
            Acara Mendatang
          </Typography>
          <Card variant="default" padding="medium">
            {events.length > 0 ? (
              events.slice(0, 2).map((event, index) => (
                <ListItem
                  key={event.id}
                  title={event.title}
                  subtitle={`${event.date} - ${event.time}`}
                  leftIcon="calendar"
                  showDivider={index < events.length - 1}
                  testID={`event-${event.id}`}
                />
              ))
            ) : (
              <EmptyState
                title="Belum ada acara"
                description="Acara sekolah akan muncul di sini"
                icon="calendar"
              />
            )}
          </Card>
        </View>
      </ScrollView>
    );
  };

  const renderMessages = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Ionicons name="chatbubbles-outline" size={80} color={colors.neutral[400]} />
      <Typography variant="h4" color="secondary" weight="bold" style={{ marginTop: 16 }}>
        Fitur Pesan Segera Hadir
      </Typography>
      <Typography variant="body2" color="tertiary" align="center" style={{ marginTop: 8, paddingHorizontal: 32 }}>
        Anda akan dapat berkomunikasi dengan guru dan pihak sekolah di sini.
      </Typography>
    </View>
  );

  const renderReports = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Ionicons name="document-text-outline" size={80} color={colors.neutral[400]} />
      <Typography variant="h4" color="secondary" weight="bold" style={{ marginTop: 16 }}>
        Laporan Lengkap Segera Hadir
      </Typography>
      <Typography variant="body2" color="tertiary" align="center" style={{ marginTop: 8, paddingHorizontal: 32 }}>
        Anda akan dapat melihat laporan akademik dan perkembangan anak di sini.
      </Typography>
    </View>
  );

  const renderProfile = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Ionicons name="person-outline" size={80} color={colors.neutral[400]} />
      <Typography variant="h4" color="secondary" weight="bold" style={{ marginTop: 16 }}>
        Profil Segera Hadir
      </Typography>
      <Typography variant="body2" color="tertiary" align="center" style={{ marginTop: 8, paddingHorizontal: 32 }}>
        Pengaturan profil dan akun akan tersedia di sini.
      </Typography>
    </View>
  );

  // Render current tab content
  const renderCurrentTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'messages':
        return renderMessages();
      case 'reports':
        return renderReports();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <DashboardTemplate
        header={headerConfig}
        tabs={PARENT_DASHBOARD_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        backgroundPattern={true}
        scrollable={false}
        contentPadding={false}
        testID="parent-dashboard"
      >
        {renderCurrentTabContent()}
      </DashboardTemplate>
    </>
  );
}
