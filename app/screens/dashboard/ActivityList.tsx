import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Activity {
  id: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconContainerBg: string;
  title: string;
  description: string;
  time: string;
}

interface ActivityListProps {
  activities: Activity[];
  onViewAll: () => void;
}

const ActivityItem = ({ activity }: { activity: Activity }) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIconContainer, { backgroundColor: activity.iconContainerBg }]}>
      <Ionicons name={activity.iconName} size={20} color="#ffffff" />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <Text style={styles.activityDescription}>{activity.description}</Text>
      <Text style={styles.activityTime}>{activity.time}</Text>
    </View>
  </View>
);

export default function ActivityList({ activities, onViewAll }: ActivityListProps) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Log Aktivitas</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllLink}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.activityListContainer}>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  viewAllLink: {
    fontSize: 14,
    color: '#005e7a',
  },
  activityListContainer: {},
  activityItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 12,
    color: '#888888',
  },
}); 