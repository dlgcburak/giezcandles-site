import { Block } from 'payload'

export const Hero: Block = {
    slug: 'hero',
    labels: {
        singular: 'Hero Section',
        plural: 'Hero Sections',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: 'Butik mumlar, sıcak bir his',
        },
        {
            name: 'subtitle',
            type: 'textarea',
            defaultValue: 'Giez Candle ile evine ve sevdiklerine küçük ama etkili bir dokunuş.',
        },
        {
            name: 'images',
            type: 'array',
            minRows: 1,
            maxRows: 4,
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'alt',
                    type: 'text',
                },
            ],
        },
        {
            name: 'type',
            type: 'select',
            defaultValue: 'default',
            options: [
                { label: 'Default (Full Screen)', value: 'default' },
                { label: 'Minimal (Text Only)', value: 'minimal' },
            ],
        },
    ],
}
