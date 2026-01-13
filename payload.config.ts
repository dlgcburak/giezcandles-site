import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { SiteSettings } from './globals/SiteSettings'
import * as tr from 'payload/i18n/tr'
import * as en from 'payload/i18n/en'
import { Collections } from './collections/Collections'
import { Pages } from './collections/Pages'







const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl: process.env.DATABASE_URI?.includes('localhost') ? false : { rejectUnauthorized: false },
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      disableLocalStorage: true,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'eu-central-1', // Default to eu-central-1 if missing
        endpoint: process.env.S3_ENDPOINT || '',
        forcePathStyle: true, // Needed for Supabase
      },
    }),
  ],
  sharp,
  collections: [Pages, Users, Media, Collections, Products],
  globals: [SiteSettings],
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Giez Candles Admin',
      icons: [{
        rel: 'icon',
        type: 'image/png',
        url: '/images/logo.png',
      }],
    },
    components: {
      graphics: {
        Logo: './components/PayloadLogo',
        Icon: './components/PayloadIcon',
      },
    },
  },



  onInit: async (payload) => {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      payload.logger.info('Auto-seeding Home Page...')
      const mediaDesc = await payload.find({ collection: 'media', limit: 1 })
      const defaultImage = mediaDesc.docs[0]?.id

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Ana Sayfa',
          slug: 'home',
          layout: [
            {
              blockType: 'hero',
              type: 'default',
              title: 'Butik mumlar, sıcak bir his',
              subtitle: 'Giez Candle ile evine ve sevdiklerine küçük ama etkili bir dokunuş.',
              images: defaultImage ? [{ image: defaultImage }] : [],
            },
            {
              blockType: 'archive',
              introContent: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'heading',
                      tag: 'h2',
                      format: 'center',
                      version: 1,
                      children: [{ type: 'text', text: 'Öne Çıkanlar', version: 1 }]
                    }
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  version: 1,
                }
              },
              populateBy: 'collection',
              limit: 4,
            },
            {
              blockType: 'content',
              title: 'Marka Hikayesi',
              alignment: 'center',
              backgroundColor: 'cream',
              richText: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      version: 1,
                      children: [
                        {
                          type: 'text',
                          text: 'Giez Candle, el yapımı ve küçük partiler halinde üretilen butik mumlardan oluşur. Her tasarım, sıcak bir atmosfer ve özel bir hediye deneyimi hedefler.',
                        },
                      ],
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  version: 1,
                }
              },
            },
          ],
        },
      })
      payload.logger.info('Home Page auto-seeded successfully.')
    }
  },

  i18n: {
    fallbackLanguage: 'tr',
    supportedLanguages: {
      tr: tr.tr,
      en: en.en,
    },
    translations: {
      tr: {
        translations: {
          general: {
            collections: 'Koleksiyonlar',
            globals: 'Genel Ayarlar',
            createNew: 'Yeni Oluştur',
            createNewLabel: 'Yeni öğe oluştur',
            searchBy: 'Ürün adına göre ara',
            columns: 'Sütunlar',
            filters: 'Filtreler',
            delete: 'Sil',
            edit: 'Düzenle',
            cancel: 'İptal',
            back: 'Geri',
            save: 'Kaydet',
          },
          authentication: {
            users: 'Kullanıcılar',
          },
          dashboard: {
            collections: 'Koleksiyonlar',
          },
        },
      },
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ].filter(Boolean) as string[],
})
