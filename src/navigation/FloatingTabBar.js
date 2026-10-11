import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../components/ui';
import { colors, radius, shadow, typography } from '../theme/colors';

const ICONS = {
  Home: ['home', 'home-outline'],
  Tracker: ['navigate-circle', 'navigate-circle-outline'],
  'My Trips': ['briefcase', 'briefcase-outline'],
  Settings: ['settings', 'settings-outline'],
};

/** Floating rounded tab bar. It sits in the normal layout flow (not absolute), so no screen content is hidden behind it. */
export default function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={[styles.bar, shadow.float]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const [on, off] = ICONS[route.name] || ['ellipse', 'ellipse-outline'];
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          return (
            <PressableScale
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel || route.name}
              style={[styles.item, focused && styles.itemActive]}
              scaleTo={0.92}
            >
              <Ionicons name={focused ? on : off} size={22} color={focused ? colors.primary800 : colors.grey400} />
              {focused ? <Text style={styles.label} numberOfLines={1}>{route.name}</Text> : null}
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.bg, paddingTop: 6, paddingHorizontal: 16 },
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.white,
    borderRadius: radius.xl, paddingVertical: 8, paddingHorizontal: 8,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 46, borderRadius: radius.pill },
  itemActive: { backgroundColor: colors.primary100 },
  label: { ...typography.b4, color: colors.primary800 },
});
