import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import TripBottomCard from '../../components/TripBottomCard';
import { colors, typography } from '../../theme/colors';
import { getTrip } from '../../data/tripData';

export default function TripEndScreen({ route, navigation }) {
  const mode = route.params?.mode || 'Bus';
  const trip = getTrip(mode);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.mapWrap}>
        <RouteMap busProgress={1} height={700} />

        <View style={styles.headerBar}>
          <Ionicons name="navigate" size={20} color={colors.white} />
          <Text style={styles.headerText}>{trip.endStation}</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary800} />
            <Text style={styles.infoText}>You have reached your destination</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary800} />
            <Text style={styles.infoText}>Current Location: {trip.endStation}</Text>
          </View>
        </View>
      </View>

      <TripBottomCard
        duration="0 Min"
        distance={trip.distance}
        time={trip.arriveTime}
        onCancel={() => navigation.navigate('Home')}
        onEnd={() => navigation.navigate('Home')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  mapWrap: { flex: 1, position: 'relative' },
  headerBar: {
    position: 'absolute',
    top: 20,
    left: 25,
    right: 25,
    backgroundColor: colors.primary800,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  headerText: { ...typography.s1, color: colors.white },
  infoCard: {
    position: 'absolute',
    top: 130,
    left: 90,
    right: 40,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary800,
    borderRadius: 10,
    padding: 15,
    gap: 12,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { ...typography.b3, color: colors.black },
});
