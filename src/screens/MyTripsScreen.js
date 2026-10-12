import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography } from '../theme/colors';
import { TabHeader, SegmentedControl, TripCard, PressableScale } from '../components/ui';
import { routeToPlan } from '../data/places';
import { Ionicons } from '@expo/vector-icons';

const SAVED_ROUTES = [
  { id: 's1', route: 'Bole → Piassa', distance: '7.2 km', time: '18 mins', mode: 'Taxi' },
  { id: 's2', route: 'Kebena → Meskel Square', distance: '5.4 km', time: '25 mins', mode: 'Bus' },
  { id: 's3', route: 'Bole Airport → Africa Avenue', distance: '12.8 km', time: '45 mins', mode: 'Taxi' },
  { id: 's4', route: 'AAU → Sar Bet', distance: '3.6 km', time: '15 mins', mode: 'Taxi' },
];

const RECENT_TRIPS = [
  { id: 'r1', route: 'Bole → Piassa', distance: '7.2 km', time: '18 mins', mode: 'Taxi' },
  { id: 'r2', route: 'Kebena → Meskel Square', distance: '5.4 km', time: '25 mins', mode: 'Bus' },
  { id: 'r3', route: 'Bole Airport → Africa Avenue', distance: '12.8 km', time: '45 mins', mode: 'Taxi' },
  { id: 'r4', route: 'AAU → Sar Bet', distance: '3.6 km', time: '15 mins', mode: 'Taxi' },
  { id: 'r5', route: 'Megenagna → Kirkos', distance: '4.9 km', time: '20 mins', mode: 'Bus' },
];

export default function MyTripsScreen({ navigation }) {
  const [tab, setTab] = useState('saved');
  const list = tab === 'saved' ? SAVED_ROUTES : RECENT_TRIPS;
  const label = tab === 'saved' ? `${SAVED_ROUTES.length} saved routes` : `${RECENT_TRIPS.length} recent trips`;

  return (
    <View style={styles.root}>
      <TabHeader
        title="My Trips"
        subtitle="Your saved routes and past rides"
        icon="briefcase"
        right={
          <PressableScale onPress={() => navigation.navigate('Notification')} style={styles.bell}>
            <Ionicons name="notifications-outline" size={21} color={colors.white} />
          </PressableScale>
        }
        bottomPad={46}
      />
      <View style={styles.segmentWrap}>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[{ key: 'saved', label: 'Saved routes', icon: 'bookmark' }, { key: 'recent', label: 'Recent trips', icon: 'time' }]}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.listLabel}>{label}</Text>
        <View style={{ gap: 12 }}>
          {list.map((item) => (
            <TripCard
              key={item.id}
              route={item.route}
              distance={item.distance}
              time={item.time}
              extra={item.mode}
              mode={item.mode}
              onPress={() => navigation.navigate('TripResult', { mode: item.mode, ...routeToPlan(item.route) })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  segmentWrap: { marginTop: -26, marginHorizontal: 20, marginBottom: 14, zIndex: 2 },
  listLabel: { ...typography.b4, color: colors.grey600 },
});
