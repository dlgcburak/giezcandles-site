'use client'

import React from 'react'

const PayloadLogo: React.FC = () => {
    return (
        <div className="custom-logo">
            <div className="brand-logo-container">
                <img
                    src="/images/logo.png"
                    alt="Giez Candles"
                    width="40"
                    height="40"
                    className="brand-logo-img"
                />
            </div>
            <span className="brand-text">Giez Candles</span>
        </div>
    )
}

export default PayloadLogo
