# BLOOM

> Bu README, repoya giriş noktasıdır; hiçbir konunun tek kaynağı değildir. Ayrıntılar için §10'daki doküman hiyerarşisine gidin.

## 1. BLOOM Nedir?

BLOOM, bireyin alışkanlıklarını takip etmesini, bir yapay zeka koçuyla motive olmasını ve süreklilik (streak) yoluyla kalıcı davranış kazanmasını sağlayan bir **alışkanlık koçu** uygulamasıdır. Üç ayak üzerine kuruludur: **takip, koç, süreklilik.** Freemium + abonelik modeliyle çalışır ve tek bir geliştirici tarafından sürdürülür. (Kaynak: `docs/core/PRODUCT_BIBLE.md`)

## 2. Mevcut Ürün Aşaması

- **Aşama:** Pre-PMF / lansman öncesi.
- **İncelenen/son sürüm:** 1.0.1 (iOS build 36).
- **Aktif çalışma sürümü:** v1.0.2 — "Para & Güvenlik Güvenli" (lansman adayı; bkz. `docs/core/ROADMAP.md`).
- Bu aşamada ilke: kapsam genişletmek değil, çekirdeği sağlamlaştırmak (PRODUCT_BIBLE §6, §14).

## 3. Çekirdek Değer

"Alışkanlıklarını takip et, bir yapay zeka koçuyla motive ol, süreklilikle kalıcı hale getir." Çekirdek döngü: **takip et → tamamla → seriyi koru → koçtan destek al.** Koç genel amaçlı bir AI asistanı değildir; yalnızca alışkanlık, motivasyon ve süreklilik bağlamında konuşur.

## 4. Desteklenen Platformlar

- **İlk yayın hedefi iOS-only'dir** (DEC-001).
- **Android satın alma (IAP) desteği ertelenmiştir** (DEC-007); Android satın alma yolu teknik olarak çalışmamaktadır ve lansman kapsamı dışındadır. Android talebi kanıtlanana kadar bu iş açılmaz.
- Kod tabanında Android yapılandırması mevcuttur ancak Android tamamlanmış/desteklenen bir platform **değildir**.

## 5. Teknik Yığın

Yüksek seviye özet (tek kaynak: `docs/core/TECHNICAL_CONTEXT.md`):

- **Runtime/Framework:** Expo ~56, React Native 0.85, React 19, TypeScript ~6.
- **Navigasyon:** React Navigation v7 (stack + bottom-tabs).
- **State:** Zustand (birincil); React Query provider kurulu (kullanım kapsamı doğrulanmalı).
- **Backend:** Supabase (Postgres + Auth + Edge Functions, RLS tüm tablolarda).
- **AI:** OpenAI — yalnızca sunucu tarafı (Edge Functions); istemci OpenAI'a doğrudan erişmez.
- **Satın alma:** react-native-iap v15 + Apple App Store Server API sunucu doğrulaması.
- **Kimlik:** Supabase Auth (e-posta/şifre, Google, Apple).
- **i18n:** i18next; TR/EN çeviri kaynakları mevcut. Bazı yüzeylerde — özellikle paywall'da — hardcoded dil ve reaktif olmayan lokalizasyon sorunları vardır; düzeltmeler ROADMAP T-007 ve T-008'de planlıdır.

## 6. Repo Yapısı

Yüksek seviye (ayrıntı: TECHNICAL_CONTEXT §4):

```
App.tsx, index.ts      → giriş noktası
src/
  components/ features/ navigation/ stores/ services/
  i18n/ theme/ hooks/ types/ utils/ constants/ mocks/
supabase/
  functions/           → chat, verify-purchase, weekly-insights
  migrations/          → veritabanı şeması
docs/
  core/ business/ audits/   → doküman sistemi (bkz. §10)
ios/ android/          → native projeler
locales/ assets/       → çeviri ve varlıklar
```

Not: `package.json` adı hâlâ `"aura"` (eski marka kalıntısı — bilinen teknik borç, düzeltme T-016'da planlı).

## 7. Kurulum

Package manager: **npm** (`package-lock.json` mevcut).

```bash
npm install
```

Ardından proje kökünde bir `.env` dosyası oluşturun ve **yalnızca public istemci değişkenlerini** ekleyin (bkz. §9):

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

`.env.example`'ı körlemesine kopyalamayın: dosyada `OPENAI_API_KEY` placeholder'ı bulunur, ancak bu bir **sunucu secret'ıdır** ve istemci `.env` dosyasına asla yazılmaz (bkz. §9). `.env` git-ignore'dadır.

## 8. Çalıştırma

`package.json` scriptlerinden doğrulanmış komutlar:

```bash
npm run start      # Expo development server
npm run ios        # iOS build + çalıştırma (expo run:ios)
npm run android    # Android build (expo run:android) — satın alma çalışmaz, bkz. §4
npm run web        # Web önizleme (expo start --web)
```

- Kökte `run_ios_simulator.command` script'i mevcuttur (içeriği/amacı doğrulanmadı — TECHNICAL_CONTEXT §13).
- EAS build profilleri: `development`, `preview`, `production` (`eas.json`).

## 9. Ortam Değişkenleri

Gerçek secret değerler asla repoya yazılmaz. Doğrulanmış değişkenler (TECHNICAL_CONTEXT §12; `.env.example`):

**İstemci `.env` dosyasında yalnızca şunlar bulunur (public):**

- `EXPO_PUBLIC_SUPABASE_URL` — Supabase proje URL'i.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon anahtarı (public).

**Aşağıdaki secret'lar istemci `.env` dosyasına YAZILMAZ** — bunlar Supabase Edge Function / Supabase Secrets ortamında tutulur:

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` — AI koç çağrıları (yalnızca sunucu tarafında kullanılır)
- `APPLE_ISSUER_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` — satın alma doğrulaması

(Edge Function ortamında ayrıca `SUPABASE_URL` ve `SUPABASE_ANON_KEY` tanımlıdır.)

Not: `.env.example` içinde `OPENAI_API_KEY` placeholder'ı bulunsa bile, gerçek değer istemci `.env` dosyasına konmamalıdır; kod bu anahtarı yalnızca Edge Function ortamında kullanır.

## 10. Doküman Hiyerarşisi

Hangi dosya hangi gerçeği tutar:

| Dosya | Rolü |
|---|---|
| `docs/core/PRODUCT_BIBLE.md` | **Ürün anayasası** — değişmez ilkeler |
| `docs/core/TECHNICAL_CONTEXT.md` | **Teknik gerçeğin kaynağı** — koddan doğrulanmış |
| `docs/core/DECISIONS.md` | **Bağlayıcı kararlar** (append-only, DEC-XXX) |
| `docs/core/ROADMAP.md` | **Aktif ve onaylı işler** (T-XXX, sürüm bazlı) |
| `docs/core/BACKLOG.md` | **Onaylanmamış fikir ve hipotezler** (BL-XXX) |
| `docs/business/MONETIZATION_BIBLE.md` | Gelir ilkeleri |
| `docs/business/MARKETING_BIBLE.md` | Pazarlama ilkeleri |
| `docs/business/GROWTH_BIBLE.md` | Büyüme ilkeleri |
| `docs/business/KPI.md` | Metrik sözlüğü ve ölçüm kuralları |
| `docs/audits/` | Kaynak/kanıt belgeleri (denetim raporu + Product Lead karar dokümanı) |
| `CLAUDE.md`, `AGENTS.md` | AI/geliştirici çalışma talimatları |

Çelişki halinde: ürün ilkeleri → PRODUCT_BIBLE; teknik gerçek → TECHNICAL_CONTEXT; kararlar → DECISIONS; aktif işler → ROADMAP.

## 11. Aktif Sürüm ve Roadmap

Aktif roadmap **v1.0.2 → v1.0.5** arasındadır (tümü "Planlandı"; ayrıntı ve Release Criteria: `docs/core/ROADMAP.md`):

- **v1.0.2 — Para & Güvenlik Güvenli** (lansman adayı): gelir kaçakları + güvenlik/mağaza bloklayıcıları.
- **v1.0.3 — Dönüşüm & Aktivasyon:** paywall lokalizasyonu + aktivasyon akışı + mağaza metadata.
- **v1.0.4 — Kararlılık & Erişilebilirlik:** error boundary, hata izleme, a11y.
- **v1.0.5 — Temizlik & Doğruluk:** teknik borç ve veri doğruluğu.

## 12. Bilinen Kritik Durumlar

v1.0.2 öncesi çözülmesi gereken gelir/güvenlik konuları mevcuttur. Yüksek seviyede:

- Repo remote'unda tespit edilmiş bir erişim token'ı sorunu (iptal + temizlik: T-001 / DEC-005).
- Premium yetkisinin istemci bayrağıyla (`clientPremium`) aşılabilmesi (T-002 / DEC-003).
- Süresi dolan aboneliğin yerel önbellek (`localSku`) nedeniyle premium kalması (T-003 / DEC-004).
- Paywall'da teslim edilmeyen bir özelliğin (Streak Kalkanı) listelenmesi — **bu özellik mevcut değildir** ve paywall'dan kaldırılacaktır (T-004 / DEC-002).

Ayrıntılar ve kanıtlar: `docs/core/ROADMAP.md` (v1.0.2), `docs/core/DECISIONS.md` ve `docs/audits/`. Bu README güvenlik açığı tarifi veya secret değeri içermez.

## 13. Çalışma Kuralları

- `CLAUDE.md` (→ `@AGENTS.md` importu) çalışma talimatlarını tutar; Expo v56 sürümlü dokümantasyonu esas alınır.
- **Açık onay olmadan hiçbir dosya değiştirilmez.**
- Akış: **önce taslak → onay → yalnızca belirtilen dosyaya yazma.**
- Yeni bilgi üretilmez; kodda veya kaynak dokümanlarda olmayan iddia eklenmez.
- Kesin karar / aktif görev / hipotez / teknik gerçek ayrımı her zaman korunur.
- Dokümanlar arası çelişki görülürse çözülmeye çalışılmaz; önce bildirilir.

## 14. Doğrulama ve Test

- Hiçbir görev doğrulanmadan "Tamamlandı" sayılmaz (TECHNICAL_CONTEXT §18; ROADMAP kuralları).
- Kod değişikliği sonrası zorunlu doğrulama sırası TECHNICAL_CONTEXT §18'dedir (güvenlik → satın alma akışı → şema tutarlılığı → premium kararı → OTA → bildirim izni).
- Otomatik test altyapısı ve hata izleme (Sentry vb.) henüz mevcut değildir (TECHNICAL_CONTEXT §16); kritik akışlar gerçek cihazda doğrulanır (T-006).
- Sürümler, Release Criteria karşılanmadan yayınlanmaz.

## 15. Katkı / Değişiklik Süreci

- Yeni **karar** → `DECISIONS.md`'ye DEC-XXX olarak (append-only; anayasayla çelişemez).
- Yeni **iş** → yalnızca onaylı kaynaklardan `ROADMAP.md`'ye T-XXX olarak.
- Yeni **fikir/hipotez** → `BACKLOG.md`'ye BL-XXX olarak (kanıt seviyesiyle).
- Teknik değişiklik → `TECHNICAL_CONTEXT.md` güncellenir (yaşayan belge).
- İlke değişikliği → önce ilgili Bible dosyası; PRODUCT_BIBLE ile çelişen karar, anayasa güncellenmeden eklenemez.

## 16. Lisans veya Durum Notu

- Kökteki `LICENSE` dosyası **MIT License** içerir; ancak telif satırı Expo şablonundan kalmadır ("Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)") ve proje adına güncellenmemiştir. Bağlayıcı lisans durumu için `LICENSE` dosyasına bakınız.
- `package.json` içindeki `"private": true` alanı yalnızca paketin npm registry'ye yanlışlıkla yayımlanmasını engeller; Git reposunun erişim gizliliğini kanıtlamaz veya belirlemez.
- Bu README'deki tüm bilgiler mevcut doküman sisteminden ve koddan doğrulanmış gerçeklerden türetilmiştir; `DURUM.md` şu an placeholder'dır ve kaynak olarak kullanılmamıştır.

## 17. Değişiklik Özeti

- **Oluşturuldu:** README ilk sürümü (repo giriş noktası).
- **Kaynak:** Mevcut doküman sistemi (core + business + audits) ve koddan doğrulanmış gerçekler (`package.json`, `.env.example`, `eas.json`); yeni strateji, özellik, karar veya teknik bilgi üretilmedi.
- **Doğrulama:** Kurulum/çalıştırma komutları `package.json` scriptlerinden, package manager `package-lock.json`'dan, ortam değişkenleri `.env.example` + TECHNICAL_CONTEXT §12'den doğrulandı; doğrulanmayan alanlar açıkça işaretlendi.
- **Dürüstlük sınırları:** iOS-first / pre-PMF durumu korundu; Android tamamlanmış gibi gösterilmedi; Streak Kalkanı mevcut özellik olarak yazılmadı; kritik durumlar yüksek seviyede ve yönlendirici anıldı, secret değer veya ayrıntılı açık tarifi eklenmedi.
- **Revizyonlar (onaylı):** İstemci `.env` / sunucu secret ayrımı netleştirildi (`.env.example`'ın körlemesine kopyalanması önerisi kaldırıldı); i18n ifadesi mevcut lokalizasyon sorunlarını (T-007, T-008) gizlemeyecek şekilde düzeltildi; LICENSE içeriği doğrulandı (MIT, Expo şablon telif satırıyla) ve `"private": true`'nun yalnızca npm yayımını engellediği netleştirildi.
