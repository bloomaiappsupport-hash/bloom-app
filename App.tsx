import 'react-native-url-polyfill/auto';
import './src/i18n';
import React, { useEffect, useState } from 'react';
import { LogBox, Linking } from 'react-native';
import { supabase } from './src/services/supabase/client';
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

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
});

const handleAuthDeepLink = async (url: string) => {
  if (!url.includes('auth/callback')) return;

  // PKCE flow: bloom://auth/callback?code=...
  const codeMatch = url.match(/[?&]code=([^&]+)/);
  if (codeMatch) {
    await supabase.auth.exchangeCodeForSession(decodeURIComponent(codeMatch[1]));
    return;
  }

  // Implicit flow: bloom://auth/callback#access_token=...&refresh_token=...
  const hash = url.split('#')[1];
  if (hash) {
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    }
  }
};

function App() {
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
  const [splashReady, setSplashReady] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((url) => { if (url) handleAuthDeepLink(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleAuthDeepLink(url));
    return () => sub.remove();
  }, []);

  // Hide splash when fonts load, or after 4s max to avoid infinite stuck screen
  useEffect(() => {
    if (fontsLoaded) setSplashReady(true);
  }, [fontsLoaded]);

  useEffect(() => {
    const t = setTimeout(() => setSplashReady(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (splashReady) SplashScreen.hideAsync().catch(() => { });
  }, [splashReady]);

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
    // Tek doğru kaynak = subscriptions tablosu (süre kontrolüyle).
    // Yerel SKU (localSku) yalnızca tablo okunamadığında (ağ hatası) veya 
    // yerel satın alım mevcut olup veritabanı eşleşmediğinde (sandbox testlerinde) premium'u korumak için yedektir.
    const sub = subscriptionRes.data;
    const dbActive =
      sub?.plan === 'premium' &&
      (!sub.expires_at || new Date(sub.expires_at) > new Date());
    const active = dbActive || !!localSku;
    setPlan(active ? 'premium' : 'free');
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

  if (!splashReady) return null;

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

export default App;
