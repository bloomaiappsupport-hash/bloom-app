import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { authService } from '../../services/supabase';
import { GradientButton } from '../../components/common';

type Nav = StackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
type Route = RouteProp<AuthStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation();
  const { email } = route.params;
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    const { error } = await authService.resendVerificationEmail(email);
    setLoading(false);
    if (error) {
      Alert.alert(t('common.error'), error.message);
    } else {
      Alert.alert(t('common.done'), t('auth.verifyResendSuccess'));
    }
  };

  const isPad = Platform.OS === 'ios' && Platform.isPad;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <LinearGradient colors={['#0D0824', colors.bg]} style={StyleSheet.absoluteFill} />
      <View style={[styles.container, isPad && { alignSelf: 'center', width: '100%', maxWidth: 440 }]}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>✉️</Text>
        </View>

        <Text style={styles.title}>{t('auth.verifyTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.verifySubtitle', { email })}</Text>

        <GradientButton
          label={t('auth.verifyResend')}
          onPress={handleResend}
          loading={loading}
          style={styles.resendBtn}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backBtn}>
          <Text style={styles.backText}>{t('auth.verifyBackToLogin')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  resendBtn: {
    width: '100%',
  },
  backBtn: {
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  backText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
