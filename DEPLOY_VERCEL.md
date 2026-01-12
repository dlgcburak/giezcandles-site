# Vercel Dağıtım (Deployment) Kılavuzu (Güncel)

Projenizi Vercel'e yüklemek ve Admin Panelini aktif hale getirmek için aşağıdaki adımları izleyin.

## 1. Vercel Projesi Oluşturma
1.  Vercel Dashboard'a gidin ve **"Add New Project"** butonuna tıklayın.
2.  GitHub reponuzu (giezcandles-site) seçin ve **Import** diyin.

## 2. Environment Variables (Ortam Değişkenleri)
Dağıtım başlamadan önce **"Environment Variables"** bölümünü açın ve aşağıdaki değerleri ekleyin.

> **ÖNEMLİ:** `DATABASE_URI` olarak **Pooler** bağlantısını (port 6543) kullandığınızdan emin olun. Doğrudan bağlantı (port 5432) Vercel'de zaman aşımına uğrayabilir.

| Değişken Adı | Değer (Örnek / Açıklama) |
| :--- | :--- |
| `PAYLOAD_SECRET` | `(Rastgele uzun karmaşık bir şifre üretin)` |
| `DATABASE_URI` | `postgres://postgres.xkdwmppsvygzujndpjca:Buraz380325..@aws-1-eu-west-1.pooler.supabase.com:6543/postgres` |
| `NEXT_PUBLIC_SITE_URL` | `https://sizin-projeniz.vercel.app` (Vercel'in verdiği domain) |
| `NEXT_PUBLIC_PAYLOAD_URL` | `https://sizin-projeniz.vercel.app/api/preview` |

**Not:** `NEXT_PUBLIC_SITE_URL` değerini proje oluştuktan sonra Vercel size bir domain atadığında (örn: `giezcandles.vercel.app`) güncelleyebilirsiniz. İlk deploy'da boş veya tahmini bir değer olabilir.

## 3. Deploy
*   Değişkenleri ekledikten sonra **"Deploy"** butonuna basın.
*   Deploy işlemi bittiğinde size verilen URL'e gidin: `https://.../admin`
*   Giriş yapmayı deneyin (`admin@giez.com`).

## 4. Medya (Resimler) Uyarısı
Hatırlatma: Yüklediğiniz resimler Vercel'in geçici dosya sistemi nedeniyle **kalıcı olmayacaktır**. Admin paneli çalışacak, metinleri düzenleyebileceksiniz ama resimler bir süre sonra kaybolacaktır. Bunu çözmek için daha sonra "Cloud Storage" (S3/Supabase Storage) kurulumu yapmamız gerekecek.
