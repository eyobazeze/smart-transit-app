import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LiveRouteMap from '../components/LiveRouteMap';
import { colors, typography } from '../theme/colors';

const BUSES = [
  { id: 'bus-1', progress: 0.85, currentLocation: 'Meskel Sqr.', status: 'Arrived' },
  { id: 'bus-2', progress: 0.5, currentLocation: 'Kazanchis', status: 'Arrive in 7 min' },
  { id: 'bus-3', progress: 0.15, currentLocation: 'Bole', status: 'Arrive in 15 min' },
];

export default function LiveMapResultScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Live Map</Text>
        <Ionicons name="notifications-outline" size={20} color={colors.black} />
      </View>

      <LiveRouteMap
        buses={BUSES}
        onTrack={() => navigation.navigate('TripLive', { mode: 'Bus', origin: route?.params?.origin, destination: route?.params?.destination })}
      />

      <View style={styles.bottomBar}>
        <View style={styles.grabber} />
        <Text style={styles.routeTitle}>{route?.params?.origin && route?.params?.destination ? `${route.params.origin.id === 'current' ? 'Your location' : route.params.origin.name} → ${route.params.destination.name}` : 'Meskel Square → Shola Market'}</Text>
        <View style={styles.routeStatsRow}>
          <Text style={styles.routeStat}>3 buses</Text>
          <View style={styles.dot} />
          <Text style={styles.routeStat}>10–15 ETB</Text>
        </View>
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
  title: { ...typography.s1, color: colors.black },
  bottomBar: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    gap: 5,
  },
  grabber: { width: 35, height: 4, backgroundColor: colors.grey300, borderRadius: 4, alignSelf: 'center', marginBottom: 10 },
  routeTitle: { ...typography.b2, color: colors.black },
  routeStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  routeStat: { ...typography.b3, color: colors.grey600 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.grey400 },
});
