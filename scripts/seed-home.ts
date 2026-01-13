import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const seedHome = async () => {
    const { getPayload } = await import('payload')
    const { default: configPromise } = await import('@payload-config')
    const payload = await getPayload({ config: configPromise })

    payload.logger.info('Checking for Home Page...')

    try {
        const existing = await payload.find({
            collection: 'pages',
            where: {
                slug: {
                    equals: 'home',
                },
            },
        })

        if (existing.totalDocs > 0) {
            payload.logger.info(`Home Page already exists: ID ${existing.docs[0].id}`)
            process.exit(0)
        }

        payload.logger.info('Home Page not found. Creating...')

        const mediaDesc = await payload.find({ collection: 'media', limit: 1 })
        const defaultImage = mediaDesc.docs[0]?.id

        const newPage = await payload.create({
            collection: 'pages',
            data: {
                title: 'Ana Sayfa',
                slug: 'home',
                layout: [
                    {
                        blockType: 'hero',
                        type: 'default',
                        title: 'Butik mumlar, sıcak bir his',
                        subtitle: 'Giez Candle ile evine ve sevdiklerine küçük ama etkili bir dokunuş.',
                        images: defaultImage ? [{ image: defaultImage }] : [],
                    },
                    {
                        blockType: 'archive',
                        introContent: {
                            root: {
                                type: 'root',
                                children: [
                                    {
                                        type: 'heading',
                                        tag: 'h2',
                                        format: 'center',
                                        version: 1,
                                        children: [{ type: 'text', text: 'Öne Çıkanlar', version: 1 }]
                                    }
                                ],
                                direction: null,
                                format: '',
                                indent: 0,
                                version: 1,
                            }
                        },
                        populateBy: 'collection',
                        limit: 4,
                    },
                    {
                        blockType: 'content',
                        title: 'Marka Hikayesi',
                        alignment: 'center',
                        backgroundColor: 'cream',
                        richText: {
                            root: {
                                type: 'root',
                                children: [
                                    {
                                        type: 'paragraph',
                                        version: 1,
                                        children: [
                                            {
                                                type: 'text',
                                                text: 'Giez Candle, el yapımı ve küçük partiler halinde üretilen butik mumlardan oluşur. Her tasarım, sıcak bir atmosfer ve özel bir hediye deneyimi hedefler.',
                                            },
                                        ],
                                    },
                                ],
                                direction: null,
                                format: '',
                                indent: 1,
                                version: 1,
                            }
                        },
                    },
                ],
            },
        })

        payload.logger.info(`Home Page created successfully: ID ${newPage.id}`)
        process.exit(0)

    } catch (error) {
        console.error('Error seeding home page:', error)
        process.exit(1)
    }
}

seedHome()
