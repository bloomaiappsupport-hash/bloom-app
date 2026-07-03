import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing, radius } from '../../theme';
import { authService } from '../../services/supabase';
import { GradientButton } from '../../components/common';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await authService.resetPassword(email.trim());
    setLoading(false);
    if (error) Alert.alert(t('common.error'), error.message);
    else setSent(true);
  };

  const isPad = Platform.OS === 'ios' && Platform.isPad;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0D0824', colors.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={[styles.container, isPad && { alignSelf: 'center', width: '100%', maxWidth: 440, flex: 1 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{t('auth.backBtn')}</Text>
          </TouchableOpacity>

          <View style={isPad ? { flex: 1, justifyContent: 'center', paddingBottom: 100 } : { flex: 1 }}>
            {!sent ? (
              <>
                <Text style={styles.title}>{t('auth.forgotTitle')}</Text>
                <Text style={styles.subtitle}>{t('auth.forgotSubtitle')}</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>{t('auth.email')}</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t('auth.emailPlaceholder')}
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <GradientButton label={t('auth.sendLink')} onPress={handleReset} loading={loading} style={styles.btn} />
              </>
            ) : (
              <View style={styles.sentArea}>
                <Text style={styles.sentIcon}>📬</Text>
                <Text style={styles.sentTitle}>{t('auth.sentTitle')}</Text>
                <Text style={styles.sentSub}>{t('auth.sentMessage', { email })}</Text>
                <GradientButton label={t('auth.backToLogin')} onPress={() => navigation.goBack()} style={styles.btn} />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.base },
  backBtn: { paddingTop: Platform.OS === 'ios' ? (Platform.isPad ? 16 : 60) : 16, paddingBottom: spacing['2xl'] },
  backText: { ...typography.bodyMedium, color: colors.textSecondary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing['2xl'], lineHeight: 24 },
  inputWrapper: { gap: spacing.xs, marginBottom: spacing.base },
  inputLabel: { ...typography.smallMedium, color: colors.textSecondary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  btn: { marginTop: spacing.sm },
  sentArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.base },
  sentIcon: { fontSize: 64 },
  sentTitle: { ...typography.h2, color: colors.textPrimary },
  sentSub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
