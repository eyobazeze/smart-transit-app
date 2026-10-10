export const busTrip = {
  mode: 'Bus',
  origin: 'Your location (Bole)',
  destination: '6 Kilo',
  station: 'Meskel Square Bus Station',
  endStation: 'Shola Market',
  distance: '5.1 km',
  duration: '28 mins',
  cost: '10 ETB',
  leaveTime: '12:00 PM',
  arriveTime: '12:28 PM',
  steps: [
    { title: 'Walk to Meskel Square Bus Station', time: '12:00 PM' },
    { title: 'Bus #3 is delayed by 5 min due to traffic', time: '12:05 PM' },
    { title: 'Board Bus #3: Meskel Square → Shola', time: '12:10 PM' },
    { title: 'Arrive at Shola Market', time: '12:28 PM' },
  ],
  tripOptions: ['Leave 12:00 PM', 'Fastest', 'Cheapest', 'Least walking', 'Accessible', 'Least crowded'],
};

export const taxiTrip = {
  mode: 'Taxi',
  origin: 'Your location (Bole)',
  destination: 'Piassa',
  station: 'Bole Pickup Point',
  endStation: 'Piassa',
  distance: '7.2 km',
  duration: '18 mins',
  cost: '150 ETB',
  leaveTime: '12:00 PM',
  arriveTime: '12:18 PM',
  steps: [
    { title: 'Requesting a taxi near Bole', time: '12:00 PM' },
    { title: 'Driver Dawit assigned — Toyota Vitz, 3 min away', time: '12:02 PM' },
    { title: 'Picked up at Bole Pickup Point', time: '12:05 PM' },
    { title: 'Arrive at Piassa', time: '12:18 PM' },
  ],
  tripOptions: ['Leave 12:00 PM', 'Fastest', 'Cheapest', 'Least walking', 'Accessible', 'Shared ride'],
};

export const trainTrip = {
  mode: 'Train',
  origin: 'Your location (Megenagna)',
  destination: 'Ayat',
  station: 'Megenagna Light Rail Station',
  endStation: 'Ayat Station',
  distance: '6.4 km',
  duration: '15 mins',
  cost: '6 ETB',
  leaveTime: '12:00 PM',
  arriveTime: '12:15 PM',
  steps: [
    { title: 'Walk to Megenagna Light Rail Station', time: '12:00 PM' },
    { title: 'Train delayed by 3 min due to signal check', time: '12:04 PM' },
    { title: 'Board train: Megenagna → Ayat', time: '12:07 PM' },
    { title: 'Arrive at Ayat Station', time: '12:15 PM' },
  ],
  tripOptions: ['Leave 12:00 PM', 'Fastest', 'Cheapest', 'Least walking', 'Accessible', 'Least crowded'],
};

export const tripsByMode = {
  Bus: busTrip,
  Taxi: taxiTrip,
  Train: trainTrip,
};

const SPEED_KMH = { Bus: 16, Taxi: 28, Train: 32 };
const PER_KM = { Bus: 2, Taxi: 22, Train: 1.2 };
const MIN_FARE = { Bus: 5, Taxi: 60, Train: 3 };

function km(a, b) {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) * 1.35; // 1.35 = rough road-winding factor
}
function clock(base, addMin) {
  const d = new Date(base.getTime() + addMin * 60000);
  let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

export function getTrip(mode, origin, destination) {
  const base = tripsByMode[mode] || busTrip;
  if (!origin || !destination) return base;
  const m = base.mode;
  const dist = Math.max(0.5, km(origin, destination));
  const walk = m === 'Taxi' ? 3 : 6;
  const wait = m === 'Taxi' ? 2 : m === 'Train' ? 5 : 7;
  const ride = Math.max(4, Math.round((dist / SPEED_KMH[m]) * 60));
  const total = walk + wait + ride;
  const cost = Math.round(Math.max(MIN_FARE[m], dist * PER_KM[m]) / (m === 'Taxi' ? 5 : 1)) * (m === 'Taxi' ? 5 : 1);
  const now = new Date();
  const from = origin.id === 'current' ? 'your location' : origin.name;
  const startName = origin.id === 'current' ? 'Your location' : origin.name;
  const cur = origin.id === 'current';
  const station = m === 'Taxi' ? (cur ? 'Pickup at your location' : `${startName} pickup point`) : m === 'Train' ? (cur ? 'Nearest light rail station' : `${startName} Light Rail Station`) : (cur ? 'Nearest bus station' : `${startName} Bus Station`);
  const endStation = m === 'Taxi' ? destination.name : m === 'Train' ? `${destination.name} Station` : `${destination.name} Bus Stop`;
  const t0 = clock(now, 0), t1 = clock(now, walk), t2 = clock(now, walk + wait), t3 = clock(now, total);
  const steps = m === 'Taxi'
    ? [
        { title: `Requesting a taxi near ${from}`, time: t0 },
        { title: 'Driver Dawit assigned (Toyota Vitz, 3 min away)', time: clock(now, 2) },
        { title: `Picked up at ${station}`, time: t2 },
        { title: `Arrive at ${destination.name}`, time: t3 },
      ]
    : [
        { title: `Walk to ${station}`, time: t0 },
        { title: `Waiting for the ${m.toLowerCase()} (about ${wait} min)`, time: t1 },
        { title: `Board ${m.toLowerCase()}: ${startName} → ${destination.name}`, time: t2 },
        { title: `Arrive at ${endStation}`, time: t3 },
      ];
  return {
    ...base,
    origin: startName, destination: destination.name, station, endStation,
    distance: `${dist.toFixed(1)} km`, duration: `${total} mins`, cost: `${cost} ETB`,
    leaveTime: t0, arriveTime: t3, steps,
    tripOptions: base.tripOptions.map((o) => (o.startsWith('Leave') ? `Leave ${t0}` : o)),
  };
}
