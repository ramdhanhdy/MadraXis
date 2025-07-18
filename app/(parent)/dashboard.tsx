import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

// Design System Components
import { DashboardTemplate } from '../../src/shared/components/templates/DashboardTemplate';
import { Card } from '../../src/shared/components/molecules/Card';
import { QuickAction } from '../../src/shared/components/molecules/QuickAction';
import { ListItem } from '../../src/shared/components/molecules/ListItem';
import { Typography } from '../../src/shared/components/atoms/Typography';
import { ProgressBar } from '../../src/shared/components/molecules/ProgressBar';
import { LoadingSpinner } from '../../src/shared/components/atoms/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../src/features/finance/components/molecules/ErrorMessage/ErrorMessage';
import { EmptyState } from '../../src/shared/components/atoms/EmptyState/EmptyState';

// Context and Services
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/utils/supabase';
import { logoSvg } from '../../src/utils/svgPatterns';
import { colors } from '../../src/styles/colors';

// Icon types for proper typing
type IoniconsIcon = keyof typeof Ionicons.glyphMap;

interface ActivityItem {
  id: number;
  type: 'academic' | 'quran' | 'dorm';
  title: string;
  score?: string;
  progress?: string;
  status?: string;
  date: string;
}

interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
}

interface StudentData {
  name: string;
  grade: string;
  class: string;
  dorm: string;
  room: string;
  quranProgress: number;
  academicProgress: number;
  attendanceRate: number;
  recentActivities: ActivityItem[];
  upcomingEvents: EventItem[];
}

export default function ParentDashboard() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [schoolName, setSchoolName] = useState('Zaid Bin Tsabit');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const [studentData] = useState<StudentData>({
    name: 'Ahmad Farhan',
    grade: '8',
    class: 'VIII-A',
    dorm: 'Al-Farabi',
    room: '203',
    quranProgress: 68,
    academicProgress: 85,
    attendanceRate: 98,
    recentActivities: [
      {
        id: 1,
        type: 'academic',
        title: 'Ujian Matematika',
        score: '85/100',
        date: '2 jam yang lalu',
      },
      {
        id: 2,
        type: 'quran',
        title: 'Surah Al-Baqarah',
        progress: '75-82',
        date: '5 jam yang lalu',
      },
      {
        id: 3,
        type: 'dorm',
        title: 'Sholat Maghrib',
        status: 'Hadir',
        date: 'Kemarin',
      },
      {
        id: 4,
        type: 'academic',
        title: 'Proyek Sains',
        status: 'Diserahkan',
        date: 'Kemarin',
      },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Pertemuan Orang Tua-Guru',
        date: '15 Maret, 2025',
        time: '10:00',
      },
      {
        id: 2,
        title: 'Lomba Tilawah Al-Quran',
        date: '20 Maret, 2025',
        time: '14:00',
      },
    ],
  });

  // Fetch school name from database
  useEffect(() => {
    const fetchSchoolName = async () => {
      if (profile?.school_id) {
        try {
          const { data, error } = await supabase
            .from('schools')
            .select('name')
            .eq('id', profile.school_id)
            .single();
          
          if (data && !error) {
            setSchoolName(data.name);
          }
        } catch (error) {
          console.error('Error fetching school name:', error);
          setError('Gagal memuat data sekolah');
        }
      }
      setIsLoading(false);
    };

    fetchSchoolName();
  }, [profile?.school_id]);

  // Handle navigation
  const handleNavigate = (route: string) => {
    router.push(route as Parameters<typeof router.push>[0]);
  };

  // Handle modal opening
  const handleOpenModal = (modalType: string) => {
    console.log('Opening modal:', modalType);
  };

  // Tab configuration
  const tabs = [
    {
      id: 'dashboard',
      label: 'Beranda',
      icon: 'home-outline' as IoniconsIcon,
    },
    {
      id: 'messages',
      label: 'Pesan',
      icon: 'chatbubble-outline' as IoniconsIcon,
    },
    {
      id: 'leave',
      label: 'Izin',
      icon: 'calendar-outline' as IoniconsIcon,
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: 'settings-outline' as IoniconsIcon,
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
      title: 'CCTV',
      icon: 'videocam-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/parent/cctv-request'),
      variant: 'primary' as const,
    },
    {
      title: 'Laporan Insiden',
      icon: 'warning-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/parent/incident-report'),
      variant: 'secondary' as const,
    },
    {
      title: 'Anti-Bullying',
      icon: 'shield-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/parent/anti-bullying'),
      variant: 'primary' as const,
    },
    {
      title: 'Pesan Guru',
      icon: 'chatbubbles-outline' as IoniconsIcon,
      onPress: () => handleOpenModal('teacher-messages'),
      variant: 'primary' as const,
    },
    {
      title: 'Izin Anak',
      icon: 'calendar-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/parent/leave-request'),
      variant: 'primary' as const,
    },
    {
      title: 'Nilai Anak',
      icon: 'book-outline' as IoniconsIcon,
      onPress: () => handleNavigate('/parent/grades'),
      variant: 'primary' as const,
    },
  ];

  // Helper functions with design tokens
  const getActivityIcon = (type: string): IoniconsIcon => {
    switch (type) {
      case 'academic':
        return 'school-outline';
      case 'quran':
        return 'book-outline';
      case 'dorm':
        return 'home-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'academic': return colors.success.main;
      case 'quran': return colors.primary.main;
      case 'dorm': return colors.warning.main;
      default: return colors.neutral[500];
    }
  };

  const getProgressVariant = (type: string) => {
    switch (type) {
      case 'quran': return 'default';
      case 'academic': return 'success';
      case 'attendance': return 'warning';
      default: return 'default';
    }
  };

  if (loading || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="dark" />
        <LoadingSpinner size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ErrorMessage 
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            // Re-fetch logic would go here
          }}
        />
      </View>
    );
  }

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <Card variant="elevated" style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Typography variant="h4" color="textSecondary" style={{ marginBottom: 4 }}>
              Selamat Datang, Orang Tua dari
            </Typography>
            <Typography variant="h3" weight="bold" color="primary" style={{ marginBottom: 8 }}>
              {studentData.name}
            </Typography>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
              <View style={{ width: '50%', marginBottom: 8 }}>
                <Typography variant="caption" color="textSecondary">Kelas</Typography>
                <Typography variant="body1" weight="semibold">{studentData.grade}</Typography>
              </View>
              <View style={{ width: '50%', marginBottom: 8 }}>
                <Typography variant="caption" color="textSecondary">Ruang</Typography>
                <Typography variant="body1" weight="semibold">{studentData.class}</Typography>
              </View>
              <View style={{ width: '50%', marginBottom: 8 }}>
                <Typography variant="caption" color="textSecondary">Asrama</Typography>
                <Typography variant="body1" weight="semibold">{studentData.dorm}</Typography>
              </View>
              <View style={{ width: '50%', marginBottom: 8 }}>
                <Typography variant="caption" color="textSecondary">Kamar</Typography>
                <Typography variant="body1" weight="semibold">{studentData.room}</Typography>
              </View>
            </View>
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
          {quickActions.slice(0, 3).map((action, index) => (
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
          {quickActions.slice(3).map((action, index) => (
            <QuickAction
              key={index + 3}
              title={action.title}
              icon={action.icon}
              onPress={action.onPress}
              style={{ width: '48%', marginBottom: 12 }}
              variant={action.variant}
            />
          ))}
        </View>
      </View>

      {/* Progress Overview */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Ringkasan Perkembangan
        </Typography>
        <Card variant="default">
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Typography variant="body1" weight="semibold">Hafalan Quran</Typography>
              <Typography variant="body1" weight="bold" color="primary">{studentData.quranProgress}%</Typography>
            </View>
            <ProgressBar
              value={studentData.quranProgress}
              variant={getProgressVariant('quran') as 'default' | 'success' | 'warning' | 'error'}
              size="medium"
            />
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Typography variant="body1" weight="semibold">Akademik</Typography>
              <Typography variant="body1" weight="bold" color={colors.success.main}>{studentData.academicProgress}%</Typography>
            </View>
            <ProgressBar
              value={studentData.academicProgress}
              variant={getProgressVariant('academic') as 'default' | 'success' | 'warning' | 'error'}
              size="medium"
            />
          </View>
          
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Typography variant="body1" weight="semibold">Kehadiran</Typography>
              <Typography variant="body1" weight="bold" color={colors.warning.main}>{studentData.attendanceRate}%</Typography>
            </View>
            <ProgressBar
              value={studentData.attendanceRate}
              variant={getProgressVariant('attendance') as 'default' | 'success' | 'warning' | 'error'}
              size="medium"
            />
          </View>
        </Card>
      </View>

      {/* Recent Activities */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Aktivitas Terbaru
        </Typography>
        <Card variant="default">
          {studentData.recentActivities.length === 0 ? (
            <EmptyState
              title="Belum ada aktivitas"
              subtitle="Aktivitas terbaru anak Anda akan muncul di sini"
              icon="time-outline"
            />
          ) : (
            studentData.recentActivities.map((activity, index) => (
              <View key={activity.id}>
                <ListItem
                  title={activity.title}
                  subtitle={activity.score || activity.progress || activity.status}
                  leftIcon={getActivityIcon(activity.type)}
                  rightIcon="chevron-forward"
                  onPress={() => console.log('Activity pressed:', activity.title)}
                />
                {index < studentData.recentActivities.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
                )}
              </View>
            ))
          )}
        </Card>
      </View>

      {/* Upcoming Events */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Acara Mendatang
        </Typography>
        <Card variant="default">
          {studentData.upcomingEvents.length === 0 ? (
            <EmptyState
              title="Belum ada acara"
              subtitle="Acara mendatang akan muncul di sini"
              icon="calendar-outline"
            />
          ) : (
            studentData.upcomingEvents.map((event, index) => (
              <View key={event.id}>
                <ListItem
                  title={event.title}
                  subtitle={event.time}
                  leftComponent={
                    <View style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      backgroundColor: colors.primary.main,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" color="white" weight="bold">
                        {event.date.split(',')[0].split(' ')[1]}
                      </Typography>
                      <Typography variant="caption" color="white">
                        {event.date.split(',')[0].split(' ')[0].substring(0, 3)}
                      </Typography>
                    </View>
                  }
                  rightIcon="chevron-forward"
                  onPress={() => console.log('Event pressed:', event.title)}
                />
                {index < studentData.upcomingEvents.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
                )}
              </View>
            ))
          )}
        </Card>
      </View>

      {/* Safety & Monitoring */}
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          Keamanan & Pemantauan
        </Typography>
        <Card variant="default">
          <ListItem
            title="Permintaan Akses CCTV"
            subtitle="Minta akses untuk memantau kegiatan anak Anda"
            leftIcon="videocam-outline"
            rightIcon="chevron-forward"
            onPress={() => handleNavigate('/parent/cctv-request')}
          />
          <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
          <ListItem
            title="Laporkan Insiden"
            subtitle="Laporkan insiden atau kejadian yang perlu perhatian"
            leftIcon="warning-outline"
            rightIcon="chevron-forward"
            onPress={() => handleNavigate('/parent/incident-report')}
          />
          <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
          <ListItem
            title="Sumber Anti-Perundungan"
            subtitle="Akses informasi dan sumber daya anti-perundungan"
            leftIcon="shield-outline"
            rightIcon="chevron-forward"
            onPress={() => handleNavigate('/parent/anti-bullying')}
          />
        </Card>
      </View>
    </ScrollView>
  );

  const renderMessages = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <EmptyState
        title="Fitur Pesan Segera Hadir"
        subtitle="Anda akan dapat berkomunikasi dengan guru dan staf di sini"
        icon="chatbubble-outline"
      />
    </View>
  );

  const renderLeaveRequests = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <EmptyState
        title="Permintaan Izin Segera Hadir"
        subtitle="Anda akan dapat mengajukan dan melacak izin ketidakhadiran anak Anda di sini"
        icon="calendar-outline"
      />
    </View>
  );

  const renderSettings = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card variant="default" style={{ marginBottom: 16 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          Pengaturan Akun
        </Typography>
        
        <ListItem
          title="Edit Profil"
          leftIcon="person-outline"
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur edit profil akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Pengaturan Notifikasi"
          leftIcon="notifications-outline"
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur pengaturan notifikasi akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Bahasa"
          leftIcon="language-outline"
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur pengaturan bahasa akan segera hadir!')}
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
          onPress={() => alert('Fitur pusat bantuan akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Syarat & Ketentuan"
          leftIcon="document-text-outline"
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur syarat & ketentuan akan segera hadir!')}
        />
        <View style={{ height: 1, backgroundColor: colors.neutral[200], marginHorizontal: 16 }} />
        
        <ListItem
          title="Kebijakan Privasi"
          leftIcon="shield-checkmark-outline"
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur kebijakan privasi akan segera hadir!')}
        />
      </Card>
    </ScrollView>
  );

  // Content mapping based on active tab
  const getContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'messages':
        return renderMessages();
      case 'leave':
        return renderLeaveRequests();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardTemplate
      header={{
        title: 'Dashboard Orang Tua',
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
      testID="parent-dashboard"
    >
      {getContent()}
    </DashboardTemplate>
  );
}