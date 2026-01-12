"use client";

import React, { useEffect, useMemo, useState } from "react";

export type MediaRef = {
  id?: string;
  url?: string | null;
  filename?: string | null;
};

export type HeroImage = {
  id?: string;
  image?: MediaRef | null;
  fallbackImage?: string | null;
  alt?: string | null;
};

export type SettingsProps = {
  heroTitle?: string;
  heroSubtitle?: string;
  storyTitle?: string;
  storyText?: string;
  whatsappNumber?: string;
  etsyUrl?: string;
  shopierUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  logo?: MediaRef | null;
  heroImages?: HeroImage[] | null;
};

export type CollectionProps = {
  id: string;
  title: string;
  subtitle?: string | null;
  order?: number | null;
  slug?: string | null;
};

export type ProductProps = {
  id: string;
  title: string;
  collection?:
  | string
  | {
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    subtitle?: string | null;
    order?: number | null;
  }
  | null;
  priceTRY: number;
  tags?: string[];
  fallbackImage?: string | null;
  image?: MediaRef | null;
  description?: string | null;
  order?: number | null;
};

export type ImageTarget =
  | { type: "logo" }
  | { type: "hero"; index: number }
  | { type: "product"; productId: string };

type HomeClientProps = {
  settings: SettingsProps;
  products: ProductProps[];
  collections?: CollectionProps[];
  editMode?: boolean;
  onChangeSetting?: (key: keyof SettingsProps, value: string) => void;
  onChangeProduct?: (id: string, patch: Partial<ProductProps>) => void;
  onDeleteProduct?: (id: string) => void;
  onAddProduct?: () => void;
  onReorderProduct?: (id: string, dir: "up" | "down") => void;
  onPickImage?: (target: ImageTarget) => void;
};

const DEFAULT_HERO = [
  { fallbackImage: "FlowerGarden.png", alt: "Flower Garden — martini kadehinde çiçekli mum" },
  { fallbackImage: "PeonyFire.png", alt: "Peony Fire — pembe çiçekli mum" },
  { fallbackImage: "PinkberryJam.png", alt: "Pinkberry Jam — kırmızı meyveli mum" },
  { fallbackImage: "PurpleberryJam.png", alt: "Purpleberry Jam — mor meyveli mum" },
];

const DEFAULT_COLLECTIONS: CollectionProps[] = [
  { id: "uncategorized", title: "Ürünlerimiz", subtitle: "Koleksiyon seçilmemiş ürünler", order: 10, slug: "uncategorized" },
];

function resolveImageSrc(media?: MediaRef | null, fallbackName?: string | null, defaultSrc?: string) {
  if (media?.url) return media.url;
  if (fallbackName) return `/images/${fallbackName.replace(/^[\\/]/, "")}`;
  return defaultSrc || "/images/logo.png";
}

function buildWhatsappLink(number?: string, message?: string) {
  const digits = (number || "+905346069871").replace(/[^\d]/g, "");
  const text = message || "Merhaba Giez Candle! Fiyat ve stok bilgisi alabilir miyim?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function formatPrice(amount?: number | null) {
  if (amount === undefined || amount === null) return "₺ 0";
  return `₺ ${amount}`;
}

type EditableTextProps = {
  value?: string | null;
  placeholder?: string;
  editMode?: boolean;
  onChange?: (value: string) => void;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
};

function EditableText({
  value,
  placeholder,
  editMode,
  onChange,
  as = "span",
  className,
  multiline = false,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  useEffect(() => {
    setDraft(value || "");
  }, [value]);

  const save = () => {
    setEditing(false);
    if (onChange) onChange(draft);
  };

  const Tag: any = as;
  if (!editMode) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  return (
    <Tag
      className={`${className || ""} editable ${editing ? "editing" : ""}`}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setDraft(value || "");
                setEditing(false);
              }
            }}
            rows={3}
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setDraft(value || "");
                setEditing(false);
              }
            }}
          />
        )
      ) : (
        <span className="editable-label">{value || placeholder || "Çift tıklayarak düzenle"}</span>
      )}
    </Tag>
  );
}

export default function HomeClient({
  settings,
  products,
  collections = DEFAULT_COLLECTIONS,
  editMode = false,
  onChangeSetting,
  onChangeProduct,
  onDeleteProduct,
  onAddProduct,
  onReorderProduct,
  onPickImage,
}: HomeClientProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const thumbs = useMemo(() => {
    const list = (settings.heroImages && settings.heroImages.length > 0 ? settings.heroImages : DEFAULT_HERO).slice(0, 4);
    return list.map((item, index) => {
      const src = resolveImageSrc(
        (item as HeroImage).image,
        (item as HeroImage).fallbackImage || (item as any).fallbackImage,
        resolveImageSrc(undefined, DEFAULT_HERO[index]?.fallbackImage)
      );
      return {
        src,
        alt: (item as HeroImage).alt || DEFAULT_HERO[index]?.alt || `Hero görseli ${index + 1}`,
        aria: `Hero görselini büyüt (${(item as HeroImage).alt || DEFAULT_HERO[index]?.alt || index + 1})`,
        index,
      };
    });
  }, [settings.heroImages]);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [products]
  );

  const slugify = (val?: string | null) =>
    (val || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const mergedCollections = useMemo(() => {
    const derivedFromProducts: CollectionProps[] = products
      .map((p) => p.collection)
      .filter(Boolean)
      .map((col) => {
        const c = col as NonNullable<ProductProps["collection"]>;
        if (typeof c === "string") {
          const slug = slugify(c);
          return {
            id: slug,
            title: c,
            subtitle: "",
            order: 0,
            slug,
          };
        }
        const slug = c.slug || slugify(c.title);
        return {
          id: c.id || slug || c.title || "",
          title: c.title || slug || "Koleksiyon",
          subtitle: c.subtitle || "",
          order: c.order ?? 0,
          slug,
        };
      })
      .filter((c) => c.id);

    const list = [...collections, ...derivedFromProducts, ...DEFAULT_COLLECTIONS];
    const map = new Map<string, CollectionProps>();
    for (const col of list) {
      const key = col.id || col.slug || slugify(col.title);
      if (!key) continue;
      map.set(key, { ...col, slug: col.slug || slugify(col.title) });
    }
    return Array.from(map.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [collections, products]);

  const collectionKeySet = useMemo(
    () =>
      new Set(
        mergedCollections
          .flatMap((c) => [c.id, c.slug, c.title])
          .filter(Boolean)
          .map((v) => v!.toString().toLowerCase())
      ),
    [mergedCollections]
  );

  const getCollectionKey = (col?: ProductProps["collection"]) => {
    if (!col) return "";
    if (typeof col === "string") return col.toLowerCase();
    return (col.id || col.slug || col.title || "").toString().toLowerCase();
  };

  const productMatchesCollection = (product: ProductProps, col: CollectionProps) => {
    const key = getCollectionKey(product.collection);
    const colCandidates = [col.id, col.slug, col.title]
      .filter(Boolean)
      .map((v) => v!.toString().toLowerCase());

    if (!key) {
      return colCandidates.some((c) => c === "uncategorized");
    }

    const directMatch = colCandidates.some((c) => key === c || key.includes(c));
    if (directMatch) return true;

    const isUnmatched = !collectionKeySet.has(key);
    if (isUnmatched && colCandidates.some((c) => c === "uncategorized")) return true;

    return false;
  };

  const year = new Date().getFullYear();
  const logoSrc = resolveImageSrc(settings.logo, "logo.png", "/images/logo.png");

  const openImg = (src: string) => setLightboxSrc(src);

  const renderProductCard = (p: ProductProps) => {
    const imgSrc = resolveImageSrc(p.image, p.fallbackImage, "/images/logo.png");
    const tags = p.tags || [];
    const whatsappLink = buildWhatsappLink(
      settings.whatsappNumber,
      `Merhaba Giez Candle! ${p.title} (${formatPrice(p.priceTRY)}) hakkında bilgi almak istiyorum.`
    );
    return (
      <article key={p.id} className="card product">
        <div className="media">
          <img src={imgSrc} alt={p.title} />
          {editMode ? (
            <button
              className="edit-chip"
              type="button"
              onClick={() => onPickImage?.({ type: "product", productId: p.id })}
            >
              Görseli değiştir
            </button>
          ) : null}
        </div>
        <div className="body">
          <EditableText
            value={p.title}
            editMode={editMode}
            onChange={(val) => onChangeProduct?.(p.id, { title: val })}
            as="h3"
          />
          <div className="meta">
            {tags.map((x, idx) => (
              <span key={`${x}-${idx}`} className="pill">
                {x}
              </span>
            ))}
            <span className="price">
              {editMode ? (
                <input
                  className="price-input"
                  type="number"
                  value={p.priceTRY}
                  onChange={(e) => onChangeProduct?.(p.id, { priceTRY: Number(e.target.value) })}
                />
              ) : (
                formatPrice(p.priceTRY)
              )}
            </span>
          </div>
        </div>
        <div className="actions">
          <button className="btn" type="button" onClick={() => openImg(imgSrc)}>
            Fotoğrafı Aç
          </button>
          <a className="btn primary" href={whatsappLink} target="_blank" rel="noopener">
            Sipariş Ver
          </a>
        </div>

        {editMode ? (
          <details
            className={`edit-panel ${expandedProduct === p.id ? "open" : ""}`}
            open={expandedProduct === p.id}
            onToggle={(e) => setExpandedProduct((e.target as HTMLDetailsElement).open ? p.id : null)}
          >
            <summary>Düzenle</summary>
            <label>
              Açıklama
              <textarea
                value={p.description || ""}
                onChange={(e) => onChangeProduct?.(p.id, { description: e.target.value })}
              />
            </label>
            <label>
              Koleksiyon
              {collections.length > 0 ? (
                <select
                  value={
                    typeof p.collection === "object"
                      ? p.collection?.id || p.collection?.slug || ""
                      : p.collection || ""
                  }
                  onChange={(e) => {
                    const selected = collections.find((c) => c.id === e.target.value || c.slug === e.target.value);
                    if (selected) {
                      onChangeProduct?.(p.id, {
                        collection: {
                          id: selected.id,
                          title: selected.title,
                          slug: selected.slug,
                          order: selected.order,
                          subtitle: selected.subtitle,
                        },
                      });
                    } else {
                      onChangeProduct?.(p.id, { collection: e.target.value });
                    }
                  }}
                >
                  <option value="">Koleksiyon seçin</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={
                    typeof p.collection === "string"
                      ? p.collection
                      : p.collection?.title || p.collection?.slug || ""
                  }
                  onChange={(e) =>
                    onChangeProduct?.(p.id, {
                      collection: {
                        id: typeof p.collection === "object" && p.collection?.id ? p.collection.id : "",
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      },
                    })
                  }
                  placeholder="Koleksiyon adı"
                />
              )}
            </label>
            <label>
              Etiketler (virgülle)
              <input
                value={tags.join(", ")}
                onChange={(e) =>
                  onChangeProduct?.(p.id, {
                    tags: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <label>
              Order
              <input
                type="number"
                value={p.order ?? 0}
                onChange={(e) => onChangeProduct?.(p.id, { order: Number(e.target.value) })}
              />
            </label>
            <div className="edit-panel-actions">
              <button type="button" onClick={() => onReorderProduct?.(p.id, "up")}>
                Yukarı
              </button>
              <button type="button" onClick={() => onReorderProduct?.(p.id, "down")}>
                Aşağı
              </button>
              <button type="button" className="danger" onClick={() => onDeleteProduct?.(p.id)}>
                Kaldır
              </button>
            </div>
          </details>
        ) : null}
      </article>
    );
  };

  return (
    <div className={editMode ? "edit-mode" : undefined}>
      {/* Sticky top bar */}
      {/* Sticky top bar removed - provided by Global Layout */}


      {/* Hero */}
      <main id="home" className="hero">
        <div className="container">
          <div className="heroGrid">
            <div className="card heroCopy">
              <div className="kicker">✨ Sıcak, minimal ve butik</div>
              <EditableText
                value={settings.heroTitle || "Giez Candle ile evine sakin bir ışıltı."}
                placeholder="Hero başlık"
                editMode={editMode}
                onChange={(val) => onChangeSetting?.("heroTitle", val)}
                as="h1"
              />
              <EditableText
                value={
                  settings.heroSubtitle ||
                  "Çiçekli ve meyveli tasarımlar, zarif cam sunumlar ve yumuşak renk paleti."
                }
                placeholder="Hero açıklama"
                editMode={editMode}
                onChange={(val) => onChangeSetting?.("heroSubtitle", val)}
                as="p"
                className="lead"
                multiline
              />

              <div className="heroActions">
                <a className="btn primary" href="#urunler">
                  Ürünleri İncele
                </a>
                <a
                  className="btn"
                  href={buildWhatsappLink(settings.whatsappNumber, "Merhaba Giez Candle! Özel sipariş hakkında bilgi almak istiyorum.")}
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
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                {/* boş */}
              </p>
            </div>

            <div className="card heroVisual" aria-label="Öne çıkan görseller">
              <div className="stack">
                {thumbs.map((t) => (
                  <button
                    key={t.src + t.index}
                    className="thumb"
                    onClick={() => openImg(t.src)}
                    aria-label={t.aria}
                    type="button"
                  >
                    <img src={t.src} alt={t.alt} />
                    {editMode ? (
                      <span
                        className="edit-chip"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onPickImage?.({ type: "hero", index: t.index });
                        }}
                      >
                        Görseli değiştir
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <section id="urunler">
            <div className="sectionTitle">
              <div>
                <h2>Koleksiyonlar</h2>
                <p>Güncel koleksiyon listesi</p>
              </div>
              <a className="btn" href={buildWhatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener">
                Fiyat & stok sor
              </a>
            </div>

            <div className="grid">
              {mergedCollections.map((col) => {
                const colProducts = sortedProducts.filter((p) => productMatchesCollection(p, col));
                return (
                  <React.Fragment key={col.id || col.slug || col.title}>
                    <div style={{ gridColumn: "span 12", padding: "2px 4px" }}>
                      <span id={col.slug || col.id}></span>
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
                            fontSize: 20,
                            color: "var(--brand-900)",
                          }}
                        >
                          {col.title}
                        </h3>
                        {col.subtitle ? (
                          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
                            {col.subtitle}
                          </p>
                        ) : null}
                      </div>
                      <div style={{ height: 1, background: "rgba(72,24,40,.10)" }} />
                    </div>

                    {colProducts.length > 0 ? (
                      colProducts.map((p) => renderProductCard(p))
                    ) : (
                      <div style={{ gridColumn: "span 12", padding: "8px 12px", color: "var(--muted)", fontSize: 14 }}>
                        Bu koleksiyonda henüz ürün yok.
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          {/* About + Contact */}
          <section className="twoCol">
            <div className="card about" id="hikaye">
              <div className="sectionTitle" style={{ marginBottom: 10 }}>
                <EditableText
                  value={settings.storyTitle || "Marka Hikayesi"}
                  placeholder="Marka Hikayesi"
                  editMode={editMode}
                  onChange={(val) => onChangeSetting?.("storyTitle", val)}
                  as="h2"
                />
              </div>
              <EditableText
                value={
                  settings.storyText ||
                  "Giez Candle, küçük detayların büyük bir atmosfer yarattığına inanır. Her tasarım; yumuşak tonlar, minimal etiketler ve butik bir sunum diliyle hazırlanır."
                }
                placeholder="Hikaye metni"
                editMode={editMode}
                onChange={(val) => onChangeSetting?.("storyText", val)}
                as="p"
                multiline
              />
              <div style={{ display: "flex", justifyContent: "flex-start", margin: "24px 0 10px", paddingLeft: 18 }}>
                <img
                  src={logoSrc}
                  alt="Giez Candle logo"
                  style={{ width: 220, height: "auto", opacity: 0.95 }}
                />
                {editMode ? (
                  <button
                    className="edit-chip"
                    type="button"
                    onClick={() => onPickImage?.({ type: "logo" })}
                  >
                    Logoyu değiştir
                  </button>
                ) : null}
              </div>
              <div className="divider"></div>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                {/* boş */}
              </p>
            </div>

            <div className="card contact" id="iletisim">
              <div className="sectionTitle" style={{ marginBottom: 10 }}>
                <h2>İletişim</h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Mesaj taslak olarak kaydedildi. Canlıya almak için form servisi bağlayabiliriz.");
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

                <a className="btn" href={buildWhatsappLink(settings.whatsappNumber, "Merhaba Giez Candle! Sipariş vermek istiyorum.")} target="_blank" rel="noopener">WhatsApp</a>
                <a className="btn" href={settings.etsyUrl || "https://www.etsy.com/shop/GiezCandles?ref=shop_profile&listing_id=4431094665"} target="_blank" rel="noopener">Etsy</a>
                <a className="btn" href={settings.shopierUrl || "https://www.shopier.com/giezcandle"} target="_blank" rel="noopener">Shopier</a>
                <a className="btn" href={settings.instagramUrl || "https://www.instagram.com/giezcandle/"} target="_blank" rel="noopener">Instagram</a>
                <a className="btn" href={settings.facebookUrl || "https://www.facebook.com/giezcandlee/"} target="_blank" rel="noopener">Facebook</a>
              </form>

              <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                <a
                  href={buildWhatsappLink(settings.whatsappNumber, "Merhaba Giez Candle! Sipariş vermek istiyorum.")}
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: "underline" }}
                />
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <a className="pill" href={settings.etsyUrl || "https://www.etsy.com/shop/GiezCandles?ref=shop_profile&listing_id=4431094665"} target="_blank" rel="noopener">Etsy</a>
                <a className="pill" href={settings.shopierUrl || "https://www.shopier.com/giezcandle"} target="_blank" rel="noopener">Shopier</a>
                <a className="pill" href={settings.instagramUrl || "https://www.instagram.com/giezcandle/"} target="_blank" rel="noopener">Instagram</a>
                <a className="pill" href={settings.facebookUrl || "https://www.facebook.com/giezcandlee/"} target="_blank" rel="noopener">Facebook</a>
              </div>
            </div>
          </section>

          {/* Footer removed - provided by Global Layout */}

        </div>
      </main>

      <div
        className={`lightbox ${lightboxSrc ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Görsel önizleme"
        onClick={() => setLightboxSrc(null)}
      >
        <div className="panel" onClick={(e) => e.stopPropagation()}>
          <button className="close" aria-label="Kapat" onClick={() => setLightboxSrc(null)} type="button">
            ✕
          </button>
          {lightboxSrc ? <img src={lightboxSrc} alt="Büyük görsel" /> : null}
        </div>
      </div>

      {editMode && onAddProduct ? (
        <button className="fab-add" type="button" onClick={() => onAddProduct()}>
          +
        </button>
      ) : null}
    </div>
  );
}
