import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');
type Nav = StackNavigationProp<RootStackParamList, 'BloomCreation'>;

const STEPS = [
  'Profil analiz ediliyor...',
  'Alışkanlık DNA\'n oluşturuluyor...',
  'AI koçun hazırlanıyor...',
  'Bloomn şekilleniyor...',
  'Hazır!',
];

export default function BloomCreationScreen() {
  const navigation = useNavigation<Nav>();
  const [stepIndex, setStepIndex] = useState(0);
  const orbScale = useRef(new Animated.Value(0.3)).current;
  const orbOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ring1 = useRef(new Animated.Value(0.5)).current;
  const ring2 = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const completePct = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orb giriş animasyonu
    Animated.parallel([
      Animated.spring(orbScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(orbOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start(() => startPulse());

    // Halka animasyonları
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring1, { toValue: 1.3, duration: 2000, useNativeDriver: true }),
        Animated.timing(ring1, { toValue: 0.5, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(ring2, { toValue: 1.5, duration: 2200, useNativeDriver: true }),
        Animated.timing(ring2, { toValue: 0.3, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    // Adım döngüsü
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < STEPS.length) {
        setStepIndex(i);
        Animated.sequence([
          Animated.timing(textOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
        Animated.timing(completePct, {
          toValue: (i / (STEPS.length - 1)) * 100,
          duration: 400,
          useNativeDriver: false,
        }).start();
      } else {
        clearInterval(interval);
        setTimeout(() => (navigation as any).replace('Auth', { screen: 'Login' }), 600);
      }
    }, 900);

    Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    return () => clearInterval(interval);
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  };

  const progressWidth = completePct.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0824', colors.bg, '#080812']} style={StyleSheet.absoluteFill} />

      {/* Rings */}
      <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: ring1 }] }]} />
      <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2 }] }]} />

      {/* Orb */}
      <Animated.View style={[styles.orbContainer, { transform: [{ scale: Animated.multiply(orbScale, pulseAnim) }], opacity: orbOpacity }]}>
        <LinearGradient
          colors={[colors.primaryGlow, colors.primary, colors.primaryDim]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.orb}
        />
        <View style={styles.orbShine} />
        <Text style={styles.orbLogo}>A</Text>
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textArea, { opacity: textOpacity }]}>
        <Text style={styles.stepText}>{STEPS[stepIndex]}</Text>
      </Animated.View>

      {/* Progress */}
      <View style={styles.progressArea}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressLabel}>{Math.round((stepIndex / (STEPS.length - 1)) * 100)}%</Text>
      </View>

      <Text style={styles.bloomnCreating}>Bloomn oluşturuluyor</Text>
    </View>
  );
}

const ORB = 160;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  ring1: { width: 280, height: 280 },
  ring2: { width: 380, height: 380, borderColor: colors.primaryGlow + '18' },
  orbContainer: { width: ORB, height: ORB, alignItems: 'center', justifyContent: 'center' },
  orb: { width: ORB, height: ORB, borderRadius: ORB / 2, position: 'absolute' },
  orbShine: {
    position: 'absolute',
    width: ORB * 0.4,
    height: ORB * 0.4,
    borderRadius: ORB * 0.2,
    backgroundColor: 'rgba(255,255,255,0.22)',
    top: ORB * 0.1,
    left: ORB * 0.15,
  },
  orbLogo: { color: '#fff', fontSize: 56, fontWeight: '800', zIndex: 1 },
  textArea: { marginTop: spacing['2xl'], alignItems: 'center' },
  stepText: { ...typography.bodyMedium, color: colors.textSecondary, letterSpacing: 0.5 },
  progressArea: {
    position: 'absolute',
    bottom: height * 0.18,
    width: width * 0.7,
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  progressLabel: { ...typography.caption, color: colors.textMuted },
  bloomnCreating: {
    position: 'absolute',
    bottom: height * 0.13,
    ...typography.label,
    color: colors.textMuted,
    letterSpacing: 3,
  },
});
