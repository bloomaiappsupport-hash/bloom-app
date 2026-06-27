import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { habitsService } from '../../services/supabase';
import { Streak } from '../../types';
import { GlassCard } from '../../components/common';
import { Habit } from '../../types';
import { HabitIcon } from '../../components/habits/HabitIcons';

const { width } = Dimensions.get('window');
const RING_SIZE = 180;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRCUM = 2 * Math.PI * R;

function ProgressRing({ progress, label }: { progress: number; label: string }) {
  const colors = useColors();
  const animPct = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animPct, { toValue: progress, duration: 900, useNativeDriver: false }).start();
  }, [progress]);

  const orbColor = progress > 0.8 ? colors.gold : progress > 0.5 ? colors.secondary : colors.primary;
  const offset = CIRCUM * (1 - progress);

  return (
    <View style={styles.ringContainer}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Defs>
          <SvgGrad id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={orbColor} stopOpacity="1" />
            <Stop offset="1" stopColor={orbColor + 'AA'} stopOpacity="1" />
          </SvgGrad>
        </Defs>
        <Circle
          cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R}
          fill="none" stroke={colors.border} strokeWidth={STROKE}
        />
        <Circle
          cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R}
          fill="none" stroke="url(#ringGrad)" strokeWidth={STROKE}
          strokeDasharray={CIRCUM} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={[styles.ringPct, { color: orbColor }]}>{Math.round(progress * 100)}%</Text>
        <Text style={[styles.ringLabel, { color: colors.textMuted }]}>{label}</Text>
      </View>
    </View>
  );
}

const MOODS = [
  { value: 1, label: 'Kötü',   mouth: 'M9 14 Q12 11 15 14', color: '#F87171' },
  { value: 2, label: 'Orta',   mouth: 'M9 13.5 Q12 13.5 15 13.5', color: '#FB923C' },
  { value: 3, label: 'İyi',    mouth: 'M9 13 Q12 15.5 15 13', color: '#FACC15' },
  { value: 4, label: 'Güzel',  mouth: 'M8.5 13 Q12 16.5 15.5 13', color: '#4ADE80' },
  { value: 5, label: 'Harika', mouth: 'M8 12.5 Q12 18 16 12.5', color: '#06D6A0' },
];

function MoodFace({ mood, selected, onPress }: {
  mood: typeof MOODS[0]; selected: boolean; onPress: () => void;
}) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.18, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity onPress={press} activeOpacity={0.8}>
      <Animated.View style={[styles.moodBtn, { transform: [{ scale }] }]}>
        <Svg width={36} height={36} viewBox="0 0 24 24">
          <Circle
            cx="12" cy="12" r="10"
            fill={selected ? mood.color + '30' : 'transparent'}
            stroke={selected ? mood.color : colors.textMuted}
            strokeWidth={selected ? 2 : 1.5}
          />
          <Circle cx="9" cy="10" r="1.2" fill={selected ? mood.color : colors.textMuted} />
          <Circle cx="15" cy="10" r="1.2" fill={selected ? mood.color : colors.textMuted} />
          <Path
            d={mood.mouth}
            stroke={selected ? mood.color : colors.textMuted}
            strokeWidth="1.6" fill="none" strokeLinecap="round"
          />
        </Svg>
        <Text style={[styles.moodLabel, { color: selected ? mood.color : colors.textMuted }]}>
          {mood.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function HabitRow({ habit, isCompleted, onComplete }: {
  habit: Habit; isCompleted: boolean; onComplete: () => void;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 70, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 180, friction: 8, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}
        style={[styles.habitRow, isCompleted && styles.habitRowDone]}>
        {isCompleted && (
          <LinearGradient
            colors={[habit.color + '20', habit.color + '06']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={[styles.habitIcon, { backgroundColor: habit.color + '20', borderColor: habit.color + '40' }]}>
          <HabitIcon iconKey={habit.icon} size={22} color={habit.color} />
        </View>
        <View style={styles.habitInfo}>
          <Text style={[styles.habitTitle, isCompleted && styles.habitTitleDone]}>{habit.title}</Text>
          <Text style={styles.habitCategory}>{habit.category}</Text>
        </View>
        <View style={[styles.checkCircle, isCompleted && { backgroundColor: habit.color, borderColor: habit.color }]}>
          {isCompleted && (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M5 13l5 5L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { profile } = useAuthStore();
  const { habits, todayCompletions, isCompletedToday, getTodayProgress, addCompletion, removeCompletion, streaks, setStreak, isLoadingData } = useHabitStore();
  const { completed, total } = getTodayProgress();
  const progress = total > 0 ? completed / total : 0;
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodDismissed, setMoodDismissed] = useState(false);
  const MOOD_KEY = 'mood_answered_date';
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    AsyncStorage.getItem(MOOD_KEY).then((val) => {
      if (val === todayStr) setMoodDismissed(true);
    });
  }, []);

  useEffect(() => {
    if (todayCompletions.some((c) => c.mood != null)) {
      setMoodDismissed(true);
      AsyncStorage.setItem(MOOD_KEY, todayStr);
    }
  }, [todayCompletions]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Günaydın' : hour < 17 ? 'İyi öğlenler' : hour < 21 ? 'İyi akşamlar' : 'İyi geceler';
  const firstName = profile?.name?.split(' ')[0] ?? 'Sana';

  const handleComplete = async (habit: Habit) => {
    if (isCompletedToday(habit.id)) {
      // Undo
      await habitsService.deleteCompletion(habit.id, habit.user_id);
      removeCompletion(habit.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const existing = streaks[habit.id];
      if (existing) {
        const prevStreak = Math.max(0, (existing.current_streak ?? 1) - 1);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const reverted: Streak = {
          ...existing,
          current_streak: prevStreak,
          last_completed_at: prevStreak > 0 ? yesterday.toISOString() : null,
        };
        setStreak(habit.id, reverted);
        habitsService.upsertStreak(reverted);
      }
      return;
    }

    const { data: completion } = await habitsService.completeHabit(habit.id, habit.user_id, (selectedMood ?? undefined) as import('../../types').Mood | undefined);
    if (completion) addCompletion(completion);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const existing = streaks[habit.id];
    const now = new Date();
    let newCurrent = 1;

    if (existing?.last_completed_at) {
      const last = new Date(existing.last_completed_at);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      newCurrent = last.toDateString() === yesterday.toDateString()
        ? (existing.current_streak ?? 0) + 1 : 1;
    }

    const updatedStreak: Streak = {
      habit_id: habit.id,
      user_id: habit.user_id,
      current_streak: newCurrent,
      longest_streak: Math.max(newCurrent, existing?.longest_streak ?? 0),
      last_completed_at: now.toISOString(),
      shields_remaining: existing?.shields_remaining ?? 0,
    };
    setStreak(habit.id, updatedStreak);
    habitsService.upsertStreak(updatedStreak).then(({ error }) => {
      if (error) console.error('[Streak upsert error]', error.message);
    });
  };

  const todayHabits = habits.filter((h) => {
    if (h.frequency_type === 'daily') return true;
    const today = new Date().getDay();
    return h.frequency_days.includes(today);
  });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <LinearGradient colors={[colors.gradStart, colors.gradEnd, colors.bg]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}, {firstName}</Text>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <BellIcon color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Progress Ring */}
        <View style={styles.ringWrapper}>
          <ProgressRing progress={progress} label="Bugün" />
          {total > 0 && (
            <Text style={styles.ringSubtext}>{completed} / {total} alışkanlık</Text>
          )}
        </View>

        {/* Stats row */}
        <GlassCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            {[
              { num: completed, lbl: 'Tamamlandı' },
              { num: total - completed, lbl: 'Kalan' },
              { num: total, lbl: 'Toplam' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{s.num}</Text>
                  <Text style={styles.statLbl}>{s.lbl}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </GlassCard>

        {/* Mood */}
        {!moodDismissed && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bugün nasıl hissediyorsun?</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m) => (
                <MoodFace key={m.value} mood={m} selected={selectedMood === m.value}
                  onPress={() => {
                    setSelectedMood(m.value);
                    setTimeout(() => {
                      setMoodDismissed(true);
                      AsyncStorage.setItem(MOOD_KEY, todayStr);
                    }, 1000);
                  }} />
              ))}
            </View>
          </View>
        )}

        {/* Today's habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bugünkü Alışkanlıklar</Text>
          {isLoadingData ? (
            <View style={styles.skeletonList}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.skeletonRow}>
                  <View style={styles.skeletonIcon} />
                  <View style={styles.skeletonText}>
                    <View style={[styles.skeletonLine, { width: '60%' }]} />
                    <View style={[styles.skeletonLine, { width: '35%', marginTop: 6 }]} />
                  </View>
                </View>
              ))}
            </View>
          ) : todayHabits.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="1.5" opacity={0.6} />
                <Path d="M12 8v5M12 16v.5" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
              </Svg>
              <Text style={styles.emptyTitle}>Henüz alışkanlık yok</Text>
              <Text style={styles.emptyText}>Alışkanlıklar sekmesinden ekleyebilirsin</Text>
            </GlassCard>
          ) : (
            <View style={styles.habitList}>
              {todayHabits.map((h) => (
                <HabitRow key={h.id} habit={h}
                  isCompleted={isCompletedToday(h.id)}
                  onComplete={() => handleComplete(h)} />
              ))}
            </View>
          )}
        </View>

        {total > 0 && completed === total && (
          <View style={styles.doneBanner}>
            <LinearGradient
              colors={[colors.secondary + '30', colors.secondary + '10']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
                stroke={colors.secondary} strokeWidth="1.8" strokeLinejoin="round" fill={colors.secondary + '30'} />
            </Svg>
            <Text style={styles.doneText}>Hepsini tamamladın! Muhteşem.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ringContainer: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  ringPct: { ...typography.h1, fontSize: 38, fontWeight: '700' },
  ringLabel: { ...typography.caption, letterSpacing: 1 },
  moodBtn: { alignItems: 'center', gap: 6, padding: 4 },
  moodLabel: { ...typography.caption, fontSize: 10 },
});

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: spacing.base, paddingBottom: spacing['4xl'] },
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingTop: spacing.xl, marginBottom: spacing.xl,
    },
    greeting: { ...typography.h3, color: colors.textPrimary },
    notifBtn: {
      width: 40, height: 40, backgroundColor: colors.surface,
      borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    ringWrapper: { alignItems: 'center', marginBottom: spacing.xl },
    ringSubtext: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
    statsCard: { marginBottom: spacing.xl },
    statsRow: { flexDirection: 'row' },
    statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.base, gap: 4 },
    statNum: { ...typography.h2, color: colors.textPrimary },
    statLbl: { ...typography.caption, color: colors.textSecondary },
    statDivider: { width: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
    section: { marginBottom: spacing.xl },
    sectionTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: spacing.md, fontWeight: '700' },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
    habitList: { gap: spacing.sm },
    habitRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: radius.xl,
      borderWidth: 1, borderColor: colors.border,
      padding: spacing.base, gap: spacing.md, overflow: 'hidden',
    },
    habitRowDone: { borderColor: colors.border },
    habitIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    habitInfo: { flex: 1 },
    habitTitle: { ...typography.bodyMedium, color: colors.textPrimary },
    habitTitleDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
    habitCategory: { ...typography.caption, color: colors.textMuted, marginTop: 2, textTransform: 'capitalize' },
    checkCircle: {
      width: 30, height: 30, borderRadius: 15,
      borderWidth: 2, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    emptyCard: { alignItems: 'center', padding: spacing['2xl'], gap: spacing.md },
    emptyTitle: { ...typography.bodyMedium, color: colors.textSecondary },
    emptyText: { ...typography.small, color: colors.textMuted, textAlign: 'center' },
    doneBanner: {
      alignItems: 'center', padding: spacing.xl, gap: spacing.sm,
      overflow: 'hidden', borderRadius: radius.xl,
      borderWidth: 1, borderColor: colors.secondary + '40',
    },
    doneText: { ...typography.bodyMedium, color: colors.secondary, textAlign: 'center' },
    skeletonList: { gap: spacing.sm },
    skeletonRow: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      backgroundColor: colors.surface, borderRadius: radius.xl,
      borderWidth: 1, borderColor: colors.border, padding: spacing.base,
    },
    skeletonIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.border },
    skeletonText: { flex: 1 },
    skeletonLine: { height: 12, borderRadius: 6, backgroundColor: colors.border },
  });
}
