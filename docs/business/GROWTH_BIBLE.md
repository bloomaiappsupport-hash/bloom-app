# BLOOM — GROWTH_BIBLE (Büyüme Anayasası)

> Bu doküman BLOOM'un büyümesinin **kalıcı ilkelerini** tutar. Deney takvimi, kampanya planı, sprint görevi veya roadmap maddesi burada yer almaz (onlar `ROADMAP.md`'de). Kaynak: `BLOOM_DENETIM_RAPORU.md`, `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`. Ürün ilkeleri `PRODUCT_BIBLE.md`'de, gelir ilkeleri `MONETIZATION_BIBLE.md`'de, pazarlama ilkeleri `MARKETING_BIBLE.md`'de, kesin kararlar `DECISIONS.md`'dedir; bu doküman onlarla çelişmez.

## 1. Amaç
BLOOM'un **nasıl büyüdüğünü ve hangi ilkelerle büyüdüğünü** tek bir kalıcı kaynaktan tanımlamak. Temel kural: büyüme, güvenin ve çekirdek deneyimin önüne asla geçemez (PRODUCT_BIBLE öncelik sırası: güven → çekirdek deneyim → retention → gelir → growth → yeni özellik). Growth bu zincirde en sondan ikinci halkadır; üst halkalar sağlam değilken büyütülen şey, sorunların kendisidir.

## 2. Growth'un Rolü
- Growth'un görevi trafik şişirmek değil, **çalışan çekirdek döngüyü daha fazla doğru kullanıcıya güvenilir biçimde ulaştırmaktır.**
- Pre-PMF aşamasında growth bir ölçekleme motoru değil, **doğrulama ve öğrenme** aracıdır (Karar Dokümanı: pre-PMF'te erken optimizasyon reddedilir).
- Güvenilmez bir ürünü büyütmek, güvensizliği büyütmektir: denetim raporunun tespitiyle, "özellik açısından zengin ama güvenilmez" bir ürünün büyütülmesi risktir. Growth ancak ürün dürüst çalışırken devreye girer.

## 3. Growth Öncelik Sırası
Tüm growth kararlarının referans sırası:

**güven → çekirdek deneyim → activation → retention → gelir → ölçekleme.**

- Alttaki bir halka, üstteki bir halkanın önüne asla geçmez.
- Örnek: activation akışı kopukken (denetim P1-12) trafik artırmak; retention motoru güvenilir değilken yeniden etkileşim baskısı kurmak; gelir kaçakları kapanmadan dönüşüm optimize etmek — hepsi sıralama ihlalidir ve reddedilir.
- Bu sıra, PRODUCT_BIBLE öncelik sırasının growth'a uyarlanmış halidir; onunla çelişmez.

## 4. Mevcut Ürün Aşaması
- **BLOOM şu an pre-PMF / lansman öncesi aşamadadır** (Karar Dokümanı bağlam tanımı). Solo geliştirici gerçekliği geçerlidir; her growth "evet"i başka bir işe "hayır"dır.
- İlk sürüm iOS-only'dir (DEC-001); growth kapsamı da yalnızca iOS'tur.
- Bu aşamada **ilk growth hedefi daha fazla trafik değil, çekirdek döngünün gerçek kullanıcıda çalıştığını doğrulamaktır.**
- Ürün henüz gelir/güven kaçakları kapanmamışken (ROADMAP v1.0.2 tamamlanmadan) hiçbir büyüme girişimi hızlandırılmaz.

## 5. Çekirdek Büyüme Döngüsü
- BLOOM'un büyümesi, ürünün çekirdek döngüsünün üzerine kuruludur: **alışkanlığı takip et → tamamla → seriyi koru → koçtan destek al → geri dön.** Bu döngüyü sürdüren kullanıcı, büyümenin hem kanıtı hem kaynağıdır.
- Kaynak dokümanlar BLOOM için referral, viral loop veya topluluk mekanizması tanımlamaz; bu doküman da üretmez. Böyle bir mekanizma ancak DECISIONS/ROADMAP sürecinden geçerek açılabilir.
- İlke: büyüme döngüsü, çekirdek deneyimden ayrı bir "growth katmanı" olarak inşa edilmez; çekirdek döngünün güvenilirliğinin doğal sonucu olarak görülür (Karar Dokümanı: "onu güvenilir kılmak yeni özellikten değerli").

## 6. Aktivasyon İlkeleri
- Aktivasyon, tüm gelirin ve büyümenin önkoşuludur: "kaydolamayan kullanıcı premium'a hiç ulaşamaz — funnel'ın en üstü" (Karar Dokümanı §5/№3).
- İlke: kullanıcı kayıttan ilk değere **sessizlik ve belirsizlik olmadan** ulaşmalıdır. Kayıt anındaki sessizlik (denetim P1-12: "en kritik dönüşüm anında sessizlik") bir aktivasyon ihlalidir; giderilmesi ROADMAP T-009'da izlenir.
- Aktivasyon dili kullanıcının dilindedir; ilk temas yüzeylerinde dil karışıklığına izin verilmez (MARKETING_BIBLE §8 ile ortak ilke).
- Aktivasyonun tanımı ilke düzeyindedir: kullanıcı sorunsuz aktive olur (kayıt → ilk değer) (PRODUCT_BIBLE §17). Sayısal aktivasyon hedefleri `KPI.md`'ye aittir.

## 7. Retention İlkeleri
- Retention, BLOOM'un büyüme modelinin merkezidir: ürün süreklilik üzerine kuruludur ve başarı, kullanıcının çekirdek döngüyü sürdürmesidir (PRODUCT_BIBLE §17).
- Retention mekanikleri **güvenilir olmalıdır**: streak yanlış sayıyorsa güven gider (denetim P2-13 tespiti). Retention'ı artırmadan önce retention mekaniğinin doğruluğu gelir.
- Retention araçları destekleyicidir, baskıcı değildir: hatırlatıcı bildirimler ve koç, kullanıcının yanında duran araçlardır; suçlayan, korkutan veya zorlayan araçlar değildir (§11, §12).
- Retention'a dair her davranışsal yorum, veri gelene kadar **hipotezdir** (BL-004; denetim raporu: "dönüşüm/retention yorumları veri olmadan hipotezdir").

## 8. Monetizasyon ile Growth İlişkisi
- **Önce kaçağı durdur, sonra büyüt:** yeni gelir "kazanmadan" önce sızan gelir durdurulur (MONETIZATION_BIBLE §10; Karar Dokümanı §5/№1). Gelir güvenliği sağlanmadan dönüşüm büyütme girişimi yapılmaz.
- Growth, MONETIZATION_BIBLE'ın hiçbir ilkesini esnetemez: dürüst paywall, teslim edilen özellik, sunucu-doğrulanmış yetki ilkeleri growth baskısıyla delinemez.
- "Aynı trafiği daha iyi paraya çevirmek" (paywall lokalizasyonu, aktivasyon tamiri — Karar Dokümanı §5) trafiği artırmaktan önce gelir; bu, growth öncelik sırasının (§3) doğal sonucudur.
- Paywall zamanlaması / soft-paywall denemeleri pre-PMF'te bilinçle ertelenmiştir (BL-001); growth bu ertelemeyi geçersiz kılamaz.

## 9. Organik Büyüme İlkeleri
- Pre-PMF'te büyüme **organik ve sahip olunan kanallarla** sınırlıdır (MARKETING_BIBLE §14 ile ortak ilke).
- Kaynaklarda doğrulanmış tek organik kaldıraç: **lokalize App Store metadata + TR/EN ekran görüntüleri** — "kod değişikliği sıfır; organik indirmede en yüksek kaldıraç" (Karar Dokümanı §5/№4; ilgili iş ROADMAP T-010'da izlenir).
- Organik büyümenin temeli dürüst temsildir: mağazada ve her yüzeyde gösterilen şey, ürünün teslim ettiği gerçektir (MARKETING_BIBLE §13 tutarlılık ilkesi).
- Kaynaklarda olmayan kanal, referral, viral loop, topluluk veya reklam stratejisi bu dokümanda tanımlanmaz; önerilirse önce BACKLOG/DECISIONS sürecine girer.

## 10. App Store Growth İlkeleri
- App Store varlığı, pre-PMF'in birincil büyüme yüzeyidir (§9).
- **Lokalizasyon esastır:** metadata ve ekran görüntüleri TR/EN eşdeğer hazırlanır; metadata ile ürün içi gerçeklik birebir tutarlıdır (MARKETING_BIBLE §13; Guideline 2.3.1).
- Mağaza uyumluluğu bir growth varlığıdır: red riski taşıyan her şey (teslim edilmeyen özellik, dil tutarsızlığı, kırık satın alma) büyümenin de blokeridir — "red = sıfır gelir" (Karar Dokümanı K4).
- Kapsam iOS'tur (DEC-001); Play Store growth çalışması yapılmaz (bkz. §17).
- Yorum/puan manipülasyonu yapılmaz; organik değerlendirme dürüst deneyimin sonucudur.

## 11. Bildirim ve Yeniden Etkileşim İlkeleri
- Bildirimler ürünün retention motorudur (denetim P1-10 tespiti) — ama **destek aracıdır, baskı aracı değildir.**
- Bildirim dili marka karakteriyle aynıdır: baskı yapmadan hatırlatan, küçük ilerlemeyi kutlayan, suçlamayan (PRODUCT_BIBLE §7–8).
- Bildirim izni, kullanıcıya değer gösterildikten sonra ve "neden" açıklanarak istenir (denetim UX önerisi: "bildirim iznini değerden sonra iste, 'neden' mesajını güçlendir").
- Yasak: korku, suçluluk, utanç veya kayıp korkusu üzerinden yeniden etkileşim; aşırı sıklıkta bildirim baskısı; kullanıcının kapatma/reddetme hakkını zorlaştırmak.
- Kapsam gerçeği: bildirimler yerel ve alışkanlık başınadır (TECHNICAL_CONTEXT §10); var olmayan bir push/yeniden etkileşim altyapısı growth planına yazılmaz.

## 12. AI Koçun Growth İçindeki Rolü
- Koç, ürünün çekirdek değerinin bir ayağıdır ve premium'un ana çekicilerinden biridir (Karar Dokümanı: "koç = premium çekicisi"). Growth içindeki rolü budur: **değer üreterek** kullanıcıyı geri getirmek.
- Koç, kullanıcıyı ürüne zorla bağlayan, bağımlılık kurgulayan veya manipüle eden bir mekanizma olarak **tanımlanamaz ve tasarlanamaz.** Karakteri destekleyicidir; sınırları bellidir (yalnızca alışkanlık, motivasyon, süreklilik bağlamı — MARKETING_BIBLE §11).
- Koç deneyiminin güvenilirliği growth'tan önce gelir: yanlış retler (denetim P1-9) çekirdek değeri erozyona uğratır; bu tür sorunların giderilmesi her koç-temelli büyüme fikrinden önceliklidir (ROADMAP T-013'te izlenir).
- Ücretsiz kademedeki koç erişimi (günde 3 mesaj) dürüst bir "gerçek tat" mekanizmasıdır (MONETIZATION_BIBLE §8); yapay kısıtlarla suni acıya çevrilmez.

## 13. Free ve Premium Growth İlkeleri
- Ücretsiz plan büyümenin girişidir: kendi başına değerlidir ve çekirdek döngüyü gerçekten yaşatır (MONETIZATION_BIBLE §3). Ücretsiz deneyimi kasıtlı kötüleştirerek dönüşüm zorlamak yasaktır.
- Free→Premium geçişi, teslim edilen değerin dürüst gösterimiyle olur; growth, premium listesine tek bir teslim edilmemiş vaat ekleyemez (DEC-002 emsali).
- Premium dönüşümüne dair her varsayım, veri gelene kadar hipotezdir (BL-004).
- Habit Stacks ve Habit DNA, kullanım verisiyle öncelikleri doğrulanmadan (BL-002, BL-003) **büyüme motoru kabul edilmez** ve growth anlatısının merkezine konmaz.
- Streak Kalkanı hiçbir growth veya retention aracı olarak kullanılamaz (DEC-002 — teslim edilmemiştir).

## 14. Deney ve Hipotez İlkeleri
- **A/B testleri ve growth deneyleri, yeterli kullanıcı hacmi olmadan anlamsızdır ve ertelenir** (Karar Dokümanı §5 bilinçli ret; BL-001).
- Her growth fikri bir hipotez olarak doğar ve BACKLOG disipliniyle işaretlenir (🟢/🟡/🟠/🔴 kanıt seviyeleri); doğrulanmadan üzerine yapı kurulmaz (BL-004 ilkesi: "bu varsayımlar doğrulanmadan üzerlerine yeni özellik inşa edilmez").
- Deney yapılabilir hale gelindiğinde bile sıralama korunur: deney, güveni veya çekirdek deneyimi riske atamaz (§3).
- Deney takvimi ve somut deney planları bu dosyaya yazılmaz; aktifleşen işler ROADMAP'e aittir.

## 15. Veri ve Ölçüm İlkeleri
- **Growth başarısı yalnızca indirme sayısıyla değerlendirilmez.** Başarı: kullanıcının sorunsuz aktive olması, çekirdek döngüyü tamamlaması ve geri dönmesidir (PRODUCT_BIBLE §17).
- Hedef kullanıcı, activation, retention, dönüşüm ve monetizasyon hakkındaki tüm yorumlar, gerçek kullanım verisi gelene kadar **hipotezdir** ve öyle işaretlenir (BL-004, BL-005; denetim "Belirsizlik Özeti").
- Somut sayısal hedefler bu dosyaya yazılmaz; onlar `docs/business/KPI.md`'ye aittir. KPI.md şu an placeholder'dır — hazırlanana kadar hiçbir sayı veya hedef uydurulmaz.
- Mevcut teknik gerçek: üründe analitik/hata izleme altyapısı henüz yoktur (TECHNICAL_CONTEXT §16 — Sentry vb. yok). Ölçüme dayalı growth iddiası, ölçüm altyapısı kurulmadan yapılamaz.
- Ölçüm dürüstlüğü esastır: veri, hipotezi doğrulamak için toplanır; anlatıyı süslemek için seçilmez.

## 16. Güven ve Etik Sınırlar
- Güveni yakan hiçbir büyüme kazancı kabul edilmez (PRODUCT_BIBLE §16).
- MONETIZATION_BIBLE §12 ve MARKETING_BIBLE §16 yasak setleri growth'ta da aynen geçerlidir.
- Kullanıcının verisi ve gizliliği growth amacıyla istismar edilmez; gereksiz izin istenmez (PRODUCT_BIBLE §5; denetimde olumlu bulgu: kişiler/takvim izinleri açıkça engellenmiş).
- Growth baskısı, ürün karakterini değiştiremez: sakin, dürüst, destekleyici ton her büyüme yüzeyinde korunur.

## 17. Yasaklanan Growth Yaklaşımları
Aşağıdakiler BLOOM'da **kesinlikle kullanılmaz**:

- Dark pattern'ler: sahte kıtlık, sahte geri sayım, sahte istatistik, sahte sosyal kanıt, onay-shaming.
- Zorlayıcı bildirim, korku/suçluluk/utanç temelli yeniden etkileşim, agresif re-engagement baskısı.
- Kullanıcıyı manipüle eden bağımlılık kurguları; koçun manipülatif kullanımı (§12).
- Teslim edilmeyen özellikle büyüme anlatısı kurmak (Streak Kalkanı dahil — DEC-002).
- **Android büyüme/lansman vaadi veya kampanyası** — Android artık aktif geliştirme kapsamındadır (DEC-009, ROADMAP T-021), ancak bu bir growth/launch taahhüdüne çevrilemez. Android'e yönelik growth çalışması (kampanya, kanal açma, lansman iletişimi) Android teslim edilip doğrulanana kadar başlatılmaz — "önce teslim, sonra büyüme" ilkesi.
- Ücretsiz deneyimi kasıtlı sakatlayarak dönüşüm zorlamak.
- Yorum/puan/indirme manipülasyonu.
- Pre-PMF'te ücretli büyüme harcaması, kanal ölçekleme ve A/B denemeleri (bilinçli erteleme — §14, §18).
- İndirme sayısını tek başarı ölçütü olarak kullanmak (§15).

## 18. PMF Öncesi Growth Stratejisi
- **İlk hedef trafik değil, doğrulamadır:** çekirdek döngünün (takip → tamamla → seri → koç → geri dönüş) gerçek kullanıcıda çalıştığını ve değer ürettiğini doğrulamak.
- Sıralama nettir: önce ürün güvenilir ve dürüst çalışır (ROADMAP v1.0.2 gelir/güvenlik, v1.0.3 aktivasyon/dönüşüm), sonra büyüme optimize edilir (PRODUCT_BIBLE §14).
- Pre-PMF growth araç seti bilinçli olarak dardır: dürüst ve lokalize App Store varlığı (§9–10), çalışan aktivasyon akışı (§6), güvenilir retention mekanikleri (§7) ve hipotez doğrulayacak sinyal toplama (§15).
- Ölçekleme işleri (ücretli kanal, kampanya, deney programı) bu aşamada birer dikkat dağıtıcıdır ve ertelenir (PRODUCT_BIBLE §14 ile birebir uyumlu).

## 19. PMF Sonrası Genişleme İlkeleri
Aşağıdakiler yalnızca PMF sonrası ve veriyle değerlendirilir; şu an taahhüt değildir:

- Ücretli büyüme ve kanal ölçekleme denemeleri.
- A/B testleri ve paywall zamanlaması dahil dönüşüm optimizasyonları (BL-001).
- (Bu madde 2026-07-17'de kaldırıldı: Android artık PMF-sonrası koşullu bir madde değildir; DEC-009 ile aktif geliştirme kapsamına alındı — bkz. §17, ROADMAP T-021.)
- Hipotezlerin (BL-004, BL-005) doğrulanmış veriye dönüşmesiyle growth modelinin netleştirilmesi.
- **İlke:** Genişleme sıralaması asla bozulmaz: güven → çekirdek deneyim → activation → retention → gelir → ölçekleme.

## 20. Doküman Sistemi
- **Büyüme ilkeleri** → **bu dosya (`GROWTH_BIBLE.md`)**
- **Ürün ilkeleri** → `PRODUCT_BIBLE.md`
- **Gelir ilkeleri** → `MONETIZATION_BIBLE.md`
- **Pazarlama ilkeleri** → `MARKETING_BIBLE.md`
- **Kesin kararlar** → `DECISIONS.md`
- **Aktif işler** → `ROADMAP.md` (örn. T-009 aktivasyon, T-010 metadata)
- **Onaylanmamış fikirler/varsayımlar** → `BACKLOG.md`
- **Teknik gerçek** → `TECHNICAL_CONTEXT.md`
- **Sayısal hedefler** → `docs/business/KPI.md` (şu an placeholder)
- **Kaynak denetim/karar** → `docs/audits/`
- Çelişki halinde: büyüme **ilkeleri** için bu dosya; ürün ilkeleri için PRODUCT_BIBLE; gelir ilkeleri için MONETIZATION_BIBLE; pazarlama ilkeleri için MARKETING_BIBLE; kararlar için DECISIONS esas alınır. Bu doküman diğer core belgelerle çelişmez.

## 21. Bakım Kuralları
- Bu dosya yalnızca kalıcı büyüme ilkelerini içerir.
- Deney takvimi, kampanya planı veya sprint işi buraya yazılmaz.
- Yeni kararlar buraya yazılmaz; `DECISIONS.md`'ye eklenir.
- Yeni bir growth mekanizması (kanal, referral, viral loop, topluluk vb.) ancak BACKLOG/DECISIONS sürecinden geçip onaylandıktan sonra ilke düzeyinde buraya yansıtılabilir.
- Hipotez işaretli konular veri geldikçe güncellenir; hipotez → doğrulanmış geçişi kaynak gösterilerek yapılır.
- Sayısal hedefler hiçbir revizyonda bu dosyaya taşınmaz; `KPI.md`'de tutulur.

## 22. Değişiklik Özeti
- **Oluşturuldu:** GROWTH_BIBLE ilk sürümü.
- **Kaynak:** Yalnızca `BLOOM_DENETIM_RAPORU.md` ve `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`; ilke tutarlılığı için PRODUCT_BIBLE, MONETIZATION_BIBLE, MARKETING_BIBLE, DECISIONS, ROADMAP, BACKLOG, TECHNICAL_CONTEXT ile hizalandı.
- **Kapsam:** Kalıcı ilkeler yazıldı; deney takvimi, kampanya planı, sprint görevi, roadmap maddesi veya yeni büyüme stratejisi (kanal/referral/viral loop/topluluk/reklam) üretilmedi.
- **Dürüstlük sınırları:** Pre-PMF aşaması ve "önce doğrulama, sonra trafik" hedefi sabitlendi; growth sırası (güven → çekirdek deneyim → activation → retention → gelir → ölçekleme) tanımlandı; Streak Kalkanı growth/retention aracı olarak kullanılmadı (DEC-002); Android büyümesi vaat edilmedi (DEC-001, DEC-007); Habit Stacks/Habit DNA büyüme motoru kabul edilmedi (BL-002, BL-003); retention/dönüşüm/kullanıcı davranışı yorumları hipotez olarak işaretlendi (BL-004, BL-005); KPI.md placeholder olduğu için hiçbir sayısal hedef yazılmadı.
- **2026-07-17 revizyonu:** §17, §19, DEC-009 ile tutarlı hale getirildi; Android growth çalışmasının hâlâ "teslim sonrası" başladığı netleştirildi.
