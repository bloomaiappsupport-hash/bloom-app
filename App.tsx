import 'react-native-url-polyfill/auto';
import './src/i18n';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';

LogBox.ignoreLogs([
  'InteractionManager',
  'Overriding previous layout animation',
  'Non-serializable values were found in the navigation state',
  'expo-notifications',
  'new NativeEventEmitter',
  'Warning: Each child in a list',
  'fontFamily',
  'RNIap',
  'react-native-iap',
  'IAPManagerError',
  'getProducts',
  'finishTransaction',
  'Cannot read property',
  'Possible Unhandled Promise Rejection',
]);
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import RootNavigator from './src/navigation/RootNavigator';
import { authService, profileService, habitsService } from './src/services/supabase';
import { useAuthStore } from './src/stores/authStore';
import { useHabitStore } from './src/stores/habitStore';
import { useLanguageStore } from './src/stores/languageStore';

// SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
});

export default function App() {
  const { setSession, setLoading, setProfile, setPlan } = useAuthStore();
  const { setHabits, setTodayCompletions, setStreak, setLoadingData } = useHabitStore();
  const { loadLanguage } = useLanguageStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    loadLanguage();
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const loadUserData = async (userId: string) => {
    setLoadingData(true);
    const [profileRes, subscriptionRes, habitsRes, completionsRes, streaksRes, localSku] = await Promise.all([
      profileService.getProfile(userId),
      profileService.getSubscription(userId),
      habitsService.getHabits(userId),
      habitsService.getTodayCompletions(userId),
      habitsService.getAllStreaks(userId),
      SecureStore.getItemAsync('bloom_active_plan_sku'),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    // Use Supabase subscription, fall back to SecureStore if Supabase hasn't updated yet
    if (subscriptionRes.data?.plan) {
      setPlan(subscriptionRes.data.plan);
    } else if (localSku) {
      setPlan('premium');
    }
    if (habitsRes.data) setHabits(habitsRes.data);
    if (completionsRes.data) setTodayCompletions(completionsRes.data);
    if (streaksRes.data) {
      streaksRes.data.forEach((s) => setStreak(s.habit_id, s));
    }
    setLoadingData(false);
  };

  useEffect(() => {
    authService.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadUserData(data.session.user.id);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: listener } = authService.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) await loadUserData(session.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
