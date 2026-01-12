'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { SettingsProps } from '@/components/HomeClient' // Sharing types for now

// Extended generic type for Nav Items since they are dynamic now
type NavItem = {
    label: string
    type: 'page' | 'custom'
    appearance?: 'link' | 'button'
    newTab?: boolean
    page?: { slug: string } | string
    url?: string
    id?: string
}

type Props = {
    settings: SettingsProps & { navItems?: NavItem[] }
}

export const SiteHeader: React.FC<Props> = ({ settings }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const logoSrc = settings.logo?.url || '/images/logo.png'
    const navItems = settings.navItems || []

    // Helper to resolve link href
    const getHref = (item: NavItem) => {
        if (item.type === 'custom' && item.url) return item.url
        if (item.type === 'page' && item.page) {
            if (typeof item.page === 'string') return `/${item.page}` // ID only (rare)
            if (item.page.slug === 'home') return '/'
            return `/${item.page.slug}`
        }
        return '#'
    }

    return (
        <header className="topbar">
            <div className="container">
                <div className="nav">
                    <Link href="/" className="brand" aria-label="Giez Candle ana sayfa">
                        <img src={logoSrc} alt="Giez Candle logo" />
                        <div>
                            <strong>Giez Candle</strong>
                            <span>Butik el yapımı mumlar</span>
                        </div>
                    </Link>

                    <nav className="links" aria-label="Site menüsü">
                        {navItems.map((item, i) => {
                            const href = getHref(item)
                            const isButton = item.appearance === 'button'
                            const target = item.newTab ? '_blank' : undefined
                            const rel = item.newTab ? 'noopener noreferrer' : undefined

                            if (isButton) {
                                return (
                                    <a key={i} href={href} className="btn primary small" target={target} rel={rel}>
                                        {item.label}
                                    </a>
                                )
                            }

                            return (
                                <Link key={i} href={href} target={target} rel={rel}>
                                    {item.label}
                                </Link>
                            )
                        })}

                        {/* Default fallback if no navItems configured in admin */}
                        {navItems.length === 0 && (
                            <a className="btn primary small" href={`https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '') || ''}`}>
                                Sipariş Ver
                            </a>
                        )}
                    </nav>

                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menüyü Aç/Kapat"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu-content">
                        {navItems.length > 0 ? navItems.map((item, i) => {
                            const href = getHref(item)
                            const isButton = item.appearance === 'button'
                            return (
                                <a
                                    key={i}
                                    href={href}
                                    className={isButton ? 'btn primary' : ''}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            )
                        }) : (
                            <a
                                className="btn primary"
                                href={`https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '') || ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sipariş Ver
                            </a>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
