import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

const TODAY = [
  { id: 'n1', icon: 'bus', title: 'Trip Updates', message: 'Bus #18 to 6 Kilo is arriving at Bole in 3 minute.', time: '9min', highlight: true },
  { id: 'n2', icon: 'train', title: 'Trip Updates', message: 'Train to Ayat delayed by 5 mins due to traffic near Megenagna.', time: '20min' },
  { id: 'n3', icon: 'megaphone', title: 'General Announcements', message: 'Public transport will operate on reduced schedule tomorrow for holiday.', time: '35min' },
];

const YESTERDAY = [
  { id: 'n4', icon: 'navigate', title: 'Trip Updates', message: 'Your saved route CMC → Arat Kilo (Bus) now has heavy traffic. ETA +10 mins.', time: '9min' },
  { id: 'n5', icon: 'rainy', title: 'Weather Alert', message: 'Heavy rains expected in the northern region starting this evening, plan accordingly.', time: '15min' },
];

function NotificationCard({ item }) {
  return (
    <View style={[styles.card, item.highlight && styles.cardHighlight]}>
      <View style={styles.cardIcon}>
        <Ionicons name={item.icon} size={20} color={colors.primary800} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMessage}>{item.message}</Text>
      </View>
      <Text style={styles.cardTime}>{item.time}</Text>
    </View>
  );
}

export default function NotificationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Today</Text>
            <View style={styles.sectionLine} />
          </View>
          {TODAY.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Yesterday</Text>
            <View style={styles.sectionLine} />
          </View>
          {YESTERDAY.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary50 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: colors.white,
  },
  title: { ...typography.s1, color: colors.black },
  content: { padding: 25, gap: 30 },
  section: { gap: 15 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionLabel: { ...typography.b2, color: colors.black },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.grey200 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    gap: 15,
  },
  cardHighlight: {
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  cardIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 5 },
  cardTitle: { ...typography.b4, color: colors.black },
  cardMessage: { ...typography.c2, color: colors.grey600 },
  cardTime: { ...typography.c2, color: colors.grey600 },
});
