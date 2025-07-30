import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { LogoutButton } from '@ui/molecules/LogoutButton';
import CommunicationModal from '@ui/organisms/StudentCommunicationModal';
import { useAuth } from '@context/AuthContext';
import { DashboardTemplate } from '@ui/templates/DashboardTemplate';
import type { TabConfig, HeaderAction } from '@ui/templates/DashboardTemplate';
import { Card } from '@ui/molecules/Card';
import { QuickAction } from '@ui/molecules/QuickAction';
import { ProgressBar } from '@ui/molecules/ProgressBar';
import { ListItem } from '@ui/molecules/ListItem';
import { Typography } from '@ui/atoms/Typography';
import { Modal } from '@ui/organisms/Modal';
import { colors } from '@design-system/tokens/colors';
import { spacing } from '@design-system/tokens/spacing';
import { logoSvg } from '@lib/utils/svgPatterns';

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
            Assalamu&apos;alaikum,
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
