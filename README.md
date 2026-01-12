# giezcandles-site
Next.js + Payload CMS

Bu proje iki parçadan oluşur:
- Site: `/` (müşterilerin gördüğü sayfa)
- Admin panel: `/admin` (içerik / ürün yönetimi)

## 1) Kurulum (lokalde)
```bash
pnpm i
cp .env.example .env
# .env içine PAYLOAD_SECRET ve DATABASE_URI yaz
pnpm seed
pnpm dev
```

Tarayıcı:
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## 2) Ürün ekleme / düzenleme
Admin -> Products:
- Title, Collection, Price (TRY), Tags, Order
- Image: istersen Media yükleyip seçebilirsin
- FallbackImage: /public/images içindeki dosya adı (geçici)

## 3) Site ayarları
Admin -> Globals -> Site Settings:
- Hero / Story metinleri
- WhatsApp ve sosyal linkler
