import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MAP_HTML } from './mapHtml';
import { colors } from '../theme/colors';

// Web version (used by `expo start --web` and for automated screenshots): same HTML in an iframe.
const slim = (p) => (p && p.lat != null ? { id: p.id, name: p.name, lat: p.lat, lng: p.lng } : null);

export default function RealMap({ origin, destination, progress, buses, onTrack, padding, interactive = true, height }) {
  const frame = useRef(null);
  const [ready, setReady] = useState(false);
  const onTrackRef = useRef(onTrack);
  onTrackRef.current = onTrack;
  const state = useMemo(
    () => ({ origin: slim(origin), destination: slim(destination), progress, buses, padding, interactive }),
    [origin, destination, progress, buses, padding, interactive],
  );

  useEffect(() => {
    const h = (e) => {
      const m = e.data && e.data.__map;
      if (!m) return;
      if (m.type === 'ready') setReady(true);
      if (m.type === 'track' && onTrackRef.current) onTrackRef.current((buses || []).find((b) => b.id === m.id) || { id: m.id });
    };
    window.addEventListener('message', h);
    return () => window.removeEventListener('message', h);
  }, [buses]);

  useEffect(() => {
    if (ready && frame.current && frame.current.contentWindow) frame.current.contentWindow.postMessage({ __setState: state }, '*');
  }, [ready, state]);

  return (
    <View style={[styles.container, height ? { height } : { flex: 1 }]}>
      {React.createElement('iframe', {
        ref: frame, srcDoc: MAP_HTML, title: 'map',
        style: { border: 0, width: '100%', height: '100%', display: 'block' },
      })}
    </View>
  );
}

const styles = StyleSheet.create({ container: { width: '100%', backgroundColor: colors.primary50, overflow: 'hidden' } });
