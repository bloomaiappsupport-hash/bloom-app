# BLOOM — PRODUCT BIBLE (Ürün Anayasası)

> Bu doküman BLOOM'un uzun yıllar değişmeyecek temel ilkelerini tanımlar. Roadmap, sprint, teknik detay veya geçici kararlar burada yer almaz — onlar `docs/core/ROADMAP.md`, `docs/core/BACKLOG.md` ve `docs/audits/` dosyalarına aittir. Kaynak: `BLOOM_DENETIM_RAPORU.md` ve `BLOOM_PRODUCT_LEAD_KARAR_DOKUMANI.md`.

## 1. Ürün Kimliği
BLOOM, bireyin alışkanlıklarını takip etmesini, bir yapay zeka koçuyla motive olmasını ve süreklilik (streak) yoluyla kalıcı davranış kazanmasını sağlayan bir alışkanlık koçu uygulamasıdır. Freemium + abonelik modeliyle çalışır ve tek bir geliştirici tarafından sürdürülür. Kimliğinin merkezinde üç ayak vardır: **takip, koç, süreklilik.**

## 2. Vizyon
İnsanların büyük hedefleri değil, küçük ve sürdürülebilir günlük adımları güvenle inşa ettiği; bir koçun yanlarında olduğunu hissettikleri sakin ve dürüst bir alışkanlık deneyimi olmak.

## 3. Misyon
Kullanıcının çekirdek döngüsünü — alışkanlığı takip et, tamamla, seriyi koru, koçtan destek al — güvenilir, anlaşılır ve zorlamayan bir biçimde çalışır kılmak. Karmaşıklık değil süreklilik satmak.

## 4. Temel Ürün İlkeleri
- **Öncelik sırası (tüm kararların referansı):** güven → çekirdek deneyim → retention → gelir → growth → yeni özellik. Bir karar veya iş önceliklendirilirken bu sıralama esas alınır; alttaki bir halka, üstteki bir halkanın önüne asla geçmez. Örneğin gelir, güveni veya çekirdek deneyimi zedeliyorsa reddedilir; yeni özellik ise ancak tüm üst halkalar sağlamken düşünülür.
- **Önce mevcut deneyimi iyileştir.** Yeni bir özellik eklemeden önce, sorun mevcut akışın iyileştirilmesiyle çözülebilir mi diye sorulur. Bu ilke her ürün kararının önündedir.
- **Çekirdek üç ayak korunur:** takip, koç, süreklilik. Bunları güvenilir kılmak, yeni özellik eklemekten her zaman önceliklidir.
- **Sadelik varsayılan, karmaşıklık istisnadır.** Her yeni parça kalıcı bir bakım vergisidir ve bu yükü hak etmelidir.
- **Güvenilirlik gösterişten önce gelir.** Reklamı yapılan her şey gerçekten çalışmalıdır.

## 5. Güven İlkeleri
- **Satılan her özellik teslim edilir.** Var olmayan veya çalışmayan bir özellik hiçbir zaman ücretli planda gösterilmez. (Kaynak: denetim raporundaki "reklamı yapılan ama teslim edilmeyen özellik" bulgusu ve karar dokümanının bunu paywall'dan kaldırma kararı.)
- **Para yolu dürüst ve güvenilirdir.** Ödeme, doğrulama ve abonelik durumu net, sızıntısız ve kullanıcı lehine şeffaf olmalıdır.
- **Karanlık desen (dark pattern) kullanılmaz.** Sahte kıtlık, gizli iptal, yanıltıcı fiyatlama veya zorlama yoktur.
- **Kullanıcının verisi ve gizliliği korunur.** Gerekmeyen izin istenmez; gizlilik varsayılan olarak gözetilir.

## 6. Kapsam İlkesi
BLOOM özellik zenginliğiyle değil, çekirdek deneyimin kalitesiyle yarışır. **Feature creep en büyük risktir.** Bir fikir çekirdek üç ayağa hizmet etmiyorsa, PMF'e katkısı kanıtlanana kadar ertelenir. Pre-PMF aşamasında kapsam genişletmek değil, daraltmak ve sağlamlaştırmak esastır.

## 7. Marka Karakteri
Sakin, destekleyici ve dürüst bir koç. Bağırmaz, suçlamaz, abartılı motivasyon klişeleri kurmaz. Kullanıcının yanında duran, küçük ilerlemeyi kutlayan, baskı yapmadan hatırlatan bir karakter. Güven veren, gösterişsiz, olgun.

## 8. Marka Dili
Kısa, samimi, pratik ve empatik. Boş motivasyon cümleleri yerine somut ve nazik yönlendirme. Kullanıcıyla onun dilinde konuşur (TR/EN tam eşdeğerlikte); hiçbir ekranda dil karışıklığına izin verilmez. Ton her yerde tutarlıdır: koç, paywall, bildirim ve hata mesajları aynı sesle konuşur.

## 9. Tasarım Felsefesi
Karanlık temelli, editoryal-minimalist ve tutarlı bir arayüz. Tek aksan rengi disiplini, net hiyerarşi ve algılanan akıcılık (hızlı, akıcı geçişler, iyimser arayüz, dokunsal geri bildirim) önceliklidir. Tasarım dikkat dağıtmaz; kullanıcının çekirdek döngüyü sürtünmesiz tamamlamasına hizmet eder. Erişilebilirlik ikinci sınıf değildir — okunabilirlik ve ekran okuyucu desteği tasarımın parçasıdır.

## 10. Hedef Kullanıcı *(hipotez — kullanıcı verisiyle doğrulanmalı 🟡)*
Kendini geliştirmek isteyen; fitness, zihinsel iyilik, kariyer veya kişisel gelişim gibi alanlarda alışkanlık kurmakta zorlanan bireyler. Ana engelleri motivasyon, zaman, unutma ve zorluk algısıdır. Bu profil, uygulamanın kendi değerlendirme akışındaki sorulardan türetilmiş bir **hipotezdir** ve gerçek kullanım verisiyle doğrulanana kadar kesin kabul edilmez.

## 11. Kimler İçin Uygun Değildir?
BLOOM herkes için değildir; kapsamını korumak için dışarıda bırakılan kullanıcı tipleri açıkça tanımlanır:
- Alışkanlık takibi değil, karmaşık proje/görev yönetimi arayan kullanıcılar.
- Genel amaçlı bir yapay zeka sohbeti bekleyen kullanıcılar — koç yalnızca alışkanlık, motivasyon ve süreklilik bağlamında konuşur.
- Klinik/tıbbi tedavi ya da profesyonel terapi yerine geçecek bir araç arayanlar; BLOOM bir sağlık ürünü değildir.
- Zorlayıcı, ceza temelli veya baskıcı bir "disiplin" mekaniği isteyen kullanıcılar — ürün karakteri destekleyicidir, cezalandırıcı değildir.
- Alışkanlıklarını takip etme niyeti olmadan yalnızca tek seferlik bir çözüm arayan kullanıcılar; ürün süreklilik üzerine kuruludur.

## 12. Değer Önerisi
"Alışkanlıklarını takip et, bir yapay zeka koçuyla motive ol, süreklilikle kalıcı hale getir." Kullanıcıya vaat: büyük irade değil, küçük ve sürdürülebilir adımlarla ilerleme ve bu yolda yalnız olmama hissi.

## 13. Rakiplere Yaklaşım
Rakipler referanstır, şablon değildir. "Rakip böyle yapıyor" tek başına bir gerekçe olamaz; her karar BLOOM'un kendi kullanıcısı, aşaması ve stratejisiyle gerekçelendirilir. Rakipleri kopyalamak değil, çekirdek deneyimi kendi kullanıcısı için daha güvenilir kılmak yoluyla farklılaşılır.

## 14. PMF Öncelikleri
Pre-PMF aşamasında sıralama nettir: **çekirdek değer → retention → güven.** Erken monetizasyon optimizasyonu, A/B denemeleri veya ölçekleme işleri bu aşamada birer dikkat dağıtıcıdır ve ertelenir. Önce ürün güvenilir ve dürüst çalışmalı, sonra büyüme optimize edilmelidir.

## 15. Gelir Felsefesi
Freemium temeli: ücretsiz plan gerçek ve kullanılabilir değer verir; premium bunu **gerçekten teslim edilen** özelliklerle genişletir. Gelir dürüstlükten ödün vererek elde edilmez. İlk kural, yeni gelir "kazanmadan" önce sızan geliri durdurmaktır. Fiyatlama ve abonelik şeffaftır; kullanıcı ne için ödediğini net bilir.

## 16. Karar Verme Kuralları
- Her karar kullanıcı değeri, güven, gelir, retention, geliştirme ve bakım maliyetini **birlikte** tartar; tek eksende kazanıp diğerinde kaybeden karar reddedilir.
- **Fırsat maliyeti her zaman hesaplanır.** Tek geliştirici gerçekliğinde her "evet" başka bir işe "hayır"dır.
- En değerli karar çoğu zaman "hayır" ya da "henüz değil"dir.
- Kanıtlanmamış varsayım, doğrulanmış veriden ayrı tutulur; ürün yanlış varsayımlar üzerine inşa edilmez.
- Güveni yakan hiçbir kazanç kabul edilmez.

## 17. Başarı Ölçütleri *(ilke düzeyinde — sayısal hedefler KPI dosyasına aittir)*
BLOOM için başarı, indirme sayısı değil; kullanıcının çekirdek döngüyü sürdürmesidir. İlke düzeyinde başarı şu anlama gelir: kullanıcı sorunsuz aktive olur (kayıt→ilk değer), düzenli geri döner (retention), ürüne güvenir (dürüst deneyim) ve premium'a değer gördüğü için geçer. Somut metrikler ve hedefler `docs/business/KPI.md`'de tanımlanır; bu doküman yalnızca başarının **ne anlama geldiğini** sabitler.

## 18. Doküman Sistemi
Bu anayasa, BLOOM'un kalıcı doküman sisteminin merkezindedir:
- `docs/core/` — ürün anayasası, teknik bağlam, kararlar, roadmap, backlog.
- `docs/audits/` — denetim raporu ve Product Lead karar dokümanı (bu anayasanın kaynakları).
- `docs/business/` — monetizasyon, pazarlama, büyüme ve KPI.

PRODUCT_BIBLE değişmez ilkeleri tutar; geçici, ölçülebilir veya zamanla değişen her şey ilgili diğer dosyalara yazılır.

**Çelişki halinde esas alınacak kaynak:**
- **Ürün ilkeleri** için → `PRODUCT_BIBLE`
- **Teknik gerçek** için → `TECHNICAL_CONTEXT`
- **Kesin kararlar** için → `DECISIONS`
- **Aktif işler** için → `ROADMAP`

---

## Değişiklik Özeti
- **Eklendi:** "Kimler İçin Uygun Değildir?" bölümü (§11) — yalnızca kapsam dışı kullanıcı tipleri; yeni özellik eklenmedi.
- **Eklendi:** "Öncelik sırası" ilkesi (§4 Temel Ürün İlkeleri'nin başına) — güven → çekirdek deneyim → retention → gelir → growth → yeni özellik.
- **Eklendi:** "Doküman Sistemi" (§18) sonuna çelişki halinde esas alınacak kaynak kuralı (PRODUCT_BIBLE / TECHNICAL_CONTEXT / DECISIONS / ROADMAP).
- **Eklendi:** Bu "Değişiklik Özeti" bölümü.
- **Not:** "Kimler İçin Uygun Değildir?" eklendiği için sonraki bölümler yeniden numaralandı (12–18); içerikleri **değiştirilmedi.** Bu dört revizyon dışında hiçbir bölümün metnine dokunulmadı.
