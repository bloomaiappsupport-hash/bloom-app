# BLOOM — Çalışma Anayasası (Araçtan Bağımsız)

> Bu dosya, bu repoda çalışan **her AI aracı ve geliştirici** için bağlayıcı çalışma kurallarını tanımlar (Claude Code, Antigravity, Cursor, Windsurf veya başka bir araç fark etmez). Ürün kararı, teknik bilgi veya roadmap işi içermez; yalnızca **çalışma biçimini ve doküman okuma düzenini** tanımlar. Değişebilen ürün/teknik durum burada tekrar edilmez; her zaman ilgili kaynak dosyadan doğrulanır.

## 1. Amaç

Bu repoya giren herhangi bir aracın/geliştiricinin: doğru dosyaları doğru sırayla okumasını, gerçek ile varsayımı karıştırmamasını, onaysız değişiklik yapmamasını ve her işi doğrulanabilir biçimde teslim etmesini sağlamak.

## 2. Başlamadan Önce Okunacak Dosyalar

1. **İlk iş olarak:** `README.md` (repo girişi) ve `DURUM.md` (mevcut operasyonel durum) okunur.
2. **Ardından, görevle ilgili olanlar:** `docs/core/` ve `docs/business/` dokümanları (görev kapsamına göre seçilir).
3. Gerekirse kanıt için: `docs/audits/` belgeleri.
4. **Placeholder dosyalar** ("Bu dosya daha sonra hazırlanacaktır" içeriği) kaynak kabul edilmez; fark edilirse kullanıcıya bildirilir.

## 3. Doküman Hiyerarşisi

| Dosya | Rolü |
|---|---|
| `docs/core/PRODUCT_BIBLE.md` | Ürün anayasası — değişmez ilkeler |
| `docs/core/TECHNICAL_CONTEXT.md` | Güncel teknik bağlamın ana kaynağı — koddan doğrulanmış bilgiler ve doğrulanması gereken alanlar |
| `docs/core/DECISIONS.md` | Bağlayıcı kararlar (append-only, `DEC-XXX`) |
| `docs/core/ROADMAP.md` | Aktif ve onaylı işler (`T-XXX`, sürüm bazlı) |
| `docs/core/BACKLOG.md` | Onaylanmamış fikir ve hipotezler (`BL-XXX`) |
| `docs/business/*` | Kalıcı iş ilkeleri (gelir, pazarlama, büyüme, ölçüm) |
| `docs/audits/*` | Kaynak ve kanıt belgeleri — yaşayan durumun tek kaynağı değildir |
| `DURUM.md` | Yalnızca mevcut operasyonel özet (yaşayan belge) |
| `README.md` | Repo giriş noktası — yönlendiricidir, tek doğru kaynak değildir |

Ek ayrım:

- **Audit belgeleri kaynak ve kanıttır; yaşayan ürün/teknik durumun tek kaynağı değildir.** Audit, yazıldığı andaki tespiti gösterir; güncel durum core dokümanlardan okunur.
- `README.md` ve `DURUM.md` yönlendirici/özet belgelerdir; ayrıntılı kaynakların yerine geçmez.

## 4. Kaynak Önceliği

Bir konuda hangi dosya esas alınır:

- **Ürün ilkeleri** → `PRODUCT_BIBLE.md`
- **Güncel teknik durum** → `TECHNICAL_CONTEXT.md`
- **Güncel bağlayıcı kararlar** → `DECISIONS.md`
- **Aktif işler** → `ROADMAP.md`
- **Onaylanmamış fikirler** → `BACKLOG.md`
- **Gelir/pazarlama/büyüme/ölçüm ilkeleri** → ilgili `docs/business/` dosyası

Çelişki çözümünde:

- Audit ile güncel core doküman arasında fark varsa **audit otomatik olarak üstün sayılmaz**; yukarıdaki öncelik geçerlidir.
- Audit bulgusu core dokümanlara aktarılmamışsa veya çelişki varsa kullanıcıya bildirilir (bkz. §14).

## 5. Çalışma Kuralları

- Kodda veya dokümanlarda olmayan bilgi **üretilmez**.
- Teslim edilmemiş özellik mevcut gibi gösterilmez; bir özelliğin teslim durumu `TECHNICAL_CONTEXT`, `DECISIONS` ve `ROADMAP`'ten doğrulanır.
- Kesin karar, aktif görev, hipotez ve teknik gerçek birbirine **karıştırılmaz** (bkz. §10).
- Veri yokken sayı, hedef, benchmark veya istatistik uydurulmaz; ölçüm kuralları `docs/business/KPI.md`'dendir.
- **Ürün aşaması ve platform kapsamı hakkında güncel durum `README.md`, `DURUM.md` ve `DECISIONS.md`'den doğrulanır; araç kendi varsayımını üretmez.**

## 6. Taslak ve Onay Akışı

1. **Önce taslak gösterilir** (sohbet/çıktı içinde; dosyaya yazılmaz).
2. Kullanıcının **açık onayı** beklenir.
3. Onaydan sonra **yalnızca belirtilen dosyaya** yazılır.
4. Yazma sonrası doğrulama yapılır (bkz. §9).

## 7. Dosya Değiştirme Kuralları

- **Açık onay olmadan hiçbir dosya değiştirilmez.**
- Onay hangi dosya için verildiyse yalnızca o dosyaya yazılır; **başka hiçbir dosyaya dokunulmaz.**
- Onay kapsamı dışında metin değiştirilmez, bölüm eklenmez, referans güncellenmez.
- Append-only dosyalarda (`DECISIONS.md`) mevcut kayıtlar silinmez/düzenlenmez.

## 8. Kod Değişikliği Kuralları

- Kod değişikliği yalnızca `ROADMAP`'teki onaylı bir göreve (`T-XXX`) veya kullanıcının açık talebine dayanır.
- Araç, paket veya API sürümü **doğrulanmadan** komut veya kod üretilmez; güncel sürümler `package.json` ve `TECHNICAL_CONTEXT`'ten okunur, ezberden yazılmaz.
- Yeni teknik borç oluşturmak yerine mevcut borç azaltılır (`TECHNICAL_CONTEXT` teknik borç ilkesi).
- Kod değişikliği teknik gerçeği değiştiriyorsa `TECHNICAL_CONTEXT` güncellemesi önerilir (onayla).

## 9. Doğrulama Kuralları

- **Hiçbir görev doğrulanmadan "Tamamlandı" sayılmaz** (`ROADMAP` kuralı).
- **Doğrulama yöntemi ve zorunlu doğrulama sırası `TECHNICAL_CONTEXT` §18 ile ilgili `ROADMAP` Release Criteria'dan alınır; mevcut test altyapısı varsayılmaz.**
- Dosya yazımı sonrası doğrulanır: dosya yolu doğru mu, kapsam korundu mu, başka dosyaya dokunulmadı mı.

## 10. Karar / Görev / Hipotez / Teknik Gerçek Ayrımı

- **Kesin karar:** yalnızca `DECISIONS.md`'deki `DEC-XXX` kayıtları bağlayıcıdır.
- **Aktif görev:** yalnızca `ROADMAP.md`'deki `T-XXX` kayıtları iştir; durumları yalnızca ROADMAP'ten aktarılır.
- **Hipotez/varsayım:** `BACKLOG.md`'dedir; kanıt seviyesiyle (🟢/🟡/🟠/🔴) anılır ve asla gerçek gibi yazılmaz.
- **Teknik gerçek:** yalnızca `TECHNICAL_CONTEXT.md`'de koddan doğrulanmış olandır; "Doğrulanmalı" işaretli konular gerçek kabul edilmez.

## 11. Doküman Güncelleme Kuralları

Hangi değişiklik nereye gider:

- Yeni **karar** gerekiyorsa → `DECISIONS.md` sürecine yönlendirilir (append-only; `PRODUCT_BIBLE` ile çelişemez).
- Yeni **iş** gerekiyorsa → `ROADMAP.md` sürecine yönlendirilir.
- Yeni **fikir/hipotez** → `BACKLOG.md` sürecine yönlendirilir.
- **Teknik gerçek** değiştiğinde → `TECHNICAL_CONTEXT.md` güncellenir.
- **İlke** değiştiğinde → ilgili Bible dosyası güncellenir.
- **Durum** değiştiğinde → `DURUM.md` güncellenir.
- Tüm güncellemeler §6 taslak-onay akışına tabidir.

## 12. Güvenlik Kuralları

- **Secret değerler, token'lar veya credential'lar hiçbir çıktıya, dokümana veya commit'e yazılmaz.**
- `.env` dosyasına yalnızca public istemci değişkenleri yazılır; sunucu secret'ları Supabase Secrets / Edge Function ortamında tutulur. Güncel değişken listesi `README.md` §9 ve `TECHNICAL_CONTEXT` §12'den doğrulanır.
- Güvenlik bulgusu fark edilirse ayrıntılı istismar tarifi yazılmaz; kullanıcıya bildirilir ve ilgili kayda (`DECISIONS`/`ROADMAP`) yönlendirilir.

## 13. Expo ve Teknik Dokümantasyon Kuralları

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

- Expo konusunda yalnızca projenin kullandığı Expo sürümüyle uyumlu, sürümlü dokümantasyon kullanılır; ezberden veya farklı sürümün API'sinden kod yazılmaz.
- Diğer paketler için sürüm `package.json`'dan doğrulanır; sürüme uygun dokümantasyon esas alınır.

## 14. Çelişki Yönetimi

- Dokümanlar arasında veya doküman↔kod arasında çelişki görülürse **sessizce çözülmez**; önce kullanıcıya açıkça bildirilir.
- Bildirimden sonra çözüm, kaynak önceliğine (§4) ve kullanıcı kararına göre yapılır.
- **Kod ile `TECHNICAL_CONTEXT` arasında çelişki görülürse:** kod mevcut implementasyonun kanıtıdır; ancak otomatik olarak doğru veya onaylı davranış kabul edilmez. Çelişki kullanıcıya bildirilir, ilgili `DECISIONS`/`ROADMAP`/`PRODUCT_BIBLE` kayıtları kontrol edilir ve onaydan sonra gerekli dosya veya kod güncellenir.

## 15. Çıktı ve Raporlama Formatı

- Bir iş tesliminde şunlar raporlanır: ne okunduğu/doğrulandığı, ne yapıldığı, hangi dosyaların değiştiği, doğrulama sonucu ve varsa açık kalan konular.
- İddialar kaynağa bağlanır (dosya + bölüm/ID: `DEC-XXX`, `T-XXX`, `BL-XXX`, `KPI-XXX`, §N).
- Hipotezler hipotez olarak işaretlenir; "Doğrulanmadı" alanlar açıkça belirtilir.
- Çıktıda gizli bilgi bulunmaz (§12).

## 16. Yasaklanan Davranışlar

- Onaysız dosya değişikliği; onay kapsamı dışına taşma.
- Bilgi/karar/görev/özellik/tarih/sayı uydurma.
- Teslim edilmemiş özelliği mevcut veya satılabilir gibi gösterme.
- **Bir platform veya özelliği, güncel `DECISIONS`, `ROADMAP` ve `TECHNICAL_CONTEXT` tarafından doğrulanmadan destekleniyor veya tamamlanmış gösterme.**
- Tamamlanmamış işi tamamlandı sayma; doğrulamasız "bitti" deme.
- Placeholder dosyayı kaynak olarak kullanma.
- Çelişkiyi sessizce çözme veya görmezden gelme.
- Secret/credential yazma veya loglama.
- Sürüm doğrulamadan komut/kod üretme.
- Dark pattern veya yanıltıcı içerik üretme (ilgili Bible yasak setleri).

## 17. Bakım Kuralları

- Bu dosya araçtan bağımsız kalır; belirli bir araca özel talimat buraya yazılmaz (araca özel dosyalar, örn. `CLAUDE.md`, yalnızca bu dosyaya yönlendirir).
- Bu dosya çalışma biçimi kurallarını tutar; ürün kararı, teknik bilgi, değişken proje durumu veya roadmap işi buraya yazılmaz.
- Değişiklikler §6 taslak-onay akışıyla yapılır ve mevcut kuralların anlamını bozamaz.
- Expo sürüm uyarısı (§13), proje Expo sürümü değişmedikçe aynen korunur; sürüm değişirse bağlantı yeni sürüme güncellenir.
