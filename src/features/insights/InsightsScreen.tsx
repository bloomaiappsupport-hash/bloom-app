import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { useHabitStore } from '../../stores/habitStore';
import { useAuthStore } from '../../stores/authStore';
import { GlassCard, ScreenContainer } from '../../components/common';
import { supabase } from '../../services/supabase/client';
import { habitsService } from '../../services/supabase/habits';
import { HabitCategory } from '../../types';

const { width } = Dimensions.get('window');

const CATEGORY_LABELS: Record<HabitCategory, string> = {
  fitness: 'Fitness',
  mind: 'Zihin',
  sleep: 'Uyku',
  nutrition: 'Beslenme',
  social: 'Sosyal',
  work: 'Kariyer',
  custom: 'Özel',
};

const RADAR_CATEGORIES: HabitCategory[] = ['fitness', 'mind', 'sleep', 'nutrition', 'social', 'work'];

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const colors = useColors();
  const size = width - spacing.base * 4;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;
  const n = RADAR_CATEGORIES.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const outerPoints = RADAR_CATEGORIES.map((_, i) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  }));

  const dataPoints = RADAR_CATEGORIES.map((cat, i) => {
    const val = (scores[cat] ?? 0) / 100;
    return {
      x: cx + r * val * Math.cos(angle(i)),
      y: cy + r * val * Math.sin(angle(i)),
    };
  });

  const toPolyPoints = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x},${p.y}`).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <Svg width={size} height={size}>
      {gridLevels.map((level) => {
        const pts = RADAR_CATEGORIES.map((_, i) => ({
          x: cx + r * level * Math.cos(angle(i)),
          y: cy + r * level * Math.sin(angle(i)),
        }));
        return (
          <Polygon key={level} points={toPolyPoints(pts)} fill="none" stroke={colors.border} strokeWidth="1" />
        );
      })}
      {outerPoints.map((pt, i) => (
        <Line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke={colors.border} strokeWidth="1" />
      ))}
      <Polygon points={toPolyPoints(dataPoints)} fill={colors.primary + '40'} stroke={colors.primary} strokeWidth="2" />
      {dataPoints.map((pt, i) => (
        <Circle key={i} cx={pt.x} cy={pt.y} r={4} fill={colors.primaryGlow} />
      ))}
      {outerPoints.map((pt, i) => {
        const cat = RADAR_CATEGORIES[i];
        const lx = cx + (r + 24) * Math.cos(angle(i));
        const ly = cy + (r + 24) * Math.sin(angle(i));
        return (
          <SvgText key={i} x={lx} y={ly + 4} textAnchor="middle" fill={colors.textSecondary} fontSize="11" fontWeight="600">
            {CATEGORY_LABELS[cat]}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <GlassCard style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </GlassCard>
  );
}

function WeekHeatmap({ countsByDate }: { countsByDate: Record<string, number> }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    const isToday = i === 6;
    return {
      label: DAYS_TR[d.getDay()],
      count: countsByDate[dateKey] ?? 0,
      isToday,
    };
  });

  const maxCount = Math.max(...week.map((d) => d.count), 1);

  return (
    <View style={styles.heatmapRow}>
      {week.map((day, i) => {
        const intensity = day.count / maxCount;
        return (
          <View key={i} style={styles.heatmapCell}>
            <View style={[
              styles.heatmapBar,
              {
                height: 4 + intensity * 36,
                backgroundColor: day.isToday
                  ? colors.primary
                  : `rgba(124, 58, 237, ${0.15 + intensity * 0.7})`,
              },
            ]} />
            <Text style={[styles.heatmapLabel, day.isToday && { color: colors.primary }]}>{day.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function InsightsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { habits, streaks, todayCompletions } = useHabitStore();

  const categoryColors = useMemo((): Record<HabitCategory, string> => ({
    fitness: colors.fitness,
    mind: colors.mind,
    sleep: colors.sleep,
    nutrition: colors.nutrition,
    social: colors.social,
    work: colors.work,
    custom: colors.primary,
  }), [colors]);

  const categoryScores = useMemo(() => {
    const scores: Record<string, number> = {};
    RADAR_CATEGORIES.forEach((cat) => {
      const catHabits = habits.filter((h) => h.category === cat);
      if (catHabits.length === 0) { scores[cat] = 0; return; }
      const avgStreak = catHabits.reduce((sum, h) => sum + (streaks[h.id]?.current_streak ?? 0), 0) / catHabits.length;
      scores[cat] = Math.min(100, avgStreak * 10);
    });
    return scores;
  }, [habits, streaks]);

  const { user } = useAuthStore();
  const [countsByDate, setCountsByDate] = useState<Record<string, number>>({});
  const [longestStreakDB, setLongestStreakDB] = useState(0);

  const longestStreakMem = Object.values(streaks).reduce((max, s) => {
    const val = Number(s.longest_streak);
    return Math.max(max, isNaN(val) ? 0 : val);
  }, 0);
  const longestStreak = Math.max(longestStreakMem, longestStreakDB);
  const completionRate = habits.length > 0 ? Math.round((todayCompletions.length / habits.length) * 100) : 0;

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    // Haftalık tamamlamalar
    habitsService.getCompletionHistory(userId, 7).then(({ data }) => {
      if (!data) return;
      const map: Record<string, number> = {};
      data.forEach((c) => {
        const day = c.completed_at.split('T')[0];
        map[day] = (map[day] ?? 0) + 1;
      });
      setCountsByDate(map);
    });

    // En uzun seri — doğrudan Supabase'den
    habitsService.getAllStreaks(userId).then(({ data, error }) => {
      if (error) { console.error('[getAllStreaks error]', error.message); return; }
      if (!data || data.length === 0) { console.log('[getAllStreaks] no rows'); return; }
      console.log('[getAllStreaks]', JSON.stringify(data));
      const max = data.reduce((m, s) => {
        const val = Number(s.longest_streak);
        return Math.max(m, isNaN(val) ? 0 : val);
      }, 0);
      setLongestStreakDB(max);
    });
  }, [user?.id]);

  const [weeklyInsight, setWeeklyInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState('');

  const fetchWeeklyInsight = async () => {
    if (loadingInsight || weeklyInsight) return;
    setLoadingInsight(true);
    setInsightError('');
    const { data, error } = await supabase.functions.invoke('weekly-insights', {});
    if (error) {
      setInsightError(error.message);
    } else if (data?.insight) {
      setWeeklyInsight(data.insight);
    } else if (data?.error) {
      setInsightError(data.error);
    }
    setLoadingInsight(false);
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>İçgörüler</Text>
        <Text style={styles.pageSubtitle}>Alışkanlık DNA & İstatistikler</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="En Uzun Seri" value={`${longestStreak}`} sub="gün" />
        <StatCard label="Bugün" value={`${completionRate}%`} sub="tamamlandı" />
        <StatCard label="Alışkanlık" value={`${habits.length}`} sub="aktif" />
      </View>

      <GlassCard style={styles.dnaCard}>
        <View style={styles.dnaTitleRow}>
          <Text style={styles.dnaTitle}>Alışkanlık DNA</Text>
          <View style={styles.dnaBadge}>
            <LinearGradient colors={[colors.primary + '33', colors.primaryDim + '22']} style={StyleSheet.absoluteFill} />
            <Text style={styles.dnaBadgeText}>Kişisel</Text>
          </View>
        </View>
        <Text style={styles.dnaSubtitle}>Alışkanlık kategorilerine göre güç haritanı</Text>
        <View style={styles.radarWrapper}>
          <RadarChart scores={categoryScores} />
        </View>
      </GlassCard>

      <GlassCard style={styles.weekCard}>
        <Text style={styles.sectionTitle}>Bu Hafta</Text>
        <WeekHeatmap countsByDate={countsByDate} />
      </GlassCard>

      <GlassCard style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.sectionTitle}>Haftalık AI Raporu</Text>
          {!weeklyInsight && (
            <TouchableOpacity onPress={fetchWeeklyInsight} disabled={loadingInsight}
              style={[styles.insightBtn, { opacity: loadingInsight ? 0.6 : 1 }]}>
              {loadingInsight
                ? <ActivityIndicator size="small" color={colors.primary} />
                : <Text style={styles.insightBtnText}>Oluştur</Text>}
            </TouchableOpacity>
          )}
        </View>
        {weeklyInsight
          ? <Text style={styles.insightText}>{weeklyInsight}</Text>
          : insightError
          ? <Text style={[styles.insightPlaceholder, { color: colors.error }]}>{insightError}</Text>
          : !loadingInsight && (
            <Text style={styles.insightPlaceholder}>
              Bu haftanın alışkanlık verilerini analiz ederek kişisel bir rapor oluştur.
            </Text>
          )}
      </GlassCard>

      <View style={styles.breakdownSection}>
        <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
        {RADAR_CATEGORIES.map((cat) => {
          const score = categoryScores[cat] ?? 0;
          const color = categoryColors[cat];
          const count = habits.filter((h) => h.category === cat).length;
          return (
            <View key={cat} style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.breakdownDot, { backgroundColor: color }]} />
                <Text style={styles.breakdownLabel} numberOfLines={1}>{CATEGORY_LABELS[cat]}</Text>
              </View>
              <View style={styles.breakdownBarTrack}>
                <View style={[styles.breakdownBarFill, { width: `${score}%`, backgroundColor: color }]} />
              </View>
              <Text style={[styles.breakdownScore, { color }]}>{count}</Text>
            </View>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    header: { paddingTop: spacing.xl, marginBottom: spacing.xl },
    pageTitle: { ...typography.h1, color: colors.textPrimary },
    pageSubtitle: { ...typography.small, color: colors.textSecondary, marginTop: 4 },

    statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
    statCard: { flex: 1, padding: spacing.md, alignItems: 'center', gap: 4 },
    statValue: { ...typography.h2, color: colors.textPrimary },
    statLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
    statSub: { ...typography.caption, color: colors.textMuted },

    dnaCard: { marginBottom: spacing.xl, padding: spacing.base },
    dnaTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
    dnaTitle: { ...typography.h3, color: colors.textPrimary },
    dnaBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full, overflow: 'hidden' },
    dnaBadgeText: { ...typography.captionBold, color: colors.primary },
    dnaSubtitle: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.base },
    radarWrapper: { alignItems: 'center' },

    weekCard: { marginBottom: spacing.xl, padding: spacing.base },
    sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
    heatmapRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    heatmapCell: { alignItems: 'center', gap: spacing.xs, flex: 1 },
    heatmapBar: { width: 24, borderRadius: 4, minHeight: 4 },
    heatmapLabel: { ...typography.caption, color: colors.textMuted },

    insightCard: { marginBottom: spacing.xl, padding: spacing.base },
    insightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    insightBtn: { backgroundColor: colors.primary + '20', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, borderWidth: 1, borderColor: colors.primary + '50' },
    insightBtnText: { ...typography.captionBold, color: colors.primary },
    insightText: { ...typography.small, color: colors.textSecondary, lineHeight: 22 },
    insightPlaceholder: { ...typography.small, color: colors.textMuted, lineHeight: 20, fontStyle: 'italic' },
    breakdownSection: { marginBottom: spacing['3xl'] },
    breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    breakdownLeft: { width: 82, flexDirection: 'row', alignItems: 'center', gap: 6 },
    breakdownDot: { width: 7, height: 7, borderRadius: 3.5, flexShrink: 0 },
    breakdownLabel: { ...typography.smallMedium, color: colors.textPrimary, flexShrink: 1 },
    breakdownBarTrack: { flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
    breakdownBarFill: { height: '100%', borderRadius: 3 },
    breakdownScore: { ...typography.captionBold, width: 18, textAlign: 'right' },
  });
}
