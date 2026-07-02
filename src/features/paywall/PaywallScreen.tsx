import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Linking, NativeModules, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useIAP, finishTransaction, type Purchase, type ProductSubscription } from 'react-native-iap';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../stores/authStore';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { GradientButton } from '../../components/common';
import { supabase } from '../../services/supabase/client';

const ACTIVE_PLAN_KEY = 'bloom_active_plan_sku';

const SKU_MONTHLY = 'com.barangunduz.bloomhabit.monthly';
const SKU_YEARLY = 'com.barangunduz.bloomhabit.yearly';

const hasTR = (s: string): boolean => {
  const l = (s ?? '').toLowerCase();
  return l === 'tr' || l.startsWith('tr-') || l.startsWith('tr_') || l.endsWith('-tr') || l.endsWith('_tr');
};
const getIsTurkish = (): boolean => {
  try {
    if (Platform.OS === 'ios') {
      const settings = (NativeModules.SettingsManager as any)?.settings ?? {};
      const langs: string[] = settings.AppleLanguages ?? [];
      const locale: string = settings.AppleLocale ?? settings.AppleLanguage ?? '';
      if (langs.some(hasTR)) return true;
      if (hasTR(locale)) return true;
    }
    if (typeof navigator !== 'undefined' && navigator.language && hasTR(navigator.language)) return true;
    const intlLocale = new Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    if (hasTR(intlLocale)) return true;
    return false;
  } catch {
    return false;
  }
};
const isTurkish = getIsTurkish();

const FEATURES = [
  { label: 'Sınırsız alışkanlık', free: '5 alışkanlık', premium: 'Sınırsız' },
  { label: 'AI Koç mesajı', free: '3/gün', premium: 'Sınırsız' },
  { label: 'Streak Kalkanı', free: '—', premium: '2/ay' },
  { label: 'Habit DNA raporu', free: 'Temel', premium: 'Detaylı + Paylaşım' },
  { label: 'Haftalık AI raporu', free: '—', premium: 'Her hafta' },
  { label: 'Veri geçmişi', free: '30 gün', premium: 'Sınırsız' },
];

const FALLBACK = {
  monthly: { price: isTurkish ? '₺99,99' : '$8.99', period: isTurkish ? '/ay' : '/mo', monthly: null, badge: null },
  yearly: { price: isTurkish ? '₺799,99' : '$59.99', period: isTurkish ? '/yıl' : '/yr', monthly: isTurkish ? '₺66,7/ay' : '$5.00/mo', badge: isTurkish ? '%33 İndirim' : '44% Off' },
};

function getLocalizedPrice(sub: ProductSubscription | undefined, fallback: string): string {
  return sub?.localizedPrice ?? fallback;
}

function getYearlyMonthly(sub: ProductSubscription | undefined, fallback: string): string {
  if (!sub || !sub.price) return fallback;
  const cleaned = sub.price.replace(/[^\d.,]/g, '').replace(',', '.');
  const raw = parseFloat(cleaned);
  if (isNaN(raw) || raw <= 0) return fallback;
  const monthly = (raw / 12).toFixed(1);
  const suffix = isTurkish ? '/ay' : '/mo';
  return `${sub.currency === 'TRY' ? '₺' : '$'}${monthly}${suffix}`;
}

function IcClose({ color = '#fff' }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function IcDiamond({ size = 32, color = '#ffffff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 12l10-10 10 10-10 10L2 12z" stroke={color} strokeWidth="1.8"
        strokeLinejoin="round" fill={color + '20'} />
      <Path d="M2 12h20M12 2l-4 10h8L12 2z" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export default function PaywallScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [activeSku, setActiveSku] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(ACTIVE_PLAN_KEY).then(val => {
      if (val) {
        setActiveSku(val);
        if (val === SKU_MONTHLY) setSelectedPlan('monthly');
        else if (val === SKU_YEARLY) setSelectedPlan('yearly');
      }
    });
  }, []);

  const handlePurchaseSuccess = useCallback(async (purchase: Purchase) => {
    try {
      await finishTransaction({ purchase, isConsumable: false });
      // If already stored as active, finish silently (pending transaction replay)
      const alreadyActive = await SecureStore.getItemAsync(ACTIVE_PLAN_KEY);
      if (alreadyActive === purchase.productId) {
        setLoading(false);
        return;
      }
      // Premium'u İSTEMCİ yazmaz. Apple imzalı fişi sunucuya gönderip
      // doğrulatıyoruz; tabloya yalnızca doğrulanan sonucu sunucu yazar.
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-purchase', {
        body: {
          platform: Platform.OS,
          purchaseToken:
            (purchase as any).purchaseToken ??
            (purchase as any).jwsRepresentationIos ??
            (purchase as any).jwsRepresentation,
        },
      });

      if (verifyError || verifyData?.plan !== 'premium') {
        // Doğrulama başarısız → premium VERME.
        setLoading(false);
        Alert.alert(
          isTurkish ? 'Doğrulama başarısız' : 'Verification failed',
          isTurkish
            ? 'Satın alman doğrulanamadı. Ödeme alındıysa uygulamayı yeniden başlatıp "Satın alımları geri yükle"yi dene.'
            : 'Your purchase could not be verified. If you were charged, restart the app and use "Restore purchases".',
        );
        return;
      }

      // Sunucu premium'u onayladı ve tabloya yazdı. İstemci sadece UX için önbelleğe alır.
      await SecureStore.setItemAsync(ACTIVE_PLAN_KEY, purchase.productId);
      setActiveSku(purchase.productId);
      useAuthStore.getState().setPlan('premium');
      setLoading(false);
      Alert.alert(
        isTurkish ? 'Başarılı!' : 'Success!',
        isTurkish ? 'Premium üyeliğin aktif edildi.' : 'Your premium membership is now active.',
        [{ text: isTurkish ? 'Harika!' : 'Great!', onPress: () => {
          if (navigation.canGoBack()) navigation.goBack();
          else navigation.navigate('Main');
        } }],
      );
    } catch (e) {
      setLoading(false);
    }
  }, [navigation]);

  const { connected, subscriptions, requestPurchase, fetchProducts, getAvailablePurchases } = useIAP({
    onPurchaseSuccess: handlePurchaseSuccess,
    onPurchaseError: (error) => {
      setLoading(false);
      // Kullanıcı vazgeçtiyse hata gösterme. v15 iptal kodu/mesajı farklı
      // biçimlerde gelebildiği için hepsini yakalıyoruz.
      const code = String((error as any)?.code ?? '').toLowerCase();
      const msg = String(error?.message ?? '').toLowerCase();
      const isCancel = code.includes('cancel') || msg.includes('cancel');
      if (!isCancel) {
        Alert.alert(
          isTurkish ? 'Hata' : 'Error',
          error.message ?? (isTurkish ? 'Satın alma başarısız.' : 'Purchase failed.'),
        );
      }
    },
  });

  useEffect(() => {
    if (connected) {
      fetchProducts({ skus: [SKU_MONTHLY, SKU_YEARLY], type: 'subs' });
    }
  }, [connected, fetchProducts]);

  const { plan } = useAuthStore();
  const subMonthly = subscriptions.find(s => s.id === SKU_MONTHLY);
  const subYearly = subscriptions.find(s => s.id === SKU_YEARLY);

  const isActivePlan = (sku: string) => plan === 'premium' && activeSku === sku;
  const hasActivePlan = plan === 'premium' && activeSku !== null;

  const PLANS = [
    {
      id: 'monthly', sku: SKU_MONTHLY,
      label: isTurkish ? 'Aylık' : 'Monthly',
      price: getLocalizedPrice(subMonthly, FALLBACK.monthly.price),
      period: FALLBACK.monthly.period,
      monthly: null,
      badge: null,
      recommended: false,
    },
    {
      id: 'yearly', sku: SKU_YEARLY,
      label: isTurkish ? 'Yıllık' : 'Yearly',
      price: getLocalizedPrice(subYearly, FALLBACK.yearly.price),
      period: FALLBACK.yearly.period,
      monthly: getYearlyMonthly(subYearly, FALLBACK.yearly.monthly!),
      badge: FALLBACK.yearly.badge,
      recommended: true,
    },
  ];

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const plan = PLANS.find(p => p.id === selectedPlan)!;
    if (!connected) {
      Alert.alert(isTurkish ? 'Bağlantı hatası' : 'Connection error', isTurkish ? 'App Store\'a bağlanılamadı.' : 'Could not connect to App Store.');
      return;
    }
    setLoading(true);
    try {
      await requestPurchase({
        type: 'subs',
        request: { apple: { sku: plan.sku } },
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      const purchases = await getAvailablePurchases();
      let restored = false;
      for (const p of (purchases ?? [])) {
        const { data } = await supabase.functions.invoke('verify-purchase', {
          body: {
            platform: Platform.OS,
            purchaseToken:
              (p as any).purchaseToken ??
              (p as any).jwsRepresentationIos ??
              (p as any).jwsRepresentation,
          },
        });
        if (data?.plan === 'premium') {
          await SecureStore.setItemAsync(ACTIVE_PLAN_KEY, p.productId);
          setActiveSku(p.productId);
          useAuthStore.getState().setPlan('premium');
          restored = true;
        }
      }
      setLoading(false);
      Alert.alert(
        isTurkish ? 'Geri Yükleme' : 'Restore',
        restored
          ? (isTurkish ? 'Premium üyeliğin geri yüklendi.' : 'Your premium membership has been restored.')
          : (isTurkish ? 'Aktif bir abonelik bulunamadı.' : 'No active subscription found.'),
      );
    } catch {
      setLoading(false);
    }
  };

  const EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
  const PRIVACY_URL = 'https://bloomaiappsupport-hash.github.io/Bloom-Website/privacy.html';
  const openURL = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1A0533', '#0D0622', colors.bg]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} activeOpacity={0.7}>
          <IcClose color={colors.textMuted} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.orbWrap}>
              <LinearGradient colors={[colors.primary, colors.primaryDim]} style={styles.orb}>
                <IcDiamond size={36} color="#fff" />
              </LinearGradient>
              <View style={styles.orbGlow} />
            </View>
            <Text style={styles.heroTitle}>BLOOM Premium</Text>
            <Text style={styles.heroSub}>
              Alışkanlık yolculuğunu{'\n'}bir üst seviyeye taşı
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featureTable}>
            <View style={styles.featureHeader}>
              <View style={{ flex: 1 }} />
              <Text style={styles.featureColFree}>Ücretsiz</Text>
              <Text style={[styles.featureColPremium, { color: colors.primary }]}>Premium</Text>
            </View>
            {FEATURES.map((f, i) => (
              <View key={i} style={[styles.featureRow, i % 2 === 0 && styles.featureRowAlt]}>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureFree}>{f.free}</Text>
                <View style={styles.featurePremiumCell}>
                  <Text style={f.premium === '—' ? styles.featureFree : [styles.featurePremiumText, { color: colors.primary }]}>
                    {f.premium}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Plan selector */}
          <View style={styles.planRow}>
            {PLANS.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => { setSelectedPlan(p.id as 'yearly' | 'monthly'); Haptics.selectionAsync(); }}
                activeOpacity={0.85}
                style={[styles.planCard, selectedPlan === p.id && styles.planCardSelected, isActivePlan(p.sku) && styles.planCardActive]}
              >
                {isActivePlan(p.sku) ? (
                  <View style={[styles.planBadge, styles.planBadgeActive]}>
                    <Text style={styles.planBadgeText}>✓ Aktif</Text>
                  </View>
                ) : (
                  p.recommended && (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{p.badge}</Text>
                    </View>
                  )
                )}
                {selectedPlan === p.id && (
                  <LinearGradient
                    colors={[colors.primary + '25', colors.primaryDim + '10']}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Text style={[styles.planLabel, selectedPlan === p.id && { color: colors.primary }]}>{p.label}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>{p.price}</Text>
                  <Text style={styles.planPeriod}>{p.period}</Text>
                </View>
                {p.monthly && <Text style={styles.planMonthly}>{p.monthly}</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Abonelik Bilgileri */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Abonelik Bilgileri</Text>
            <Text style={styles.infoBoxText}>
              Abonelik, mevcut dönemin bitiminden 24 saat önce iptal edilmediği sürece otomatik olarak yenilenir. Aboneliğinizi App Store Ayarları {'>'} Abonelikler bölümünden istediğiniz zaman yönetebilir veya iptal edebilirsiniz.
            </Text>
            <View style={styles.infoBoxLinks}>
              <TouchableOpacity onPress={() => openURL(EULA_URL)} activeOpacity={0.7}>
                <Text style={styles.infoLink}>Apple Standart Kullanım Koşulları (EULA)</Text>
              </TouchableOpacity>
              <Text style={styles.infoBoxText}> · </Text>
              <TouchableOpacity onPress={() => openURL(PRIVACY_URL)} activeOpacity={0.7}>
                <Text style={styles.infoLink}>Gizlilik Politikası</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA */}
          {!hasActivePlan && <Text style={styles.safeText}>Güvenli ödeme · İstediğin zaman iptal et</Text>}
          <GradientButton
            label={
              loading ? (isTurkish ? 'İşleniyor...' : 'Processing...') :
              (hasActivePlan && isActivePlan(PLANS.find(p => p.id === selectedPlan)!.sku))
                ? 'Aktif Üyelik'
                : (isTurkish ? 'Premium Üyeliği Başlat' : 'Start Premium Membership')
            }
            onPress={handlePurchase}
            loading={loading}
            disabled={hasActivePlan && isActivePlan(PLANS.find(p => p.id === selectedPlan)!.sku)}
            style={styles.ctaBtn}
          />

          <View style={styles.legalRow}>
            <TouchableOpacity onPress={() => openURL(EULA_URL)} activeOpacity={0.7}>
              <Text style={styles.legalLink}>Apple Standart Kullanım Koşulları (EULA)</Text>
            </TouchableOpacity>
            <Text style={styles.legalSep}> | </Text>
            <TouchableOpacity onPress={() => openURL(PRIVACY_URL)} activeOpacity={0.7}>
              <Text style={styles.legalLink}>Gizlilik Politikası</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn} activeOpacity={0.7}>
            <Text style={styles.restoreText}>Satın Alımları Geri Yükle</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: spacing.base, paddingBottom: spacing['4xl'] },
    closeBtn: {
      position: 'absolute', top: 56, right: spacing.base,
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center', zIndex: 10,
    },

    hero: { alignItems: 'center', paddingTop: spacing['2xl'], paddingBottom: spacing.xl },
    orbWrap: { position: 'relative', marginBottom: spacing.base },
    orb: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    orbGlow: {
      position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
      borderRadius: 50, backgroundColor: colors.primary + '20',
    },
    heroTitle: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
    heroSub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },

    featureTable: {
      backgroundColor: colors.surface, borderRadius: radius.xl,
      borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
      marginBottom: spacing.xl,
    },
    featureHeader: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.base, paddingVertical: spacing.sm,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    featureColFree: { ...typography.captionBold, color: colors.textMuted, width: 72, textAlign: 'center' },
    featureColPremium: { ...typography.captionBold, width: 96, textAlign: 'center' },
    featureRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, minHeight: 44 },
    featureRowAlt: { backgroundColor: colors.surface2 },
    featureLabel: { flex: 1, ...typography.small, color: colors.textPrimary },
    featureFree: { ...typography.caption, color: colors.textMuted, width: 72, textAlign: 'center' },
    featurePremiumCell: { width: 96, alignItems: 'center' },
    featurePremiumText: { ...typography.captionBold, fontSize: 10, textAlign: 'center' },

    planRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
    planCard: {
      flex: 1, borderRadius: radius.xl, borderWidth: 2, borderColor: colors.border,
      padding: spacing.md, alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', gap: 4, minHeight: 130,
    },
    planCardSelected: { borderColor: colors.primary },
    planCardActive: {},
    planBadge: {
      position: 'absolute', top: -1, right: -1,
      backgroundColor: colors.primary, borderBottomLeftRadius: radius.md, borderTopRightRadius: radius.xl,
      paddingHorizontal: 10, paddingVertical: 5,
    },
    planBadgeActive: { backgroundColor: '#15803d' },
    planBadgeText: { color: '#fff', fontWeight: '700', fontSize: 11, letterSpacing: 0.2 },
    planLabel: { fontSize: 15, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' },
    planPriceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
    planPrice: { ...typography.h2, color: colors.textPrimary },
    planPeriod: { ...typography.small, color: colors.textMuted, marginBottom: 4 },
    planMonthly: { ...typography.caption, color: colors.textMuted },

    infoBox: {
      backgroundColor: colors.surface, borderRadius: radius.xl,
      borderWidth: 1, borderColor: colors.border,
      padding: spacing.base, marginBottom: spacing.lg, gap: spacing.sm,
    },
    infoBoxTitle: { ...typography.bodyMedium, color: colors.textPrimary, textAlign: 'center', fontWeight: '700' },
    infoBoxText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
    infoBoxLinks: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' },
    infoLink: { ...typography.caption, color: colors.primary, textDecorationLine: 'underline', textAlign: 'center' },

    safeText: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
    ctaBtn: { marginBottom: spacing.md },
    legalRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm, flexWrap: 'wrap' },
    legalLink: { ...typography.caption, color: colors.textMuted, textDecorationLine: 'underline', fontSize: 11 },
    legalSep: { ...typography.caption, color: colors.textMuted, fontSize: 11 },
    restoreBtn: { alignItems: 'center', paddingVertical: spacing.sm },
    restoreText: { ...typography.small, color: colors.textMuted, textDecorationLine: 'underline' },
  });
}
