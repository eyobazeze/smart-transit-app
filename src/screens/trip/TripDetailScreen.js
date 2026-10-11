import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import RealMap from '../../components/RealMap';
import { getPlace } from '../../data/places';
import { colors, typography, radius, shadow } from '../../theme/colors';
import { getTrip } from '../../data/tripData';
import { PressableScale, Button, RoundButton, Chip } from '../../components/ui';

const MODES = [
  { key: 'Bus', icon: 'bus' },
  { key: 'Taxi', icon: 'car' },
  { key: 'Train', icon: 'train' },
];

const MAP_H = 250;

export default function TripDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState(route.params?.mode || 'Bus');
  const [activeOption, setActiveOption] = useState(null);
  const origin = route.params?.origin || getPlace('bole');
  const destination = route.params?.destination || getPlace('piassa');
  const trip = getTrip(mode, route.params?.origin, route.params?.destination);
  const option = activeOption && trip.tripOptions.includes(activeOption) ? activeOption : trip.tripOptions[0];
  const mapPad = React.useMemo(() => ({ top: insets.top + 70, bottom: 50 }), [insets.top]);

  return (
    <View style={styles.root}>
      <View style={{ height: MAP_H + insets.top }}>
        <RealMap
          origin={origin}
          destination={destination}
          padding={mapPad}
          interactive={false}
          fallback={<RouteMap />}
        />
        <View style={[styles.floatBar, { top: insets.top + 10 }]} pointerEvents="box-none">
          <RoundButton icon="arrow-back" onPress={() => navigation.goBack()} />
          <Text style={styles.barTitle}>Trip details</Text>
          <View style={{ width: 46 }} />
        </View>
      </View>

      <ScrollView
        style={[styles.sheet, shadow.float]}
        contentContainerStyle={[styles.sheetContent, { paddingBottom: Math.max(insets.bottom, 16) + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.segment}>
          {MODES.map((m) => {
            const on = mode === m.key;
            return (
              <PressableScale key={m.key} onPress={() => setMode(m.key)} style={[styles.segItem, on && styles.segItemOn]} scaleTo={0.96}>
                <Ionicons name={m.icon} size={16} color={on ? colors.white : colors.grey600} />
                <Text style={[styles.segText, on && { color: colors.white }]}>{m.key}</Text>
              </PressableScale>
            );
          })}
        </View>

        <View style={styles.headCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.station} numberOfLines={2}>{trip.station}</Text>
            <Text style={styles.route} numberOfLines={1}>{trip.origin} → {trip.destination}</Text>
          </View>
          <View style={styles.fareBadge}>
            <Text style={styles.fare}>{trip.cost}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}><Ionicons name="time-outline" size={18} color={colors.primary800} /><Text style={styles.statValue}>{trip.duration}</Text><Text style={styles.statLabel}>Duration</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Ionicons name="resize-outline" size={18} color={colors.primary800} /><Text style={styles.statValue}>{trip.distance}</Text><Text style={styles.statLabel}>Distance</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Ionicons name="flag-outline" size={18} color={colors.primary800} /><Text style={styles.statValue}>{trip.arriveTime}</Text><Text style={styles.statLabel}>Arrive</Text></View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {trip.tripOptions.map((o) => (
            <Chip key={o} label={o} active={option === o} onPress={() => setActiveOption(o)} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Your journey</Text>
        <View>
          {trip.steps.map((step, i) => {
            const last = i === trip.steps.length - 1;
            return (
              <View key={step.title} style={styles.stepRow}>
                <View style={styles.dotCol}>
                  <View style={[styles.dot, i === 0 && styles.dotFirst, last && styles.dotLast]}>
                    {last ? <Ionicons name="flag" size={11} color={colors.white} /> : i === 0 ? <View style={styles.dotInner} /> : null}
                  </View>
                  {!last ? <View style={styles.line} /> : null}
                </View>
                <View style={styles.stepBody}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title="Start trip"
          icon="play"
          onPress={() => navigation.navigate('TripLive', { mode, origin: route.params?.origin, destination: route.params?.destination })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  floatBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  barTitle: { ...typography.s2, color: colors.ink, backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, overflow: 'hidden' },
  sheet: { flex: 1, marginTop: -26, backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  sheetContent: { padding: 20, gap: 16 },
  segment: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.pill, padding: 4 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 11, borderRadius: radius.pill },
  segItemOn: { backgroundColor: colors.primary800 },
  segText: { ...typography.b4, color: colors.grey600 },
  headCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  station: { ...typography.h5, color: colors.ink },
  route: { ...typography.b3, color: colors.grey600, marginTop: 3 },
  fareBadge: { backgroundColor: colors.primary100, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  fare: { ...typography.s2, color: colors.primary800 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.lg, paddingVertical: 14 },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { ...typography.b2, color: colors.ink },
  statLabel: { ...typography.c2, color: colors.grey600 },
  statDivider: { width: 1, backgroundColor: colors.grey200, marginVertical: 4 },
  chips: { gap: 10, paddingRight: 20 },
  sectionTitle: { ...typography.h5, color: colors.ink, marginTop: 4 },
  stepRow: { flexDirection: 'row', gap: 14 },
  dotCol: { alignItems: 'center', width: 22 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.primary100, marginTop: 3, alignItems: 'center', justifyContent: 'center' },
  dotFirst: { borderColor: colors.primary800 },
  dotInner: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary800 },
  dotLast: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.red500, borderColor: colors.redSoft, marginTop: 0 },
  line: { width: 2, flex: 1, minHeight: 28, backgroundColor: colors.primary100, marginVertical: 2 },
  stepBody: { flex: 1, paddingBottom: 18 },
  stepTitle: { ...typography.b2, color: colors.ink },
  stepTime: { ...typography.c2, color: colors.primary800, marginTop: 3 },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.grey200,
  },
});
