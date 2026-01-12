import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Ayarları',
  admin: {
    description: 'Telefon numarası, sosyal medya linkleri, logo ve menüleri buradan yönetebilirsiniz.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Genel & Ana Sayfa',
          description: 'Sitenin giriş bölümü ve genel logosu.',
          fields: [
            {
              name: 'logo',
              label: 'Site Logosu',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: { description: 'Üst menüde görünecek marka logosu.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroTitle',
                  label: 'Ana Manşet (Başlık)',
                  type: 'text',
                  defaultValue: 'Butik mumlar, sıcak bir his',
                  admin: {
                    width: '50%',
                    description: 'Siteye girince çıkan büyük, çarpıcı yazı.'
                  },
                },
                {
                  name: 'heroSubtitle',
                  label: 'Alt Açıklama',
                  type: 'textarea',
                  defaultValue: 'Giez Candle ile evine ve sevdiklerine küçük ama etkili bir dokunuş.',
                  admin: {
                    width: '50%',
                    description: 'Başlığın hemen altındaki tamamlayıcı cümle.'
                  },
                },
              ]
            },
            {
              name: 'heroImages',
              label: 'Ana Sayfa Görsel Slider',
              type: 'array',
              maxRows: 4,
              labels: {
                singular: 'Görsel',
                plural: 'Görseller',
              },
              admin: { description: 'Sağ tarafta (mobilde altta) değişen görseller. En fazla 4 adet ekleyin.' },
              fields: [
                { name: 'image', label: 'Görsel Yükle', type: 'upload', relationTo: 'media', required: false },
                {
                  name: 'fallbackImage',
                  label: 'Yedek Dosya (Opsiyonel)',
                  type: 'text',
                  required: false,
                  admin: { description: 'Dosya adı (örn: Slide1.jpg). Sadece görsel yüklenmezse kullanılır.' },
                },
              ],
            },
          ],
        },
        {
          label: 'İletişim & Sosyal',
          description: 'Müşterilerin size ulaşacağı kanallar.',
          fields: [
            {
              name: 'whatsappNumber',
              label: 'WhatsApp Numarası',
              type: 'text',
              defaultValue: '+905346069871',
              admin: { description: 'Uluslararası formatta yazın (örn: +90534...). "Sipariş Ver" butonu bu numarayı açar.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'instagramUrl',
                  label: 'Instagram Linki',
                  type: 'text',
                  admin: { width: '50%' },
                  defaultValue: 'https://www.instagram.com/giezcandle/',
                },
                {
                  name: 'shopierUrl',
                  label: 'Shopier Linki',
                  type: 'text',
                  admin: { width: '50%' },
                  defaultValue: 'https://www.shopier.com/giezcandle',
                },
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'etsyUrl',
                  label: 'Etsy Linki',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'facebookUrl',
                  label: 'Facebook Linki',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ]
            },
          ],
        },
        {
          label: 'Menü Yönetimi',
          description: 'Üst menüdeki linkleri düzenleyin.',
          fields: [
            {
              name: 'navItems',
              label: 'Menü Yönetimi',
              labels: {
                singular: 'Menü Öğesi',
                plural: 'Menü Öğeleri',
              },
              admin: {
                description: 'Üst menüdeki linkleri ve butonları buradan yönetebilirsiniz. "Butik" görünüm için az sayıda öğe eklemeniz önerilir.',
              },
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      label: 'Etiket (Görünen İsim)',
                      type: 'text',
                      required: true,
                      admin: { width: '40%', placeholder: 'örn: Ürünlerimiz' },
                    },
                    {
                      name: 'appearance',
                      label: 'Görünüm',
                      type: 'select',
                      defaultValue: 'link',
                      options: [
                        { label: 'Normal Link', value: 'link' },
                        { label: 'Vurgulu Buton', value: 'button' },
                      ],
                      admin: { width: '30%' },
                    },
                    {
                      name: 'newTab',
                      label: 'Yeni Sekmede Aç',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '30%' },
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      label: 'Link Tipi',
                      type: 'radio',
                      defaultValue: 'page',
                      options: [
                        { label: 'Site İçi Sayfa', value: 'page' },
                        { label: 'Başka Siteye Link', value: 'custom' },
                      ],
                      admin: { width: '40%' },
                    },
                    {
                      name: 'page',
                      label: 'Bağlı Sayfa',
                      type: 'relationship',
                      relationTo: 'pages',
                      admin: {
                        condition: (_, siblingData) => siblingData.type === 'page',
                        width: '60%',
                        description: 'Oluşturduğunuz dinamik sayfalardan birini seçin.'
                      },
                    },
                    {
                      name: 'url',
                      label: 'URL / Adres',
                      type: 'text',
                      admin: {
                        condition: (_, siblingData) => siblingData.type === 'custom',
                        width: '60%',
                        placeholder: '/#iletisim veya https://google.com'
                      },
                    },
                  ]
                },
              ],
            },
          ],
        },
        {
          label: 'Hikaye Bölümü',
          fields: [
            {
              name: 'storyTitle',
              label: 'Başlık',
              type: 'text',
              defaultValue: 'Marka Hikayesi',
            },
            {
              name: 'storyText',
              label: 'Hikaye Metni',
              type: 'textarea',
              defaultValue:
                'Giez Candle, el yapımı ve küçük partiler halinde üretilen butik mumlardan oluşur. Her tasarım, sıcak bir atmosfer ve özel bir hediye deneyimi hedefler.',
            },
          ],
        },
      ],
    },
  ],
}
