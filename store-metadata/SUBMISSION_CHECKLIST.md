# BLOOM — Store Submission Checklist

## 1. EAS Hesap Kurulumu

```bash
# EAS CLI kur (zaten kurulu değilse)
npm install -g eas-cli

# Expo hesabına giriş
eas login

# Projeyi Expo'ya bağla (project ID alır)
eas init
```

eas init sonrası çıkan `projectId`'yi `app.json` > `extra.eas.projectId` alanına yaz.

---

## 2. Ortam Değişkenlerini EAS'a Ekle

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://vjqspziumgzesiqcaeme.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_ANON_KEY"
```

---

## 3. İlk Build — TestFlight / Internal Test

### iOS (TestFlight)
```bash
eas build --platform ios --profile preview
```
- Apple Developer hesabı gerekli ($99/yıl)
- İlk build'de sertifika + provisioning profile otomatik oluşur
- Build bittikten sonra: App Store Connect > TestFlight > yükle

### Android (Internal Testing)
```bash
eas build --platform android --profile preview
```
- `.apk` dosyası indirilir, Play Console > Internal Testing'e yükle

---

## 4. App Store Connect Kurulumu

### Adımlar:
1. https://appstoreconnect.apple.com → Yeni Uygulama → iOS
2. Bundle ID: `com.bloom.habitcoach`
3. SKU: `bloom-habit-coach-001`
4. Metadata doldur: `store-metadata/tr/app-store.md` ve `store-metadata/en/app-store.md`

### Ekran Görüntüleri Gereksinimleri:
| Cihaz | Boyut |
|-------|-------|
| iPhone 6.9" (Pro Max) | 1320 × 2868 px |
| iPhone 6.7" (Plus) | 1290 × 2796 px |
| iPad Pro 13" | 2064 × 2752 px (isteğe bağlı) |

**Minimum 3, maksimum 10 ekran görüntüsü** — önce 6.9" gerekli.

### İçerik Hakları (Review Notları):
- AI özellikleri için: "AI yanıtları OpenAI API aracılığıyla sağlanmaktadır."
- Abonelik: App Store Connect > Abonelikler > Yeni Abonelik Grubu
  - Grup adı: "BLOOM Premium"
  - Ürün 1: `bloom_monthly` — ₺79/ay
  - Ürün 2: `bloom_yearly` — ₺599/yıl

---

## 5. Google Play Console Kurulumu

### Adımlar:
1. https://play.google.com/console → Yeni uygulama
2. Package: `com.bloom.habitcoach`
3. Metadata: `store-metadata/tr/play-store.md`
4. Uygulama içi ürünler → Abonelikler:
   - `bloom_monthly` — ₺79/ay
   - `bloom_yearly` — ₺599/yıl

### Production Build:
```bash
eas build --platform android --profile production
```
→ `.aab` dosyası → Play Console'a yükle

### İmzalama:
```bash
# İlk kez: EAS otomatik keystore oluşturur
# Sakla: eas credentials komutuyla yedekle
eas credentials
```

---

## 6. react-native-iap Entegrasyonu (Satın Alma Akışı)

```bash
npx expo install react-native-iap
```

`app.json`'a ekle:
```json
"plugins": ["react-native-iap"]
```

Ürün ID'leri (App Store + Play Store'da aynı olmalı):
- `bloom_monthly`
- `bloom_yearly`

---

## 7. Production Build & Submit

```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios --latest

# Android
eas build --platform android --profile production
eas submit --platform android --latest
```

---

## 8. Review Öncesi Kontrol Listesi

- [ ] Privacy Policy URL çalışıyor: https://bloom-habit.app/gizlilik
- [ ] Support URL çalışıyor: https://bloom-habit.app/destek
- [ ] Test hesabı: barangunduzdesign@gmail.com / test şifresi hazır (App Review ekibine verilecek)
- [ ] Demo mode ile giriş yapılabilir
- [ ] Abonelik satın alma akışı test edildi (sandbox)
- [ ] Ekran görüntüleri yüklendi (min. 3 adet, 6.9" iPhone)
- [ ] App Store açıklaması Türkçe + İngilizce hazır
- [ ] Yaş derecelendirmesi tamamlandı (4+)
- [ ] Şifreleme: `usesNonExemptEncryption: false` (app.json'da ayarlandı)
- [ ] Privacy Manifest (app.json'da ayarlandı)

---

## Sıklıkla Sorulan Sorular

**Q: EAS Build ne kadar sürer?**
iOS: ~15-25 dakika, Android: ~10-15 dakika

**Q: Apple Developer hesabı yoksa?**
https://developer.apple.com → Enroll → $99/yıl

**Q: Play Console hesabı yoksa?**
https://play.google.com/console → $25 tek seferlik

**Q: TestFlight'a nasıl erişim verilirim?**
App Store Connect > TestFlight > Test Grupları > E-posta ile davet
