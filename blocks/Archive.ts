import { Block } from 'payload'

export const Archive: Block = {
    slug: 'archive',
    labels: {
        singular: 'Product Grid',
        plural: 'Product Grids',
    },
    fields: [
        {
            name: 'introContent',
            type: 'richText',
            label: 'Intro Text (Optional)',
        },
        {
            name: 'populateBy',
            type: 'select',
            defaultValue: 'collection',
            options: [
                { label: 'Collection', value: 'collection' },
                { label: 'Selection (Manual Pick)', value: 'selection' },
            ],
        },
        {
            name: 'relation',
            type: 'relationship',
            relationTo: 'collections',
            hasMany: true,
            label: 'Koleksiyonlar',
            admin: {
                condition: (_, siblingData) => siblingData.populateBy === 'collection',
            },
        },
        {
            name: 'limit',
            type: 'number',
            defaultValue: 10,
            admin: {
                condition: (_, siblingData) => siblingData.populateBy === 'collection',
            },
        },
        {
            name: 'selectedDocs',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            admin: {
                condition: (_, siblingData) => siblingData.populateBy === 'selection',
            },
        },
    ],
}
