import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

export default function NotificationPanel({ notifications, onMarkAllAsRead }: NotificationPanelProps) {
  return (
    <View style={styles.notificationsPanel}>
      <View style={styles.notificationsHeader}>
        <Text style={styles.notificationsTitle}>Notifikasi</Text>
        <TouchableOpacity onPress={onMarkAllAsRead}>
          <Text style={styles.markAllAsReadText}>Tandai semua telah dibaca</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notificationsList}>
        {notifications.map((notification) => (
          <View 
            key={notification.id} 
            style={[
              styles.notificationItem,
              notification.read ? styles.notificationRead : styles.notificationUnread
            ]}
          >
            <View style={styles.notificationContent}>
              <Text style={styles.notificationMessage}>{notification.title}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            <TouchableOpacity style={styles.notificationAction}>
              <Ionicons name="ellipsis-vertical" size={16} color="#888888" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationsPanel: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: '80%',
    maxHeight: 300,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  markAllAsReadText: {
    fontSize: 12,
    color: '#005e7a',
  },
  notificationsList: {
    maxHeight: 250,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  notificationUnread: {
    backgroundColor: '#f0f9ff',
  },
  notificationRead: {
    backgroundColor: '#ffffff',
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888888',
  },
  notificationAction: {
    padding: 5,
  },
});