import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary800,
        tabBarInactiveTintColor: colors.grey400,
        tabBarStyle: { height: 75, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => (
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
