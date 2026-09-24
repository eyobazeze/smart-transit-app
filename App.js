import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MainTabs from './src/navigation/MainTabs';
import TripResultScreen from './src/screens/trip/TripResultScreen';
import TripDetailScreen from './src/screens/trip/TripDetailScreen';
import TripStartScreen from './src/screens/trip/TripStartScreen';
import TripStationScreen from './src/screens/trip/TripStationScreen';
import TripTrackScreen from './src/screens/trip/TripTrackScreen';
import TripEndScreen from './src/screens/trip/TripEndScreen';
import LiveMapResultScreen from './src/screens/LiveMapResultScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen name="TripResult" component={TripResultScreen} />
        <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        <Stack.Screen name="TripStart" component={TripStartScreen} />
        <Stack.Screen name="TripStation" component={TripStationScreen} />
        <Stack.Screen name="TripTrack" component={TripTrackScreen} />
        <Stack.Screen name="TripEnd" component={TripEndScreen} />
        <Stack.Screen name="LiveMapResult" component={LiveMapResultScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
