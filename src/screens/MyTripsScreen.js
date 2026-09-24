import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

const SAVED_ROUTES = [
  { id: 's1', route: 'Bole → Piassa', distance: '7.2 km', time: '18 mins', mode: 'Taxi', icon: 'car' },
  { id: 's2', route: 'Kebena → Meskel Square', distance: '5.4 km', time: '25 mins', mode: 'Bus', icon: 'bus' },
  { id: 's3', route: 'Bole Airport → Africa Avenue', distance: '12.8 km', time: '45 mins', mode: 'Taxi', icon: 'car' },
  { id: 's4', route: 'AAU→ Sar Bet', distance: '3.6 km', time: '15 mins', mode: 'Taxi', icon: 'car' },
];

const RECENT_TRIPS = [
  { id: 'r1', route: 'Bole → Piassa', distance: '7.2 km', time: '18 mins', mode: 'Taxi', icon: 'car' },
  { id: 'r2', route: 'Kebena → Meskel Square', distance: '5.4 km', time: '25 mins', mode: 'Bus', icon: 'bus' },
  { id: 'r3', route: 'Bole Airport → Africa Avenue', distance: '12.8 km', time: '45 mins', mode: 'Taxi', icon: 'car' },
  { id: 'r4', route: 'AAU→ Sar Bet', distance: '3.6 km', time: '15 mins', mode: 'Taxi', icon: 'car' },
  { id: 'r5', route: 'Megenagna → Kirkos', distance: '4.9 km', time: '20 mins', mode: 'Bus', icon: 'bus' },
];

export default function MyTripsScreen({ navigation }) {
  const [tab, setTab] = useState('saved');
  const list = tab === 'saved' ? SAVED_ROUTES : RECENT_TRIPS;
  const label = tab === 'saved' ? `${SAVED_ROUTES.length} saved routes` : `${RECENT_TRIPS.length} recent trips`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.titleRow}>
          <Ionicons name="briefcase" size={20} color={colors.black} />
          <Text style={styles.title}>My Trips</Text>
        </View>
        <Ionicons name="notifications-outline" size={20} color={colors.black} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'saved' && styles.tabActive]}
            onPress={() => setTab('saved')}
          >
            <Text style={[styles.tabText, tab === 'saved' && styles.tabTextActive]}>Saved routes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'recent' && styles.tabActive]}
            onPress={() => setTab('recent')}
          >
            <Text style={[styles.tabText, tab === 'recent' && styles.tabTextActive]}>Recent Trips</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listLabel}>{label}</Text>
          <View style={styles.list}>
            {list.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.item, index !== list.length - 1 && styles.itemBorder]}
                onPress={() => navigation.navigate('TripResult', { mode: item.mode })}
              >
                <View style={styles.itemLeft}>
                  <Ionicons name={item.icon} size={20} color={colors.primary800} />
                  <View>
                    <Text style={styles.itemRoute}>{item.route}</Text>
                    <View style={styles.itemStatsRow}>
                      <Text style={styles.itemStat}>{item.distance}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.itemStat}>{item.time}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.itemStat}>{item.mode}</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.grey400} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: colors.white,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { ...typography.s1, color: colors.black },
  content: { paddingHorizontal: 25, paddingBottom: 40, gap: 25 },
  tabs: { flexDirection: 'row', backgroundColor: colors.primary800, borderRadius: 50, padding: 5 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 50 },
  tabActive: { backgroundColor: colors.white },
  tabText: { ...typography.b4, color: colors.white },
  tabTextActive: { color: colors.primary800 },
  listSection: { gap: 10 },
  listLabel: { ...typography.b3, color: colors.black },
  list: { borderRadius: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.grey200 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 20, flex: 1 },
  itemRoute: { ...typography.b2, color: colors.black },
  itemStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5 },
  itemStat: { ...typography.b3, color: colors.grey600 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.grey400 },
});
