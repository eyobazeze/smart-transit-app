import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadow } from '../theme/colors';
import { StackHeader } from '../components/ui';

const TODAY = [
  { id: 'n1', icon: 'bus', title: 'Trip Updates', message: 'Bus #18 to 6 Kilo is arriving at Bole in 3 minute.', time: '9 min', unread: true },
  { id: 'n2', icon: 'train', title: 'Trip Updates', message: 'Train to Ayat delayed by 5 mins due to traffic near Megenagna.', time: '20 min', unread: true },
  { id: 'n3', icon: 'megaphone', title: 'General Announcements', message: 'Public transport will operate on reduced schedule tomorrow for holiday.', time: '35 min' },
];

const YESTERDAY = [
  { id: 'n4', icon: 'navigate', title: 'Trip Updates', message: 'Your saved route CMC → Arat Kilo (Bus) now has heavy traffic. ETA +10 mins.', time: '9 min' },
  { id: 'n5', icon: 'rainy', title: 'Weather Alert', message: 'Heavy rains expected in the northern region starting this evening, plan accordingly.', time: '15 min' },
];

function NotificationCard({ item }) {
  return (
    <View style={[styles.card, shadow.card]}>
      <View style={styles.cardIcon}>
        <Ionicons name={item.icon} size={20} color={colors.primary800} />
      </View>
      <View style={styles.cardText}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.unread ? <View style={styles.unread} /> : null}
        </View>
        <Text style={styles.cardMessage}>{item.message}</Text>
      </View>
      <Text style={styles.cardTime}>{item.time}</Text>
    </View>
  );
}

function Group({ label, items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {items.map((item) => <NotificationCard key={item.id} item={item} />)}
    </View>
  );
}

export default function NotificationScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <StackHeader title="Notifications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Group label="TODAY" items={TODAY} />
        <Group label="YESTERDAY" items={YESTERDAY} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 22 },
  section: { gap: 12 },
  sectionLabel: { ...typography.label, color: colors.grey400, marginLeft: 4 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  cardIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary100, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { ...typography.b2, color: colors.ink },
  unread: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary800 },
  cardMessage: { ...typography.b3, color: colors.grey600 },
  cardTime: { ...typography.c2, color: colors.grey400 },
});
