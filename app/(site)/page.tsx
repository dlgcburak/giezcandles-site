import HomeClient from '@/components/HomeClient'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'

type ProductDoc = {
  id: string
  title: string
  collection?:
  | string
  | null
  | {
    id: string
    title?: string | null
    slug?: string | null
    subtitle?: string | null
    order?: number | null
  }
  | {
    relationTo: 'collections'
    value:
    | string
    | {
      id: string
      title?: string | null
      slug?: string | null
      subtitle?: string | null
      order?: number | null
    }
  }
  priceTRY: number
  tags?: { tag: string }[] | string[] | null
  fallbackImage?: string | null
  image?: { url?: string | null } | null
  description?: string | null
  order?: number | null
}

type MediaDoc = {
  id: string
  url?: string | null
  filename?: string | null
}

type SiteDoc = {
  heroTitle?: string
  heroSubtitle?: string
  storyTitle?: string
  storyText?: string
  whatsappNumber?: string
  etsyUrl?: string
  shopierUrl?: string
  facebookUrl?: string
  instagramUrl?: string
  logo?: MediaDoc | null
  heroImages?: {
    id?: string
    image?: MediaDoc | null
    fallbackImage?: string | null
    alt?: string | null
  }[]
}

type CollectionDoc = {
  id: string
  title: string
  subtitle?: string | null
  order?: number | null
  slug?: string | null
}

const FALLBACK_SETTINGS: SiteDoc = {
  heroTitle: 'Butik mumlar, sıcak bir his',
  heroSubtitle: 'Giez Candle ile evine ve sevdiklerine küçük ama etkili bir dokunuş.',
  storyTitle: 'Marka Hikayesi',
  storyText:
    'Giez Candle, el yapımı ve küçük partiler halinde üretilen butik mumlardan oluşur. Her tasarım, sıcak bir atmosfer ve özel bir hediye deneyimi hedefler.',
  whatsappNumber: '+905346069871',
  etsyUrl: 'https://www.etsy.com/shop/GiezCandles?ref=shop_profile&listing_id=4431094665',
  shopierUrl: 'https://www.shopier.com/giezcandle',
  facebookUrl: 'https://www.facebook.com/giezcandlee/',
  instagramUrl: 'https://www.instagram.com/giezcandle/',
  heroImages: [
    { fallbackImage: 'FlowerGarden.png', alt: 'Flower Garden — martini kadehinde çiçekli mum' },
    { fallbackImage: 'PeonyFire.png', alt: 'Peony Fire — pembe çiçekli mum' },
    { fallbackImage: 'PinkberryJam.png', alt: 'Pinkberry Jam — kırmızı meyveli mum' },
    { fallbackImage: 'PurpleberryJam.png', alt: 'Purpleberry Jam — mor meyveli mum' },
  ],
}

const FALLBACK_COLLECTIONS: CollectionDoc[] = [
  { id: 'uncategorized', title: 'Ürünlerimiz', subtitle: '', order: 10, slug: 'uncategorized' },
]

const FALLBACK_PRODUCTS: ProductDoc[] = [
  {
    id: 'fallback-flower-garden',
    title: 'Flower Garden',
    collection: { id: 'uncategorized', slug: 'uncategorized', title: 'Ürünlerimiz' },
    priceTRY: 250,
    tags: ['Çiçek temalı', 'Cam kadeh'],
    fallbackImage: 'FlowerGarden.png',
    image: null,
    description: '',
    order: 10,
  },
  {
    id: 'fallback-peony-fire',
    title: 'Peony Fire',
    collection: { id: 'uncategorized', slug: 'uncategorized', title: 'Ürünlerimiz' },
    priceTRY: 250,
    tags: ['Çiçek temalı', 'Minimal etiket'],
    fallbackImage: 'PeonyFire.png',
    image: null,
    description: '',
    order: 20,
  },
  {
    id: 'fallback-pinkberry-jam',
    title: 'Pinkberry Jam',
    collection: { id: 'uncategorized', slug: 'uncategorized', title: 'Ürünlerimiz' },
    priceTRY: 250,
    tags: ['Meyve temalı', 'Katmanlı görünüm'],
    fallbackImage: 'PinkberryJam.png',
    image: null,
    description: '',
    order: 30,
  },
  {
    id: 'fallback-purpleberry-jam',
    title: 'Purpleberry Jam',
    collection: { id: 'uncategorized', slug: 'uncategorized', title: 'Ürünlerimiz' },
    priceTRY: 250,
    tags: ['Meyve temalı', 'Canlı renk'],
    fallbackImage: 'PurpleberryJam.png',
    image: null,
    description: '',
    order: 40,
  },
  {
    id: 'fallback-snow',
    title: 'Snow Flakes',
    collection: { id: 'uncategorized', slug: 'uncategorized', title: 'Ürünlerimiz' },
    priceTRY: 250,
    tags: ['Yılbaşı', 'Minimal', 'El yapımı'],
    fallbackImage: 'unnamed-3.jpg',
    image: null,
    description: '',
    order: 10,
  },
  {
    id: 'fallback-winter',
    title: 'Winter Collection',
    collection: { id: 'uncategorized', slug: 'uncategorized', title: 'Ürünlerimiz' },
    priceTRY: 250,
    tags: ['Yılbaşı', 'Kış', 'Dekor'],
    fallbackImage: 'unnamed.jpg',
    image: null,
    description: '',
    order: 20,
  },
  {
    id: 'fallback-christmas',
    title: 'Happy Christmas Trees',
    collection: { id: 'uncategorized', slug: 'uncategorized', title: 'Ürünlerimiz' },
    priceTRY: 250,
    tags: ['Yılbaşı', 'Hediye', 'Kutu sunum'],
    fallbackImage: 'unnamed-2.jpg',
    image: null,
    description: '',
    order: 30,
  },
]





// ... Keep types and fallbacks as they are useful for the Legacy mode ...
// For brevity in diff, assume TYPES and FALLBACK CONSTANTS remain above. 
// I will just reuse the existing file structure in the replace, 
// targeting the Page function itself.

import { draftMode } from 'next/headers'
import { PagePreviewClient } from '@/components/PagePreviewClient'

// ... imports

export default async function Page() {
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config })

  // 1. Try to find a dynamic "Home" page
  const homePageResult = await payload.find({
    collection: 'pages',
    draft: isDraft,
    where: {
      slug: {
        equals: 'home',
      },
    },
    depth: 3, // Ensure we get image URLs and relation data
  })

  const homePage = homePageResult.docs?.[0]

  // 2. If dynamic page exists, populate and render it!
  if (homePage) {
    // Populate dynamic blocks (e.g. Archive blocks fetch their collections)
    if (homePage.layout && Array.isArray(homePage.layout)) {
      await Promise.all(
        homePage.layout.map(async (block: any) => {
          if (block.blockType === 'archive' && block.populateBy === 'collection' && block.relation) {
            // Handle multiple collections
            const relations = Array.isArray(block.relation) ? block.relation : [block.relation]

            // Build a map of collection order for sorting
            const collectionOrderMap = new Map<string, number>()
            relations.forEach((rel: any, index: number) => {
              const id = typeof rel === 'object' ? rel.id : rel
              const order = typeof rel === 'object' && rel.order != null ? rel.order : index
              collectionOrderMap.set(id, order)
            })

            // Get all collection IDs
            const collectionIds = relations.map((rel: any) =>
              typeof rel === 'object' ? rel.id : rel
            )

            // Fetch products for all selected collections
            const productsResult = await payload.find({
              collection: 'products',
              where: {
                collection: {
                  in: collectionIds,
                },
              },
              limit: block.limit || 100,
              depth: 2,
            })

            // Sort products by their collection's order
            block.populatedDocs = productsResult.docs.sort((a: any, b: any) => {
              const aCollectionId = typeof a.collection === 'object' ? a.collection.id : a.collection
              const bCollectionId = typeof b.collection === 'object' ? b.collection.id : b.collection
              const aOrder = collectionOrderMap.get(aCollectionId) ?? 999
              const bOrder = collectionOrderMap.get(bCollectionId) ?? 999
              return aOrder - bOrder
            })

            // Store relations for component to access
            block.populatedRelations = relations
          }
        }),
      )
    }

    return (
      <main>
        <PagePreviewClient initialData={homePage} />
      </main>
    )
  }
  // ...

  // 3. Fallback: Legacy Hardcoded Home
  // ... (Existing logic below)

  // Globals (Site Settings)
  const doc = await payload.findGlobal({
    slug: 'site-settings',
    depth: 2,
  }).catch(() => FALLBACK_SETTINGS) as SiteDoc

  // Collections
  const collectionsRes = await payload.find({
    collection: 'collections',
    limit: 100,
    sort: 'order',
    depth: 0,
  }).catch(() => ({ docs: FALLBACK_COLLECTIONS }))

  // Products
  const productsRes = await payload.find({
    collection: 'products',
    limit: 100,
    sort: 'order',
    depth: 2,
  }).catch(() => ({ docs: FALLBACK_PRODUCTS }))

  const settings = {
    heroTitle: doc.heroTitle || FALLBACK_SETTINGS.heroTitle,
    heroSubtitle: doc.heroSubtitle || FALLBACK_SETTINGS.heroSubtitle,
    storyTitle: doc.storyTitle || FALLBACK_SETTINGS.storyTitle,
    storyText: doc.storyText || FALLBACK_SETTINGS.storyText,
    whatsappNumber: doc.whatsappNumber || FALLBACK_SETTINGS.whatsappNumber,
    etsyUrl: doc.etsyUrl || FALLBACK_SETTINGS.etsyUrl,
    shopierUrl: doc.shopierUrl || FALLBACK_SETTINGS.shopierUrl,
    facebookUrl: doc.facebookUrl || FALLBACK_SETTINGS.facebookUrl,
    instagramUrl: doc.instagramUrl || FALLBACK_SETTINGS.instagramUrl,
    logo: doc.logo || null,
    heroImages: doc.heroImages || FALLBACK_SETTINGS.heroImages,
  }

  const products = (productsRes.docs || FALLBACK_PRODUCTS).map((p) => {
    const raw = p.collection as any
    const relation =
      raw && typeof raw === 'object' && 'relationTo' in raw && raw.relationTo === 'collections'
        ? raw.value
        : raw

    const collection =
      relation && typeof relation === 'object'
        ? {
          id: relation.id,
          title: relation.title || '',
          slug: relation.slug || relation.title?.toLowerCase().replace(/\s+/g, '-'),
          subtitle: relation.subtitle || '',
          order: relation.order ?? 0,
        }
        : typeof relation === 'string'
          ? { id: relation, title: relation, slug: relation }
          : null

    return {
      id: String(p.id),
      title: p.title,
      collection,
      priceTRY: p.priceTRY,
      tags: Array.isArray(p.tags)
        ? typeof p.tags[0] === 'string'
          ? (p.tags as string[])
          : (p.tags as any[]).map((t) => t.tag)
        : [],
      fallbackImage: p.fallbackImage,
      image: (p.image && typeof p.image === 'object' ? p.image : null),
      description: p.description || '',
      order: p.order ?? 0,
    }
  })

  const collections = (collectionsRes.docs || FALLBACK_COLLECTIONS).map((c) => ({
    id: String(c.id),
    title: c.title,
    subtitle: c.subtitle || '',
    order: c.order ?? 0,
    slug: c.slug || c.title?.toLowerCase().replace(/\s+/g, '-'),
  }))

  return <HomeClient settings={settings} products={products} collections={collections} />
}

