# BLOOM — DECISIONS (Karar Günlüğü)

## Karar Sistemi
Bu dosya BLOOM'un kesinleşmiş kararlarının kaydıdır. Çalışma mantığı:
- **Append-only'dir:** kararlar yalnızca eklenir.
- **Kararlar silinmez:** bir karar değişse veya iptal olsa bile eski kayıt korunur; yeni bir DEC eklenip "Yerine geçen karar" ile bağlanır.
- **Hipotezler burada tutulmaz:** yalnızca onaylanmış, bağlayıcı kararlar yazılır; öneri/quick-win/doğrulanmamış fikir girmez.
- **Teknik gerçek** `TECHNICAL_CONTEXT.md`'dedir.
- **Ürün ilkeleri** `PRODUCT_BIBLE.md`'dadır.
- **Aktif işler** `ROADMAP.md`'dedir.

> Yeni karar üretilmez; yalnızca `BLOOM_DENETIM_RAPORU.md` ve `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md` içindeki onaylı kararlar kaydedilir.

---

## DEC-001
- **Karar Güveni:** Kesin
- **Tarih:** 2026-07-13
- **Karar:** İlk sürüm yalnızca iOS olarak yayınlanacak; Android satın alma (IAP) ertelenecek.
- **Sebep:** Android satın alma yolu tümüyle kırık; iOS-only lansman, Android kaynaklı tüm P0/P1 yükünü ve Play reddi riskini lansmandan çıkarır. Android talebi kanıtlanana kadar bu iş açılmaz.
- **Etkilenen alan:** Yayın stratejisi, Abonelik sistemi, Platform kapsamı.
- **Durum:** Aktif — uygulama bekliyor.
- **Yerine geçen karar:** DEC-009 (2026-07-17) — Android artık süresiz ertelenmiş değil, iOS ile paralel geliştiriliyor. (Not: v1.0.2'nin kendisi hâlâ iOS-only yayınlanıyor; değişen Android'in genel erteleme/talep-koşullu duruşu.)
- **Kaynak:** Karar Dokümanı K5 / §7 Roadmap; Denetim Raporu P0-4.

## DEC-002
- **Karar Güveni:** Kesin
- **Tarih:** 2026-07-13
- **Karar:** "Streak Kalkanı" özelliği paywall'dan kaldırılacak (ilk sürüm).
- **Sebep:** Reklamı yapılan ama kodda teslim edilmeyen bir özellik; App Store reddi (Guideline 2.3.1) ve güven kaybı riski. Kaldırmak en hızlı ve dürüst yoldur.
- **Etkilenen alan:** Paywall, Güven, App Store uyumluluğu.
- **Durum:** Uygulandı (2026-07-17) — paywall FEATURES listesinden kaldırıldı; ayrıca aynı gerekçeyle App Store/Play Store mağaza metinlerinden ve kodda hiçbir zaman çalışmayan (sunucuya hiç yazılmayan, `shields_remaining` her zaman 0) kalkan UI/i18n kalıntılarından da temizlendi (bkz. T-004).
- **Yerine geçen karar:** —
- **Kaynak:** Karar Dokümanı K4; Denetim Raporu P0-5.

## DEC-003
- **Karar Güveni:** Kesin
- **Tarih:** 2026-07-13
- **Karar:** Premium yetkisi yalnızca sunucu/veritabanı (`dbActive`) tarafından belirlenecek; `clientPremium` bayrağı kaldırılacak.
- **Sebep:** İstemciden gelen yetki bayrağına güvenmek premium'un bedava aşılmasına yol açıyor (sınırsız gpt-4o + limit atlama). Yetki kararı istemciye asla bırakılmaz.
- **Etkilenen alan:** Abonelik sistemi, Yapay zeka altyapısı, Gelir güvenliği.
- **Durum:** Uygulandı (2026-07-17) — `clientPremium` bayrağı `chat` fonksiyonundan kaldırıldı, `isPremium = dbActive` yapıldı, Supabase'e deploy edildi (bkz. T-002).
- **Yerine geçen karar:** —
- **Kaynak:** Karar Dokümanı K2; Denetim Raporu P0-2.

## DEC-004
- **Karar Güveni:** Kesin
- **Tarih:** 2026-07-13
- **Karar:** Yerel `localSku` değeri premium kararından çıkarılacak; premium yalnızca `active = dbActive` ile belirlenecek.
- **Sebep:** `active = dbActive || !!localSku` mantığı, süresi dolan aboneliğin kalıcı premium kalmasına neden oluyor. `localSku` yalnızca tarife etiketleme için kullanılabilir, premium kararı için değil.
- **Etkilenen alan:** Abonelik sistemi, Gelir güvenliği.
- **Durum:** Uygulandı (2026-07-17) — `App.tsx`'te `active = dbActive || !!localSku` mantığı kaldırıldı, karar yalnızca `dbActive`'e bağlandı; kod bir sonraki App Store build'iyle yayına çıkacak (bkz. T-003).
- **Yerine geçen karar:** —
- **Kaynak:** Karar Dokümanı K3; Denetim Raporu P0-3.

## DEC-005
- **Karar Güveni:** Kesin
- **Tarih:** 2026-07-13
- **Karar:** Repoya gömülü canlı GitHub token iptal edilecek ve remote temizlenecek (SSH veya credential helper).
- **Sebep:** Token repoya/hesaba yazma erişimi verir; kaynağa gömülü secret kritik güvenlik olayıdır.
- **Etkilenen alan:** Güvenlik, Repo/hesap bütünlüğü.
- **Durum:** Uygulandı (2026-07-17) — token GitHub'da iptal edildi, remote SSH'a çevrildi (bkz. T-001).
- **Yerine geçen karar:** —
- **Kaynak:** Karar Dokümanı K1; Denetim Raporu P0-1.

## DEC-006
- **Karar Güveni:** Yüksek
- **Tarih:** 2026-07-13
- **Karar:** Streak mantığının sunucuya taşınması / veritabanından türetilmesi şimdilik yapılmayacak (ertelendi).
- **Sebep:** Pre-PMF aşamasında 2+ günlük mimari yeniden yazım, henüz kullanıcısı olmayan bir üründe yüksek fırsat maliyeti taşır. Gerçek kullanıcıda streak bozulması gözlemlenirse yeniden değerlendirilir.
- **Etkilenen alan:** Streak/veri bütünlüğü, Mimari.
- **Durum:** Aktif (Not Recommended / Yeniden değerlendirme koşullu).
- **Yerine geçen karar:** —
- **Kaynak:** Karar Dokümanı §3 (Not Recommended), P2-13.

## DEC-007
- **Karar Güveni:** Yüksek
- **Tarih:** 2026-07-13
- **Karar:** Android IAP'ın tam implementasyonu şimdilik yapılmayacak (ertelendi).
- **Sebep:** Google Play Developer API entegrasyonu solo geliştirici için yüksek efor + sürekli bakım demek. Android talebi kanıtlanana kadar açılmaz (bkz. DEC-001).
- **Etkilenen alan:** Abonelik sistemi, Platform kapsamı.
- **Durum:** Aktif (Not Recommended / Yeniden değerlendirme koşullu).
- **Yerine geçen karar:** DEC-009 (2026-07-17) — "Android talebi kanıtlanana kadar açılmaz" koşulu kaldırıldı; Android IAP artık aktif geliştirme kapsamında.
- **Kaynak:** Karar Dokümanı §3 (Not Recommended).

## DEC-008
- **Karar Güveni:** Yüksek
- **Tarih:** 2026-07-13
- **Karar:** Edge Function'larda `Access-Control-Allow-Origin: '*'` daraltması şimdilik yapılmayacak (ertelendi).
- **Sebep:** Mobil-only ve JWT korumalı bağlamda gerçek risk düşük; lansman öncesi efor/değer oranı düşük.
- **Etkilenen alan:** Güvenlik (düşük), Edge Functions.
- **Durum:** Aktif (Not Recommended / Yeniden değerlendirme koşullu).
- **Yerine geçen karar:** —
- **Kaynak:** Karar Dokümanı §3 (Not Recommended / ertele); Denetim Raporu P2-16.

## DEC-009
- **Karar Güveni:** Kesin
- **Tarih:** 2026-07-17
- **Karar:** Android artık ertelenmiş/dondurulmuş değildir. Android, iOS ile paralel olarak geliştirilecektir; Android yayını ileride yapılacaktır. Android'e özgü doğrulama (IAP, Play Console, cihaz bazlı testler) proje sahibi tarafından ayrıca ve sonradan yapılacaktır.
- **Sebep:** Proje sahibinin doğrudan yön kararı (2026-07-17). DEC-001/DEC-007'deki "Android talebi kanıtlanana kadar açılmaz" koşulu kaldırılmıştır; Android artık kanıt bekleyen bir hipotez değil, planlı bir geliştirme hedefidir.
- **Etkilenen alan:** Platform kapsamı, Yayın stratejisi, Abonelik sistemi (Android IAP), Roadmap.
- **Durum:** Aktif — Android paralel geliştirme sürüyor. Doğrulama kuralı: kod tamamlanmış olması yeterli değildir; IAP/Play Console/cihaz bazlı testler proje sahibi tarafından yapılıp doğrulanmadan hiçbir Android işi "Tamamlandı" sayılamaz (bkz. TECHNICAL_CONTEXT §18 doğrulama zorunluluğu).
- **Yerine geçen karar:** —
- **Kaynak:** Proje sahibi talimatı (2026-07-17, bu konuşma); DEC-001 ve DEC-007'yi revize eder.

---

## Yeni Karar Ekleme Kuralları
- **Append-only:** Mevcut kararlar silinmez veya düzenlenmez. Yeni karar her zaman listenin sonuna eklenir.
- **Benzersiz ID:** Her karar sıradaki `DEC-XXX` ID'sini alır; ID'ler yeniden kullanılmaz.
- **Yalnızca kesinleşmiş kararlar:** Hipotez, öneri, quick-win veya doğrulanmamış fikir karar olarak yazılmaz. Bir madde ancak onaylanmış bir kararsa buraya girer.
- **Zorunlu alanlar:** ID, Karar Güveni (Kesin / Yüksek), Tarih, Karar, Sebep, Etkilenen alan, Durum, Yerine geçen karar, Kaynak.
- **Kaynak zorunlu:** Her karar bir kaynağa (denetim raporu bulgusu ve/veya karar dokümanı maddesi) bağlanır.
- **Değişiklik / iptal:** Bir karar değişir veya iptal olursa eski kayıt korunur; yeni bir DEC eklenir, eski kaydın "Durum"u güncellenmeden yeni kayıtta "Yerine geçen karar: DEC-XXX" belirtilir ve eski karara bu yeni ID işaret eder.
- **Kapsam:** Ürün ilkeleri `PRODUCT_BIBLE`'a, teknik gerçek `TECHNICAL_CONTEXT`'e, aktif işler `ROADMAP`'e aittir; buraya yalnızca bağlayıcı kararlar yazılır.
- **Anayasa önceliği:** Yeni karar `PRODUCT_BIBLE` ile çelişiyorsa, önce anayasa güncellenmeden karar eklenemez.
- **ROADMAP senkronu:** `ROADMAP`'i etkileyen her yeni karar, ilgili görev planını da güncellemelidir.

## Doküman Geçmişi
- **2026-07-13 — v1.0:** İlk oluşturma. DEC-001 … DEC-008 eklendi; kaynak: `BLOOM_DENETIM_RAPORU.md` ve `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`.
- **2026-07-17:** DEC-009 eklendi (proje sahibi talimatı — Android artık paralel geliştiriliyor). DEC-001 ve DEC-007'nin "Yerine geçen karar" alanları DEC-009'a işaret edecek şekilde güncellendi; her iki kararın "Durum" alanı kural gereği (bkz. Değişiklik / iptal kuralı) değiştirilmedi.

---

## Değişiklik Özeti
- **Eklendi:** Dosya başına "Karar Sistemi" açıklaması (append-only, kararlar silinmez, hipotez tutulmaz, teknik gerçek → TECHNICAL_CONTEXT, ürün ilkeleri → PRODUCT_BIBLE, aktif işler → ROADMAP).
- **Değiştirildi:** DEC-006, DEC-007, DEC-008 "Durum" alanı → "Aktif (Not Recommended / Yeniden değerlendirme koşullu)".
- **Eklendi:** "Yeni Karar Ekleme Kuralları" sonuna iki madde (anayasa önceliği; ROADMAP senkronu).
- **Eklendi:** Bu "Değişiklik Özeti" bölümü.
- **Not:** Bu dört revizyon dışında hiçbir bölümün metni değiştirilmedi.
