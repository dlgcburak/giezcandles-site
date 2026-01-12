import './site.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giez Candle',
  description: 'El yapımı, butik mumlar',
}

import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

// We need to fetch settings here to pass to Header/Footer
async function getSiteSettings() {
  const payload = await getPayload({ config })
  return await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  }).catch(() => ({})) // Empty fallback
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings() as any

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <SiteHeader settings={settings} />
        <main className="flex-1">
          {children}
        </main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
