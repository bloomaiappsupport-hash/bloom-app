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
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // Kullanıcıyı doğrula
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    const { messages, context } = await req.json();

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) return json({ error: 'OpenAI key not configured' }, 500);

    const systemPrompt = [
      'Sen BLOOM uygulamasının AI alışkanlık koçusun.',
      'Kullanıcının verilerine göre kişiselleştirilmiş, kısa ve pratik öneriler ver.',
      'Empati kur ama klişe motivasyon cümleleri kurma.',
      'Asla "tabii ki" veya "elbette" ile başlama.',
      'Türkçe konuş.',
      context ? `\nKullanıcı bağlamı: ${context}` : '',
    ].join(' ');

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 600,
        temperature: 0.75,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return json({ error: data.error?.message ?? 'OpenAI error' }, openaiRes.status);
    }

    const reply = data.choices?.[0]?.message?.content ?? '';

    // Mesajları veritabanına kaydet
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === 'user') {
      await serviceClient.from('coach_messages').insert([
        { user_id: user.id, role: 'user', content: lastUserMsg.content },
        { user_id: user.id, role: 'assistant', content: reply },
      ]);
    }

    return json({ reply });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
