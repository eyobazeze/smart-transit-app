import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

function Row({ icon, label, type = 'arrow', value, onValueChange, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={type === 'toggle'} activeOpacity={0.6}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color={colors.primary800} />
        <Text style={styles.rowLabel}>{label}</Text>
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

export default function ProfileScreen({ navigation }) {
  const [location, setLocation] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={colors.white} />
            </View>
            <View>
              <Text style={styles.name}>John Cena</Text>
              <Text style={styles.email}>johncena@gmail.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Row icon="location-outline" label="Location" type="toggle" value={location} onValueChange={setLocation} />
          <Row icon="globe-outline" label="Language" onPress={() => {}} />
          <Row icon="notifications-outline" label="Push Notifications" type="toggle" value={pushNotifications} onValueChange={setPushNotifications} />
          <Row icon="moon-outline" label="Dark Mode" type="toggle" value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>
          <Row icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Home', { screen: 'Settings' })} />
          <Row icon="help-circle-outline" label="Help Center" onPress={() => {}} />
          <Row icon="log-out-outline" label="Logout" onPress={() => navigation.replace('Login')} />
        </View>
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
  title: { ...typography.s1, color: colors.black },
  content: { paddingHorizontal: 25, paddingBottom: 40, gap: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary800,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { ...typography.s1, color: colors.black },
  email: { ...typography.b3, color: colors.grey600, marginTop: 3 },
  editButton: {
    backgroundColor: colors.primary800,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  editButtonText: { ...typography.b4, color: colors.white },
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
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  rowLabel: { ...typography.b3, color: colors.black },
});
