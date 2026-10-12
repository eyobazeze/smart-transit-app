import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, radius, shadow, typography } from '../theme/colors';
import { PressableScale } from './ui';

export function BrandMark({ size = 64 }) {
  return (
    <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.3 }]}>
      <Ionicons name="bus" size={size * 0.5} color={colors.primary800} />
      <View style={[styles.pin, { width: size * 0.26, height: size * 0.26, borderRadius: size * 0.13, right: size * 0.1, top: size * 0.1 }]} />
    </View>
  );
}

export function AuthLayout({ title, subtitle, children, footer }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 28 }]}>
          <BrandMark size={56} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </LinearGradient>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          {children}
          {footer}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function SocialRow() {
  return (
    <View style={styles.socialWrap}>
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.or}>or continue with</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.socialRow}>
        {[['logo-google', colors.ink], ['logo-apple', colors.ink], ['logo-facebook', '#1877F2']].map(([n, c]) => (
          <PressableScale key={n} style={styles.social}>
            <Ionicons name={n} size={22} color={c} />
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary900 },
  hero: { paddingHorizontal: 24, paddingBottom: 56, gap: 8 },
  title: { ...typography.display, fontSize: 30, color: colors.white, marginTop: 14 },
  subtitle: { ...typography.b3, fontSize: 15, color: 'rgba(255,255,255,0.85)' },
  sheet: {
    flex: 1,
    marginTop: -28,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 16,
  },
  mark: { backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow.float },
  pin: { position: 'absolute', backgroundColor: colors.warn, borderWidth: 2, borderColor: colors.white },
  socialWrap: { gap: 16, marginTop: 8 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: colors.grey300 },
  or: { ...typography.b4, color: colors.grey600 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  social: { width: 60, height: 52, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.grey300, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
});
