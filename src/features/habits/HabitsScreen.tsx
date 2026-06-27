import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { useHabitStore } from '../../stores/habitStore';
import { useAuthStore } from '../../stores/authStore';
import { habitsService } from '../../services/supabase';
import { scheduleHabitNotification, cancelHabitNotification } from '../../services/notifications';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { GlassCard, GradientButton, ScreenContainer } from '../../components/common';
import { Habit, HabitCategory, HabitStack } from '../../types';
import {
  HabitIcon, IcFlame, IcSparkle,
  HABIT_ICON_KEYS, HabitIconKey,
} from '../../components/habits/HabitIcons';

const { width } = Dimensions.get('window');

function CatFitness({ size = 18, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 4v16M18 4v16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Rect x="3" y="8" width="6" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Rect x="15" y="8" width="6" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
function CatMind({ size = 18, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5a5 5 0 0 0-5 5c0 1.6.75 3 1.9 3.9A3.5 3.5 0 0 0 12 19a3.5 3.5 0 0 0 3.1-5.1A5 5 0 0 0 12 5z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M7 10H5a2 2 0 0 0 0 4h2M17 10h2a2 2 0 0 1 0 4h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
function CatSleep({ size = 18, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}
function CatNutrition({ size = 18, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22c4.97 0 9-4.03 9-9C21 7.07 12 2 12 2S3 7.07 3 13c0 4.97 4.03 9 9 9z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Line x1="12" y1="22" x2="12" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
function CatSocial({ size = 18, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.8" />
      <Path d="M3 20c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75M21 20c0-2.76-2.24-5-5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
function CatWork({ size = 18, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2c0 0-6 4-6 11l3 3 3-1 3 1 3-3c0-7-6-11-6-11z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Circle cx="12" cy="11" r="2" stroke={color} strokeWidth="1.6" />
    </Svg>
  );
}

function getCategoryConfig(c: ReturnType<typeof useColors>): Record<HabitCategory, { color: string; Icon: React.FC<{ size?: number; color?: string }>; label: string; defaultIcon: HabitIconKey }> {
  return {
    fitness: { color: c.fitness, Icon: CatFitness, label: 'Fitness', defaultIcon: 'dumbbell' },
    mind: { color: c.mind, Icon: CatMind, label: 'Zihin', defaultIcon: 'brain' },
    sleep: { color: c.sleep, Icon: CatSleep, label: 'Uyku', defaultIcon: 'moon' },
    nutrition: { color: c.nutrition, Icon: CatNutrition, label: 'Beslenme', defaultIcon: 'leaf' },
    social: { color: c.social, Icon: CatSocial, label: 'Sosyal', defaultIcon: 'people' },
    work: { color: c.work, Icon: CatWork, label: 'Kariyer', defaultIcon: 'rocket' },
    custom: { color: c.primary, Icon: IcSparkle, label: 'Özel', defaultIcon: 'target' },
  };
}

function HabitCard({ habit, streak, shields }: { habit: Habit; streak?: number; shields?: number }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const CATEGORY_CONFIG = useMemo(() => getCategoryConfig(colors), [colors]);
  const { removeHabit, useShield } = useHabitStore();
  const { plan } = useAuthStore();
  const cfg = CATEGORY_CONFIG[habit.category];

  const handleUseShield = () => {
    if (!shields || shields <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      '🛡️ Kalkan Kullan',
      `Bir kalkan harcayarak bugünkü ${habit.title} serisini koru. Kalan: ${shields} kalkan`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kullan',
          onPress: async () => {
            const updated = useShield(habit.id);
            if (updated) {
              await habitsService.upsertStreak(updated);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ],
    );
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const options: any[] = [
      { text: 'İptal', style: 'cancel' },
    ];
    if (plan === 'premium' && shields && shields > 0) {
      options.push({ text: `🛡️ Kalkan Kullan (${shields})`, onPress: handleUseShield });
    }
    options.push({
      text: 'Sil', style: 'destructive', onPress: async () => {
        await habitsService.deleteHabit(habit.id);
        removeHabit(habit.id);
        cancelHabitNotification(habit.id);
      },
    });
    Alert.alert('Alışkanlık', habit.title, options);
  };

  return (
    <TouchableOpacity onLongPress={handleLongPress} activeOpacity={0.85}>
      <GlassCard style={styles.habitCard}>
        <View style={styles.habitCardContent}>
          <View style={[styles.habitIcon, { backgroundColor: cfg.color + '20' }]}>
            <HabitIcon iconKey={habit.icon} size={22} color={cfg.color} />
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.habitTitle}>{habit.title}</Text>
            <View style={styles.habitMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: cfg.color + '20' }]}>
                <cfg.Icon size={12} color={cfg.color} />
                <Text style={[styles.categoryBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
              <Text style={styles.freqText}>
                {habit.frequency_type === 'daily' ? 'Her gün' : 'Haftalık'}
              </Text>
            </View>
          </View>
          <View style={styles.badgeCol}>
            {streak !== undefined && streak > 0 && (
              <View style={styles.streakBadge}>
                <IcFlame size={14} color={colors.accent} />
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
            )}
            {plan === 'premium' && shields !== undefined && shields > 0 && (
              <View style={[styles.streakBadge, { marginTop: 4 }]}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke={colors.secondary} strokeWidth="1.8" strokeLinejoin="round"
                    fill={colors.secondary + '20'} />
                </Svg>
                <Text style={[styles.streakNum, { color: colors.secondary }]}>{shields}</Text>
              </View>
            )}
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

function AddHabitModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const CATEGORY_CONFIG = useMemo(() => getCategoryConfig(colors), [colors]);
  const { addHabit } = useHabitStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('fitness');
  const [iconKey, setIconKey] = useState<HabitIconKey>('dumbbell');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(9);
  const [reminderMinute, setReminderMinute] = useState(0);

  const handleSave = async () => {
    if (!title.trim() || !user?.id) return;
    const cfg = CATEGORY_CONFIG[category];
    const reminder_time = reminderEnabled
      ? `${String(reminderHour).padStart(2, '0')}:${String(reminderMinute).padStart(2, '0')}`
      : null;
    const { data, error } = await habitsService.createHabit({
      user_id: user.id,
      title: title.trim(),
      category,
      icon: iconKey,
      color: cfg.color,
      frequency_type: frequency,
      frequency_days: frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : [1, 3, 5],
      reminder_time,
    });
    if (error) { Alert.alert('Hata', error.message); return; }
    if (data) {
      addHabit(data);
      if (reminderEnabled) {
        scheduleHabitNotification(data.id, data.title, reminderHour, reminderMinute);
      }
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTitle('');
    setCategory('fitness');
    setIconKey('dumbbell');
    setReminderEnabled(false);
    onClose();
  };

  const activeCfg = CATEGORY_CONFIG[category];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <LinearGradient colors={[colors.surface2, colors.surface]} style={StyleSheet.absoluteFill} />
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Yeni Alışkanlık</Text>

          <TextInput
            style={styles.modalInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Alışkanlık adı..."
            placeholderTextColor={colors.textMuted}
            autoFocus
          />

          <Text style={styles.modalLabel}>Kategori</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {(Object.keys(CATEGORY_CONFIG) as HabitCategory[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => { setCategory(cat); setIconKey(cfg.defaultIcon); }}
                  style={[styles.categoryChip, isSelected && { backgroundColor: cfg.color + '25', borderColor: cfg.color }]}
                >
                  <cfg.Icon size={14} color={isSelected ? cfg.color : colors.textMuted} />
                  <Text style={[styles.categoryChipText, isSelected && { color: cfg.color }]}>{cfg.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.modalLabel}>İkon</Text>
          <View style={styles.iconGrid}>
            {HABIT_ICON_KEYS.map((key) => {
              const isSelected = iconKey === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setIconKey(key)}
                  style={[styles.iconOption, isSelected && { borderColor: activeCfg.color, backgroundColor: activeCfg.color + '20' }]}
                >
                  <HabitIcon iconKey={key} size={22} color={isSelected ? activeCfg.color : colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.modalLabel}>Sıklık</Text>
          <View style={styles.freqRow}>
            {(['daily', 'weekly'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFrequency(f)}
                style={[styles.freqBtn, frequency === f && styles.freqBtnActive]}
              >
                <Text style={[styles.freqBtnText, frequency === f && { color: colors.primary }]}>
                  {f === 'daily' ? 'Her Gün' : 'Haftalık'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.reminderRow}>
            <Text style={styles.modalLabel}>Hatırlatıcı</Text>
            <TouchableOpacity
              onPress={() => setReminderEnabled((v) => !v)}
              style={[styles.toggle, reminderEnabled && { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleThumb, reminderEnabled && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>

          {reminderEnabled && (
            <View style={styles.timePicker}>
              <View style={styles.timeUnit}>
                <TouchableOpacity onPress={() => setReminderHour((h) => (h + 1) % 24)} style={styles.timeArrow}>
                  <Text style={styles.timeArrowText}>▲</Text>
                </TouchableOpacity>
                <Text style={[styles.timeValue, { color: colors.primary }]}>
                  {String(reminderHour).padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={() => setReminderHour((h) => (h - 1 + 24) % 24)} style={styles.timeArrow}>
                  <Text style={styles.timeArrowText}>▼</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.timeColon, { color: colors.textMuted }]}>:</Text>
              <View style={styles.timeUnit}>
                <TouchableOpacity onPress={() => setReminderMinute((m) => (m + 15) % 60)} style={styles.timeArrow}>
                  <Text style={styles.timeArrowText}>▲</Text>
                </TouchableOpacity>
                <Text style={[styles.timeValue, { color: colors.primary }]}>
                  {String(reminderMinute).padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={() => setReminderMinute((m) => (m - 15 + 60) % 60)} style={styles.timeArrow}>
                  <Text style={styles.timeArrowText}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
            <GradientButton label="Kaydet" onPress={handleSave} style={styles.saveBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const FREE_HABIT_LIMIT = 5;

const TIME_LABELS: Record<HabitStack['time_of_day'], string> = {
  morning: '🌅 Sabah',
  afternoon: '☀️ Öğlen',
  evening: '🌆 Akşam',
  night: '🌙 Gece',
};

function StackCard({ stack, habits, onDelete }: {
  stack: HabitStack;
  habits: Habit[];
  onDelete: () => void;
}) {
  const colors = useColors();
  const stackHabits = habits.filter((h) => stack.habit_ids.includes(h.id));

  return (
    <TouchableOpacity
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert('Rutin', stack.name, [
          { text: 'İptal', style: 'cancel' },
          { text: 'Sil', style: 'destructive', onPress: onDelete },
        ]);
      }}
      activeOpacity={0.85}
    >
      <GlassCard style={stackCardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <Text style={{ ...typography.bodyMedium, color: colors.textPrimary }}>{stack.name}</Text>
          <Text style={{ ...typography.caption, color: colors.primary }}>{TIME_LABELS[stack.time_of_day]}</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
          {stackHabits.map((h) => (
            <View key={h.id} style={[stackChipStyle, { backgroundColor: h.color + '20', borderColor: h.color + '40' }]}>
              <Text style={{ ...typography.caption, color: h.color }}>{h.title}</Text>
            </View>
          ))}
          {stackHabits.length === 0 && (
            <Text style={{ ...typography.caption, color: colors.textMuted }}>Alışkanlık eklenmemiş</Text>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const stackCardStyle = { marginBottom: spacing.sm, padding: spacing.base };
const stackChipStyle = { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full, borderWidth: 1 };

function IcSunrise({ color = '#fff', size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2v3M4.22 6.22l2.12 2.12M2 14h3M19 14h3M17.66 8.34l2.12-2.12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M5 14a7 7 0 0 1 14 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M2 19h20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcSun({ color = '#fff', size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.8" />
      <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcSunset({ color = '#fff', size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 14a7 7 0 0 1 14 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M2 19h20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M12 2v3M4.22 6.22l2.12 2.12M19.78 6.22l-2.12 2.12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M9 22l3-3 3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IcMoonStar({ color = '#fff', size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M18 3l.5 1.5L20 5l-1.5.5L18 7l-.5-1.5L16 5l1.5-.5L18 3z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </Svg>
  );
}

const TIME_OPTIONS: { key: HabitStack['time_of_day']; Icon: React.FC<{ color?: string; size?: number }>; label: string }[] = [
  { key: 'morning', Icon: IcSunrise, label: 'Sabah' },
  { key: 'afternoon', Icon: IcSun, label: 'Öğlen' },
  { key: 'evening', Icon: IcSunset, label: 'Akşam' },
  { key: 'night', Icon: IcMoonStar, label: 'Gece' },
];

function AddStackModal({ visible, onClose, habits }: {
  visible: boolean;
  onClose: () => void;
  habits: Habit[];
}) {
  const colors = useColors();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<HabitStack['time_of_day']>('morning');

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSave = async () => {
    if (!name.trim() || selected.length === 0 || !user?.id) return;
    const { data, error } = await habitsService.createStack({
      user_id: user.id,
      name: name.trim(),
      habit_ids: selected,
      time_of_day: timeOfDay,
    });
    if (error) { Alert.alert('Hata', error.message); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setName(''); setSelected([]); setTimeOfDay('morning');
    onClose();
  };

  const handleClose = () => {
    setName(''); setSelected([]); setTimeOfDay('morning');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={stackModalStyles.overlay}>
        <View style={stackModalStyles.sheet}>
          <LinearGradient colors={[colors.surface2, colors.surface]} style={StyleSheet.absoluteFill} />
          <View style={[stackModalStyles.handle, { backgroundColor: colors.border }]} />

          <Text style={[stackModalStyles.title, { color: colors.textPrimary }]}>Yeni Rutin Stack</Text>

          <TextInput
            style={[stackModalStyles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
            value={name}
            onChangeText={setName}
            placeholder="Rutin adı (ör. Sabah Ritüeli)..."
            placeholderTextColor={colors.textMuted}
            autoFocus
          />

          <Text style={[stackModalStyles.label, { color: colors.textSecondary }]}>Zaman</Text>
          <View style={stackModalStyles.timeRow}>
            {TIME_OPTIONS.map((t) => {
              const isActive = timeOfDay === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setTimeOfDay(t.key)}
                  activeOpacity={0.8}
                  style={[
                    stackModalStyles.timeBtn,
                    { borderColor: isActive ? colors.primary : colors.border, backgroundColor: isActive ? colors.primary + '20' : colors.surface },
                  ]}
                >
                  <t.Icon size={20} color={isActive ? colors.primary : colors.textMuted} />
                  <Text style={[stackModalStyles.timeLabel, { color: isActive ? colors.primary : colors.textMuted }]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[stackModalStyles.label, { color: colors.textSecondary }]}>Alışkanlıklar</Text>
          <ScrollView style={stackModalStyles.habitList} showsVerticalScrollIndicator={false}>
            {habits.map((h) => {
              const isSel = selected.includes(h.id);
              return (
                <TouchableOpacity
                  key={h.id}
                  onPress={() => toggle(h.id)}
                  activeOpacity={0.8}
                  style={[
                    stackModalStyles.habitRow,
                    { backgroundColor: isSel ? h.color + '12' : colors.surface, borderColor: isSel ? h.color + '50' : colors.border },
                  ]}
                >
                  <View style={[
                    stackModalStyles.checkbox,
                    { borderColor: isSel ? h.color : colors.border, backgroundColor: isSel ? h.color : 'transparent' },
                  ]}>
                    {isSel && (
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        <Path d="M5 13l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    )}
                  </View>
                  <View style={[stackModalStyles.habitDot, { backgroundColor: h.color + '30' }]}>
                    <HabitIcon iconKey={h.icon as HabitIconKey} size={16} color={h.color} />
                  </View>
                  <Text style={[stackModalStyles.habitName, { color: isSel ? colors.textPrimary : colors.textSecondary }]}>{h.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={stackModalStyles.actions}>
            <TouchableOpacity onPress={handleClose} style={stackModalStyles.cancelBtn} activeOpacity={0.7}>
              <Text style={[stackModalStyles.cancelText, { color: colors.textSecondary }]}>İptal</Text>
            </TouchableOpacity>
            <GradientButton
              label="Kaydet"
              onPress={handleSave}
              style={stackModalStyles.saveBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stackModalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius['3xl'], borderTopRightRadius: radius['3xl'],
    padding: spacing.base, paddingBottom: 44, overflow: 'hidden', minHeight: 540,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, marginBottom: spacing.xl },
  label: { ...typography.smallMedium, marginBottom: spacing.sm },
  input: {
    borderWidth: 1, borderRadius: radius.lg,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    ...typography.body, marginBottom: spacing.xl,
  },
  timeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  timeBtn: {
    flex: 1, paddingVertical: spacing.md, borderRadius: radius.xl,
    borderWidth: 1, alignItems: 'center', gap: 4,
  },
timeLabel: { ...typography.captionBold },
  habitList: { maxHeight: 180, marginBottom: spacing.xl },
  habitRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.xl, marginBottom: spacing.sm,
    borderWidth: 1,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 7, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  habitDot: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  habitName: { ...typography.bodyMedium, flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  cancelBtn: { flex: 1, paddingVertical: spacing.base, alignItems: 'center' },
  cancelText: { ...typography.bodyMedium },
  saveBtn: { flex: 2 },
});

export default function HabitsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const CATEGORY_CONFIG = useMemo(() => getCategoryConfig(colors), [colors]);
  const { habits, streaks } = useHabitStore();
  const { plan, user } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [showAdd, setShowAdd] = useState(false);
  const [showAddStack, setShowAddStack] = useState(false);
  const [stacks, setStacks] = useState<HabitStack[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    habitsService.getStacks(user.id).then(({ data }) => {
      if (data) setStacks(data as HabitStack[]);
    });
  }, [user?.id]);

  const handleAddPress = () => {
    if (plan !== 'premium' && habits.length >= FREE_HABIT_LIMIT) {
      navigation.navigate('Paywall');
      return;
    }
    setShowAdd(true);
  };

  const handleDeleteStack = async (id: string) => {
    await habitsService.deleteStack(id);
    setStacks((prev) => prev.filter((s) => s.id !== id));
  };

  const grouped = (Object.keys(CATEGORY_CONFIG) as HabitCategory[]).reduce<Record<string, Habit[]>>((acc, cat) => {
    const items = habits.filter((h) => h.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Alışkanlıklar</Text>
        <TouchableOpacity onPress={handleAddPress} activeOpacity={0.85}>
          <LinearGradient colors={[colors.primary, colors.primaryDim]} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Ekle</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <IcSparkle size={40} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Henüz alışkanlık yok</Text>
          <Text style={styles.emptySubtitle}>İlk alışkanlığını ekleyerek bloom'unu inşa etmeye başla.</Text>
          <GradientButton label="İlk Alışkanlığını Ekle" onPress={() => setShowAdd(true)} style={styles.emptyBtn} />
        </View>
      ) : (
        Object.entries(grouped).map(([cat, items]) => {
          const cfg = CATEGORY_CONFIG[cat as HabitCategory];
          return (
            <View key={cat} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={[styles.groupIconWrap, { backgroundColor: cfg.color + '20' }]}>
                  <cfg.Icon size={14} color={cfg.color} />
                </View>
                <Text style={styles.groupLabel}>{cfg.label}</Text>
                <View style={[styles.groupCount, { backgroundColor: cfg.color + '20' }]}>
                  <Text style={[styles.groupCountText, { color: cfg.color }]}>{items.length}</Text>
                </View>
              </View>
              {items.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  streak={streaks[habit.id]?.current_streak}
                  shields={streaks[habit.id]?.shields_remaining}
                />
              ))}
            </View>
          );
        })
      )}

      {/* Rutin Stack'ler */}
      {habits.length > 0 && (
        <View style={styles.group}>
          <View style={[styles.groupHeader, { marginTop: spacing.md }]}>
            <View style={[styles.groupIconWrap, { backgroundColor: colors.secondary + '20' }]}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M4 6h16M4 12h16M4 18h16" stroke={colors.secondary} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.groupLabel, { flex: 1 }]}>Rutin Stack'ler</Text>
            <TouchableOpacity onPress={() => setShowAddStack(true)} activeOpacity={0.8}
              style={{ backgroundColor: colors.secondary + '20', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full }}>
              <Text style={{ ...typography.captionBold, color: colors.secondary }}>+ Oluştur</Text>
            </TouchableOpacity>
          </View>

          {stacks.length === 0 ? (
            <GlassCard style={{ padding: spacing.base, alignItems: 'center', gap: spacing.sm }}>
              <Text style={{ ...typography.small, color: colors.textMuted, textAlign: 'center' }}>
                Alışkanlıklarını zincirle bir sabah veya akşam rutini oluştur.
              </Text>
            </GlassCard>
          ) : (
            stacks.map((stack) => (
              <StackCard
                key={stack.id}
                stack={stack}
                habits={habits}
                onDelete={() => handleDeleteStack(stack.id)}
              />
            ))
          )}
        </View>
      )}

      <AddHabitModal visible={showAdd} onClose={() => setShowAdd(false)} />
      <AddStackModal
        visible={showAddStack}
        onClose={() => {
          setShowAddStack(false);
          if (user?.id) habitsService.getStacks(user.id).then(({ data }) => { if (data) setStacks(data as HabitStack[]); });
        }}
        habits={habits}
      />
    </ScreenContainer>
  );
}

// Static styles (no color refs)
const staticStyles = StyleSheet.create({
  addBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.full },
  groupIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  groupCount: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  habitCardContent: { flexDirection: 'row', alignItems: 'center', padding: spacing.base, gap: spacing.md },
  habitIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  habitInfo: { flex: 1 },
  habitMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full },
  categoryBadgeText: { ...typography.caption, fontWeight: '600' },
  streakBadge: { alignItems: 'center', gap: 2 },
  badgeCol: { alignItems: 'center' },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 80, gap: spacing.md },
  emptyIconWrap: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emptySubtitle: { ...typography.body, textAlign: 'center', lineHeight: 24, paddingHorizontal: spacing.xl },
  emptyBtn: { marginTop: spacing.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: radius['3xl'], borderTopRightRadius: radius['3xl'], padding: spacing.base, paddingBottom: 40, overflow: 'hidden', minHeight: 600 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.base, backgroundColor: '#333' },
  categoryScroll: { marginBottom: spacing.xl },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginRight: spacing.sm },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  iconOption: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1 },
  freqRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  freqBtn: { flex: 1, paddingVertical: spacing.base, alignItems: 'center', borderRadius: radius.lg, borderWidth: 1 },
  modalActions: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  cancelBtn: { flex: 1, paddingVertical: spacing.base, alignItems: 'center' },
  saveBtn: { flex: 2 },
  reminderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  toggle: { width: 46, height: 26, borderRadius: 13, backgroundColor: '#333', justifyContent: 'center', paddingHorizontal: 3 },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  timePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: '#222', borderRadius: radius.xl, paddingVertical: spacing.md, marginBottom: spacing.md },
  timeUnit: { alignItems: 'center', gap: spacing.xs },
  timeArrow: { padding: spacing.sm },
  timeArrowText: { color: '#888', fontSize: 12 },
  timeValue: { ...typography.h2, fontSize: 32, fontVariant: ['tabular-nums'] as any },
  timeColon: { ...typography.h2, fontSize: 32, marginBottom: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.xl, marginBottom: spacing.xl },
  group: { marginBottom: spacing.xl },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  habitCard: { marginBottom: spacing.sm },
});

function createStyles(colors: ReturnType<typeof useColors>) {
  return {
    ...staticStyles,
    addBtnText: { ...typography.smallMedium, color: '#fff', fontWeight: '700' as const },
    pageTitle: { ...typography.h1, color: colors.textPrimary },
    groupLabel: { ...typography.h4, color: colors.textPrimary, flex: 1 },
    groupCountText: { ...typography.captionBold },
    habitTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: spacing.xs },
    freqText: { ...typography.caption, color: colors.textMuted },
    streakNum: { ...typography.captionBold, color: colors.accent },
    emptyTitle: { ...typography.h2, color: colors.textPrimary },
    emptyIconWrap: { ...staticStyles.emptyIconWrap, backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' },
    emptySubtitle: { ...staticStyles.emptySubtitle, color: colors.textSecondary },
    modalHandle: { ...staticStyles.modalHandle, backgroundColor: colors.border },
    modalTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xl },
    modalInput: {
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      borderRadius: radius.lg, paddingHorizontal: spacing.base, paddingVertical: spacing.md,
      ...typography.body, color: colors.textPrimary, marginBottom: spacing.xl,
    },
    modalLabel: { ...typography.smallMedium, color: colors.textSecondary, marginBottom: spacing.sm },
    categoryChip: { ...staticStyles.categoryChip, backgroundColor: colors.surface, borderColor: colors.border },
    categoryChipText: { ...typography.smallMedium, color: colors.textSecondary },
    iconOption: { ...staticStyles.iconOption, backgroundColor: colors.surface, borderColor: colors.border },
    freqBtn: { ...staticStyles.freqBtn, backgroundColor: colors.surface, borderColor: colors.border },
    freqBtnActive: { borderColor: colors.primary },
    freqBtnText: { ...typography.smallMedium, color: colors.textSecondary },
    cancelText: { ...typography.bodyMedium, color: colors.textSecondary },
  };
}
