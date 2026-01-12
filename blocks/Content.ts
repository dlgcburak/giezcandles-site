import { Block } from 'payload'

export const Content: Block = {
    slug: 'content',
    labels: {
        singular: 'Content Section',
        plural: 'Content Sections',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Section Title',
        },
        {
            name: 'richText',
            type: 'richText',
            required: true,
        },
        {
            name: 'alignment',
            type: 'select',
            defaultValue: 'center',
            options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
            ],
        },
        {
            name: 'backgroundColor',
            type: 'select',
            defaultValue: 'white',
            options: [
                { label: 'White', value: 'white' },
                { label: 'Cream (Brand)', value: 'cream' },
            ],
        },
    ],
}
