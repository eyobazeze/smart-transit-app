import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../../components/RouteMap';
import TripBottomCard from '../../components/TripBottomCard';
import { colors, typography } from '../../theme/colors';
import { getTrip } from '../../data/tripData';

export default function TripStationScreen({ route, navigation }) {
  const mode = route.params?.mode || 'Bus';
  const trip = getTrip(mode);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.mapWrap}>
        <RouteMap busProgress={0.1} height={700} />

        <View style={styles.headerBar}>
          <Ionicons name="navigate" size={20} color={colors.white} />
          <Text style={styles.headerText}>{trip.station}</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptText}>Your vehicle arrives. Are you boarding this vehicle now?</Text>
          <View style={styles.promptOptions}>
            <TouchableOpacity style={styles.promptOption} onPress={() => navigation.navigate('TripTrack', { mode })}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.black} />
              <Text style={styles.promptOptionText}>Yes, I'm onboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.promptOption} onPress={() => navigation.navigate('TripTrack', { mode })}>
              <Ionicons name="eye-outline" size={16} color={colors.black} />
              <Text style={styles.promptOptionText}>No, just tracking</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionColumn}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="locate" size={22} color={colors.primary800} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="layers-outline" size={22} color={colors.primary800} />
          </TouchableOpacity>
        </View>
      </View>

      <TripBottomCard
        duration={trip.duration}
        distance={trip.distance}
        time={trip.steps[1]?.time || trip.leaveTime}
        onCancel={() => navigation.navigate('Home')}
        onEnd={() => navigation.navigate('TripTrack', { mode })}
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
  headerText: { ...typography.s1, color: colors.white, flexShrink: 1, textAlign: 'center' },
  promptCard: {
    position: 'absolute',
    top: 110,
    left: 40,
    right: 60,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary800,
    borderRadius: 10,
    padding: 15,
    gap: 12,
  },
  promptText: { ...typography.b3, color: colors.black },
  promptOptions: { gap: 10 },
  promptOption: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  promptOptionText: { ...typography.b3, color: colors.black },
  actionColumn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    gap: 12,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
