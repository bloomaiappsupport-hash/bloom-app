import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, G, Rect, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthStackParamList, RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { authService } from '../../services/supabase';
import { GradientButton } from '../../components/common';
import BloomLogo from '../../components/common/BloomLogo';
import { getErrorMessage } from '../../utils/errorMessage';

type Nav = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Login'>,
  StackNavigationProp<RootStackParamList>
>;

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

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await authService.signInWithEmail(email.trim(), password);
    setLoading(false);
    if (error) Alert.alert(t('auth.loginFailed'), getErrorMessage(error, t));
  };

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

  const isPad = Platform.OS === 'ios' && Platform.isPad;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <LinearGradient colors={['#0E0726', colors.bg]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={[isPad && { alignSelf: 'center', width: '100%', maxWidth: 440 }]}
          contentContainerStyle={[styles.scroll, isPad && { flexGrow: 1, justifyContent: 'center', paddingBottom: spacing['4xl'] }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoArea}>
            <BloomLogo size={72} />
            <Text style={styles.appName}>BLOOM</Text>
            <Text style={styles.welcomeText}>{t('auth.welcome')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
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

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('auth.password')}</Text>
              <TextInput
                style={[styles.input, focused === 'pw' && styles.inputFocused]}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            <GradientButton
              label={t('auth.signIn')}
              onPress={handleLogin}
              loading={loading}
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

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>{t('auth.noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Assessment')}>
              <Text style={styles.registerLink}>{t('auth.signUp')}</Text>
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
    paddingBottom: spacing['2xl'],
  },
  logoArea: {
    alignItems: 'center',
    paddingTop: spacing['2xl'],
    marginBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  appName: {
    ...typography.h2,
    color: colors.textPrimary,
    letterSpacing: 6,
  },
  welcomeText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingBottom: spacing.sm,
  },
  forgotText: {
    ...typography.small,
    color: colors.primary,
  },
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
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
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.smallMedium,
    color: colors.primary,
  },
});
