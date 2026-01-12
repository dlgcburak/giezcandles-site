import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'

console.log('PAYLOAD_SECRET exists:', !!process.env.PAYLOAD_SECRET)

async function checkData() {
    const payload = await getPayload({ config })

    const pages = await payload.find({
        collection: 'pages',
        where: { slug: { equals: 'home' } }
    })

    console.log('--- PAGES ---')
    console.log(JSON.stringify(pages.docs, null, 2))

    const products = await payload.find({
        collection: 'products',
        limit: 5
    })
    console.log('--- PRODUCTS ---')
    console.log(JSON.stringify(products.docs, null, 2))

    const collections = await payload.find({
        collection: 'collections',
        limit: 5
    })
    console.log('--- COLLECTIONS ---')
    console.log(JSON.stringify(collections.docs, null, 2))

    process.exit(0)
}

checkData()
