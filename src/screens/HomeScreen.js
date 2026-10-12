import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, gradients, radius, shadow } from '../theme/colors';
import LocationPlanner, { validatePlan } from '../components/LocationPlanner';
import { CURRENT_LOCATION, getPlace, routeToPlan } from '../data/places';
import { initLocation } from '../data/location';
import { useTripStore, planFromItem, timeAgo } from '../data/tripStore';
import { PressableScale, Button, Card, Chip, TripCard } from '../components/ui';

const RECENT_TRIPS = [
  { id: '1', route: 'Bole → Piassa', distance: '7.2 km', time: '18 mins', cost: '35 ETB', icon: 'car', mode: 'Taxi' },
  { id: '2', route: 'Kebena → Meskel Square', distance: '5.4 km', time: '25 mins', cost: '10 ETB', icon: 'bus', mode: 'Bus' },
  { id: '3', route: 'Bole Airport → Africa Avenue', distance: '12.8 km', time: '45 mins', cost: '20 ETB', icon: 'car', mode: 'Taxi' },
];

const MODES = [
  { key: 'Bus', icon: 'bus' },
  { key: 'Taxi', icon: 'car' },
  { key: 'Train', icon: 'train' },
];

const QUICK = [
  { id: 'bole-airport', label: 'Airport', icon: 'airplane' },
  { id: 'meskel-square', label: 'Meskel Square', icon: 'flag' },
  { id: 'piassa', label: 'Piassa', icon: 'location' },
  { id: 'megenagna', label: 'Megenagna', icon: 'location' },
  { id: 'merkato', label: 'Merkato', icon: 'storefront' },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const [plan, setPlan] = useState({ origin: CURRENT_LOCATION, destination: null });
  const [mode, setMode] = useState('Bus');
  const [error, setError] = useState(null);
  const planner = useRef(null);
  const { history } = useTripStore();
  React.useEffect(() => { initLocation(); }, []);

  const go = () => {
    const resolved = planner.current ? planner.current.resolve() : plan;
    const err = validatePlan(resolved);
    setError(err);
    if (!err) navigation.navigate('TripResult', { mode, origin: resolved.origin, destination: resolved.destination });
  };

  return (
    <View style={styles.root}>
      {focused ? <StatusBar style="light" /> : null}
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 14 }]}>
          <View style={styles.heroTop}>
            <PressableScale onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
              <Ionicons name="person" size={22} color={colors.primary800} />
            </PressableScale>
            <View style={{ flex: 1 }}>
              <Text style={styles.hi}>{greeting()}</Text>
              <View style={styles.locRow}>
                <Ionicons name="location-sharp" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.loc}>Addis Ababa, Ethiopia</Text>
              </View>
            </View>
            <PressableScale onPress={() => navigation.navigate('Notification')} style={styles.bell}>
              <Ionicons name="notifications-outline" size={21} color={colors.white} />
              <View style={styles.badge} />
            </PressableScale>
          </View>
          <Text style={styles.headline}>Where to today?</Text>
          <Text style={styles.sub}>Plan the trip, track the ride, arrive on time.</Text>
        </LinearGradient>

        <View style={styles.body}>
          <Card style={styles.planCard}>
            <LocationPlanner ref={planner} value={plan} onChange={(v) => { setPlan(v); setError(null); }} />
            {error ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color={colors.red500} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>TRAVEL BY</Text>
            <View style={styles.segment}>
              {MODES.map((m) => {
                const on = mode === m.key;
                return (
                  <PressableScale key={m.key} onPress={() => setMode(m.key)} style={[styles.segItem, on && styles.segItemOn]} scaleTo={0.96}>
                    <Ionicons name={m.icon} size={17} color={on ? colors.white : colors.grey600} />
                    <Text style={[styles.segText, on && { color: colors.white }]}>{m.key}</Text>
                  </PressableScale>
                );
              })}
            </View>

            <Button title="Plan My Trip" icon="navigate" onPress={go} style={{ marginTop: 6 }} />
          </Card>

          <View>
            <Text style={styles.sectionTitle}>Popular destinations</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} keyboardShouldPersistTaps="handled">
              {QUICK.map((q) => (
                <Chip
                  key={q.id}
                  label={q.label}
                  icon={q.icon}
                  active={plan.destination?.id === q.id}
                  onPress={() => { setPlan((p) => ({ ...p, destination: getPlace(q.id) })); setError(null); }}
                />
              ))}
            </ScrollView>
          </View>

          <View>
            <Text style={styles.sectionTitle}>{history.length ? 'Recent trips' : 'Suggested routes'}</Text>
            <View style={{ gap: 12 }}>
              {history.slice(0, 3).map((t) => (
                <TripCard
                  key={t.id}
                  route={t.route}
                  distance={`${t.km} km`}
                  time={`${t.minutes} mins`}
                  extra={timeAgo(t.ts)}
                  mode={t.mode}
                  onPress={() => navigation.navigate('TripResult', planFromItem(t))}
                />
              ))}
              {!history.length && RECENT_TRIPS.map((trip) => (
                <TripCard
                  key={trip.id}
                  route={trip.route}
                  distance={trip.distance}
                  time={trip.time}
                  extra={trip.cost}
                  mode={trip.mode}
                  onPress={() => navigation.navigate('TripResult', { mode: trip.mode, ...routeToPlan(trip.route) })}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingHorizontal: 22, paddingBottom: 70, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  hi: { ...typography.s2, color: colors.white },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  loc: { ...typography.b3, color: 'rgba(255,255,255,0.85)' },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 11, right: 12, width: 9, height: 9, borderRadius: 5, backgroundColor: '#ffd23f', borderWidth: 1.5, borderColor: '#1a63e6' },
  headline: { ...typography.display, color: colors.white },
  sub: { ...typography.b3, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  body: { paddingHorizontal: 20, marginTop: -48, gap: 24 },
  planCard: { gap: 12, padding: 14, ...shadow.float },
  label: { ...typography.label, color: colors.grey400, marginTop: 4, marginLeft: 4 },
  segment: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.pill, padding: 4 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 11, borderRadius: radius.pill },
  segItemOn: { backgroundColor: colors.primary800 },
  segText: { ...typography.b4, color: colors.grey600 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.redSoft, borderRadius: radius.md, padding: 10 },
  errorText: { ...typography.b3, color: colors.red500, flex: 1 },
  sectionTitle: { ...typography.h5, color: colors.ink, marginBottom: 12 },
  chips: { gap: 10, paddingRight: 20 },
  recent: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderRadius: radius.lg, padding: 14 },
  recentIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primary100, alignItems: 'center', justifyContent: 'center' },
  recentRoute: { ...typography.b2, color: colors.ink },
  toRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 },
  recentTo: { ...typography.b3, color: colors.grey600, flex: 1 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  stat: { ...typography.c2, color: colors.primary800 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.grey300 },
});
