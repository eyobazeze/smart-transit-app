// Real device location. CURRENT_LOCATION is updated in place so every screen
// that already holds a reference to it sees the new coordinates.
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { CURRENT_LOCATION } from './places';

const DEFAULT = { lat: 9.0108, lng: 38.7613 }; // Meskel Square
const ADDIS = { lat: 9.03, lng: 38.76 };
const MAX_KM_FROM_ADDIS = 60;

// 'idle' | 'loading' | 'gps' | 'denied' | 'outside' | 'error'
let status = 'idle';
let accuracy = null;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

function km(a, b) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function apply(next, nextStatus, area, acc = null) {
  Object.assign(CURRENT_LOCATION, { lat: next.lat, lng: next.lng, area });
  status = nextStatus;
  accuracy = acc;
  emit();
}

export async function refreshLocation() {
  status = 'loading';
  emit();
  try {
    let perm = await Location.getForegroundPermissionsAsync();
    if (perm.status !== 'granted') perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') {
      apply(DEFAULT, 'denied', 'Location off · using Meskel Square');
      return status;
    }
    let pos = null;
    try { pos = await Location.getLastKnownPositionAsync(); } catch (e) { /* none cached */ }
    if (!pos) pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    if (km(here, ADDIS) > MAX_KM_FROM_ADDIS) {
      apply(DEFAULT, 'outside', "You're outside Addis Ababa · demo location");
    } else {
      apply(here, 'gps', 'Using GPS', pos.coords.accuracy);
    }
  } catch (e) {
    apply(DEFAULT, 'error', 'GPS unavailable · using Meskel Square');
  }
  return status;
}

export function initLocation() {
  if (status === 'idle') refreshLocation();
}

export const getLocationStatus = () => ({ status, accuracy });

export function useLocationStatus() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return { status, accuracy };
}
