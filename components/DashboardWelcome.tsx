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
                <h3 className="dashboard-welcome__subtitle" style={{ marginBottom: '1rem' }}>Hızlı İşlemler</h3>
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
                    background: linear-gradient(135deg, rgba(72, 24, 40, 0.05) 0%, rgba(176, 138, 96, 0.08) 100%);
                    border-radius: 12px;
                    border: 1px solid rgba(72, 24, 40, 0.1);
                }
                .dashboard-welcome__header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .dashboard-welcome__logo {
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    object-fit: cover;
                    box-shadow: 0 4px 12px rgba(72, 24, 40, 0.15);
                }
                .dashboard-welcome__title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #481828;
                    margin: 0;
                    line-height: 1.2;
                }
                .dashboard-welcome__subtitle {
                    font-size: 0.95rem;
                    color: #784850;
                    margin: 0.25rem 0 0 0;
                    font-weight: 500;
                }
                .dashboard-welcome__stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    border-radius: 16px;
                    padding: 1.5rem;
                    border: 1px solid rgba(72, 24, 40, 0.08);
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-4px);
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 12px 24px -6px rgba(72, 24, 40, 0.12);
                    border-color: rgba(72, 24, 40, 0.15);
                }
                .stat-card__number {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #481828;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                }
                .stat-card__label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #784850;
                    font-weight: 600;
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
                    padding: 1rem 1.25rem;
                    border-radius: 12px;
                    border: 1px solid rgba(72, 24, 40, 0.1);
                    color: #481828;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }
                .action-btn:hover {
                    border-color: #481828;
                    background: #481828;
                    color: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(72, 24, 40, 0.15);
                }
                .action-btn__icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    background: rgba(72, 24, 40, 0.1);
                    border-radius: 6px;
                    font-size: 1.2rem;
                    line-height: 1;
                    transition: all 0.2s ease;
                }
                .action-btn:hover .action-btn__icon {
                    background: rgba(255, 255, 255, 0.2);
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
