import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as jose from 'npm:jose@5';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Uygulamanın bundle ID'si — fişin bu uygulamaya ait olduğunu doğrulamak için.
const BUNDLE_ID = 'com.barangunduz.bloomhabit';

// --- Yardımcılar -----------------------------------------------------------

// base64url segment -> JSON
function b64urlToJson(seg: string): Record<string, unknown> {
  const b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64 + '==='.slice((b64.length + 3) % 4);
  const bin = atob(pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}

// İmzayı DOĞRULAMADAN sadece JWS payload'unu okur. (Güvenlik Apple API çağrısıyla
// sağlanır; buradan okunan transactionId yalnızca Apple'a sorgu için kullanılır.)
function decodeJwsPayload(jws: string): Record<string, unknown> {
  const parts = jws.split('.');
  if (parts.length !== 3) throw new Error('bad_jws');
  return b64urlToJson(parts[1]);
}

// App Store Server API için ES256 imzalı kimlik JWT'si üretir.
async function makeAppleJwt(): Promise<string> {
  const issuerId = Deno.env.get('APPLE_ISSUER_ID');
  const keyId = Deno.env.get('APPLE_KEY_ID');
  const privateKeyPem = Deno.env.get('APPLE_PRIVATE_KEY');
  if (!issuerId || !keyId || !privateKeyPem) {
    throw new Error('apple_api_secrets_missing');
  }
  const key = await jose.importPKCS8(privateKeyPem, 'ES256');
  const now = Math.floor(Date.now() / 1000);
  return await new jose.SignJWT({ bid: BUNDLE_ID })
    .setProtectedHeader({ alg: 'ES256', kid: keyId, typ: 'JWT' })
    .setIssuer(issuerId)
    .setIssuedAt(now)
    .setExpirationTime(now + 300)
    .setAudience('appstoreconnect-v1')
    .sign(key);
}

// --- Ana akış --------------------------------------------------------------

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

    const { platform, purchaseToken } = await req.json();
    if (platform !== 'ios') return json({ error: 'unsupported_platform' }, 400);
    if (!purchaseToken || typeof purchaseToken !== 'string') {
      return json({ error: 'missing_token' }, 400);
    }

    // 1) İstemci JWS'inden (imzasız) transactionId + ortamı oku.
    let clientPayload: Record<string, unknown>;
    try {
      clientPayload = decodeJwsPayload(purchaseToken);
    } catch {
      return json({ error: 'bad_token' }, 400);
    }
    const transactionId =
      (clientPayload.transactionId as string) ??
      (clientPayload.originalTransactionId as string);
    const environment = clientPayload.environment === 'Production' ? 'Production' : 'Sandbox';
    console.log('[verify-purchase] invoked', { transactionId, environment });
    if (!transactionId) return json({ error: 'no_transaction_id' }, 400);

    // 2) Apple App Store Server API'ye sorgu — gerçek doğrulama burada.
    const appleJwt = await makeAppleJwt();
    const host = environment === 'Production'
      ? 'https://api.storekit.itunes.apple.com'
      : 'https://api.storekit-sandbox.itunes.apple.com';

    const appleRes = await fetch(`${host}/inApps/v1/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${appleJwt}` },
    });

    if (!appleRes.ok) {
      const body = await appleRes.text();
      console.error('[verify-purchase] apple api error', { status: appleRes.status, body });
      return json({ error: 'apple_api_error', appleStatus: appleRes.status }, 400);
    }

    const { signedTransactionInfo } = await appleRes.json();
    if (!signedTransactionInfo) return json({ error: 'no_transaction_info' }, 400);

    // Apple'dan TLS üzerinden geldi → otantik. Payload'u okuyoruz.
    const tx = decodeJwsPayload(signedTransactionInfo);

    if (tx.bundleId !== BUNDLE_ID) {
      console.error('[verify-purchase] bundle mismatch', { got: tx.bundleId });
      return json({ error: 'bundle_mismatch' }, 400);
    }

    const expiresMs = (tx.expiresDate as number) ?? 0;
    const isActive = expiresMs > Date.now();
    const plan = isActive ? 'premium' : 'free';
    const expiresAt = expiresMs ? new Date(expiresMs).toISOString() : null;
    console.log('[verify-purchase] verified', { productId: tx.productId, plan, expiresAt });

    // 3) Tek doğru kaynağa SUNUCU yazar (service-role → RLS atlanır).
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    await serviceClient.from('subscriptions').upsert({
      user_id: user.id,
      plan,
      expires_at: expiresAt,
      platform: 'ios',
      original_transaction_id: (tx.originalTransactionId as string) ?? null,
    });

    return json({ plan, expiresAt });
  } catch (err) {
    console.error('[verify-purchase] fatal', {
      message: (err as Error)?.message ?? String(err),
      stack: (err as Error)?.stack,
    });
    return json({ error: 'verification_failed' }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
