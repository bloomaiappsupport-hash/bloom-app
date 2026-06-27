import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated,
  TouchableOpacity, FlatList, ViewToken, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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

const SLIDES = [
  {
    key: '1',
    title: 'Alışkanlıkların\nÇiçekleniyor',
    subtitle: 'Her küçük adım seni büyütür. BLOOM ile alışkanlıklarını bir yaşam tarzına dönüştür.',
    accentColor: colors.primary,
    Illustration: IllustrationGrowth,
  },
  {
    key: '2',
    title: 'Seni Tanıyan\nBir Koç',
    subtitle: 'Sadece takip değil — gerçek koçluk. Engellerin, örüntülerin ve motivasyonun analiz edilir.',
    accentColor: colors.secondary,
    Illustration: IllustrationAI,
  },
  {
    key: '3',
    title: 'Ritual Stack\'ler\nYarat',
    subtitle: 'Alışkanlıkları birbirine zincirle. Sabah ritüelin günü nasıl başlattığını hissedeceksin.',
    accentColor: colors.accent,
    Illustration: IllustrationStack,
  },
  {
    key: '4',
    title: 'Habit DNA\'nı\nKeşfet',
    subtitle: 'Benzersiz alışkanlık profilin. Güçlü ve gelişime açık yönlerin görünür hale gelir.',
    accentColor: colors.gold,
    Illustration: IllustrationDNA,
  },
  {
    key: '5',
    title: 'Hazır\nmısın?',
    subtitle: '8 hızlı soruyla sana özel bir başlangıç hazırlıyoruz. Sadece 60 saniye sürer.',
    accentColor: colors.primaryGlow,
    Illustration: IllustrationReady,
  },
];

function Slide({
  item,
  index,
  scrollX,
}: {
  item: typeof SLIDES[0];
  index: number;
  scrollX: Animated.Value;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const illustScale = scrollX.interpolate({ inputRange, outputRange: [0.88, 1, 0.88] });
  const illustOpacity = scrollX.interpolate({ inputRange, outputRange: [0.35, 1, 0.35] });
  const textOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0] });
  const textTranslateY = scrollX.interpolate({ inputRange, outputRange: [20, 0, 20] });
  const { Illustration } = item;

  return (
    <View style={styles.slide}>
      {/* ── Illustration section: illustration floats near the bottom of its flex area ── */}
      <View style={styles.illustSection}>
        <Animated.View style={{ opacity: illustOpacity, transform: [{ scale: illustScale }] }}>
          <Illustration size={ILLUS_SIZE} />
        </Animated.View>
      </View>

      {/* ── Text section: starts right below illustration ── */}
      <Animated.View
        style={[styles.textSection, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) setCurrentIndex(viewableItems[0].index ?? 0);
    }
  ).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
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
        <Text style={styles.skipText}>Atla</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
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
        {SLIDES.map((_, i) => {
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
            <Text style={styles.ctaText}>
              {currentIndex === SLIDES.length - 1 ? 'Başla' : 'Devam Et'}
            </Text>
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

  // Each slide splits into two flex sections
  slide: {
    width,
    flex: 1,
    flexDirection: 'column',
  },

  // TOP 55%: illustration, pushed to bottom of its section via justifyContent
  illustSection: {
    flex: 55,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing['2xl'],
  },

  // BOTTOM 45%: text starts at top with small gap only
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

  // Dots
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

  // CTA
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
