import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'

// Helper to resolve Image URL
function resolveImageUrl(image: any): string | null {
    if (!image) return null
    if (typeof image === 'string') return image
    if (typeof image === 'object' && image.url) return image.url
    return null
}

type Props = {
    params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params
    const payload = await getPayload({ config })
    const { isEnabled: isDraftMode } = await draftMode()

    const result = await payload.find({
        collection: 'products',
        where: {
            slug: {
                equals: slug,
            },
        },
        depth: 2,
        draft: isDraftMode, // Critical for Live Preview
        limit: 1,
    })

    const product = result.docs?.[0]

    if (!product) {
        return notFound()
    }

    const imageUrl = resolveImageUrl(product.image) || (product.fallbackImage ? `/images/${product.fallbackImage}` : '/images/logo.png')
    const price = product.priceTRY
    // @ts-ignore
    const tags = (product.tags || []).map(t => typeof t === 'string' ? t : t.tag)

    return (
        <main className="min-h-screen pt-24 pb-16 bg-[#FDFBF7]">
            <RefreshRouteOnSave />

            <div className="container max-w-6xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-brand-900 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <Link href="/#urunler" className="hover:text-brand-900 transition-colors">Koleksiyonlar</Link>
                    <span>/</span>
                    <span className="text-brand-900 font-medium">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left: Image Gallery (Single for now) */}
                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-brand-900/10 shadow-xl bg-white">
                        <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col h-full justify-center">
                        <div className="mb-2">
                            {/* Collection Label if exists */}
                            {/* @ts-ignore */}
                            {product.collection?.title && (
                                <span className="inline-block px-3 py-1 rounded-full bg-brand-900/5 text-brand-900/80 text-xs font-bold tracking-wider uppercase mb-4">
                                    {/* @ts-ignore */}
                                    {product.collection.title}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-brand-900 mb-6 leading-tight">
                            {product.title}
                        </h1>

                        <div className="text-3xl font-inter font-light text-brand-900 mb-8">
                            ₺ {price}
                        </div>

                        <div className="prose prose-lg text-muted-foreground mb-10 font-inter leading-relaxed">
                            <p>{product.description || 'Bu ürün için henüz açıklama eklenmedi.'}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-10">
                            {tags.map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 border border-brand-900/20 rounded-lg text-sm text-brand-900/70">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <a
                                href={`https://wa.me/905346069871?text=Merhaba, ${product.title} siparişi vermek istiyorum.`}
                                target="_blank"
                                className="flex-1 bg-brand-900 text-white text-center py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                WhatsApp ile Sipariş Ver
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
