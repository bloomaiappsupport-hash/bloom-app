import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Linking, Modal,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { useLanguageStore } from '../../stores/languageStore';
import { authService } from '../../services/supabase';
import { GlassCard, GradientButton, ScreenContainer } from '../../components/common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

const NOTIF_KEY = '@bloom_notifications_enabled';
const PRIVACY_URL = 'https://bloomaiappsupport-hash.github.io/Bloom-Website/privacy.html';
const TERMS_URL   = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

// ─── Icons ───────────────────────────────────────────────────────────────────

function IcBell({ color = '#fff', glowing = false }: { color?: string; glowing?: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={glowing ? '#A78BFA' : color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={glowing ? '#A78BFA' : color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcGlobe({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function IcLock({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1.5" fill={color} />
    </Svg>
  );
}

function IcTrash({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcShield({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function IcDiamond({ color = '#fff' }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M2 12l10-10 10 10-10 10L2 12z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  );
}

function IcChevron({ color = '#fff' }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Custom Notification Toggle ───────────────────────────────────────────────

function NotificationToggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 90,
      friction: 7,
    }).start();
  }, [value]);

  const thumbTranslate = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 24] });
  const trackOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85}>
      <View style={toggleStyles.wrapper}>
        {/* Off track */}
        <View style={toggleStyles.trackOff} />
        {/* On track (purple gradient via opacity) */}
        <Animated.View style={[toggleStyles.trackOn, { opacity: trackOpacity }]} />
        {/* Thumb */}
        <Animated.View style={[toggleStyles.thumb, { transform: [{ translateX: thumbTranslate }] }]} />
      </View>
    </TouchableOpacity>
  );
}

const toggleStyles = StyleSheet.create({
  wrapper: { width: 52, height: 30, justifyContent: 'center' },
  trackOff: {
    position: 'absolute', width: 52, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  trackOn: {
    position: 'absolute', width: 52, height: 30, borderRadius: 15,
    backgroundColor: '#7C3AED',
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)',
  },
  thumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2,
    elevation: 2,
  },
});

// ─── Password Change Modal ────────────────────────────────────────────────────

function getPasswordStrength(pw: string) {
  const score = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#22C55E'];
  const keys = ['password.veryWeak', 'password.weak', 'password.medium', 'password.strong', 'password.veryStrong'];
  const idx = Math.max(0, Math.min(score - 1, 4));
  return { score, colorVal: colors[idx], labelKey: keys[idx] };
}

function PasswordStrengthBar({ password }: { password: string }) {
  const { t } = useTranslation();
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  if (!password) return null;
  return (
    <View style={pwBarStyles.wrap}>
      <View style={pwBarStyles.bars}>
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} style={[pwBarStyles.segment, { backgroundColor: i <= strength.score ? strength.colorVal : '#1E1E3A' }]} />
        ))}
      </View>
      <Text style={[pwBarStyles.label, { color: strength.colorVal }]}>{t(strength.labelKey)}</Text>
    </View>
  );
}

const pwBarStyles = StyleSheet.create({
  wrap:    { marginTop: spacing.sm, gap: 6, width: '100%' },
  bars:    { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 3, borderRadius: 2 },
  label:   { ...typography.caption, fontWeight: '600', alignSelf: 'flex-end', marginTop: -2 },
});

function PasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      setNewPassword(''); setConfirm(''); setError(''); setSuccess(false);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (newPassword.length < 6) { setError(t('profile.passwordModal.minLength')); return; }
    if (newPassword !== confirm) { setError(t('profile.passwordModal.mismatch')); return; }
    setError(''); setLoading(true);
    const { error: err } = await authService.updatePassword(newPassword);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(onClose, 1400);
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose} supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Animated.View style={[modalStyles.overlay, { opacity: fadeAnim }]}>
          <Animated.View style={[modalStyles.card, { backgroundColor: '#120830', transform: [{ scale: scaleAnim }] }]}>
            <Text style={modalStyles.title}>{t('profile.passwordModal.title')}</Text>

            <View style={pwStyles.inputWrapper}>
              <TextInput
                style={pwStyles.input}
                placeholder={t('profile.passwordModal.newPassword')}
                placeholderTextColor="rgba(196,181,253,0.35)"
                secureTextEntry
                value={newPassword}
                onChangeText={v => { setNewPassword(v); setError(''); }}
              />
            </View>

            <PasswordStrengthBar password={newPassword} />

            <View style={[pwStyles.inputWrapper, { marginTop: 10 }]}>
              <TextInput
                style={pwStyles.input}
                placeholder={t('profile.passwordModal.confirm')}
                placeholderTextColor="rgba(196,181,253,0.35)"
                secureTextEntry
                value={confirm}
                onChangeText={v => { setConfirm(v); setError(''); }}
              />
            </View>

            {error ? <Text style={pwStyles.error}>{error}</Text> : null}
            {success ? <Text style={pwStyles.successText}>{t('profile.passwordModal.updated')}</Text> : null}

            <View style={[modalStyles.btnRow, { marginTop: 24 }]}>
              <TouchableOpacity style={modalStyles.btnCancel} onPress={onClose} activeOpacity={0.8}>
                <Text style={modalStyles.btnCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btnConfirm, { borderColor: 'rgba(139,92,246,0.6)' }]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator size="small" color="#8B5CF6" />
                  : <Text style={[modalStyles.btnConfirmText, { color: '#8B5CF6' }]}>{t('common.save')}</Text>
                }
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const pwStyles = StyleSheet.create({
  inputWrapper: {
    width: '100%', height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.25)',
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    color: '#EDE9FE', fontSize: 15,
  },
  error: { color: '#F87171', fontSize: 13, marginTop: 10, textAlign: 'center' },
  successText: { color: '#34D399', fontSize: 13, marginTop: 10, textAlign: 'center', fontWeight: '600' },
});

// ─── Custom Modal ─────────────────────────────────────────────────────────────

type ModalConfig = {
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: string;
  onConfirm: () => void;
  cancelText?: string;
  singleAction?: boolean;
};

function BloomModal({ config, onClose }: { config: ModalConfig | null; onClose: () => void }) {
  const colors = useColors();
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (config) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [config]);

  if (!config) return null;

  const handleConfirm = () => {
    onClose();
    setTimeout(() => config.onConfirm(), 150);
  };

  return (
    <Modal transparent animationType="none" visible={!!config} onRequestClose={onClose} supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
      <Animated.View style={[modalStyles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[
          modalStyles.card,
          { backgroundColor: '#120830', transform: [{ scale: scaleAnim }] }
        ]}>
          <Text style={modalStyles.title}>{config.title}</Text>
          <Text style={modalStyles.message}>{config.message}</Text>
          <View style={[modalStyles.btnRow, config.singleAction && { justifyContent: 'center' }]}>
            {!config.singleAction && (
              <TouchableOpacity style={modalStyles.btnCancel} onPress={onClose} activeOpacity={0.8}>
                <Text style={modalStyles.btnCancelText}>{config.cancelText ?? t('common.cancel')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[modalStyles.btnConfirm, { borderColor: (config.confirmColor ?? '#8B5CF6') + '60' }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={[modalStyles.btnConfirmText, { color: config.confirmColor ?? '#8B5CF6' }]}>
                {config.confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 1, 20, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    alignItems: 'center',
  },
  iconWrap: { marginBottom: 16 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  iconDot: { width: 20, height: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: '700', color: '#EDE9FE', marginBottom: 10, textAlign: 'center', letterSpacing: 0.2 },
  message: { fontSize: 14, color: 'rgba(196,181,253,0.7)', textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  btnCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  btnCancelText: { fontSize: 15, fontWeight: '600', color: 'rgba(196,181,253,0.8)' },
  btnConfirm: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderWidth: 1,
    alignItems: 'center',
  },
  btnConfirmText: { fontSize: 15, fontWeight: '700' },
});

// ─── Setting Row ──────────────────────────────────────────────────────────────

type IconComp = React.FC<{ color?: string }>;

function SettingRow({ Icon, label, value, onPress, rightElement }: {
  Icon: IconComp;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={rightElement ? 1 : 0.7} disabled={!onPress && !rightElement}>
      <View style={styles.settingRow}>
        <View style={styles.settingLeft}>
          <View style={styles.settingIconWrap}>
            <Icon color={colors.textSecondary} />
          </View>
          <Text style={styles.settingLabel}>{label}</Text>
        </View>
        {rightElement ?? (
          <View style={styles.settingRight}>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            <IcChevron color={colors.textMuted} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { profile, plan, user, reset } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { habits, streaks, clear: clearHabits } = useHabitStore();
  const maxStreak = Object.values(streaks).reduce((max, s) => Math.max(max, s.current_streak || 0), 0);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [activeSku, setActiveSku] = useState<string | null>(null);
  const isYearly = activeSku === 'com.barangunduz.bloomhabit.yearly';
  const isMonthly = activeSku === 'com.barangunduz.bloomhabit.monthly';
  // Tek doğru kaynak = plan (App.tsx tarafından tablodan + süre kontrolüyle set edilir).
  // SecureStore SKU'su yalnızca hangi tarife olduğunu ETİKETLEMEK için kullanılır,
  // premium olup olmadığına karar vermek için DEĞİL (süresi dolmuş "hayalet aktif" olmasın).
  const isPremium = plan === 'premium';
  const planLabel = !isPremium
    ? t('profile.freePlan')
    : isYearly
      ? t('profile.planYearly')
      : t('profile.planMonthly');

  useEffect(() => {
    SecureStore.getItemAsync('bloom_active_plan_sku').then(sku => setActiveSku(sku));
  }, []);

  const showModal = (config: ModalConfig) => setModalConfig(config);
  const closeModal = () => setModalConfig(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(NOTIF_KEY);
      if (saved === 'false') {
        setNotificationsOn(false);
      } else {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
        setNotificationsOn(true);
        await AsyncStorage.setItem(NOTIF_KEY, 'true');
      }
    })();
  }, []);

  const handleNotificationToggle = async () => {
    if (!notificationsOn) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        setNotificationsOn(true);
        await AsyncStorage.setItem(NOTIF_KEY, 'true');
      } else {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus === 'granted') {
          setNotificationsOn(true);
          await AsyncStorage.setItem(NOTIF_KEY, 'true');
        } else {
          showModal({
            title: t('profile.notifPermission.title'),
            message: t('profile.notifPermission.message'),
            confirmText: t('profile.notifPermission.confirm'),
            singleAction: true,
            onConfirm: () => {},
          });
        }
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsOn(false);
      await AsyncStorage.setItem(NOTIF_KEY, 'false');
    }
  };

  const handleSignOut = () => {
    showModal({
      title: t('profile.signOutModal.title'),
      message: t('profile.signOutModal.message'),
      confirmText: t('profile.signOutModal.confirm'),
      confirmColor: '#F87171',
      onConfirm: async () => {
        await authService.signOut();
        clearHabits();
        reset();
      },
    });
  };

  const handleDeleteAccount = () => {
    showModal({
      title: t('profile.deleteModal.title'),
      message: t('profile.deleteModal.message'),
      confirmText: t('profile.deleteModal.confirm'),
      confirmColor: '#F87171',
      onConfirm: async () => {
        try {
          const { error } = await authService.deleteAccount();
          if (error) throw error;
          await SecureStore.deleteItemAsync('bloom_active_plan_sku');
          await authService.signOut();
          clearHabits();
          reset();
        } catch (err: any) {
          Alert.alert(
            t('common.error') || 'Hata',
            err.message || (language === 'tr' ? 'Hesap silinemedi. Lütfen tekrar deneyin.' : 'Could not delete account. Please try again.')
          );
        }
      },
    });
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'BL';

  return (
    <>
    <BloomModal config={modalConfig} onClose={closeModal} />
    <PasswordModal visible={passwordModalVisible} onClose={() => setPasswordModalVisible(false)} />
    <ScreenContainer scrollable>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <LinearGradient colors={[colors.primary, colors.primaryDim]} style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile?.name || t('profile.title')}</Text>
          {user?.email && <Text style={styles.profileEmail}>{user.email}</Text>}
          {isPremium ? (
            <View style={styles.planBadge}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 18h18M5 18l-2-9 5 4 4-7 4 7 5-4-2 9H5z"
                  stroke={isYearly ? '#FFB703' : '#A78BFA'}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={[styles.planBadgeText, { color: isYearly ? '#FFB703' : '#A78BFA' }]}>{planLabel}</Text>
            </View>
          ) : (
            <Text style={styles.freePlanText}>{planLabel}</Text>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statNum}>{habits.length}</Text>
          <Text style={styles.statLabel}>{t('profile.habitsCount')}</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statNum}>{profile?.bloom_level ?? 1}</Text>
          <Text style={styles.statLabel}>{t('profile.bloomLevel')}</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statNum}>{maxStreak}</Text>
          <Text style={styles.statLabel}>{t('profile.daySeries')}</Text>
        </GlassCard>
      </View>

      {/* Premium Card */}
      <LinearGradient
        colors={['#1E0A4A', '#150836', '#0D0527']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumCta}
      >
        <View style={styles.premiumCtaHeader}>
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path d="M2 19h20v2H2v-2z" fill="#A78BFA" />
            <Path d="M2 19l2.5-9 4.5 4L12 4l3 10 4.5-4L22 19H2z" fill="#7C3AED" stroke="#A78BFA" strokeWidth="1.2" strokeLinejoin="round" />
            <Circle cx="2.5" cy="10" r="1.5" fill="#C4B5FD" />
            <Circle cx="12" cy="4" r="1.5" fill="#C4B5FD" />
            <Circle cx="21.5" cy="10" r="1.5" fill="#C4B5FD" />
          </Svg>
          <View style={styles.premiumCtaBadge}>
            <Text style={styles.premiumCtaBadgeText}>{isPremium ? 'AKTİF' : 'PREMIUM'}</Text>
          </View>
        </View>
        <Text style={styles.premiumCtaTitle}>BLOOM Premium</Text>
        {isPremium ? (
          <>
            <Text style={styles.premiumCtaSub}>{planLabel} {t('profile.planActive')}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Paywall')}
              style={styles.manageSubBtn}
              activeOpacity={0.75}
            >
              <Text style={styles.manageSubText}>{t('profile.viewPlan')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.premiumCtaSub}>{t('profile.premiumSub')}</Text>
            <GradientButton
              label={t('profile.goPremium')}
              onPress={() => navigation.navigate('Paywall')}
              gradient={['#8B5CF6', '#6D28D9', '#4C1D95']}
              style={styles.premiumBtn}
            />
          </>
        )}
      </LinearGradient>

      {/* Tercihler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.sectionPreferences')}</Text>
        <GlassCard>
          <SettingRow
            Icon={(props) => <IcBell color={props.color} glowing={notificationsOn} />}
            label={t('profile.notifications')}
            rightElement={
              <NotificationToggle value={notificationsOn} onToggle={handleNotificationToggle} />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            Icon={IcGlobe}
            label={t('profile.language')}
            rightElement={
              <View style={styles.langToggleRow}>
                <TouchableOpacity
                  onPress={() => setLanguage('tr')}
                  style={[styles.langBtn, language === 'tr' && styles.langBtnActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.langBtnText, language === 'tr' && styles.langBtnTextActive]}>TR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLanguage('en')}
                  style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>EN</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </GlassCard>
      </View>

      {/* Hesap */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.sectionAccount')}</Text>
        <GlassCard>
          <SettingRow Icon={IcLock} label={t('profile.changePassword')} onPress={() => setPasswordModalVisible(true)} />
          <View style={styles.divider} />
          <SettingRow Icon={IcTrash} label={t('profile.deleteAccount')} onPress={handleDeleteAccount} />
        </GlassCard>
      </View>

      {/* Yasal */}
      <View style={styles.section}>
        <GlassCard>
          <SettingRow
            Icon={IcShield}
            label={t('profile.privacyPolicy')}
            onPress={() => Linking.openURL(PRIVACY_URL).catch(() => {})}
          />
          <View style={styles.divider} />
          <SettingRow
            Icon={IcShield}
            label={t('profile.termsOfService')}
            onPress={() => Linking.openURL(TERMS_URL).catch(() => {})}
          />
        </GlassCard>
      </View>

      {/* Sign Out */}
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn} activeOpacity={0.8}>
        <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{t('profile.version', { version: '1.0.2' })}</Text>
    </ScreenContainer>
    </>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.base, paddingTop: spacing.xl, marginBottom: spacing.xl },
    avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 26, fontWeight: '800' },
    profileInfo: { gap: spacing.xs },
    profileName: { ...typography.h2, color: colors.textPrimary },
    profileEmail: { fontSize: 13, color: colors.textMuted, marginTop: -2 },
    planBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(167,139,250,0.25)', backgroundColor: 'rgba(139,92,246,0.08)' },
    planBadgeText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
    freePlanText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
    manageSubBtn: { marginTop: spacing.sm, paddingVertical: 10, borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)', alignItems: 'center', backgroundColor: 'rgba(139,92,246,0.08)' },
    manageSubText: { ...typography.captionBold, color: '#A78BFA', letterSpacing: 0.5 },

    statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
    statCard: { flex: 1, padding: spacing.md, alignItems: 'center', gap: 4 },
    statNum: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
    statLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },

    premiumCta: {
      marginBottom: spacing.xl,
      padding: spacing.lg,
      gap: spacing.sm,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: 'rgba(139,92,246,0.5)',
      overflow: 'hidden',
    },
    premiumCtaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
    premiumCtaBadge: { backgroundColor: 'rgba(139,92,246,0.35)', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(167,139,250,0.5)' },
    premiumCtaBadgeText: { ...typography.captionBold, color: '#C4B5FD', letterSpacing: 1.5, fontSize: 10 },
    premiumCtaTitle: { ...typography.h2, color: '#EDE9FE', fontWeight: '800', marginBottom: spacing.xs },
    premiumCtaSub: { ...typography.small, color: '#A78BFA', lineHeight: 20, marginBottom: spacing.xs },
    premiumBtn: { marginTop: spacing.sm },

    section: { marginBottom: spacing.xl },
    sectionTitle: { ...typography.label, color: colors.textMuted, marginBottom: spacing.sm, letterSpacing: 1.2, fontSize: 11 },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.base },

    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.base },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    settingIconWrap: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    settingLabel: { ...typography.bodyMedium, color: colors.textPrimary },
    settingRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    settingValue: { ...typography.small, color: colors.textSecondary },

    signOutBtn: { alignItems: 'center', padding: spacing.base, marginBottom: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.error + '40' },
    signOutText: { ...typography.bodyMedium, color: colors.error },
    version: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginBottom: spacing['2xl'] },
    langToggleRow: { flexDirection: 'row', gap: 6 },
    langBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    langBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '20' },
    langBtnText: { ...typography.captionBold, color: colors.textSecondary },
    langBtnTextActive: { color: colors.primary },
  });
}
