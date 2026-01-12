"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import HomeClient, {
  HeroImage,
  ImageTarget,
  MediaRef,
  ProductProps,
  SettingsProps,
} from "./HomeClient";

type MediaItem = {
  id: string;
  url?: string | null;
  filename?: string | null;
  alt?: string | null;
};

type Toast = { type: "success" | "error"; message: string };

type Props = {
  initialSettings: SettingsProps;
  initialProducts: ProductProps[];
};

const emptyMedia: MediaItem = { id: "", url: "/images/logo.png", filename: "placeholder" };

export default function EditPageClient({ initialSettings, initialProducts }: Props) {
  const initialSettingsRef = useRef(initialSettings);
  const initialProductsRef = useRef(initialProducts);

  const [settings, setSettings] = useState<SettingsProps>(initialSettings);
  const [products, setProducts] = useState<ProductProps[]>(initialProducts);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const [mediaModal, setMediaModal] = useState<{ target: ImageTarget } | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const maxOrder = useMemo(() => Math.max(0, ...products.map((p) => p.order ?? 0)), [products]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const markDirty = () => setDirty(true);

  const handleSettingChange = (key: keyof SettingsProps, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    markDirty();
  };

  const handleProductChange = (id: string, patch: Partial<ProductProps>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    markDirty();
  };

  const handleAddProduct = () => {
    const nextOrder = maxOrder + 10;
    const fresh: ProductProps = {
      id: `new-${Date.now()}`,
      title: "Yeni Ürün",
      collection: { id: "flower", title: "Çiçek" },
      priceTRY: 250,
      tags: [],
      fallbackImage: "FlowerGarden.png",
      image: null,
      description: "",
      order: nextOrder,
    };
    setProducts((prev) => [...prev, fresh]);
    markDirty();
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (!id.startsWith("new-")) {
      setDeletedIds((prev) => [...prev, id]);
    }
    markDirty();
  };

  const handleReorderProduct = (id: string, dir: "up" | "down") => {
    const ordered = [...products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const index = ordered.findIndex((p) => p.id === id);
    if (index === -1) return;
    const swapWith = dir === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= ordered.length) return;
    const currentOrder = ordered[index].order ?? 0;
    ordered[index].order = ordered[swapWith].order ?? 0;
    ordered[swapWith].order = currentOrder;
    setProducts(ordered);
    markDirty();
  };

  const loadMedia = async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch("/api/media?limit=100", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        const docs = json.docs || [];
        setMediaItems(
          docs.map((d: any) => ({
            id: d.id,
            url: d.url,
            filename: d.filename,
            alt: d.alt,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handlePickImage = (target: ImageTarget) => {
    setMediaModal({ target });
    void loadMedia();
  };

  const applyMedia = (media: MediaItem) => {
    const mediaRef: MediaRef = { id: media.id, url: media.url, filename: media.filename };
    if (mediaModal?.target.type === "logo") {
      setSettings((prev) => ({ ...prev, logo: mediaRef }));
    } else if (mediaModal?.target.type === "hero") {
      const target = mediaModal.target;
      setSettings((prev) => {
        const list = [...(prev.heroImages || [])];
        const idx = target.index;
        const existing = list[idx] || ({} as HeroImage);
        list[idx] = {
          ...existing,
          image: mediaRef,
          fallbackImage: media.filename || existing.fallbackImage,
        };
        return { ...prev, heroImages: list };
      });
    } else if (mediaModal?.target.type === "product") {
      handleProductChange(mediaModal.target.productId, {
        image: mediaRef,
        fallbackImage: media.filename || undefined,
      });
    }
    setMediaModal(null);
    markDirty();
  };

  const uploadMedia = async (file: File | null) => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setLoadingMedia(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      const doc = json.doc || json;
      const uploaded = {
        id: doc.id,
        url: doc.url,
        filename: doc.filename,
        alt: doc.alt,
      } as MediaItem;
      setMediaItems((prev) => [uploaded, ...prev]);
      applyMedia(uploaded);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Yükleme başarısız" });
    } finally {
      setLoadingMedia(false);
    }
  };

  const resetAll = () => {
    setSettings(initialSettingsRef.current);
    setProducts(initialProductsRef.current);
    setDeletedIds([]);
    setDirty(false);
  };

  const saveAll = async () => {
    setSaving(true);
    setToast(null);
    try {
      const settingsPayload: any = {
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        storyTitle: settings.storyTitle,
        storyText: settings.storyText,
        whatsappNumber: settings.whatsappNumber,
        etsyUrl: settings.etsyUrl,
        shopierUrl: settings.shopierUrl,
        facebookUrl: settings.facebookUrl,
        instagramUrl: settings.instagramUrl,
        logo: settings.logo?.id || null,
        heroImages: (settings.heroImages || []).map((img) => ({
          id: img.id,
          image: img.image?.id || null,
          fallbackImage: img.fallbackImage || null,
          alt: img.alt || "",
        })),
      };

      const saveSettings = await fetch("/api/globals/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settingsPayload),
      });
      if (!saveSettings.ok) throw new Error("Site ayarları kaydedilemedi");
      const savedSettingsJSON = await saveSettings.json();
      const savedSettings = savedSettingsJSON.doc || savedSettingsJSON;

      const remainingProducts: ProductProps[] = [];
      for (const p of products) {
        const payloadBody = {
          title: p.title,
          collection: p.collection,
          priceTRY: p.priceTRY,
          description: p.description,
          tags: (p.tags || []).map((tag) => ({ tag })),
          fallbackImage: p.fallbackImage,
          image: p.image?.id || null,
          order: p.order ?? 0,
        };

        if (p.id.startsWith("new-")) {
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payloadBody),
          });
          if (!res.ok) throw new Error("Yeni ürün eklenemedi");
          const json = await res.json();
          const saved = json.doc || json;
          remainingProducts.push({
            id: saved.id,
            title: saved.title,
            collection: saved.collection,
            priceTRY: saved.priceTRY,
            tags: Array.isArray(saved.tags) ? saved.tags.map((t: any) => t.tag) : [],
            fallbackImage: saved.fallbackImage,
            image: saved.image || null,
            description: saved.description,
            order: saved.order,
          });
        } else {
          const res = await fetch(`/api/products/${p.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payloadBody),
          });
          if (!res.ok) throw new Error("Ürün güncellenemedi");
          const json = await res.json();
          const saved = json.doc || json;
          remainingProducts.push({
            id: saved.id,
            title: saved.title,
            collection: saved.collection,
            priceTRY: saved.priceTRY,
            tags: Array.isArray(saved.tags) ? saved.tags.map((t: any) => t.tag) : [],
            fallbackImage: saved.fallbackImage,
            image: saved.image || null,
            description: saved.description,
            order: saved.order,
          });
        }
      }

      for (const delId of deletedIds) {
        await fetch(`/api/products/${delId}`, {
          method: "DELETE",
          credentials: "include",
        });
      }

      setSettings(savedSettings);
      setProducts(remainingProducts);
      initialSettingsRef.current = savedSettings;
      initialProductsRef.current = remainingProducts;
      setDeletedIds([]);
      setDirty(false);
      setToast({ type: "success", message: "Kaydedildi" });
    } catch (err: any) {
      console.error(err);
      setToast({ type: "error", message: err?.message || "Kaydedilemedi" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="edit-toolbar">
        <div>
          <div className="edit-toolbar__title">Görsel Düzenleme</div>
          <div className="edit-toolbar__status">
            {dirty ? "Kaydedilmemiş değişiklikler var" : "Güncel"}
          </div>
        </div>
        <div className="edit-toolbar__actions">
          <button type="button" onClick={resetAll} disabled={saving}>
            Vazgeç
          </button>
          <button type="button" className="primary" onClick={saveAll} disabled={saving || !dirty}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      <HomeClient
        settings={settings}
        products={products}
        editMode
        onChangeSetting={handleSettingChange}
        onChangeProduct={handleProductChange}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={handleAddProduct}
        onReorderProduct={handleReorderProduct}
        onPickImage={handlePickImage}
      />

      {toast ? (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ) : null}

      {mediaModal ? (
        <div className="media-overlay" onClick={() => setMediaModal(null)}>
          <div className="media-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="media-header">
              <strong>Media seç</strong>
              <label className="upload-btn">
                Yeni yükle
                <input type="file" accept="image/*" onChange={(e) => uploadMedia(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div className="media-grid">
              {loadingMedia ? <div>Yükleniyor...</div> : null}
              {!loadingMedia && mediaItems.length === 0 ? <div>Medya bulunamadı.</div> : null}
              {(mediaItems.length ? mediaItems : [emptyMedia]).map((m) => (
                <button key={m.id || m.filename} className="media-card" type="button" onClick={() => applyMedia(m)}>
                  <img src={m.url || "/images/logo.png"} alt={m.alt || m.filename || "media"} />
                  <div className="media-name">{m.filename || m.alt || m.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
