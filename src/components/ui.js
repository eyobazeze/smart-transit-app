import React, { useRef } from 'react';
import { Animated, Pressable, Text, View, StyleSheet } from 'react-native';

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

