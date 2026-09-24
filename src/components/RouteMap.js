import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

// A free, API-key-free stand-in for a real basemap: draws a stylized street
// grid + route line. Swap for react-native-maps + MapView later if/when
// you're ready to wire a Google Maps API key.
export default function RouteMap({ busProgress, height = 500 }) {
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 428 600" style={StyleSheet.absoluteFill}>
        {/* stylized street grid */}
        {[80, 170, 260, 350].map((y) => (
          <Path key={`h${y}`} d={`M0,${y} L428,${y}`} stroke={colors.grey200} strokeWidth={2} />
        ))}
        {[90, 190, 300, 380].map((x) => (
          <Path key={`v${x}`} d={`M${x},0 L${x},600`} stroke={colors.grey200} strokeWidth={2} />
        ))}
        {/* route line */}
        <Path
          d="M90,520 C150,480 120,320 210,260 C280,215 250,120 300,70"
          stroke={colors.primary800}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={90} cy={520} r={9} fill={colors.primary800} />
        <Circle cx={300} cy={70} r={9} fill={colors.red500} />
        {busProgress !== undefined && (
          <Circle cx={90 + (300 - 90) * busProgress} cy={520 + (70 - 520) * busProgress} r={10} fill={colors.white} stroke={colors.primary800} strokeWidth={4} />
        )}
      </Svg>
      <View style={styles.badge}>
        <Ionicons name="location" size={14} color={colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.primary50,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary800,
    borderRadius: 12,
    padding: 6,
  },
});
