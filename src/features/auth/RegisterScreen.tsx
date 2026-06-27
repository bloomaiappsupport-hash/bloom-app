import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { authService } from '../../services/supabase';
import { GradientButton } from '../../components/common';

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalı.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Onay Gerekli', 'Devam etmek için Kullanım Koşulları ve Gizlilik Politikasını kabul etmelisin.');
      return;
    }
    setLoading(true);
    const { error } = await authService.signUpWithEmail(email.trim(), password, { data: { name: name.trim() } });
    setLoading(false);
    if (error) Alert.alert('Hata', error.message);
    else Alert.alert('Başarılı', 'Hesabın oluşturuldu! E-postanı doğrula ve giriş yap.');
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
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>Bloom'u inşa etmeye başla</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>İsim</Text>
              <TextInput
                style={[styles.input, focused === 'name' && styles.inputFocused]}
                value={name}
                onChangeText={setName}
                placeholder="Adın"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>E-posta</Text>
              <TextInput
                style={[styles.input, focused === 'email' && styles.inputFocused]}
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@mail.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                style={[styles.input, focused === 'pw' && styles.inputFocused]}
                value={password}
                onChangeText={setPassword}
                placeholder="En az 6 karakter"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                onFocus={() => setFocused('pw')}
                onBlur={() => setFocused(null)}
              />
            </View>

            {/* Terms checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setTermsAccepted(v => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                <Text style={styles.termsLink}>Kullanım Koşulları</Text>
                <Text> ve </Text>
                <Text style={styles.termsLink}>Gizlilik Politikasını</Text>
                <Text> okudum, kabul ediyorum</Text>
              </Text>
            </TouchableOpacity>

            <GradientButton
              label="Hesap Oluştur"
              onPress={handleRegister}
              loading={loading}
              style={[styles.registerBtn, !termsAccepted && styles.registerBtnDisabled]}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Giriş Yap</Text>
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
