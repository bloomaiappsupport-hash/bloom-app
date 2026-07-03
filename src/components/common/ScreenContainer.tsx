import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../theme';
import { useColors } from '../../hooks/useColors';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  padded?: boolean;
}

export default function ScreenContainer({
  children,
  style,
  scrollable = false,
  padded = true,
}: ScreenContainerProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isPad = Platform.OS === 'ios' && Platform.isPad;

  const content = scrollable ? (
    <ScrollView
      style={[styles.scroll, isPad && styles.padContent]}
      contentContainerStyle={[padded && styles.paddedContent, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, isPad && styles.padContent, padded && styles.padded, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[colors.gradStart, colors.gradEnd]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.container}>{content}</View>
    </SafeAreaView>
  );
}

function createStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    container: { flex: 1 },
    inner: { flex: 1 },
    padded: { paddingHorizontal: spacing.base },
    scroll: { flex: 1 },
    paddedContent: { paddingHorizontal: spacing.base, paddingBottom: spacing['4xl'] },
    padContent: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: 680,
    },
  });
}
