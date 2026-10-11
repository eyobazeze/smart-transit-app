import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import RealMap from '../../components/RealMap';
import { getPlace } from '../../data/places';
import { colors, typography, radius, shadow } from '../../theme/colors';
import { getTrip } from '../../data/tripData';
import { PressableScale, Button, RoundButton } from '../../components/ui';

const MODES = [
  { key: 'Bus', icon: 'bus' },
  { key: 'Taxi', icon: 'car' },
  { key: 'Train', icon: 'train' },
];

const num = (s) => parseInt(String(s).replace(/[^0-9]/g, ''), 10) || 0;

export default function TripResultScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState(route.params?.mode || 'Bus');
  const [sheetH, setSheetH] = useState(360);
  const origin = route.params?.origin || getPlace('bole');
  const destination = route.params?.destination || getPlace('piassa');

  const trips = useMemo(() => {
    const t = {};
    MODES.forEach((m) => { t[m.key] = getTrip(m.key, origin, destination); });
    return t;
  }, [origin, destination]);

  // Tag the fastest and the cheapest option.
  const tags = useMemo(() => {
    const keys = MODES.map((m) => m.key);
    const fastest = keys.reduce((a, b) => (num(trips[b].duration) < num(trips[a].duration) ? b : a));
    const cheapest = keys.reduce((a, b) => (num(trips[b].cost) < num(trips[a].cost) ? b : a));
    const out = {};
    keys.forEach((k) => { out[k] = k === fastest && k === cheapest ? 'Best pick' : k === fastest ? 'Fastest' : k === cheapest ? 'Cheapest' : null; });
    return out;
  }, [trips]);

  const trip = trips[mode];
  const params = { mode, origin: route.params?.origin, destination: route.params?.destination };
  const mapPad = useMemo(() => ({ top: insets.top + 90, bottom: sheetH + 24 }), [insets.top, sheetH]);
  const startName = origin.id === 'current' ? 'Your location' : origin.name;

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <RealMap origin={origin} destination={destination} padding={mapPad} fallback={<RouteMap />} />
      </View>

      <View style={[styles.floatBar, { top: insets.top + 10 }]} pointerEvents="box-none">
        <RoundButton icon="arrow-back" onPress={() => navigation.goBack()} />
        <View style={[styles.routePill, shadow.card]}>
          <Ionicons name="navigate-circle" size={18} color={colors.primary800} />
          <Text style={styles.routeText} numberOfLines={1}>{startName} → {destination.name}</Text>
        </View>
      </View>

      <View style={[styles.sheet, shadow.float, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]} onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}>
        <View style={styles.grabber} />
        <Text style={styles.title}>Choose how to go</Text>

        <View style={styles.cards}>
          {MODES.map((m) => {
            const t = trips[m.key];
            const on = mode === m.key;
            return (
              <PressableScale key={m.key} onPress={() => setMode(m.key)} style={[styles.optCard, on && styles.optCardOn]} scaleTo={0.96}>
                {tags[m.key] ? (
                  <View style={[styles.tag, tags[m.key] === 'Cheapest' ? styles.tagWarm : styles.tagGreen]}>
                    <Text style={[styles.tagText, { color: tags[m.key] === 'Cheapest' ? '#b26a00' : colors.success }]}>{tags[m.key]}</Text>
                  </View>
                ) : <View style={styles.tagSpacer} />}
                <View style={[styles.optIcon, on && { backgroundColor: colors.primary800 }]}>
                  <Ionicons name={m.icon} size={20} color={on ? colors.white : colors.primary800} />
                </View>
                <Text style={styles.optMode}>{m.key}</Text>
                <Text style={styles.optMinutes}>{num(t.duration)}<Text style={styles.optUnit}> min</Text></Text>
                <Text style={styles.optFare}>{t.cost}</Text>
              </PressableScale>
            );
          })}
        </View>

        <View style={styles.summary}>
          <View style={{ flex: 1 }}>
            <Text style={styles.station} numberOfLines={1}>{trip.station}</Text>
            <Text style={styles.meta}>{trip.distance} · Leave {trip.leaveTime} · Arrive {trip.arriveTime}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Details" variant="secondary" onPress={() => navigation.navigate('TripDetail', params)} style={{ flex: 1 }} />
          <Button title="Start trip" icon="play" onPress={() => navigation.navigate('TripLive', params)} style={{ flex: 1.4 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  floatBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  routePill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 16,
    backgroundColor: colors.white, borderRadius: 23,
  },
  routeText: { ...typography.b2, color: colors.ink, flex: 1 },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: 20, paddingTop: 10, gap: 14,
  },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.grey300, alignSelf: 'center' },
  title: { ...typography.h5, color: colors.ink },
  cards: { flexDirection: 'row', gap: 10 },
  optCard: {
    flex: 1, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.grey200, backgroundColor: colors.white,
    paddingHorizontal: 10, paddingBottom: 12, paddingTop: 8, alignItems: 'center', gap: 2,
  },
  optCardOn: { borderColor: colors.primary800, backgroundColor: colors.primary50 },
  tag: { borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 4 },
  tagGreen: { backgroundColor: colors.successSoft },
  tagWarm: { backgroundColor: colors.warnSoft },
  tagText: { ...typography.label, fontSize: 10, lineHeight: 14 },
  tagSpacer: { height: 22 },
  optIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary100, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  optMode: { ...typography.b4, color: colors.grey600 },
  optMinutes: { ...typography.h5, color: colors.ink },
  optUnit: { ...typography.c2, color: colors.grey600 },
  optFare: { ...typography.b4, color: colors.primary800 },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: radius.md, padding: 14 },
  station: { ...typography.b2, color: colors.ink },
  meta: { ...typography.c2, color: colors.grey600, marginTop: 3 },
  actions: { flexDirection: 'row', gap: 12 },
});
