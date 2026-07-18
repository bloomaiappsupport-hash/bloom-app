# BLOOM — TECHNICAL_CONTEXT (Teknik Gerçek Kaynağı)

> Bu doküman BLOOM'un **koddan doğrulanmış teknik gerçeğini** tutar. Ürün ilkeleri (`PRODUCT_BIBLE`), kesin kararlar (`DECISIONS`) veya aktif işler (`ROADMAP`) burada yer almaz. Kaynak: mevcut kod tabanı, `BLOOM_DENETIM_RAPORU.md`, `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`.

## 1. Amaç
Geliştiricinin ve gelecekteki oturumların, BLOOM'un teknik yapısını tek bir doğrulanmış kaynaktan okuyabilmesi. Bu dosya yaşayan bir belgedir; kod değiştikçe güncellenir. Yalnızca kodda görülebilen gerçeği içerir; varsayım içermez.

## 2. Teknoloji Yığını

### 2.1 Çekirdek Teknolojiler
Koddan doğrulanmış (`package.json`):
- **Runtime/Framework:** Expo `~56.0.12`, React Native `0.85.3`, React `19.2.3`, TypeScript `~6.0.3`.
- **Navigasyon:** `@react-navigation/native` v7, `stack` v7, `bottom-tabs` v7.
- **State:** `zustand` ^5 (birincil), `@tanstack/react-query` ^5 (provider kurulu; kullanım kapsamı → **Doğrulanmalı**).
- **Backend SDK:** `@supabase/supabase-js` ^2.108.2.
- **Satın alma:** `react-native-iap` ^15.3.3.
- **Kimlik:** `@react-native-google-signin/google-signin` ^16, `expo-apple-authentication`.

### 2.2 Destekleyici Kütüphaneler
Koddan doğrulanmış (`package.json`):
- **i18n:** `i18next` ^26, `react-i18next` ^17, `expo-localization`.
- **Depolama:** `expo-secure-store`, `@react-native-async-storage/async-storage` ^3.1.1.
- **UI/animasyon:** `react-native-reanimated` 4.3.1, `gesture-handler`, `screens`, `safe-area-context`, `react-native-svg`, `expo-linear-gradient`, `expo-blur`, `expo-haptics`, `@expo-google-fonts/inter`.
- **Diğer:** `expo-notifications`, `expo-splash-screen`, `expo-status-bar`, `react-native-url-polyfill`, `lottie-react-native` (bağımlılık mevcut; okunan ekranlarda kullanımı görülmedi → **Doğrulanmalı**).

## 3. Proje Mimarisi
- Giriş: `index.ts` → `App.tsx`. Sağlayıcılar: `GestureHandlerRootView` → `SafeAreaProvider` → `QueryClientProvider` → `RootNavigator`.
- Navigasyon iki kola ayrılır (`RootNavigator`, `useAuthStore` durumuna göre): oturum yoksa auth akışı (`Splash → Onboarding → Assessment → BloomCreation → Auth`), oturum varsa `Main`. `Paywall` modal olarak kök seviyede.
- `MainNavigator` alt sekmeler: **Home, Habits, Coach, Insights, Profile**.
- Veri yükleme büyük ölçüde doğrudan Supabase servis çağrıları + Zustand store'lar üzerinden yapılıyor; React Query provider kurulu olsa da kullanım yaygınlığı → **Doğrulanmalı**.
- Tema karanlık-öncelikli: `themeStore` her zaman `isDark: true`; `app.json` `userInterfaceStyle: "dark"`. `colors.ts` hem dark hem light tanımlar ama auth ekranları daima dark kullanır.
- İstemci OpenAI'a doğrudan erişmez; `src/services/openai` klasörü boştur. Yapay zeka çağrıları yalnızca sunucu (Edge Functions) üzerinden.

## 4. Klasör Yapısı
Koddan doğrulanmış:
```
src/
├── components/   (assessment, coach, common, habits, insights, navigation, onboarding)
├── constants/
├── features/     (auth, coach, habits, home, insights, paywall, profile)
├── hooks/        (useColors.ts)
├── i18n/         (index.ts, locales/en.json, locales/tr.json)
├── mocks/        (react-native-iap.ts, react-native-nitro-modules.ts)
├── navigation/   (RootNavigator, AuthNavigator, MainNavigator, types)
├── services/     (notifications.ts, openai/ [boş], supabase/)
├── stores/       (authStore, habitStore, languageStore, themeStore)
├── theme/        (colors, spacing, typography, index)
├── types/        (index.ts)
└── utils/        (errorMessage.ts)
supabase/
├── functions/    (chat, verify-purchase, weekly-insights)
└── migrations/   (001_initial_schema.sql, 002_delete_user_account.sql)
```
- `src/mocks/` içinde `react-native-iap` ve `react-native-nitro-modules` mock'ları var; üretim build'inden izolasyonu → **Doğrulanmalı**.

## 5. Kullanılan Servisler
- **Supabase:** Postgres + Auth + Edge Functions. Proje URL'i config'te açık: `https://vjqspziumgzesiqcaeme.supabase.co` (anon anahtar public).
- **OpenAI:** Yalnızca sunucu tarafı (Edge Functions). Chat Completions API.
- **Apple App Store Server API:** `verify-purchase` içinde ES256 imzalı JWT ile satın alma doğrulaması.
- **Google Sign-In / Apple Authentication:** kimlik sağlayıcıları.
- **Expo Notifications:** yerel bildirim zamanlama.
- **Expo Updates (OTA):** `app.json` `updates.url` tanımlı; yapılandırma geçerliliği → **Doğrulanmalı** (bkz. §15 EAS projectId).

## 6. Kimlik Doğrulama
Koddan doğrulanmış (`services/supabase/auth.ts`, `client.ts`, `App.tsx`):
- Supabase Auth. Yöntemler: e-posta/şifre (`signUp` / `signInWithPassword`), Google (`idToken` → `signInWithIdToken`), Apple (`identityToken` → `signInWithIdToken`).
- Oturum SecureStore'da saklanır (2KB üstü değerler için chunk'lı adapter), `autoRefreshToken: true`, `persistSession: true`, `detectSessionInUrl: false`.
- Deep link: `bloom://auth/callback` — PKCE (`exchangeCodeForSession`) ve implicit (`setSession`) her ikisi de `App.tsx`'te ele alınıyor.
- Hesap silme: `delete_user_account` RPC (`security definer`).
- **Doğrulanmalı:** `VerifyEmailScreen` mevcut ama `RegisterScreen`'den yönlendirilmiyor (denetim raporu P1). Supabase e-posta onayı ayarının açık/kapalı olduğu backend'de → **Belirsiz**.

## 7. Veritabanı
Koddan doğrulanmış (`migrations/001_initial_schema.sql`, `002`):
- **Tablolar:** `profiles`, `user_preferences`, `subscriptions`, `habits`, `habit_stacks`, `completions`, `streaks`, `coach_messages`, `insights`.
- **RLS:** tüm tablolarda etkin; politikalar `auth.uid()` bazlı. `subscriptions` kullanıcıya yalnızca `SELECT`; yazma service-role ile.
- **Trigger:** `handle_new_user` — kayıt olunca `profiles`, `user_preferences`, `subscriptions` (free) satırlarını oluşturur.
- **İndeksler:** `habits.user_id`, `completions(habit_id)`, `completions(user_id, completed_at)`, `streaks.user_id`, `coach_messages(user_id, created_at)`.
- **Doğrulanmalı (kod ↔ şema tutarlılığı):** Kod `habits`'e `reminder_time`, `completions`'a `category` yazıyor; migration 001'de bu iki kolon görünmüyor. Sonraki bir migration'da eklenip eklenmediği doğrulanmalı.

## 8. Yapay Zeka Altyapısı
Koddan doğrulanmış (`functions/chat`, `functions/weekly-insights`):
- **Chat:** model plana göre `gpt-4o` (premium) / `gpt-4o-mini` (free); `max_tokens: 600`, `temperature: 0.75`; son 10 mesaj gönderilir; sabit sistem prompt'u (koç kimliği + konu sınırı); prompt-injection regex filtresi; mesajlar service-role ile `coach_messages`'a yazılır.
- **Ücretsiz limit:** sunucu tarafı günlük 3 kullanıcı mesajı (`coach_messages` sayımı, UTC gün başı).
- **Weekly insights:** `gpt-4o`, `max_tokens: 800`, `temperature: 0.7`; `insights` tablosunda `week_start` bazında önbelleklenir.
- **Doğrulanmalı (denetim raporundan):** injection filtresi false-positive üretiyor. (Denetim bulgusudur; çözüm/roadmap bu dosyada tutulmaz.)
- **Güncellendi (2026-07-17):** `clientPremium` bayrağı artık kodda yok — `chat` fonksiyonu model/limit kararını yalnızca `dbActive`'e dayandırıyor (T-002, Supabase'e deploy edildi, canlıda). Bu artık "doğrulanmalı" değil, koddan doğrulanmış gerçektir.

## 9. Abonelik Sistemi
Koddan doğrulanmış (`PaywallScreen.tsx`, `functions/verify-purchase`, `App.tsx`, `ProfileScreen.tsx`):
- `react-native-iap` v15 ile abonelik (subs). SKU'lar: `com.barangunduz.bloomhabit.monthly`, `...yearly`.
- Akış: `requestPurchase` → `finishTransaction` → `verify-purchase` Edge Function → Apple App Store Server API (ES256 JWT, `BUNDLE_ID` kontrolü, `expiresDate`) → premium yalnızca sunucu tarafından `subscriptions` tablosuna yazılır.
- İstemci aktif SKU'yu SecureStore'da (`bloom_active_plan_sku`) yalnızca etiketleme için önbelleğe alır.
- Geri yükleme: `getAvailablePurchases` → her biri için `verify-purchase`.
- **Platform:** `verify-purchase` yalnızca `platform === 'ios'` kabul eder; `requestPurchase` yalnızca `apple` isteği yollar. Android satın alma yolu yok (denetim P0; karar dokümanı: iOS-first, Android ertelendi).
- **Güncellendi (2026-07-17):** `clientPremium` bypass'ı kod tarafında kapatıldı (`chat` fonksiyonu artık yalnızca `dbActive`'e bakıyor; T-002, Supabase'e deploy edildi, canlıda). `App.tsx`'teki `active = dbActive || !!localSku` mantığı kaldırıldı; karar artık yalnızca `dbActive` (T-003, yalnızca yerel kod değişikliği — henüz commit/build/App Store submit edilmedi, bir sonraki build'i bekliyor). Her iki düzeltme de kod denetimiyle doğrulandı; gerçek cihazda uçtan uca davranışsal doğrulama T-006 kapsamında ayrıca yapılacak.

## 10. Bildirim Sistemi
Koddan doğrulanmış (`services/notifications.ts`, `MainNavigator.tsx`, `HomeScreen.tsx`):
- `expo-notifications` ile yerel, alışkanlık başına **DAILY** zamanlanmış bildirim (`identifier: habit-<id>`).
- İzin: iOS'ta istenir; Android'de `requestNotificationPermission` istek yapmadan `true` döner (denetim P1).
- `MainNavigator`'da 2 sn sonra bir kez bildirim izni onboarding Alert'i (`@bloom_notif_requested`).
- Gece yarısı sıfırlama `MainNavigator`'da `setTimeout` ile.
- Home'daki "bildirim merkezi" push değil; istemcide hesaplanan uygulama-içi uyarılardır (at_risk / milestone / all_done).

## 11. Local Storage / Cache
Koddan doğrulanmış:
- **SecureStore:** Supabase oturumu (chunk'lı), `bloom_active_plan_sku`.
- **AsyncStorage:** `@bloom_language`, `@bloom_notifications_enabled`, `@bloom_notif_requested`, `mood_answered_date`.
- **React Query cache:** `staleTime: 5 dk`, `retry: 2` (kullanım kapsamı → **Doğrulanmalı**).
- **Zustand:** bellek-içi store'lar (auth, habit, language, theme); kalıcı değil (dil hariç, o AsyncStorage'da).

## 12. Ortam Değişkenleri
Koddan doğrulanmış (`.env.example`, `client.ts`, Edge Functions, `eas.json`):
- **İstemci (public):** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- **Edge Function ortamı:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `APPLE_ISSUER_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`.
- `.env` git-ignore'da; `.env.example` placeholder içerir. `eas.json` preview/production için `EXPO_PUBLIC_SUPABASE_URL` set eder.
- **Not (denetim P0):** Git remote URL'inde canlı bir GitHub token bulunmuştu — bu bir ortam değişkeni değil, ayrı bir güvenlik bulgusudur (bkz. §15).

## 13. Build ve Çalıştırma Komutları
Koddan doğrulanmış (`package.json`, `eas.json`):
- npm script'leri: `start` (`expo start`), `android` (`expo run:android`), `ios` (`expo run:ios`), `web` (`expo start --web`).
- EAS profilleri: `development` (dev client, internal, simulator), `preview` (internal; Android apk), `production` (`autoIncrement: false`). `cli.appVersionSource: local`.
- Kök dizinde `run_ios_simulator.command` ve `git_status.sh` script'leri mevcut; içerik/amaç → **Doğrulanmalı**.

## 14. Platformlar (iOS / Android)
Koddan doğrulanmış (`app.json`):
- **iOS:** bundleId `com.barangunduz.bloomhabit`, buildNumber `36`, `supportsTablet: true`, `requireFullScreen: true`, encryption exempt (`usesNonExemptEncryption: false`), privacy manifest yalnızca `UserDefaults` reason içerir (yeterliliği → **Doğrulanmalı**). Info.plist izin metinleri: bildirim, kamera, fotoğraf kitaplığı.
- **Android:** package `com.barangunduz.bloomhabit`, versionCode `5`, izinler: `RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `POST_NOTIFICATIONS`; engellenen izinler: kişiler ve takvim (okuma/yazma).
- Karar dokümanı: ilk sürüm iOS-first; Android IAP ertelendi.

## 15. Bilinen Teknik Riskler

> Bu bölüm yalnızca mevcut teknik gerçekleri kaydeder. Çözüm, öncelik ve zaman planı bu dosyada tutulmaz; yalnızca ROADMAP ve DECISIONS'ta yönetilir.

Denetim raporundan doğrulanmış (2026-07-13 tespiti); güncel durum parantez içinde:
- Git remote URL'inde canlı GitHub token (P0) — **Giderildi (T-001, 2026-07-17): token GitHub'da iptal edildi, remote SSH'a çevrildi.**
- `clientPremium` ile premium yetki bypass'ı (P0) — **Kod tarafında giderildi ve canlıya deploy edildi (T-002, 2026-07-17); kod denetimiyle doğrulandı.**
- `localSku` ile süresi dolan aboneliğin premium kalması (P0) — **Kod tarafında giderildi (T-003, 2026-07-17); henüz App Store'a çıkmadı (yalnızca yerel değişiklik, sonraki build'i bekliyor); gerçek cihaz davranışsal doğrulaması T-006'da.**
- Android satın alma yolunun eksikliği (P0) — **Hâlâ eksik; artık ertelenmiş değil, DEC-009 ile aktif geliştirme kapsamında (ROADMAP T-021). "Eksik" durumu değişmedi, yalnızca çalışma statüsü değişti.**
- Kök Error Boundary yok; `LogBox.ignoreLogs` gerçek hataları (`Cannot read property`, `Unhandled Promise Rejection`) susturuyor (P1).
- İstemci tarafı streak hesabı + gece yarısı `setTimeout` sıfırlaması — çok cihaz/saat dilimi kırılganlığı (P2).
- Edge Function'larda `Access-Control-Allow-Origin: '*'` (P2, düşük).
- EAS `projectId` slug görünümünde; OTA yapılandırması → **Doğrulanmalı** (P3).

## 16. Teknik Borç
Denetim/karar dokümanından doğrulanmış:
- İstemci tarafı streak mantığı (kaynaktan türetme yerine mutable sütun).
- Gece yarısı `setTimeout` sıfırlaması.
- `LogBox.ignoreLogs` gerçek hataları gizliyor.
- Ölü kod: `AuraCreationScreen` (kullanılmıyor), `enterDemoMode`/`DEMO_PROFILE` (çağrılmıyor).
- İki ayrı şifre gücü mantığı (Register vs Profile).
- `isTurkish` modül-yükünde hesaplanıp reaktif değil.
- `src/mocks` içindeki IAP mock'ları.
- Hata izleme (Sentry vb.) yok.
- `package.json` adı hâlâ `"aura"`.

> **İlke:** Yeni teknik borç oluşturmak yerine mevcut teknik borç azaltılmalıdır. Teknik borç kabulü yalnızca opportunity cost açısından gerekçelendirilebiliyorsa yapılır.

## 17. Doğrulanması Gereken Teknik Konular
- `completions.category` ve `habits.reminder_time` kolonlarının şemada gerçekten var olup olmadığı (migration 001'de görünmüyor).
- EAS `projectId`'nin gerçek UUID olup olmadığı ve OTA'nın çalışıp çalışmadığı.
- React Query'nin kod tabanında ne ölçüde fiilen kullanıldığı.
- `lottie-react-native` bağımlılığının kullanılıp kullanılmadığı.
- `src/mocks`'ın üretim build'ine sızıp sızmadığı.
- Supabase tarafında e-posta onayı ayarının durumu.
- iOS privacy manifest'in tüm "required reason API" kullanımlarını (SecureStore/ağ) kapsayıp kapsamadığı.
- `run_ios_simulator.command` ve `git_status.sh` script'lerinin içeriği/amacı.
- Premium kullanıcıya "shield" (kalkan) veren herhangi bir sunucu işi/kodun var olup olmadığı — **Doğrulandı (2026-07-17): Yok.** Ne istemci ne sunucu tarafında `shields_remaining`'i artıran hiçbir kod bulunmuyor (DB varsayılanı 0, hiçbir yerde increment edilmiyor); önceki UI kalıntıları T-004 kapsamında kaldırıldı (bkz. DECISIONS DEC-002, ROADMAP T-004). Bu madde artık açık soru değildir.

## 18. Zorunlu Doğrulama Sırası
Teknik gerçeğin doğrulanması için önerilen kontrol sırası (denetim önceliklerine dayalı; iş/roadmap değil, doğrulama sırasıdır):
1. Git remote'unda token varlığı (güvenlik — en önce).
2. Satın alma → geri yükleme → iptal sonrası free'ye düşüş akışının gerçek cihazda davranışı (iOS).
3. Kod ↔ şema kolon tutarlılığı (`reminder_time`, `category`).
4. Premium kararının artık yalnızca `dbActive` olduğunun gerçek cihazda doğrulanması (`localSku`/`clientPremium` kod tarafından kaldırıldı — T-002/T-003, 2026-07-17).
5. EAS `projectId` / OTA çalışması.
6. Android bildirim izni davranışı.

> Bu doğrulama sırası kod değişikliği sonrasında uygulanır. Hiçbir görev doğrulama tamamlanmadan "bitti" kabul edilmez.

## 19. Doküman İlişkileri
- **Ürün ilkeleri** → `PRODUCT_BIBLE.md`
- **Teknik gerçek** → **bu dosya (`TECHNICAL_CONTEXT.md`)**
- **Kesin kararlar** → `DECISIONS.md`
- **Aktif işler / öncelikler** → `ROADMAP.md`, `BACKLOG.md`
- **Kaynak denetim/karar** → `docs/audits/BLOOM_DENETIM_RAPORU.md`, `docs/audits/BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`
- Çelişki halinde **teknik gerçek için bu dosya** esas alınır.

---

## Değişiklik Özeti
- **Eklendi:** "Teknoloji Yığını" ikiye ayrıldı → §2.1 Çekirdek Teknolojiler, §2.2 Destekleyici Kütüphaneler.
- **Eklendi:** "Bilinen Teknik Riskler" (§15) başına kapsam notu (çözüm/öncelik/plan yalnızca ROADMAP ve DECISIONS'ta).
- **Eklendi:** "Teknik Borç" (§16) sonuna teknik borç ilkesi (yeni borç yerine mevcut borcu azalt; kabul yalnızca opportunity cost ile gerekçelenir).
- **Eklendi:** "Zorunlu Doğrulama Sırası" (§18) sonuna doğrulama kuralı (kod değişikliği sonrası uygulanır; doğrulama tamamlanmadan görev "bitti" sayılmaz).
- **Eklendi:** Bu "Değişiklik Özeti" bölümü.
- **Not:** Bu beş revizyon dışında hiçbir bölümün metni değiştirilmedi.
- **Güncellendi (2026-07-17):** §8, §9, §15, §18 — T-001/T-002/T-003 kod düzeltmeleri ve DEC-009 (Android artık paralel geliştiriliyor) ile tutarlı hale getirildi. T-002 (sunucu, deploy edildi/canlıda) ile T-003 (yalnızca yerel, henüz App Store'a çıkmadı) arasındaki fark her yerde ayrı ayrı belirtildi; hiçbir madde gerçek cihaz doğrulaması (T-006) tamamlanmış gibi yazılmadı.
- **Güncellendi (2026-07-17, 2):** §17'deki "shield" maddesi "Doğrulandı: Yok" olarak kapatıldı (T-004 ile tutarlı; DECISIONS DEC-002, ROADMAP T-004). §17 içinde bu bulguyla çelişen başka bir madde bulunmadığı doğrulandı.
