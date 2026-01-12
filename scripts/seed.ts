import config from '@payload-config'
import { getPayload } from 'payload'

const products = [
  {
    "title": "Flower Garden",
    "collection": "flower",
    "priceTRY": 250,
    "tags": [
      "Çiçek temalı",
      "Cam kadeh"
    ],
    "fallbackImage": "FlowerGarden.png",
    "order": 10
  },
  {
    "title": "Peony Fire",
    "collection": "flower",
    "priceTRY": 250,
    "tags": [
      "Çiçek temalı",
      "Minimal etiket"
    ],
    "fallbackImage": "PeonyFire.png",
    "order": 20
  },
  {
    "title": "Pinkberry Jam",
    "collection": "flower",
    "priceTRY": 250,
    "tags": [
      "Meyve temalı",
      "Katmanlı görünüm"
    ],
    "fallbackImage": "PinkberryJam.png",
    "order": 30
  },
  {
    "title": "Purpleberry Jam",
    "collection": "flower",
    "priceTRY": 250,
    "tags": [
      "Meyve temalı",
      "Canlı renk"
    ],
    "fallbackImage": "PurpleberryJam.png",
    "order": 40
  },
  {
    "title": "Snow Flakes",
    "collection": "winter",
    "priceTRY": 250,
    "tags": [
      "Yılbaşı",
      "Minimal",
      "El yapımı"
    ],
    "fallbackImage": "unnamed-3.jpg",
    "order": 10
  },
  {
    "title": "Winter Collection",
    "collection": "winter",
    "priceTRY": 250,
    "tags": [
      "Yılbaşı",
      "Kış",
      "Dekor"
    ],
    "fallbackImage": "unnamed.jpg",
    "order": 20
  },
  {
    "title": "Happy Christmas Trees",
    "collection": "winter",
    "priceTRY": 250,
    "tags": [
      "Yılbaşı",
      "Hediye",
      "Kutu sunum"
    ],
    "fallbackImage": "unnamed-2.jpg",
    "order": 30
  }
]

const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'products',
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log('Products already exist, skipping seed.')
    process.exit(0)
  }

  for (const p of products) {
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        collection: p.collection as any,
        priceTRY: p.priceTRY,
        tags: (p.tags || []).map((t: string) => ({ tag: t })),
        fallbackImage: p.fallbackImage,
        order: p.order,
      },
    })
    console.log('Created:', p.title)
  }

  console.log('Seed done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
