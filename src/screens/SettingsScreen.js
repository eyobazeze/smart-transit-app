import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadow } from '../theme/colors';
import { TabHeader, PressableScale, SettingsGroup, SettingsRow } from '../components/ui';

export default function SettingsScreen({ navigation }) {
  const [toggles, setToggles] = useState({
    tripReminders: true,
    liveArrivalAlerts: true,
    serviceDisruptions: false,
    liveLocationSharing: true,
  });
  const set = (key) => (v) => setToggles((t) => ({ ...t, [key]: v }));
  const noop = () => {};

  return (
    <View style={styles.root}>
      <TabHeader title="Settings" subtitle="Manage your account and preferences" icon="settings" bottomPad={50} />
      <View style={styles.profileWrap}>
      <PressableScale onPress={() => navigation.navigate('Profile')} style={[styles.profile, shadow.card]}>
        <View style={styles.avatar}><Ionicons name="person" size={26} color={colors.white} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>John Cena</Text>
          <Text style={styles.email}>johncena@gmail.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.grey400} />
      </PressableScale>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <SettingsGroup title="Account">
          <SettingsRow icon="person-outline" label="Edit Profile" onPress={() => navigation.navigate('Profile')} />
          <SettingsRow icon="language-outline" label="Language" onPress={noop} />
          <SettingsRow icon="key-outline" label="Change Password" onPress={noop} last />
        </SettingsGroup>

        <SettingsGroup title="Notifications">
          <SettingsRow icon="alarm-outline" label="Trip Reminders" type="toggle" value={toggles.tripReminders} onValueChange={set('tripReminders')} />
          <SettingsRow icon="notifications-outline" label="Live Arrival Alerts" type="toggle" value={toggles.liveArrivalAlerts} onValueChange={set('liveArrivalAlerts')} />
          <SettingsRow icon="warning-outline" label="Service Disruptions" type="toggle" value={toggles.serviceDisruptions} onValueChange={set('serviceDisruptions')} last />
        </SettingsGroup>

        <SettingsGroup title="Privacy & Location">
          <SettingsRow icon="location-outline" label="Live Location Sharing" type="toggle" value={toggles.liveLocationSharing} onValueChange={set('liveLocationSharing')} />
          <SettingsRow icon="document-text-outline" label="Privacy Policy" onPress={noop} />
          <SettingsRow icon="shield-checkmark-outline" label="Permissions" onPress={noop} last />
        </SettingsGroup>

        <SettingsGroup title="App preferences">
          <SettingsRow icon="color-palette-outline" label="Appearance / Theme" onPress={noop} />
          <SettingsRow icon="cloud-offline-outline" label="Offline Mode" onPress={noop} />
          <SettingsRow icon="bus-outline" label="Default Transport Mode" onPress={noop} last />
        </SettingsGroup>

        <SettingsGroup title="Help & support">
          <SettingsRow icon="help-circle-outline" label="FAQs" onPress={noop} />
          <SettingsRow icon="flag-outline" label="Report a Problem" onPress={noop} />
          <SettingsRow icon="chatbox-ellipses-outline" label="Send Feedback" onPress={noop} last />
        </SettingsGroup>

        <SettingsGroup title="About">
          <SettingsRow icon="information-circle-outline" label="Version Info" onPress={noop} />
          <SettingsRow icon="code-slash-outline" label="Developer Info" onPress={noop} />
          <SettingsRow icon="document-outline" label="Terms & Conditions" onPress={noop} last />
        </SettingsGroup>

        <SettingsGroup title="Account actions">
          <SettingsRow icon="log-out-outline" label="Logout" onPress={() => navigation.replace('Login')} />
          <SettingsRow icon="trash-outline" label="Delete Account" onPress={noop} danger last />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 22 },
  profileWrap: { marginTop: -30, marginHorizontal: 20, marginBottom: 14, zIndex: 2 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderRadius: radius.lg, padding: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary800, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.s2, color: colors.ink },
  email: { ...typography.b3, color: colors.grey600, marginTop: 1 },
});
