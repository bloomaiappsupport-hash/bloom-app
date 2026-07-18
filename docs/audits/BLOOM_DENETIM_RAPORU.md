# Ürün Denetim Raporu — BLOOM (Alışkanlık Koçu)

**Denetim tarihi:** 11 Temmuz 2026
**İncelenen sürüm:** 1.0.1 (iOS build 36 / Android versionCode 5)
**İncelenen kapsam:** Tam kod tabanı — React Native (Expo 56), Supabase (Postgres + Edge Functions), IAP entegrasyonu, i18n, tema, navigasyon, tüm ekranlar.
**Stack:** Expo/RN 0.85, Supabase, OpenAI (gpt-4o / gpt-4o-mini), react-native-iap v15, Zustand.

> Denetim canlı uygulamayı akışıyla gezerek değil, **kaynak kodu okuyarak** yapıldı. Kesin (kanıtlı) bulgular ile davranışsal/varsayımsal bulgular ayrıştırıldı. Dönüşüm/retention yorumları veri olmadan hipotezdir.

---

## Yönetici Özeti

Bloom, teknik olgunluğu yaşına göre yüksek bir ürün: sunucu tarafında Apple StoreKit API ile gerçek fiş doğrulaması, tüm tablolarda RLS, prompt-injection savunması, i18n paritesi (325/325 anahtar), SecureStore ile oturum saklama gibi çoğu solo projede görülmeyen doğru kararlar var. Mimari temiz (feature-based), tek doğru kaynak (subscriptions tablosu) prensibi çoğu yerde uygulanmış.

Ancak **bugün mağazaya çıkmaya hazır değil.** Beş adet bloklayıcı sorun var:

1. **Canlı GitHub Personal Access Token repoya gömülü** (`git remote` URL'inde). Kritik güvenlik olayı — token derhal iptal edilmeli.
2. **Premium, istemci bayrağıyla ücretsiz aşılabiliyor.** `chat` fonksiyonu `clientPremium === true` gelirse hem günlük limiti hem model kısıtını atlıyor. Değiştirilmiş bir istemci sınırsız gpt-4o kullanır → doğrudan maliyet + gelir kaybı.
3. **Süresi dolmuş abonelik kalıcı premium kalıyor.** `App.tsx` içinde `active = dbActive || !!localSku` — yerel SKU var olduğu sürece plan `premium` set ediliyor; abonelik bittiğinde bile.
4. **Android satın alma tamamen kırık.** `verify-purchase` yalnızca iOS kabul ediyor, `requestPurchase` yalnızca `apple` isteği yolluyor; ama uygulama Google Play'e de yapılandırılmış. Android'de premium satın alınamaz.
5. **Reklamı yapılan "Streak Kalkanı 2/ay" özelliği kodda yok.** Kalkan hiçbir yerde verilmiyor (yalnızca azaltılıyor). Paywall'da satılan ama teslim edilmeyen özellik → App Store reddi + güven kaybı.

Bunların yanında yaygın erişilebilirlik eksiklikleri (sıfır `accessibilityLabel`, AA'yı geçmeyen kontrastlar), İngilizce kullanıcıya Türkçe gösterilen paywall, ve kullanılmayan ölü ekranlar (AuraCreation, VerifyEmail, demo modu) var.

**Genel sağlık:** İskelet sağlam, kritik para/güvenlik yollarında delikler var. 1 haftalık odaklı çalışmayla mağazaya hazır hale gelebilir.

---

## Öncelik Sıralı Bulgular

### [P0] Canlı GitHub token repo remote'una gömülü
- **Kategori:** Güvenlik açığı
- **Kanıt:** `git remote -v` → `origin https://ghp_jc8g...IJIuv@github.com/bloomaiappsupport-hash/bloom-app.git`. Bir GitHub Personal Access Token (PAT) remote URL'inde açık.
- **Neden problem?** PAT, repoya (ve token kapsamına göre hesaba) yazma erişimi verir. `.git/config`'te tutulan bu token, repoyu klonlayan/paylaşan herkese sızar; CI loglarına, ekran paylaşımına düşebilir. Kaynak koduna gömülü secret, OWASP'ın en yaygın sızıntı vektörüdür.
- **Kullanıcı etkisi:** Dolaylı — repo ele geçirilirse zararlı sürüm yayınlanabilir.
- **İş etkisi:** Yüksek. Repo/hesap ele geçirme, tedarik zinciri riski.
- **Risk:** P0 | **Etki:** Yüksek | **Zorluk:** Kolay
- **Önerilen çözüm:** Token'ı **hemen** GitHub'da iptal et. Remote'u SSH'a çevir (`git remote set-url origin git@github.com:...`) veya token'ı git credential helper'da tut, asla URL'de değil. Repo geçmişini token için tarat (git-secrets / trufflehog).

### [P0] Premium, istemci bayrağıyla ücretsiz aşılabiliyor
- **Kategori:** Monetizasyon / güvenlik
- **Kanıt:** `supabase/functions/chat/index.ts`:
  `const isPremium = dbActive || clientPremium === true;` ve limit yalnızca `if (!isPremium)` içinde uygulanıyor. İstemci (`CoachScreen`) `isPremium: plan === 'premium'` yolluyor ama sunucu gövdeden gelen `clientPremium`'a güveniyor.
- **Neden problem?** Değiştirilmiş bir istemci `{ isPremium: true }` yollayarak (a) günlük 3 mesaj limitini, (b) gpt-4o-mini→gpt-4o yükseltmesini bedavaya alır. Sunucu doğrulaması "gerçek kilit" diye yorumlanmış ama istemci girdisiyle delinmiş. Güvenlikte temel kural: istemciden gelen yetki bayrağına asla güvenme.
- **Kullanıcı etkisi:** Dürüst kullanıcı için yok; kötüye kullanan için sınırsız bedava premium.
- **İş etkisi:** Yüksek. Doğrudan OpenAI maliyeti + premium gelir erozyonu.
- **Risk:** P0 | **Etki:** Yüksek | **Zorluk:** Kolay
- **Önerilen çözüm:** `clientPremium`'u tamamen kaldır. Premium'u yalnızca `dbActive` (subscriptions tablosu + `expires_at` kontrolü) belirlesin. İstemci sadece UI için kendi tahminini kullansın, sunucu asla.

### [P0] Süresi dolmuş abonelik kalıcı olarak premium kalıyor
- **Kategori:** Monetizasyon
- **Kanıt:** `App.tsx > loadUserData`: `const active = dbActive || !!localSku; setPlan(active ? 'premium' : 'free');`. `localSku` (`bloom_active_plan_sku`) yalnızca hesap silinince temizleniyor.
- **Neden problem?** Kullanıcı bir kez premium alıp aboneliğini iptal ettiğinde/süresi dolduğunda `dbActive=false` olur ama `localSku` cihazda kaldığı için plan yine `premium` set edilir. `ProfileScreen` yorumları bu "hayalet premium"un düzeltildiğini söylüyor ama düzeltme `App.tsx`'e uygulanmamış — çelişki. Uygulama açılışında premium'u geri veren asıl yer burası.
- **Kullanıcı etkisi:** Bir kısmı bedava premium yaşar (olumlu görünür ama gelir kaçağı).
- **İş etkisi:** Yüksek. Yenileme/iptal edenler ödemeye devam etmeden premium kullanır.
- **Risk:** P0 | **Etki:** Yüksek | **Zorluk:** Kolay
- **Önerilen çözüm:** `localSku`'yu premium kararında kullanma; yalnızca "hangi tarife" etiketlemesi için kullan (ProfileScreen'de zaten böyle). `active = dbActive` yeterli. Açılışta sunucudan doğrula.

### [P0] Android satın alma akışı tamamen kırık
- **Kategori:** Kritik bug / Play uyumluluğu
- **Kanıt:** `verify-purchase/index.ts`: `if (platform !== 'ios') return json({ error: 'unsupported_platform' }, 400);`. `PaywallScreen.handlePurchase`: `requestPurchase({ type:'subs', request: { apple: { sku } } })` — yalnızca `apple` alanı. `app.json`'da Android paketi ve izinleri tanımlı, Play'e çıkış hedefleniyor.
- **Neden problem?** Android kullanıcısı "Premium Üyeliği Başlat"a basınca ya hata alır ya da Google faturalandırması hiç tetiklenmez; tetiklense bile sunucu fişi reddeder. Android'de premium satın alınamaz, geri yüklenemez.
- **Kullanıcı etkisi:** Android'de para harcamak isteyen kullanıcı harcayamaz.
- **İş etkisi:** Yüksek. Android gelirinin tamamı + "satın alma çalışmıyor" 1 yıldız yorumları + olası Play reddi.
- **Risk:** P0 | **Etki:** Yüksek | **Zorluk:** Zor (Google Play Developer API + Android request yolu)
- **Önerilen çözüm:** Ya (a) Android satın almayı tam implemente et (Google Play Developer API ile `purchases.subscriptions` doğrulaması + `request.google`), ya da (b) **ilk sürümü yalnızca iOS yayınla**, Android'i sonraki sürüme ertele. Solo geliştirici için (b) çok daha güvenli.

### [P0] Reklamı yapılan "Streak Kalkanı" özelliği kodda mevcut değil
- **Kategori:** Monetizasyon / güven / App Store uyumluluğu
- **Kanıt:** Paywall FEATURES: `{ label: 'Streak Kalkanı', free: '—', premium: '2/ay' }`. Ama `shields_remaining` tüm kod tabanında yalnızca **azaltılıyor** (`useShield`) ve DB'de `default 0`. Hiçbir yerde premium kullanıcıya kalkan **verilmiyor** (aylık +2 atayan kod yok). Dolayısıyla `shields_remaining` her zaman 0; kalkan butonu hiç görünmez.
- **Neden problem?** Ücretli planda satılan somut bir özellik teslim edilmiyor. Apple Guideline 2.3.1 (yanıltıcı) ve 3.1.2 kapsamında reddedilebilir; kullanıcı güvenini doğrudan zedeler.
- **Kullanıcı etkisi:** Premium alan kullanıcı vaat edilen özelliği bulamaz.
- **İş etkisi:** Yüksek. İade talepleri, App Store reddi, itibar.
- **Risk:** P0 | **Etki:** Yüksek | **Zorluk:** Orta
- **Önerilen çözüm:** Ya kalkan verme mantığını implemente et (premium olunca aylık 2 kalkan atanması + streak kırılınca otomatik tüketim), ya da özelliği paywall'dan kaldır. İlk sürüm için **kaldırmak** (sadeleştirme) en hızlı ve dürüst yol.

### [P1] Paywall (ve birçok ekran) İngilizce kullanıcıya Türkçe gösteriliyor
- **Kategori:** i18n / UX / Store uyumluluğu
- **Kanıt:** `PaywallScreen`: FEATURES etiketleri (`'Sınırsız alışkanlık'`, `'AI Koç mesajı'`…), `'Ücretsiz'`/`'Premium'` başlıkları, `'Abonelik Bilgileri'` bloğu, `'Aktif Üyelik'`, `'Satın Alımları Geri Yükle'`, hero alt başlık hepsi hardcoded Türkçe. `isTurkish` yalnızca fiyat/CTA'nın bir kısmını çeviriyor. Ayrıca `isTurkish` **modül yüklenirken bir kez** `NativeModules`'tan hesaplanıyor → uygulama içi dil değişimine tepki vermez.
- **Neden problem?** Uygulamanın geri kalanı i18n kullanırken en para-kritik ekran karışık dilde. İngilizce kullanıcı Türkçe paywall görür; App Store metadata'sı EN ise Apple tutarsızlık/lokalizasyon eksikliği için işaretleyebilir.
- **Kullanıcı etkisi:** Yabancı kullanıcıda kafa karışıklığı, güven kaybı, dönüşüm düşüşü.
- **İş etkisi:** Orta-Yüksek (uluslararası dönüşüm).
- **Risk:** P1 | **Etki:** Yüksek | **Zorluk:** Orta
- **Önerilen çözüm:** Paywall'ı tamamen `t()`'ye taşı; `isTurkish` yerine `useLanguageStore`/`useTranslation` kullan (reaktif). ProfileScreen premium kartındaki `'AKTİF'`/`'PREMIUM'` ve `'Abonelik Bilgileri'` gibi kalan hardcoded stringleri de topla.

### [P1] Sıfır erişilebilirlik etiketi — ekran okuyucu kullanılamaz
- **Kategori:** Accessibility (WCAG 2.1 / Apple HIG)
- **Kanıt:** Tüm `src` genelinde `accessibilityLabel` / `accessibilityRole` / `accessible` **0 kullanım**. İkon-only butonlar: paywall kapatma (X), bildirim zili, sohbet gönder (↑), dil toggle, mood yüzleri — hiçbiri etiketli değil.
- **Neden problem?** VoiceOver/TalkBack kullanıcıları butonların ne yaptığını bilemez ("button" der geçer). WCAG 4.1.2 (Name, Role, Value) ihlali. Apple erişilebilirliği giderek daha çok denetliyor.
- **Kullanıcı etkisi:** Görme engelli kullanıcılar uygulamayı kullanamaz.
- **İş etkisi:** Orta. Erişilebilirlik davaları/şikayetleri; pazar dışı bırakma.
- **Risk:** P1 | **Etki:** Orta | **Zorluk:** Kolay
- **Önerilen çözüm:** İkon butonlarına `accessibilityLabel` + `accessibilityRole="button"` ekle. Mood/kategori seçimlerine `accessibilityState={{selected}}`. En kritik akışlarla (auth, paywall, habit ekle/tamamla) başla.

### [P1] textMuted rengi AA kontrastı geçmiyor
- **Kategori:** Accessibility / UI
- **Kanıt:** `colors.textMuted = #4A4A6A`. Hesaplanan kontrast: bg (#080812) üzerinde **2.35:1**, surface (#0F0F23) üzerinde **2.23:1**. WCAG AA küçük metin için 4.5:1 ister. `textMuted` yaygın: placeholder'lar, caption'lar, "Ücretsiz" sütunu, freq metni, versiyon, birçok yardımcı etiket. `primary #7C3AED` üzerine bg 3.5:1 (büyük metin/ikon sınırında).
- **Neden problem?** Düşük görüşlü kullanıcılar ve güneş ışığında herkes bu metinleri okuyamaz. WCAG 1.4.3 ihlali.
- **Kullanıcı etkisi:** Okunabilirlik, özellikle önemli ipucu metinlerinde.
- **İş etkisi:** Düşük-Orta.
- **Risk:** P1 | **Etki:** Orta | **Zorluk:** Kolay
- **Önerilen çözüm:** `textMuted`'ı en az `#6E6E90` civarına aç (≈4.5:1). Placeholder ve caption gibi bilgi taşıyan metinlerde `textSecondary` (#8B8BA7, 6.0:1 — geçiyor) kullan; `textMuted`'ı yalnızca dekoratif metinle sınırla.

### [P1] Prompt-injection filtresi meşru sohbeti engelliyor (false positive)
- **Kategori:** UX / AI
- **Kanıt:** `chat/index.ts` INJECTION_PATTERNS: `/act as (a|an|if)/i`, `/you are now/i`, `/openai|gpt|claude|gemini|anthropic|mistral/i`, `/api.?key/i` vb. Eşleşen mesaj OpenAI'a hiç gitmeden sabit ret cevabı alıyor.
- **Neden problem?** Alışkanlık koçu bağlamında normal cümleler tetikler: "I want to **act as a** calmer person", "how do I stop acting as if...", hatta "GPT" içeren bir kelime. Kullanıcı neden reddedildiğini anlamaz. Aşırı geniş desen, ürünün ana değer önerisini (koç) bozar.
- **Kullanıcı etkisi:** Rastgele "sana yardımcı olamam" cevapları → hayal kırıklığı.
- **İş etkisi:** Orta (retention/güven — ürünün çekirdek özelliği).
- **Risk:** P1 | **Etki:** Orta | **Zorluk:** Orta
- **Önerilen çözüm:** Desenleri daralt (yalnızca gerçek jailbreak kalıpları). Asıl savunmayı system prompt + `temperature`/model tarafına bırak; sert regex kilidini kaldır veya yalnızca çok yüksek güvenli kalıplarda uygula. Kullanıcıya reddettiğinde bağlamsal mesaj ver.

### [P1] Android 13+ bildirim izni hiç istenmiyor
- **Kategori:** Bug / retention
- **Kanıt:** `services/notifications.ts`: `if (Platform.OS === 'android') return true;` — Android'de izin sorulmadan "granted" varsayılıyor. `app.json`'da `POST_NOTIFICATIONS` izni var ama runtime isteği yapılmıyor.
- **Neden problem?** Android 13 (API 33)+ bildirim için runtime izin zorunlu. İzin istenmediği için Android'de hatırlatmalar hiç gösterilmez — halbuki uygulamanın retention motoru bildirimler.
- **Kullanıcı etkisi:** Android'de hatırlatıcı çalışmaz; kullanıcı alışkanlığını unutur → geri gelmez.
- **İş etkisi:** Orta-Yüksek (Android retention).
- **Risk:** P1 | **Etki:** Orta | **Zorluk:** Kolay
- **Önerilen çözüm:** Android'de de `Notifications.requestPermissionsAsync()` çağır (expo-notifications Android 13 runtime iznini destekler). `return true` kısayolunu kaldır.

### [P1] Global JS Error Boundary yok — tek hata tüm uygulamayı beyazlatır
- **Kategori:** Kararlılık / crash
- **Kanıt:** `App.tsx` ağacında hiçbir error boundary yok. Ayrıca `LogBox.ignoreLogs` içinde `'Cannot read property'`, `'Possible Unhandled Promise Rejection'`, `'finishTransaction'` gibi **gerçek hata sinyalleri** susturulmuş.
- **Neden problem?** Bir render hatası (ör. beklenmeyen null profil, bozuk streak verisi) tüm ağacı çökertip beyaz ekran bırakır; kullanıcı kurtulamaz. Gerçek uyarıları susturmak, geliştirmede bu hataları görünmez kılar (teknik borç).
- **Kullanıcı etkisi:** Nadir ama şiddetli — kullanılamaz beyaz ekran.
- **İş etkisi:** Orta. Çökme → kaldırma/kötü yorum.
- **Risk:** P1 | **Etki:** Orta | **Zorluk:** Orta
- **Önerilen çözüm:** Kök seviyede bir ErrorBoundary (yeniden dene butonlu fallback) ekle; Sentry/expo error reporting bağla. `ignoreLogs`'tan gerçek-hata desenlerini çıkar, nedenlerini düzelt.

### [P1] Kayıt sonrası e-posta doğrulama akışı kopuk (ölü ekran)
- **Kategori:** UX / akış
- **Kanıt:** `VerifyEmailScreen` mevcut ve navigator'da kayıtlı ama hiçbir yerden `navigate('VerifyEmail')` çağrılmıyor. `RegisterScreen.handleRegister` başarıda hiçbir yönlendirme/mesaj vermiyor — Supabase e-posta doğrulaması açıksa oturum oluşmaz, kullanıcı boş formda kalır.
- **Neden problem?** Kullanıcı "kayıt ol"a basar, görünürde hiçbir şey olmaz (buton loading kapanır). "E-postanı kontrol et" yönlendirmesi yok. En kritik dönüşüm anında sessizlik.
- **Kullanıcı etkisi:** "Kaydım oldu mu?" belirsizliği → terk.
- **İş etkisi:** Orta-Yüksek (aktivasyon funnel'ı).
- **Risk:** P1 | **Etki:** Orta | **Zorluk:** Kolay
- **Önerilen çözüm:** Kayıt başarısında `navigate('VerifyEmail', { email })`. Ya da e-posta onayını kapatıp otomatik oturum (deep link zaten kurulu). En azından kullanıcıya net bir "e-postanı doğrula" ekranı göster.

### [P2] Streak mantığı istemci tarafında ve kırılgan
- **Kategori:** Veri bütünlüğü / mimari
- **Kanıt:** `HomeScreen.handleComplete` streak'i istemcide hesaplayıp `upsertStreak` ile yazıyor. "Undo" dalı `current_streak - 1` ve `last_completed_at = dün` set ediyor (yaklaşık). Kaçırılan günü sıfırlayan hiçbir sunucu işi (cron) yok — streak yalnızca bir sonraki tamamlamada yeniden hesaplanır.
- **Neden problem?** İki cihaz, saat dilimi farkları, gece yarısı `setTimeout` reset'i (uygulama arka plandaysa güvenilmez) streak'i bozabilir/şişirebilir. Undo yaklaşık değer yazar. Streak ürünün retention çekirdeği; yanlışsa güven gider.
- **Kullanıcı etkisi:** Yanlış/atlayan seri sayıları.
- **İş etkisi:** Orta (retention mekaniği güvenilirliği).
- **Risk:** P2 | **Etki:** Orta | **Zorluk:** Zor
- **Önerilen çözüm:** Streak'i completions'tan türet (sorgu/DB fonksiyonu) — ayrı bir mutable sütun yerine kaynaktan hesapla. Gece yarısı `setTimeout` yerine ekran odağında (`useFocusEffect`) yeniden yükle.

### [P2] `AuraCreationScreen` ve demo modu ölü kod / eski marka kalıntısı
- **Kategori:** Teknik borç / tutarlılık
- **Kanıt:** `AuraCreationScreen.tsx` navigator'da kullanılmıyor (RootNavigator `BloomCreationScreen` kullanıyor), içinde hardcoded Türkçe + eski "Aura"/"A" logosu + `'Bloomn oluşturuluyor'` yazım hatası var. `authStore.enterDemoMode` hiç çağrılmıyor (buton yok). `package.json` adı hâlâ `"aura"`.
- **Neden problem?** Ölü ekranlar bundle'ı şişirir, bakımda kafa karıştırır, eski markayla tutarsızlık üretir. `DEMO_PROFILE` gibi kalıntılar üretime sızma riski taşır.
- **Kullanıcı etkisi:** Yok (ölü) — ama bakım maliyeti.
- **İş etkisi:** Düşük.
- **Risk:** P2 | **Etki:** Düşük | **Zorluk:** Kolay
- **Önerilen çözüm:** `AuraCreationScreen`'i sil. Demo modu kullanılmıyorsa store'dan çıkar. `package.json` adını `bloom` yap (marka tutarlılığı).

### [P2] Haftalık içgörü tamamlama oranı yanlış hesaplanıyor
- **Kategori:** Bug / doğruluk
- **Kanıt:** `weekly-insights/index.ts`: `totalPossible = habits.length * 7` — tüm alışkanlıkları günlük varsayıyor. Haftalık/özel frekanslı alışkanlıklar paydayı şişirir, oran olduğundan düşük çıkar.
- **Neden problem?** AI raporu yanlış istatistik ("bu hafta %30") üretip kullanıcıyı yanlış motive/demotive eder.
- **Kullanıcı etkisi:** Yanıltıcı geri bildirim.
- **İş etkisi:** Düşük-Orta.
- **Risk:** P2 | **Etki:** Düşük | **Zorluk:** Kolay
- **Önerilen çözüm:** Paydayı frekansa göre hesapla (`frequency_days` uzunluğu × hafta). Insights ekranındaki `completionRate` de yalnızca bugüne bakıyor ("bu hafta" etiketiyle çelişki) — netleştir.

### [P2] Edge Function'larda CORS `*` ve dokunma hedefi boyutları
- **Kategori:** Güvenlik (düşük) / HIG
- **Kanıt:** Üç fonksiyonda `Access-Control-Allow-Origin: '*'`. Paywall kapatma butonu 36×36, dil toggle ~28px yükseklik, bazı `hitSlop`'suz küçük dokunma alanları. Apple HIG minimum 44×44 pt önerir.
- **Neden problem?** CORS `*` mobil için düşük risk (auth JWT gerekiyor) ama gereksiz geniş. Küçük hedefler yanlış dokunma/erişilebilirlik sorunu.
- **Risk:** P2 | **Etki:** Düşük | **Zorluk:** Kolay
- **Önerilen çözüm:** CORS'u bilinen origin'lere daralt (mobil-only ise `*` yerine header'ı kısıtla). Dokunma hedeflerini 44×44'e çıkar veya `hitSlop` ekle.

### [P3] Şifre politikası tutarsız & EAS projectId şüpheli
- **Kategori:** Tutarlılık / config
- **Kanıt:** RegisterScreen `strength.score < 3` istiyor; ProfileScreen şifre değiştirme modalı `length < 6` yeterli sayıyor. `app.json` `updates.url`/`projectId` = `"bloom-habit-coach"` (slug), normalde EAS projectId bir UUID'dir → OTA güncellemeleri hatalı yapılandırılmış olabilir.
- **Risk:** P3 | **Etki:** Düşük | **Zorluk:** Kolay
- **Önerilen çözüm:** Tek şifre politikası (tercihen aynı `getPasswordStrength`). EAS projectId'yi gerçek UUID ile doğrula (`eas init` çıktısı); yanlışsa OTA çalışmaz.

---

## Bulgu Özet Tablosu

| # | Bulgu | Kategori | Etki | Zorluk | Öncelik |
|---|-------|----------|------|--------|---------|
| 1 | GitHub token repoda | Güvenlik | Yüksek | Kolay | P0 |
| 2 | clientPremium ile premium bypass | Monetizasyon | Yüksek | Kolay | P0 |
| 3 | Süresi dolan abonelik premium kalıyor | Monetizasyon | Yüksek | Kolay | P0 |
| 4 | Android satın alma kırık | Bug/Play | Yüksek | Zor | P0 |
| 5 | Streak Kalkanı özelliği yok | Güven/Store | Yüksek | Orta | P0 |
| 6 | Paywall/ekranlar Türkçe hardcoded | i18n/UX | Yüksek | Orta | P1 |
| 7 | Sıfır accessibilityLabel | A11y | Orta | Kolay | P1 |
| 8 | textMuted kontrast AA fail | A11y/UI | Orta | Kolay | P1 |
| 9 | Injection filtresi false-positive | UX/AI | Orta | Orta | P1 |
| 10 | Android bildirim izni yok | Bug/retention | Orta | Kolay | P1 |
| 11 | Error boundary yok | Kararlılık | Orta | Orta | P1 |
| 12 | Kayıt→doğrulama akışı kopuk | UX | Orta | Kolay | P1 |
| 13 | Streak istemcide, kırılgan | Veri | Orta | Zor | P2 |
| 14 | Ölü kod (Aura, demo) | Teknik borç | Düşük | Kolay | P2 |
| 15 | Haftalık oran yanlış | Bug | Düşük | Kolay | P2 |
| 16 | CORS *, dokunma hedefi | Güvenlik/HIG | Düşük | Kolay | P2 |
| 17 | Şifre politikası / EAS projectId | Config | Düşük | Kolay | P3 |

---

## Güçlü Yönler (korunmalı — değiştirmeyin)

- **Sunucu tarafı IAP doğrulaması doğru yapılmış.** `verify-purchase` Apple StoreKit Server API'ye ES256 JWT ile gidip fişi gerçekten doğruluyor, premium'u yalnızca sunucu (service-role) yazıyor. Bu, çoğu indie uygulamanın yanlış yaptığı şeyi doğru yapıyor — koru.
- **Tüm tablolarda RLS aktif** ve politikalar `auth.uid()` bazlı. `subscriptions` yalnızca SELECT'e açık, yazma service-role'de — mükemmel.
- **Sunucu tarafı sohbet günlük limiti** DB'den sayılıyor (istemci kapatılıp açılsa da sıfırlanmaz). Doğru yaklaşım (yalnızca clientPremium deliği kapatılmalı).
- **i18n paritesi tam** (325/325 anahtar, TR/EN sıfır eksik). Nadir bir disiplin.
- **Prompt-injection savunması + kimlik gizleme** system prompt'ta düşünülmüş (yalnızca regex fazla geniş).
- **Mimari temiz:** feature-based klasörleme, Zustand store'lar tekil sorumluluk, tema tokenları (spacing/typography/radius) tutarlı.
- **Algılanan performans:** skeleton loader'lar, splash fade, haptics, optimistic UI (tamamlama anında ekleniyor). İyi craft.
- **Güvenli oturum saklama:** SecureStore adapter, PKCE + implicit deep-link her ikisi de ele alınmış.
- **Blocked permissions** (kişiler/takvim) açıkça engellenmiş — Play/App Store gizlilik için olumlu sinyal.

---

## Hızlı Kazanımlar (Quick Wins — düşük zorluk, yüksek/orta etki)

1. GitHub token'ı iptal et + remote'u temizle (dakikalar).
2. `clientPremium` bayrağını `chat`'ten sil (tek satır) — P0 kapanır.
3. `App.tsx`'te `active = dbActive` yap (localSku'yu premium kararından çıkar) — P0 kapanır.
4. Streak Kalkanı'nı paywall'dan kaldır (implemente edilene kadar) — Store riski kapanır.
5. `textMuted` rengini ~`#6E6E90`'a aç — a11y kontrast tek dosyada düzelir.
6. Android'de bildirim izni iste (`return true` kısayolunu kaldır).
7. İkon butonlara `accessibilityLabel` ekle (auth + paywall + habit).
8. `AuraCreationScreen`'i sil, `package.json` adını `bloom` yap.

---

## Teknik Borç Listesi

- İstemci tarafı streak hesabı (kaynaktan türetilmeli).
- Gece yarısı `setTimeout` reset (odak-bazlı yenilemeyle değiştir).
- `LogBox.ignoreLogs` gerçek hataları susturuyor (`Cannot read property`, `Unhandled Promise Rejection`).
- Ölü kod: `AuraCreationScreen`, `enterDemoMode`/`DEMO_PROFILE`.
- İki ayrı şifre gücü mantığı (Register vs Profile).
- `isTurkish` modül-yükünde hesaplanıp reaktif değil.
- `react-native-iap` mock dosyaları (`src/mocks`) — üretim yolundan izole olduğu doğrulanmalı.
- Error monitoring (Sentry vb.) yok.
- EAS `projectId` slug görünüyor, UUID olmalı.

---

## Güvenlik Riskleri (özet)

1. **Repoda canlı GitHub PAT** (P0) — derhal iptal.
2. **İstemci bayrağıyla yetki yükseltme** (`clientPremium`) (P0).
3. **Yerel SKU ile premium kalıcılığı** (P0) — sunucu doğrulaması atlanıyor.
4. CORS `*` (P2, düşük — JWT korumalı).
5. `.env` git-ignore'da (iyi) ama OpenAI anahtarı yalnızca Edge Function ortamında olmalı — repoda anahtar değeri yok, doğru. `.env.example` placeholder, sorun yok.

---

## App Store / Google Play Riskleri

- **Streak Kalkanı teslim edilmiyor** → Guideline 2.3.1 / 3.1.2 reddi (P0).
- **Android satın alma kırık** → Play'de "çalışmıyor" reddi/kaldırma (P0).
- **Paywall dil karışıklığı** → lokalizasyon tutarsızlığı işareti (P1).
- **Erişilebilirlik eksikleri** → Apple a11y denetimi (P1).
- Abonelik metni (otomatik yenileme, EULA, gizlilik linkleri) paywall'da **mevcut ve doğru** — bu Apple gereğini karşılıyor, iyi.
- `iOS privacyManifests` yalnızca UserDefaults reason içeriyor; SecureStore/network kullanımı için ek "required reason API" beyanı gerekebilir — Apple'ın güncel listesine göre doğrula.
- `usesNonExemptEncryption: false` doğru beyan (standart HTTPS).

---

## Kullanıcı Deneyimini En Fazla İyileştirecek Değişiklikler

1. **Kayıt→doğrulama akışını tamamla** — en kritik aktivasyon anındaki sessizliği gider.
2. **Paywall'ı tam lokalize et** — yabancı kullanıcıda güven + dönüşüm.
3. **AI koç false-positive'lerini düzelt** — ürünün çekirdek değerini geri kazan.
4. **Kontrast + a11y etiketleri** — okunabilirlik herkes için artar.
5. **Error boundary** — nadir ama şiddetli beyaz-ekran deneyimini önler.
6. Onboarding'de bildirim iznini değerden sonra iste (şu an MainNavigator'da 2sn sonra Alert ile — zamanlaması makul ama "neden" mesajı güçlendirilebilir).

---

## Büyüme İçin En Büyük Fırsatlar

> (Not: Mevcut ürünü iyileştirmeye öncelik verildi. Bunlar veri ile doğrulanmalı — hipotez.)

1. **Streak/retention kancasını sağlamlaştır** (kalkanı gerçekten teslim et veya kaldır) — mevcut mekaniği güvenilir kılmak yeni özellikten değerli.
2. **Paywall zamanlaması:** Şu an yalnızca limit/gate'e basınca açılıyor. Aha-moment sonrası (ör. ilk 3 günlük streak) yumuşak bir premium anı denenebilir — ama önce mevcut paywall'ın dürüstlük ve dil sorunları kapatılmalı.
3. **App Store lokalize metadata + ekran görüntüleri** (TR/EN) — organik indirmede en yüksek kaldıraç, kod değişikliği gerektirmez.
4. Bildirim retention'ı Android'de çalışır hale gelince ölçülebilir retention artışı beklenir (şu an Android'de tamamen kapalı).

---

## Gereksiz Olduğunu Düşündüğüm Özellikler (feature creep)

- **Streak Kalkanı:** Henüz çalışmıyor ve pre-PMF için gereksiz karmaşıklık. İlk sürümde kaldır; talep gelirse ekle.
- **Habit Stacks (rutinler):** Premium'a kilitli, ayrı tablo + ekran maliyeti taşıyor ama çekirdek değer (alışkanlık takibi + koç) için şart değil. Kullanım verisi yoksa öne çıkarmadan arka planda tut; bakım yükünü sorgula.
- **Demo modu:** Kullanılmıyor — kaldır.
- **Radar "Habit DNA":** Görsel olarak etkileyici ama 30 günlük veriye kadar boş/yanıltıcı. Yeni kullanıcıda değer üretmiyor; en azından "yeterli veri yok" durumu ekle. Kaldırma değil ama önceliğini düşür.

---

## Eğer Yarın Product Lead Olsaydım — İlk 1 Hafta

**Gün 1 — Güvenlik & para sızıntıları (hepsi P0, hepsi hızlı):**
- GitHub token iptal + remote temizliği.
- `clientPremium` bayrağını kaldır.
- `App.tsx`'te `active = dbActive` (localSku'yu premium kararından çıkar).
- Değişiklikleri gerçek cihazda premium akışıyla test et.

**Gün 2 — Store bloklayıcıları:**
- Streak Kalkanı'nı paywall'dan kaldır (veya implemente et — kaldırmayı öner).
- Android kararı: **ilk sürümü iOS-only yayınla**, Android IAP'ı sonraya ertele (yoksa Android satın almayı tam implemente et — 2+ gün).

**Gün 3 — Paywall & lokalizasyon:**
- Paywall'ı tamamen `t()`'ye taşı, `isTurkish`'i reaktif dil store'una bağla.
- Kalan hardcoded TR stringleri (Profile "AKTİF"/"PREMIUM", info bloğu) topla.

**Gün 4 — Aktivasyon & AI:**
- Kayıt→VerifyEmail akışını bağla (veya e-posta onayını kapat).
- Injection regex'lerini daralt, false-positive'leri gider.

**Gün 5 — A11y & kararlılık:**
- `textMuted` kontrastını düzelt.
- Kritik akışlara `accessibilityLabel`.
- Kök ErrorBoundary + Sentry.
- Android bildirim izni.

**Gün 6 — Temizlik & doğruluk:**
- Ölü kod sil (Aura, demo), `package.json` adı.
- Haftalık oran hesabını düzelt.
- `ignoreLogs`'tan gerçek hataları çıkar, çıkanları düzelt.

**Gün 7 — Regresyon & submit hazırlığı:**
- Uçtan uca test (kayıt, satın alma, restore, iptal→free düşüşü, streak, koç limiti).
- Store metadata/ekran görüntüleri TR/EN.
- privacyManifest gözden geçir, TestFlight.

Sıralama ilkesi: **önce para ve güvenlik kaçaklarını kapat, sonra mağaza bloklayıcıları, sonra deneyim.** Yeni özellik yok — mevcut ürünü sağlam ve dürüst hale getirmek 1 haftanın tamamını hak ediyor.

---

## Confidence Score: 82%

**Sebep:** Denetim tam kaynak koduna (istemci + Supabase şeması + üç Edge Function + config) dayanıyor; güvenlik, monetizasyon ve akış bulguları doğrudan koddan kanıtlı (yüksek güven). Kontrast değerleri hesaplandı. Puanı 100 yapmayan: uygulama canlı çalıştırılmadı (runtime crash'ler, gerçek IAP davranışı, gerçek cihazda bildirim/streak davranışı gözlemlenmedi); dönüşüm/retention yorumları kullanıcı verisi olmadan hipotez; `node_modules`, native `ios/android` klasörleri ve bazı bileşenler (ikon setleri, mocks) tam okunmadı.

## Belirsizlik Özeti

- **Emin olunan noktalar (koddan kanıtlı):** GitHub token sızıntısı, `clientPremium` bypass, `localSku` premium kalıcılığı, Android IAP'ın iOS-only oluşu, Streak Kalkanı'nın verilmemesi, sıfır a11y etiketi, textMuted kontrast değeri, i18n paritesi, RLS varlığı, sunucu IAP doğrulaması.
- **Varsayımlar:** Uygulamanın hem iOS hem Android'e çıkma niyeti (app.json'a dayanarak); Supabase'de e-posta doğrulamasının açık olduğu (varsayılan); paywall'ın ana dönüşüm noktası olduğu.
- **Bilinmeyenler:** Gerçek runtime crash oranı; Supabase e-posta onay ayarı; OTA (`projectId`) gerçekten çalışıyor mu; premium kullanıcıya kalkan veren bir sunucu işi/cron başka yerde var mı (görülen kodda yok); mocks'ların üretim build'ine sızıp sızmadığı.
- **Doğrulanması gerekenler (test/analitik ile):** iOS satın alma→restore→iptal sonrası free'ye düşüş; Android'de satın alma davranışı; streak'in çok günlü/çok cihazlı doğruluğu; injection filtresinin gerçek false-positive oranı; kayıt sonrası kullanıcının ne gördüğü; a11y'nin VoiceOver/TalkBack ile gerçek deneyimi.
