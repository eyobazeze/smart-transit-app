import React, { useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplash from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MainTabs from './src/navigation/MainTabs';
import TripResultScreen from './src/screens/trip/TripResultScreen';
import TripDetailScreen from './src/screens/trip/TripDetailScreen';
import TripLiveScreen from './src/screens/trip/TripLiveScreen';
import LiveMapResultScreen from './src/screens/LiveMapResultScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

// Keep the native splash up until Inter has loaded, so text never flashes
// in the system font.
ExpoSplash.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.white },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayoutRoot = useCallback(() => {
    if (fontsLoaded || fontError) {
      ExpoSplash.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRoot}>
        <StatusBar style="dark" />
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            {/* Named "Main" (not "Home") so it doesn't clash with the Home tab inside it */}
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="TripResult" component={TripResultScreen} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} />
            <Stack.Screen name="TripLive" component={TripLiveScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="LiveMapResult" component={LiveMapResultScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
