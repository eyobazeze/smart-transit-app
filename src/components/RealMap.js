import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MAP_HTML } from './mapHtml';
import { colors } from '../theme/colors';

const READY_TIMEOUT_MS = 12000;

const slim = (p) => (p && p.lat != null ? { id: p.id, name: p.name, lat: p.lat, lng: p.lng } : null);

/**
 * Real map (Leaflet + OpenStreetMap data) rendered in a WebView. No API key.
 * Props:
 *  origin, destination  places with {lat,lng}; when both are set, the road route is drawn and fitted
 *  progress             0..1, shows a vehicle along the route (undefined = hidden)
 *  buses                [{id, progress, currentLocation, status}] tappable markers with a Track popup
 *  onTrack(bus)         called when "Track" is tapped in a bus popup
 *  padding              {top, bottom} px kept clear around the route (for overlays)
 *  interactive          allow pan/zoom (default true)
 *  height               fixed height; omit to fill the parent
 *  fallback             element shown if the map cannot load (e.g. offline)
 */
export default function RealMap({
  origin, destination, progress, buses, onTrack, padding, interactive = true, height, fallback = null,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onTrackRef = useRef(onTrack);
  onTrackRef.current = onTrack;

  const stateJson = useMemo(
    () => JSON.stringify({ origin: slim(origin), destination: slim(destination), progress, buses, padding, interactive }),
    [origin, destination, progress, buses, padding, interactive],
  );

  useEffect(() => {
    if (ready && ref.current) ref.current.injectJavaScript(`window.__setState(${JSON.stringify(stateJson)}); true;`);
  }, [ready, stateJson]);

  useEffect(() => {
    if (ready) return undefined;
    const t = setTimeout(() => setFailed(true), READY_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [ready]);

  const onMessage = (e) => {
    let m;
    try { m = JSON.parse(e.nativeEvent.data); } catch (x) { return; }
    if (m.type === 'ready') { setReady(true); setFailed(false); }
    else if (m.type === 'track' && onTrackRef.current) {
      const bus = (buses || []).find((b) => b.id === m.id);
      onTrackRef.current(bus || { id: m.id });
    }
  };

  if (failed && fallback) return fallback;

  return (
    <View style={[styles.container, height ? { height } : { flex: 1 }]}>
      <WebView
        ref={ref}
        source={{ html: MAP_HTML, baseUrl: 'https://localhost/' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onMessage={onMessage}
        onError={() => setFailed(true)}
        onHttpError={() => {}}
        style={styles.web}
        containerStyle={styles.web}
      />
      {!ready ? (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator color={colors.primary800} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', backgroundColor: colors.primary50, overflow: 'hidden' },
  web: { flex: 1, backgroundColor: 'transparent' },
  loading: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary50 },
});
