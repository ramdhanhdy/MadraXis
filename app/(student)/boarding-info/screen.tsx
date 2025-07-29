import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Design System Components
import { Typography } from '@ui/atoms/Typography';
import { Card } from '@ui/molecules/Card';
import { ListItem } from '@ui/molecules/ListItem';
import { Button } from '@ui/atoms/Button';

// Feature Model
import { 
  mockBoardingInfo, 
  mockEmergencyContacts,
  calculateStayDuration,
  formatPhoneNumber,
  BOARDING_ERRORS 
} from './model';

export default function BoardingInfoScreen() {
  // For now, we'll use mock data since this is a placeholder feature
  const boardingInfo = mockBoardingInfo;
  const emergencyContacts = mockEmergencyContacts;
  const stayDuration = calculateStayDuration(boardingInfo.checkInDate);

  const handleCallSupervisor = () => {
    const phoneUrl = `tel:${boardingInfo.supervisor.phone}`;
    Linking.openURL(phoneUrl);
  };

  const handleCallEmergency = (phone: string) => {
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl);
  };

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Informasi Asrama" 
      }} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h2" weight="bold" style={styles.title}>
              Informasi Asrama
            </Typography>
            <Typography variant="body1" color="textSecondary" style={styles.subtitle}>
              Detail informasi tempat tinggal Anda di asrama
            </Typography>
          </View>

          {/* Room Information */}
          <Card variant="elevated" style={styles.card}>
            <Typography variant="h4" weight="semibold" style={styles.cardTitle}>
              Informasi Kamar
            </Typography>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Typography variant="caption" color="textSecondary">
                  Nama Asrama
                </Typography>
                <Typography variant="body1" weight="medium">
                  {boardingInfo.dormitoryName}
                </Typography>
              </View>
              <View style={styles.infoItem}>
                <Typography variant="caption" color="textSecondary">
                  Nomor Kamar
                </Typography>
                <Typography variant="body1" weight="medium">
                  {boardingInfo.roomNumber}
                </Typography>
              </View>
              {boardingInfo.bedNumber && (
                <View style={styles.infoItem}>
                  <Typography variant="caption" color="textSecondary">
                    Nomor Tempat Tidur
                  </Typography>
                  <Typography variant="body1" weight="medium">
                    {boardingInfo.bedNumber}
                  </Typography>
                </View>
              )}
              <View style={styles.infoItem}>
                <Typography variant="caption" color="textSecondary">
                  Lama Tinggal
                </Typography>
                <Typography variant="body1" weight="medium">
                  {stayDuration}
                </Typography>
              </View>
            </View>
          </Card>

          {/* Supervisor Information */}
          <Card variant="elevated" style={styles.card}>
            <Typography variant="h4" weight="semibold" style={styles.cardTitle}>
              Pengawas Asrama
            </Typography>
            <View style={styles.supervisorInfo}>
              <View style={styles.supervisorDetails}>
                <Typography variant="body1" weight="semibold">
                  {boardingInfo.supervisor.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatPhoneNumber(boardingInfo.supervisor.phone)}
                </Typography>
                {boardingInfo.supervisor.email && (
                  <Typography variant="body2" color="textSecondary">
                    {boardingInfo.supervisor.email}
                  </Typography>
                )}
              </View>
              <Button
                title="Hubungi"
                variant="secondary"
                size="small"
                onPress={handleCallSupervisor}
                leftIcon="call-outline"
              />
            </View>
          </Card>

          {/* Roommates */}
          {boardingInfo.roommates.length > 0 && (
            <Card variant="elevated" style={styles.card}>
              <Typography variant="h4" weight="semibold" style={styles.cardTitle}>
                Teman Sekamar
              </Typography>
              {boardingInfo.roommates.map((roommate, index) => (
                <ListItem
                  key={index}
                  title={roommate}
                  leftIcon="person-outline"
                  showDivider={index < boardingInfo.roommates.length - 1}
                />
              ))}
            </Card>
          )}

          {/* Facilities */}
          <Card variant="elevated" style={styles.card}>
            <Typography variant="h4" weight="semibold" style={styles.cardTitle}>
              Fasilitas
            </Typography>
            <View style={styles.facilitiesGrid}>
              {boardingInfo.facilities.map((facility, index) => (
                <View key={index} style={styles.facilityItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Typography variant="body2" style={styles.facilityText}>
                    {facility}
                  </Typography>
                </View>
              ))}
            </View>
          </Card>

          {/* Rules */}
          <Card variant="elevated" style={styles.card}>
            <Typography variant="h4" weight="semibold" style={styles.cardTitle}>
              Peraturan Asrama
            </Typography>
            {boardingInfo.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Typography variant="body2" color="textSecondary" style={styles.ruleNumber}>
                  {index + 1}.
                </Typography>
                <Typography variant="body2" style={styles.ruleText}>
                  {rule}
                </Typography>
              </View>
            ))}
          </Card>

          {/* Emergency Contacts */}
          <Card variant="elevated" style={[styles.card, styles.lastCard]}>
            <Typography variant="h4" weight="semibold" style={styles.cardTitle}>
              Kontak Darurat
            </Typography>
            {emergencyContacts.map((contact, index) => (
              <ListItem
                key={index}
                title={contact.name}
                subtitle={`${contact.relationship} • ${formatPhoneNumber(contact.phone)}`}
                leftIcon="call-outline"
                rightComponent={
                  <Button
                    title="Hubungi"
                    variant="secondary"
                    size="small"
                    onPress={() => handleCallEmergency(contact.phone)}
                  />
                }
                showDivider={index < emergencyContacts.length - 1}
              />
            ))}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

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
  card: {
    marginBottom: 16,
  },
  lastCard: {
    marginBottom: 32,
  },
  cardTitle: {
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  supervisorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supervisorDetails: {
    flex: 1,
    marginRight: 16,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  facilityText: {
    marginLeft: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ruleNumber: {
    width: 20,
  },
  ruleText: {
    flex: 1,
    lineHeight: 20,
  },
});
