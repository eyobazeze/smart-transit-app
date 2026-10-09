import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import LocationPlanner, { validatePlan } from '../components/LocationPlanner';
import { CURRENT_LOCATION, PLACES } from '../data/places';

const RECENT_TRIPS = [
  { id: '1', route: 'Bole → Piassa', distance: '7.2 km', time: '18 mins', cost: '35 ETB', icon: 'car', mode: 'Taxi' },
  { id: '2', route: 'Kebena → Meskel Square', distance: '5.4 km', time: '25 mins', cost: '10 ETB', icon: 'bus', mode: 'Bus' },
  { id: '3', route: 'Bole Airport → Africa Avenue', distance: '12.8 km', time: '45 mins', cost: '20 ETB', icon: 'car', mode: 'Taxi' },
];

export default function HomeScreen({ navigation }) {
  const [plan, setPlan] = useState({ origin: CURRENT_LOCATION, destination: null });
  const [error, setError] = useState(null);
  const planner = useRef(null);
  const go = () => {
    const resolved = planner.current ? planner.current.resolve() : plan;
    const err = validatePlan(resolved);
    setError(err);
    if (!err) navigation.navigate('TripResult', { origin: resolved.origin, destination: resolved.destination });
  };
  const recentPlan = (r) => {
    const find = (n) => PLACES.find((p) => p.name.toLowerCase() === n.toLowerCase().trim());
    const [a, b] = r.route.split('→');
    return { origin: find(a), destination: find(b) };
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.userInfo}>
          <View style={styles.greetingRow}>
            <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person" size={26} color={colors.white} />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Hello there!</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={13} color={colors.grey600} />
                <Text style={styles.locationText}>Addis Ababa, Ethiopia</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons name="search" size={22} color={colors.primary800} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Ionicons name="notifications-outline" size={22} color={colors.primary800} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.planSection}>
            <View>
              <Text style={styles.planHeader}>
                Plan. <Text style={{ color: colors.primary800 }}>Ride.</Text> Arrive.
              </Text>
              <Text style={styles.planSubtitle}>Track public transport in real time.</Text>
            </View>

            <LocationPlanner ref={planner} value={plan} onChange={(v) => { setPlan(v); setError(null); }} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.planButton} onPress={go}>
              <Text style={styles.planButtonText}>Plan My Trip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent Trips</Text>
            <View style={styles.recentList}>
              {RECENT_TRIPS.map((trip, index) => (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => navigation.navigate('TripResult', { mode: trip.mode, ...recentPlan(trip) })}
                  style={[
                    styles.recentItem,
                    index !== RECENT_TRIPS.length - 1 && styles.recentItemBorder,
                  ]}
                >
                  <View style={styles.recentItemLeft}>
                    <Ionicons
                      name={trip.icon === 'bus' ? 'bus' : 'car'}
                      size={20}
                      color={colors.primary800}
                    />
                    <View>
                      <Text style={styles.recentRoute}>{trip.route}</Text>
                      <View style={styles.recentStatsRow}>
                        <Text style={styles.recentStat}>{trip.distance}</Text>
                        <View style={styles.dot} />
                        <Text style={styles.recentStat}>{trip.time}</Text>
                        <View style={styles.dot} />
                        <Text style={styles.recentStat}>{trip.cost}</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.grey400} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary50 },
  userInfo: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
  },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary800,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { ...typography.s1, color: colors.black },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  locationText: { ...typography.b3, color: colors.grey600 },
  headerIcons: { flexDirection: 'row', gap: 16 },
  mainContent: { padding: 25, gap: 25 },
  planSection: { gap: 20 },
  planHeader: { ...typography.h4, color: colors.black },
  planSubtitle: { ...typography.b3, color: colors.grey600, marginTop: 5 },
  tripPlanner: {
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
  },
  tripPlannerIcons: { alignItems: 'center', width: 15 },
  dotOutline: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.primary800,
  },
  dottedLine: {
    width: 1,
    height: 30,
    borderLeftWidth: 1,
    borderLeftColor: colors.grey300,
    borderStyle: 'dashed',
    marginVertical: 4,
  },
  tripInputs: { flex: 1 },
  tripInputRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey300,
    paddingVertical: 16,
  },
  tripInputRowLast: { paddingVertical: 16 },
  tripInputTextActive: { ...typography.b1, color: colors.primary800 },
  tripInputText: { ...typography.b1, color: colors.black },
  planButton: {
    backgroundColor: colors.primary800,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  errorText: { ...typography.b3, color: colors.red500, marginTop: -8 },
  planButtonText: { ...typography.s2, color: colors.white },
  recentSection: { gap: 10 },
  recentTitle: { ...typography.b2, color: colors.black },
  recentList: { backgroundColor: colors.white, borderRadius: 10 },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  recentItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.grey200 },
  recentItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 20, flex: 1 },
  recentRoute: { ...typography.b2, color: colors.black },
  recentStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5 },
  recentStat: { ...typography.b3, color: colors.grey600 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.grey400 },
});
