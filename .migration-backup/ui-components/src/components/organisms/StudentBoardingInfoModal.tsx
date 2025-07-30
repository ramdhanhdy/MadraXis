import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../src/components/molecules/Card';
import { ListItem } from '../../../src/components/molecules/ListItem';
import { Typography } from '../../../src/components/atoms/Typography';

export default function BoardingInfoModal() {
  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 15 }}>
          Informasi Asrama
        </Typography>
        <Card variant="default" padding="none">
          <ListItem
            title="Gedung"
            subtitle="Al-Farabi"
            leftIcon="business"
            testID="info-gedung"
          />
          <ListItem
            title="Kamar"
            subtitle="203"
            leftIcon="bed"
            showDivider={true}
            testID="info-kamar"
          />
          <ListItem
            title="Pembimbing Asrama"
            subtitle="Ustadz Hasan"
            leftIcon="person"
            showDivider={true}
            testID="info-pembimbing"
          />
        </Card>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 15 }}>
          Jadwal Makan
        </Typography>
        <Card variant="default" padding="medium" style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Typography variant="body1" color="primary" weight="bold">
              Sarapan
            </Typography>
            <Typography variant="body1" color="secondary">
              06:00 - 07:00
            </Typography>
          </View>
          <Typography variant="body2" color="tertiary" style={{ fontStyle: 'italic' }}>
            Menu: Nasi, telur dadar, sayur sop
          </Typography>
        </Card>
        <Card variant="default" padding="medium" style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Typography variant="body1" color="primary" weight="bold">
              Makan Siang
            </Typography>
            <Typography variant="body1" color="secondary">
              12:30 - 13:30
            </Typography>
          </View>
          <Typography variant="body2" color="tertiary" style={{ fontStyle: 'italic' }}>
            Menu: Nasi, ayam goreng, sayur asem
          </Typography>
        </Card>
        <Card variant="default" padding="medium">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Typography variant="body1" color="primary" weight="bold">
              Makan Malam
            </Typography>
            <Typography variant="body1" color="secondary">
              18:30 - 19:30
            </Typography>
          </View>
          <Typography variant="body2" color="tertiary" style={{ fontStyle: 'italic' }}>
            Menu: Nasi, ikan bakar, sayur capcay
          </Typography>
        </Card>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 15 }}>
          Aktivitas Asrama
        </Typography>
        <Card variant="default" padding="none">
          <ListItem
            title="05:00 - 05:30"
            subtitle="Sholat Subuh Berjamaah"
            leftIcon="time"
            testID="activity-subuh"
          />
          <ListItem
            title="19:30 - 21:00"
            subtitle="Belajar Mandiri"
            leftIcon="book"
            showDivider={true}
            testID="activity-belajar"
          />
          <ListItem
            title="21:00 - 21:30"
            subtitle="Persiapan Tidur"
            leftIcon="moon"
            showDivider={true}
            testID="activity-tidur"
          />
        </Card>
      </View>
    </View>
  );
}

