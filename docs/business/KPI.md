# BLOOM — KPI (Metrik Sözlüğü ve Ölçüm Anayasası)

> Bu doküman BLOOM'un **ne ölçtüğünü, nasıl ölçtüğünü ve neyi başarı saydığını** tanımlar. Sprint işi, dashboard tasarımı, deney planı veya roadmap maddesi burada yer almaz. Kaynak: `BLOOM_DENETIM_RAPORU.md`, `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`. İlkeler PRODUCT_BIBLE, MONETIZATION_BIBLE, MARKETING_BIBLE ve GROWTH_BIBLE'dadır; bu doküman onlarla çelişmez.

## 1. Amaç
Başarının **ne anlama geldiği** PRODUCT_BIBLE §17'de sabitlenmiştir; bu dosya onun ölçülebilir karşılığını tanımlar: metrik sözlüğü (her metriğin tek, net tanımı) + ölçüm anayasası (neyin nasıl ölçüleceği, neyin başarı sayılmayacağı). Temel kural: **ölçülemeyen şey ölçülüyormuş gibi yazılmaz; veri yokken değer uydurulmaz.**

## 2. KPI Sisteminin Rolü
- **KPI ≠ metrik.** Metrik, ölçülebilen herhangi bir değerdir; KPI, ürünün başarısını temsil ettiği için **takip edilmesine karar verilmiş** metriktir. Her KPI bir metriktir; her metrik KPI değildir.
- KPI'lar karar aracıdır, gösteriş aracı değildir: bir KPI hiçbir kararı etkilemiyorsa KPI olmaktan çıkarılır.
- KPI sistemi öncelik sırasına tabidir (güven → çekirdek deneyim → retention → gelir → growth): alttaki halkanın KPI'sını iyileştirmek için üstteki halkanın KPI'sı feda edilemez.
- Pre-PMF aşamasında KPI sisteminin birincil görevi hedef kovalamak değil, **hipotezleri (BL-004, BL-005) doğrulayacak ölçümü kurmaktır.**

## 3. Mevcut Ölçüm Gerçeği
Koddan doğrulanmış durum (TECHNICAL_CONTEXT):

- **Analitik altyapısı yok.** Üründe ürün-analitiği SDK'sı (event tracking) bulunmuyor.
- **Hata izleme yok.** Sentry veya benzeri bağlı değil (TECHNICAL_CONTEXT §16); crash/error metrikleri şu an ölçülemez.
- **Mevcut potansiyel veri kaynakları:** (a) Supabase Postgres tabloları (`profiles`, `habits`, `completions`, `streaks`, `coach_messages`, `subscriptions`, `insights`) — davranış verisinin ham kaynağı; (b) App Store Connect — lansman sonrası mağaza/abonelik verileri; (c) kod denetimi — uyum/kalite tespitleri (denetim raporu emsali).
- **Sonuç:** Bu dosyadaki KPI'ların büyük çoğunluğu bugün ölçülmüyor. Bu bir eksiklik beyanıdır, gizlenmez. Ölçüm altyapısı kurma işi bu dosyada planlanmaz (roadmap konusudur); burada yalnızca gereksinim olarak işaretlenir.
- Ürün henüz lansman öncesidir; gerçek kullanıcı verisi yoktur. Tüm davranışsal beklentiler hipotezdir.

## 4. KPI Hiyerarşisi
KPI'lar, GROWTH_BIBLE §3 sırasını izler:

1. **Güven KPI'ları** — her şeyin önkoşulu (§6).
2. **Aktivasyon KPI'ları** — funnel'ın girişi (§7).
3. **Çekirdek döngü + Retention KPI'ları** — ürünün kalbi ve North Star'ın kaynağı (§8–9).
4. **Monetizasyon KPI'ları** — güven ve çekirdek sağlamken anlamlı (§11).
5. **Pazarlama / Growth / App Store KPI'ları** — en son ölçeklenir (§12–14).
6. **Kalite / Erişilebilirlik / Teknik KPI'lar** — tüm katmanları yatay keser (§15–17).
7. **Guardrail metrikleri** — hiçbir KPI iyileştirmesinin çiğneyemeyeceği sınırlar (§18).

Çatışma halinde üst sıradaki KPI kazanır.

## 5. North Star Metric
Kaynak dokümanlarda **bağlayıcı bir North Star metriği tanımlanmamıştır.** Aşağıdaki, PRODUCT_BIBLE §17'nin ("başarı = kullanıcının çekirdek döngüyü sürdürmesi") ölçüme çevrilmiş halidir ve **aday/öneri** statüsündedir — onaylanana kadar bağlayıcı değildir:

- **Aday North Star:** *Çekirdek döngüyü sürdüren kullanıcı* — belirli bir dönemde en az bir alışkanlık tamamlayan **ve** geri dönen kullanıcı sayısı/oranı.
- **Neden aday:** İndirme, kayıt veya ödeme değil; çekirdek alışkanlık devamlılığını (takip → tamamla → geri dön) temsil eder. Vanity'ye kapalıdır: satın alınamaz, şişirilemez. **Sınırı:** Bu aday formül AI koç kullanımını doğrudan içermez; üç ayaktan koç boyutu KPI-009 ve KPI-013 ile ayrıca izlenir. North Star formülü onaylanırken koç etkileşiminin formüle dahil edilip edilmeyeceği ayrıca kararlaştırılır.
- **Kesin formül:** Tanımlanacak (dönem penceresi, "sürdürme" eşiği ve koç etkileşiminin dahli, gerçek veriyle ve onayla belirlenecek — sayı uydurulmaz).
- **Veri kaynağı:** Supabase `completions` + `streaks` (altyapı kurulunca).
- **Durum:** Aday — onay ve ölçüm altyapısı bekliyor.

İndirme, toplam kayıt veya toplam gelir hiçbir koşulda North Star yapılamaz (§19).

## 6. Güven KPI'ları
Güven KPI'ları çoğunlukla **uyum (compliance) metrikleridir**: hedefleri ihlal sayısının sıfır olmasıdır ve kod denetimi/testle ölçülürler.

### KPI-001 — Sunucu-kaynaklı premium yetki uyumu
- **Kategori:** Güven
- **Tanım:** Premium yetkisinin yalnızca sunucu/DB (`subscriptions` + `expires_at`) tarafından belirlendiği; hiçbir istemci bayrağının yetki vermediği durumun doğrulanması.
- **Neden önemli:** `clientPremium` bypass'ı doğrudan gelir kaçağıdır (Denetim P0-2; DEC-003).
- **Formül:** İstemci-kaynaklı yetki yolu sayısı = 0 (kod denetimi + test).
- **Veri kaynağı:** Kod denetimi / gerçek cihaz testi.
- **Mevcut değer:** 0 ihlal — `clientPremium` yolu kod denetimiyle doğrulandı, kaldırıldı ve Supabase'e deploy edildi, canlıda (T-002, 2026-07-17; bkz. TECHNICAL_CONTEXT §8/§9). Bu değer yalnızca kod denetimi bileşenini yansıtır; gerçek cihazda uçtan uca davranışsal doğrulama T-006 kapsamında ayrıca yapılacak.
- **Hedef değer:** 0 ihlal.
- **Durum:** Ölçülebilir (kod denetimiyle); kod denetimi tamamlandı, cihaz testi T-006'da bekleniyor.
- **Ölçüm sıklığı:** Her sürüm öncesi (TECHNICAL_CONTEXT §18 doğrulama sırası).
- **İlgili doküman/görev:** DEC-003, T-002, RC-1.2.

### KPI-002 — Süresi dolan aboneliğin free'ye düşüş doğruluğu
- **Kategori:** Güven
- **Tanım:** Süresi dolan/iptal edilen aboneliğin premium yetkisini kaybettiğinin doğrulanması.
- **Neden önemli:** `localSku` kalıcılığı "hayalet premium" üretiyor (Denetim P0-3; DEC-004).
- **Formül:** Gerçek cihazda satın alma → iptal → süre dolumu → free düşüşü test senaryosu başarı durumu.
- **Veri kaynağı:** Gerçek cihaz testi (T-006).
- **Mevcut değer:** Ölçülmüyor — kod düzeltmesi yapıldı (`active = dbActive`, `localSku` karardan çıkarıldı; T-003, 2026-07-17; bkz. TECHNICAL_CONTEXT §9), ancak yalnızca yerel değişiklik olarak kaldı — henüz App Store'a çıkmadı. Bu KPI'nın formülü tamamen gerçek cihaz test senaryosu gerektirir; T-006 henüz koşulmadı, bu nedenle "0 ihlal" yazılamaz.
- **Hedef değer:** Test senaryosu %100 doğru davranış.
- **Durum:** Ölçülebilir (testle); kod düzeltmesi yapıldı, cihaz testi bekleniyor (T-006).
- **Ölçüm sıklığı:** Her sürüm öncesi.
- **İlgili doküman/görev:** DEC-004, T-003, T-006, RC-1.2.

### KPI-003 — Teslim edilmeyen özellik görünürlüğü
- **Kategori:** Güven
- **Tanım:** Paywall'da ve tüm pazarlama yüzeylerinde teslim edilmeyen özellik sayısı.
- **Neden önemli:** Satılan her özellik teslim edilir (PRODUCT_BIBLE §5); ihlal mağaza reddi + güven kaybıdır (Guideline 2.3.1).
- **Formül:** Paywall/pazarlama yüzeylerinde listelenen ∖ kodda çalışan özellik sayısı = 0.
- **Veri kaynağı:** Kod denetimi + yüzey taraması.
- **Mevcut değer:** 0 ihlal — Streak Kalkanı paywall FEATURES listesinden, mağaza metinlerinden ve kodda hiç çalışmayan UI kalıntılarından kaldırıldı; kod/yüzey denetimiyle doğrulandı (T-004, 2026-07-17; bkz. TECHNICAL_CONTEXT §17, DECISIONS DEC-002).
- **Hedef değer:** 0.
- **Durum:** Ölçülebilir (denetimle); kod/yüzey denetimi tamamlandı.
- **Ölçüm sıklığı:** Her sürüm öncesi ve her pazarlama yüzeyi değişiminde.
- **İlgili doküman/görev:** DEC-002, T-004, RC-1.3; MARKETING_BIBLE §10.

### KPI-004 — Mağaza–ürün gerçekliği tutarlılığı
- **Kategori:** Güven
- **Tanım:** App Store metinleri/ekran görüntüleri ile ürün içi gerçeklik arasındaki tutarsızlık sayısı.
- **Neden önemli:** Tutarlılık ilkesi (MARKETING_BIBLE §13); tutarsızlık red ve güven riskidir.
- **Formül:** Tespit edilen metadata↔ürün tutarsızlığı sayısı = 0.
- **Veri kaynağı:** Manuel denetim (metadata hazırlanınca — T-010).
- **Mevcut değer:** Ölçülmüyor (lokalize metadata henüz hazırlanmadı).
- **Hedef değer:** 0.
- **Durum:** Veri bekleniyor (T-010 sonrası ölçülebilir).
- **Ölçüm sıklığı:** Her mağaza güncellemesinde.
- **İlgili doküman/görev:** T-010, RC-2.3; MARKETING_BIBLE §13.

## 7. Aktivasyon KPI'ları
Aktivasyon adımları teknik akıştan tanımlanabilir (kayıt → doğrulama → ilk alışkanlık → ilk tamamlama → ilk koç etkileşimi) ancak **hiçbiri bugün ölçülmüyor** (event tracking yok). Veriler Supabase tablolarından türetilebilir; bu türetme kurulana kadar tüm değerler "Ölçülmüyor"dur.

### KPI-005 — Kayıt → doğrulama akışına ulaşma
- **Kategori:** Aktivasyon
- **Tanım:** Kaydolan kullanıcının net bir doğrulama/aktivasyon akışına ulaşma oranı.
- **Neden önemli:** Kayıt anındaki sessizlik funnel'ın en üstünü kırıyor (Denetim P1-12; K7).
- **Formül:** Tanımlanacak (akış T-009 ile netleşince; şu an akış kopuk olduğundan ölçüm anlamsız).
- **Veri kaynağı:** Supabase Auth + event tracking (mevcut değil).
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli (önce akış tamiri: T-009).
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** T-009, RC-2.2; GROWTH_BIBLE §6.

### KPI-006 — İlk alışkanlık oluşturma
- **Kategori:** Aktivasyon
- **Tanım:** Kaydolan kullanıcılar içinde en az bir alışkanlık oluşturanların oranı.
- **Neden önemli:** Çekirdek döngünün ilk adımı; oluşturulmayan alışkanlık takip edilemez.
- **Formül:** (≥1 `habits` kaydı olan kullanıcı) / (kayıtlı kullanıcı). Dönem penceresi: Tanımlanacak.
- **Veri kaynağı:** Supabase `habits` + `profiles`.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** GROWTH_BIBLE §6.

### KPI-007 — İlk tamamlama
- **Kategori:** Aktivasyon
- **Tanım:** Alışkanlık oluşturan kullanıcılar içinde en az bir tamamlama yapanların oranı ("ilk değer" anı adayı).
- **Neden önemli:** Kullanıcının çekirdek değeri ilk kez yaşadığı an.
- **Formül:** (≥1 `completions` kaydı olan kullanıcı) / (≥1 alışkanlığı olan kullanıcı). Dönem penceresi: Tanımlanacak.
- **Veri kaynağı:** Supabase `completions` + `habits`.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** GROWTH_BIBLE §6.

### KPI-008 — İlk AI koç etkileşimi
- **Kategori:** Aktivasyon
- **Tanım:** Kullanıcıların en az bir koç mesajı gönderme oranı.
- **Neden önemli:** Koç, üç ayaktan biri ve premium'un ana çekicisi; hiç denenmemesi değer keşfi eksikliğidir.
- **Formül:** (≥1 kullanıcı-mesajı olan kullanıcı — `coach_messages`) / (kayıtlı kullanıcı). Dönem penceresi: Tanımlanacak.
- **Veri kaynağı:** Supabase `coach_messages`.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** GROWTH_BIBLE §12.

## 8. Çekirdek Döngü KPI'ları

### KPI-009 — Çekirdek döngüyü tamamlayan kullanıcı
- **Kategori:** Çekirdek döngü
- **Tanım:** Takip et → tamamla → seriyi koru → koçtan destek al döngüsünün tamamını en az bir kez yaşayan kullanıcı oranı.
- **Neden önemli:** PRODUCT_BIBLE §17 başarı tanımının doğrudan ölçümü; North Star adayının (§5) temeli.
- **Formül:** Tanımlanacak ("seriyi koruma" eşiği ve pencere onayla belirlenecek).
- **Veri kaynağı:** Supabase `completions` + `streaks` + `coach_messages`.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** PRODUCT_BIBLE §17; GROWTH_BIBLE §5.

## 9. Retention KPI'ları
Retention'a dair her beklenti, veri gelene kadar **hipotezdir** (BL-004); hedef uydurulmaz.

### KPI-010 — Geri dönen kullanıcı
- **Kategori:** Retention
- **Tanım:** Belirli bir dönemde uygulamaya geri dönen (yeniden aktif olan) kullanıcı oranı.
- **Neden önemli:** Ürün süreklilik satar; geri dönmeyen kullanıcıda çekirdek değer yaşamaz.
- **Formül:** Tanımlanacak (dönüş penceresi — örn. gün bazlı kohort — veri altyapısıyla birlikte onaylanacak; kaynaklarda tanımlı değil).
- **Veri kaynağı:** Event tracking (mevcut değil) veya `completions` üzerinden yaklaşık türetme.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi (🟡 hipotez alanı — BL-004).
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** GROWTH_BIBLE §7; BL-004.

### KPI-011 — Çekirdek döngüyü sürdüren kullanıcı
- **Kategori:** Retention
- **Tanım:** Çekirdek döngüyü tek seferlik değil, **dönemler boyunca sürdüren** kullanıcı oranı (North Star adayıyla aynı aile — §5).
- **Neden önemli:** "Başarı, kullanıcının çekirdek döngüyü sürdürmesidir" (PRODUCT_BIBLE §17).
- **Formül:** Tanımlanacak (§5 ile birlikte).
- **Veri kaynağı:** Supabase `completions` + `streaks`.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** §5; PRODUCT_BIBLE §17.

### KPI-012 — Streak devamlılığı ve doğruluğu
- **Kategori:** Retention
- **Tanım:** İki bileşen: (a) kullanıcıların streak sürdürme davranışı; (b) streak verisinin **doğruluğu** (yanlış sayım/bozulma vakaları).
- **Neden önemli:** Streak retention çekirdeğidir; yanlışsa güven gider (Denetim P2-13). Doğruluk bileşeni ayrıca DEC-006'nın yeniden değerlendirme tetikleyicisidir ("gerçek kullanıcıda streak bozulması gözlemlenirse").
- **Formül:** (a) Tanımlanacak; (b) raporlanan/teşpit edilen streak bozulması vaka sayısı.
- **Veri kaynağı:** Supabase `streaks`/`completions`; kullanıcı geri bildirimi.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** (a) Belirlenmedi; (b) bozulma vakası = 0 (ilkesel).
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** DEC-006, BL-006; GROWTH_BIBLE §7.

## 10. AI Koç KPI'ları

### KPI-013 — Koç etkileşim sürekliliği
- **Kategori:** AI Koç
- **Tanım:** Koçu bir kez deneyen kullanıcının koça geri dönme oranı.
- **Neden önemli:** Koç, değer üreterek geri getirme rolündedir (GROWTH_BIBLE §12); tek seferlik kullanım değer üretmediğinin işaretidir.
- **Formül:** Tanımlanacak.
- **Veri kaynağı:** Supabase `coach_messages`.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** GROWTH_BIBLE §12.

### KPI-014 — Koç yanlış ret (false positive) oranı
- **Kategori:** AI Koç
- **Tanım:** Meşru kullanıcı mesajlarının injection filtresi tarafından yanlışlıkla reddedilme oranı.
- **Neden önemli:** Yanlış retler çekirdek değeri (koç) doğrudan bozar (Denetim P1-9; K10). RC-3.2'nin ölçüm karşılığıdır.
- **Formül:** (filtrece reddedilen meşru mesaj) / (toplam reddedilen mesaj). Meşruluk sınıflandırması: Tanımlanacak.
- **Veri kaynağı:** Edge Function logları (yapılandırılmış log altyapısı mevcut değil).
- **Mevcut değer:** Ölçülmüyor (denetim, false-positive varlığını koddan tespit etti; oran ölçülmedi).
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** T-013, RC-3.2.

## 11. Monetizasyon KPI'ları
Not: MRR, ARPU, LTV bu sürümde **tanımlanmamıştır** — kaynak dokümanlarda tanımları yoktur ve bugün veri kaynağı mevcut değildir. Gelir verisi (App Store Connect) lansman sonrası oluştuğunda, tanımlarıyla birlikte onay sürecinden geçerek eklenebilir (§25).

### KPI-015 — Free → Premium dönüşüm
- **Kategori:** Monetizasyon
- **Tanım:** Ücretsiz kullanıcıların premium aboneliğe geçme oranı.
- **Neden önemli:** Freemium modelin ana gelir metriği; ancak dürüst dönüşüm esastır (MONETIZATION_BIBLE §13: "daha fazla dönüştür" değil "dürüst dönüştür").
- **Formül:** (aktif `subscriptions` kaydı oluşan kullanıcı) / (kayıtlı kullanıcı). Pencere: Tanımlanacak.
- **Veri kaynağı:** Supabase `subscriptions`; App Store Connect (lansman sonrası).
- **Mevcut değer:** Ölçülmüyor (ürün lansman öncesi; 🟡 hipotez alanı — BL-004).
- **Hedef değer:** Belirlenmedi.
- **Durum:** Veri bekleniyor (lansman sonrası).
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** MONETIZATION_BIBLE §13; BL-004.

### KPI-016 — Satın alma doğrulama başarısı
- **Kategori:** Monetizasyon
- **Tanım:** Başlatılan satın almaların `verify-purchase` üzerinden başarıyla doğrulanıp premium'a yansıma oranı.
- **Neden önemli:** Para yolunun güvenilirliği (MONETIZATION_BIBLE §5); başarısız doğrulama = ödeyen ama premium alamayan kullanıcı.
- **Formül:** (başarılı doğrulama) / (tamamlanan satın alma).
- **Veri kaynağı:** Edge Function logları + `subscriptions` (yapılandırılmış ölçüm mevcut değil); sürüm öncesi: gerçek cihaz testi (T-006).
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli; sürüm öncesi test zorunlu (RC-1.2).
- **Ölçüm sıklığı:** Her sürüm öncesi test; sürekli ölçüm Belirlenecek.
- **İlgili doküman/görev:** T-006, RC-1.2; TECHNICAL_CONTEXT §9.

### KPI-017 — Restore (geri yükleme) başarısı
- **Kategori:** Monetizasyon
- **Tanım:** "Satın Alımları Geri Yükle" akışının aktif aboneliği doğru geri kazandırma oranı.
- **Neden önemli:** Kurtarılabilir ödeme akışı ilkesi (MONETIZATION_BIBLE §5).
- **Formül:** (başarılı restore) / (aktif aboneliği olan kullanıcının restore denemesi).
- **Veri kaynağı:** Gerçek cihaz testi (T-006); sürekli ölçüm altyapısı mevcut değil.
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli; sürüm öncesi test zorunlu.
- **Ölçüm sıklığı:** Her sürüm öncesi test; sürekli ölçüm Belirlenecek.
- **İlgili doküman/görev:** T-006, RC-1.2.

### KPI-018 — İptal/süre dolumu sonrası doğru free düşüşü
- **Kategori:** Monetizasyon
- **Tanım:** Aboneliği biten kullanıcının doğru şekilde free'ye düşme oranı (KPI-002'nin yaşam döngüsü/operasyon karşılığı).
- **Neden önemli:** Abonelik yaşam döngüsü doğruluğu (MONETIZATION_BIBLE §9; DEC-004).
- **Formül:** (süresi dolup free'ye düşen) / (süresi dolan abonelik).
- **Veri kaynağı:** `subscriptions` (`expires_at`) + gerçek cihaz testi.
- **Mevcut değer:** Ölçülmüyor (bilinen kusur: Denetim P0-3; düzeltme T-003).
- **Hedef değer:** %100 (ilkesel — hayalet premium yok).
- **Durum:** Düzeltme + ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Her sürüm öncesi test; sürekli ölçüm Belirlenecek.
- **İlgili doküman/görev:** DEC-004, T-003, T-006, RC-1.2.

### KPI-019 — Gelir kaçağı göstergeleri
- **Kategori:** Monetizasyon (guardrail niteliğinde)
- **Tanım:** Bilinen gelir kaçağı yollarının (istemci bayrağı, hayalet premium, ödeme yolu kırıklığı) açık olma sayısı.
- **Neden önemli:** "Önce kaçağı durdur" ilkesinin ölçümü (MONETIZATION_BIBLE §10).
- **Formül:** Açık gelir kaçağı yolu sayısı (kod denetimiyle).
- **Veri kaynağı:** Kod denetimi.
- **Mevcut değer:** iOS kapsamında 0 açık gelir kaçağı yolu (kod denetimi, 2026-07-17) — `clientPremium` (T-002, deploy edildi, canlıda) ve `localSku` (T-003, yalnızca yerel değişiklik, henüz App Store'a çıkmadı) kod tarafında kapatıldı; gerçek cihazda uçtan uca davranışsal doğrulama T-006 kapsamında ayrıca yapılacak. Android satın alma yolu bugün itibarıyla hâlâ teknik olarak çözülmedi; Android artık DEC-009 ile aktif geliştirme kapsamındadır (ROADMAP T-021), ancak Android IAP doğrulanıp yayına alınana kadar bu KPI'nın ölçüm kapsamı iOS ile sınırlı kalır.
- **Hedef değer:** 0.
- **Durum:** Ölçülebilir (denetimle); düzeltmeler v1.0.2'de planlı.
- **Ölçüm sıklığı:** Her sürüm öncesi.
- **İlgili doküman/görev:** T-002, T-003, RC-1.2; GROWTH_BIBLE §8.

## 12. Pazarlama KPI'ları

### KPI-020 — App Store funnel (görüntülenme → ürün sayfası → indirme)
- **Kategori:** Pazarlama
- **Tanım:** Mağaza görünürlüğünün indirmeye dönüşme zinciri.
- **Neden önemli:** Pre-PMF'in birincil (ve kaynaklarda doğrulanmış tek) organik kanalının etkinliği (GROWTH_BIBLE §9–10). İndirme tek başına başarı değildir (§19); funnel yalnızca aktivasyonla (KPI-005…008) birlikte okunur.
- **Formül:** App Store Connect funnel adımları (impressions → product page views → downloads).
- **Veri kaynağı:** App Store Connect (lansman sonrası).
- **Mevcut değer:** Ölçülmüyor (lansman öncesi).
- **Hedef değer:** Belirlenmedi.
- **Durum:** Veri bekleniyor (lansman sonrası).
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** T-010; MARKETING_BIBLE §13; GROWTH_BIBLE §10.

## 13. Growth KPI'ları

### KPI-021 — İndirme → aktive kullanıcı oranı
- **Kategori:** Growth
- **Tanım:** İndirmelerin, aktivasyon adımlarını (KPI-006/007) geçen gerçek kullanıcıya dönüşme oranı.
- **Neden önemli:** "Growth başarısı yalnızca indirmeyle değil, çekirdek döngüyü tamamlayan ve geri dönen kullanıcıyla değerlendirilir" (GROWTH_BIBLE §15). Bu KPI, indirme sayısını anlamlı bağlama oturtur.
- **Formül:** (aktive olan kullanıcı) / (indirme). "Aktive" tanımı: Tanımlanacak (KPI-006/007 eşiğine bağlanacak).
- **Veri kaynağı:** App Store Connect + Supabase (lansman sonrası; event tracking gerekli).
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** GROWTH_BIBLE §15.

## 14. App Store KPI'ları

### KPI-022 — Lokalize metadata etkisi
- **Kategori:** App Store
- **Tanım:** TR/EN lokalize metadata ve ekran görüntülerinin mağaza funnel'ına etkisi.
- **Neden önemli:** Kaynaklarda doğrulanmış en yüksek organik kaldıraç (Karar Dokümanı §5/№4); etkisi ancak veri geldikten sonra ölçülür (GROWTH_BIBLE §9).
- **Formül:** Tanımlanacak (lokal bazlı funnel karşılaştırması — veri geldikten sonra).
- **Veri kaynağı:** App Store Connect (lokal bazlı raporlar; lansman sonrası).
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Veri bekleniyor (T-010 + lansman sonrası).
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** T-010, RC-2.3.

### KPI-023 — Mağaza uyum durumu
- **Kategori:** App Store
- **Tanım:** Bilinen mağaza reddi riski taşıyan açık bulgu sayısı (teslim edilmeyen özellik, dil tutarsızlığı, kırık satın alma vb.).
- **Neden önemli:** "Red = sıfır gelir" (Karar Dokümanı K4); uyum bir growth varlığıdır (GROWTH_BIBLE §10).
- **Formül:** Açık mağaza-riski bulgu sayısı (denetim bazlı).
- **Veri kaynağı:** Kod/yüzey denetimi; denetim raporu "App Store / Google Play Riskleri" bölümü.
- **Mevcut değer:** Açık riskler mevcut (paywall dili P1-6, a11y P1-7). Streak Kalkanı (P0-5) T-004 ile giderildi (2026-07-17; bkz. TECHNICAL_CONTEXT §17, DECISIONS DEC-002). Android riski, DEC-009 gereği artık aktif geliştirme kapsamında olsa da henüz submit edilmiyor (yayın ileride); Android'e özgü mağaza-uyum riski T-021 tamamlanıp submit'e yaklaşıldığında ayrıca değerlendirilecektir.
- **Hedef değer:** 0 açık risk (submit öncesi).
- **Durum:** Ölçülebilir (denetimle); düzeltmeler v1.0.2–v1.0.4'te planlı.
- **Ölçüm sıklığı:** Her submit öncesi.
- **İlgili doküman/görev:** T-004, T-007, T-015; RC-1.3, RC-2.1, RC-3.3.

## 15. Ürün Kalitesi KPI'ları

### KPI-024 — Kritik akış başarı oranı
- **Kategori:** Ürün kalitesi
- **Tanım:** Kritik akışların (kayıt, satın alma, restore, iptal→free düşüşü, streak, koç limiti — denetim raporu uçtan uca test listesi) testte başarı oranı.
- **Neden önemli:** "Reklamı yapılan her şey gerçekten çalışmalıdır" (PRODUCT_BIBLE §4); hiçbir görev doğrulanmadan bitti sayılmaz (TECHNICAL_CONTEXT §18).
- **Formül:** (başarılı kritik akış testi) / (toplam kritik akış testi).
- **Veri kaynağı:** Gerçek cihaz regresyon testi.
- **Mevcut değer:** Ölçülmüyor (uçtan uca regresyon henüz koşulmadı).
- **Hedef değer:** %100 (sürüm öncesi).
- **Durum:** Ölçülebilir (testle); test v1.0.2 kapsamında planlı (T-006).
- **Ölçüm sıklığı:** Her sürüm öncesi.
- **İlgili doküman/görev:** T-006; TECHNICAL_CONTEXT §18.

## 16. Erişilebilirlik KPI'ları
Bu kategori bugün **koddan ölçülebilir** — mevcut değerler denetim raporundan (11 Temmuz 2026) kaynaklıdır.

### KPI-025 — Kritik akış a11y etiket kapsamı
- **Kategori:** Erişilebilirlik
- **Tanım:** Kritik akışlardaki (auth, paywall, habit) ikon butonların `accessibilityLabel` kapsama oranı.
- **Neden önemli:** WCAG 4.1.2; ekran okuyucu kullanıcıları için ürün kullanılabilirliği (Denetim P1-7); erişilebilirlik tasarımın parçasıdır (PRODUCT_BIBLE §9).
- **Formül:** (etiketli ikon buton) / (toplam ikon buton) — kritik akışlarda.
- **Veri kaynağı:** Kod denetimi.
- **Mevcut değer:** %0 — tüm `src`'de 0 kullanım (Denetim P1-7).
- **Hedef değer:** Kritik akışlarda %100 (RC-3.3).
- **Durum:** Ölçülebilir; düzeltme T-015'te planlı.
- **Ölçüm sıklığı:** Her sürüm öncesi.
- **İlgili doküman/görev:** T-015, RC-3.3.

### KPI-026 — Metin kontrastı AA uyumu
- **Kategori:** Erişilebilirlik
- **Tanım:** Kritik metin renklerinin WCAG AA (4.5:1 küçük metin) kontrast eşiğini geçme durumu.
- **Neden önemli:** Okunabilirlik herkes için (Denetim P1-8; WCAG 1.4.3).
- **Formül:** AA'yı geçmeyen kritik metin rengi sayısı = 0.
- **Veri kaynağı:** Kod denetimi (hesaplanan kontrast değerleri).
- **Mevcut değer:** 1 ihlal — `textMuted #4A4A6A`: bg üzerinde 2.35:1, surface üzerinde 2.23:1 (Denetim P1-8).
- **Hedef değer:** 0 ihlal (RC-3.3).
- **Durum:** Ölçülebilir; düzeltme T-014'te planlı.
- **Ölçüm sıklığı:** Her tema değişikliğinde ve sürüm öncesi.
- **İlgili doküman/görev:** T-014, RC-3.3.

## 17. Teknik Güvenilirlik KPI'ları
Bu kategorinin tamamı bugün **ölçülemez**: hata izleme altyapısı yok (TECHNICAL_CONTEXT §16) ve `LogBox.ignoreLogs` gerçek hata sinyallerini susturuyor (Denetim P1-11). Altyapı işi ROADMAP T-012'de planlıdır.

### KPI-027 — Crash-free session/user oranı
- **Kategori:** Teknik güvenilirlik
- **Tanım:** Çökme yaşamayan oturum/kullanıcı oranı.
- **Neden önemli:** Tek render hatası kurtarılamaz beyaz ekran bırakıyor (Denetim P1-11); güvenilirlik gösterişten önce gelir (PRODUCT_BIBLE §4).
- **Formül:** Standart crash-free oranı (izleme aracı tanımıyla — araç bağlanınca netleşir).
- **Veri kaynağı:** Hata izleme (Sentry vb. — mevcut değil).
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli (T-011, T-012).
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** T-011, T-012, RC-3.1.

### KPI-028 — Hata oranı (error rate)
- **Kategori:** Teknik güvenilirlik
- **Tanım:** İstemci ve Edge Function hatalarının oranı/hacmi.
- **Neden önemli:** Susturulan hatalar görünmez teknik borçtur (Denetim P1-11).
- **Formül:** Tanımlanacak (izleme aracı bağlanınca).
- **Veri kaynağı:** Hata izleme + Edge Function logları (mevcut değil).
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** T-012, RC-3.1.

### KPI-029 — Satın alma doğrulama hata oranı
- **Kategori:** Teknik güvenilirlik
- **Tanım:** `verify-purchase` çağrılarının hata ile sonuçlanma oranı (KPI-016'nın teknik/operasyon tarafı).
- **Neden önemli:** Para yolundaki teknik hata doğrudan gelir ve güven kaybıdır.
- **Formül:** (hatalı doğrulama çağrısı) / (toplam doğrulama çağrısı).
- **Veri kaynağı:** Edge Function logları (yapılandırılmış izleme mevcut değil).
- **Mevcut değer:** Ölçülmüyor.
- **Hedef değer:** Belirlenmedi.
- **Durum:** Ölçüm altyapısı gerekli.
- **Ölçüm sıklığı:** Belirlenecek.
- **İlgili doküman/görev:** T-006; TECHNICAL_CONTEXT §9.

## 18. Guardrail Metrikleri
Guardrail'ler hedefi büyütülecek metrikler değil, **hiçbir KPI iyileştirmesinin çiğneyemeyeceği sınırlardır.** Herhangi biri ihlal edilirse, onu ihlal eden iyileştirme geri alınır:

- **Gelir kaçağı yolu = 0** (KPI-019): hiçbir growth/monetizasyon işi yeni kaçak yolu açamaz.
- **Teslim edilmeyen özellik görünürlüğü = 0** (KPI-003): hiçbir dönüşüm optimizasyonu teslim edilmeyen vaat ekleyemez.
- **Dark pattern kullanımı = 0:** MONETIZATION_BIBLE §12, MARKETING_BIBLE §16, GROWTH_BIBLE §17 yasak setleri; ihlal sayılabilir ve sıfır olmalıdır.
- **Dil karışıklığı yaşanan yüzey = 0:** hiçbir ekranda/yüzeyde dil karışıklığına izin verilmez (PRODUCT_BIBLE §8).
- **Süresi dolan aboneliğin premium kalma vakası = 0** (KPI-018): hayalet premium kabul edilmez.
- **Erişilebilirlik gerilemesi yok:** KPI-025/026 değerleri, hiçbir görsel/dönüşüm işiyle geriye gidemez.

## 19. Vanity Metrikleri
Aşağıdakiler izlenebilir ama **tek başına asla başarı ölçütü, KPI veya North Star yapılamaz** (PRODUCT_BIBLE §17: "başarı, indirme sayısı değildir"; GROWTH_BIBLE §15, §17):

- Toplam indirme sayısı (bağlamsız).
- Toplam kayıt sayısı (aktive olmayan kayıt değer üretmez).
- Toplam gönderilen koç mesajı sayısı (kalite/süreklilik olmadan).
- Toplam oluşturulan alışkanlık sayısı (tamamlanmayan alışkanlık değer değildir).
- Sosyal medya takipçi/beğeni sayıları.

Bu metrikler ancak bir orana bağlanarak (örn. indirme → aktive oranı, KPI-021) anlam kazanır.

## 20. KPI Durumları
- **Ölçülebilir:** Veri kaynağı bugün mevcut (kod denetimi/test); değer üretilebilir.
- **Ölçüm altyapısı gerekli:** Tanım hazır; event tracking / hata izleme / yapılandırılmış log kurulmadan ölçülemez.
- **Veri bekleniyor:** Altyapı sorusu değil, zaman sorusu (örn. lansman sonrası App Store Connect verisi).
- **Aday:** Tanım öneri düzeyinde; onaylanmadan bağlayıcı değil (örn. North Star — §5).
- **Pasif:** Karar gereği izlenmeyen alan (ilgili karar değişirse yeniden değerlendirilir).

## 21. Veri Kaynağı ve Ölçüm Kuralları
- **Her KPI'nın beyan edilmiş bir veri kaynağı olmalıdır.** Kaynağı olmayan KPI "Ölçülmüyor"dur; değer uydurulamaz.
- **Kabul edilen kaynaklar (bugün):** Supabase Postgres tabloları; gerçek cihaz testleri; kod denetimi. **Lansman sonrası:** App Store Connect. **Kurulursa:** event tracking, hata izleme, yapılandırılmış Edge Function logları.
- **Tek tanım kuralı:** Bir metriğin tek bir tanımı ve formülü olur; ekip/doküman başına farklı tanım türetilmez. Tanım değişirse bu dosyada değişir.
- **Hipotez ayrımı:** Veriyle desteklenmeyen her beklenti hipotezdir ve 🟡/🟠 işaretiyle anılır (BACKLOG kanıt seviyeleriyle uyumlu); hipotez, "mevcut değer" alanına yazılamaz.
- **Dürüst ölçüm:** Veri, hipotezi doğrulamak için toplanır; anlatıyı süslemek için seçilmez (GROWTH_BIBLE §15). Ölçüm yöntemi değişirse eski/yeni seriler ayrı raporlanır.
- **Kapsam:** Bugün itibarıyla ölçüm kapsamı iOS'tur; Android henüz yayınlanmadığı ve ölçülebilir bir kullanıcı yüzeyi olmadığı için **Android metriği bugün üretilmez ve raporlanmaz**. Bu kalıcı bir kapsam dışı bırakma değildir — Android artık aktif geliştirme kapsamındadır (DEC-009, ROADMAP T-021); Android ölçülebilir hale geldiğinde (yayına yaklaşıldığında) bu bölüm ve ilgili KPI'lar tanımlanıp güncellenecektir. Bugün için hiçbir Android metriği/rakamı uydurulmaz.
- **Gizlilik:** Ölçüm, PRODUCT_BIBLE §5 gizlilik ilkelerine tabidir; gereksiz veri toplanmaz.

## 22. Hedef Belirleme Kuralları
- **Hedef uydurulmaz.** Sayısal hedef ancak (a) gerçek baz veri oluştuğunda ve (b) onaylandığında yazılır. O güne kadar tüm hedef alanları "Belirlenmedi"dir.
- **Benchmark ithal edilmez.** Kaynaklarda olmayan sektör ortalaması, rakip değeri veya tahmini eşik hedef olarak kullanılamaz (rakipler referanstır, şablon değildir — PRODUCT_BIBLE §13).
- İstisna — **uyum hedefleri:** İhlal-sayısı türü hedefler (0 ihlal, %100 doğru davranış) veri gerektirmez; bunlar ilkelerin (PRODUCT_BIBLE, MONETIZATION_BIBLE) doğrudan sonucudur ve bu dosyada bugün yazılabilir (KPI-001…004, 018, 019, 023…026).
- Hedefler, guardrail'leri (§18) ihlal edecek şekilde belirlenemez.
- Hedef değişikliği bir karar ise DECISIONS sürecinden geçer.

## 23. Raporlama Ritmi
- Kaynak dokümanlarda raporlama ritmi tanımlanmamıştır: **Belirlenecek.**
- Ritim, ölçüm altyapısı kurulduktan ve gerçek veri akmaya başladıktan sonra, sprint/takvim üretmeden ilke düzeyinde bu dosyaya eklenir.
- Bugünkü tek zorunlu ritim, sürüm-öncesi doğrulamadır: uyum ve test KPI'ları (KPI-001…004, 016–019, 023–026) her sürüm öncesi kontrol edilir (TECHNICAL_CONTEXT §18; ROADMAP Release Criteria).

## 24. Doküman Sistemi
- **Metrik sözlüğü ve ölçüm kuralları** → **bu dosya (`KPI.md`)**
- **Başarının anlamı (ilke)** → `PRODUCT_BIBLE.md` §17
- **Gelir ilkeleri** → `MONETIZATION_BIBLE.md`
- **Pazarlama ilkeleri** → `MARKETING_BIBLE.md`
- **Büyüme ilkeleri** → `GROWTH_BIBLE.md`
- **Kesin kararlar** → `DECISIONS.md`
- **Aktif işler** → `ROADMAP.md` (ölçüm altyapısı işleri dahil)
- **Hipotezler** → `BACKLOG.md` (BL-004, BL-005)
- **Teknik gerçek** → `TECHNICAL_CONTEXT.md`
- **Kaynak denetim/karar** → `docs/audits/`
- Çelişki halinde: metrik **tanımları ve ölçüm kuralları** için bu dosya; başarı **ilkesi** için PRODUCT_BIBLE esas alınır. Bu doküman diğer belgelerle çelişmez.

## 25. Bakım Kuralları
- Bu dosya yalnızca metrik tanımları, KPI kayıtları ve ölçüm kuralları içerir; sprint işi, dashboard tasarımı veya deney planı buraya yazılmaz.
- **Benzersiz ID:** Her KPI sıradaki `KPI-XXX` ID'sini alır; ID'ler yeniden kullanılmaz. Kaldırılan KPI silinmez, "Pasif" işaretlenir.
- Yeni KPI ancak veri kaynağı beyan edilerek ve ilgili anayasalarla (PRODUCT/MONETIZATION/MARKETING/GROWTH_BIBLE) çelişmeden eklenir.
- MRR, ARPU, LTV gibi gelir metrikleri ancak tanımları ve veri kaynakları netleşince, onayla eklenir.
- "Mevcut değer" alanları yalnızca doğrulanmış veriyle güncellenir; tahmin yazılmaz.
- North Star adayı (§5) onaylanırsa "Aday" ibaresi kaldırılır ve karar DECISIONS'a kaydedilir.
- Ölçüm altyapısı kurulduğunda ilgili KPI'ların "Durum" alanları güncellenir; §3 buna göre revize edilir.

## 26. Değişiklik Özeti
- **Oluşturuldu:** KPI.md ilk sürümü (metrik sözlüğü + ölçüm anayasası).
- **Kaynak:** Yalnızca `BLOOM_DENETIM_RAPORU.md` ve `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`; tutarlılık için PRODUCT_BIBLE, TECHNICAL_CONTEXT, DECISIONS, ROADMAP, BACKLOG, MONETIZATION_BIBLE, MARKETING_BIBLE, GROWTH_BIBLE ile hizalandı.
- **Kapsam:** KPI-001…KPI-029 tanımlandı; sprint işi, dashboard, deney planı veya roadmap maddesi üretilmedi.
- **Dürüstlük sınırları:** Hiçbir sayısal hedef veya benchmark uydurulmadı (tüm davranışsal hedefler "Belirlenmedi"; yalnızca ilkelerden türeyen uyum hedefleri — 0 ihlal / %100 doğruluk — yazıldı); analitik/hata izleme altyapısının olmadığı açıkça beyan edildi (§3); ölçülmeyen her alan "Ölçülmüyor" işaretlendi; "mevcut değer" yalnızca denetim raporundan koddan-kanıtlı tespitler için yazıldı (KPI-001, 002, 003, 019, 023, 025, 026); North Star aday olarak işaretlendi, bağlayıcı yazılmadı; vanity metrikler başarı ölçütü dışında tutuldu; kapsam iOS-only korundu, Android metriği üretilmedi; raporlama ritmi kaynaklarda tanımsız olduğundan "Belirlenecek" bırakıldı.
- **Revizyonlar (onaylı):** North Star adayının AI koç kullanımını doğrudan ölçmediği netleştirildi (koç boyutu KPI-009 ve KPI-013 ile izlenir; formüle dahli onay aşamasında kararlaştırılacak); kaynakta olmayan "%100'e yakın / sıfıra yakın" hedef yönleri kaldırıldı (KPI-014, KPI-016, KPI-017, KPI-029); Android satın alma yolunun teknik olarak çözülmediği, yalnızca iOS-only kararı gereği kapsam dışında olduğu netleştirildi (KPI-019).
- **2026-07-17 revizyonu:** §21 ve KPI-019/KPI-023 "mevcut değer" alanları DEC-009 (Android artık paralel geliştiriliyor) ile tutarlı hale getirildi; hiçbir Android metriği/rakamı uydurulmadı, kapsam "geliştirme başladığında tanımlanacak" olarak netleştirildi. §20/451 ("Pasif" tanımındaki Android örneği) bu revizyonun dışında tutuldu — önerilen alternatif örnek (DEC-006/DEC-008) doğrulanamadı, ayrı onay bekliyor. KPI-019'daki `clientPremium`/`localSku` "mevcut değer" rakamının artık güncelliğini yitirmiş olabileceği not edildi (T-002/T-003 tamamlandı) — bu turda dokunulmadı, ayrı turda ele alınacak.
- **2026-07-17 revizyonu (2):** KPI-001, KPI-002, KPI-019 "mevcut değer"/"Durum" alanları `TECHNICAL_CONTEXT` §8/§9/§15 ile tutarlı hale getirildi (asıl kaynak orasıdır). KPI-001 ve KPI-019: kod denetimiyle "0 ihlal" (T-002 canlıda, T-003 kod tarafında kapandı). KPI-002: formülü tamamen gerçek cihaz testi gerektirdiği için **"Ölçülmüyor" olarak bırakıldı**, "0 ihlal" yazılmadı — T-006 koşulmadan bu KPI'nın davranışsal sonucu bilinmez. T-002 (deploy edildi, canlı) ile T-003 (yalnızca yerel, henüz App Store'a çıkmadı) arasındaki fark her satırda ayrıca belirtildi.
- **2026-07-17 revizyonu (3):** KPI-003 ve KPI-023 "mevcut değer"/"Durum" alanları `TECHNICAL_CONTEXT` §17 ile tutarlı hale getirildi. Streak Kalkanı (P0-5) her iki KPI'da "0 ihlal"/"giderildi" olarak güncellendi — kod/yüzey denetimiyle doğrulandı, cihaz testi gerektirmiyor (T-004). KPI-023'te paywall dili (P1-6) ve a11y (P1-7) hâlâ genuinely açık olduğu için **dokunulmadı**.
