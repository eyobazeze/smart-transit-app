import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LiveRouteMap from '../components/LiveRouteMap';
import RealMap from '../components/RealMap';
import { getPlace } from '../data/places';
import { colors, typography, radius, shadow } from '../theme/colors';
import { RoundButton } from '../components/ui';

const BUSES = [
  { id: 'bus-1', progress: 0.85, currentLocation: 'Meskel Sqr.', status: 'Arrived' },
  { id: 'bus-2', progress: 0.5, currentLocation: 'Kazanchis', status: 'Arrive in 7 min' },
  { id: 'bus-3', progress: 0.15, currentLocation: 'Bole', status: 'Arrive in 15 min' },
];

const NOUN = { Bus: 'buses', Taxi: 'taxis', Train: 'trains' };

export default function LiveMapResultScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const mode = route?.params?.mode || 'Bus';
  const origin = route?.params?.origin || getPlace('meskel-square');
  const destination = route?.params?.destination || getPlace('shola');
  const mapPad = useMemo(() => ({ top: insets.top + 90, bottom: 190 }), [insets.top]);
  const goTrack = () => navigation.navigate('TripLive', { mode, origin: route?.params?.origin, destination: route?.params?.destination });
  const title = `${origin.id === 'current' ? 'Your location' : origin.name} → ${destination.name}`;

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <RealMap
          origin={origin}
          destination={destination}
          buses={BUSES}
          padding={mapPad}
          vehicle={mode}
          onTrack={goTrack}
          fallback={<LiveRouteMap buses={BUSES} onTrack={goTrack} />}
        />
      </View>

      <View style={[styles.floatBar, { top: insets.top + 10 }]} pointerEvents="box-none">
        <RoundButton icon="arrow-back" onPress={() => navigation.goBack()} />
        <View style={[styles.pill, shadow.card]}>
          <Ionicons name="radio" size={18} color={colors.success} />
          <Text style={styles.pillText}>Live now</Text>
        </View>
      </View>

      <View style={[styles.sheet, shadow.float, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.grabber} />
        <Text style={styles.routeTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statValue}>{BUSES.length}</Text><Text style={styles.statLabel}>{NOUN[mode] || 'buses'}</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statValue}>10–15</Text><Text style={styles.statLabel}>ETB fare</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statValue}>7 min</Text><Text style={styles.statLabel}>Next arrival</Text></View>
        </View>
        <View style={styles.hint}>
          <Ionicons name="hand-left-outline" size={16} color={colors.primary800} />
          <Text style={styles.hintText}>Tap a vehicle on the map to track it</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  floatBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 16, backgroundColor: colors.white, borderRadius: 23 },
  pillText: { ...typography.s2, color: colors.ink },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: 20, paddingTop: 10, gap: 12 },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.grey300, alignSelf: 'center' },
  routeTitle: { ...typography.h5, color: colors.ink },
  statsRow: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.lg, paddingVertical: 14 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { ...typography.s2, color: colors.primary800 },
  statLabel: { ...typography.c2, color: colors.grey600 },
  statDivider: { width: 1, backgroundColor: colors.grey200, marginVertical: 2 },
  hint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  hintText: { ...typography.b3, color: colors.grey600 },
});
