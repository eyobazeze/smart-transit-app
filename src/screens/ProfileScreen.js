import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, gradients, radius, shadow } from '../theme/colors';
import { StackHeader, Button, SettingsGroup, SettingsRow } from '../components/ui';

export default function ProfileScreen({ navigation }) {
  const [location, setLocation] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.root}>
      <StackHeader title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, shadow.float]}>
          <View style={styles.avatar}><Ionicons name="person" size={36} color={colors.primary800} /></View>
          <Text style={styles.name}>John Cena</Text>
          <Text style={styles.email}>johncena@gmail.com</Text>
          <View style={styles.stats}>
            <View style={styles.stat}><Text style={styles.statValue}>24</Text><Text style={styles.statLabel}>Trips</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statValue}>168 km</Text><Text style={styles.statLabel}>Travelled</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statValue}>4</Text><Text style={styles.statLabel}>Saved</Text></View>
          </View>
        </LinearGradient>

        <Button title="Edit Profile" icon="create-outline" variant="secondary" onPress={() => {}} />

        <SettingsGroup title="Preferences">
          <SettingsRow icon="location-outline" label="Location" type="toggle" value={location} onValueChange={setLocation} />
          <SettingsRow icon="globe-outline" label="Language" onPress={() => {}} />
          <SettingsRow icon="notifications-outline" label="Push Notifications" type="toggle" value={pushNotifications} onValueChange={setPushNotifications} />
          <SettingsRow icon="moon-outline" label="Dark Mode" type="toggle" value={darkMode} onValueChange={setDarkMode} last />
        </SettingsGroup>

        <SettingsGroup title="Other">
          <SettingsRow icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Main', { screen: 'Settings' })} />
          <SettingsRow icon="help-circle-outline" label="Help Center" onPress={() => {}} />
          <SettingsRow icon="log-out-outline" label="Logout" onPress={() => navigation.replace('Login')} last />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  card: { borderRadius: radius.xl, padding: 22, alignItems: 'center', gap: 4 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { ...typography.h5, color: colors.white },
  email: { ...typography.b3, color: 'rgba(255,255,255,0.85)' },
  stats: { flexDirection: 'row', alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: radius.md, paddingVertical: 12, marginTop: 14 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.s2, color: colors.white },
  statLabel: { ...typography.c2, color: 'rgba(255,255,255,0.8)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
});
