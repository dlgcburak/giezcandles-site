'use client'

import React, { useEffect, useState } from 'react'

type Props = {
    title?: string
    description?: string
}

export const ContactBlock: React.FC<Props> = ({ title, description }) => {
    const [settings, setSettings] = useState<any>(null)

    useEffect(() => {
        // Fetch site settings for social links and whatsapp
        fetch('/api/globals/site-settings?depth=1')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Error fetching settings:', err))
    }, [])

    const whatsappNumber = settings?.whatsappNumber || '+905346069871'
    const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/giezcandle/'
    const shopierUrl = settings?.shopierUrl || 'https://www.shopier.com/giezcandle'
    const etsyUrl = settings?.etsyUrl || 'https://www.etsy.com/shop/GiezCandles'
    const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/giezcandlee/'

    const buildWhatsappLink = (number: string, message: string) => {
        const digits = number.replace(/[^\d]/g, "")
        return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    }

    const whatsappLink = buildWhatsappLink(whatsappNumber, "Merhaba Giez Candle! Sipariş vermek istiyorum.")

    return (
        <section className="container" id="iletisim" style={{ paddingBottom: '60px' }}>
            <div className="card contact">
                <div className="sectionTitle" style={{ marginBottom: 10 }}>
                    <h2>{title || 'İletişim'}</h2>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        alert(description || "Mesaj taslak olarak kaydedildi. Canlıya almak için form servisi bağlayabiliriz.")
                    }}
                >
                    <label className="sr-only" htmlFor="name">Ad</label>
                    <input id="name" name="name" placeholder="Adınız" autoComplete="name" required />

                    <label className="sr-only" htmlFor="email">E-posta</label>
                    <input id="email" name="email" type="email" placeholder="E-posta" autoComplete="email" required />

                    <label className="sr-only" htmlFor="msg">Mesaj</label>
                    <textarea
                        id="msg"
                        name="message"
                        placeholder="Kısa mesaj (ör. 2 adet Flower Garden için fiyat alabilir miyim?)"
                        required
                    />

                    <button className="btn primary" type="submit">Mesaj Gönder</button>

                    <a className="btn" href={whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    {etsyUrl && <a className="btn" href={etsyUrl} target="_blank" rel="noopener noreferrer">Etsy</a>}
                    {shopierUrl && <a className="btn" href={shopierUrl} target="_blank" rel="noopener noreferrer">Shopier</a>}
                    {instagramUrl && <a className="btn" href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
                    {facebookUrl && <a className="btn" href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>}
                </form>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                    {etsyUrl && <a className="pill" href={etsyUrl} target="_blank" rel="noopener noreferrer">Etsy</a>}
                    {shopierUrl && <a className="pill" href={shopierUrl} target="_blank" rel="noopener noreferrer">Shopier</a>}
                    {instagramUrl && <a className="pill" href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
                    {facebookUrl && <a className="pill" href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>}
                </div>
            </div>
        </section>
    )
}
