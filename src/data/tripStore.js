// Saved routes + completed-trip history, persisted on the device.
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CURRENT_LOCATION, getPlace } from './places';

const HISTORY_KEY = 'st.history.v1';
const SAVED_KEY = 'st.saved.v1';
const MAX_HISTORY = 50;

let state = { history: [], saved: [], ready: false };
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());
const persist = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});

export async function hydrateTrips() {
  try {
    const [h, s] = await Promise.all([AsyncStorage.getItem(HISTORY_KEY), AsyncStorage.getItem(SAVED_KEY)]);
    state = { history: h ? JSON.parse(h) : [], saved: s ? JSON.parse(s) : [], ready: true };
  } catch (e) {
    state = { ...state, ready: true };
  }
  emit();
}

const labelOf = (p) => (p.id === 'current' ? 'Your location' : p.name);
const idOf = (o, d, mode) => `${mode}:${o.id}:${d.id}`;
const toItem = (mode, o, d) => ({ mode, originId: o.id, destId: d.id, route: `${labelOf(o)} → ${labelOf(d)}` });

/** Turn a stored item back into planner params (current location resolves to the live GPS point). */
export function planFromItem(item) {
  const origin = item.originId === 'current' ? CURRENT_LOCATION : getPlace(item.originId);
  const destination = getPlace(item.destId);
  return { mode: item.mode, origin, destination };
}

export function recordTrip({ mode, origin, destination, distance, duration, cost }) {
  const item = {
    ...toItem(mode, origin, destination),
    id: `${Date.now()}`,
    ts: Date.now(),
    km: parseFloat(distance) || 0,
    minutes: parseInt(duration, 10) || 0,
    fare: parseInt(cost, 10) || 0,
  };
  state = { ...state, history: [item, ...state.history].slice(0, MAX_HISTORY) };
  persist(HISTORY_KEY, state.history);
  emit();
}

export const isSaved = (mode, o, d) => state.saved.some((s) => s.id === idOf(o, d, mode));

export function toggleSaved({ mode, origin, destination, distance, duration }) {
  const id = idOf(origin, destination, mode);
  const exists = state.saved.some((s) => s.id === id);
  const saved = exists
    ? state.saved.filter((s) => s.id !== id)
    : [{ ...toItem(mode, origin, destination), id, km: parseFloat(distance) || 0, minutes: parseInt(duration, 10) || 0 }, ...state.saved];
  state = { ...state, saved };
  persist(SAVED_KEY, saved);
  emit();
  return !exists;
}

export function removeSaved(id) {
  state = { ...state, saved: state.saved.filter((s) => s.id !== id) };
  persist(SAVED_KEY, state.saved);
  emit();
}

export function clearHistory() {
  state = { ...state, history: [] };
  persist(HISTORY_KEY, []);
  emit();
}

export function useTripStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return state;
}

export function timeAgo(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'Yesterday' : `${d} days ago`;
}

export function statsFromHistory(history) {
  const km = history.reduce((a, t) => a + (t.km || 0), 0);
  return { trips: history.length, km: km >= 100 ? Math.round(km) : Math.round(km * 10) / 10 };
}
