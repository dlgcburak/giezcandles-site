'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

type Stats = {
    products: number
    pages: number
    media: number
    collections: number
}

const DashboardWelcome: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [products, pages, media, collections] = await Promise.all([
                    fetch('/api/products?limit=0').then(r => r.json()),
                    fetch('/api/pages?limit=0').then(r => r.json()),
                    fetch('/api/media?limit=0').then(r => r.json()),
                    fetch('/api/collections?limit=0').then(r => r.json()),
                ])
                setStats({
                    products: products.totalDocs || 0,
                    pages: pages.totalDocs || 0,
                    media: media.totalDocs || 0,
                    collections: collections.totalDocs || 0,
                })
            } catch (e) {
                console.error('Failed to fetch stats:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Günaydın'
        if (hour < 18) return 'İyi günler'
        return 'İyi akşamlar'
    }

    return (
        <div className="dashboard-welcome">

            <div className="dashboard-welcome__actions">
                <h3 className="dashboard-welcome__subtitle">Hızlı İşlemler</h3>
                <div className="actions-grid">
                    <Link href="/admin/collections/products/create" className="action-btn">
                        <span className="action-btn__icon">+</span>
                        Yeni Ürün Ekle
                    </Link>
                    <Link href="/admin/collections/pages/create" className="action-btn">
                        <span className="action-btn__icon">+</span>
                        Yeni Sayfa Oluştur
                    </Link>
                    <Link href="/admin/collections/media/create" className="action-btn">
                        <span className="action-btn__icon">+</span>
                        Medya Yükle
                    </Link>
                </div>
            </div>

            <style>{`
                .dashboard-welcome {
                    margin-bottom: 2rem;
                    padding: 2rem;
                    background: #ffffff;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                .dashboard-welcome__header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .dashboard-welcome__logo {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 1px solid #e5e7eb;
                }
                .dashboard-welcome__title {
                    font-family: inherit;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #111;
                    margin: 0;
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                }
                .dashboard-welcome__subtitle {
                    font-size: 0.875rem;
                    color: #666;
                    margin: 0.25rem 0 0 0;
                    font-weight: 400;
                }
                .dashboard-welcome__stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    background: #fff;
                    border-radius: 8px;
                    padding: 1.25rem;
                    border: 1px solid #e5e7eb;
                    text-align: left;
                    transition: border-color 0.15s ease;
                }
                .stat-card:hover {
                    border-color: #000;
                }
                .stat-card__number {
                    font-family: inherit;
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #111;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                    letter-spacing: -0.02em;
                }
                .stat-card__label {
                    font-size: 0.75rem;
                    color: #666;
                    font-weight: 500;
                }
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: #fff;
                    padding: 0.875rem 1rem;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                    color: #111;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.875rem;
                    transition: all 0.15s ease;
                }
                .action-btn:hover {
                    border-color: #000;
                    background: #f9f9f9;
                    transform: translateY(-1px);
                }
                .action-btn__icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    background: #f0f0f0;
                    color: #666;
                    border-radius: 4px;
                    font-size: 1rem;
                    line-height: 1;
                }
                .action-btn:hover .action-btn__icon {
                    background: #000;
                    color: #fff;
                }
                .stat-card--loading {
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>        </div >
    )
}

export default DashboardWelcome
