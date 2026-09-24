import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

const ROUTE_PATH = 'M90,560 C150,510 120,340 210,270 C280,220 250,120 300,60';

// t: 0 (origin) -> 1 (destination), roughly matches ROUTE_PATH's curve
function pointAt(t) {
  // simple cubic bezier approximation split into two segments, close enough for a stylized map
  const points = [
    { x: 90, y: 560 },
    { x: 150, y: 460 },
    { x: 180, y: 340 },
    { x: 210, y: 270 },
    { x: 260, y: 190 },
    { x: 300, y: 60 },
  ];
  const idx = Math.min(Math.floor(t * (points.length - 1)), points.length - 2);
  const localT = t * (points.length - 1) - idx;
  const a = points[idx];
  const b = points[idx + 1];
  return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT };
}

export default function LiveRouteMap({ buses, onTrack }) {
  const [activeBusId, setActiveBusId] = useState(null);
  const activeBus = buses.find((b) => b.id === activeBusId);
  const activePoint = activeBus ? pointAt(activeBus.progress) : null;

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 428 620" style={StyleSheet.absoluteFill}>
        {[80, 170, 260, 350, 440, 530].map((y) => (
          <Path key={`h${y}`} d={`M0,${y} L428,${y}`} stroke={colors.grey200} strokeWidth={2} />
        ))}
        {[90, 190, 300, 380].map((x) => (
          <Path key={`v${x}`} d={`M${x},0 L${x},620`} stroke={colors.grey200} strokeWidth={2} />
        ))}
        <Path d={ROUTE_PATH} stroke={colors.primary800} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Circle cx={90} cy={560} r={9} fill={colors.primary800} />
        <Circle cx={300} cy={60} r={9} fill={colors.red500} />
      </Svg>

      {buses.map((bus) => {
        const p = pointAt(bus.progress);
        return (
          <TouchableOpacity
            key={bus.id}
            style={[styles.marker, { left: p.x - 20, top: p.y - 20 }]}
            onPress={() => setActiveBusId(bus.id === activeBusId ? null : bus.id)}
          >
            <Ionicons name="bus" size={20} color={colors.white} />
          </TouchableOpacity>
        );
      })}

      {activeBus && activePoint && (
        <View style={[styles.popup, { left: Math.min(Math.max(activePoint.x - 70, 10), 230), top: activePoint.y - 90 }]}>
          <View style={styles.popupRow}>
            <Ionicons name="location" size={16} color={colors.primary800} />
            <Text style={styles.popupText}>Currently at {activeBus.currentLocation}</Text>
          </View>
          <View style={styles.popupRow}>
            <Ionicons name="time-outline" size={16} color={colors.primary800} />
            <Text style={styles.popupText}>{activeBus.status}</Text>
          </View>
          <TouchableOpacity style={styles.trackButton} onPress={() => onTrack(activeBus)}>
            <Text style={styles.trackButtonText}>Track</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary50, position: 'relative', overflow: 'hidden' },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary800,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  popup: {
    position: 'absolute',
    width: 220,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary800,
    borderRadius: 10,
    padding: 15,
    gap: 10,
  },
  popupRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  popupText: { ...typography.b3, color: colors.black, flexShrink: 1 },
  trackButton: {
    backgroundColor: colors.primary800,
    borderRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  trackButtonText: { ...typography.c2, color: colors.white },
});
