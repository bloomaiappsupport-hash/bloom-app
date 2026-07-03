import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import Svg, { Path, G, Rect, Circle } from 'react-native-svg';
import { AuthStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { authService } from '../../services/supabase';
import { GradientButton } from '../../components/common';
import { getErrorMessage } from '../../utils/errorMessage';

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </Svg>
  );
}

function AppleIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 814 1000">
      <Path
        fill={color}
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.1 0 112.4-50.1 190.5-50.1 30.8 0 110.6 2.6 167.3 100.6zm-180.5-168.8c27.4-36.1 48.5-86.5 48.5-136.9 0-7.1-.6-14.3-1.9-20.1-45.9 1.9-99.7 30.8-132.4 72.8-24.6 29.8-49.1 80.2-49.1 131.3 0 7.7.6 15.4 1.3 17.9 3.2.6 8.4 1.3 13.6 1.3 41.5 0 93.9-27.8 120-66.3z"
      />
    </Svg>
  );
}

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;

interface StrengthResult {
  score: number;
  labelKey: string;
  colorVal: string;
  requirementKeys: { key: string; met: boolean }[];
}

function getPasswordStrength(pw: string): StrengthResult {
  const checks = {
    length:    pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    number:    /[0-9]/.test(pw),
    special:   /[^A-Za-z0-9]/.test(pw),
  };

  const score = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;

  const requirementKeys = [
    { key: 'password.req_length', met: checks.length },
    { key: 'password.req_upper',  met: checks.uppercase },
    { key: 'password.req_number', met: checks.number },
    { key: 'password.req_special', met: checks.special },
  ];

  const levels: [number, string, string][] = [
    [1, 'password.veryWeak',  '#EF4444'],
    [2, 'password.weak',      '#F97316'],
    [3, 'password.medium',    '#EAB308'],
    [4, 'password.strong',    '#22C55E'],
    [5, 'password.veryStrong','#22C55E'],
  ];

  const [, labelKey, colorVal] = levels[Math.max(0, Math.min(score - 1, 4))] ?? ['', 'password.veryWeak', '#EF4444'];
  return { score, labelKey, colorVal, requirementKeys };
}

function PasswordStrengthBar({ password, showMissing }: { password: string; showMissing: boolean }) {
  const { t } = useTranslation();
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <View style={barStyles.wrap}>
      <View style={barStyles.bars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[
              barStyles.segment,
              { backgroundColor: i <= strength.score ? strength.colorVal : colors.border },
            ]}
          />
        ))}
      </View>

      <Text style={[barStyles.label, { color: strength.colorVal }]}>{t(strength.labelKey)}</Text>

      {showMissing && (
        <View style={barStyles.missingWrap}>
          {strength.requirementKeys.map((r) => (
            <View key={r.key} style={barStyles.missingRow}>
              <Text style={[barStyles.missingIcon, { color: r.met ? '#22C55E' : '#EF4444' }]}>
                {r.met ? '✓' : '·'}
              </Text>
              <Text style={[barStyles.missingText, { color: r.met ? '#22C55E' : '#EF4444' }]}>
                {t(r.key)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const barStyles = StyleSheet.create({
  wrap:        { marginTop: spacing.sm, gap: 6, width: '100%' },
  bars:        { flexDirection: 'row', gap: 4 },
  segment:     { flex: 1, height: 3, borderRadius: 2 },
  label:       { ...typography.caption, fontWeight: '600', alignSelf: 'flex-end', marginTop: -2 },
  missingWrap: { marginTop: 4, gap: 2 },
  missingRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  missingIcon: { fontSize: 14, lineHeight: 18, fontWeight: '700', width: 14 },
  missingText: { ...typography.caption },
});

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (e: any) {
      const { statusCodes } = await import('@react-native-google-signin/google-signin');
      if (e?.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert(t('auth.loginFailed'), getErrorMessage(e, t));
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await authService.signInWithApple();
    } catch (e: any) {
      if (e?.code !== 'ERR_CANCELED') {
        Alert.alert(t('auth.loginFailed'), getErrorMessage(e, t));
      }
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return;

    if (strength.score < 3) {
      setShowPasswordHints(true);
      return;
    }

    if (!termsAccepted) {
      Alert.alert(t('auth.termsAccept'), t('auth.termsPrefix') + t('auth.termsText') + ' & ' + t('auth.privacyText'));
      return;
    }

    setLoading(true);
    const { error } = await authService.signUpWithEmail(email.trim(), password, { data: { name: name.trim() } });
    setLoading(false);
    if (error) Alert.alert(t('common.error'), getErrorMessage(error, t));
  };

  const isPad = Platform.OS === 'ios' && Platform.isPad;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <LinearGradient colors={['#0D0824', colors.bg]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={[isPad && { alignSelf: 'center', width: '100%', maxWidth: 440 }]}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('auth.signUp')}</Text>
            <Text style={styles.subtitle}>{t('auth.signUpSubtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('auth.name')}</Text>
              <TextInput
                style={[styles.input, focused === 'name' && styles.inputFocused]}
                value={name}
                onChangeText={setName}
                placeholder={t('auth.namePlaceholder')}
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('auth.email')}</Text>
              <TextInput
                style={[styles.input, focused === 'email' && styles.inputFocused]}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t('auth.password')}</Text>
              <TextInput
                style={[styles.input, focused === 'pw' && styles.inputFocused]}
                value={password}
                onChangeText={(val) => { setPassword(val); setShowPasswordHints(false); }}
                placeholder={t('auth.passwordMinHint')}
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused(null)}
              />
              <PasswordStrengthBar password={password} showMissing={showPasswordHints} />
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setTermsAccepted(v => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                <Text style={styles.termsLink}>{t('auth.termsText')}</Text>
                <Text>{t('auth.termsPrefix')}</Text>
                <Text style={styles.termsLink}>{t('auth.privacyText')}</Text>
                <Text> {t('auth.termsAccept')}</Text>
              </Text>
            </TouchableOpacity>

            <GradientButton
              label={t('auth.signUp')}
              onPress={handleRegister}
              loading={loading}
              style={[styles.registerBtn, !termsAccepted && styles.registerBtnDisabled]}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('common.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialArea}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={handleGoogleSignIn}>
              <GoogleIcon size={20} />
              <Text style={styles.socialBtnText}>{t('auth.continueWithGoogle')}</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity style={[styles.socialBtn, styles.appleBtnStyle]} activeOpacity={0.8} onPress={handleAppleSignIn}>
                <AppleIcon size={20} color="#fff" />
                <Text style={[styles.socialBtnText, { color: '#fff' }]}>{t('auth.continueWithApple')}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.hasAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
    paddingTop: spacing['2xl'],
  },
  header: { marginBottom: spacing['2xl'] },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary },
  form: { gap: spacing.base },
  inputWrapper: { gap: spacing.xs },
  inputLabel: { ...typography.smallMedium, color: colors.textSecondary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    ...typography.body,
    lineHeight: undefined,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  termsText: {
    ...typography.small,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  registerBtn: { marginTop: spacing.sm },
  registerBtnDisabled: { opacity: 0.5 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  socialArea: {
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.xl,
    paddingVertical: 15,
  },
  appleBtnStyle: {
    backgroundColor: '#000000',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  socialBtnText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  footerText: { ...typography.small, color: colors.textSecondary },
  footerLink: { ...typography.smallMedium, color: colors.primary },
});
