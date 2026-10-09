import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { CURRENT_LOCATION, searchPlaces, findExact } from '../data/places';

const KIND_ICON = {
  current: 'navigate', airport: 'airplane', market: 'storefront', station: 'bus',
  landmark: 'flag', street: 'trail-sign', area: 'location-sharp',
};

/**
 * Controlled origin/destination editor with live suggestions.
 * value: { origin: Place|null, destination: Place|null }
 */
export default function LocationPlanner({ value, onChange, style }) {
  const [active, setActive] = useState(null); // 'origin' | 'destination' | null
  const [text, setText] = useState({
    origin: value.origin ? value.origin.name : '',
    destination: value.destination ? value.destination.name : '',
  });
  const destRef = useRef(null);

  const other = active === 'origin' ? value.destination : value.origin;
  const suggestions = active
    ? searchPlaces(text[active], other ? [other.id] : [])
    : [];
  const showCurrent =
    active && !text[active] && !(other && other.id === 'current');

  const setField = (field, place) => {
    setText((t) => ({ ...t, [field]: place ? place.name : '' }));
    onChange({ ...value, [field]: place });
  };

  const onType = (field, t) => {
    setText((prev) => ({ ...prev, [field]: t }));
    onChange({ ...value, [field]: findExact(t) });
  };

  const pick = (field, place) => {
    setField(field, place);
    setActive(null);
    if (field === 'origin' && !value.destination) setTimeout(() => destRef.current?.focus(), 50);
  };

  const swap = () => {
    setText({ origin: text.destination, destination: text.origin });
    onChange({ origin: value.destination, destination: value.origin });
  };

  const renderInput = (field, placeholder, inputRef) => {
    const isActive = active === field;
    const has = !!text[field];
    return (
      <View style={[styles.inputRow, field === 'origin' && styles.inputRowBorder]}>
        <TextInput
          ref={inputRef}
          value={text[field]}
          onChangeText={(t) => onType(field, t)}
          onFocus={() => setActive(field)}
          onBlur={() => setTimeout(() => setActive((a) => (a === field ? null : a)), 150)}
          placeholder={placeholder}
          placeholderTextColor={colors.grey400}
          style={[styles.input, field === 'origin' && value.origin?.id === 'current' && styles.inputCurrent]}
          returnKeyType={field === 'origin' ? 'next' : 'done'}
          autoCorrect={false}
          selectTextOnFocus
        />
        {isActive && has ? (
          <TouchableOpacity onPress={() => setField(field, null)} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={colors.grey400} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={style}>
      <View style={styles.card}>
        <View style={styles.icons}>
          <View style={styles.dotOutline} />
          <View style={styles.dottedLine} />
          <Ionicons name="location-sharp" size={16} color={colors.primary800} />
        </View>
        <View style={styles.inputs}>
          {renderInput('origin', 'Starting point')}
          {renderInput('destination', 'Where are you going?', destRef)}
        </View>
        <TouchableOpacity onPress={swap} hitSlop={10}>
          <Feather name="repeat" size={18} color={colors.grey600} style={{ transform: [{ rotate: '90deg' }] }} />
        </TouchableOpacity>
      </View>

      {active ? (
        <View style={styles.list}>
          {showCurrent ? (
            <TouchableOpacity style={styles.item} onPress={() => pick(active, CURRENT_LOCATION)}>
              <View style={[styles.itemIcon, { backgroundColor: colors.primary50 }]}>
                <Ionicons name="navigate" size={16} color={colors.primary800} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>Use my current location</Text>
                <Text style={styles.itemArea}>GPS</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {!text[active] && suggestions.length ? <Text style={styles.listLabel}>Recent</Text> : null}
          {suggestions.map((p) => (
            <TouchableOpacity key={p.id} style={styles.item} onPress={() => pick(active, p)}>
              <View style={styles.itemIcon}>
                <Ionicons name={KIND_ICON[p.kind] || 'location-sharp'} size={16} color={colors.grey600} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{p.name}</Text>
                <Text style={styles.itemArea}>{p.area}, Addis Ababa</Text>
              </View>
            </TouchableOpacity>
          ))}
          {text[active] && !suggestions.length ? (
            <Text style={styles.empty}>No matching place in Addis Ababa</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** Returns an error string or null. */
export function validatePlan({ origin, destination }) {
  if (!origin) return 'Choose a starting point from the suggestions';
  if (!destination) return 'Choose a destination from the suggestions';
  if (origin.id === destination.id) return 'Start and destination are the same';
  return null;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: 10, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 6, gap: 15,
    shadowColor: colors.black, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
  icons: { alignItems: 'center', width: 15 },
  dotOutline: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.primary800 },
  dottedLine: { height: 30, borderLeftWidth: 1, borderLeftColor: colors.grey300, borderStyle: 'dashed', marginVertical: 4 },
  inputs: { flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 52 },
  inputRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.grey300 },
  input: { flex: 1, ...typography.b1, color: colors.black, paddingVertical: 12, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null) },
  inputCurrent: { color: colors.primary800 },
  list: {
    backgroundColor: colors.white, borderRadius: 10, marginTop: 8, paddingVertical: 6,
    shadowColor: colors.black, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
  listLabel: { ...typography.c2, color: colors.grey600, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  itemIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.grey200, alignItems: 'center', justifyContent: 'center' },
  itemName: { ...typography.b2, color: colors.black },
  itemArea: { ...typography.b3, color: colors.grey600 },
  empty: { ...typography.b3, color: colors.grey600, padding: 16 },
});
