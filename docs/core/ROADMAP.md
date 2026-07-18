# BLOOM — ROADMAP (Sürüm Bazlı İş Planı)

## Roadmap Sistemi
- Bu dosya **yalnızca aktif işleri** tutar (sürümler ve görevler).
- **Kararlar burada tutulmaz** → `DECISIONS.md`.
- **Ürün ilkeleri burada tutulmaz** → `PRODUCT_BIBLE.md`.
- **Teknik gerçek burada tutulmaz** → `TECHNICAL_CONTEXT.md`.
- **Onaylanmamış fikirler** → `BACKLOG.md`.

> Kaynak: `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`, `BLOOM_DENETIM_RAPORU.md`. Yeni görev üretilmez.

---

## v1.0.2 — "Para & Güvenlik Güvenli"
**Durum:** Planlandı

**Amaç:** Gelir kaçaklarını ve güvenlik/mağaza bloklayıcılarını kapatmak. Bu sürüm lansman adayıdır.

### İçindeki görevler

### T-001 — GitHub token'ını iptal et ve remote'u SSH'a çevir
- **Öncelik:** P0
- **Kaynak:** Karar Dokümanı K1 / Master #1; Denetim Raporu P0-1; DEC-005
- **Durum:** Tamamlandı
- **Doğrulama:** Token GitHub'da iptal edildi (kullanıcı tarafından); remote `git@github.com:bloomaiappsupport-hash/bloom-app.git` SSH URL'ine çevrildi; `git remote -v` token içermediği doğrulandı; `git fetch origin` SSH ile başarıyla çalıştı (2026-07-17).
- **Release kriteriyle ilişkisi:** RC-1.1 (güvenlik olayı kapatılmadan sürüm çıkmaz) — karşılandı

### T-002 — `chat` fonksiyonundan `clientPremium` bayrağını sil; premium'u yalnızca DB belirlesin
- **Öncelik:** P0
- **Kaynak:** Karar Dokümanı K2 / Master #2; Denetim Raporu P0-2; DEC-003
- **Durum:** Tamamlandı
- **Doğrulama:** `supabase/functions/chat/index.ts` içinde `clientPremium` destructure ve kullanımı kaldırıldı; `isPremium = dbActive` yapıldı. `supabase functions deploy chat` ile deploy edildi; `supabase functions list` ile version 12, 2026-07-17 14:27:35 UTC güncellemesi doğrulandı. Gerçek cihazda uçtan uca doğrulama T-006 kapsamında ayrıca yapılacak.
- **Release kriteriyle ilişkisi:** RC-1.2

### T-003 — `App.tsx`'te premium kararını `active = dbActive` yap; `localSku`'yu karardan çıkar
- **Öncelik:** P0
- **Kaynak:** Karar Dokümanı K3 / Master #3; Denetim Raporu P0-3; DEC-004
- **Durum:** Tamamlandı
- **Doğrulama:** `App.tsx`'te `localSku` okuma ve `active = dbActive || !!localSku` mantığı kaldırıldı; `setPlan(dbActive ? 'premium' : 'free')` yapıldı; kullanılmayan `SecureStore` import'u temizlendi; `npx tsc --noEmit` ile tip hatası çıkmadığı doğrulandı. İstemci değişikliği olduğundan bir sonraki App Store build'ine kadar canlıya yansımaz; gerçek cihazda uçtan uca doğrulama T-006 kapsamında.
- **Release kriteriyle ilişkisi:** RC-1.2

### T-004 — Streak Kalkanı'nı paywall FEATURES listesinden kaldır
- **Öncelik:** P0
- **Kaynak:** Karar Dokümanı K4 / Master #4; Denetim Raporu P0-5; DEC-002
- **Durum:** Tamamlandı
- **Doğrulama:** `PaywallScreen.tsx` FEATURES listesinden "Streak Kalkanı" satırı kaldırıldı. Kapsam genişletildi (aynı kararın doğal uzantısı olarak): App Store/Play Store mağaza metinlerindeki (`store-metadata/{tr,en}/app-store.md`, `store-metadata/tr/play-store.md`) Streak Kalkanı/Shield vaatleri kaldırıldı; kodda hiçbir zaman gerçekten çalışmayan (sunucuya hiç yazılmayan grant mekanizması yok, `shields_remaining` DB'de daima 0) kalkan UI'ı (`HabitsScreen.tsx` rozet/uzun-basma menüsü, `habitStore.ts` `useShield`) ve i18n string'leri (`tr.json`/`en.json`) temizlendi. `npx tsc --noEmit` ve JSON doğrulaması temiz. DB şeması (`shields_remaining` kolonu) ve `Streak` tipi kasıtlı olarak dokunulmadı (migration gerektirir, kapsam dışı).
- **Release kriteriyle ilişkisi:** RC-1.3

### T-005 — İlk sürümü iOS-only yayınlama kararını sabitle; Android build'i lansmandan çıkar
- **Öncelik:** P0
- **Kaynak:** Karar Dokümanı K5 / Master #5; Denetim Raporu P0-4; DEC-001
- **Durum:** İptal Edildi (2026-07-17)
- **Gerekçe:** Görevin hedefi ("Android build'i lansmandan çıkar / süresiz ertelemeyi sabitle") DEC-009 ile geçersiz kaldı — proje sahibi Android'i artık ertelemiyor, iOS ile paralel geliştirilmesine karar verdi (bkz. DEC-009, T-021). Görev roadmap'ten çıkarılıyor; geçmiş korunuyor, silinmiyor.
- **Release kriteriyle ilişkisi:** RC-1.4 (bkz. RC-1.4 notu — kriter metni değişmedi, ama artık hiçbir aktif görev buna bağlı değil)

### T-006 — Gerçek cihazda satın alma → geri yükleme → iptal sonrası free düşüşünü doğrula
- **Öncelik:** P0
- **Kaynak:** Karar Dokümanı Master #6 / 30 Günlük Plan Hafta 1
- **Durum:** Tamamlandı
- **Not (2026-07-18):** Adım 1'de (satın alma) cihazda bloke edici bir bulgu çıkmıştı — bkz. T-022. Kod düzeltmesi sonrası taze T-022 build'inde dört akış da gerçek cihazda (Sandbox) baştan koşuldu ve geçti: (1) Satın alma — `subscriptions` satırı oluştu (`plan=premium`), paywall/profil/koç ekranı premium'u yansıttı; (2) Restore — sil/yeniden kur sonrası "Satın Almayı Geri Yükle" premium'u geri getirdi; (3) İptal — Sandbox'tan iptalde premium anında düşmedi, `expires_at`'e kadar aktif kaldı (beklenen davranış); (4) Free düşüşü — süre dolunca (~1-2 dk, Sandbox hızlandırılmış) kapat/aç sonrası kullanıcı free'ye düştü, koç 3 mesaj limiti geri geldi. `localSku`'nun artık karara girmediği (T-003) cihazda kanıtlandı.
- **Gözlem (ayrı, gating'i etkilemiyor):** Adım 4'te `subscriptions.plan` sütunu süre dolunca otomatik 'free'ye dönmüyor (yalnızca `expires_at` doğru); gating zaten `expires_at`'i de kontrol ettiği için davranış doğru, ama ham `plan` sorgusu yanıltıcı olabilir. Ayrı bir teknik borç/KPI notu olarak önerildi, henüz dokümana işlenmedi.
- **Release kriteriyle ilişkisi:** RC-1.2 — karşılandı.

### T-022 — PaywallScreen'deki "zaten aktif" guard'ını kaldır; `verify-purchase`'ın her satın almada çalışmasını garanti et
- **Öncelik:** P0
- **Kaynak:** T-006 sırasında canlı Sandbox cihazında keşfedilen bulgu (2026-07-17); ilke kaynağı DEC-003/DEC-004 ("sunucu tek doğru kaynak").
- **Durum:** Tamamlandı
- **Bulgu:** `PaywallScreen.tsx`'teki `handlePurchaseSuccess` içinde, satın alma sonrası yerel `SecureStore` bayrağı (`bloom_active_plan_sku`) satın alınan SKU ile eşleşiyorsa fonksiyon `verify-purchase`'ı hiç çağırmadan erken `return` ediyordu. Sonuç: gerçek ödeme yapan kullanıcı Apple tarafında abone olsa da sunucu/DB bundan haberdar olmuyor, kullanıcı premium'a geçmiyordu — DEC-003/DEC-004'ün "sunucu tek doğru kaynak" ilkesini bu kez ters yönde (fazla değil, eksik yetki) ihlal eden ayrı bir bulgu. T-002/T-003 regresyonu değildir.
- **Doğrulama (DoD — iki ayrı adım, karıştırılmaz):**
  1. ✅ Kod düzeltmesi uygulandı (2026-07-18): `PaywallScreen.tsx`'teki erken-return bloğu kaldırıldı; `verify-purchase` artık her başarılı satın almada koşulsuz çağrılıyor. `npx tsc --noEmit` temiz. `ACTIVE_PLAN_KEY`'in diğer kullanımları (UI etiketleme/cache — `PaywallScreen.tsx:109`, `ProfileScreen.tsx:453/527`) incelendi; meşru, dokunulmadı.
  2. ✅ Gerçek cihazda uçtan uca doğrulandı (2026-07-18): Taze build'de satın alma tekrar test edildi; `subscriptions` tablosuna `plan=premium` satırı oluştu, uygulama premium'a geçti (paywall/profil/koç ekranı). Guard'lı önceki denemede bu satır hiç oluşmuyordu — düzeltme doğrulandı.
- **Release kriteriyle ilişkisi:** RC-1.2 — karşılandı.

### Release Criteria — v1.0.2
- **RC-1.1:** Repo remote'unda token kalmadı; token iptal edildi.
- **RC-1.2:** Premium yalnızca sunucu/DB'den belirleniyor; satın alma → restore → iptal sonrası free düşüşü gerçek cihazda doğrulandı.
- **RC-1.3:** Paywall'da teslim edilmeyen özellik (Streak Kalkanı) görünmüyor.
- **RC-1.4:** Yayın hedefi iOS; Android build lansman kapsamı dışında. *(Not: Bu kriter yalnızca v1.0.2 sürüm kapsamını tanımlar; Android'in genel geliştirme durumu DEC-009'a tabidir.)*

---

## v1.0.3 — "Dönüşüm & Aktivasyon"
**Durum:** Planlandı

**Amaç:** Aynı trafiği daha iyi paraya çevirmek — paywall'ı lokalize etmek ve aktivasyon funnel'ını tamir etmek.

### İçindeki görevler

### T-007 — Paywall'daki tüm hardcoded Türkçe metni `t()`'ye taşı
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı K6 / Master #7; Denetim Raporu P1-6
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-2.1

### T-008 — `isTurkish` yerine reaktif dil store'unu (`useTranslation`) bağla
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı Master #8; Denetim Raporu P1-6
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-2.1

### T-009 — Kayıt başarısında `VerifyEmail` ekranına yönlendir (veya e-posta onayını kapat)
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı K7 / Master #9; Denetim Raporu P1-12
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-2.2

### T-010 — Lokalize App Store metadata + TR/EN ekran görüntülerini hazırla
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı Master #10 / §5 Gelir Stratejisi
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-2.3

### Release Criteria — v1.0.3
- **RC-2.1:** Paywall tümüyle lokalize; dil değişimine reaktif; hiçbir ekranda dil karışıklığı yok.
- **RC-2.2:** Kayıt sonrası kullanıcı net bir doğrulama/aktivasyon akışına yönleniyor.
- **RC-2.3:** App Store metadata ve ekran görüntüleri TR/EN hazır.

---

## v1.0.4 — "Kararlılık & Erişilebilirlik"
**Durum:** Planlandı

**Amaç:** Güvenilir ve erişilebilir bir deneyim — çökme ağı, hata izleme ve temel erişilebilirlik.

### İçindeki görevler

### T-011 — Kök seviyede Error Boundary (yeniden dene fallback'li) ekle
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı K9 / Master #11; Denetim Raporu P1-11
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-3.1

### T-012 — Sentry/expo hata izlemeyi bağla ve `ignoreLogs`'tan gerçek hata desenlerini çıkar
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı Master #12; Denetim Raporu P1-11
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-3.1

### T-013 — Injection regex'lerini yalnızca gerçek jailbreak kalıplarına daralt
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı K10 / Master #13; Denetim Raporu P1-9
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-3.2

### T-014 — `textMuted` rengini AA kontrastı sağlayacak şekilde aç
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı Master #14; Denetim Raporu P1-8
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-3.3

### T-015 — Auth + paywall + habit akışlarındaki ikon butonlara `accessibilityLabel` ekle
- **Öncelik:** P1
- **Kaynak:** Karar Dokümanı Master #15; Denetim Raporu P1-7
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-3.3

### Release Criteria — v1.0.4
- **RC-3.1:** Kök error boundary aktif ve hata izleme bağlı; gerçek hatalar artık susturulmuyor.
- **RC-3.2:** Koç, meşru mesajlarda yanlış ret üretmiyor.
- **RC-3.3:** Kritik metin kontrastı AA'yı geçiyor; kritik akışlardaki ikon butonlar ekran okuyucuyla erişilebilir.

---

## v1.0.5 — "Temizlik & Doğruluk"
**Durum:** Planlandı

**Amaç:** Teknik borcu azaltmak ve veri doğruluğunu sağlamak.

### İçindeki görevler

### T-016 — `AuraCreationScreen`'i ve kullanılmayan demo modunu sil; `package.json` adını `bloom` yap
- **Öncelik:** P2
- **Kaynak:** Karar Dokümanı Master #16; Denetim Raporu P2-14
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-4.1

### T-017 — Haftalık içgörü tamamlama oranını frekansa göre hesapla
- **Öncelik:** P2
- **Kaynak:** Karar Dokümanı Master #17; Denetim Raporu P2-15
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-4.2

### T-018 — Kritik dokunma hedeflerini 44×44'e çıkar veya `hitSlop` ekle
- **Öncelik:** P2
- **Kaynak:** Karar Dokümanı Master #18; Denetim Raporu P2-16
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-4.1

### T-019 — Şifre politikasını tek `getPasswordStrength` mantığında birleştir
- **Öncelik:** P3
- **Kaynak:** Karar Dokümanı Master #19; Denetim Raporu P3-17
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-4.1

### T-020 — EAS `projectId`'nin gerçek UUID olduğunu doğrula (OTA çalışması için)
- **Öncelik:** P3
- **Kaynak:** Karar Dokümanı Master #20; Denetim Raporu P3-17
- **Durum:** Planlandı
- **Release kriteriyle ilişkisi:** RC-4.3

### Release Criteria — v1.0.5
- **RC-4.1:** Ölü kod temizlendi; marka adı tutarlı; kritik dokunma hedefleri ≥44×44; şifre politikası tek.
- **RC-4.2:** Haftalık içgörü oranı frekansa göre doğru hesaplanıyor.
- **RC-4.3:** EAS `projectId` doğrulandı; OTA yapılandırması netleşti.

> Not (güncellendi 2026-07-17): Bu notun orijinali ("Android bildirim izni ve Android IAP yalnızca talep kanıtlanırsa yeniden değerlendirilir") artık geçerli değildir — proje sahibi kararıyla (DEC-009) koşul kaldırıldı. Android paralel geliştirme artık v1.1.0 altında **T-021** olarak bağlayıcı bir görevdir (bkz. aşağıda).

---

## v1.1.0 — "Android Paralel Geliştirme"
**Durum:** Planlandı

**Amaç:** Android'i iOS ile paralel olarak geliştirmek. Android yayını ileride yapılacaktır (bkz. DEC-009). Bu sürümün diğer v1.0.x sürümleriyle sıralı bir öncelik ilişkisi kaynak dokümanlarda tanımlanmamıştır; sürüm numarası ve sırası proje sahibi tarafından netleştirilene kadar geçicidir.

### İçindeki görevler

### T-021 — Android'i iOS ile paralel geliştir; IAP/Play Console/cihaz testlerini proje sahibi doğrulasın
- **Öncelik:** Belirlenmedi (kaynakta önceliklendirme yok; proje sahibi tarafından zamanlanacak)
- **Kaynak:** DEC-009 (proje sahibi talimatı, 2026-07-17); BL-007
- **Durum:** Planlandı
- **Not — doğrulama zorunluluğu:** `TECHNICAL_CONTEXT` §18 doğrulama kuralı gereği kod tamamlanmış olması yeterli değildir. Android IAP entegrasyonu, Play Console yapılandırması ve cihaz bazlı testler proje sahibi tarafından ayrıca yapılıp doğrulanmadan bu görev "Tamamlandı" sayılamaz; ara durumlar "Devam ediyor" veya "Doğrulanıyor" (kod hazır / test bekliyor) olarak işaretlenmeli, asla doğrudan "Tamamlandı" denmemelidir.
- **Release kriteriyle ilişkisi:** RC-5.1

### Release Criteria — v1.1.0
- **RC-5.1:** Android IAP, Play Console yapılandırması ve kritik akışlar (satın alma, restore, iptal, bildirim izni) proje sahibi tarafından gerçek cihazda doğrulanmadan Android yayına alınmaz.

---

## Roadmap Kuralları
- **Sürüm bazlı ve kronolojik:** İşler sürümlere göre gruplanır; sürümler sırayla ilerler.
- **Her sürümün tek ana hedefi vardır.** Bir sürüme, hedefine hizmet etmeyen iş eklenmez.
- **Benzersiz ID:** Her görev sıradaki `T-XXX` ID'sini alır; ID'ler yeniden kullanılmaz.
- **Yeni görev üretilmez:** Buraya yalnızca kaynak dokümanlardaki (karar dokümanı + denetim raporu) işler girer.
- **Kaynak zorunlu:** Her görev bir kaynağa (ve varsa ilgili DEC'e) bağlanır.
- **Release Criteria olmadan sürüm çıkmaz:** Bir sürüm, tüm Release Criteria maddeleri karşılanmadan yayınlanmaz.
- **Doğrulama zorunlu:** Hiçbir görev, `TECHNICAL_CONTEXT` §18 doğrulama kuralı gereği doğrulanmadan "Tamamlandı" sayılmaz.
- **Kapsam ayrımı:** Kesin kararlar `DECISIONS`'a, ürün ilkeleri `PRODUCT_BIBLE`'a, teknik gerçek `TECHNICAL_CONTEXT`'e aittir; ROADMAP yalnızca yapılacak işleri tutar.
- **Tek sürüm kuralı:** Bir görev aynı anda yalnızca tek sürümde bulunabilir.
- **Kriter kilidi:** Release Criteria değişmeden sürüm "tamamlandı" olarak işaretlenemez.

## Görev Durumları
- **Planlandı:** Görev tanımlı, henüz başlanmadı.
- **Devam ediyor:** Üzerinde aktif çalışılıyor.
- **Doğrulanıyor:** Kod tamam, doğrulama (test/gerçek cihaz) sürüyor.
- **Tamamlandı:** Doğrulama başarıyla bitti; Release Criteria'ya katkısı karşılandı.
- **Ertelendi:** İlgili karar gereği bekletiliyor (bkz. DECISIONS).
- **İptal Edildi:** Görev roadmapten çıkarıldı; geçmiş korunur, görev silinmez.

## Doküman Geçmişi
- **2026-07-13 — v1.0:** İlk oluşturma. v1.0.2–v1.0.5 sürümleri ve T-001 … T-020 görevleri eklendi; kaynak: `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md` ve `BLOOM_DENETIM_RAPORU.md`.
- **2026-07-17:** T-005 "İptal Edildi" (DEC-009 ile hedefi geçersiz kaldı; geçmiş korundu). RC-1.4'e v1.0.2 kapsam notu eklendi. v1.0.5'teki eski Android-koşullu not güncellendi. Yeni sürüm **v1.1.0** ve görev **T-021** (Android paralel geliştirme, BL-007'den taşındı) eklendi; kaynak: proje sahibi talimatı (DEC-009).
- **2026-07-18:** T-006 "Devam ediyor" olarak güncellendi (Adım 1'de bloke edici bulgu). Yeni görev **T-022** eklendi — T-006 sırasında canlı Sandbox cihazında keşfedilen bir kod hatası (`PaywallScreen`'de `verify-purchase`'ı atlayan guard); kod düzeltmesi uygulandı, cihaz doğrulaması bekliyor. DECISIONS'a yeni kayıt gerekmedi — mevcut DEC-003/DEC-004 ilkesinin implementasyon hatası, yeni bir politika kararı değil.

---

## Değişiklik Özeti
- **Eklendi:** Dosya başına "Roadmap Sistemi" bölümü (aktif işler burada; kararlar→DECISIONS, ürün ilkeleri→PRODUCT_BIBLE, teknik gerçek→TECHNICAL_CONTEXT, onaylanmamış fikirler→BACKLOG).
- **Eklendi:** Her sürüm başlığının altına "Durum:" satırı — tüm sürümler için "Planlandı".
- **Eklendi:** "Roadmap Kuralları" sonuna iki madde (tek sürüm kuralı; Release Criteria kilidi).
- **Eklendi:** "Görev Durumları"na "İptal Edildi" durumu.
- **Eklendi:** Bu "Değişiklik Özeti" bölümü.
- **Not:** Bu beş revizyon dışında hiçbir bölümün metni değiştirilmedi.
