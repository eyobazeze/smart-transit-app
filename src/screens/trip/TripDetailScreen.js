import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import { colors, typography } from '../../theme/colors';
import { getTrip } from '../../data/tripData';

const MODES = [
  { key: 'Taxi', icon: 'car' },
  { key: 'Bus', icon: 'bus' },
  { key: 'Train', icon: 'train' },
];

export default function TripDetailScreen({ route, navigation }) {
  const [mode, setMode] = useState(route.params?.mode || 'Bus');
  const [activeOption, setActiveOption] = useState('Leave 12:00 PM');
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

      <RouteMap height={220} />

      <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent}>
        <View style={styles.grabber} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{mode}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close-circle-outline" size={22} color={colors.grey600} />
          </TouchableOpacity>
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

        <View style={styles.detailsRow}>
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
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
          {trip.tripOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.optionChip, activeOption === option && styles.optionChipActive]}
              onPress={() => setActiveOption(option)}
            >
              <Text style={[styles.optionText, activeOption === option && styles.optionTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.timeline}>
          {trip.steps.map((step, i) => (
            <View key={step.title} style={styles.timelineRow}>
              <View style={styles.timelineDotCol}>
                <View style={[styles.timelineDot, i === 0 && styles.timelineDotActive]} />
                {i !== trip.steps.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={styles.timelineTitle}>{step.title}</Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('TripStart', { mode })}
        >
          <Text style={styles.startButtonText}>Start Trip</Text>
        </TouchableOpacity>
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
  topBarTitle: { ...typography.s1, color: colors.black },
  sheet: { flex: 1, marginTop: -25, backgroundColor: colors.white, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  sheetContent: { padding: 25, gap: 15, paddingBottom: 40 },
  grabber: { width: 35, height: 4, backgroundColor: colors.grey300, borderRadius: 4, alignSelf: 'center' },
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
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stationName: { ...typography.b2, color: colors.black },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5 },
  statText: { ...typography.b3, color: colors.grey600 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.grey400 },
  iconRow: { flexDirection: 'row', gap: 15 },
  optionsRow: { gap: 10 },
  optionChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  optionChipActive: { backgroundColor: colors.primary50, borderColor: colors.primary50 },
  optionText: { ...typography.b3, color: colors.black },
  optionTextActive: { color: colors.primary800 },
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', gap: 15 },
  timelineDotCol: { alignItems: 'center', width: 12 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.grey300, marginTop: 5 },
  timelineDotActive: { backgroundColor: colors.primary800 },
  timelineLine: { width: 1, flex: 1, backgroundColor: colors.grey300, minHeight: 30 },
  timelineTextCol: { flex: 1, paddingBottom: 20 },
  timelineTitle: { ...typography.b4, color: colors.black },
  timelineTime: { ...typography.c2, color: colors.primary800, marginTop: 3 },
  startButton: {
    backgroundColor: colors.primary800,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startButtonText: { ...typography.b4, color: colors.white },
});
