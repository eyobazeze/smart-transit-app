import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

function Row({ icon, label, type = 'arrow', value, onValueChange, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={type === 'toggle'} activeOpacity={0.6}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color={danger ? colors.red500 : colors.black} />
        <Text style={[styles.rowLabel, danger && { color: colors.red500 }]}>{label}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ true: colors.primary800, false: colors.grey300 }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={14} color={colors.grey400} />
      )}
    </TouchableOpacity>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const [toggles, setToggles] = useState({
    tripReminders: true,
    liveArrivalAlerts: true,
    serviceDisruptions: false,
    liveLocationSharing: true,
  });
  const toggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.titleRow}>
          <Ionicons name="settings-sharp" size={18} color={colors.black} />
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Account Settings">
          <Row icon="person-outline" label="Edit Profile" onPress={() => navigation.navigate('Profile')} />
          <Row icon="language-outline" label="Language" onPress={() => {}} />
          <Row icon="key-outline" label="Change Password" onPress={() => {}} />
        </Section>

        <Section title="Notifications">
          <Row icon="alarm-outline" label="Trip Reminders" type="toggle" value={toggles.tripReminders} onValueChange={() => toggle('tripReminders')} />
          <Row icon="notifications-outline" label="Live Arrival Alerts" type="toggle" value={toggles.liveArrivalAlerts} onValueChange={() => toggle('liveArrivalAlerts')} />
          <Row icon="warning-outline" label="Service Disruptions or Delays" type="toggle" value={toggles.serviceDisruptions} onValueChange={() => toggle('serviceDisruptions')} />
        </Section>

        <Section title="Privacy & Location">
          <Row icon="location-outline" label="Live Location Sharing" type="toggle" value={toggles.liveLocationSharing} onValueChange={() => toggle('liveLocationSharing')} />
          <Row icon="document-text-outline" label="Privacy Policy" onPress={() => {}} />
          <Row icon="shield-checkmark-outline" label="Permissions Settings" onPress={() => {}} />
        </Section>

        <Section title="App Preferences">
          <Row icon="color-palette-outline" label="Appearance / Theme" onPress={() => {}} />
          <Row icon="cloud-offline-outline" label="Offline Mode" onPress={() => {}} />
          <Row icon="bus-outline" label="Default Transport Mode" onPress={() => {}} />
        </Section>

        <Section title="Help & Support">
          <Row icon="help-circle-outline" label="FAQs" onPress={() => {}} />
          <Row icon="flag-outline" label="Report a Problem" onPress={() => {}} />
          <Row icon="chatbox-ellipses-outline" label="Send Feedback" onPress={() => {}} />
        </Section>

        <Section title="About">
          <Row icon="information-circle-outline" label="Version Info" onPress={() => {}} />
          <Row icon="code-slash-outline" label="Developer Info" onPress={() => {}} />
          <Row icon="document-outline" label="Terms & Conditions" onPress={() => {}} />
        </Section>

        <Section title="Account Actions">
          <Row icon="log-out-outline" label="Logout" onPress={() => navigation.replace('Login')} />
          <Row icon="trash-outline" label="Delete Account" onPress={() => {}} danger />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: colors.white,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { ...typography.s1, color: colors.black },
  content: { paddingHorizontal: 25, paddingBottom: 40, gap: 20 },
  section: { gap: 10 },
  sectionTitle: { ...typography.s2, color: colors.black },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey200,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { ...typography.b3, color: colors.black },
});
