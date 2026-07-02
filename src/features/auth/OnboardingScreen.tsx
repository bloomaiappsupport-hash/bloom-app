import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated,
  TouchableOpacity, FlatList, ViewToken, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import {
  IllustrationGrowth,
  IllustrationAI,
  IllustrationStack,
  IllustrationDNA,
  IllustrationReady,
} from '../../components/onboarding/OnboardingIllustration';

const { width, height } = Dimensions.get('window');
type Nav = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const ILLUS_SIZE = Math.min(230, height * 0.27);

const SLIDE_KEYS = [
  { key: '1', tKey: 'onboarding.step1', accentColor: colors.primary,     Illustration: IllustrationGrowth },
  { key: '2', tKey: 'onboarding.step2', accentColor: colors.secondary,   Illustration: IllustrationAI    },
  { key: '3', tKey: 'onboarding.step3', accentColor: colors.accent,      Illustration: IllustrationStack },
  { key: '4', tKey: 'onboarding.step4', accentColor: colors.gold,        Illustration: IllustrationDNA   },
  { key: '5', tKey: 'onboarding.step5', accentColor: colors.primaryGlow, Illustration: IllustrationReady },
];

function Slide({
  item,
  index,
  scrollX,
}: {
  item: typeof SLIDE_KEYS[0];
  index: number;
  scrollX: Animated.Value;
}) {
  const { t } = useTranslation();
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const illustScale = scrollX.interpolate({ inputRange, outputRange: [0.88, 1, 0.88] });
  const illustOpacity = scrollX.interpolate({ inputRange, outputRange: [0.35, 1, 0.35] });
  const textOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0] });
  const textTranslateY = scrollX.interpolate({ inputRange, outputRange: [20, 0, 20] });
  const { Illustration } = item;

  return (
    <View style={styles.slide}>
      <View style={styles.illustSection}>
        <Animated.View style={{ opacity: illustOpacity, transform: [{ scale: illustScale }] }}>
          <Illustration size={ILLUS_SIZE} />
        </Animated.View>
      </View>

      <Animated.View
        style={[styles.textSection, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}
      >
        <Text style={styles.title}>{t(`${item.tKey}.title`)}</Text>
        <Text style={styles.subtitle}>{t(`${item.tKey}.subtitle`)}</Text>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const { t, i18n: i18nInstance } = useTranslation();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState(i18nInstance.language === 'tr' ? 'tr' : 'en');

  const toggleLanguage = () => {
    const next = lang === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(next);
    setLang(next);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) setCurrentIndex(viewableItems[0].index ?? 0);
    }
  ).current;

  const goNext = () => {
    if (currentIndex < SLIDE_KEYS.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Assessment');
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#0D0622', '#080812']}
        style={StyleSheet.absoluteFill}
      />

      {/* Language toggle — top-left, hides when back button appears */}
      {currentIndex === 0 && (
        <TouchableOpacity
          onPress={toggleLanguage}
          style={styles.langBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Text style={styles.langBtnText}>{lang === 'tr' ? 'EN' : 'TR'}</Text>
        </TouchableOpacity>
      )}

      {/* Back */}
      {currentIndex > 0 && (
        <TouchableOpacity
          onPress={() => flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true })}
          style={styles.backBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      )}

      {/* Skip */}
      <TouchableOpacity
        onPress={() => navigation.replace('Assessment')}
        style={styles.skipBtn}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <Text style={styles.skipText}>{t('common.skip')}</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDE_KEYS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
        style={styles.flatList}
      />

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {SLIDE_KEYS.map((_, i) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [5, 22, 5],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.2, 1, 0.2],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
            />
          );
        })}
      </View>

      {/* CTA */}
      <View style={styles.ctaArea}>
        <TouchableOpacity onPress={goNext} activeOpacity={0.88} style={styles.ctaTouch}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDim]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>{t('common.continue')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  langBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 18,
    left: spacing.xl,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  langBtnText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 14,
    left: spacing.xl,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 34,
    lineHeight: 40,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  skipBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 18,
    right: spacing.xl,
    zIndex: 10,
  },
  skipText: {
    ...typography.smallMedium,
    color: colors.textMuted,
  },
  flatList: {
    flex: 1,
  },

  slide: {
    width,
    flex: 1,
    flexDirection: 'column',
  },

  illustSection: {
    flex: 55,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing['2xl'],
  },

  textSection: {
    flex: 45,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 44,
    fontSize: 34,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 27,
    paddingHorizontal: spacing.sm,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },

  ctaArea: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  ctaTouch: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...typography.bodyMedium,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
    fontSize: 17,
  },
});
