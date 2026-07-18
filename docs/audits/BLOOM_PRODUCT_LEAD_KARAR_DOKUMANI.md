# BLOOM — Product Lead Karar Dokümanı

> Kaynak: 11 Temmuz 2026 tarihli tam kod tabanı denetim raporu (17 bulgu). Bu doküman yeni bulgu üretmez; mevcut bulgular arasında **karar** verir ve önceliklendirir.
> Bağlam: solo geliştirici, freemium + abonelik, **pre-PMF / lansman öncesi** aşama.

---

## 1. Yönetici Özeti

**Şu anki durum:** Teknik iskelet yaşına göre olgun (sunucu-taraflı IAP doğrulaması, RLS, i18n paritesi), ama üründe **para ve güven kanalları delik**. Bugün mağazaya çıkarsa hem gelir sızdırır hem reddedilme riski taşır.

**En büyük problem:** Monetizasyon güvenilmez. Üç ayrı yerden premium ya bedavaya alınabiliyor (`clientPremium`), ya iptal sonrası kalıcı kalıyor (`localSku`), ya da hiç satılamıyor (Android). Ürün para kazanmak için tasarlanmış ama para yolu bozuk.

**En büyük fırsat:** Kod değişikliği gerektirmeyen kaldıraç → **lokalize App Store metadata + doğru çalışan bildirim retention'ı**. Ürünün çekirdeği (alışkanlık + AI koç + streak) zaten kurulu; onu güvenilir kılmak yeni özellikten değerli.

**En kritik risk:** Repoda **canlı GitHub token**. Bu bir ürün kararı değil, acil güvenlik olayı — bugün iptal edilmeli.

**En hızlı kazanım:** Üç P0 (token, clientPremium, localSku) toplam ~yarım günlük iş ve gelir/güvenlik kaçağının çoğunu kapatıyor.

**Bu ürün başarılı olabilir mi?** Evet — çekirdek değer önerisi net, teknik temel sağlam. Ama yalnızca para yolu düzeltilir ve kapsam pre-PMF için sadeleştirilirse. Şu haliyle "özellik açısından zengin ama güvenilmez" bir üründe risk var.

**İlk odak:** Yeni hiçbir şey yapma. **Para güvenliğini + güvenliği + mağaza uyumunu** sağla, sonra lansman. Feature değil, tamir haftası.

---

## 2. En Kritik 10 Karar

### K1 — GitHub token'ı iptal et, remote'u temizle
- **Neden önemli:** Repoya/hesaba yazma erişimi açıkta.
- **Çözülmezse:** Repo/hesap ele geçirilir, zararlı sürüm yayınlanabilir.
- **Kullanıcı etkisi:** Dolaylı ama felaket senaryosu.
- **Gelir etkisi:** Dolaylı (marka/hesap kaybı).
- **Süre:** <1 saat.
- **Öncelik:** P0

### K2 — `clientPremium` bypass'ını kaldır
- **Neden önemli:** Değiştirilmiş istemci bedava sınırsız gpt-4o alıyor.
- **Çözülmezse:** Doğrudan OpenAI maliyeti + premium gelir erozyonu.
- **Kullanıcı etkisi:** Dürüst kullanıcıda yok.
- **Gelir etkisi:** Yüksek (doğrudan kaçak).
- **Süre:** 15 dk (tek satır).
- **Öncelik:** P0

### K3 — `localSku` premium kalıcılığını düzelt
- **Neden önemli:** Süresi dolan abonelik premium kalıyor.
- **Çözülmezse:** İptal edenler ödemeden premium kullanır, yenileme geliri sızar.
- **Kullanıcı etkisi:** Bir kısmı bedava premium (gizli kaçak).
- **Gelir etkisi:** Yüksek.
- **Süre:** 30 dk.
- **Öncelik:** P0

### K4 — Streak Kalkanı'nı paywall'dan kaldır
- **Neden önemli:** Satılan ama teslim edilmeyen özellik.
- **Çözülmezse:** App Store reddi (2.3.1), iade, güven kaybı.
- **Kullanıcı etkisi:** Premium alan aldatılmış hisseder.
- **Gelir etkisi:** Orta (red = sıfır gelir).
- **Süre:** 30 dk (kaldırma).
- **Öncelik:** P0

### K5 — İlk sürümü iOS-only yayınla, Android IAP'ı ertele
- **Neden önemli:** Android satın alma tümüyle kırık.
- **Çözülmezse:** Android'de "çalışmıyor" 1 yıldızları + Play reddi.
- **Kullanıcı etkisi:** Android'de para harcanamıyor.
- **Gelir etkisi:** Yüksek ama iOS-only kararıyla **riski sıfırlanır**.
- **Süre:** 0 (yayın kararı) vs 2+ gün (tam implementasyon).
- **Öncelik:** P0

### K6 — Paywall'ı tam lokalize et + reaktif dil
- **Neden önemli:** En para-kritik ekran İngilizce kullanıcıya Türkçe.
- **Çözülmezse:** Yabancı dönüşüm düşer, mağaza lokalizasyon işareti.
- **Kullanıcı etkisi:** Kafa karışıklığı, güven kaybı.
- **Gelir etkisi:** Orta-Yüksek (uluslararası dönüşüm).
- **Süre:** 0.5–1 gün.
- **Öncelik:** P1

### K7 — Kayıt→e-posta doğrulama akışını bağla
- **Neden önemli:** Aktivasyonun en kritik anında sessizlik.
- **Çözülmezse:** "Kaydım oldu mu?" belirsizliği → terk.
- **Kullanıcı etkisi:** Yüksek (funnel girişi).
- **Gelir etkisi:** Dolaylı-Yüksek (aktivasyon = tüm gelirin önkoşulu).
- **Süre:** 2–4 saat.
- **Öncelik:** P1

### K8 — Android bildirim iznini iste
- **Neden önemli:** Retention motoru Android'de tamamen kapalı.
- **Çözülmezse:** Android kullanıcı alışkanlığı unutur, geri gelmez.
- **Kullanıcı etkisi:** Orta-Yüksek.
- **Gelir etkisi:** Dolaylı (retention→dönüşüm).
- **Süre:** 1–2 saat.
- **Öncelik:** P1 *(iOS-only lansmanda P2'ye düşer)*

### K9 — Kök Error Boundary + hata izleme
- **Neden önemli:** Tek render hatası beyaz ekran bırakıyor; gerçek hatalar `ignoreLogs`'ta susturulmuş.
- **Çözülmezse:** Nadir ama kurtarılamaz çökme → kaldırma/kötü yorum.
- **Kullanıcı etkisi:** Şiddetli ama seyrek.
- **Gelir etkisi:** Dolaylı.
- **Süre:** 3–4 saat.
- **Öncelik:** P1

### K10 — Injection filtresini daralt
- **Neden önemli:** Koç, normal cümleleri reddediyor — ürünün çekirdek değeri.
- **Çözülmezse:** Rastgele retler → hayal kırıklığı, koç değeri erozyonu.
- **Kullanıcı etkisi:** Orta (çekirdek özellik).
- **Gelir etkisi:** Dolaylı (koç = premium çekicisi).
- **Süre:** 2–3 saat.
- **Öncelik:** P1

---

## 3. MoSCoW Önceliklendirmesi

### MUST HAVE (lansmandan önce şart)
- **K1** Token iptali — güvenlik olayı.
- **K2** clientPremium kaldırma — gelir kaçağı.
- **K3** localSku düzeltmesi — gelir kaçağı.
- **K4** Streak Kalkanı kaldırma — mağaza reddi + güven.
- **K5** iOS-only yayın kararı — Android red riskini sıfırlar.
- **K6** Paywall lokalizasyonu — dönüşüm + mağaza uyumu.
- **K7** Kayıt→doğrulama akışı — aktivasyon funnel'ı.

### SHOULD HAVE (lansmanla birlikte veya hemen sonrası)
- **K9** Error Boundary + Sentry — kararlılık ağı.
- **K10** Injection filtresi daraltma — çekirdek koç deneyimi.
- textMuted kontrast düzeltmesi (P1/A11y) — tek dosyada, herkese fayda.
- Kritik akışlara accessibilityLabel (P1/A11y) — auth+paywall+habit ile sınırlı başla.

### NICE TO HAVE (kapasite açılınca)
- **K8** Android bildirim izni — *iOS-only lansmanda buraya iner* (Android ertelendi).
- Haftalık içgörü oran hesabı düzeltmesi (P2) — doğruluk, düşük görünürlük.
- Ölü kod temizliği (Aura, demo) + package.json adı (P2) — bakım hijyeni.
- Dokunma hedefi 44×44 (P2/HIG) — kozmetik-fonksiyonel.

### NOT RECOMMENDED (şimdi yapma — gerekçeli ret)
- **Streak'i sunucuya taşıma / DB'den türetme (P2-13):** Denetim raporu "zor" diyor ve haklı. Pre-PMF'te 2+ günlük mimari yeniden yazım, henüz kullanıcısı olmayan bir ürün için opportunity cost'u çok yüksek. Mevcut istemci mantığı "yeterince iyi"; gerçek kullanıcıda streak bozulması **gözlemlenirse** ele alınmalı. Şimdi değil.
- **Android IAP'ı tam implemente etme:** Google Play Developer API entegrasyonu solo geliştirici için 2+ gün + sürekli bakım. iOS-only lansmanla bu iş tamamen ertelenmeli — Android talebi kanıtlanana kadar.
- **CORS `*` daraltma (P2-16):** Mobil-only ve JWT korumalı; gerçek risk düşük. Efor/değer oranı lansman öncesi için düşük. Ertele.
- **EAS projectId / OTA doğrulaması (P3-17):** Düşük etki; lansman blokeri değil. Şifre politikası birleştirmesi de kozmetik — v1.0.3+.

---

## 4. Impact / Effort Analizi

| Karar | Kullanıcı | Gelir | Retention | Güven | Zorluk | Bakım | Tek.Risk | ROI | Opp.Cost | Öncelik |
|---|---|---|---|---|---|---|---|---|---|---|
| K1 Token iptali | Düşük | Dolaylı | – | Yüksek | Kolay | Yok | Düşük | Çok Yüksek | Yok | P0 |
| K2 clientPremium | – | Yüksek | – | Orta | Kolay | Yok | Düşük | Çok Yüksek | Yok | P0 |
| K3 localSku | – | Yüksek | – | Orta | Kolay | Yok | Düşük | Çok Yüksek | Yok | P0 |
| K4 Kalkan kaldır | Orta | Orta | – | Yüksek | Kolay | Azalır | Düşük | Çok Yüksek | Yok | P0 |
| K5 iOS-only | Orta | Yüksek | – | Yüksek | Yok | Azalır | Yok | Çok Yüksek | Android ertelenir | P0 |
| K6 Paywall i18n | Yüksek | Orta-Yük | – | Yüksek | Orta | Düşük | Düşük | Yüksek | Düşük | P1 |
| K7 Doğrulama akışı | Yüksek | Dolaylı | Yüksek | Orta | Kolay | Düşük | Düşük | Yüksek | Düşük | P1 |
| K9 Error Boundary | Orta | Dolaylı | Orta | Orta | Orta | Düşük | Düşük | Yüksek | Düşük | P1 |
| K10 Injection daralt | Orta | Dolaylı | Orta | Orta | Orta | Düşük | Orta | Orta-Yük | Düşük | P1 |
| textMuted kontrast | Orta | – | – | Orta | Kolay | Yok | Düşük | Yüksek | Yok | P1 |
| A11y label (kritik) | Orta | – | – | Orta | Kolay | Düşük | Düşük | Orta-Yük | Düşük | P1 |
| K8 Android bildirim | Orta | Dolaylı | Orta-Yük | – | Kolay | Düşük | Düşük | Orta | – (ertelendi) | P2 |
| Haftalık oran | Düşük | – | Düşük | Düşük | Kolay | Yok | Düşük | Orta | Yok | P2 |
| Ölü kod temizliği | Yok | – | – | – | Kolay | Azalır | Düşük | Orta | Yok | P2 |
| Streak sunucuya | Orta | – | Orta | Orta | Zor | Yüksek | Orta | **Düşük** | Yüksek | NR |
| Android IAP tam | Yüksek | Yüksek | – | Orta | Zor | Yüksek | Orta | **Düşük (şimdi)** | Çok Yüksek | NR |
| CORS daralt | Yok | – | – | Düşük | Kolay | Düşük | Düşük | Düşük | Düşük | NR/ertele |

---

## 5. Gelir Artırma Stratejisi (yalnızca mevcut ürünle, yeni özellik yok)

1. **Gelir kaçaklarını kapat (K2+K3+K4+K5).** Yeni gelir "kazanmadan" önce **sızan geliri durdur**. Bu en yüksek ROI'li gelir işi.
   - Gelir etkisi: Yüksek | Premium dönüşüm: Nötr ama gelir korunur | Retention: – | Süre: ~1 gün | **Öncelik: P0**
2. **Paywall'ı lokalize et (K6).** Yabancı kullanıcı Türkçe paywall'da dönüşmez. Aynı trafiği daha iyi paraya çevirir.
   - Gelir: Orta-Yüksek | Premium dönüşüm: Artırır | Retention: – | Süre: 0.5–1 gün | **Öncelik: P1**
3. **Aktivasyonu tamir et (K7).** Kaydolamayan kullanıcı premium'a hiç ulaşamaz. Funnel'ın en üstü.
   - Gelir: Dolaylı-Yüksek | Premium dönüşüm: Artırır (havuzu büyütür) | Retention: Yüksek | Süre: 2–4 saat | **Öncelik: P1**
4. **Lokalize App Store metadata + ekran görüntüleri (TR/EN).** Kod değişikliği sıfır; organik indirmede en yüksek kaldıraç.
   - Gelir: Orta | Premium dönüşüm: Dolaylı | Retention: – | Süre: 0.5 gün (içerik) | **Öncelik: P1**

> **Bilinçli ret:** Paywall zamanlaması optimizasyonu / soft-paywall denemesi (denetim raporunda "hipotez" olarak geçiyor) — **pre-PMF'te erken optimizasyon.** Önce dürüst ve çalışan bir paywall; A/B testi kullanıcı hacmi olmadan anlamsız. Ertele.

---

## 6. Ürün Stratejisi

**Çekirdek değer:** "Alışkanlıklarını takip et + AI koç ile motive ol + streak ile süreklilik kazan." Üç ayaklı: takip, koç, süreklilik.

**Gerçekten değer katan:** Ana ekran alışkanlık takibi + tamamlama, AI koç sohbeti, streak/ilerleme görünürlüğü, hatırlatıcı bildirimler. Bunlar korunmalı ve **güvenilir** kılınmalı.

**Gereksiz / feature creep:** Streak Kalkanı (çalışmıyor + karmaşıklık), demo modu (ölü), AuraCreation ekranı (ölü marka kalıntısı). Sil/kaldır.

**Kullanıcıyı yoran:** Injection filtresinin yanlış retleri (koç güvenini kırıyor), dil karışıklığı olan paywall. Bunlar deneyimi bozan sürtünme.

**PMF öncesi gereksiz:** Habit Stacks (rutinler) — premium'a kilitli, ayrı tablo+ekran bakımı taşıyor, çekirdek için şart değil. Kullanım verisi gelene kadar öne çıkarma. Habit DNA radar — 30 gün veri olmadan boş/yanıltıcı; "yeterli veri yok" durumu ekle, önceliğini düşür.

**Sonraya yapılmalı:** Android IAP (talep kanıtlanınca), streak'in sunucuya taşınması (gerçek bozulma gözlemlenirse), OTA/EAS düzeltmeleri.

---

## 7. Version Roadmap (her sürüm tek ana hedef)

- **v1.0.2 — "Para & Güvenlik Güvenli":** K1–K5. Tek hedef: gelir kaçaklarını ve güvenlik/mağaza bloklayıcılarını kapatmak. Bu sürüm lansman adayı.
- **v1.0.3 — "Dönüşüm & Aktivasyon":** K6 paywall lokalizasyonu + K7 doğrulama akışı + lokalize mağaza metadata. Tek hedef: aynı trafiği daha iyi paraya çevirmek.
- **v1.0.4 — "Kararlılık & Erişilebilirlik":** K9 Error Boundary + Sentry, K10 injection daraltma, textMuted kontrast, kritik a11y label'ları. Tek hedef: güvenilir ve erişilebilir deneyim.
- **v1.0.5 — "Temizlik & Doğruluk":** Ölü kod, haftalık oran düzeltmesi, şifre politikası birliği, dokunma hedefleri, (talep varsa) Android bildirim + IAP değerlendirmesi. Tek hedef: teknik borç azaltma.

---

## 8. Product Lead Eleştirisi (denetim raporuna)

**Gereğinden fazla önem verilmiş bulgular:**
- *Streak'in sunucuya taşınması (P2-13):* Rapor doğru teşhis ediyor ama pre-PMF'te bu bir tuzak. Henüz kullanıcı yokken 2 günlük mimari yazımı yanlış yatırım. Doğru öncelik: **gözlemle, bozulursa çöz.**
- *CORS `*` (P2-16):* Güvenlik başlığı altında listelenmiş ama mobil+JWT bağlamında gerçek risk minimal. Lansman kararında ağırlığı olmamalı.

**Gözden kaçan / yeterince vurgulanmayan:**
- Denetim, üç ayrı monetizasyon deliğini (clientPremium, localSku, Android) ayrı bulgular olarak listeliyor ama bunların **birlikte "para yolu bozuk" tek sistemik problemi** oluşturduğunu yeterince vurgulamıyor. Ürün kararı açısından bunlar tek bir "gelir güvenliği" epic'i.
- iOS-only lansman seçeneği raporda bir öneri olarak geçiyor ama **stratejik ağırlığı** hafif. Bu tek karar, Android'le ilgili tüm P0/P1 yükünü lansmandan çıkarıyor — en yüksek kaldıraçlı ürün kararı.

**Gereksiz öneriler:**
- Rapor yer yer "ya kaldır ya implemente et" gibi çift seçenek sunuyor (Kalkan, Android). Product Lead kararı net olmalı: **ikisini de kaldır/ertele.** Pre-PMF'te implemente etmek yanlış.

**Daha doğru önceliklendirme:** Rapor P0'ları teknik ciddiyete göre sıralamış (doğru). Ama ürün açısından sıra **fırsat maliyeti + gelir**e göre olmalı: token → clientPremium → localSku → Kalkan → iOS-only. Android'i P0'dan çıkarıp "ertelenen iş" yapmak raporun ima ettiğinden daha güçlü bir karar.

---

## 9. İlk 30 Günlük Plan

**Hafta 1 — Para & Güvenlik (v1.0.2):** K1 token, K2 clientPremium, K3 localSku, K4 Kalkan kaldır, K5 iOS-only karar. Gerçek cihazda satın alma→restore→iptal→free düşüşü test.

**Hafta 2 — Dönüşüm & Aktivasyon (v1.0.3):** K6 paywall tam lokalizasyon + reaktif dil, K7 kayıt→doğrulama akışı, lokalize App Store metadata + ekran görüntüleri hazırlığı. TestFlight'a ilk aday build.

**Hafta 3 — Kararlılık & A11y (v1.0.4):** K9 Error Boundary + Sentry, K10 injection daraltma + bağlamsal ret mesajı, textMuted kontrast, kritik akış a11y label'ları. `ignoreLogs`'tan gerçek hataları çıkar.

**Hafta 4 — Temizlik & Submit:** Ölü kod sil (Aura/demo), package.json adı, haftalık oran düzeltmesi, uçtan uca regresyon, privacyManifest gözden geçir, **iOS App Store submit.** Android bu ay kapsam dışı.

---

## 10. Master İş Listesi (öncelik sıralı, maks 20)

1. GitHub token'ını bugün iptal et ve remote'u SSH'a çevir.
2. `chat` fonksiyonundan `clientPremium` bayrağını sil; premium'u yalnızca DB belirlesin.
3. `App.tsx`'te premium kararını `active = dbActive` yap; `localSku`'yu karardan çıkar.
4. Streak Kalkanı'nı paywall FEATURES listesinden kaldır.
5. İlk sürümü iOS-only yayınlama kararını sabitle; Android build'i lansmandan çıkar.
6. Gerçek cihazda satın alma → restore → iptal sonrası free düşüşünü doğrula.
7. Paywall'daki tüm hardcoded Türkçe metni `t()`'ye taşı.
8. `isTurkish` yerine reaktif dil store'unu (`useTranslation`) bağla.
9. Kayıt başarısında `VerifyEmail` ekranına yönlendir (veya e-posta onayını kapat).
10. Lokalize App Store metadata + TR/EN ekran görüntülerini hazırla.
11. Kök seviyede Error Boundary (yeniden dene fallback'li) ekle.
12. Sentry/expo hata izlemeyi bağla ve `ignoreLogs`'tan gerçek hata desenlerini çıkar.
13. Injection regex'lerini yalnızca gerçek jailbreak kalıplarına daralt.
14. `textMuted` rengini ~`#6E6E90`'a açarak AA kontrastı sağla.
15. Auth + paywall + habit akışlarındaki ikon butonlara `accessibilityLabel` ekle.
16. `AuraCreationScreen`'i ve kullanılmayan demo modunu sil; `package.json` adını `bloom` yap.
17. Haftalık içgörü tamamlama oranını frekansa göre hesapla.
18. Kritik dokunma hedeflerini 44×44'e çıkar veya `hitSlop` ekle.
19. Şifre politikasını tek `getPasswordStrength` mantığında birleştir.
20. EAS `projectId`'nin gerçek UUID olduğunu doğrula (OTA çalışması için).
