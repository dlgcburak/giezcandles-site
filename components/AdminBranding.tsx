"use client";

export const AdminLogo = () => (
  <div className="payload-logo" aria-label="Giez Candle Admin">
    <img src="/images/logo.png" alt="Giez Candle" />
    <div>
      <strong>Giez Candle</strong>
      <div style={{ fontSize: 12, opacity: 0.8 }}>Admin</div>
    </div>
  </div>
);

export const AdminIcon = () => (
  <img
    src="/images/logo.png"
    alt="Giez Candle"
    width={28}
    height={28}
    style={{
      borderRadius: 10,
      objectFit: "cover",
      boxShadow: "0 10px 24px rgba(0,0,0,.18)",
      border: "1px solid rgba(72,24,40,.12)",
      background: "#fff",
    }}
  />
);
