# BLOOM — MARKETING_BIBLE (Pazarlama Anayasası)

> Bu doküman BLOOM'un pazarlamasının **kalıcı ilkelerini** tutar. Kampanya takvimi, sprint görevi veya roadmap maddesi burada yer almaz (onlar `ROADMAP.md`'de). Kaynak: `BLOOM_DENETIM_RAPORU.md`, `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`. Ürün ilkeleri `PRODUCT_BIBLE.md`'de, gelir ilkeleri `MONETIZATION_BIBLE.md`'de, kesin kararlar `DECISIONS.md`'dedir; bu doküman onlarla çelişmez.

## 1. Amaç
BLOOM'un dışarıya **ne söylediğini ve hangi ilkelerle söylediğini** tek bir kalıcı kaynaktan tanımlamak. Temel kural: pazarlama, ürünün teslim ettiği gerçeğin önüne geçemez. PRODUCT_BIBLE öncelik sırası burada da geçerlidir (güven → çekirdek deneyim → retention → gelir → growth → yeni özellik); pazarlama bu zincirde güvene hizmet eder, güveni harcayamaz.

## 2. Pazarlama Rolü
- Pazarlamanın görevi talep uydurmak değil, **var olan çekirdek değeri doğru kullanıcıya doğru dille anlatmaktır.**
- Pre-PMF aşamasında pazarlama, büyüme motoru değil **öğrenme ve dürüst tanıtım** aracıdır (Karar Dokümanı: pre-PMF'te erken optimizasyon reddedilir).
- Pazarlama hiçbir zaman ürünün önünden koşmaz: reklamı yapılan her şey kodda çalışıyor olmalıdır (PRODUCT_BIBLE §5; DEC-002 emsali).

## 3. Ürün Konumlandırması
- BLOOM bir **alışkanlık koçu uygulamasıdır**: alışkanlık takibi + yapay zeka koçu + süreklilik (streak). Üç ayak birlikte anlatılır; BLOOM yalnızca bir "alışkanlık takipçisi" olarak daraltılmaz, genel amaçlı bir AI sohbet uygulaması olarak da genişletilmez.
- Karakter: sakin, destekleyici, dürüst; bağırmayan, suçlamayan, abartılı motivasyon klişesi kurmayan bir koç (PRODUCT_BIBLE §7).
- Rakip konumlandırması kopyalanmaz; "rakip böyle anlatıyor" tek başına mesaj gerekçesi olamaz (PRODUCT_BIBLE §13).
- Kapsam dışı konumlandırmalar: proje/görev yönetimi aracı, genel AI asistanı, klinik/terapötik sağlık ürünü, ceza temelli disiplin aracı (PRODUCT_BIBLE §11).

## 4. Hedef Kullanıcı Hipotezi *(🟡 hipotez — kullanıcı verisiyle doğrulanmalı)*
Kendini geliştirmek isteyen; fitness, zihinsel iyilik, kariyer veya kişisel gelişim alanlarında alışkanlık kurmakta zorlanan bireyler. Ana engelleri: motivasyon, zaman, unutma ve zorluk algısı. Bu profil uygulamanın kendi değerlendirme akışından türetilmiş bir **hipotezdir** (PRODUCT_BIBLE §10, BACKLOG BL-005); doğrulanana kadar pazarlama bu profile "kesin pazar" muamelesi yapmaz ve segment bazlı iddialı hedefleme kurmaz.

## 5. Temel Kullanıcı Problemi
"Büyük hedefler koyup sürdürememek": motivasyonun düşmesi, unutmak ve alışkanlığın zor görünmesi. BLOOM'un cevabı büyük irade değil, **küçük ve sürdürülebilir günlük adımlar + yanında bir koç hissi**dir (PRODUCT_BIBLE §2, §12). Pazarlama problemi abartarak dramatize etmez; kullanıcıyı suçlayan "sen tembelsin" tipi bir problem dili kullanılmaz (marka karakteriyle çelişir).

## 6. Temel Değer Önerisi
"Alışkanlıklarını takip et, bir yapay zeka koçuyla motive ol, süreklilikle kalıcı hale getir." (PRODUCT_BIBLE §12 ile birebir aynı; pazarlama bu cümleyi yeniden icat etmez, uyarlar.) Vaat edilen şey **süreç ve eşlik**tir; garanti edilmiş sonuç değildir (bkz. §10).

## 7. Mesajlaşma Hiyerarşisi
Mesajlar her zaman şu sırayla kurulur:

1. **Çekirdek döngü:** takip et → tamamla → seriyi koru → koçtan destek al. (Ana mesaj; her kanalda önce bu.)
2. **Koç deneyimi:** alışkanlık, motivasyon ve süreklilik bağlamında konuşan bir AI koç — sınırlarıyla birlikte (bkz. §11).
3. **Süreklilik/ilerleme görünürlüğü:** streak ve ilerleme.
4. **Destekleyici öğeler:** hatırlatıcılar, içgörüler.

Önceliği doğrulanmamış alanlar (Habit Stacks, Habit DNA — BACKLOG BL-002, BL-003) hiyerarşinin üstüne çıkarılmaz; ana pazarlama vaadi yapılmaz, en fazla ikincil özellik olarak, teslim edilen haliyle anılabilir.

## 8. Marka Dili ve Tonu
- Kısa, samimi, pratik, empatik; boş motivasyon cümlesi yerine somut ve nazik yönlendirme (PRODUCT_BIBLE §8).
- Ton her temas noktasında aynıdır: uygulama içi koç, paywall, bildirim, App Store metni ve pazarlama içeriği aynı sesle konuşur.
- TR/EN tam eşdeğerlik: hiçbir pazarlama yüzeyinde dil karışıklığına izin verilmez (denetim P1-6 bulgusunun ilkesel dersi; uygulanması ROADMAP v1.0.3'te izlenir).
- Bağırmayan dil: büyük vaatler, ünlem yağmuru, suçlayıcı veya baskıcı ifadeler kullanılmaz.

## 9. İzin Verilen Pazarlama İddiaları
Yalnızca kodda doğrulanmış gerçeklere dayanan iddialar (TECHNICAL_CONTEXT referanslı):

- Alışkanlık oluşturma ve takip; günlük tamamlama; streak/süreklilik takibi.
- Alışkanlık, motivasyon ve süreklilik bağlamında konuşan AI koç sohbeti.
- Alışkanlık başına yerel hatırlatıcı bildirimler (iOS).
- Haftalık AI içgörü raporu (premium).
- TR/EN dil desteği.
- Ücretsiz planın gerçek değer verdiği (3 alışkanlık, günde 3 koç mesajı — MONETIZATION_BIBLE §3).
- Gizlilik duruşu: gereksiz izin istenmez (kişiler/takvim açıkça engellenmiş — denetim "Güçlü Yönler").

## 10. Yasaklanan Pazarlama İddiaları
- **Garanti edilmiş sonuç yok:** "X günde alışkanlık garantisi", kesin davranış değişimi, sağlık/başarı sonucu vaadi yasaktır.
- **Sağlık/terapi iması yok:** BLOOM terapi, klinik tedavi veya profesyonel sağlık desteği olarak sunulamaz (PRODUCT_BIBLE §11).
- **İnsan koç iması yok:** koç bir yapay zekadır; insan koç, uzman veya terapist gibi sunulamaz.
- **Teslim edilmeyen özellik yok:** Streak Kalkanı hiçbir pazarlama yüzeyinde değer önerisi veya premium özellik olarak kullanılamaz (DEC-002). Bu kural gelecekte tüm teslim edilmemiş özellikler için emsaldir.
- **Android taahhüt/tarih vaadi yok:** Android artık aktif geliştirme kapsamındadır (DEC-009), ancak bu durum bir çıkış tarihi, "yakında Android" veya kullanılabilirlik taahhüdüne çevrilemez. Android yalnızca teslim edilip doğrulandığında iletişime girer (§11 "Önce teslim, sonra tanıtım"; TECHNICAL_CONTEXT §18).
- **Uydurma sayı yok:** doğrulanmamış kullanıcı sayısı, başarı oranı, retention/dönüşüm istatistiği veya "bilimsel kanıtlı" iddiası kullanılmaz.
- **Sahte sosyal kanıt yok:** uydurma yorum, uydurma puan, sahte referans yasaktır.

## 11. Özellik İletişimi İlkeleri
- **Önce teslim, sonra tanıtım:** bir özellik ancak kodda çalışır ve doğrulanmış durumdaysa iletişime girer (PRODUCT_BIBLE §5; TECHNICAL_CONTEXT §18 doğrulama kuralıyla uyumlu).
- **AI koç sınırlarıyla anlatılır:** koç yalnızca alışkanlık, motivasyon ve süreklilik bağlamında konuşur; genel amaçlı asistan gibi tanıtılmaz. Ücretsiz kademede günlük mesaj sınırı olduğu gizlenmez.
- **Streak dürüst anlatılır:** süreklilik bir motivasyon aracıdır; ceza veya baskı aracı olarak pazarlanmaz.
- **Habit Stacks / Habit DNA:** kullanım verisiyle önceliği doğrulanana kadar (BL-002, BL-003) ana vaat yapılmaz; anılacaksa mevcut, teslim edilen davranışıyla sınırlı anlatılır.
- Bir özellik üründen kaldırılırsa, pazarlama yüzeylerinden de aynı anda kaldırılır.

## 12. Free ve Premium İletişimi
- Ücretsiz plan "deneme kısıtı" gibi değil, **kendi başına değerli** olarak anlatılır (MONETIZATION_BIBLE §3).
- Premium, yalnızca **gerçekten teslim edilen** genişletmelerle anlatılır: sınırsız alışkanlık, sınırsız AI koç mesajı, haftalık AI raporu, detaylı Habit DNA, Habit Stacks (MONETIZATION_BIBLE §4). Bu liste MONETIZATION_BIBLE ile birebir senkron tutulur; pazarlama kendi premium listesi üretmez.
- Free→Premium anlatısı dürüst karşılaştırmadır: ücretsizin değeri küçültülmez, premium'un değeri şişirilmez.
- Fiyat iletişimi mağaza fiyatına dayanır; sahte indirim veya yanıltıcı karşılaştırma kullanılmaz (MONETIZATION_BIBLE §6, §12).

## 13. App Store İletişimi
- **Tutarlılık ilkesi:** App Store metinleri, ekran görüntüleri ve uygulama içi gerçeklik birebir tutarlıdır. Mağazada gösterilen hiçbir şey üründe eksik olamaz (Guideline 2.3.1; DEC-002 emsali).
- **Kapsam:** İlk sürüm iOS-only'dir (DEC-001); mağaza iletişimi yalnızca iOS'u kapsar.
- **Lokalizasyon:** metadata ve ekran görüntüleri TR/EN eşdeğer hazırlanır (ilke burada kalıcıdır; işi ROADMAP T-010'da izlenir). Metadata dili ile ürün içi dil tutarlıdır — "EN metadata + TR ekran" tutarsızlığına izin verilmez (denetim P1-6 dersi).
- Lokalize App Store metadata'sı, kod değişikliği gerektirmeyen en yüksek organik kaldıraç olarak kabul edilir (Karar Dokümanı §5/№4) — ama bu bir ilkedir, kampanya taahhüdü değildir.
- Abonelik şeffaflığı (otomatik yenileme, fiyat/dönem, EULA, gizlilik bağlantıları) mağaza ve paywall iletişiminin ayrılmaz parçasıdır.

## 14. Kanal İlkeleri
Kaynak dokümanlar kanal stratejisi tanımlamaz; bu doküman da yeni kanal stratejisi icat etmez. Kalıcı ilkeler:

- **Önce organik ve sahip olunan kanallar:** App Store varlığı (lokalize metadata + ekran görüntüleri) pre-PMF'in birincil kanalıdır — kaynaklarda doğrulanmış tek kanal kaldıracı budur.
- Ücretli büyüme, PMF ve veri olmadan ölçeklenmez (§17 ile uyumlu).
- Hangi kanalda olursa olsun tüm mesajlar bu anayasanın iddia (§9–10) ve ton (§8) kurallarına tabidir.
- Kanal önerileri karar değildir; yeni kanal işi ancak DECISIONS/ROADMAP sürecinden geçerek açılır.

## 15. İçerik İlkeleri
- İçerik, marka karakterinin uzantısıdır: sakin, dürüst, pratik; küçük ilerlemeyi kutlayan, baskı kurmayan.
- İçerik somut ve nazik yönlendirme verir; boş motivasyon klişesi üretmez (PRODUCT_BIBLE §8).
- İçerikte ürün ekranı/özelliği gösteriliyorsa, gösterilen şey ürünün güncel gerçeğidir; konsept/maket görsel "gerçek ürün" gibi sunulmaz.
- Sağlık, psikoloji ve davranış bilimi konularında kesinlik iddiası kurulmaz; BLOOM içerikte de sağlık ürünü gibi konuşmaz.
- TR/EN içerik eşdeğerliği gözetilir.

## 16. Güven ve Etik İlkeleri
MONETIZATION_BIBLE §12 ile ortak yasak seti pazarlamada da geçerlidir:

- Dark pattern yok: sahte kıtlık, sahte geri sayım, sahte indirim, sahte istatistik, onay-shaming yok.
- Yanıltıcı vaat, abartılı sonuç, sahte sosyal kanıt yok.
- Korku, utanç veya suçluluk üzerinden pazarlama yapılmaz; ürün karakteri destekleyicidir, cezalandırıcı değildir.
- Kullanıcı verisi pazarlama amacıyla istismar edilmez; gizlilik duruşu pazarlama mesajıyla tutarlıdır.
- Güveni yakan hiçbir büyüme kazancı kabul edilmez (PRODUCT_BIBLE §16).

## 17. PMF Öncesi Pazarlama Stratejisi
- **Hedef "daha çok indirme" değil, "doğru kullanıcıya dürüst tanıtım + öğrenme"dir.** Başarı, kullanıcının çekirdek döngüyü sürdürmesidir (PRODUCT_BIBLE §17).
- Pre-PMF'te ölçekli kampanya, agresif büyüme harcaması ve pazarlama A/B denemeleri **bilinçle ertelenir** — kullanıcı hacmi olmadan anlamsızdır (Karar Dokümanı §5 bilinçli ret; BL-001 emsaliyle aynı mantık).
- Pazarlamanın pre-PMF odağı: App Store varlığını dürüst ve lokalize kurmak; hedef kullanıcı hipotezini (§4) doğrulayacak sinyal toplamak.
- Ürün henüz güvenilir değilken (gelir/güven kaçakları kapanmadan) tanıtım hızlandırılmaz: pazarlama, ROADMAP v1.0.2'nin önüne geçmez.

## 18. PMF Sonrası Genişleme İlkeleri
Aşağıdakiler yalnızca PMF sonrası ve veriyle değerlendirilir; şu an taahhüt değildir:

- Ölçekli/ücretli kanal denemeleri ve pazarlama optimizasyonları.
- (Bu madde 2026-07-17'de kaldırıldı: Android artık PMF-sonrası koşullu bir madde değildir; DEC-009 ile aktif geliştirme kapsamına alındı — bkz. §10, ROADMAP T-021. Android pazarlama iletişimi yine de yalnızca teslim + doğrulama sonrası başlar.)
- Hipotezlerin (hedef kullanıcı, dönüşüm, retention — BL-004, BL-005) doğrulanmış veriye dönüşmesiyle mesajların keskinleştirilmesi.
- **İlke:** Genişleme sıralaması asla bozulmaz: güven → çekirdek → retention → gelir → growth.

## 19. Ölçüm ve Doğrulama İlkeleri
- Retention, dönüşüm ve kullanıcı davranışına dair her iddia, veri gelene kadar **hipotezdir** ve öyle işaretlenir (BL-004, BL-005; denetim raporu "dönüşüm/retention yorumları veri olmadan hipotezdir").
- Pazarlama mesajları doğrulanmamış varsayım üzerine inşa edilmez; bir hipotez doğrulanmadan mesaj "kanıtlanmış fayda" diline çevrilemez.
- Somut metrikler ve sayısal hedefler bu dosyaya yazılmaz; onlar `docs/business/KPI.md`'ye aittir (şu an placeholder — hazırlanana kadar sayısal hedef referansı verilmez).
- Ölçüm dürüstlüğü: pazarlama başarısı, indirme sayısıyla değil, aktive olan ve dönen kullanıcıyla değerlendirilir (PRODUCT_BIBLE §17 ilkesiyle uyumlu).

## 20. Doküman Sistemi
- **Pazarlama ilkeleri** → **bu dosya (`MARKETING_BIBLE.md`)**
- **Ürün ilkeleri** → `PRODUCT_BIBLE.md`
- **Gelir ilkeleri** → `MONETIZATION_BIBLE.md`
- **Kesin kararlar** → `DECISIONS.md`
- **Aktif işler** → `ROADMAP.md` (örn. T-010 App Store metadata işi)
- **Onaylanmamış fikirler/varsayımlar** → `BACKLOG.md`
- **Teknik gerçek** → `TECHNICAL_CONTEXT.md`
- **Kaynak denetim/karar** → `docs/audits/`
- Çelişki halinde: pazarlama **ilkeleri** için bu dosya; ürün ilkeleri için PRODUCT_BIBLE; gelir ilkeleri için MONETIZATION_BIBLE; kararlar için DECISIONS esas alınır. Bu doküman diğer core belgelerle çelişmez.

## 21. Bakım Kuralları
- Bu dosya yalnızca kalıcı pazarlama ilkelerini içerir.
- Kampanya, sprint işi veya takvim buraya yazılmaz.
- Yeni kararlar buraya yazılmaz; `DECISIONS.md`'ye eklenir.
- Yeni bir özellik pazarlama diline ancak teslim edilip doğrulandıktan sonra ve `PRODUCT_BIBLE`/`MONETIZATION_BIBLE` ile uyumluysa girer.
- Hipotez işaretli bölümler (§4, §19) veri geldikçe güncellenir; hipotez → doğrulanmış geçişi kaynak gösterilerek yapılır.
- Bir özellik üründen kaldırıldığında bu dosyadaki ilgili anlatım da aynı değişiklikte güncellenir.

## 22. Değişiklik Özeti
- **Oluşturuldu:** MARKETING_BIBLE ilk sürümü.
- **Kaynak:** Yalnızca `BLOOM_DENETIM_RAPORU.md` ve `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`; ilke tutarlılığı için PRODUCT_BIBLE, MONETIZATION_BIBLE, DECISIONS, ROADMAP, BACKLOG, TECHNICAL_CONTEXT ile hizalandı.
- **Kapsam:** Kalıcı ilkeler yazıldı; kampanya, sprint görevi, roadmap maddesi, yeni özellik, yeni hedef kitle veya yeni değer önerisi üretilmedi.
- **Dürüstlük sınırları:** Streak Kalkanı hiçbir yerde değer/premium özellik olarak kullanılmadı (DEC-002); Android vaadi verilmedi (DEC-001, DEC-007); hedef kullanıcı ve retention/dönüşüm iddiaları hipotez olarak işaretlendi (BL-004, BL-005); AI koç sınırlı ve dürüst çerçevede tanımlandı.
- **2026-07-17 revizyonu:** §10 ve §18, DEC-009 (Android artık paralel geliştiriliyor) ile tutarlı hale getirildi; tarih/taahhüt vermeme ilkesi korundu.
