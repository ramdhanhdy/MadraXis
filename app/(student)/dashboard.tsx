import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import LogoutButton from '@/src/components/molecules/LogoutButton';
import BoardingInfoModal from '@/src/components/organisms/StudentBoardingInfoModal';
import CommunicationModal from '@/src/components/organisms/StudentCommunicationModal';
import IncidentReportModal from '@/src/components/organisms/StudentIncidentReportModal';
import { useAuth } from '@/src/context/AuthContext';
import { DashboardTemplate } from '@/src/components/templates/DashboardTemplate';
import type { TabConfig, HeaderAction } from '@/src/components/templates/DashboardTemplate';
import { Card } from '@/src/components/molecules/Card';
import { QuickAction } from '@/src/components/molecules/QuickAction';
import { ProgressBar } from '@/src/components/molecules/ProgressBar';
import { ListItem } from '@/src/components/molecules/ListItem';
import { Button } from '@/src/components/atoms/Button';
import { Typography } from '@/src/components/atoms/Typography';
import { Modal } from '@/src/components/organisms/Modal';
import { colors } from '@/src/styles/colors';
import { spacing } from '@/src/styles/spacing';

export default function StudentDashboard() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });
  const [activeTab, setActiveTab] = useState('dashboard');

  // Header configuration
  const headerConfig = {
    title: 'Dashboard Siswa',
    rightActions: [
      {
        icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
        onPress: () => {
          // TODO: Implement notification handling
          console.log('Notifications pressed');
        },
        accessibilityLabel: 'Notifikasi',
        testID: 'notifications-button',
      },
    ] as HeaderAction[],
  };

  // Tab configuration
  const tabsConfig: TabConfig[] = [
    {
      id: 'dashboard',
      label: 'Beranda',
      icon: 'home-outline',
      accessibilityLabel: 'Beranda',
      testID: 'tab-dashboard',
    },
    {
      id: 'messages',
      label: 'Pesan',
      icon: 'chatbubble-outline',
      accessibilityLabel: 'Pesan',
      testID: 'tab-messages',
    },
    {
      id: 'schedule',
      label: 'Jadwal',
      icon: 'calendar-outline',
      accessibilityLabel: 'Jadwal',
      testID: 'tab-schedule',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: 'person-outline',
      accessibilityLabel: 'Profil',
      testID: 'tab-profile',
    },
  ];
  
  const navigateToQuranProgress = () => {
    router.push('/(student)/quran-progress');
  };

  const navigateToSchedule = () => {
    router.push('/(student)/schedule');
  };

  const navigateToBoardingInfo = () => {
    router.push('/(student)/boarding-info');
  };

  const navigateToIncidentReport = () => {
    router.push('/(student)/incident-report');
  };

  const navigateToAntiBullying = () => {
    router.push('/(student)/anti-bullying');
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };
  
  // Components are now imported from separate files
  
  const renderDashboard = () => (
    <ScrollView style={styles.contentContainer}>
      {/* Welcome Banner */}
      <Card 
        variant="default" 
        padding="large"
        style={styles.welcomeBanner}
      >
        <View style={styles.welcomeContent}>
          <Typography variant="body2" color={colors.text.inverse}>
            Assalamu'alaikum,
          </Typography>
          <Typography variant="h3" color={colors.text.inverse} weight="bold" style={{ marginVertical: spacing.xs }}>
            {profile?.full_name || 'Ahmad Fauzi'}
          </Typography>
          <Typography variant="body2" color={colors.secondary.light}>
            Semangat menghafal Al-Quran hari ini!
          </Typography>
        </View>
        <View style={styles.logoContainer}>
          <SvgXml xml={logoSvg} width={80} height={80} />
        </View>
      </Card>
      
      {/* Progress Section */}
      <View style={styles.sectionContainer}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: spacing.md }}>
          Progress Hafalan
        </Typography>
        <Card variant="default" padding="medium">
          <View style={styles.progressHeader}>
            <Typography variant="body1" weight="bold" color="primary">
              Al-Baqarah
            </Typography>
            <Typography variant="body1" weight="bold" color={colors.primary.main}>
              60%
            </Typography>
          </View>
          <ProgressBar
            value={60}
            variant="default"
            size="medium"
            animated={true}
            style={{ marginVertical: spacing.md }}
          />
          <Typography variant="body2" color="secondary" align="center">
            120 dari 200 ayat
          </Typography>
        </Card>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: spacing.md }}>
          Aksi Cepat
        </Typography>
        <View style={styles.quickActionsContainer}>
          <QuickAction
            title="Hafalan"
            icon="book"
            variant="primary"
            size="medium"
            onPress={navigateToQuranProgress}
            style={{ width: '23%' }}
            testID="quick-action-hafalan"
          />
          
          <QuickAction
            title="Jadwal"
            icon="calendar"
            variant="secondary"
            size="medium"
            onPress={navigateToSchedule}
            style={{ width: '23%' }}
            testID="quick-action-jadwal"
          />
          
          <QuickAction
            title="Komunikasi"
            icon="chatbubbles"
            variant="primary"
            size="medium"
            onPress={() => openModal('Komunikasi', <CommunicationModal />)}
            style={{ width: '23%' }}
            testID="quick-action-komunikasi"
          />
          
          <QuickAction
            title="Profil"
            icon="person"
            variant="primary"
            size="medium"
            onPress={() => setActiveTab('profile')}
            style={{ width: '23%' }}
            testID="quick-action-profil"
          />
        </View>
      </View>

      {/* New Feature Section */}
      <View style={styles.sectionContainer}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: spacing.md }}>
          Fitur Tambahan
        </Typography>
        <View style={styles.quickActionsContainer}>
          <QuickAction
            title="Info Asrama"
            icon="home"
            variant="default"
            size="medium"
            onPress={navigateToBoardingInfo}
            style={{ width: '23%' }}
            testID="quick-action-info-asrama"
          />
          
          <QuickAction
            title="Lapor Masalah"
            icon="warning"
            variant="default"
            size="medium"
            onPress={navigateToIncidentReport}
            style={{ width: '23%' }}
            testID="quick-action-lapor-masalah"
          />
          
          <QuickAction
            title="Anti-Perundungan"
            icon="shield"
            variant="default"
            size="medium"
            onPress={navigateToAntiBullying}
            style={{ width: '23%' }}
            testID="quick-action-anti-perundungan"
          />
          
          <QuickAction
            title="Izin Keluar"
            icon="document-text"
            variant="default"
            size="medium"
            onPress={() => alert('Fitur izin keluar akan segera hadir!')}
            style={{ width: '23%' }}
            testID="quick-action-izin-keluar"
          />
        </View>
      </View>
      
      {/* Upcoming Schedule */}
      <View style={styles.sectionContainer}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: spacing.md }}>
          Jadwal Mendatang
        </Typography>
        <Card variant="default" padding="medium">
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleDay}>
              <Typography variant="body2" color={colors.text.inverse} weight="bold">
                Senin
              </Typography>
            </View>
            <View style={styles.scheduleInfo}>
              <Typography variant="body1" color="primary" weight="bold" style={{ marginBottom: spacing.xs }}>
                08:00 - 10:00
              </Typography>
              <Typography variant="body2" color="secondary">
                Setoran Hafalan
              </Typography>
            </View>
          </View>
          <Typography variant="body2" color="tertiary" style={{ fontStyle: 'italic' }}>
            Persiapkan hafalan Al-Baqarah ayat 255-257
          </Typography>
        </Card>
      </View>
    </ScrollView>
  );

  const renderMessages = () => (
    <View style={styles.centeredContainer}>
      <MaterialIcons name="message" size={80} color={colors.neutral[400]} />
      <Typography variant="h4" color="secondary" weight="bold" style={{ marginTop: spacing.md }}>
        Fitur Pesan Segera Hadir
      </Typography>
      <Typography variant="body2" color="tertiary" align="center" style={{ marginTop: spacing.sm, paddingHorizontal: spacing.lg }}>
        Anda akan dapat berkomunikasi dengan guru dan orang tua di sini.
      </Typography>
    </View>
  );

  const renderSchedule = () => (
    <View style={styles.centeredContainer}>
      <MaterialIcons name="event-note" size={80} color={colors.neutral[400]} />
      <Typography variant="h4" color="secondary" weight="bold" style={{ marginTop: spacing.md }}>
        Jadwal Lengkap Segera Hadir
      </Typography>
      <Typography variant="body2" color="tertiary" align="center" style={{ marginTop: spacing.sm, paddingHorizontal: spacing.lg }}>
        Anda akan dapat melihat jadwal harian, mingguan, dan bulanan di sini.
      </Typography>
    </View>
  );

  const renderProfile = () => {
    if (loading) {
      return (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.profileHeader}>
            <Ionicons name="person-circle-outline" size={80} color={colors.role.student.primary} />
            <Typography variant="h3" color="primary" weight="bold" style={{ marginTop: spacing.md }}>
              Loading...
            </Typography>
            <Typography variant="body1" color="secondary" style={{ marginTop: spacing.xs }}>
              Loading...
            </Typography>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.contentContainer}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle-outline" size={80} color={colors.role.student.primary} />
          <Typography variant="h3" color="primary" weight="bold" style={{ marginTop: spacing.md }}>
            {profile?.full_name || 'Nama Siswa'}
          </Typography>
          <Typography variant="body1" color="secondary" style={{ marginTop: spacing.xs }}>
            {profile?.role === 'student' ? 'Siswa' : profile?.role || 'Role tidak diketahui'}
          </Typography>
        </View>
      
        <View style={styles.profileSection}>
          <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: spacing.md }}>
            Pengaturan Akun
          </Typography>
          
          <Card variant="default" padding="none" style={{ marginBottom: spacing.xs }}>
            <ListItem
              title="Edit Profil"
              leftIcon="person"
              rightIcon="chevron-forward"
              onPress={() => alert('Fitur edit profil akan segera hadir!')}
              testID="profile-edit"
            />
            <ListItem
              title="Ubah Password"
              leftIcon="lock-closed"
              rightIcon="chevron-forward"
              onPress={() => alert('Fitur ubah password akan segera hadir!')}
              showDivider={true}
              testID="profile-password"
            />
            <ListItem
              title="Pengaturan Notifikasi"
              leftIcon="notifications"
              rightIcon="chevron-forward"
              onPress={() => alert('Fitur pengaturan notifikasi akan segera hadir!')}
              showDivider={true}
              testID="profile-notifications"
            />
            <ListItem
              title="Bahasa"
              leftIcon="language"
              rightIcon="chevron-forward"
              onPress={() => alert('Fitur pengaturan bahasa akan segera hadir!')}
              showDivider={true}
              testID="profile-language"
            />
          </Card>
        </View>
        
        <View style={styles.profileSection}>
          <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: spacing.md }}>
            Bantuan
          </Typography>
          
          <Card variant="default" padding="none" style={{ marginBottom: spacing.xs }}>
            <ListItem
              title="Pusat Bantuan"
              leftIcon="help-circle"
              rightIcon="chevron-forward"
              onPress={() => alert('Fitur pusat bantuan akan segera hadir!')}
              testID="profile-help"
            />
            <ListItem
              title="Syarat & Ketentuan"
              leftIcon="document-text"
              rightIcon="chevron-forward"
              onPress={() => alert('Fitur syarat & ketentuan akan segera hadir!')}
              showDivider={true}
              testID="profile-terms"
            />
            <ListItem
              title="Kebijakan Privasi"
              leftIcon="shield-checkmark"
              rightIcon="chevron-forward"
              onPress={() => alert('Fitur kebijakan privasi akan segera hadir!')}
              showDivider={true}
              testID="profile-privacy"
            />
          </Card>
        </View>
        
        <View style={styles.profileSection}>
          <LogoutButton variant="button" style={styles.logoutButton} />
        </View>
      </ScrollView>
    );
  };
  
  // Render current tab content
  const renderCurrentTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'messages':
        return renderMessages();
      case 'schedule':
        return renderSchedule();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Dashboard Siswa" 
      }} />
      
      <DashboardTemplate
        header={headerConfig}
        tabs={tabsConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        backgroundPattern={true}
        scrollable={false}
        contentPadding={false}
        testID="student-dashboard"
      >
        {renderCurrentTabContent()}
      </DashboardTemplate>

      {/* Modal for detailed views */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        size="large"
        animationType="slide"
        scrollable={true}
        closeOnBackdrop={true}
        showCloseButton={true}
        testID="student-dashboard-modal"
      >
        {modalContent.content}
      </Modal>
    </>
  );
}

// Background Pattern SVG
const backgroundPatternSvg = `
<svg width="100%" height="100%" viewBox="0 0 800 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="1600" fill="${colors.background.primary}"/>
  
  <!-- Islamic Geometric Pattern -->
  <!-- Pattern 1: Top section -->
  <g opacity="0.05">
    <g transform="translate(0, 0)">
      ${generateGeometricPattern(8, 8, 50)}
    </g>
  </g>
  
  <!-- Pattern 2: Middle section -->
  <g opacity="0.05">
    <g transform="translate(0, 800)">
      ${generateStarPattern(8, 4, 100)}
    </g>
  </g>
  
  <!-- Pattern 3: Bottom section -->
  <g opacity="0.05">
    <g transform="translate(0, 1200)">
      ${generateArabicPattern(8, 4, 100)}
    </g>
  </g>
</svg>
`;

// Helper function to generate geometric pattern
function generateGeometricPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * size;
      const y = i * size;
      pattern += `
        <path d="M${x} ${y} L${x + size/2} ${y + size/2} L${x} ${y + size} L${x - size/2} ${y + size/2} Z" fill="${colors.role.student.primary}"/>
        <path d="M${x + size} ${y} L${x + size/2} ${y + size/2} L${x + size} ${y + size} L${x + size*1.5} ${y + size/2} Z" fill="${colors.role.student.primary}"/>
        <path d="M${x} ${y + size} L${x + size/2} ${y + size/2} L${x + size} ${y + size} L${x + size/2} ${y + size*1.5} Z" fill="${colors.role.student.primary}"/>
        <path d="M${x} ${y} L${x + size/2} ${y + size/2} L${x + size} ${y} L${x + size/2} ${y - size/2} Z" fill="${colors.role.student.primary}"/>
      `;
    }
  }
  return pattern;
}

// Helper function to generate star pattern
function generateStarPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * size * 2;
      const y = i * size * 2;
      const centerX = x + size;
      const centerY = y + size;
      
      // 8-point star
      pattern += `
        <path d="M${centerX} ${centerY - size} L${centerX + size/3} ${centerY - size/3} L${centerX + size} ${centerY} L${centerX + size/3} ${centerY + size/3} L${centerX} ${centerY + size} L${centerX - size/3} ${centerY + size/3} L${centerX - size} ${centerY} L${centerX - size/3} ${centerY - size/3} Z" fill="${colors.role.student.primary}"/>
      `;
      
      // Connecting lines
      pattern += `
        <path d="M${centerX - size} ${centerY} L${centerX - size*2} ${centerY}" stroke="${colors.role.student.primary}" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY} L${centerX + size*2} ${centerY}" stroke="${colors.role.student.primary}" stroke-width="1"/>
        <path d="M${centerX} ${centerY - size} L${centerX} ${centerY - size*2}" stroke="${colors.role.student.primary}" stroke-width="1"/>
        <path d="M${centerX} ${centerY + size} L${centerX} ${centerY + size*2}" stroke="${colors.role.student.primary}" stroke-width="1"/>
      `;
    }
  }
  return pattern;
}

// Helper function to generate Arabic-inspired pattern
function generateArabicPattern(rows: number, cols: number, size: number): string {
  let pattern = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const centerX = j * size * 3 + size * 1.5;
      const centerY = i * size * 3 + size * 1.5;
      
      pattern += `
        <path d="M${centerX - size} ${centerY - size} L${centerX} ${centerY - size*1.5} L${centerX + size} ${centerY - size} L${centerX + size} ${centerY + size/2} L${centerX} ${centerY + size} L${centerX - size} ${centerY + size/2} Z" stroke="${colors.role.student.primary}" stroke-width="1" fill="none"/>
        <path d="M${centerX - size} ${centerY - size} L${centerX - size} ${centerY + size/2}" stroke="${colors.role.student.primary}" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY - size} L${centerX + size} ${centerY + size/2}" stroke="${colors.role.student.primary}" stroke-width="1"/>
        <path d="M${centerX - size} ${centerY + size/2} L${centerX - size} ${centerY + size}" stroke="${colors.role.student.primary}" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY + size/2} L${centerX + size} ${centerY + size}" stroke="${colors.role.student.primary}" stroke-width="1"/>
        <path d="M${centerX - size} ${centerY + size} Q${centerX} ${centerY + size*1.2}, ${centerX + size} ${centerY + size}" stroke="${colors.role.student.primary}" stroke-width="1" fill="none"/>
      `;
    }
  }
  return pattern;
}

// Logo SVG
const logoSvg = `
<svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="60" fill="${colors.role.student.primary}"/>
  <circle cx="60" cy="60" r="50" fill="${colors.role.student.primary}" stroke="${colors.secondary.main}" stroke-width="2"/>
  
  <!-- Open Book -->
  <path d="M30 45 L30 75 L60 65 L90 75 L90 45 L60 35 L30 45Z" fill="${colors.secondary.main}"/>
  <path d="M30 45 L60 35 L60 65 L30 75 L30 45Z" fill="${colors.secondary.main}" stroke="${colors.role.student.primary}" stroke-width="1"/>
  <path d="M60 35 L90 45 L90 75 L60 65 L60 35Z" fill="${colors.white}" stroke="${colors.role.student.primary}" stroke-width="1"/>
  
  <!-- Book Pages Lines -->
  <path d="M40 48 L50 45" stroke="${colors.role.student.primary}" stroke-width="1"/>
  <path d="M40 53 L50 50" stroke="${colors.role.student.primary}" stroke-width="1"/>
  <path d="M40 58 L50 55" stroke="${colors.role.student.primary}" stroke-width="1"/>
  <path d="M70 45 L80 48" stroke="${colors.role.student.primary}" stroke-width="1"/>
  <path d="M70 50 L80 53" stroke="${colors.role.student.primary}" stroke-width="1"/>
  <path d="M70 55 L80 58" stroke="${colors.role.student.primary}" stroke-width="1"/>
  
  <!-- Decorative Elements -->
  <circle cx="60" cy="85" r="5" fill="${colors.secondary.main}"/>
  <path d="M55 25 Q60 15 65 25" stroke="${colors.secondary.main}" stroke-width="2" fill="none"/>
  <path d="M50 28 Q60 15 70 28" stroke="${colors.secondary.main}" stroke-width="2" fill="none"/>
</svg>
`;

const styles = StyleSheet.create({
  // Core layout styles
  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },
  
  // Welcome banner styles (custom styling for Card component)
  welcomeBanner: {
    backgroundColor: colors.role.student.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeContent: {
    flex: 1,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Section layout styles
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  
  // Progress section styles
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  // Quick actions layout
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Schedule section styles
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scheduleDay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  scheduleInfo: {
    flex: 1,
  },
  
  // Placeholder content styles
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  
  // Profile section styles
  profileHeader: {
    alignItems: 'center',
    padding: spacing.md,
  },
  profileSection: {
    marginBottom: spacing.lg,
  },
  logoutButton: {
    backgroundColor: colors.error.main,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
