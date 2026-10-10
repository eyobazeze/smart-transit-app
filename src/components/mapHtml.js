import { LEAFLET_JS, LEAFLET_CSS } from './leafletAssets';

// ---- Map provider settings (all free, no API key) -------------------------------------------
// Basemap tiles: the standard OpenStreetMap server. Free and needs no key, but it is meant for
// light/demo use (see https://operations.osmfoundation.org/policies/tiles/). The attribution is required.
// For heavier traffic, swap TILE_URL for a hosted provider's free tier (MapTiler, Stadia, Thunderforest...).
export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// Road routing: public OSRM demo server (free, no key, best-effort). Falls back to a straight line.
export const ROUTING_URL = 'https://router.project-osrm.org/route/v1/driving';
// ----------------------------------------------------------------------------------------------

const SCRIPT = `
(function () {
  var TILE_URL = ${JSON.stringify(TILE_URL)};
  var ATTR = ${JSON.stringify(TILE_ATTRIBUTION)};
  var ROUTING_URL = ${JSON.stringify(ROUTING_URL)};
  var BLUE = '#2a86ff', RED = '#ee443f';

  function send(o) {
    var s = JSON.stringify(o);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(s);
    else if (window.parent !== window) window.parent.postMessage({ __map: o }, '*');
  }

  var map = L.map('map', { zoomControl: false, attributionControl: true, zoomSnap: 0.25, tap: true })
    .setView([9.0108, 38.7613], 12);
  map.attributionControl.setPrefix(false);
  L.tileLayer(TILE_URL, { maxZoom: 19, attribution: ATTR }).addTo(map);

  var routeLayer = L.layerGroup().addTo(map);
  var busLayer = L.layerGroup().addTo(map);
  var vehicle = null, originMarker = null, destMarker = null;
  var coords = [], cum = [], total = 0;
  var routeKey = '', padKey = '', reqId = 0;
  var state = {};

  var busSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM6 11V6h12v5H6z"/></svg>';
  function busIcon(active) {
    return L.divIcon({
      className: '',
      html: '<div style="box-sizing:border-box;width:38px;height:38px;border-radius:19px;background:' + BLUE + ';border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;' + (active ? 'transform:scale(1.12);' : '') + '">' + busSvg + '</div>',
      iconSize: [38, 38], iconAnchor: [19, 19]
    });
  }
  var pinIcon = L.divIcon({
    className: '',
    html: '<div style="box-sizing:border-box;width:22px;height:22px;border-radius:11px;background:' + RED + ';border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>',
    iconSize: [22, 22], iconAnchor: [11, 11]
  });

  function ll(p) { return [p.lat, p.lng]; }

  function buildCum() {
    cum = [0]; total = 0;
    for (var i = 1; i < coords.length; i++) {
      total += map.distance(coords[i - 1], coords[i]);
      cum.push(total);
    }
  }
  function pointAt(t) {
    if (!coords.length) return null;
    if (coords.length === 1 || total === 0) return coords[0];
    t = Math.max(0, Math.min(1, t));
    var target = t * total, i = 1;
    while (i < cum.length - 1 && cum[i] < target) i++;
    var seg = cum[i] - cum[i - 1] || 1, f = (target - cum[i - 1]) / seg;
    return [coords[i - 1][0] + (coords[i][0] - coords[i - 1][0]) * f, coords[i - 1][1] + (coords[i][1] - coords[i - 1][1]) * f];
  }

  function drawRoute() {
    routeLayer.clearLayers();
    if (!coords.length) return;
    L.polyline(coords, { color: '#ffffff', weight: 10, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(routeLayer);
    L.polyline(coords, { color: BLUE, weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(routeLayer);
    L.circleMarker(coords[0], { radius: 8, color: BLUE, weight: 4, fillColor: '#fff', fillOpacity: 1 }).addTo(routeLayer);
    L.marker(coords[coords.length - 1], { icon: pinIcon, interactive: false }).addTo(routeLayer);
  }

  function fit() {
    var pad = state.padding || { top: 40, bottom: 40 };
    var pts = coords.length ? coords : [];
    if (!pts.length) return;
    map.invalidateSize();
    map.fitBounds(L.latLngBounds(pts), {
      paddingTopLeft: [32, pad.top || 40], paddingBottomRight: [32, pad.bottom || 40], animate: false, maxZoom: 16
    });
  }

  function loadRoute(o, d, key) {
    var id = ++reqId;
    coords = [ll(o), ll(d)]; buildCum(); drawRoute(); fit(); updateVehicle(); updateBuses();   // instant straight line
    var url = ROUTING_URL + '/' + o.lng + ',' + o.lat + ';' + d.lng + ',' + d.lat + '?overview=full&geometries=geojson';
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
    fetch(url, ctl ? { signal: ctl.signal } : undefined).then(function (r) { return r.json(); }).then(function (j) {
      clearTimeout(timer);
      if (id !== reqId || !j.routes || !j.routes[0]) return;
      var g = j.routes[0].geometry.coordinates;
      coords = g.map(function (c) { return [c[1], c[0]]; });
      buildCum(); drawRoute(); fit(); updateVehicle(); updateBuses();
      send({ type: 'route', distanceKm: j.routes[0].distance / 1000, durationMin: j.routes[0].duration / 60 });
    }).catch(function () { clearTimeout(timer); });
  }

  function updateVehicle() {
    var p = state.progress;
    if (p === undefined || p === null || !coords.length) {
      if (vehicle) { map.removeLayer(vehicle); vehicle = null; }
      return;
    }
    var at = pointAt(p);
    if (!vehicle) vehicle = L.marker(at, { icon: busIcon(false), interactive: false, zIndexOffset: 1000 }).addTo(map);
    else vehicle.setLatLng(at);
  }

  function updateBuses() {
    busLayer.clearLayers();
    (state.buses || []).forEach(function (b) {
      var at = pointAt(b.progress);
      if (!at) return;
      var m = L.marker(at, { icon: busIcon(false), zIndexOffset: 900 }).addTo(busLayer);
      var html = '<div style="font:500 13px Inter,system-ui,sans-serif;color:#111;min-width:150px">' +
        '<div style="margin-bottom:6px">&#128205; Currently at ' + b.currentLocation + '</div>' +
        '<div style="margin-bottom:10px">&#128339; ' + b.status + '</div>' +
        '<button id="track-' + b.id + '" style="background:' + BLUE + ';color:#fff;border:0;border-radius:20px;padding:8px 18px;font:600 13px Inter,system-ui,sans-serif">Track</button></div>';
      m.bindPopup(html, { closeButton: false, offset: [0, -14] });
      m.on('popupopen', function () {
        var btn = document.getElementById('track-' + b.id);
        if (btn) btn.onclick = function () { send({ type: 'track', id: b.id }); };
      });
    });
  }

  function setInteractive(on) {
    var fn = on ? 'enable' : 'disable';
    ['dragging', 'touchZoom', 'doubleClickZoom', 'scrollWheelZoom', 'boxZoom'].forEach(function (h) { if (map[h]) map[h][fn](); });
  }

  window.__setState = function (s) {
    if (typeof s === 'string') s = JSON.parse(s);
    var prev = state; state = s || {};
    setInteractive(state.interactive !== false);
    var o = state.origin, d = state.destination;
    if (o && d && o.lat != null && d.lat != null) {
      var key = [o.lat, o.lng, d.lat, d.lng].join(',');
      if (key !== routeKey) { routeKey = key; loadRoute(o, d, key); }
      else if (JSON.stringify(state.padding) !== JSON.stringify(prev.padding)) fit();
    } else if (routeKey) {
      routeKey = ''; reqId++; coords = []; cum = []; total = 0; routeLayer.clearLayers();
      if (o && o.lat != null) map.setView(ll(o), 14, { animate: false });
    } else if (o && o.lat != null && JSON.stringify(o) !== JSON.stringify(prev.origin)) {
      map.setView(ll(o), 14, { animate: false });
    }
    updateVehicle();
    updateBuses();
  };

  window.addEventListener('message', function (e) { if (e.data && e.data.__setState) window.__setState(e.data.__setState); });
  document.addEventListener('message', function (e) { try { var m = JSON.parse(e.data); if (m.__setState) window.__setState(m.__setState); } catch (x) {} });
  window.addEventListener('resize', function () { map.invalidateSize(); });
  send({ type: 'ready' });
})();
`;

export const MAP_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>${LEAFLET_CSS}
html,body,#map{height:100%;width:100%;margin:0;padding:0;background:#eef5fb}
.leaflet-container{font-family:Inter,system-ui,sans-serif}
.leaflet-control-attribution{font-size:9px;background:rgba(255,255,255,.7)!important}
.leaflet-popup-content-wrapper{border-radius:12px}
.leaflet-popup-content{margin:12px 14px}
</style></head>
<body><div id="map"></div>
<script>${LEAFLET_JS}</script>
<script>${SCRIPT}</script>
</body></html>`;
