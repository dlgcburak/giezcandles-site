
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const debugPages = async () => {
    try {
        const { getPayload } = await import('payload')
        const { default: configPromise } = await import('@payload-config')
        const payload = await getPayload({ config: configPromise })

        console.log('--- DEBUG INFO ---')

        // Check DB Connection String (Masked)
        const dbUri = process.env.DATABASE_URI || 'UNDEFINED'
        const maskedUri = dbUri.replace(/:[^:@]*@/, ':****@')
        console.log(`DATABASE_URI: ${maskedUri}`)

        // CREATE TEST PAGE
        console.log('Attempting to create Test Page...')
        const testPage = await payload.create({
            collection: 'pages',
            data: {
                title: ' Debug Test Page',
                slug: 'debug-test',
                layout: [
                    {
                        blockType: 'content',
                        title: 'Debug Content',
                        alignment: 'center',
                        backgroundColor: 'white',
                        richText: {
                            root: {
                                type: 'root',
                                children: [{
                                    type: 'paragraph',
                                    children: [{ type: 'text', text: 'Debug text', version: 1 }],
                                    version: 1,
                                }],
                                direction: null,
                                format: '',
                                indent: 0,
                                version: 1,
                            }
                        }
                    }
                ],
                _status: 'published', // Force published
            }
        })
        console.log(`Test Page Created: ID ${testPage.id}`)

        // Find Pages
        const pages = await payload.find({
            collection: 'pages',
            limit: 100,
            draft: true, // Include drafts
        })

        console.log(`Total Pages Found: ${pages.totalDocs}`)

        pages.docs.forEach(p => {
            console.log(` - ID: ${p.id}, Title: "${p.title}", Slug: "${p.slug}", Status: ${p._status || 'N/A'}`)
        })

        process.exit(0)
    } catch (error) {
        console.error('Debug failed:', JSON.stringify(error, null, 2))
        process.exit(1)
    }
}

debugPages()
