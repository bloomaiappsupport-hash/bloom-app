# BLOOM — DURUM (Operasyonel Durum Belgesi)

> Bu dosya **yaşayan bir operasyonel durum özetidir**: ürünün bugün nerede olduğunu 1–2 dakikada anlatır. Anayasa, teknik bağlam veya karar arşivi değildir; yalnızca mevcut ve doğrulanmış durumu özetler, ayrıntı için kaynaklara yönlendirir (§15). Son güncelleme: 2026-07-18.

## 1. Genel Durum

BLOOM (alışkanlık takibi + AI koç + süreklilik) lansman öncesi hazırlık aşamasındadır. **v1.0.2'nin ROADMAP görev seviyesi işi bugün itibarıyla tamamlanmıştır:** T-001, T-002, T-003, T-004, T-006 ve (T-006 sırasında keşfedilen) T-022 "Tamamlandı"; T-005 proje sahibi kararıyla (DEC-009) "İptal Edildi". Android artık süresiz ertelenmiş değil, iOS ile paralel geliştiriliyor (DEC-009, T-021, v1.1.0).

**Ama v1.0.2 henüz yayınlanmadı.** Tüm kod düzeltmeleri (T-002 hariç — o sunucuda, canlıda) hâlâ yalnızca yerel çalışma kopyasında; bu oturumda **hiçbir commit atılmadı**, yeni bir build/App Store submit yapılmadı. Ayrıntı ve kalan somut adımlar için §13.

## 2. Ürün Aşaması

**Pre-PMF / lansman öncesi.** Solo geliştirici; freemium + abonelik. Bu aşamada ilke: kapsam genişletmek değil, çekirdeği sağlamlaştırmak (PRODUCT_BIBLE §6, §14).

## 3. Sürüm Durumu

- **İncelenen/son bilinen sürüm:** 1.0.1 (iOS build 36) — 11 Temmuz 2026 denetiminin incelediği sürüm.
- **Yayında sürüm:** 1.0.1 (iOS build 36) — App Store'da aktif yayında. **v1.0.2'nin hiçbir istemci düzeltmesini içermiyor** (T-003, T-022 dahil yalnızca yerel çalışma kopyasında; `app.json` iOS `buildNumber` hâlâ 36, bir sonraki build için artırılmadı).

## 4. Aktif Sürüm

**v1.0.2 — "Para & Güvenlik Güvenli"** (ROADMAP'te versiyon başlığı hâlâ "Planlandı" — bu dosyada değiştirilmedi, ROADMAP.md'nin kendi alanı). Görev seviyesinde tamamlandı: T-001, T-002, T-003, T-004, T-006, T-022 "Tamamlandı"; T-005 "İptal Edildi". Release Criteria: RC-1.1, RC-1.2, RC-1.3 — destekleyen görevler tamamlandı. **RC-1.4 istisna:** kriterin kendisi (iOS-only yayın) hâlâ doğru ama onu garanti eden aktif bir görev yok (T-005 iptal edildi) — bkz. §13.

## 5. Aktif Öncelik

**Gelir kaçağı + güvenlik + mağaza bloklayıcılarını kapatmak.** Yeni özellik geliştirme yoktur; "feature değil, tamir" odağı geçerlidir (Karar Dokümanı §1).

## 6. Kritik Bloklayıcılar

v1.0.2 kapanmadan lansman yapılmaz. Durum (ayrıntı: ROADMAP v1.0.2, DECISIONS, audits):

1. ✅ Repo remote'undaki erişim token'ı olayı (T-001 / DEC-005) — Tamamlandı (2026-07-17).
2. ✅ `clientPremium` premium bypass'ı (T-002 / DEC-003) — Tamamlandı (2026-07-17), Supabase'e deploy edildi.
3. ✅ `localSku` kaynaklı hayalet premium (T-003 / DEC-004) — Tamamlandı (2026-07-17), bir sonraki App Store build'ini bekliyor.
4. ✅ Streak Kalkanı'nın paywall'da görünmesi (T-004 / DEC-002) — Tamamlandı (2026-07-17); paywall, mağaza metinleri ve kodda çalışmayan UI kalıntıları temizlendi.
5. ⛔ iOS-only kapsam kararının build/yayın düzeyinde sabitlenmesi (T-005 / DEC-001) — İptal Edildi (2026-07-17); proje sahibi Android'i artık ertelemiyor (DEC-009). v1.0.2'nin kendisi hâlâ iOS-only yayınlanıyor (RC-1.4 değişmedi), ama bu görevin "Android'i süresiz kilitle" amacı geçersiz kaldı.
6. ✅ Gerçek cihazda satın alma → restore → iptal → free düşüşü doğrulaması (T-006) — Tamamlandı (2026-07-18); dört akış da Sandbox'ta gerçek cihazda geçti. Yol boyunca bir bloke edici bulgu çıktı ve düzeltildi (T-022 — `PaywallScreen`'de `verify-purchase`'ı atlayan guard, ayrıca cihazda doğrulandı).

## 7. Roadmap Özeti

Tüm sürümler "Planlandı" durumundadır; sürümler sırayla ilerler:

| Sürüm | Ana hedef | Durum |
|---|---|---|
| v1.0.2 — Para & Güvenlik Güvenli | Gelir kaçakları + güvenlik/mağaza bloklayıcıları (lansman adayı) | Planlandı |
| v1.0.3 — Dönüşüm & Aktivasyon | Paywall lokalizasyonu + aktivasyon akışı + mağaza metadata | Planlandı |
| v1.0.4 — Kararlılık & Erişilebilirlik | Error boundary, hata izleme, injection daraltma, a11y | Planlandı |
| v1.0.5 — Temizlik & Doğruluk | Teknik borç azaltma + veri doğruluğu | Planlandı |
| v1.1.0 — Android Paralel Geliştirme | Android'i iOS ile paralel geliştirmek (yayın ileride) | Planlandı |

Not: v1.0.2'nin tablodaki "Planlandı" değeri ROADMAP.md'nin kendi versiyon başlığından aktarılmıştır ve bu turda değiştirilmedi (yalnızca onaylanan görev satırlarına dokunuldu) — görev seviyesinde v1.0.2 fiilen tamamlanmıştır, bkz. §4 ve §13.

## 8. Görev Durumu Özeti

ROADMAP'ten doğrulandı (T-001…T-022):

- **Toplam görev:** 22
- **Planlandı:** 15
- **Devam ediyor:** 0
- **Doğrulanıyor:** 0
- **Tamamlandı:** 6 (T-001, T-002, T-003, T-004, T-006, T-022)
- **Ertelendi:** 0
- **İptal Edildi:** 1 (T-005 — DEC-009 ile hedefi geçersiz kaldı)

Not: Android artık ertelenmiş bir iş değil — DEC-009 (2026-07-17) ile BL-007 ROADMAP'e taşındı ve **T-021** (v1.1.0) olarak açıldı. Streak sunucuya taşıma ve CORS daraltması hâlâ ertelenmiş durumda; DECISIONS (DEC-006/008) ve BACKLOG'da (BL-006/008) "koşullu" olarak izleniyor. **T-022**, T-006 sırasında cihazda keşfedilen bir kod hatasıydı (`PaywallScreen`'de `verify-purchase`'ı atlayan guard); kod düzeltmesi + cihaz doğrulaması ikisi de tamamlandı (2026-07-18).

## 9. Doküman Durumu

**Tamamlananlar:**

- `README.md`
- `docs/core/` — PRODUCT_BIBLE, TECHNICAL_CONTEXT, DECISIONS, ROADMAP, BACKLOG
- `docs/business/` — MONETIZATION_BIBLE, MARKETING_BIBLE, GROWTH_BIBLE, KPI
- `docs/audits/` — BLOOM_DENETIM_RAPORU, BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI

**Mevcut ama son kontrol bekleyen:**

- `CLAUDE.md`, `AGENTS.md` — mevcut; son taşınabilir çalışma anayasası kontrolü henüz yapılmadı.

**Bu dosya (`DURUM.md`):** Bu yazımla birlikte tamamlandı; yaşayan belge olarak güncel tutulur (§16).

## 10. Teknik Durum

Yüksek seviye (tek kaynak: TECHNICAL_CONTEXT):

- Yığın: Expo ~56 / RN 0.85 / Supabase / OpenAI (yalnızca sunucu) / react-native-iap v15.
- Sunucu tarafı IAP doğrulaması, RLS ve sunucu tarafı koç limiti **doğru kurulmuş** (denetim "Güçlü Yönler").
- Bilinen teknik riskler ve teknik borç: TECHNICAL_CONTEXT §15–16 (v1.0.2 bloklayıcıları dahil; §6'daki liste).
- Kök Error Boundary ve hata izleme yok (düzeltme v1.0.4'te planlı).
- Doğrulanması gereken teknik konular: TECHNICAL_CONTEXT §17 (şema kolon tutarlılığı, EAS projectId/OTA, mocks izolasyonu vb.).

## 11. Ölçüm Durumu

- **Analitik ve hata izleme altyapısı yoktur** (KPI.md §3; TECHNICAL_CONTEXT §16).
- KPI sistemi tanımlıdır (KPI-001…KPI-029) fakat **davranışsal KPI'ların çoğu ölçülmüyor**; bugün ölçülebilenler yalnızca kod denetimi/test bazlı uyum metrikleridir.
- **North Star yalnızca adaydır** (KPI.md §5); onaylanmamıştır.
- Gerçek kullanıcı verisi yoktur; tüm davranışsal beklentiler hipotezdir (BL-004, BL-005).
- Sayısal hedefler belirlenmemiştir; bu belgede sayı üretilmez.
- **Yeni gözlem (2026-07-18, henüz işlenmedi):** T-006 cihaz testinde görüldü — `subscriptions.plan` sütunu abonelik süresi doğal olarak dolduğunda otomatik 'free'ye dönmüyor (yalnızca `expires_at` doğru kalıyor). Uygulama gating'i etkilenmiyor (hem `plan` hem `expires_at` kontrol ediliyor), ama ham `plan='premium'` sorgusu yanıltıcı olabilir. Önerilen yer: `TECHNICAL_CONTEXT.md §16` (teknik borç) + `KPI.md` metodoloji notu — onay bekliyor, henüz yazılmadı.

## 12. Platform Durumu

- **v1.0.2'nin kendi yayını hâlâ iOS-only'dir** (RC-1.4 değişmedi) — bu, sürüme özgü bir kapsam kararıdır, Android'in genel durumuyla karıştırılmamalı.
- **Android artık süresiz ertelenmiş/dondurulmuş değildir.** Proje sahibi kararıyla (DEC-009, 2026-07-17) Android, iOS ile paralel geliştirilecek; yayını ileride yapılacaktır. Bu, DEC-001/DEC-007'deki "talep kanıtlanana kadar açılmaz" koşulunu geçersiz kılar (DEC-001/DEC-007 kayıtları tarihsel olarak korunmuştur, "Yerine geçen karar" alanlarıyla DEC-009'a bağlanmıştır).
- **Android satın alma bugün itibarıyla hâlâ teknik olarak çözülmüş değildir** — bu bir durum tespitidir, "çalışıyor" denmiyor. Android IAP/Play Console/cihaz bazlı testler proje sahibi tarafından ayrıca yapılıp doğrulanmadan hiçbir Android işi "Tamamlandı" sayılamaz (DEC-009, T-021, TECHNICAL_CONTEXT §18).
- İzleme: ROADMAP **T-021** (v1.1.0), BACKLOG **BL-007** ("Roadmap'e Taşındı").

## 13. Bir Sonraki Net Adım

**v1.0.2'nin ROADMAP görev işi bitti** (T-001, T-002, T-003, T-004, T-006, T-022 tamamlandı; T-005 iptal edildi). Ama sürüm henüz yayında değil — kalan açık kalemler görev değil, **operasyonel adımlar:**

1. **Onay bekleyen dokümantasyon kararı:** `subscriptions.plan` sütununun süre dolunca sıfırlanmaması gözlemi (§11) — `TECHNICAL_CONTEXT.md`/`KPI.md`'ye işlenecek mi, onay bekliyor.
2. **Commit:** Bu oturumdaki hiçbir kod/doküman değişikliği henüz git'e commit edilmedi (bilinçli olarak — "her şey bitince tek seferde" kararlaştırılmıştı). Artık v1.0.2 görev işi bittiğine göre bu karar tekrar gözden geçirilebilir.
3. **Build + submit:** `App.tsx` (T-003) ve `PaywallScreen.tsx` (T-022) düzeltmeleri yalnızca yerel kaynakta — bir sonraki App Store build'i (buildNumber artırımı + EAS production build + submit) yapılmadan gerçek kullanıcılara ulaşmaz. T-002 (sunucu) zaten canlıda, bu ikisi değil.
4. **RC-1.4 açık nokta:** Kriterin kendisi (iOS-only yayın) hâlâ doğru, ama onu garanti eden T-005 iptal edildi — bunu enforce eden yeni bir görev/kontrol gerekip gerekmediği proje sahibinin kararına bırakıldı, henüz karar verilmedi.
5. **Paralel, bloklamayan:** T-021 (v1.1.0, Android) — proje sahibi tarafından ayrıca zamanlanacak.

v1.0.3'e (Dönüşüm & Aktivasyon) geçiş, yukarıdaki 2-4 netleşmeden önerilmez.

## 14. Doğrulama Durumu

- **Otomatik test altyapısı yoktur.**
- **T-006 tamamlandı (2026-07-18):** Satın alma → restore → iptal → free düşüşü dört akışı da gerçek cihazda (Sandbox, T-022 düzeltmesini içeren taze build) doğrulandı. `subscriptions` tablosunda satır oluşumu, uygulama ekranlarında (paywall/profil/koç) premium/free geçişleri gözlemlendi.
- Zorunlu doğrulama sırası: TECHNICAL_CONTEXT §18. Hiçbir görev doğrulanmadan "Tamamlandı" sayılmaz.
- T-001…T-004, T-022 için mekanik/kod doğrulaması + T-006 için cihaz doğrulaması tamamlandı. Kalan doğrulanmamış alan: streak/koç limiti gibi T-006 kapsamı dışındaki akışlar hâlâ TECHNICAL_CONTEXT §17'de "Doğrulanması Gereken" listesinde olabilir — ayrıntı için o dosyaya bakılmalı.

## 15. Kaynaklar

Ayrıntı için tek doğru kaynaklar:

- Ürün ilkeleri → `docs/core/PRODUCT_BIBLE.md`
- Teknik gerçek → `docs/core/TECHNICAL_CONTEXT.md`
- Bağlayıcı kararlar → `docs/core/DECISIONS.md`
- Aktif işler ve Release Criteria → `docs/core/ROADMAP.md`
- Hipotezler → `docs/core/BACKLOG.md`
- Gelir/pazarlama/büyüme/ölçüm ilkeleri → `docs/business/`
- Kanıt belgeleri → `docs/audits/`
- Repo girişi → `README.md` | Çalışma talimatları → `CLAUDE.md` (→ `AGENTS.md`)

## 16. Bakım Kuralları

- Bu dosya yalnızca **mevcut durumu** özetler; görev, karar, özellik, hedef veya tarih üretmez.
- Durum değiştiren her olayda (görev durumu değişimi, sürüm geçişi, doküman tamamlanması) güncellenir; "Son güncelleme" tarihi yenilenir.
- ROADMAP/DECISIONS/TECHNICAL_CONTEXT ile çelişemez; çelişki fark edilirse bu dosya değil, durum tespiti düzeltilir ve önce bildirilir.
- Tamamlanmamış iş hiçbir güncellemede tamamlandı gösterilmez; görev durumları yalnızca ROADMAP'ten aktarılır.
- Sayısal veri yalnızca doğrulanmış kaynaktan aktarılır; veri yoksa sayı yazılmaz.

## 17. Değişiklik Özeti

- **Oluşturuldu:** DURUM.md ilk sürümü (yaşayan operasyonel durum belgesi).
- **Kaynak:** README, core (PRODUCT_BIBLE, TECHNICAL_CONTEXT, DECISIONS, ROADMAP, BACKLOG), business (MONETIZATION/MARKETING/GROWTH_BIBLE, KPI) ve audit dokümanları; yeni görev, karar, özellik, hedef veya tarih üretilmedi.
- **Doğrulama:** Görev sayıları ROADMAP'ten doğrulandı (20 görev, tamamı "Planlandı"; tamamlanan yok); sürüm ayrımı (son bilinen 1.0.1 / aktif v1.0.2) korundu.
- **Dürüstlük sınırları:** Pre-PMF ve iOS-only kapsam korundu; Android çözülmüş gösterilmedi; Streak Kalkanı mevcut özellik yazılmadı; analitik/hata izleme/otomatik test olmadığı açıkça belirtildi; North Star aday olarak anıldı; KPI verisi olmadığından sayı üretilmedi.
- **2026-07-17 güncellemesi:** T-001…T-004 tamamlandı olarak işlendi. Platform kararı revize edildi (DEC-009): Android artık ertelenmiş değil, iOS ile paralel geliştiriliyor; T-005 bu nedenle iptal edildi, BL-007 ROADMAP'e taşınıp T-021 (v1.1.0) oldu. Android'in "teknik olarak çözülmemiş" durumu bir tespit olarak korundu — DEC-009 bunu "çözüldü" ilan etmiyor, yalnızca çalışmanın artık aktif ve koşulsuz olduğunu belirtiyor.
- **2026-07-18 güncellemesi (kapanış):** Üç ayrı iş bugün kapandı: (1) `docs/business/*` ve `KPI.md`'deki Android/Streak Kalkanı/clientPremium-localSku kaynaklı staleness temizlendi (asıl kaynak `TECHNICAL_CONTEXT.md` güncellendi, iş dosyaları ondan türetildi); (2) T-006 sırasında cihazda keşfedilen bir kod hatası (satın alma sonrası `verify-purchase`'ı atlayan guard) T-022 olarak açıldı, düzeltildi ve cihazda doğrulandı; (3) T-006'nın dört akışı (satın alma/restore/iptal/free düşüşü) gerçek cihazda baştan koşulup tamamlandı. v1.0.2'nin ROADMAP görev işi bitti; yayına çıkması için commit/build/submit adımları hâlâ açık (bkz. §13) — bu "iş bitti" değil "görev seviyesi bitti, operasyonel adımlar kaldı" demektir.
