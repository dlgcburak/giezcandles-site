# Supabase Storage (S3) Kurulum Rehberi

Vercel'de resimlerin kalıcı olması için **Supabase Storage** kullanmamız gerekiyor. Şu adımları takip edin:

## 1. Supabase Panelinde Bucket Oluşturma
1.  Supabase projenize gidin.
2.  Sol menüden **Storage** seçeneğine tıklayın.
3.  **"New Bucket"** butonuna basın.
4.  Bucket adını `media` (veya `giez-media`) yapın.
5.  **"Public Bucket"** seçeneğini işaretleyin.
6.  Kaydedin.

## 2. Erişim Anahtarlarını (S3 Keys) Alma
1.  Supabase panelinde **Project Settings** > **Storage** (veya API) bölümüne gidin.
2.  **S3 Access Keys** bölümünü bulun.
3.  Eğer yoksa "Generate New Key" deyin.
4.  `Access Key ID` ve `Secret Access Key` değerlerini kopyalayın.

## 3. Vercel Environment Variables Ayarı
Vercel projenize (Environment Variables) şu değerleri ekleyin:

| Değişken | Değer |
| :--- | :--- |
| `S3_ACCESS_KEY_ID` | (Kopyaladığınız Access Key) |
| `S3_SECRET_ACCESS_KEY` | (Kopyaladığınız Secret Key) |
| `S3_REGION` | `eu-central-1` (veya Supabase bölgeniz, örn: `us-east-1` - Supabase ayarlarında yazar) |
| `S3_ENDPOINT` | `https://[PROJECT-REF].supabase.co/storage/v1/s3` (URL'nizi Settings > Storage'da bulabilirsiniz) |
| `S3_BUCKET` | `media` (Oluşturduğunuz bucket adı) |

## 4. Kod Entegrasyonu (Benim Yapacağım Kısım)
Siz bu ayarları Vercel'e ekledikten sonra, ben `payload.config.ts` dosyasına `@payloadcms/storage-s3` eklentisini kurup ayarlayacağım.

**Bu adım için bana onay verin:** "S3 Ayarlarını Vercel'e ekledim, eklentiyi kurabilirsin" derseniz kod tarafını halledeceğim.
