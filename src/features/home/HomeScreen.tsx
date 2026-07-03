import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, Modal, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { habitsService } from '../../services/supabase';
import { Habit, Streak } from '../../types';
import { GlassCard } from '../../components/common';
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

const MOOD_DATA = [
  { value: 1, labelKey: 'home.moodBad',    mouth: 'M9 14 Q12 11 15 14', color: '#F87171' },
  { value: 2, labelKey: 'home.moodOkay',   mouth: 'M9 13.5 Q12 13.5 15 13.5', color: '#FB923C' },
  { value: 3, labelKey: 'home.moodGood',   mouth: 'M9 13 Q12 15.5 15 13', color: '#FACC15' },
  { value: 4, labelKey: 'home.moodGreat',  mouth: 'M8.5 13 Q12 16.5 15.5 13', color: '#4ADE80' },
  { value: 5, labelKey: 'home.moodAmazing',mouth: 'M8 12.5 Q12 18 16 12.5', color: '#06D6A0' },
];

function MoodFace({ mood, selected, onPress }: {
  mood: typeof MOOD_DATA[0]; selected: boolean; onPress: () => void;
}) {
  const { t } = useTranslation();
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
          {t(mood.labelKey)}
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

// ─── Notification alert system ───────────────────────────────────────────────

const MILESTONES = [3, 7, 14, 21, 30, 50, 100];

type AlertKind = 'at_risk' | 'milestone' | 'all_done';

interface NotifAlert {
  id: string;
  kind: AlertKind;
  title: string;
  message: string;
  color: string;
}

function useNotifAlerts() {
  const { habits, streaks, todayCompletions, isCompletedToday, getTodayProgress } = useHabitStore();
  const colors = useColors();
  const { t } = useTranslation();
  const { completed, total } = getTodayProgress();

  return useMemo<NotifAlert[]>(() => {
    const alerts: NotifAlert[] = [];

    if (total > 0 && completed === total) {
      alerts.push({
        id: 'all_done',
        kind: 'all_done',
        title: t('home.allDoneTitle'),
        message: t('home.allDoneMessage', { count: total }),
        color: colors.secondary,
      });
    }

    habits.forEach((habit) => {
      const streak = streaks[habit.id];
      if (!streak) return;
      const done = isCompletedToday(habit.id);

      if (done && MILESTONES.includes(streak.current_streak)) {
        alerts.push({
          id: `milestone_${habit.id}`,
          kind: 'milestone',
          title: t('home.milestoneStreak', { count: streak.current_streak }),
          message: t('home.milestoneMsg', { title: habit.title }),
          color: colors.gold,
        });
      }

      if (!done && streak.current_streak > 0) {
        const h = new Date().getHours();
        const urgency = h >= 21
          ? { msg: t('home.atRiskNight', { count: streak.current_streak }), color: colors.error }
          : h >= 18
          ? { msg: t('home.atRiskEvening'), color: colors.warning ?? colors.gold }
          : { msg: t('home.atRiskDay'), color: colors.textSecondary };
        alerts.push({
          id: `at_risk_${habit.id}`,
          kind: 'at_risk',
          title: habit.title,
          message: urgency.msg,
          color: urgency.color,
        });
      }
    });

    return alerts;
  }, [habits, streaks, todayCompletions, completed, total, t]);
}

function AlertIcon({ kind, color }: { kind: AlertKind; color: string }) {
  if (kind === 'all_done') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
          stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color + '30'} />
      </Svg>
    );
  }
  if (kind === 'milestone') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M8 4h8v12H8zM10 20h4M12 16v4"
          stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M8.5 14.5s1.5 2 3.5 2 3.5-2 3.5-2M12 3C8.686 3 6 5.686 6 9c0 3.5-2 5-2 5h16s-2-1.5-2-5c0-3.314-2.686-6-6-6zM10.268 21a2 2 0 0 0 3.464 0"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function NotificationCenter({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const { t } = useTranslation();
  const alerts = useNotifAlerts();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      overlayOpacity.setValue(0);
      sheetY.setValue(400);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.spring(sheetY, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 400, duration: 220, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={handleClose}>
      <Animated.View style={[notifStyles.overlayBase, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClose} />
        <Animated.View
          style={[notifStyles.sheet, { backgroundColor: colors.surface, transform: [{ translateY: sheetY }] }]}
        >
          <LinearGradient colors={[colors.surface2, colors.surface]} style={StyleSheet.absoluteFill} />
          <View style={[notifStyles.handle, { backgroundColor: colors.border }]} />
          <View style={notifStyles.header}>
            <Text style={[notifStyles.title, { color: colors.textPrimary }]}>{t('home.notifications')}</Text>
            <TouchableOpacity onPress={handleClose} style={[notifStyles.closeBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]} activeOpacity={0.7}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6 6 18M6 6l12 12" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {alerts.length === 0 ? (
            <View style={notifStyles.emptyState}>
              <BellIcon color={colors.textMuted} />
              <Text style={[notifStyles.emptyTitle, { color: colors.textSecondary }]}>{t('home.noAlerts')}</Text>
              <Text style={[notifStyles.emptyMsg, { color: colors.textMuted }]}>{t('home.alertsHint')}</Text>
            </View>
          ) : (
            <ScrollView style={notifStyles.list} showsVerticalScrollIndicator={false}>
              {alerts.map((alert) => (
                <View key={alert.id} style={[notifStyles.alertRow, { borderColor: alert.color + '25', backgroundColor: alert.color + '08' }]}>
                  <View style={[notifStyles.alertIcon, { backgroundColor: alert.color + '18' }]}>
                    <AlertIcon kind={alert.kind} color={alert.color} />
                  </View>
                  <View style={notifStyles.alertText}>
                    <Text style={[notifStyles.alertTitle, { color: colors.textPrimary }]}>{alert.title}</Text>
                    <Text style={[notifStyles.alertMsg, { color: colors.textSecondary }]}>{alert.message}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const notifStyles = StyleSheet.create({
  overlayBase: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { borderTopLeftRadius: radius['2xl'], borderTopRightRadius: radius['2xl'], paddingHorizontal: spacing.base, paddingBottom: 40, maxHeight: '75%', overflow: 'hidden' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: spacing.md, marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  title: { ...typography.h3, fontWeight: '700' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: spacing['4xl'], gap: spacing.md },
  emptyTitle: { ...typography.bodyMedium, fontWeight: '600' },
  emptyMsg: { ...typography.small, textAlign: 'center' },
  list: { marginBottom: spacing.md },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.base, borderRadius: radius.xl, borderWidth: 1, marginBottom: spacing.sm },
  alertIcon: { width: 44, height: 44, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  alertText: { flex: 1 },
  alertTitle: { ...typography.bodyMedium, fontWeight: '600' },
  alertMsg: { ...typography.small, marginTop: 2 },
});

// ─────────────────────────────────────────────────────────────────────────────

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
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
          <Path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            stroke={habit.reminder_time ? habit.color : colors.border}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            fill={habit.reminder_time ? habit.color + '30' : 'none'}
          />
        </Svg>
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
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const { habits, todayCompletions, isCompletedToday, getTodayProgress, addCompletion, removeCompletion, streaks, setStreak, isLoadingData } = useHabitStore();
  const { completed, total } = getTodayProgress();
  const progress = total > 0 ? completed / total : 0;
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodDismissed, setMoodDismissed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [seenAlertIds, setSeenAlertIds] = useState<Set<string>>(new Set());
  const alerts = useNotifAlerts();
  const unseenCount = alerts.filter((a) => !seenAlertIds.has(a.id)).length;
  const currentHour = new Date().getHours();
  const badgeColor = currentHour >= 21 ? colors.error : colors.gold;

  const openNotifCenter = () => {
    Haptics.selectionAsync();
    setSeenAlertIds(new Set(alerts.map((a) => a.id)));
    setNotifOpen(true);
  };
  const MOOD_KEY = 'mood_answered_date';
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    AsyncStorage.getItem(MOOD_KEY).then((val) => {
      if (val === todayStr) setMoodDismissed(true);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (todayCompletions.some((c) => c.mood != null)) {
      setMoodDismissed(true);
      AsyncStorage.setItem(MOOD_KEY, todayStr).catch(() => {});
    }
  }, [todayCompletions]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('home.greeting_morning') : hour < 17 ? t('home.greeting_afternoon') : hour < 21 ? t('home.greeting_evening') : t('home.greeting_night');
  const firstName = profile?.name?.split(' ')[0] ?? '';

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

    const { data: completion } = await habitsService.completeHabit(habit.id, habit.user_id, (selectedMood ?? undefined) as import('../../types').Mood | undefined, habit.category);
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

  const isPad = Platform.OS === 'ios' && Platform.isPad;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <LinearGradient colors={[colors.gradStart, colors.gradEnd, colors.bg]} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={[isPad && { alignSelf: 'center', width: '100%', maxWidth: 680 }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}, {firstName}</Text>
          <TouchableOpacity
            style={styles.notifBtn}
            activeOpacity={0.7}
            onPress={openNotifCenter}
          >
            <BellIcon color={unseenCount > 0 ? badgeColor : colors.textSecondary} />
            {unseenCount > 0 && (
              <View style={[styles.notifBadge, { backgroundColor: badgeColor }]}>
                <Text style={styles.notifBadgeText}>{unseenCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress Ring */}
        <View style={styles.ringWrapper}>
          <ProgressRing progress={progress} label={t('home.today')} />
          {total > 0 && (
            <Text style={styles.ringSubtext}>{t('home.habitCount', { completed, total })}</Text>
          )}
        </View>

        {/* Stats row */}
        <GlassCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            {[
              { num: completed, lbl: t('home.completed') },
              { num: total - completed, lbl: t('home.remaining') },
              { num: total, lbl: t('home.total') },
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
            <Text style={styles.sectionTitle}>{t('home.moodCheckIn')}</Text>
            <View style={styles.moodRow}>
              {MOOD_DATA.map((m) => (
                <MoodFace key={m.value} mood={m} selected={selectedMood === m.value}
                  onPress={() => {
                    setSelectedMood(m.value);
                    setTimeout(() => {
                      setMoodDismissed(true);
                      AsyncStorage.setItem(MOOD_KEY, todayStr).catch(() => {});
                    }, 1000);
                  }} />
              ))}
            </View>
          </View>
        )}

        {/* Today's habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.todayHabits')}</Text>
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
              <Text style={styles.emptyTitle}>{t('home.noHabitsToday')}</Text>
              <Text style={styles.emptyText}>{t('home.noHabitsHint')}</Text>
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

        <NotificationCenter visible={notifOpen} onClose={() => setNotifOpen(false)} />

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
            <Text style={styles.doneText}>{t('home.completedAll')}</Text>
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
    notifBadge: {
      position: 'absolute', top: -6, right: -6,
      minWidth: 20, height: 20, borderRadius: 10,
      alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 5,
      borderWidth: 2, borderColor: colors.bg,
    },
    notifBadgeText: { color: '#1a1a1a', fontSize: 11, fontWeight: '800' },
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
