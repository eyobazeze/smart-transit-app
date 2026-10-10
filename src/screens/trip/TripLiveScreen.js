import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import { colors, typography } from '../../theme/colors';
import { getTrip } from '../../data/tripData';
import { PLACES } from '../../data/places';

// Demo pace: each stage lasts this many real seconds (the screen still shows real trip minutes).
const DEMO_SECONDS = { walk: 7, wait: 7, ride: 26 };
const TICK_MS = 250;

function confirm(title, message, onYes) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-undef
    if (window.confirm(`${title}\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Keep going', style: 'cancel' },
    { text: 'Yes', style: 'destructive', onPress: onYes },
  ]);
}

function nearestLandmark(origin, destination, t) {
  if (!origin?.lat || !destination?.lat) return null;
  const lat = origin.lat + (destination.lat - origin.lat) * t;
  const lng = origin.lng + (destination.lng - origin.lng) * t;
  let best = null, bd = Infinity;
  PLACES.forEach((p) => {
    if (p.id === origin.id || p.id === destination.id) return;
    const d = Math.hypot((p.lat - lat) * 111, (p.lng - lng) * 110);
    if (d < bd) { bd = d; best = p; }
  });
  return bd < 1.6 ? best : null;
}

export default function TripLiveScreen({ route, navigation }) {
  const mode = route.params?.mode || 'Bus';
  const origin = route.params?.origin;
  const destination = route.params?.destination;
  const trip = useMemo(() => getTrip(mode, origin, destination), [mode, origin, destination]);
  const isTaxi = trip.mode === 'Taxi';
  const { walk, wait, ride } = trip.parts;
  const vehicle = trip.mode.toLowerCase();

  const [stage, setStage] = useState('walk'); // walk | wait | prompt | ride | arrived
  const [p, setP] = useState(0); // 0..1 progress inside the current stage
  const [tracking, setTracking] = useState(false);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  useEffect(() => {
    if (stage === 'prompt' || stage === 'arrived') return undefined;
    const id = setInterval(() => {
      setP((x) => {
        const next = x + TICK_MS / 1000 / DEMO_SECONDS[stageRef.current];
        if (next < 1) return next;
        // stage finished
        const order = { walk: 'wait', wait: 'prompt', ride: 'arrived' };
        setStage(order[stageRef.current]);
        return 0;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [stage]);

  const leftMin = Math.max(0, Math.ceil(
    stage === 'walk' ? walk * (1 - p) + wait + ride
    : stage === 'wait' ? wait * (1 - p) + ride
    : stage === 'prompt' ? ride
    : stage === 'ride' ? ride * (1 - p)
    : 0));
  const rideP = stage === 'ride' ? p : stage === 'arrived' ? 1 : 0;
  const kmTotal = parseFloat(trip.distance) || 0;
  const kmLeft = (kmTotal * (1 - rideP)).toFixed(1);

  const landmark = stage === 'ride' ? nearestLandmark(origin, destination, p) : null;
  const headline = {
    walk: isTaxi ? 'Finding your driver…' : 'Walk to the stop',
    wait: isTaxi ? 'Driver Dawit is on the way' : `Waiting for your ${vehicle}`,
    prompt: `Your ${vehicle} has arrived`,
    ride: tracking ? `Tracking your ${vehicle}` : landmark ? `Passing ${landmark.name}` : `On the way to ${trip.destination}`,
    arrived: tracking ? 'Vehicle has arrived' : 'You have arrived',
  }[stage];
  const sub = {
    walk: isTaxi ? 'Matching you with a nearby taxi' : `${Math.max(1, Math.ceil(walk * (1 - p)))} min · ${trip.station}`,
    wait: `Arrives in ${Math.max(1, Math.ceil(wait * (1 - p)))} min`,
    prompt: 'Are you boarding now?',
    ride: `${trip.station} → ${trip.endStation}`,
    arrived: trip.endStation,
  }[stage];

  const stepIndex = { walk: 0, wait: isTaxi ? 1 : 1, prompt: 2, ride: 2, arrived: 3 }[stage];
  const goHome = () => navigation.navigate('Main', { screen: 'Home' });
  const cancel = () => confirm('Cancel this trip?', 'Your progress will be lost.', goHome);
  const endEarly = () => confirm('End trip now?', 'You have not reached the destination yet.', () => { setStage('arrived'); setP(0); });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.mapWrap}>
        <RouteMap busProgress={rideP} />

        <View style={styles.headerBar}>
          <Ionicons name={stage === 'arrived' ? 'checkmark-circle' : 'navigate'} size={22} color={colors.white} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText} numberOfLines={1}>{headline}</Text>
            <Text style={styles.headerSub} numberOfLines={1}>{sub}</Text>
          </View>
        </View>

        {stage === 'prompt' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Are you boarding this {vehicle} now?</Text>
            <TouchableOpacity style={styles.optionPrimary} onPress={() => { setTracking(false); setStage('ride'); setP(0); }}>
              <Ionicons name="checkmark-circle" size={18} color={colors.white} />
              <Text style={styles.optionPrimaryText}>Yes, I'm onboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => { setTracking(true); setStage('ride'); setP(0); }}>
              <Ionicons name="eye-outline" size={18} color={colors.black} />
              <Text style={styles.optionText}>No, just tracking</Text>
            </TouchableOpacity>
          </View>
        ) : stage === 'arrived' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{tracking ? 'Tracking finished' : 'Trip complete'}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}><Text style={styles.summaryValue}>{trip.duration}</Text><Text style={styles.summaryLabel}>Time</Text></View>
              <View style={styles.summaryItem}><Text style={styles.summaryValue}>{trip.distance}</Text><Text style={styles.summaryLabel}>Distance</Text></View>
              <View style={styles.summaryItem}><Text style={styles.summaryValue}>{trip.cost}</Text><Text style={styles.summaryLabel}>Fare</Text></View>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            {trip.steps.map((st, i) => {
              const done = i < stepIndex, current = i === stepIndex;
              return (
                <View key={i} style={styles.stepRow}>
                  <Ionicons
                    name={done ? 'checkmark-circle' : current ? 'radio-button-on' : 'ellipse-outline'}
                    size={16}
                    color={done || current ? colors.primary800 : colors.grey400}
                  />
                  <Text style={[styles.stepText, current && styles.stepTextCurrent, done && styles.stepTextDone]} numberOfLines={1}>{st.title}</Text>
                  <Text style={styles.stepTime}>{st.time}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        {stage !== 'arrived' ? (
          <TouchableOpacity style={styles.circle} onPress={cancel} accessibilityLabel="Cancel trip">
            <Ionicons name="close" size={22} color={colors.grey600} />
          </TouchableOpacity>
        ) : <View style={styles.circleSpacer} />}

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={17} color={colors.primary800} />
            <Text style={styles.eta}>{stage === 'arrived' ? 'Arrived' : `${leftMin} min left`}</Text>
          </View>
          <Text style={styles.detail}>{stage === 'arrived' ? trip.arriveTime : `${kmLeft} km · arrive ${trip.arriveTime}`}</Text>
        </View>

        {stage === 'arrived' ? (
          <TouchableOpacity style={styles.pill} onPress={goHome}><Text style={styles.pillText}>Done</Text></TouchableOpacity>
        ) : stage === 'ride' ? (
          <TouchableOpacity style={styles.pill} onPress={endEarly}><Text style={styles.pillText}>End trip</Text></TouchableOpacity>
        ) : <View style={styles.circleSpacer} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  mapWrap: { flex: 1, position: 'relative' },
  headerBar: {
    position: 'absolute', top: 20, left: 25, right: 25, backgroundColor: colors.primary800, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14,
  },
  headerText: { ...typography.s1, color: colors.white },
  headerSub: { ...typography.b3, color: colors.white, opacity: 0.85, marginTop: 2 },
  card: {
    position: 'absolute', left: 25, right: 25, bottom: 20, backgroundColor: colors.white, borderRadius: 12,
    padding: 16, gap: 12, shadowColor: colors.black, shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  cardTitle: { ...typography.s2, color: colors.black },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { ...typography.b3, color: colors.grey600, flex: 1 },
  stepTextCurrent: { color: colors.black, fontFamily: 'Inter_600SemiBold' },
  stepTextDone: { color: colors.grey400 },
  stepTime: { ...typography.b3, color: colors.grey400 },
  optionPrimary: { backgroundColor: colors.primary800, borderRadius: 40, paddingVertical: 14, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  optionPrimaryText: { ...typography.s2, color: colors.white },
  option: { borderWidth: 1, borderColor: colors.grey300, borderRadius: 40, paddingVertical: 14, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  optionText: { ...typography.b2, color: colors.black },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryValue: { ...typography.s1, color: colors.primary800 },
  summaryLabel: { ...typography.b3, color: colors.grey600 },
  bottom: {
    backgroundColor: colors.white, borderTopLeftRadius: 25, borderTopRightRadius: 25, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15, minHeight: 100,
  },
  circle: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: colors.grey300, alignItems: 'center', justifyContent: 'center' },
  circleSpacer: { width: 50, height: 50 },
  info: { alignItems: 'center', gap: 4, flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eta: { ...typography.s1, color: colors.primary800 },
  detail: { ...typography.b3, color: colors.primary800 },
  pill: { backgroundColor: colors.primary800, borderRadius: 30, paddingHorizontal: 18, height: 50, alignItems: 'center', justifyContent: 'center' },
  pillText: { ...typography.s2, color: colors.white },
});
