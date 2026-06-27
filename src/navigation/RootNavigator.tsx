import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from './types';
import SplashScreen from '../features/auth/SplashScreen';
import OnboardingScreen from '../features/auth/OnboardingScreen';
import AssessmentScreen from '../features/auth/AssessmentScreen';
import BloomCreationScreen from '../features/auth/BloomCreationScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import PaywallScreen from '../features/paywall/PaywallScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { session, isDemoMode, isLoading } = useAuthStore();

  if (isLoading) return null;

  const isAuthenticated = !!(session || isDemoMode);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Assessment" component={AssessmentScreen} />
            <Stack.Screen name="BloomCreation" component={BloomCreationScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
