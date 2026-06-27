import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  Animated, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import {
  IconSunrise, IconSun, IconCloudSun, IconMoon,
  IconDumbbell, IconBrain, IconRocket, IconSprout,
  IconDropHeart, IconClock, IconThinkHead, IconMountain,
  IconTarget, IconLightning, IconFlame, IconInfinity,
  IconTrophy, IconBarChart, IconPeople, IconSparkle,
  IconRunning, IconLotus, IconBook, IconSleep,
  IconBell, IconBellSlash, IconWarning, IconCircleX,
  IconClipboard, IconDice, IconDiamond, IconGear,
} from '../../components/assessment/AssessmentIcons';

const { width } = Dimensions.get('window');
const OPTION_W = (width - spacing.base * 2 - spacing.md) / 2;
type Nav = StackNavigationProp<RootStackParamList, 'Assessment'>;
type IconComponent = React.FC<{ size?: number; color?: string }>;

interface Option {
  label: string;
  value: string;
  Icon: IconComponent;
  iconColor: string;
}

interface Question {
  key: string;
  question: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: 'energy_time',
    question: 'Günün hangi bölümünde daha enerjik hissediyorsun?',
    options: [
      { label: 'Sabah erken', value: 'early_morning', Icon: IconSunrise, iconColor: colors.gold },
      { label: 'Sabah', value: 'morning', Icon: IconSun, iconColor: '#FFD166' },
      { label: 'Öğleden sonra', value: 'afternoon', Icon: IconCloudSun, iconColor: colors.primaryGlow },
      { label: 'Gece', value: 'night', Icon: IconMoon, iconColor: '#7B8CDE' },
    ],
  },
  {
    key: 'goal',
    question: 'Birincil hedefin nedir?',
    options: [
      { label: 'Sağlık & Fitness', value: 'fitness', Icon: IconDumbbell, iconColor: colors.secondary },
      { label: 'Zihinsel Sağlık', value: 'mental', Icon: IconBrain, iconColor: colors.primaryGlow },
      { label: 'Kariyer & Üretkenlik', value: 'career', Icon: IconRocket, iconColor: colors.accent },
      { label: 'Kişisel Gelişim', value: 'growth', Icon: IconSprout, iconColor: '#86EFAC' },
    ],
  },
  {
    key: 'barrier',
    question: 'Alışkanlık oluştururken en büyük engelin ne?',
    options: [
      { label: 'Motivasyon kaybı', value: 'motivation', Icon: IconDropHeart, iconColor: colors.accent },
      { label: 'Zaman yok', value: 'time', Icon: IconClock, iconColor: colors.gold },
      { label: 'Unutuyorum', value: 'forgetting', Icon: IconThinkHead, iconColor: colors.primaryGlow },
      { label: 'Çok zor başlıyor', value: 'difficulty', Icon: IconMountain, iconColor: colors.secondary },
    ],
  },
  {
    key: 'habit_count',
    question: 'Günde kaç alışkanlıkla başlamak istersin?',
    options: [
      { label: '1–2  Kolay', value: '1-2', Icon: IconTarget, iconColor: colors.secondary },
      { label: '3–4  Orta', value: '3-4', Icon: IconLightning, iconColor: colors.gold },
      { label: '5–6  Yoğun', value: '5-6', Icon: IconFlame, iconColor: colors.accent },
      { label: 'Esnek', value: 'flexible', Icon: IconInfinity, iconColor: colors.primaryGlow },
    ],
  },
  {
    key: 'motivation_type',
    question: 'Motivasyonun nasıl çalışır?',
    options: [
      { label: 'Ödüller & Rozetler', value: 'rewards', Icon: IconTrophy, iconColor: colors.gold },
      { label: 'İlerleme görme', value: 'progress', Icon: IconBarChart, iconColor: colors.secondary },
      { label: 'Hesap verebilirlik', value: 'accountability', Icon: IconPeople, iconColor: colors.primaryGlow },
      { label: 'İç motivasyon', value: 'intrinsic', Icon: IconSparkle, iconColor: colors.accent },
    ],
  },
  {
    key: 'focus_area',
    question: 'Hangi alan sana en çok çekici geliyor?',
    options: [
      { label: 'Fiziksel sağlık', value: 'physical', Icon: IconRunning, iconColor: colors.accent },
      { label: 'Meditasyon', value: 'mindfulness', Icon: IconLotus, iconColor: colors.primaryGlow },
      { label: 'Okuma & Öğrenme', value: 'learning', Icon: IconBook, iconColor: colors.secondary },
      { label: 'Uyku & Dinlenme', value: 'sleep', Icon: IconSleep, iconColor: '#38BDF8' },
    ],
  },
  {
    key: 'reminder_style',
    question: 'Hatırlatıcılar konusunda nasılsın?',
    options: [
      { label: 'Çok hatırlat', value: 'frequent', Icon: IconBell, iconColor: colors.gold },
      { label: 'Günde bir kez', value: 'once', Icon: IconBellSlash, iconColor: colors.primaryGlow },
      { label: 'Sadece kaçırınca', value: 'missed_only', Icon: IconWarning, iconColor: colors.accent },
      { label: 'Hiç istemem', value: 'none', Icon: IconCircleX, iconColor: '#F87171' },
    ],
  },
  {
    key: 'self_type',
    question: 'Kendini nasıl tanımlarsın?',
    options: [
      { label: 'Planlayıcı', value: 'planner', Icon: IconClipboard, iconColor: colors.secondary },
      { label: 'Spontane', value: 'spontaneous', Icon: IconDice, iconColor: colors.accent },
      { label: 'Mükemmeliyetçi', value: 'perfectionist', Icon: IconDiamond, iconColor: colors.primaryGlow },
      { label: 'Pragmatik', value: 'pragmatic', Icon: IconGear, iconColor: colors.gold },
    ],
  },
];


export default function AssessmentScreen() {
  const navigation = useNavigation<Nav>();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const question = QUESTIONS[currentQ];

  const animateNext = (nextIndex: number) => {
    Animated.timing(cardAnim, { toValue: -width * 0.3, duration: 220, useNativeDriver: true }).start(() => {
      setCurrentQ(nextIndex);
      setSelected(null);
      cardAnim.setValue(width * 0.3);
      Animated.timing(cardAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    });
    Animated.timing(progress, {
      toValue: (nextIndex / QUESTIONS.length) * 100,
      duration: 380,
      useNativeDriver: false,
    }).start();
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    const newAnswers = { ...answers, [question.key]: value };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        animateNext(currentQ + 1);
      } else {
        navigation.replace('BloomCreation');
      }
    }, 320);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0622', colors.bg]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Seni Tanıyalım</Text>
          <Text style={styles.headerSub}>{currentQ + 1} / {QUESTIONS.length}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </SafeAreaView>

      {/* Question card */}
      <Animated.View style={[styles.card, { transform: [{ translateX: cardAnim }] }]}>
        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.optionsGrid}>
          {question.options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.82}
                style={[styles.option, isSelected && { borderColor: opt.iconColor, borderWidth: 1.5 }]}
              >
                {isSelected && (
                  <LinearGradient
                    colors={[opt.iconColor + '1E', opt.iconColor + '06']}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <View style={[styles.iconWrap, { backgroundColor: opt.iconColor + (isSelected ? '22' : '14') }]}>
                  <opt.Icon size={34} color={isSelected ? opt.iconColor : opt.iconColor + 'AA'} />
                </View>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {opt.label}
                </Text>
                {isSelected && (
                  <View style={[styles.checkDot, { backgroundColor: opt.iconColor }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Login link */}
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.loginLink}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  headerSub: { ...typography.smallMedium, color: colors.textSecondary },
  progressTrack: {
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.base,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1,
  },

  card: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.base,
  },
  question: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    lineHeight: 34,
    fontSize: 22,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  option: {
    width: OPTION_W,
    height: OPTION_W,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 13,
  },
  optionLabelSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  checkDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  loginText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.smallMedium,
    color: colors.primary,
  },
});
