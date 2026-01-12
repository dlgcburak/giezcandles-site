import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Media } from '@/payload-types'

// Replicating Product Props closely matches Payload Type
type Product = {
    id: string
    title: string
    slug?: string
    priceTRY: number
    image?: Media | null
    fallbackImage?: string
    collection?: any
    showDetailsButton?: boolean
    pricePosition?: 'bottom' | 'overlay'
}

type Props = {
    introContent?: any // RichText
    populateBy: 'collection' | 'selection'
    selectedDocs?: Product[]
    populatedDocs?: Product[]
    relation?: any // The collection object if populateBy === 'collection'
}

const ProductCard = ({ product }: { product: Product }) => {
    // Resolve Image URL
    const imageUrl = typeof product.image === 'object' && product.image?.url
        ? product.image.url
        : (product.fallbackImage ? `/images/${product.fallbackImage}` : '/images/logo.png')

    // Use slug for URL, fallback to id if slug doesn't exist
    const productHref = `/product/${product.slug || product.id}`

    // Show button by default (true) unless explicitly set to false
    const showButton = product.showDetailsButton !== false

    // Price position: 'bottom' (default) or 'overlay'
    const pricePosition = product.pricePosition || 'bottom'
    const isOverlayPrice = pricePosition === 'overlay'

    return (
        <article className="card product">
            <div className="media" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                {/* Overlay Price */}
                {isOverlayPrice && (
                    <div style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(72, 24, 40, 0.9)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}>
                        ₺ {product.priceTRY}
                    </div>
                )}
            </div>
            <div className="body">
                <h3>{product.title}</h3>
                <div className="meta">
                    {/* Tags mocked or from product if available */}
                    <span className="pill">El yapımı</span>
                    {/* Bottom Price - only show if not overlay */}
                    {!isOverlayPrice && (
                        <span className="price">₺ {product.priceTRY}</span>
                    )}
                </div>
            </div>
            {/* Actions - only show if showButton is true */}
            {showButton && (
                <div className="actions">
                    <Link className="btn primary" href={productHref} style={{ flex: 1, textAlign: 'center' }}>
                        İncele
                    </Link>
                </div>
            )}
        </article>
    )
}

export const ArchiveBlock: React.FC<Props> = ({ introContent, selectedDocs, populatedDocs, relation }) => {
    const products = populatedDocs || selectedDocs || []
    const collectionTitle = (relation && typeof relation === 'object') ? relation.title : null

    return (
        <section id="urunler" className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            {/* Intro Content (Rich Text) handles Section Title */}
            {introContent && (
                <div className="sectionTitle" style={{ marginBottom: collectionTitle ? '10px' : '30px' }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Koleksiyonlar</h2>
                        <p style={{ display: 'none' }}>{/* Hidden if we have collection title below */}</p>
                    </div>
                </div>
            )}

            {collectionTitle && (
                <div style={{ gridColumn: "span 12", padding: "2px 4px", marginBottom: "24px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            gap: 12,
                            margin: "8px 0 4px",
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontFamily: "'Playfair Display',serif",
                                fontSize: 24,
                                color: "var(--brand-900)",
                            }}
                        >
                            {collectionTitle}
                        </h3>
                    </div>
                    <div style={{ height: 1, background: "rgba(72,24,40,.10)" }} />
                </div>
            )}

            <div className="grid">
                {products.length > 0 ? (
                    products.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <div style={{ gridColumn: 'span 12', padding: 40, textAlign: 'center', color: 'var(--muted)', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                        Bu koleksiyonda henüz ürün bulunamadı.
                    </div>
                )}
            </div>
        </section>
    )
}
