import 'react-native-url-polyfill/auto';
import './src/i18n';
import React, { useEffect, useState, useRef } from 'react';
import { LogBox, Linking, Animated, View, Text, StyleSheet } from 'react-native';
import { supabase } from './src/services/supabase/client';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import BloomLogo from './src/components/common/BloomLogo';
import { colors, typography } from './src/theme';

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
  const { isLoading, setSession, setLoading, setProfile, setPlan } = useAuthStore();
  const { setHabits, setTodayCompletions, setStreak, isLoadingData, setLoadingData } = useHabitStore();
  const { loadLanguage } = useLanguageStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [splashReady, setSplashReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  // Splash animation values
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(10)).current;

  // Run entry animation for logo and text
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(textY, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    loadLanguage();
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((url) => { if (url) handleAuthDeepLink(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleAuthDeepLink(url));
    return () => sub.remove();
  }, []);

  // Hide native splash when fonts load, or after 4s max
  useEffect(() => {
    if (fontsLoaded) setSplashReady(true);
  }, [fontsLoaded]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSplashReady(true);
      setLoading(false);
      setLoadingData(false);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (splashReady) SplashScreen.hideAsync().catch(() => { });
  }, [splashReady]);

  // Fade out React Native splash overlay when fonts, session, and data are ready
  const isDataReady = fontsLoaded && !isLoading && !isLoadingData;

  useEffect(() => {
    if (isDataReady) {
      const t = setTimeout(() => {
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }).start(() => setSplashFinished(true));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [isDataReady]);

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
    const sessionTimeout = setTimeout(() => {
      setLoading(false);
      setLoadingData(false);
    }, 2500);

    authService.getSession().then(({ data }) => {
      clearTimeout(sessionTimeout);
      setSession(data.session);
      if (data.session?.user) {
        loadUserData(data.session.user.id);
      } else {
        setLoadingData(false);
      }
      setLoading(false);
    }).catch(() => {
      clearTimeout(sessionTimeout);
      setLoading(false);
      setLoadingData(false);
    });

    const { data: listener } = authService.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        setLoadingData(false);
      }
    });

    return () => {
      clearTimeout(sessionTimeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!splashReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <RootNavigator />

          {!splashFinished && (
            <Animated.View pointerEvents="none" style={[styles.splashContainer, { opacity: splashOpacity }]}>
              <LinearGradient colors={['#0D0622', '#080812', '#0A0A1A']} style={StyleSheet.absoluteFill} />
              
              <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
                <BloomLogo size={88} />
              </Animated.View>

              <Animated.View style={[styles.textBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
                <Text style={styles.appName}>BLOOM</Text>
                <Text style={styles.tagline}>Alışkanlıkların çiçekleniyor</Text>
              </Animated.View>
            </Animated.View>
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#080812',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    zIndex: 99999,
  },
  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    ...typography.display,
    color: colors.textPrimary,
    letterSpacing: 10,
    fontSize: 32,
  },
  tagline: {
    ...typography.small,
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
});

export default App;
