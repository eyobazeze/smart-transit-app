# Smart Transit App

React Native (Expo) build of your Smart Public Transport App Figma design —
all 4 bottom tabs, the full Bus trip flow, and Live Map tracking.

## Run it — 100% free

You need [Node.js](https://nodejs.org) installed, and the **Expo Go** app
(free, on iOS App Store / Google Play) on your phone.

```bash
cd smart-transit-app
npm install
npx expo start
```

Scan the QR code with your phone (Camera app on iPhone, Expo Go app on
Android). Any code change hot-reloads instantly.

## What's built

**Auth & foundation**
| Screen | File | Figma node |
|---|---|---|
| Splash | `src/screens/SplashScreen.js` | 0:3 |
| Login | `src/screens/LoginScreen.js` | 110:2 |
| Sign Up | `src/screens/SignUpScreen.js` | 110:3 |

**Bottom tabs**
| Tab | File | Figma node |
|---|---|---|
| Home | `src/screens/HomeScreen.js` | 5:2309 |
| Tracker (Live Map search) | `src/screens/LiveMapScreen.js` | 24 |
| My Trips (Saved/Recent) | `src/screens/MyTripsScreen.js` | 32–33 |
| Settings | `src/screens/SettingsScreen.js` | 34 |

**Bus trip flow** (Home → "Plan My Trip")
| Screen | File | Figma node |
|---|---|---|
| Trip Result | `src/screens/trip/TripResultScreen.js` | 41:2 |
| Trip Detail | `src/screens/trip/TripDetailScreen.js` | 48:376 |
| Trip Start | `src/screens/trip/TripStartScreen.js` | 61:2730 |
| Trip Station | `src/screens/trip/TripStationScreen.js` | 93:531 |
| Trip Track | `src/screens/trip/TripTrackScreen.js` | 93:723 |
| Trip End | `src/screens/trip/TripEndScreen.js` | 93:971 |

**Live Map** (Tracker tab → "Find Transport to track")
| Screen | File | Figma node |
|---|---|---|
| Live Map Result | `src/screens/LiveMapResultScreen.js` | 25–31 (merged) |

**Other**
| Screen | File | Figma node | Reached from |
|---|---|---|---|
| Notifications | `src/screens/NotificationScreen.js` | 05 | Home bell icon |
| Profile | `src/screens/ProfileScreen.js` | 35 | Home avatar / Settings → Edit Profile |

All 35 Figma screens are now represented — either as their own screen or
merged into an equivalent flow (see "Known gaps" below for what that
means in a couple of cases).

## About the map

`src/components/RouteMap.js` and `src/components/LiveRouteMap.js` draw a
stylized street grid + route line with `react-native-svg` — completely
free, no API key, works instantly in Expo Go. They are **not** a real
basemap. When you're ready for real streets:
1. `npm install react-native-maps`
2. Get a free-tier Google Maps API key (Android) — iOS uses Apple Maps, no key needed
3. Swap `<RouteMap />` / `<LiveRouteMap />` for a `<MapView>` with
   `<Marker>`/`<Polyline>` using the same coordinates
This is a bigger step (native config, `expo prebuild` or EAS Build) — happy
to do it with you when you're ready.

Design tokens (colors, type scale) are centralized in `src/theme/colors.js`,
pulled directly from your Figma file's variables (primary-800 #2a86ff, etc.)
so every screen stays visually consistent.

## Known gaps to close

1. **Illustrations**: bus/people illustrations on Login and Sign Up are
   placeholder icons — Figma's asset CDN wasn't reachable from this build
   sandbox. Export them from Figma (2x PNG) and drop into `assets/images/`,
   then swap the `<Ionicons ... />` for `<Image source={require(...)} />`.
2. **Fonts**: styles reference Inter — add `expo-font` +
   `@expo-google-fonts/inter` to load the real typeface.
3. **Auth**: Sign In / Sign Up / Logout navigate but don't authenticate —
   wire up a real backend when ready.
4. ~~Taxi / Train modes~~ — **done.** All three modes (Bus, Taxi, Train)
   have their own trip data in `src/data/tripData.js` (`getTrip(mode)`),
   and `mode` is threaded through every screen in the trip flow (Result →
   Detail → Start → Station → Track → End), plus from Home and My Trips'
   trip lists. Switching mode tabs on Result/Detail now shows real
   mode-specific stations, timing, cost, and step-by-step text.
5. **Live tracking**: the bus marker on the Track screen moves on a timer
   for demo purposes, not real GPS/GTFS data.
6. **Live Map "Locked" variants (Figma nodes 29–31)**: these looked
   visually identical to the unlocked detail screens (26–28), so I merged
   them into one `LiveMapResultScreen` with 3 tappable buses instead of 6
   near-duplicate screens. If "Locked" was meant as a gated/premium state
   (blur, paywall), let me know and I'll split that out.
7. **Settings/Profile toggles and rows**: functional locally (state
   updates, switches flip) but most don't yet connect to anything —
   they're the right shape to wire up once you have a backend.
8. **My Trips tap-through**: both Saved Routes and Recent Trips rows open
   the Bus trip flow for now, same as Home's Recent Trips.

## Suggested next steps

- Wire up a real map (see above) once the static one has served its purpose in testing
- Connect a backend for auth, saved routes, and live bus positions (GTFS or a custom API)
