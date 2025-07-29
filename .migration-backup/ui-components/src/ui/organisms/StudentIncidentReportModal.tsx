import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../src/components/molecules/Card';
import { ListItem } from '../../../src/components/molecules/ListItem';
import { Typography } from '../../../src/components/atoms/Typography';

import { Icon } from '../../../src/components/atoms/Icon';

export default function IncidentReportModal() {
  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 15 }}>
          Laporkan Masalah
        </Typography>
        <Typography variant="body2" color="secondary" style={{ marginBottom: 15, lineHeight: 20 }}>
          Gunakan fitur ini untuk melaporkan masalah keamanan, kesejahteraan, atau perilaku yang mengkhawatirkan.
          Semua laporan akan ditangani dengan serius dan dijaga kerahasiaannya.
        </Typography>
      </View>

      <Card variant="default" padding="none" style={{ marginBottom: 20 }}>
        <ListItem
          title="Perilaku Bullying"
          subtitle="Laporkan intimidasi atau pelecehan"
          leftComponent={
            <Icon
              name="warning"
              size="md"
              background={true}
              backgroundColor="#e74c3c"
              color="#ffffff"
            />
          }
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur laporan bullying akan segera hadir!')}
          testID="report-bullying"
        />
        <ListItem
          title="Masalah Kesehatan"
          subtitle="Laporkan masalah kesehatan atau cedera"
          leftComponent={
            <Icon
              name="medkit"
              size="md"
              background={true}
              backgroundColor="#f39c12"
              color="#ffffff"
            />
          }
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur laporan kesehatan akan segera hadir!')}
          showDivider={true}
          testID="report-health"
        />
        <ListItem
          title="Fasilitas & Infrastruktur"
          subtitle="Laporkan kerusakan atau masalah fasilitas"
          leftComponent={
            <Icon
              name="build"
              size="md"
              background={true}
              backgroundColor="#3498db"
              color="#ffffff"
            />
          }
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur laporan fasilitas akan segera hadir!')}
          showDivider={true}
          testID="report-facility"
        />
        <ListItem
          title="Masalah Lainnya"
          subtitle="Laporkan masalah lain yang perlu perhatian"
          leftComponent={
            <Icon
              name="chatbubbles"
              size="md"
              background={true}
              backgroundColor="#9b59b6"
              color="#ffffff"
            />
          }
          rightIcon="chevron-forward"
          onPress={() => alert('Fitur laporan lainnya akan segera hadir!')}
          showDivider={true}
          testID="report-other"
        />
      </Card>

      <Card variant="default" padding="medium" style={{ backgroundColor: '#ffebee' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="call" size="md" color="#e74c3c" />
          <Typography variant="body2" color="#e74c3c" style={{ marginLeft: 10, flex: 1 }}>
            Untuk keadaan darurat, hubungi Pembimbing Asrama di ext. 123
          </Typography>
        </View>
      </Card>
    </View>
  );
}

