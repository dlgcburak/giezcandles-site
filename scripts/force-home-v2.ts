
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const forceHome = async () => {
    try {
        const { getPayload } = await import('payload')
        const { default: configPromise } = await import('@payload-config')
        const payload = await getPayload({ config: configPromise })

        console.log('--- FORCE SEED HOME V2 ---')

        // 1. Ensure Media Exists (Required for Hero)
        let mediaId: string | number | undefined
        const media = await payload.find({ collection: 'media', limit: 1 })

        if (media.totalDocs > 0) {
            mediaId = media.docs[0].id
            console.log(`Using existing media: ${mediaId}`)
        } else {
            console.log('No media found. Creating placeholder media...')
            // We can't easily upload a file from script without a file path.
            // But we can try to create a record if upload is not strictly required on create (depends on config).
            // Usually 'upload' field requires a file.
            // WORKAROUND: Use a "Content" only block for Home if no media.
            console.log('WARNING: Cannot create Hero block without media. Skipping Hero.')
        }

        // 2. Prepare Layout
        const layout: any[] = []

        // Hero (Only if media exists)
        if (mediaId) {
            layout.push({
                blockType: 'hero',
                type: 'default',
                title: 'Butik mumlar, sıcak bir his',
                subtitle: 'Giez Candle ile evine ve sevdiklerine küçük ama etkili bir dokunuş.',
                images: [{ image: mediaId, alt: 'Placeholder' }]
            })
        }

        // Content
        layout.push({
            blockType: 'content',
            title: 'Marka Hikayesi',
            alignment: 'center',
            backgroundColor: 'cream',
            richText: {
                root: {
                    type: 'root',
                    children: [{
                        type: 'paragraph',
                        children: [{ type: 'text', text: 'Giez Candle...', version: 1 }],
                        version: 1,
                    }],
                    direction: null,
                    format: '',
                    indent: 0,
                    version: 1,
                }
            }
        })

        // 3. Delete existing Home (to force overwrite/fix) & Debug Page
        await payload.delete({
            collection: 'pages',
            where: {
                or: [
                    { slug: { equals: 'home' } },
                    { slug: { equals: 'debug-test' } }
                ]
            }
        })
        console.log('Cleaned up old pages.')

        // 4. Create Home
        const homePage = await payload.create({
            collection: 'pages',
            data: {
                title: 'Ana Sayfa',
                slug: 'home',
                layout: layout,
                _status: 'published',
            }
        })

        console.log(`SUCCESS: Home Page created with ID: ${homePage.id}`)
        process.exit(0)

    } catch (error) {
        console.error('FORCE SEED FAILED:', JSON.stringify(error, null, 2))
        process.exit(1)
    }
}

forceHome()
