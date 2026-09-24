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

export function getTrip(mode) {
  return tripsByMode[mode] || busTrip;
}
