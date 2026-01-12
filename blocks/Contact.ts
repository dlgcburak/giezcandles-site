import { Block } from 'payload'

export const Contact: Block = {
    slug: 'contact',
    labels: {
        singular: 'İletişim Formu',
        plural: 'İletişim Formları',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Başlık',
            defaultValue: 'İletişim',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Açıklama',
            defaultValue: 'Mesaj taslak olarak kaydedildi. Canlıya almak için form servisi bağlayabiliriz.',
        },
    ],
}
