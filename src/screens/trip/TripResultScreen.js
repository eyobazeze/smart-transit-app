import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import { colors, typography } from '../../theme/colors';
import { getTrip } from '../../data/tripData';

const MODES = [
  { key: 'Taxi', icon: 'car' },
  { key: 'Bus', icon: 'bus' },
  { key: 'Train', icon: 'train' },
];

export default function TripResultScreen({ route, navigation }) {
  const [mode, setMode] = useState(route.params?.mode || 'Bus');
  const trip = getTrip(mode);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Route Planner</Text>
        <Ionicons name="notifications-outline" size={20} color={colors.black} />
      </View>

      <RouteMap height={520} />

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{mode}</Text>
          <Ionicons name="close-circle-outline" size={22} color={colors.grey600} />
        </View>

        <View style={styles.modeTabs}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.modeTab, mode === m.key && styles.modeTabActive]}
              onPress={() => setMode(m.key)}
            >
              <Ionicons name={m.icon} size={16} color={mode === m.key ? colors.primary800 : colors.black} />
              <Text style={[styles.modeTabText, mode === m.key && styles.modeTabTextActive]}>{m.key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.detailsRow}
          onPress={() => navigation.navigate('TripDetail', { mode })}
        >
          <View>
            <Text style={styles.stationName}>{trip.station}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statText}>{trip.distance}</Text>
              <View style={styles.dot} />
              <Text style={styles.statText}>{trip.duration}</Text>
              <View style={styles.dot} />
              <Text style={styles.statText}>{trip.cost}</Text>
            </View>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="bookmark-outline" size={20} color={colors.grey600} />
            <Ionicons name="share-outline" size={20} color={colors.grey600} />
          </View>
        </TouchableOpacity>
      </View>
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
  topBarTitle: { ...typography.s1, color: colors.black },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    padding: 25,
    gap: 10,
  },
  grabber: { width: 35, height: 4, backgroundColor: colors.grey300, borderRadius: 4, alignSelf: 'center', marginBottom: 5 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { ...typography.s1, color: colors.black },
  modeTabs: {
    flexDirection: 'row',
    gap: 25,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey300,
    paddingBottom: 10,
  },
  modeTab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 4 },
  modeTabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary800 },
  modeTabText: { ...typography.b3, color: colors.black },
  modeTabTextActive: { color: colors.primary800 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  stationName: { ...typography.b2, color: colors.black },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5 },
  statText: { ...typography.b3, color: colors.grey600 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.grey400 },
  iconRow: { flexDirection: 'row', gap: 15 },
});
