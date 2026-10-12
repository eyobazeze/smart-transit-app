# Smart Transit

A React Native (Expo) app for planning and tracking public transport trips in Addis Ababa by bus, taxi and light rail.

## Features

- **Trip planning** – pick a start and destination (or use your GPS location), choose Bus, Taxi or Train, and compare fare, duration and distance.
- **Place search** – type-ahead suggestions across Addis Ababa places, recents, swap and clear.
- **Real map** – OpenStreetMap tiles with road routing and live vehicle markers.
- **Guided trip** – walk to the stop, wait, board, ride and arrive, with a live countdown, progress and landmarks along the way.
- **Live tracker** – see vehicles on a route and start tracking one.
- **Saved routes and trip history** – bookmark routes, and every completed ride is stored on the device and repeatable in one tap.
- **Account screens** – splash, sign in, sign up, profile, notifications and settings.

## Run it

Requires [Node.js](https://nodejs.org) (LTS) and the **Expo Go** app on your phone.

```bash
npm install
npx expo start -c
```

Scan the QR code with Expo Go. The project targets **Expo SDK 57**, so use an Expo Go build that supports it.

## Tech stack

- React Native 0.86 and Expo SDK 57
- React Navigation 6 (native stack and bottom tabs)
- Leaflet in a `react-native-webview` for the map, with OpenStreetMap tiles and the OSRM routing service
- `expo-location` for GPS, `@react-native-async-storage/async-storage` for saved routes and history
- `expo-linear-gradient`, `expo-haptics`, Inter via `@expo-google-fonts/inter`

## Project structure

```
App.js                     App entry, fonts, navigation stack
src/
  components/              Shared UI (ui.js), map, planner, auth layout
  data/                    Places, trip estimates, GPS, saved trips, session
  navigation/              Tab bar and tab navigator
  screens/                 App screens (trip/ holds the planning flow)
  theme/                   Colors, spacing and typography tokens
```

## How the numbers are produced

- **Fare, duration and distance** are estimates: straight-line distance between the two places, scaled by a road factor, then divided by a typical speed for the chosen mode.
- **Vehicles** on the map move on a timer. There is no live fleet data yet.
- **Location** uses your device GPS. Outside Addis Ababa, or if permission is denied, it falls back to Meskel Square.
- **Accounts** are local only. There is no backend yet, so signing in just opens the app.

## Map data and services

Map tiles are © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Routing uses the public OSRM demo server, and both servers are fine for development and demos but not for heavy production traffic. For a release, switch to your own tile and routing provider by editing the constants at the top of `src/components/mapHtml.js`.

## Roadmap

- Real transit data (GTFS) for routes and timetables
- Road-based distance and duration from the routing response
- Backend accounts and cloud-synced history
- Dark mode
