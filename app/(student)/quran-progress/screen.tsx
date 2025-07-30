import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Design System Components
import { Typography } from '@ui/atoms/Typography';
import { Card } from '@ui/molecules/Card';
import { EmptyState } from '@ui/molecules/EmptyState/EmptyState';

// Feature Model
import { 
  mockProgressData, 
  calculateProgressPercentage,
  formatProgressStatus,
  PROGRESS_STATUS 
} from './model';

export default function QuranProgressScreen() {
  // For now, we'll use mock data since this is a placeholder feature
  const progressData = mockProgressData;
  const progressPercentage = calculateProgressPercentage(progressData);

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Progress Hafalan Quran" 
      }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h2" weight="bold" style={styles.title}>
              Progress Hafalan Quran
            </Typography>
            <Typography variant="body1" color="textSecondary" style={styles.subtitle}>
              Pantau perkembangan hafalan Al-Quran Anda
            </Typography>
          </View>

          {/* Progress Overview */}
          {progressData.length > 0 && (
            <Card variant="elevated" style={styles.progressCard}>
              <Typography variant="h4" weight="semibold" style={styles.cardTitle}>
                Ringkasan Progress
              </Typography>
              <View style={styles.progressStats}>
                <View style={styles.statItem}>
                  <Typography variant="h3" weight="bold" color="primary">
                    {progressPercentage}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Dikuasai
                  </Typography>
                </View>
                <View style={styles.statItem}>
                  <Typography variant="h3" weight="bold" color="secondary">
                    {progressData.length}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Hafalan
                  </Typography>
                </View>
              </View>
            </Card>
          )}

          {/* Main Content */}
          {progressData.length === 0 ? (
            <EmptyState
              title="Belum Ada Progress"
              message="Halaman Progress Hafalan Quran akan segera tersedia dengan fitur lengkap untuk memantau perkembangan hafalan Anda"
              icon="book-outline"
            />
          ) : (
            <View style={styles.progressList}>
              <Typography variant="h4" weight="semibold" style={styles.sectionTitle}>
                Daftar Hafalan
              </Typography>
              {progressData.map((item, index) => (
                <Card key={index} variant="default" style={styles.progressItem}>
                  <View style={styles.progressItemHeader}>
                    <Typography variant="body1" weight="semibold">
                      {item.surahName}
                    </Typography>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) }
                    ]}>
                      <Typography variant="caption" color="white" weight="medium">
                        {formatProgressStatus(item.status)}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="body2" color="textSecondary" style={styles.ayahRange}>
                    Ayat {item.ayahFrom} - {item.ayahTo}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={styles.date}>
                    Dihafal: {item.memorizedDate.toLocaleDateString('id-ID')}
                  </Typography>
                  {item.notes && (
                    <Typography variant="caption" color="textSecondary" style={styles.notes}>
                      {item.notes}
                    </Typography>
                  )}
                </Card>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case PROGRESS_STATUS.MASTERED:
      return '#10B981'; // Green
    case PROGRESS_STATUS.REVIEWING:
      return '#F59E0B'; // Yellow
    case PROGRESS_STATUS.MEMORIZED:
      return '#3B82F6'; // Blue
    default:
      return '#6B7280'; // Gray
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  progressCard: {
    marginBottom: 24,
  },
  cardTitle: {
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  progressList: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ayahRange: {
    marginBottom: 4,
  },
  date: {
    marginBottom: 4,
  },
  notes: {
    fontStyle: 'italic',
  },
});
