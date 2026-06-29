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
import { AuthStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { authService } from '../../services/supabase';
import { GradientButton } from '../../components/common';

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
    if (error) Alert.alert(t('common.error'), error.message);
    else Alert.alert(t('common.done'), t('auth.sentMessage', { email }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <LinearGradient colors={['#0D0824', colors.bg]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
  },
  footerText: { ...typography.small, color: colors.textSecondary },
  footerLink: { ...typography.smallMedium, color: colors.primary },
});
