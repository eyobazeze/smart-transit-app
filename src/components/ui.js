import React, { useRef } from 'react';
import { Animated, Pressable, Text, View, StyleSheet, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LAYOUT_KEYS = ['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'width', 'height', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical', 'position', 'top', 'left', 'right', 'bottom', 'zIndex'];
function splitStyle(style) {
  const flat = StyleSheet.flatten(style) || {};
  const outer = {}, inner = {};
  Object.keys(flat).forEach((k) => {
    if (LAYOUT_KEYS.includes(k)) outer[k] = flat[k];
    if (!LAYOUT_KEYS.includes(k) || k === 'width' || k === 'height') inner[k] = flat[k];
  });
  return { outer, inner };
}
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, radius, shadow, typography } from '../theme/colors';

export function tap() {
  try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) { /* not supported */ }
}

/** Pressable that gently scales down while pressed and gives a light haptic tap. */
export function PressableScale({ children, style, onPress, haptic = true, scaleTo = 0.97, disabled, ...rest }) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (x) => Animated.spring(v, { toValue: x, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  const { outer, inner } = splitStyle(style);
  return (
    <Pressable
      style={outer}
      disabled={disabled}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      onPress={(e) => { if (haptic) tap(); if (onPress) onPress(e); }}
      {...rest}
    >
      <Animated.View style={[inner, { transform: [{ scale: v }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Primary (gradient), secondary (outlined) and ghost buttons. */
export function Button({ title, onPress, icon, variant = 'primary', style, disabled, compact }) {
  const primary = variant === 'primary';
  const textColor = primary ? colors.white : colors.primary800;
  const content = (
    <View style={styles.btnInner}>
      {icon ? <Ionicons name={icon} size={18} color={textColor} /> : null}
      <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
    </View>
  );
  return (
    <PressableScale onPress={onPress} disabled={disabled} style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
      {primary ? (
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.btn, compact && styles.btnCompact, shadow.button, { backgroundColor: colors.primary800 }]}>{content}</LinearGradient>
      ) : (
        <View style={[styles.btn, compact && styles.btnCompact, variant === 'secondary' ? styles.btnSecondary : styles.btnGhost]}>{content}</View>
      )}
    </PressableScale>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, shadow.card, style]}>{children}</View>;
}

export function Chip({ label, icon, onPress, active, style }) {
  return (
    <PressableScale onPress={onPress} style={[styles.chip, active && styles.chipActive, style]} scaleTo={0.94}>
      {icon ? <Ionicons name={icon} size={15} color={active ? colors.white : colors.primary800} /> : null}
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: radius.pill, paddingVertical: 17, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  btnCompact: { paddingVertical: 12, paddingHorizontal: 20 },
  btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnText: { ...typography.s2 },
  btnSecondary: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary100 },
  btnGhost: { backgroundColor: 'transparent' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16 },
  round: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary100,
  },
  chipActive: { backgroundColor: colors.primary800, borderColor: colors.primary800 },
  chipText: { ...typography.b4, color: colors.ink },
});

/** Round icon button used for floating map controls. */
export function RoundButton({ icon, onPress, style, color = colors.ink, size = 20 }) {
  return (
    <PressableScale onPress={onPress} style={[styles.round, shadow.card, style]} scaleTo={0.92}>
      <Ionicons name={icon} size={size} color={color} />
    </PressableScale>
  );
}


/** Gradient header for the main tab screens. */
export function TabHeader({ title, subtitle, icon, right, children, bottomPad = 24 }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.tabHeader, { paddingTop: insets.top + 14, paddingBottom: bottomPad }]}>
      <View style={styles.tabHeaderRow}>
        {icon ? <View style={styles.tabHeaderIcon}><Ionicons name={icon} size={20} color={colors.white} /></View> : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.tabHeaderTitle}>{title}</Text>
          {subtitle ? <Text style={styles.tabHeaderSub}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </LinearGradient>
  );
}

/** Back button + title for stack screens (Profile, Notifications...). */
export function StackHeader({ title, onBack, right }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.stackHeader, { paddingTop: insets.top + 10 }]}>
      <RoundButton icon="arrow-back" onPress={onBack} />
      <Text style={styles.stackTitle}>{title}</Text>
      {right || <View style={{ width: 46 }} />}
    </View>
  );
}

/** Reusable trip card (Home recents, My Trips). */
export function TripCard({ route: label, distance, time, extra, mode, onPress }) {
  const [from, to] = String(label).split(/→|->/).map((x) => x.trim());
  const icon = mode === 'Bus' ? 'bus' : mode === 'Train' ? 'train' : 'car';
  return (
    <PressableScale onPress={onPress} style={[styles.tripCard, shadow.card]}>
      <View style={styles.tripIcon}><Ionicons name={icon} size={20} color={colors.primary800} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tripFrom} numberOfLines={1}>{from}</Text>
        <View style={styles.tripToRow}>
          <Ionicons name="arrow-forward" size={12} color={colors.grey400} />
          <Text style={styles.tripTo} numberOfLines={1}>{to}</Text>
        </View>
        <View style={styles.tripStats}>
          <Text style={styles.tripStat}>{distance}</Text><View style={styles.tripDot} />
          <Text style={styles.tripStat}>{time}</Text>
          {extra ? (<><View style={styles.tripDot} /><Text style={styles.tripStat}>{extra}</Text></>) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.grey400} />
    </PressableScale>
  );
}

/** Titled card holding settings rows. */
export function SettingsGroup({ title, children }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={[styles.group, shadow.card]}>{children}</View>
    </View>
  );
}

export function SettingsRow({ icon, label, type = 'arrow', value, onValueChange, onPress, danger, last }) {
  const tint = danger ? colors.red500 : colors.primary800;
  return (
    <PressableScale
      onPress={type === 'toggle' ? () => onValueChange && onValueChange(!value) : onPress}
      style={[styles.sRow, !last && styles.sRowBorder]}
      scaleTo={0.99}
    >
      <View style={[styles.sIcon, { backgroundColor: danger ? colors.redSoft : colors.primary100 }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <Text style={[styles.sLabel, danger && { color: colors.red500 }]} numberOfLines={1}>{label}</Text>
      {type === 'toggle' ? (
        <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary800, false: colors.grey300 }} thumbColor={colors.white} activeThumbColor={colors.white} />
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.grey400} />
      )}
    </PressableScale>
  );
}

/** Two-way pill switch, e.g. Saved / Recent. */
export function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={styles.seg}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <PressableScale key={o.key} onPress={() => onChange(o.key)} style={[styles.segItem, on && styles.segItemOn]} scaleTo={0.96}>
            {o.icon ? <Ionicons name={o.icon} size={16} color={on ? colors.white : colors.grey600} /> : null}
            <Text style={[styles.segText, on && { color: colors.white }]}>{o.label}</Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

Object.assign(styles, StyleSheet.create({
  tabHeader: { paddingHorizontal: 22, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  tabHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tabHeaderIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  tabHeaderTitle: { ...typography.h5, color: colors.white },
  tabHeaderSub: { ...typography.b3, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  stackHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: colors.bg },
  stackTitle: { ...typography.s1, color: colors.ink },
  tripCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderRadius: radius.lg, padding: 14 },
  tripIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primary100, alignItems: 'center', justifyContent: 'center' },
  tripFrom: { ...typography.b2, color: colors.ink },
  tripToRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 },
  tripTo: { ...typography.b3, color: colors.grey600, flex: 1 },
  tripStats: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  tripStat: { ...typography.c2, color: colors.primary800 },
  tripDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.grey300 },
  groupTitle: { ...typography.label, color: colors.grey400, marginLeft: 4, textTransform: 'uppercase' },
  group: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' },
  sRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.white },
  sRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.grey200 },
  sIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sLabel: { ...typography.b2, color: colors.ink, flex: 1 },
  seg: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.pill, padding: 4, ...shadow.card },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 12, borderRadius: radius.pill },
  segItemOn: { backgroundColor: colors.primary800 },
  segText: { ...typography.b4, color: colors.grey600 },
}));
