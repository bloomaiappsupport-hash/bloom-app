import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radius } from '../../theme';
import { authService } from '../../services/supabase';
import { GradientButton } from '../../components/common';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await authService.resetPassword(email.trim());
    setLoading(false);
    if (error) Alert.alert('Hata', error.message);
    else setSent(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0D0824', colors.bg]} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>

        {!sent ? (
          <>
            <Text style={styles.title}>Şifreni Sıfırla</Text>
            <Text style={styles.subtitle}>
              E-posta adresini gir, sıfırlama bağlantısı gönderelim.
            </Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@mail.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <GradientButton label="Bağlantı Gönder" onPress={handleReset} loading={loading} style={styles.btn} />
          </>
        ) : (
          <View style={styles.sentArea}>
            <Text style={styles.sentIcon}>📬</Text>
            <Text style={styles.sentTitle}>Gönderildi!</Text>
            <Text style={styles.sentSub}>
              {email} adresine sıfırlama bağlantısı gönderdik. Gelen kutunu kontrol et.
            </Text>
            <GradientButton label="Giriş Ekranına Dön" onPress={() => navigation.goBack()} style={styles.btn} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.base },
  backBtn: { paddingTop: 60, paddingBottom: spacing['2xl'] },
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
