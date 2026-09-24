# Smart Transit App

A React Native (Expo) app for planning and tracking public transport trips
in Addis Ababa — across Bus, Taxi, and Train.

## Features

- **Trip planning** across three transport modes, each with its own
  stations, timing, cost, and step-by-step journey details
- **Live trip flow** — from route selection through walking directions,
  boarding, live tracking, and arrival
- **Live Map** — tap any nearby vehicle to see its status and track it
- **Saved routes & trip history**
- **Account, notifications, and settings**

## Run it

Requires [Node.js](https://nodejs.org) and the free **Expo Go** app
(iOS App Store / Google Play).

```bash
npm install
npx expo start
```

Scan the QR code with your phone to open the app live. Any code change
hot-reloads instantly.

## Tech stack

- React Native + Expo
- React Navigation (stack + bottom tabs)
- `react-native-svg` for route/map visualization (no external map API key
  required — see "Maps" below)

## Project structure

```
src/
  screens/          Top-level screens (Home, Login, Settings, etc.)
  screens/trip/      Trip planning & tracking flow
  components/        Shared UI (route map, input fields, trip cards)
  navigation/        Tab and stack navigators
  data/              Trip data by transport mode
  theme/             Colors and typography
```

## Maps

Route visuals are drawn with `react-native-svg` rather than a live map
provider, so the app runs immediately with no API keys or paid services.
To swap in a real basemap:
1. `npm install react-native-maps`
2. Add a Google Maps API key for Android (iOS uses Apple Maps, no key needed)
3. Replace `RouteMap` / `LiveRouteMap` with a `MapView` using the same
   coordinates

## Known limitations

- Auth (Sign In / Sign Up / Logout) doesn't yet connect to a backend
- Bus position tracking is simulated, not live GPS/GTFS data
- Some Settings/Profile toggles aren't yet wired to persistence

## License

MIT
