import EditPageClient from '@/components/EditPageClient'
import { ProductProps, SettingsProps } from '@/components/HomeClient'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function EditPage() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login?redirect=/edit')
  }

  // Globals (Site Settings)
  const settingsDoc: any = await payload.findGlobal({
    slug: 'site-settings',
    depth: 2,
  }).catch(() => ({}))

  const settings: SettingsProps = {
    heroTitle: settingsDoc?.heroTitle || 'Butik mumlar, sıcak bir his',
    heroSubtitle: settingsDoc?.heroSubtitle || 'Giez Candle ile evine ve sevdiklerine küçük ama etkili bir dokunuş.',
    storyTitle: settingsDoc?.storyTitle || 'Marka Hikayesi',
    storyText:
      settingsDoc?.storyText ||
      'Giez Candle, el yapımı ve küçük partiler halinde üretilen butik mumlardan oluşur. Her tasarım, sıcak bir atmosfer ve özel bir hediye deneyimi hedefler.',
    whatsappNumber: settingsDoc?.whatsappNumber || '+905346069871',
    etsyUrl: settingsDoc?.etsyUrl || 'https://www.etsy.com/shop/GiezCandles?ref=shop_profile&listing_id=4431094665',
    shopierUrl: settingsDoc?.shopierUrl || 'https://www.shopier.com/giezcandle',
    facebookUrl: settingsDoc?.facebookUrl || 'https://www.facebook.com/giezcandlee/',
    instagramUrl: settingsDoc?.instagramUrl || 'https://www.instagram.com/giezcandle/',
    logo: settingsDoc?.logo || null,
    heroImages: settingsDoc?.heroImages || [],
  }

  // Products
  const productsRes = await payload.find({
    collection: 'products',
    limit: 200,
    sort: 'order',
    depth: 2,
  }).catch(() => ({ docs: [] }))

  const products: ProductProps[] = (productsRes.docs || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    collection: p.collection,
    priceTRY: p.priceTRY,
    tags: Array.isArray(p.tags) ? p.tags.map((t: any) => (typeof t === 'string' ? t : t.tag)) : [],
    fallbackImage: p.fallbackImage,
    image: p.image || null,
    description: p.description || '',
    order: p.order ?? 0,
  }))

  return <EditPageClient initialSettings={settings} initialProducts={products} />
}
