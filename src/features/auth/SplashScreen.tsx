import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography } from '../../theme';
import BloomLogo from '../../components/common/BloomLogo';

type Nav = StackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(textY, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => navigation.replace('Onboarding'));
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0622', '#080812', '#0A0A1A']} style={StyleSheet.absoluteFill} />

      {/* Logo */}
      <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
        <BloomLogo size={88} />
      </Animated.View>

      {/* Text — separate from logo, slides up */}
      <Animated.View style={[styles.textBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
        <Text style={styles.appName}>BLOOM</Text>
        <Text style={styles.tagline}>Alışkanlıkların çiçekleniyor</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    ...typography.display,
    color: colors.textPrimary,
    letterSpacing: 10,
    fontSize: 32,
  },
  tagline: {
    ...typography.small,
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
});
