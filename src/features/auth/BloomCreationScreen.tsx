import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing } from '../../theme';
import BloomLogo from '../../components/common/BloomLogo';

const { width } = Dimensions.get('window');
type Nav = StackNavigationProp<RootStackParamList, 'BloomCreation'>;

const STEPS = [
  'Profil analiz ediliyor...',
  "Alışkanlık DNA'n oluşturuluyor...",
  'AI koçun hazırlanıyor...',
  "Bloom'un şekilleniyor...",
  'Hazır!',
];

export default function BloomCreationScreen() {
  const navigation = useNavigation<Nav>();
  const [stepIndex, setStepIndex] = useState(0);

  const logoScale   = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const completePct = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 1, duration: 900, delay: 200, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 500, delay: 400, useNativeDriver: true }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.96, duration: 1600, useNativeDriver: true }),
        ])
      ).start();
    });

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < STEPS.length) {
        setStepIndex(i);
        Animated.sequence([
          Animated.timing(textOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
          Animated.timing(textOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        ]).start();
        Animated.timing(completePct, {
          toValue: (i / (STEPS.length - 1)) * 100,
          duration: 400,
          useNativeDriver: false,
        }).start();
      } else {
        clearInterval(interval);
        setTimeout(() => (navigation as any).replace('Auth', { screen: 'Login' }), 500);
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  const progressWidth = completePct.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  const pct = Math.round((stepIndex / (STEPS.length - 1)) * 100);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0622', '#080812', '#0A0A1A']} style={StyleSheet.absoluteFill} />

      {/* Top label */}
      <View style={styles.topLabel}>
        <Text style={styles.topLabelText}>BLOOM OLUŞTURULUYOR</Text>
      </View>

      {/* Center: logo + pulse glow */}
      <View style={styles.logoSection}>
        {/* Soft ambient glow behind logo — rgba so opacity override can't make it solid */}
        <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
        <Animated.View style={{ transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }], opacity: logoOpacity }}>
          <BloomLogo size={108} />
        </Animated.View>
      </View>

      {/* Bottom: step text + progress */}
      <View style={styles.bottomSection}>
        <Animated.Text style={[styles.stepText, { opacity: textOpacity }]}>
          {STEPS[stepIndex]}
        </Animated.Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.pctText}>{pct}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },

  topLabel: {
    position: 'absolute',
    top: 72,
    alignItems: 'center',
  },
  topLabelText: {
    ...typography.label,
    color: colors.textMuted,
    letterSpacing: 3,
    fontSize: 11,
  },

  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3xl'],
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
  },

  bottomSection: {
    alignItems: 'center',
    gap: spacing.lg,
    width: '100%',
    paddingHorizontal: spacing['2xl'],
    position: 'absolute',
    bottom: '20%',
  },
  stepText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  progressRow: {
    width: width * 0.6,
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  pctText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
