import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, radius } from '../../theme';
import { useColors } from '../../hooks/useColors';
import { useAuthStore } from '../../stores/authStore';
import { useHabitStore } from '../../stores/habitStore';
import { GlassCard, GradientButton } from '../../components/common';
import { CoachMessage } from '../../types';
import BloomLogo from '../../components/common/BloomLogo';
import { supabase } from '../../services/supabase/client';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

const DAILY_FREE_LIMIT = 10;

function MessageBubble({ msg }: { msg: CoachMessage }) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isUser = msg.role === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
      {!isUser && (
        <View style={styles.assistantAvatar}>
          <LinearGradient colors={[colors.surface2, colors.surface]} style={styles.avatarGrad}>
            <BloomLogo size={18} />
          </LinearGradient>
        </View>
      )}
      <View style={[styles.bubbleContent, isUser ? styles.bubbleContentUser : styles.bubbleContentAssistant]}>
        {isUser && (
          <LinearGradient
            colors={[colors.primary, colors.primaryDim]}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{msg.content}</Text>
      </View>
    </View>
  );
}

export default function CoachScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user, plan, profile } = useAuthStore();
  const { habits, getTodayProgress } = useHabitStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const QUICK_PROMPTS = [
    { label: 'Analiz', text: 'Alışkanlıklarımı analiz et', color: colors.secondary },
    { label: 'Engel', text: 'Engellerin üstesinden nasıl gelirim?', color: colors.gold },
    { label: 'Öneri', text: 'Yeni alışkanlık öner', color: colors.primaryGlow },
    { label: 'Motive', text: 'Beni motive et', color: colors.accent },
  ];

  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Merhaba${profile?.name ? ` ${profile.name.split(' ')[0]}` : ''}! Ben BLOOM'un AI koçuyum. Alışkanlıkların, hedeflerin veya günlük rutinin hakkında ne konuşmak istersin?`,
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const listRef = useRef<FlatList>(null);

  const isLimited = plan === 'free' && msgCount >= DAILY_FREE_LIMIT;
  const { completed, total } = getTodayProgress();

  const buildContext = () => {
    const habitNames = habits.map((h) => h.title).join(', ');
    return `Kullanıcı profili: ${habitNames ? `Aktif alışkanlıklar: ${habitNames}.` : 'Henüz alışkanlık yok.'} Bugün ${completed}/${total} alışkanlık tamamlandı.`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || isLimited) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: CoachMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setMsgCount((c) => c + 1);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const context = buildContext();
      const chatMessages = [
        ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: text.trim() },
      ];

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: chatMessages, context },
      });

      if (error) throw new Error(error.message);
      const reply: string = data?.reply ?? 'Bir hata oluştu, tekrar dene.';
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Bağlantı hatası. İnternet bağlantını kontrol et.',
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <LinearGradient colors={['#0D0622', colors.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerOrb}>
            <LinearGradient colors={[colors.primaryGlow, colors.primaryDim]} style={StyleSheet.absoluteFill} />
            <BloomLogo size={28} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>AI Koç</Text>
            <Text style={styles.headerSub}>
              {plan === 'free' ? `${DAILY_FREE_LIMIT - msgCount} mesaj kaldı` : 'Premium — Sınırsız'}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MessageBubble msg={item} />}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={loading ? (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.typingText}>Düşünüyor...</Text>
          </View>
        ) : null}
      />

      <View style={styles.quickPromptsRow}>
        {QUICK_PROMPTS.map((qp) => (
          <TouchableOpacity
            key={qp.label}
            onPress={() => sendMessage(qp.text)}
            style={[styles.quickPrompt, { borderColor: qp.color + '40' }]}
            activeOpacity={0.8}
          >
            <View style={[styles.quickPromptDot, { backgroundColor: qp.color }]} />
            <Text style={[styles.quickPromptLabel, { color: qp.color }]}>{qp.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLimited ? (
        <GlassCard style={styles.limitBanner}>
          <Text style={styles.limitTitle}>Günlük limit doldu</Text>
          <Text style={styles.limitText}>Sınırsız AI koçluk için Premium'a geç.</Text>
          <GradientButton
            label="Premium'a Geç"
            onPress={() => navigation.navigate('Paywall')}
            style={styles.limitBtn}
          />
        </GlassCard>
      ) : (
        <View style={[styles.inputRow, { paddingBottom: insets.bottom || spacing.lg }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Bir şey sor veya paylaş..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity onPress={() => sendMessage(input)} disabled={!input.trim() || loading} activeOpacity={0.8}>
            <LinearGradient
              colors={!input.trim() || loading ? [colors.surface, colors.surface] : [colors.primary, colors.primaryDim]}
              style={styles.sendBtn}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      padding: spacing.base, paddingTop: spacing.md,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerOrb: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    headerTitle: { ...typography.h4, color: colors.textPrimary },
    headerSub: { ...typography.caption, color: colors.textSecondary },

    messageList: { paddingHorizontal: spacing.base, paddingVertical: spacing.base, gap: spacing.md },
    bubble: { flexDirection: 'row', gap: spacing.sm },
    bubbleUser: { justifyContent: 'flex-end' },
    bubbleAssistant: { justifyContent: 'flex-start' },
    assistantAvatar: { alignSelf: 'flex-end' },
    avatarGrad: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    bubbleContent: { maxWidth: '78%', borderRadius: radius.xl, padding: spacing.md, overflow: 'hidden' },
    bubbleContentUser: { borderBottomRightRadius: radius.sm },
    bubbleContentAssistant: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: radius.sm },
    bubbleText: { ...typography.body, color: colors.textPrimary, lineHeight: 22 },
    bubbleTextUser: { color: '#fff' },

    typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
    typingText: { ...typography.small, color: colors.textSecondary },

    quickPromptsRow: { flexDirection: 'row', paddingHorizontal: spacing.base, gap: spacing.sm, paddingBottom: spacing.sm },
    quickPrompt: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.xs, borderWidth: 1 },
    quickPromptDot: { width: 6, height: 6, borderRadius: 3 },
    quickPromptLabel: { ...typography.caption, fontWeight: '600' },

    limitBanner: { margin: spacing.base, padding: spacing.xl, alignItems: 'center', gap: spacing.sm },
    limitTitle: { ...typography.h4, color: colors.textPrimary },
    limitText: { ...typography.small, color: colors.textSecondary, textAlign: 'center' },
    limitBtn: { marginTop: spacing.sm, width: '100%' },

    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, paddingHorizontal: spacing.base, paddingBottom: spacing.lg, paddingTop: spacing.sm },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      ...typography.body,
      color: colors.textPrimary,
      maxHeight: 120,
    },
    sendBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    sendIcon: { color: '#fff', fontSize: 20, fontWeight: '700' },
  });
}
