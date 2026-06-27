import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Bu haftanın başı (Pazartesi)
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Mevcut içgörü var mı?
    const { data: existing } = await serviceClient
      .from('insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStartStr)
      .single();

    if (existing) return json({ insight: existing.content, cached: true });

    // Kullanıcı verilerini çek
    const [habitsRes, completionsRes, streaksRes, profileRes] = await Promise.all([
      serviceClient.from('habits').select('*').eq('user_id', user.id),
      serviceClient.from('completions').select('*').eq('user_id', user.id)
        .gte('completed_at', weekStart.toISOString()),
      serviceClient.from('streaks').select('*').eq('user_id', user.id),
      serviceClient.from('profiles').select('name, bloom_level').eq('id', user.id).single(),
    ]);

    const habits = habitsRes.data ?? [];
    const completions = completionsRes.data ?? [];
    const streaks = streaksRes.data ?? [];
    const profile = profileRes.data;

    const totalPossible = habits.length * 7;
    const completionRate = totalPossible > 0
      ? Math.round((completions.length / totalPossible) * 100) : 0;
    const bestStreak = streaks.reduce((max, s) => Math.max(max, s.longest_streak), 0);
    const activeStreaks = streaks.filter((s) => s.current_streak > 0).length;

    const contextSummary = [
      `Kullanıcı: ${profile?.name ?? 'Kullanıcı'}, Bloom Seviye ${profile?.bloom_level ?? 1}`,
      `Toplam alışkanlık: ${habits.length}`,
      `Bu hafta tamamlama oranı: %${completionRate}`,
      `En uzun seri: ${bestStreak} gün`,
      `Aktif seri sayısı: ${activeStreaks}`,
      `Alışkanlık kategorileri: ${[...new Set(habits.map((h: { category: string }) => h.category))].join(', ')}`,
    ].join('\n');

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) return json({ error: 'OpenAI key not configured' }, 500);

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Sen BLOOM uygulamasının haftalık içgörü koçusun. Kullanıcının verilerini analiz ederek kişiselleştirilmiş, motive edici ve pratik bir haftalık rapor yaz. 3-4 paragraf, Türkçe. İstatistiklere atıfla, somut öneriler ver.',
          },
          {
            role: 'user',
            content: `Bu hafta için içgörü raporu oluştur:\n${contextSummary}`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const aiData = await openaiRes.json();
    const content = aiData.choices?.[0]?.message?.content ?? '';

    // Kaydet
    await serviceClient.from('insights').upsert({
      user_id: user.id,
      week_start: weekStartStr,
      content,
      generated_at: now.toISOString(),
    });

    return json({ insight: content, cached: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
