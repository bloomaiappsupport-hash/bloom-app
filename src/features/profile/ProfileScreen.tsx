import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { authService } from '../../services/supabase';
import { GlassCard, GradientButton, ScreenContainer } from '../../components/common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

function IcBell({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
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

function IcMoon({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function IcSun({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.8" />
      <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" />
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

function IcUpload({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Polyline points="17 8 12 3 7 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
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

function IcDoc({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="8" y1="17" x2="16" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
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

function IcStar({ color = '#fff' }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
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

type IconComp = React.FC<{ color?: string }>;

function SettingRow({ Icon, label, value, onPress, toggle, toggleValue }: {
  Icon: IconComp;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
}) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={toggle && onPress === undefined}>
      <View style={styles.settingRow}>
        <View style={styles.settingLeft}>
          <View style={styles.settingIconWrap}>
            <Icon color={colors.textSecondary} />
          </View>
          <Text style={styles.settingLabel}>{label}</Text>
        </View>
        {toggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onPress}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={toggleValue ? colors.primary : colors.textMuted}
          />
        ) : (
          <View style={styles.settingRight}>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            <IcChevron color={colors.textMuted} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isDark } = useThemeStore();
  const { profile, plan, reset } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { habits } = useHabitStore();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const isPremium = plan === 'premium';

  const handleSignOut = () => {
    Alert.alert('Çıkış Yap', 'Hesabından çıkış yapmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await authService.signOut();
          reset();
        },
      },
    ]);
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'BL';

  return (
    <ScreenContainer scrollable>
      <View style={styles.profileHeader}>
        <LinearGradient colors={[colors.primary, colors.primaryDim]} style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile?.name || 'Kullanıcı'}</Text>
          {isPremium ? (
            <LinearGradient colors={[colors.gold, '#FB8500']} style={styles.premiumBadge}>
              <IcDiamond color="#fff" />
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.freePlanText}>Ücretsiz Plan</Text>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statNum}>{habits.length}</Text>
          <Text style={styles.statLabel}>Alışkanlık</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statNum}>{profile?.bloom_level ?? 1}</Text>
          <Text style={styles.statLabel}>Bloom Seviye</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statNum}>12</Text>
          <Text style={styles.statLabel}>Gün Serisi</Text>
        </GlassCard>
      </View>

      {!isPremium && (
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
              <Text style={styles.premiumCtaBadgeText}>PREMIUM</Text>
            </View>
          </View>
          <Text style={styles.premiumCtaTitle}>BLOOM Premium</Text>
          <Text style={styles.premiumCtaSub}>Sınırsız AI koçluk, streak kalkanları ve detaylı Habit DNA</Text>
          <GradientButton
            label="Premium'a Geç"
            onPress={() => navigation.navigate('Paywall')}
            gradient={['#8B5CF6', '#6D28D9', '#4C1D95']}
            style={styles.premiumBtn}
          />
        </LinearGradient>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TERCİHLER</Text>
        <GlassCard>
          <SettingRow
            Icon={IcBell}
            label="Bildirimler"
            toggle
            toggleValue={notificationsOn}
            onPress={() => setNotificationsOn(!notificationsOn)}
          />
          <View style={styles.divider} />
          <SettingRow Icon={IcGlobe} label="Dil" value="Türkçe" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow
            Icon={IcMoon}
            label="Tema"
            value="Karanlık"
            onPress={() => {}}
          />
        </GlassCard>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HESAP</Text>
        <GlassCard>
          <SettingRow Icon={IcLock} label="Şifremi Değiştir" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow Icon={IcUpload} label="Verilerimi Dışa Aktar" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow Icon={IcTrash} label="Hesabımı Sil" onPress={() => {}} />
        </GlassCard>
      </View>

      <View style={styles.section}>
        <GlassCard>
          <SettingRow Icon={IcDoc} label="Kullanım Şartları" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow Icon={IcShield} label="Gizlilik Politikası" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow Icon={IcStar} label="Uygulamayı Değerlendir" onPress={() => {}} />
        </GlassCard>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn} activeOpacity={0.8}>
        <Text style={styles.signOutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <Text style={styles.version}>BLOOM v1.0.0</Text>
    </ScreenContainer>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.base, paddingTop: spacing.xl, marginBottom: spacing.xl },
    avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 26, fontWeight: '800' },
    profileInfo: { gap: spacing.xs },
    profileName: { ...typography.h2, color: colors.textPrimary },
    premiumBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
    premiumBadgeText: { ...typography.captionBold, color: '#fff', letterSpacing: 1 },
    freePlanText: { ...typography.caption, color: colors.textMuted },

    statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
    statCard: { flex: 1, padding: spacing.md, alignItems: 'center', gap: 4 },
    statNum: { ...typography.h2, color: colors.textPrimary },
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
  });
}
