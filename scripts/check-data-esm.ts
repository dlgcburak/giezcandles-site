import { getPayload } from 'payload'
import config from '../payload.config'

async function checkData() {
    try {
        console.log('PAYLOAD_SECRET exists:', !!process.env.PAYLOAD_SECRET)
        const payload = await getPayload({ config })

        console.log('--- PAGES ---')
        const pages = await payload.find({
            collection: 'pages',
            where: { slug: { equals: 'home' } }
        })
        console.log(JSON.stringify(pages.docs, null, 2))

        console.log('--- PRODUCTS ---')
        const products = await payload.find({
            collection: 'products',
            limit: 5
        })
        console.log(JSON.stringify(products.docs, null, 2))

        console.log('--- COLLECTIONS ---')
        const collections = await payload.find({
            collection: 'collections',
            limit: 5
        })
        console.log(JSON.stringify(collections.docs, null, 2))
    } catch (err) {
        console.error('Error:', err)
    }
    process.exit(0)
}

checkData()
