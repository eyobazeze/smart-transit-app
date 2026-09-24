import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

export default function TripBottomCard({ duration, distance, time, onCancel, onEnd }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.circleButton} onPress={onCancel}>
        <Ionicons name="close" size={22} color={colors.grey600} />
      </TouchableOpacity>

      <View style={styles.info}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={17} color={colors.primary800} />
          <Text style={styles.duration}>{duration}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.detail}>{distance}</Text>
          <View style={styles.dividerDot} />
          <Text style={styles.detail}>{time}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.circleButton, styles.circleButtonPrimary]} onPress={onEnd}>
        <Ionicons name="search" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 15,
    height: 112,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonPrimary: { backgroundColor: colors.primary800, borderWidth: 0 },
  info: { alignItems: 'center', gap: 5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  duration: { ...typography.s1, color: colors.primary800 },
  detail: { ...typography.b2, color: colors.primary800 },
  dividerDot: { width: 1, height: 12, backgroundColor: colors.primary800, opacity: 0.4 },
});
