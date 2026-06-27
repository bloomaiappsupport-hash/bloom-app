import React, { useMemo, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { MainTabParamList } from './types';
import { radius } from '../theme';
import { useColors } from '../hooks/useColors';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { habitsService } from '../services/supabase';
import HomeScreen from '../features/home/HomeScreen';
import HabitsScreen from '../features/habits/HabitsScreen';
import CoachScreen from '../features/coach/CoachScreen';
import InsightsScreen from '../features/insights/InsightsScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import { TabHome, TabHabits, TabCoach, TabInsights, TabProfile } from '../components/navigation/TabIcons';

const Tab = createBottomTabNavigator<MainTabParamList>();
type TabName = 'Home' | 'Habits' | 'Coach' | 'Insights' | 'Profile';

const TAB_ICONS: Record<TabName, React.FC<{ size?: number; color?: string }>> = {
  Home: TabHome,
  Habits: TabHabits,
  Coach: TabCoach,
  Insights: TabInsights,
  Profile: TabProfile,
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const Icon = TAB_ICONS[name as TabName];
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon size={20} color={focused ? colors.primary : colors.textMuted} />
    </View>
  );
}

export default function MainNavigator() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();
  const { setHabits, setTodayCompletions, setStreak, setLoadingData } = useHabitStore();

  const loadData = (userId: string) => {
    setLoadingData(true);
    Promise.all([
      habitsService.getHabits(userId),
      habitsService.getTodayCompletions(userId),
      habitsService.getAllStreaks(userId),
    ]).then(([habitsRes, completionsRes, streaksRes]) => {
      if (habitsRes.data) setHabits(habitsRes.data);
      if (completionsRes.data) setTodayCompletions(completionsRes.data);
      if (streaksRes.data) {
        streaksRes.data.forEach((streak) => setStreak(streak.habit_id, streak));
      }
      setLoadingData(false);
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    loadData(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    const scheduleMidnightReset = (): ReturnType<typeof setTimeout> => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight.getTime() - now.getTime();

      return setTimeout(() => {
        setTodayCompletions([]);
        loadData(userId);
        timer = scheduleMidnightReset();
      }, msUntilMidnight);
    };

    let timer = scheduleMidnightReset();
    return () => clearTimeout(timer);
  }, [user?.id]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Ana Sayfa' }} />
      <Tab.Screen name="Habits" component={HabitsScreen} options={{ tabBarLabel: 'Alışkanlıklar' }} />
      <Tab.Screen name="Coach" component={CoachScreen} options={{ tabBarLabel: 'Koç' }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ tabBarLabel: 'İçgörüler' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: c.surface,
      borderTopColor: c.border,
      borderTopWidth: 1,
      height: Platform.OS === 'ios' ? 84 : 68,
      paddingBottom: Platform.OS === 'ios' ? 20 : 8,
      paddingTop: 8,
    },
    tabLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.2 },
    iconWrap: {
      width: 38, height: 32,
      alignItems: 'center', justifyContent: 'center',
      borderRadius: radius.md,
    },
    iconWrapActive: { backgroundColor: c.primary + '18' },
  });
}
