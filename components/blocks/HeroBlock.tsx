import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Media } from '@/payload-types'

type Props = {
    title: string
    subtitle?: string
    images: {
        image: Media
        alt?: string
    }[]
    type: 'default' | 'minimal'
}

export const HeroBlock: React.FC<Props> = ({ title, subtitle, images }) => {
    // Logic to handle multiple images like the original slider/stack
    // For now, we'll implement the main structure.
    // Ideally, "images" in the block should populate the thumbs list.

    const mainImage = images?.[0]?.image
    const thumbImages = images?.slice(0, 4) || []

    return (
        <div className="container">
            <div className="heroGrid">
                <div className="card heroCopy">
                    <div className="kicker">✨ Sıcak, minimal ve butik</div>
                    <h1>{title}</h1>
                    <p className="lead">{subtitle}</p>

                    <div className="heroActions">
                        <Link className="btn primary" href="#urunler">
                            Ürünleri İncele
                        </Link>
                        {/* Note: Whatsapp number would ideally come from global settings, 
                            but blocks are isolated. We might need a context or just a generic link here. 
                            For now, keeping it generic. */}
                        <a
                            className="btn"
                            href="https://wa.me/905346069871" // Hardcoded fallback or need to pass globals to blocks
                            target="_blank"
                            rel="noopener"
                        >
                            Özel Sipariş (WhatsApp)
                        </a>
                    </div>

                    <div className="badges">
                        <div className="badge">🎁 Hediye için ideal</div>
                        <div className="badge">🕯️ Şık masa üstü sunum</div>
                        <div className="badge">🌿 Minimal & sıcak atmosfer</div>
                    </div>

                    <div className="divider"></div>
                </div>

                <div className="card heroVisual" aria-label="Öne çıkan görseller">
                    <div className="stack">
                        {thumbImages.map((item, index) => {
                            // Defensive check: ensure item.image is an object with a url
                            const imgUrl = (item.image && typeof item.image === 'object' && 'url' in item.image) ? item.image.url : null
                            const imgAlt = item.alt || 'Giez Candle Hero Image'

                            if (!item.image) return null

                            if (typeof item.image === 'string') {
                                console.warn('HeroBlock: Image is a string ID, not populated media object.', item.image)
                                return null
                            }


                            if (!imgUrl) return null

                            return (
                                <div key={index} className="thumb">
                                    {/* Using next/image for optimization */}
                                    <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                                        <Image
                                            src={imgUrl}
                                            alt={imgAlt}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="thumb-img"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
