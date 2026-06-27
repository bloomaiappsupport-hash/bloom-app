import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { radius } from '../../theme';
import { useColors } from '../../hooks/useColors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderless?: boolean;
  accentColor?: string;
}

export default function GlassCard({
  children,
  style,
  intensity = 20,
  borderless = false,
  accentColor,
}: GlassCardProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.wrapper, !borderless && styles.border, style]}>
      <BlurView intensity={intensity} tint={colors.glassTint} style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
      {accentColor && <View style={[styles.accent, { backgroundColor: accentColor }]} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    wrapper: {
      borderRadius: radius.xl,
      overflow: 'hidden',
      backgroundColor: c.glassWhite,
    },
    border: {
      borderWidth: 1,
      borderColor: c.glassBorder,
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: c.glassOverlay,
    },
    content: {
      position: 'relative',
    },
    accent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
    },
  });
}
