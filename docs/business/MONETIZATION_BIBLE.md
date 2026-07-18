# BLOOM — MONETIZATION_BIBLE (Gelir Stratejisi Anayasası)

> Bu doküman BLOOM'un gelir stratejisinin **kalıcı ilkelerini** tutar. Geçici işler veya sprint görevleri burada yer almaz (onlar `ROADMAP.md`'de). Kaynak: `BLOOM_DENETIM_RAPORU.md`, `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`. Kesin kararlar `DECISIONS.md`'de; bu doküman onlarla çelişmez.

## 1. Amaç
BLOOM'un nasıl para kazandığını ve **hangi ilkelerle** kazandığını tek bir kalıcı kaynaktan tanımlamak. Amaç, gelirin her zaman güven ve çekirdek deneyimden **sonra** geldiği (PRODUCT_BIBLE öncelik sırası: güven → çekirdek deneyim → retention → gelir → growth → yeni özellik), dürüst ve sızıntısız bir monetizasyon çerçevesi kurmaktır.

## 2. Gelir Modeli
- **Model:** Freemium + abonelik. Ücretsiz plan gerçek ve kullanılabilir değer verir; premium bunu genişletir.
- **Ürünler (Teknik doğrulandı — bkz. TECHNICAL_CONTEXT.md):** Aylık abonelik (`com.barangunduz.bloomhabit.monthly`) ve yıllık abonelik (`com.barangunduz.bloomhabit.yearly`).

  > Bu kimlikler teknik referanstır; kullanıcıya gösterilen ürün adı ve fiyat her zaman mağazadan alınır.
- **Platform kapsamı:** İlk sürüm yalnızca iOS (DEC-001). Android artık ertelenmiş değil, aktif geliştirme kapsamındadır (DEC-009, ROADMAP T-021); ancak Android IAP bugün itibarıyla henüz doğrulanmadı ve bu doküman Android geliri için hiçbir tarih veya rakam taahhüdü vermez.
- **İlke:** Tek seferlik satış değil, sürdürülebilir abonelik. Gelir, teslim edilen sürekli değere dayanır.

## 3. Free Plan
Ücretsiz plan bir "deneme kısıtı" değil, **kendi başına değerli** olmalıdır. Teknik doğrulandı (bkz. TECHNICAL_CONTEXT.md) ücretsiz sınırlar:
- Alışkanlık sayısı: 3'e kadar (`FREE_HABIT_LIMIT = 3`).
- AI Koç: günde 3 mesaj (sunucu tarafından zorlanan `DAILY_FREE_LIMIT = 3`).
- Haftalık AI raporu: yok (premium'a ait).
- Habit DNA: temel düzey.
- Habit Stacks (rutinler): premium'a kilitli.

**İlke:** Ücretsiz kullanıcı çekirdek döngüyü (takip → tamamla → seri → koç) gerçekten yaşayabilmeli; kısıtlar değeri gösterecek kadar açık, ama deneyimi sakatlamayacak kadar cömert olmalıdır.

## 4. Premium Plan
Premium, ücretsiz planın **gerçekten teslim edilen** genişletmesidir. Teknik doğrulandı (bkz. TECHNICAL_CONTEXT.md) premium değerler:
- Sınırsız alışkanlık.
- Sınırsız AI Koç mesajı.
- Haftalık AI raporu.
- Detaylı Habit DNA raporu (+ paylaşım).
- Habit Stacks (rutinler).

**İlke:** Premium'da yalnızca kodda çalışan özellikler satılır. Reklamı yapılan "Streak Kalkanı" özelliği teslim edilmediği için premium değer listesinden çıkarılmıştır (DEC-002). Çalışmayan hiçbir özellik ücretli planda gösterilmez.

## 5. Satın Alma İlkeleri
- **Sunucu doğrulaması esastır:** Satın alma, Apple App Store Server API ile sunucu tarafında doğrulanır; premium'u yalnızca sunucu (service-role) `subscriptions` tablosuna yazar (Teknik doğrulandı — bkz. TECHNICAL_CONTEXT.md, `verify-purchase`).
- **İstemci yetkiye karar vermez:** İstemci yalnızca UX için önbelleğe alır; premium kararı asla istemciden gelmez (DEC-003).
- **Geri yükleme her zaman mümkündür:** Kullanıcı satın alımını "Satın Alımları Geri Yükle" ile geri kazanabilir (Teknik doğrulandı — bkz. TECHNICAL_CONTEXT.md, `getAvailablePurchases` + doğrulama).
- **İlke:** Ödeme akışı şeffaf, doğrulanabilir ve kullanıcı lehine kurtarılabilir olmalıdır.

## 6. Fiyatlandırma İlkeleri
- **Yerelleştirilmiş fiyat:** Fiyat, mağazadan (StoreKit `localizedPrice`) kullanıcının para biriminde gösterilir; kod, mağaza fiyatı gelmezse belgelenmiş yedek değerleri kullanır (aylık ve yıllık; yıllıkta indirim vurgusu).
- **Yıllık teşvik:** Yıllık plan aylığa göre indirimli sunulur (koddaki yıllık "indirim" rozeti).
- **Şeffaflık:** Kullanıcı ne için, ne kadar ve hangi sıklıkla ödediğini net görür; gizli ücret veya yanıltıcı "indirim" yoktur.
- **İlke:** Fiyat dürüsttür; sahte referans fiyat, sahte indirim veya yanıltıcı karşılaştırma kullanılmaz.

## 7. Paywall İlkeleri
- **Değer önce, ödeme sonra:** Paywall, ücretsiz vs premium değerini dürüstçe karşılaştırır; yalnızca teslim edilen özellikleri listeler.
- **Dürüst dil ve lokalizasyon:** Paywall kullanıcının dilinde ve tutarlı gösterilir; dil karışıklığına izin verilmez. (Bu ilkenin uygulanması ROADMAP'te izlenir; ilke burada kalıcıdır.)
- **Zorlama yok:** Paywall kapatılabilir olmalı; kullanıcı ücretsiz kalmayı seçebilmelidir.
- **Yasal şeffaflık:** Abonelik koşulları, otomatik yenileme bilgisi, EULA ve gizlilik politikası bağlantıları paywall'da bulunur (Teknik doğrulandı — bkz. TECHNICAL_CONTEXT.md).

## 8. AI Kullanım Politikası
- **Model kademesi:** Ücretsiz kullanıcı `gpt-4o-mini`, premium kullanıcı `gpt-4o` (Teknik doğrulandı — bkz. TECHNICAL_CONTEXT.md). Model seçimi ve limit **sunucu tarafında** belirlenir.
- **Ücretsiz limit:** Günde 3 koç mesajı, sunucu tarafında sayılır; istemci kapatılıp açılsa da sıfırlanmaz.
- **Maliyet kontrolü ilkesi:** AI premium'un ana kaldıraçlarından biridir; ücretsiz kademe gerçek bir tat verir, premium sınırsız + daha güçlü modeli açar. AI maliyeti yalnızca sunucu-doğrulanmış yetkiyle harcanır (DEC-003).
- **İlke:** AI erişimi hiçbir zaman istemci bayrağıyla açılmaz; kötüye kullanım (bedava sınırsız kullanım) sunucu tarafında engellenir.

## 9. Abonelik Yaşam Döngüsü
- **Başlangıç:** Satın alma → sunucu doğrulaması → premium `subscriptions` tablosuna yazılır.
- **Yenileme:** Abonelik, dönem bitiminden önce iptal edilmezse otomatik yenilenir (Teknik doğrulandı — bkz. TECHNICAL_CONTEXT.md, paywall metni).
- **İptal:** Kullanıcı aboneliği App Store Ayarları > Abonelikler'den yönetir/iptal eder.
- **Sona erme:** Süre dolduğunda kullanıcı **free'ye düşer**; süresi dolmuş abonelik premium kalmaz (DEC-004).
- **Geri yükleme:** Aktif abonelik başka cihazda/yeniden kurulumda geri yüklenebilir.
- **İlke:** Yaşam döngüsünün her adımı (başlangıç, yenileme, iptal, sona erme) doğru ve kullanıcı lehine şeffaf yürür.

## 10. Gelir Güvenliği İlkeleri
- **Tek doğru kaynak:** Premium durumu yalnızca sunucu/veritabanıdır (`subscriptions` + `expires_at`); istemci buna karar veremez (DEC-003).
- **Hayalet premium yok:** Yerel önbellek (`localSku`) premium kararında kullanılmaz; yalnızca tarife etiketleme içindir (DEC-004).
- **Sunucu yetkisi:** Premium'u yalnızca sunucu yazar; istemci hiçbir zaman premium veremez.
- **Önce kaçağı durdur:** Yeni gelir "kazanmadan" önce sızan gelir durdurulur (Karar Dokümanı §5). Gelir güvenliği, gelir artırma girişimlerinden önce gelir.
- **İlke:** Her gelir yolu, istismara kapalı ve doğrulanabilir olmalıdır.

## 11. App Store / Play Store Uyumluluğu
- **Teslim edilen özellik satılır:** Reklamı yapılan her şey çalışır (Guideline 2.3.1). Streak Kalkanı bu ilkeyle paywall'dan çıkarıldı (DEC-002).
- **Abonelik şeffaflığı:** Otomatik yenileme bilgisi, fiyat/dönem, EULA ve gizlilik bağlantıları paywall'da sunulur.
- **iOS-first (v1.0.2 kapsamı):** İlk sürüm iOS hedeflidir; Android satın alma bugün itibarıyla henüz doğrulanmadığı için **bu sürümün** lansman kapsamı dışındadır (DEC-001) — bu, Play reddi riskini bu sürüm için ortadan kaldırır. Android artık süresiz ertelenmiş değildir (DEC-009); Play uyumu, Android submit'e yaklaşıldığında ayrıca değerlendirilecektir.
- **İlke:** Mağaza kuralları bir engel değil, dürüstlük çıtasıdır; uyum en baştan gözetilir.

## 12. Yasaklanan Monetization Yaklaşımları
Aşağıdakiler BLOOM'da **kesinlikle kullanılmaz** (Karar Dokümanı ve Denetim Raporu dark-pattern taraması ile uyumlu):
- Sahte kıtlık, sahte geri sayım, sahte indirim veya sahte istatistik.
- Gizli/zorlaştırılmış iptal (gizli cancel) ve zorla devam ettirme (forced continuity).
- Onay-shaming (kullanıcıyı suçlayan reddetme dili).
- Teslim edilmeyen veya çalışmayan bir özelliği satmak.
- Premium yetkisini istemciye bırakmak veya istemci bayrağına güvenmek.
- Yanıltıcı fiyat/karşılaştırma ve gizli ücret.

## 13. PMF Öncesi Monetization Stratejisi
- **Önce dürüstlük ve sızıntı:** Pre-PMF'te öncelik, gelir kaçaklarını kapatmak ve dürüst/çalışan bir paywall kurmaktır — yeni gelir optimizasyonu değil.
- **Erken optimizasyondan kaçın:** Paywall zamanlaması, soft-paywall ve A/B denemeleri bu aşamada bilinçle ertelenir; kullanıcı hacmi olmadan anlamsızdır (BACKLOG BL-001).
- **İlke:** Pre-PMF'te monetizasyon hedefi "daha fazla dönüştür" değil, "dürüst ve güvenilir dönüştür"dür.

## 14. PMF Sonrası Genişleme Stratejisi
Aşağıdakiler yalnızca **PMF sonrası ve veriyle** değerlendirilir; şu an taahhüt değildir:
- Paywall zamanlaması / soft-paywall / A/B denemeleri (BL-001).
- (Bu madde 2026-07-17'de kaldırıldı: Android artık talep-kanıtlanmasına koşullu değil; DEC-009 ile aktif geliştirme kapsamına alındı — bkz. §2, §11, ROADMAP T-021. Android monetizasyonu yine de yalnızca IAP doğrulandıktan sonra devreye girer.)
- Dönüşüm/retention/monetizasyon varsayımlarının kullanıcı verisiyle doğrulanması (BL-004).
- **İlke:** Genişleme, çekirdek deneyim güvenilir ve dürüst çalıştıktan sonra, veriye dayanarak yapılır; sıralama asla bozulmaz (güven → çekirdek → retention → gelir → growth).

## 15. Doküman Sistemi
- **Gelir ilkeleri** → **bu dosya (`MONETIZATION_BIBLE.md`)**
- **Ürün ilkeleri** → `PRODUCT_BIBLE.md`
- **Kesin kararlar** → `DECISIONS.md`
- **Aktif işler** → `ROADMAP.md`
- **Onaylanmamış fikirler/varsayımlar** → `BACKLOG.md`
- **Teknik gerçek** → `TECHNICAL_CONTEXT.md`
- **Kaynak denetim/karar** → `docs/audits/`
- Çelişki halinde: gelir **ilkeleri** için bu dosya; gelir **kararları** için DECISIONS; gelir **işleri** için ROADMAP esas alınır. Bu doküman diğer core belgelerle çelişmez.

## 16. Bakım Kuralları
- Bu dosya yalnızca gelir ilkelerini içerir.
- Yeni sprint işleri buraya yazılmaz.
- Yeni kararlar buraya yazılmaz; `DECISIONS.md`'ye eklenir.
- Fiyat değişiklikleri ilke değişikliği değilse bu dosya güncellenmez.
- Yeni premium özellik ancak `PRODUCT_BIBLE` ve `DECISIONS` ile uyumluysa buraya eklenebilir.

## 17. Değişiklik Özeti
- **Oluşturuldu:** MONETIZATION_BIBLE ilk sürümü.
- **Kaynak:** Yalnızca `BLOOM_DENETIM_RAPORU.md` ve `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`.
- **Tutarlılık:** DECISIONS (DEC-001…DEC-004, DEC-007), PRODUCT_BIBLE (öncelik sırası, gelir felsefesi) ve BACKLOG (BL-001, BL-004, BL-007) ile hizalandı; çelişki yok.
- **Kapsam:** Kalıcı ilkeler yazıldı; sprint görevi/roadmap maddesi/karar üretilmedi. Streak Kalkanı, teslim edilmediği için premium değer olarak yazılmadı (DEC-002).
- **Revizyonlar (onaylı):** "Koddan doğrulanmış" ifadeleri "Teknik doğrulandı (bkz. TECHNICAL_CONTEXT.md)" olarak güncellendi; Gelir Modeli'ne Product ID teknik-referans notu eklendi; "Bakım Kuralları" bölümü (§16) eklendi.
- **2026-07-17 revizyonu:** §2, §11, §14, DEC-009 (Android artık paralel geliştiriliyor) ile tutarlı hale getirildi; hiçbir Android gelir rakamı/tarihi üretilmedi.
