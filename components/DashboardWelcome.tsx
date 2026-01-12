'use client'

import React, { useEffect, useState } from 'react'

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
                    margin-bottom: 1.5rem;
                }
                .dashboard-welcome__logo {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    object-fit: cover;
                    box-shadow: 0 4px 12px rgba(72, 24, 40, 0.15);
                }
                .dashboard-welcome__title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #481828;
                    margin: 0;
                }
                .dashboard-welcome__subtitle {
                    font-size: 0.9rem;
                    color: #784850;
                    margin: 0.25rem 0 0 0;
                }
                .dashboard-welcome__stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(8px);
                    border-radius: 10px;
                    padding: 1.25rem;
                    border: 1px solid rgba(72, 24, 40, 0.08);
                    text-align: center;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(72, 24, 40, 0.1);
                }
                .stat-card__number {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #481828;
                    line-height: 1;
                }
                .stat-card__label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #784850;
                    margin-top: 0.5rem;
                }
                .stat-card--loading {
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>

            <div className="dashboard-welcome__header">
                <img
                    src="/images/logo.png"
                    alt="Giez Candle"
                    className="dashboard-welcome__logo"
                />
                <div>
                    <h1 className="dashboard-welcome__title">{getGreeting()}!</h1>
                    <p className="dashboard-welcome__subtitle">
                        Giez Candle Yönetim Paneline hoş geldiniz
                    </p>
                </div>
            </div>

            <div className="dashboard-welcome__stats">
                <div className={`stat-card ${loading ? 'stat-card--loading' : ''}`}>
                    <div className="stat-card__number">{loading ? '–' : stats?.products}</div>
                    <div className="stat-card__label">Ürün</div>
                </div>
                <div className={`stat-card ${loading ? 'stat-card--loading' : ''}`}>
                    <div className="stat-card__number">{loading ? '–' : stats?.collections}</div>
                    <div className="stat-card__label">Koleksiyon</div>
                </div>
                <div className={`stat-card ${loading ? 'stat-card--loading' : ''}`}>
                    <div className="stat-card__number">{loading ? '–' : stats?.pages}</div>
                    <div className="stat-card__label">Sayfa</div>
                </div>
                <div className={`stat-card ${loading ? 'stat-card--loading' : ''}`}>
                    <div className="stat-card__number">{loading ? '–' : stats?.media}</div>
                    <div className="stat-card__label">Medya</div>
                </div>
            </div>
        </div>
    )
}

export default DashboardWelcome
