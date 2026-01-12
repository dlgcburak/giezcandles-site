'use client'

import React from 'react'
import Link from 'next/link'
import type { SettingsProps } from '@/components/HomeClient'

type Props = {
    settings: SettingsProps
}

export const SiteFooter: React.FC<Props> = ({ settings }) => {
    const year = new Date().getFullYear()

    return (
        <footer>
            <div className="container">
                <div className="footerGrid">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ display: "inline-flex", width: 10, height: 10, borderRadius: 999, background: "var(--brand-900)" }} />
                        <strong style={{ fontFamily: "'Playfair Display',serif" }}>Giez Candle</strong>
                        <span style={{ color: "var(--muted)" }}>© {year}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Link className="pill" href="/#urunler">Ürünler</Link>
                        <Link className="pill" href="/#hikaye">Hikaye</Link>
                        <Link className="pill" href="/#iletisim">İletişim</Link>

                        {/* Social Links from Settings */}
                        {settings.instagramUrl && <a className="pill" href={settings.instagramUrl} target="_blank">Instagram</a>}
                        {settings.shopierUrl && <a className="pill" href={settings.shopierUrl} target="_blank">Shopier</a>}
                    </div>
                </div>
            </div>
        </footer>
    )
}
