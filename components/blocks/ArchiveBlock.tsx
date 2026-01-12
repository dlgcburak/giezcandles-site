import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Media } from '@/payload-types'

// Replicating Product Props closely matches Payload Type
type Product = {
    id: string
    title: string
    priceTRY: number
    image?: Media | null
    fallbackImage?: string
    collection?: any
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

    return (
        <article className="card product">
            <div className="media">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
            <div className="body">
                <h3>{product.title}</h3>
                <div className="meta">
                    {/* Tags mocked or from product if available */}
                    <span className="pill">El yapımı</span>
                    <span className="price">₺ {product.priceTRY}</span>
                </div>
            </div>
            <div className="actions">
                {/* 
                  Note: The original had 'Fotoğrafı Aç' which requires Lightbox state.
                  Blocks are stateless. We might need a Global Context for Lightbox 
                  or just link to the product page in this new architecture.
                  Transitioning to Product Page link for better UX in CMS structure.
                */}
                <Link className="btn primary" href={`/product/${product.id}`} style={{ flex: 1, textAlign: 'center' }}>
                    İncele
                </Link>
            </div>
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
