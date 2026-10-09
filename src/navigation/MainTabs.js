import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import LiveMapScreen from '../screens/LiveMapScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  Tracker: 'locate',
  'My Trips': 'briefcase',
  Settings: 'settings-sharp',
};

export default function MainTabs() {
  // On Android (edge-to-edge) the system gesture/nav bar overlaps the app,
  // so the tab bar must add the bottom inset itself instead of using a fixed height.
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary800,
        tabBarInactiveTintColor: colors.grey400,
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11 },
        tabBarStyle: {
          height: 56 + bottom,
          paddingTop: 8,
          paddingBottom: bottom,
          borderTopColor: colors.grey200,
          backgroundColor: colors.white,
        },
        tabBarIcon: ({ color }) => (
          <Ionicons name={ICONS[route.name]} size={22} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tracker" component={LiveMapScreen} />
      <Tab.Screen name="My Trips" component={MyTripsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
