import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../components/RouteMap';
import RealMap from '../components/RealMap';
import { colors, typography, radius, shadow } from '../theme/colors';
import LocationPlanner, { validatePlan } from '../components/LocationPlanner';
import { CURRENT_LOCATION } from '../data/places';
import { Button, RoundButton, SegmentedControl } from '../components/ui';

const MODES = [
  { key: 'Bus', label: 'Bus', icon: 'bus' },
  { key: 'Taxi', label: 'Taxi', icon: 'car' },
  { key: 'Train', label: 'Train', icon: 'train' },
];

export default function LiveMapScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [transportType, setTransportType] = useState('Bus');
  const [plan, setPlan] = useState({ origin: CURRENT_LOCATION, destination: null });
  const [error, setError] = useState(null);
  const [sheetH, setSheetH] = useState(330);
  const planner = useRef(null);
  const mapPad = useMemo(() => ({ top: insets.top + 80, bottom: sheetH + 30 }), [insets.top, sheetH]);

  const find = () => {
    const resolved = planner.current ? planner.current.resolve() : plan;
    const err = validatePlan(resolved);
    setError(err);
    if (!err) navigation.navigate('LiveMapResult', { mode: transportType, origin: resolved.origin, destination: resolved.destination });
  };

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <RealMap origin={plan.origin} destination={plan.destination} padding={mapPad} vehicle={transportType} fallback={<RouteMap />} />
      </View>

      <View style={[styles.floatBar, { top: insets.top + 10 }]} pointerEvents="box-none">
        <View style={[styles.titlePill, shadow.card]}>
          <Ionicons name="navigate-circle" size={20} color={colors.primary800} />
          <Text style={styles.title}>Live Map</Text>
        </View>
        <RoundButton icon="notifications-outline" onPress={() => navigation.navigate('Notification')} />
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.kav} pointerEvents="box-none">
        <View style={[styles.sheet, shadow.float]} onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}>
          <View style={styles.grabber} />
          <Text style={styles.sheetTitle}>Track a vehicle</Text>
          <LocationPlanner ref={planner} value={plan} onChange={(v) => { setPlan(v); setError(null); }} />
          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={16} color={colors.red500} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <SegmentedControl options={MODES} value={transportType} onChange={setTransportType} />
          <Button title="Find transport to track" icon="search" onPress={find} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  floatBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titlePill: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 16, backgroundColor: colors.white, borderRadius: 23 },
  title: { ...typography.s2, color: colors.ink },
  kav: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18, gap: 12 },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.grey300, alignSelf: 'center' },
  sheetTitle: { ...typography.h5, color: colors.ink },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.redSoft, borderRadius: radius.md, padding: 10 },
  errorText: { ...typography.b3, color: colors.red500, flex: 1 },
});
