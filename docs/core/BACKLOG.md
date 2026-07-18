# BLOOM — BACKLOG (Onaylanmamış Fikirler & Varsayımlar)

> Bu dosya henüz karara bağlanmamış fikirleri, doğrulanmamış varsayımları ve bilinçli ertelenen konuları tutar. Buradaki hiçbir madde bağlayıcı değildir. Kesin kararlar `DECISIONS.md`'de, aktif işler `ROADMAP.md`'de, teknik gerçek `TECHNICAL_CONTEXT.md`'dedir. Kaynak: `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`, `BLOOM_DENETIM_RAPORU.md`. Yeni fikir üretilmez.

## Kanıt Seviyeleri
- 🟢 **Doğrulandı** — gerçek kullanıcı verisi veya teknik doğrulama mevcut.
- 🟡 **Hipotez** — güçlü gerekçesi var ancak kullanıcı verisiyle doğrulanmadı.
- 🟠 **Varsayım** — ekip yorumu veya gözleme dayanıyor.
- 🔴 **Kanıt Yok** — yalnızca fikir seviyesinde.

---

## BL-001
- **Başlık:** Paywall zamanlaması / soft-paywall / erken monetizasyon optimizasyonu
- **Kategori:** Bilinçli Ertelenen
- **Açıklama:** Paywall'ın aha-moment sonrası açılması, soft-paywall veya A/B denemeleri. Karar dokümanı bunu pre-PMF'te erken optimizasyon sayıp bilinçle erteliyor; A/B testi kullanıcı hacmi olmadan anlamsız.
- **Kaynak:** Karar Dokümanı §5 (Bilinçli ret), §13 (PMF Öncelikleri)
- **Kanıt Seviyesi:** 🟡 Hipotez
- **Durum:** Ertelendi
- **Olası hedef sürüm:** PMF sonrası (belirsiz)
- **Not:** Önce mevcut paywall'ın dürüstlük ve lokalizasyon işleri (ROADMAP v1.0.3) tamamlanmalı.

## BL-002
- **Başlık:** Habit Stacks (rutinler) özelliğinin önceliği
- **Kategori:** Kullanıcı Verisi Gerekli
- **Açıklama:** Premium'a kilitli, ayrı tablo + ekran bakımı taşıyan bir özellik. Çekirdek için şart değil; kullanım verisi gelene kadar öne çıkarılmaması ve bakım yükünün sorgulanması öneriliyor.
- **Kaynak:** Karar Dokümanı §6 (Ürün Stratejisi), §9 (Gereksiz özellikler)
- **Kanıt Seviyesi:** 🟠 Varsayım
- **Durum:** Beklemede (veri gerekli)
- **Olası hedef sürüm:** Belirsiz
- **Not:** Bu bir kaldırma kararı değil; kullanım verisiyle değerlendirilecek öncelik sorusudur.

## BL-003
- **Başlık:** Habit DNA radar önceliği + "yeterli veri yok" durumu
- **Kategori:** Kullanıcı Verisi Gerekli
- **Açıklama:** Radar, 30 gün veri olmadan boş/yanıltıcı görünüyor. Önceliğinin düşürülmesi ve en azından "yeterli veri yok" durumunun eklenmesi öneriliyor.
- **Kaynak:** Karar Dokümanı §6 (Ürün Stratejisi)
- **Kanıt Seviyesi:** 🟠 Varsayım
- **Durum:** Beklemede (veri gerekli)
- **Olası hedef sürüm:** Belirsiz
- **Not:** Kaldırma değil; erken kullanıcıda değer üretimi için düşük öncelikli iyileştirme fikri.

## BL-004
- **Başlık:** Dönüşüm / retention / monetizasyon varsayımları
- **Kategori:** Doğrulanacak Varsayım
- **Açıklama:** Denetim ve karar dokümanındaki dönüşüm/retention/monetizasyon yorumları veri olmadan hipotezdir; kullanıcı testi ve analitikle doğrulanmalıdır.
- **Kaynak:** Karar Dokümanı "Belirsizlik Özeti"; Denetim Raporu "Belirsizlik Özeti / Doğrulanması gerekenler"
- **Kanıt Seviyesi:** 🟡 Hipotez
- **Durum:** Doğrulanacak
- **Olası hedef sürüm:** Sürekli (veri toplandıkça)
- **Not:** Bu varsayımlar doğrulanmadan üzerlerine yeni özellik inşa edilmez.

## BL-005
- **Başlık:** Hedef kullanıcı ve davranış varsayımları
- **Kategori:** Doğrulanacak Varsayım
- **Açıklama:** Ürünün hedef kullanıcı profili ve kullanıcı davranışına dair varsayımlar gerçek kullanım verisiyle doğrulanana kadar hipotezdir.
- **Kaynak:** Denetim Raporu "Belirsizlik Özeti" (Varsayımlar)
- **Kanıt Seviyesi:** 🟠 Varsayım
- **Durum:** Doğrulanacak
- **Olası hedef sürüm:** Belirsiz
- **Not:** Kullanıcı görüşmesi / analitik ile teyit edilmeli.

## BL-006
- **Başlık:** Streak mantığının sunucuya taşınması (yeniden değerlendirme)
- **Kategori:** Not Recommended (Yeniden Değerlendirme)
- **Açıklama:** Şu an ertelenmiş bir mimari iş; gerçek kullanıcıda streak bozulması gözlemlenirse tekrar değerlendirilmek üzere izlenir.
- **İlgili Karar:** DEC-006
- **Kaynak:** Karar Dokümanı §3 (Not Recommended); Denetim Raporu P2-13
- **Kanıt Seviyesi:** 🟡 Hipotez
- **Durum:** Koşullu (yeniden değerlendirme)
- **Olası hedef sürüm:** Belirsiz (gözlem sonrası)
- **Not:** Bağlayıcı "şimdi yapma" kararı DEC-006'dadır; bu kayıt yalnızca gelecekteki tetikleyiciyi izler.

## BL-007
- **Başlık:** Android tam destek (IAP + bildirim izni) (yeniden değerlendirme)
- **Kategori:** Roadmap'e Taşındı
- **Açıklama:** iOS-first karar gereği ertelenmiş Android satın alma ve bildirim izni işleri; Android talebi kanıtlanırsa tekrar değerlendirilir.
- **İlgili Karar:** DEC-007, DEC-009
- **Kaynak:** Karar Dokümanı §3 (Not Recommended), §7 (Roadmap notu); Denetim Raporu P0-4, P1-10
- **Kanıt Seviyesi:** 🟡 Hipotez (kullanıcı talebi kanıtı hâlâ yok; ancak proje sahibi kararı, kanıt koşulunu geçersiz kılarak bu maddeyi ROADMAP'e taşıdı — bkz. Not)
- **Durum:** Roadmap'e Taşındı (2026-07-17) — tetikleyici artık "talep kanıtlanması" değil, doğrudan proje sahibi kararı (DEC-009). ROADMAP T-021'e taşındı.
- **Olası hedef sürüm:** v1.1.0 (bkz. ROADMAP T-021)
- **Not:** Erteleme kararı DEC-009 ile revize edildi; bağlayıcı güncel karar DEC-009'dur. Bu kayıt izlenebilirlik için korunuyor (silinmedi).

## BL-008
- **Başlık:** Edge Function CORS daraltması (yeniden değerlendirme)
- **Kategori:** Not Recommended (Yeniden Değerlendirme)
- **Açıklama:** `Access-Control-Allow-Origin: '*'` daraltması düşük riskli olduğundan ertelenmiş; koşullar değişirse tekrar değerlendirilir.
- **İlgili Karar:** DEC-008
- **Kaynak:** Karar Dokümanı §3 (Not Recommended / ertele); Denetim Raporu P2-16
- **Kanıt Seviyesi:** 🟠 Varsayım
- **Durum:** Koşullu (yeniden değerlendirme)
- **Olası hedef sürüm:** Belirsiz
- **Not:** Bağlayıcı erteleme kararı DEC-008'dedir.

---

## Backlog Kuralları
- **Yalnızca onaylanmamış maddeler:** Buraya hipotezler, doğrulanacak varsayımlar, bilinçli ertelenen fikirler ve Not Recommended kararlarından gelecekte yeniden değerlendirilebilecek maddeler girer.
- **Bağlayıcı değildir:** Backlog maddeleri bir taahhüt değildir; sıralama veya sürüm garantisi vermez.
- **Benzersiz ID:** Her madde sıradaki `BL-XXX` ID'sini alır; ID'ler yeniden kullanılmaz.
- **Yeni fikir üretilmez:** Yalnızca kaynak dokümanlardaki (karar dokümanı + denetim raporu) maddeler girer.
- **Kaynak ve kanıt zorunlu:** Her madde bir kaynağa bağlanır ve bir kanıt seviyesiyle (🟢/🟡/🟠/🔴) işaretlenir.
- **Kapsam ayrımı:** ROADMAP'e giren kesin işler ve DECISIONS'a giren bağlayıcı kararlar buraya alınmaz; teknik doğrulama maddeleri `TECHNICAL_CONTEXT` §17'de tutulur.
- **Kanıt yükseltme:** Bir madde veri/kullanıcı testiyle doğrulandıkça kanıt seviyesi güncellenir (örn. 🟠 → 🟡 → 🟢).
- **Durum yaşam döngüsü:** Bir madde ROADMAP'e geçtiğinde "Roadmap'e Taşındı", geçersiz kaldığında "Kapandı" olarak işaretlenir; kayıt hiçbir durumda silinmez (izlenebilirlik korunur).

## Durum Tanımları
- **Ertelendi:** Bilinçle sonraya bırakıldı.
- **Beklemede (veri gerekli):** Karar için kullanıcı/kullanım verisi bekleniyor.
- **Doğrulanacak:** Varsayım; test/analitik ile teyit edilecek.
- **Koşullu (yeniden değerlendirme):** İlgili bir kararla ertelendi; belirli bir tetikleyici oluşursa yeniden değerlendirilir.
- **Roadmap'e Taşındı:** Madde ROADMAP'e `T-XXX` görevi olarak geçti; backlog kaydı izlenebilirlik için korunur.
- **Kapandı:** Madde geçersiz kaldı veya gereksizleşti; kaynak ve gerekçe korunarak kapatıldı.

## Backlog → Roadmap Geçiş Kuralları
- Bir backlog maddesi ancak **kanıt seviyesi yeterince yükseldiğinde** (genelde 🟢 veya güçlü 🟡) ROADMAP'e geçmeye aday olur.
- Geçiş yalnızca **`PRODUCT_BIBLE` ile çelişmiyorsa** yapılır; çelişiyorsa önce anayasa güncellenmeden geçemez.
- ROADMAP'e geçiş bir **karar gerektiriyorsa**, önce `DECISIONS`'a ilgili DEC eklenir; sonra ROADMAP'te `T-XXX` görevi açılır.
- Geçiş yapıldığında backlog maddesinin durumu "Roadmap'e Taşındı" olarak güncellenir; kayıt silinmez (izlenebilirlik korunur).
- Bir madde geçersiz kalırsa "Kapandı" olarak işaretlenir; kaynak ve gerekçe korunur.

## Backlog Özeti (kategori ve durum sayaçları)
**Kategoriye göre:**
- Bilinçli Ertelenen: 1 (BL-001)
- Kullanıcı Verisi Gerekli: 2 (BL-002, BL-003)
- Doğrulanacak Varsayım: 2 (BL-004, BL-005)
- Not Recommended (Yeniden Değerlendirme): 2 (BL-006, BL-008)
- Roadmap'e Taşındı: 1 (BL-007)

**Duruma göre:**
- Ertelendi: 1
- Beklemede (veri gerekli): 2
- Doğrulanacak: 2
- Koşullu (yeniden değerlendirme): 2
- Roadmap'e Taşındı: 1
- Kapandı: 0

**Kanıt seviyesine göre:**
- 🟡 Hipotez: 4 (BL-001, BL-004, BL-006, BL-007)
- 🟠 Varsayım: 4 (BL-002, BL-003, BL-005, BL-008)

**Toplam:** 8 madde.

## Doküman Geçmişi
- **2026-07-13 — v1.0:** İlk oluşturma. BL-001 … BL-008 eklendi; kaynak: `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md` ve `BLOOM_DENETIM_RAPORU.md`.
- **2026-07-17:** BL-007 "Roadmap'e Taşındı" olarak güncellendi (proje sahibi kararı DEC-009; ROADMAP T-021 açıldı). Kayıt izlenebilirlik için korundu, silinmedi.

---

## Değişiklik Özeti
- **Eklendi:** "Kanıt Seviyeleri" bölümü (🟢/🟡/🟠/🔴 tanımları).
- **Eklendi:** BL-006, BL-007, BL-008 için "İlgili Karar" alanı (sırasıyla DEC-006 / DEC-007 / DEC-008; "Kaynak"tan önce).
- **Eklendi:** "Durum" listesine "Roadmap'e Taşındı" ve "Kapandı" durumları; Backlog Kuralları ve Durum Tanımları buna göre tutarlı hale getirildi.
- **Eklendi:** Bu "Değişiklik Özeti" bölümü.
- **Not:** Bu dört revizyon dışında hiçbir metin değiştirilmedi; yeni backlog maddesi eklenmedi veya silinmedi.
