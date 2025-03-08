import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';

export default function StudentDashboard() {
  const router = useRouter();
  
  const handleBackToRoleSelection = () => {
    router.push('/screens/RoleSelectionScreen');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundContainer}>
        <SvgXml xml={backgroundPatternSvg} width="100%" height="100%" />
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToRoleSelection}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard Siswa</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>Assalamu'alaikum,</Text>
            <Text style={styles.userName}>Ahmad Fauzi</Text>
            <Text style={styles.welcomeSubtext}>Semangat menghafal Al-Quran hari ini!</Text>
          </View>
          <View style={styles.logoContainer}>
            <SvgXml xml={logoSvg} width={80} height={80} />
          </View>
        </View>
        
        {/* Progress Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Progress Hafalan</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Al-Baqarah</Text>
              <Text style={styles.progressPercentage}>60%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.progressDetail}>120 dari 200 ayat</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#005e7a' }]}>
                <Ionicons name="book" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Hafalan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#f0c75e' }]}>
                <Ionicons name="calendar" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Jadwal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#4caf50' }]}>
                <Ionicons name="stats-chart" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Laporan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#9c27b0' }]}>
                <Ionicons name="person" size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Upcoming Schedule */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Jadwal Mendatang</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleDay}>
                <Text style={styles.scheduleDayText}>Senin</Text>
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTime}>08:00 - 10:00</Text>
                <Text style={styles.scheduleActivity}>Setoran Hafalan</Text>
              </View>
            </View>
            <Text style={styles.scheduleNote}>
              Persiapkan hafalan Al-Baqarah ayat 255-257
            </Text>
          </View>
        </View>
        
        {/* Development Note */}
        <View style={styles.developmentNote}>
          <Ionicons name="construct" size={20} color="#005e7a" />
          <Text style={styles.developmentNoteText}>
            Mode siswa masih dalam pengembangan. Fitur-fitur akan segera hadir!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Background Pattern SVG
const backgroundPatternSvg = `
<svg width="100%" height="100%" viewBox="0 0 800 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="1600" fill="#f5f5f5"/>
  
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
        <path d="M${x} ${y} L${x + size/2} ${y + size/2} L${x} ${y + size} L${x - size/2} ${y + size/2} Z" fill="#005e7a"/>
        <path d="M${x + size} ${y} L${x + size/2} ${y + size/2} L${x + size} ${y + size} L${x + size*1.5} ${y + size/2} Z" fill="#005e7a"/>
        <path d="M${x} ${y + size} L${x + size/2} ${y + size/2} L${x + size} ${y + size} L${x + size/2} ${y + size*1.5} Z" fill="#005e7a"/>
        <path d="M${x} ${y} L${x + size/2} ${y + size/2} L${x + size} ${y} L${x + size/2} ${y - size/2} Z" fill="#005e7a"/>
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
        <path d="M${centerX} ${centerY - size} L${centerX + size/3} ${centerY - size/3} L${centerX + size} ${centerY} L${centerX + size/3} ${centerY + size/3} L${centerX} ${centerY + size} L${centerX - size/3} ${centerY + size/3} L${centerX - size} ${centerY} L${centerX - size/3} ${centerY - size/3} Z" fill="#005e7a"/>
      `;
      
      // Connecting lines
      pattern += `
        <path d="M${centerX - size} ${centerY} L${centerX - size*2} ${centerY}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY} L${centerX + size*2} ${centerY}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX} ${centerY - size} L${centerX} ${centerY - size*2}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX} ${centerY + size} L${centerX} ${centerY + size*2}" stroke="#005e7a" stroke-width="1"/>
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
      const x = j * size * 2;
      const y = i * size * 2;
      const centerX = x + size;
      const centerY = y + size;
      
      // Arch pattern
      pattern += `
        <path d="M${centerX - size} ${centerY + size/2} Q${centerX} ${centerY - size}, ${centerX + size} ${centerY + size/2}" stroke="#005e7a" stroke-width="1" fill="none"/>
        <path d="M${centerX - size/2} ${centerY + size/4} Q${centerX} ${centerY - size/2}, ${centerX + size/2} ${centerY + size/4}" stroke="#005e7a" stroke-width="1" fill="none"/>
        <circle cx="${centerX}" cy="${centerY - size/4}" r="${size/10}" fill="#005e7a"/>
      `;
      
      // Decorative elements
      pattern += `
        <path d="M${centerX - size} ${centerY + size/2} L${centerX - size} ${centerY + size}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX + size} ${centerY + size/2} L${centerX + size} ${centerY + size}" stroke="#005e7a" stroke-width="1"/>
        <path d="M${centerX - size} ${centerY + size} Q${centerX} ${centerY + size*1.2}, ${centerX + size} ${centerY + size}" stroke="#005e7a" stroke-width="1" fill="none"/>
      `;
    }
  }
  return pattern;
}

// Logo SVG
const logoSvg = `
<svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="60" fill="#005e7a"/>
  <circle cx="60" cy="60" r="50" fill="#005e7a" stroke="#f0c75e" stroke-width="2"/>
  
  <!-- Open Book -->
  <path d="M30 45 L30 75 L60 65 L90 75 L90 45 L60 35 L30 45Z" fill="#f0c75e"/>
  <path d="M30 45 L60 35 L60 65 L30 75 L30 45Z" fill="#f0c75e" stroke="#005e7a" stroke-width="1"/>
  <path d="M60 35 L90 45 L90 75 L60 65 L60 35Z" fill="#ffffff" stroke="#005e7a" stroke-width="1"/>
  
  <!-- Book Pages Lines -->
  <path d="M40 48 L50 45" stroke="#005e7a" stroke-width="1"/>
  <path d="M40 53 L50 50" stroke="#005e7a" stroke-width="1"/>
  <path d="M40 58 L50 55" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 45 L80 48" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 50 L80 53" stroke="#005e7a" stroke-width="1"/>
  <path d="M70 55 L80 58" stroke="#005e7a" stroke-width="1"/>
  
  <!-- Decorative Elements -->
  <circle cx="60" cy="85" r="5" fill="#f0c75e"/>
  <path d="M55 25 Q60 15 65 25" stroke="#f0c75e" stroke-width="2" fill="none"/>
  <path d="M50 28 Q60 15 70 28" stroke="#f0c75e" stroke-width="2" fill="none"/>
</svg>
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeBanner: {
    flexDirection: 'row',
    backgroundColor: '#005e7a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#f0c75e',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005e7a',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#005e7a',
    borderRadius: 5,
  },
  progressDetail: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333333',
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleDay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0c75e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  scheduleDayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  scheduleActivity: {
    fontSize: 14,
    color: '#555555',
  },
  scheduleNote: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  developmentNote: {
    flexDirection: 'row',
    backgroundColor: '#e6f7ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  developmentNoteText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
}); 