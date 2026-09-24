import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RouteMap from '../components/RouteMap';
import { colors, typography } from '../theme/colors';

export default function LiveMapScreen({ navigation }) {
  const [transportType, setTransportType] = useState('Bus');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.titleRow}>
          <Ionicons name="navigate-circle" size={22} color={colors.primary800} />
          <Text style={styles.title}>Live Map</Text>
        </View>
        <Ionicons name="notifications-outline" size={20} color={colors.black} />
      </View>

      <View style={styles.mapWrap}>
        <RouteMap height={500} />
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.plannerCard}>
          <View style={styles.plannerIcons}>
            <View style={styles.dotOutline} />
            <View style={styles.dottedLine} />
            <Ionicons name="location-sharp" size={16} color={colors.primary800} />
          </View>
          <View style={styles.plannerInputs}>
            <View style={styles.inputRow}>
              <Text style={styles.inputTextActive}>Your location</Text>
            </View>
            <View style={styles.inputRowLast}>
              <Text style={styles.inputText}>Where are you going?</Text>
            </View>
          </View>
          <Ionicons name="swap-vertical" size={18} color={colors.grey600} />
        </View>

        <TouchableOpacity style={styles.transportCard}>
          <View style={styles.transportLeft}>
            <Ionicons name="bus" size={20} color={colors.black} />
            <Text style={styles.transportText}>Type of Transport: {transportType}</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color={colors.black} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.findButton}
          onPress={() => navigation.navigate('LiveMapResult')}
        >
          <Ionicons name="search" size={18} color={colors.white} />
          <Text style={styles.findButtonText}>Find Transport to track</Text>
        </TouchableOpacity>
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
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { ...typography.s1, color: colors.black },
  mapWrap: { flex: 1 },
  sheet: {
    backgroundColor: colors.primary50,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    padding: 25,
    gap: 20,
  },
  grabber: { width: 35, height: 4, backgroundColor: colors.grey300, borderRadius: 4, alignSelf: 'center' },
  plannerCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    gap: 15,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  plannerIcons: { alignItems: 'center', width: 15 },
  dotOutline: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.primary800 },
  dottedLine: { width: 1, height: 30, borderLeftWidth: 1, borderLeftColor: colors.grey300, borderStyle: 'dashed', marginVertical: 4 },
  plannerInputs: { flex: 1 },
  inputRow: { borderBottomWidth: 1, borderBottomColor: colors.grey300, paddingVertical: 16 },
  inputRowLast: { paddingVertical: 16 },
  inputTextActive: { ...typography.b1, color: colors.primary800 },
  inputText: { ...typography.b1, color: colors.black },
  transportCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  transportLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  transportText: { ...typography.b3, color: colors.black },
  findButton: {
    backgroundColor: colors.primary800,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 20,
  },
  findButtonText: { ...typography.s2, color: colors.white },
});
