import React from 'react';
import {
  TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet, ActivityIndicator, StyleProp
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radius, spacing } from '../../theme';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  gradient?: string[];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function GradientButton({
  label,
  onPress,
  gradient,
  style,
  textStyle,
  loading = false,
  disabled = false,
  variant = 'primary',
}: GradientButtonProps) {
  const GRADIENTS = {
    primary: [colors.primary, colors.primaryDim] as [string, string],
    secondary: [colors.secondary, '#047857'] as [string, string],
    accent: [colors.accent, '#B91C6C'] as [string, string],
  };
  const gradientColors = (gradient as [string, string]) ?? GRADIENTS[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.wrapper, (disabled || loading) && styles.disabled, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={[styles.label, textStyle]}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: radius.full, overflow: 'hidden' },
  gradient: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  label: { ...typography.bodyMedium, color: '#fff', fontWeight: '700', letterSpacing: 0.5 },
  disabled: { opacity: 0.5 },
});
