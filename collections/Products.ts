import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Ürün',
    plural: 'Ürünler',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'collection', 'priceTRY', 'order'],
    description: 'Ürünlerinizi, fiyatlarını ve görsellerini buradan yönetin.',
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SITE_URL}/api/draft?url=/product/${doc.slug}&secret=${process.env.PAYLOAD_SECRET}`
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Temel Bilgiler',
          description: 'Ürünün ana bilgileri.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  label: 'Ürün Adı',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    placeholder: 'örn: Flower Garden',
                    description: 'Müşterinin göreceği ürün ismi.',
                  },
                },
                {
                  name: 'priceTRY',
                  label: 'Fiyat (₺)',
                  type: 'number',
                  required: true,
                  defaultValue: 250,
                  min: 0,
                  admin: {
                    width: '50%',
                    placeholder: 'örn: 250',
                    description: 'KDV dahil satış fiyatı.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'collection',
                  label: 'Koleksiyon',
                  type: 'relationship',
                  relationTo: 'collections',
                  required: false,
                  admin: {
                    width: '50%',
                    allowCreate: true,
                    allowEdit: true,
                    description: 'Ürünün ait olduğu seri (örn: Yılbaşı Serisi).',
                  },
                },
                {
                  name: 'order',
                  label: 'Sıralama Önceliği',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    width: '50%',
                    description: 'Düşük numara = Listenin başında çıkar. (örn: 1 en üstte)',
                  },
                },
              ]
            },
            {
              name: 'description',
              label: 'Ürün Açıklaması',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Ürünün hikayesi, kokusu ve detayları. (Kısa ve öz tutun)',
              },
            },
            {
              name: 'tags',
              label: 'Etiketler (Filtreleme)',
              type: 'array',
              labels: {
                singular: 'Etiket',
                plural: 'Etiketler',
              },
              fields: [
                {
                  name: 'tag',
                  label: 'Etiket İsmi',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'örn: çiçek, soya mumu' },
                },
              ],
              admin: {
                description: 'Arama yapılırken ürünün bulunmasını kolaylaştırır.',
              },
            },
          ],
        },
        {
          label: 'Görseller',
          description: 'Ürün fotoğrafları.',
          fields: [
            {
              name: 'image',
              label: 'Ana Görsel',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Ürün sayfasında ve listelerde çıkacak ana fotoğraf.',
              },
            },
            {
              name: 'fallbackImage',
              label: 'Yedek Görsel Yolu (Gelişmiş)',
              type: 'text',
              required: false,
              admin: {
                description: 'Eğer medya yüklenmediyse kullanılacak dosya adı. (Geliştirici içindir, boş bırakabilirsiniz)',
              },
            },
          ],
        },
        {
          label: 'SEO & Ayarlar',
          description: 'Linkleme ve URL ayarları.',
          fields: [
            {
              name: 'slug',
              label: 'URL Kısa Adı (Slug)',
              type: 'text',
              admin: {
                description: 'Otomatik oluşturulur. Ürün linki: /product/bu-alan',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (value || !data?.title) {
                      return value
                    }
                    return data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}
