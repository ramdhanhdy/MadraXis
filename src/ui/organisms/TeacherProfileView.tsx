/**
 * TeacherProfileView Component
 * Profile view component for teachers with design system integration
 * Replaces hardcoded styles with design tokens and atomic components
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '../../context/ThemeContext';
import { Typography } from '../atoms/Typography';
import { Card } from '../molecules/Card';
import { LogoutButton } from '../molecules/LogoutButton';

interface Profile {
  full_name?: string;
  role?: string;
}

interface ProfileViewProps {
  profile?: Profile;
  loading: boolean;
  schoolName: string;
}

export default function TeacherProfileView({ profile, loading, schoolName }: ProfileViewProps) {
  const { theme } = useTheme();
  const colors = useColors();

  if (loading) {
    return (
      <ScrollView style={[styles.contentContainer, { backgroundColor: colors.background.primary }]}>
        <Card style={styles.profileHeader}>
          <Ionicons name="person-circle-outline" size={80} color={colors.primary.main} />
          <Typography variant="h2" color="primary" style={styles.profileName}>
            Loading...
          </Typography>
          <Typography variant="body1" color="secondary" style={styles.profileRole}>
            Loading...
          </Typography>
          <Typography variant="caption" color="tertiary" style={styles.profileSchool}>
            Loading...
          </Typography>
        </Card>
      </ScrollView>
    );
  }

  const renderProfileItem = (
    icon: keyof typeof Ionicons.glyphMap,
    text: string,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={[styles.profileItem, { borderBottomColor: colors.border.secondary }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      <Ionicons name={icon} size={24} color={colors.primary.main} />
      <Typography variant="body1" style={styles.profileItemText}>
        {text}
      </Typography>
      <Ionicons name="chevron-forward" size={24} color={colors.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.contentContainer, { backgroundColor: colors.background.primary }]}>
      {/* Profile Header */}
      <Card style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={80} color={colors.primary.main} />
        <Typography variant="h2" color="primary" style={styles.profileName}>
          {profile?.full_name || 'Nama Pengguna'}
        </Typography>
        <Typography variant="body1" color="secondary" style={styles.profileRole}>
          {profile?.role === 'teacher' ? 'Guru Tahfidz' : profile?.role || 'Role tidak diketahui'}
        </Typography>
        <Typography variant="caption" color="tertiary" style={styles.profileSchool}>
          {schoolName}
        </Typography>
      </Card>

      {/* Account Settings Section */}
      <Card style={styles.profileSection}>
        <View style={[styles.sectionHeader, { borderBottomColor: colors.border.secondary }]}>
          <Typography variant="h3" color="primary">
            Pengaturan Akun
          </Typography>
        </View>

        {renderProfileItem('person', 'Edit Profil')}
        {renderProfileItem('lock-closed', 'Ubah Password')}
        {renderProfileItem('notifications', 'Pengaturan Notifikasi')}
        {renderProfileItem('language', 'Bahasa')}
      </Card>

      {/* Help Section */}
      <Card style={styles.profileSection}>
        <View style={[styles.sectionHeader, { borderBottomColor: colors.border.secondary }]}>
          <Typography variant="h3" color="primary">
            Bantuan
          </Typography>
        </View>

        {renderProfileItem('help-circle', 'Pusat Bantuan')}
        {renderProfileItem('document-text', 'Syarat & Ketentuan')}
        {renderProfileItem('shield-checkmark', 'Kebijakan Privasi')}
      </Card>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <LogoutButton variant="button" />
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: theme.spacing.base.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    margin: 16,
    marginBottom: 8,
  },
  profileName: {
    marginTop: 12,
    textAlign: 'center',
  },
  profileRole: {
    marginTop: 4,
    textAlign: 'center',
  },
  profileSchool: {
    marginTop: 4,
    textAlign: 'center',
  },
  profileSection: {
    margin: 16,
    marginTop: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  profileItemText: {
    marginLeft: 12,
    flex: 1,
  },
  logoutSection: {
    margin: 16,
    marginTop: 8,
  },
});