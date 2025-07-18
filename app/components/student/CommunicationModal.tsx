import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../src/components/molecules/Card';
import { ListItem } from '../../../src/components/molecules/ListItem';
import { Typography } from '../../../src/components/atoms/Typography';
import { Avatar } from '../../../src/components/atoms/Avatar';

export default function CommunicationModal() {
  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 15 }}>
          Guru
        </Typography>
        <Card variant="default" padding="none">
          <ListItem
            title="Ustadz Ahmad"
            subtitle="Guru Tahfidz"
            leftComponent={
              <Avatar
                size="md"
                backgroundColor="#005e7a"
                iconName="person"
                iconColor="#ffffff"
              />
            }
            rightIcon="chatbubble-outline"
            onPress={() => alert('Fitur chat dengan guru akan segera hadir!')}
            testID="contact-ustadz-ahmad"
          />
          <ListItem
            title="Ustadzah Fatimah"
            subtitle="Guru Bahasa Arab"
            leftComponent={
              <Avatar
                size="md"
                backgroundColor="#005e7a"
                iconName="person"
                iconColor="#ffffff"
              />
            }
            rightIcon="chatbubble-outline"
            onPress={() => alert('Fitur chat dengan guru akan segera hadir!')}
            showDivider={true}
            testID="contact-ustadzah-fatimah"
          />
        </Card>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 15 }}>
          Orang Tua
        </Typography>
        <Card variant="default" padding="none">
          <ListItem
            title="Orang Tua"
            subtitle="Ayah & Ibu"
            leftComponent={
              <Avatar
                size="md"
                backgroundColor="#f0c75e"
                iconName="people"
                iconColor="#ffffff"
              />
            }
            rightIcon="chatbubble-outline"
            onPress={() => alert('Fitur chat dengan orang tua akan segera hadir!')}
            testID="contact-parents"
          />
        </Card>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Typography variant="h4" color="primary" weight="bold" style={{ marginBottom: 15 }}>
          Pesan Terbaru
        </Typography>
        <Card variant="default" padding="medium" style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Typography variant="body1" color="primary" weight="bold">
              Ustadz Ahmad
            </Typography>
            <Typography variant="body2" color="tertiary">
              10:30
            </Typography>
          </View>
          <Typography variant="body2" color="secondary">
            Jangan lupa persiapkan hafalan untuk besok ya
          </Typography>
        </Card>
        <Card variant="default" padding="medium">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Typography variant="body1" color="primary" weight="bold">
              Ibu
            </Typography>
            <Typography variant="body2" color="tertiary">
              Kemarin
            </Typography>
          </View>
          <Typography variant="body2" color="secondary">
            Bagaimana kabarmu hari ini, nak?
          </Typography>
        </Card>
      </View>
    </View>
  );
}

