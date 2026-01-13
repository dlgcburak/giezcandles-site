import { CollectionConfig } from 'payload'
import { Hero } from '../blocks/Hero'
import { Content } from '../blocks/Content'
import { Archive } from '../blocks/Archive'
import { Contact } from '../blocks/Contact'

export const Pages: CollectionConfig = {
    slug: 'pages',
    labels: {
        singular: 'Sayfa',
        plural: 'Sayfalar',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'updatedAt'],
        description: 'Web sitenizin sayfalarını ve içerik bloklarını buradan yönetebilirsiniz.',
        livePreview: {
            url: ({ data }) => {
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
                return `${siteUrl}/${data.slug !== 'home' ? data.slug : ''}`
            },
        },
    },
    versions: {
        drafts: true,
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            index: true,
            defaultValue: 'home',
        },
        {
            name: 'layout',
            type: 'blocks',
            required: true,
            blocks: [Hero, Content, Archive, Contact],
        },
    ],
}
