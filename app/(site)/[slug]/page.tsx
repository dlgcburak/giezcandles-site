import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'

export async function generateStaticParams() {
    const payload = await getPayload({ config })
    const pages = await payload.find({
        collection: 'pages',
        limit: 0,
    })

    return pages.docs.map((page) => ({
        slug: page.slug,
    }))
}

type Props = {
    params: Promise<{
        slug: string
    }>
}

export default async function Page({ params }: Props) {
    const { slug } = await params
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: slug,
            },
        },
    })

    const page = result.docs?.[0]

    if (!page) {
        return notFound()
    }

    // Populate dynamic blocks (e.g. Archive blocks fetch their collections)
    if (page.layout && Array.isArray(page.layout)) {
        await Promise.all(
            page.layout.map(async (block: any) => {
                if (block.blockType === 'archive' && block.populateBy === 'collection' && block.relation) {
                    const collectionId = typeof block.relation === 'object' ? block.relation.id : block.relation
                    const productsResult = await payload.find({
                        collection: 'products',
                        where: {
                            collection: {
                                equals: collectionId,
                            },
                        },
                        limit: block.limit || 10,
                        depth: 1,
                    })
                    block.populatedDocs = productsResult.docs
                }
            }),
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <RenderBlocks layout={page.layout} />
        </main>
    )
}
