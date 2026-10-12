import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandMark } from '../components/Auth';
import { colors, gradients, typography } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(textFade, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => navigation.replace('Login'), 2200);
    return () => clearTimeout(timer);
  }, [navigation, scale, fade, textFade]);

  return (
    <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <BrandMark size={96} />
      </Animated.View>
      <Animated.View style={[styles.textWrap, { opacity: textFade }]}>
        <Text style={styles.name}>Smart Transit</Text>
        <Text style={styles.tag}>Plan the trip. Track the ride.</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textWrap: { alignItems: 'center', marginTop: 24, gap: 6 },
  name: { ...typography.display, fontSize: 32, color: colors.white },
  tag: { ...typography.b3, fontSize: 15, color: 'rgba(255,255,255,0.8)' },
});
