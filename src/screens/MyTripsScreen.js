import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography } from '../theme/colors';
import { TabHeader, SegmentedControl, TripCard, PressableScale, EmptyState } from '../components/ui';
import { useTripStore, planFromItem, removeSaved, clearHistory, timeAgo } from '../data/tripStore';
import { Ionicons } from '@expo/vector-icons';

export default function MyTripsScreen({ navigation }) {
  const [tab, setTab] = useState('saved');
  const { history, saved } = useTripStore();
  const isSavedTab = tab === 'saved';
  const list = isSavedTab ? saved : history;
  const label = isSavedTab ? `${saved.length} saved route${saved.length === 1 ? '' : 's'}` : `${history.length} trip${history.length === 1 ? '' : 's'} taken`;

  return (
    <View style={styles.root}>
      <TabHeader
        title="My Trips"
        subtitle="Your saved routes and past rides"
        icon="briefcase"
        right={
          <PressableScale onPress={() => navigation.navigate('Notification')} style={styles.bell}>
            <Ionicons name="notifications-outline" size={21} color={colors.white} />
          </PressableScale>
        }
        bottomPad={46}
      />
      <View style={styles.segmentWrap}>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[{ key: 'saved', label: 'Saved routes', icon: 'bookmark' }, { key: 'recent', label: 'Recent trips', icon: 'time' }]}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {list.length ? (
          <View style={styles.listHead}>
            <Text style={styles.listLabel}>{label}</Text>
            {!isSavedTab ? (
              <PressableScale onPress={clearHistory} haptic={false}><Text style={styles.clear}>Clear</Text></PressableScale>
            ) : null}
          </View>
        ) : null}
        {list.length ? (
          <View style={{ gap: 12 }}>
            {list.map((item) => (
              <TripCard
                key={item.id}
                route={item.route}
                distance={`${item.km} km`}
                time={`${item.minutes} mins`}
                extra={isSavedTab ? item.mode : `${item.mode} · ${timeAgo(item.ts)}`}
                mode={item.mode}
                onPress={() => navigation.navigate('TripResult', planFromItem(item))}
                onAction={isSavedTab ? () => removeSaved(item.id) : undefined}
                actionIcon="bookmark"
              />
            ))}
          </View>
        ) : isSavedTab ? (
          <EmptyState
            icon="bookmark-outline"
            title="No saved routes yet"
            text="Open any trip's details and tap the bookmark to keep it here."
            actionTitle="Plan a trip"
            onAction={() => navigation.navigate('Home')}
          />
        ) : (
          <EmptyState
            icon="time-outline"
            title="No trips yet"
            text="Finish a ride and it will appear here, ready to repeat in one tap."
            actionTitle="Plan a trip"
            onAction={() => navigation.navigate('Home')}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  segmentWrap: { marginTop: -26, marginHorizontal: 20, marginBottom: 14, zIndex: 2 },
  listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listLabel: { ...typography.b4, color: colors.grey600 },
  clear: { ...typography.b4, color: colors.primary800 },
});
