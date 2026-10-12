import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import RealMap from '../../components/RealMap';
import { getPlace } from '../../data/places';
import { colors, typography, gradients, radius, shadow } from '../../theme/colors';
import { Button, PressableScale } from '../../components/ui';
import { getTrip } from '../../data/tripData';
import { recordTrip } from '../../data/tripStore';
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
  const insets = useSafeAreaInsets();
  const mapPad = useMemo(() => ({ top: insets.top + 135, bottom: 250 }), [insets.top]);
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

  const leftExact = stage === 'walk' ? walk * (1 - p) + wait + ride
    : stage === 'wait' ? wait * (1 - p) + ride
    : stage === 'prompt' ? ride
    : stage === 'ride' ? ride * (1 - p)
    : 0;
  const leftMin = Math.max(0, Math.ceil(leftExact));
  const overall = Math.min(1, Math.max(0, 1 - leftExact / (walk + wait + ride)));
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
  const endedEarly = useRef(false);
  const recorded = useRef(false);
  useEffect(() => {
    if (stage === 'arrived' && !tracking && !endedEarly.current && !recorded.current) {
      recorded.current = true;
      recordTrip({ mode: trip.mode, origin, destination, distance: trip.distance, duration: trip.duration, cost: trip.cost });
    }
  }, [stage, tracking, trip, origin, destination]);
  const endEarly = () => confirm('End trip now?', 'You have not reached the destination yet.', () => { endedEarly.current = true; setStage('arrived'); setP(0); });

  return (
    <View style={styles.root}>
      <View style={styles.mapWrap}>
        <RealMap
          origin={origin || getPlace('bole')}
          destination={destination || getPlace('piassa')}
          progress={rideP}
          vehicle={trip.mode}
          padding={mapPad}
          fallback={<RouteMap busProgress={rideP} />}
        />

        <LinearGradient
          colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.headerBar, shadow.float, { top: insets.top + 12 }]}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <Ionicons name={stage === 'arrived' ? 'checkmark' : isTaxi ? 'car' : mode === 'Train' ? 'train' : 'bus'} size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerText} numberOfLines={1}>{headline}</Text>
              <Text style={styles.headerSub} numberOfLines={1}>{sub}</Text>
            </View>
          </View>
          <View style={styles.track}><View style={[styles.trackFill, { width: `${Math.round(overall * 100)}%` }]} /></View>
        </LinearGradient>

        {stage === 'prompt' ? (
          <View style={[styles.card, shadow.float]}>
            <Text style={styles.cardTitle}>Are you boarding this {vehicle} now?</Text>
            <Button title="Yes, I'm onboard" icon="checkmark-circle" onPress={() => { setTracking(false); setStage('ride'); setP(0); }} />
            <Button title="No, just tracking" icon="eye-outline" variant="secondary" onPress={() => { setTracking(true); setStage('ride'); setP(0); }} />
          </View>
        ) : stage === 'arrived' ? (
          <View style={[styles.card, shadow.float]}>
            <View style={styles.doneRow}>
              <View style={styles.doneIcon}><Ionicons name="checkmark" size={20} color={colors.white} /></View>
              <Text style={styles.cardTitle}>{tracking ? 'Tracking finished' : 'Trip complete'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}><Text style={styles.summaryValue}>{trip.duration}</Text><Text style={styles.summaryLabel}>Time</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}><Text style={styles.summaryValue}>{trip.distance}</Text><Text style={styles.summaryLabel}>Distance</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}><Text style={styles.summaryValue}>{trip.cost}</Text><Text style={styles.summaryLabel}>Fare</Text></View>
            </View>
          </View>
        ) : (
          <View style={[styles.card, shadow.float]}>
            {trip.steps.map((st, i) => {
              const done = i < stepIndex, current = i === stepIndex;
              return (
                <View key={i} style={styles.stepRow}>
                  <Ionicons
                    name={done ? 'checkmark-circle' : current ? 'radio-button-on' : 'ellipse-outline'}
                    size={18}
                    color={done || current ? colors.primary800 : colors.grey300}
                  />
                  <Text style={[styles.stepText, current && styles.stepTextCurrent, done && styles.stepTextDone]} numberOfLines={1}>{st.title}</Text>
                  <Text style={styles.stepTime}>{st.time}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={[styles.bottom, shadow.float, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {stage !== 'arrived' ? (
          <PressableScale onPress={cancel} style={styles.circle} accessibilityLabel="Cancel trip">
            <Ionicons name="close" size={22} color={colors.grey600} />
          </PressableScale>
        ) : <View style={styles.circleSpacer} />}

        <View style={styles.info}>
          <Text style={styles.eta}>{stage === 'arrived' ? 'Arrived' : `${leftMin} min left`}</Text>
          <Text style={styles.detail}>{stage === 'arrived' ? trip.arriveTime : `${kmLeft} km · arrive ${trip.arriveTime}`}</Text>
        </View>

        {stage === 'arrived' ? (
          <Button title="Done" compact onPress={goHome} />
        ) : stage === 'ride' ? (
          <Button title="End trip" compact onPress={endEarly} />
        ) : <View style={styles.circleSpacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { flex: 1, position: 'relative' },
  headerBar: { position: 'absolute', left: 16, right: 16, borderRadius: radius.lg, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerText: { ...typography.s1, color: colors.white },
  headerSub: { ...typography.b3, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  track: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 3, backgroundColor: colors.white },
  card: { position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, gap: 12 },
  cardTitle: { ...typography.s2, color: colors.ink },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { ...typography.b3, color: colors.grey600, flex: 1 },
  stepTextCurrent: { color: colors.ink, fontFamily: 'Inter_600SemiBold' },
  stepTextDone: { color: colors.grey400 },
  stepTime: { ...typography.c2, color: colors.grey400 },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  doneIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.md, paddingVertical: 12 },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryDivider: { width: 1, backgroundColor: colors.grey200 },
  summaryValue: { ...typography.s2, color: colors.primary800 },
  summaryLabel: { ...typography.c2, color: colors.grey600 },
  bottom: {
    backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, gap: 12,
  },
  circle: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: colors.grey200, alignItems: 'center', justifyContent: 'center' },
  circleSpacer: { width: 48, height: 48 },
  info: { alignItems: 'center', gap: 2, flex: 1 },
  eta: { ...typography.h5, color: colors.primary800 },
  detail: { ...typography.c2, color: colors.grey600 },
});
