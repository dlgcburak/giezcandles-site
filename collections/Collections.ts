import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: 'Koleksiyon',
    plural: 'Koleksiyonlar',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Koleksiyon Adı',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Alt Açıklama',
      type: 'text',
      required: false,
    },
    {
      name: 'order',
      label: 'Sıra',
      type: 'number',
      required: false,
      admin: { description: 'Liste sırası için isteğe bağlı sayı' },
    },
    {
      name: 'slug',
      label: 'Kısa Ad (slug)',
      type: 'text',
      required: false,
      unique: true,
      admin: { description: 'URL dostu kısa ad (opsiyonel)' },
    },
  ],
}
