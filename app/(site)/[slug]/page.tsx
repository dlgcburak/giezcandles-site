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

import { draftMode } from 'next/headers'
import { PagePreviewClient } from '@/components/PagePreviewClient'

// ... existing imports

export default async function Page({ params }: Props) {
    const { slug } = await params
    const { isEnabled: isDraft } = await draftMode()
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'pages',
        draft: isDraft,
        where: {
            slug: {
                equals: slug,
            },
        },
        depth: 3,
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
                    // Handle multiple collections
                    const relations = Array.isArray(block.relation) ? block.relation : [block.relation]

                    // Build a map of collection order for sorting
                    const collectionOrderMap = new Map<string, number>()
                    relations.forEach((rel: any, index: number) => {
                        const id = typeof rel === 'object' ? rel.id : rel
                        const order = typeof rel === 'object' && rel.order != null ? rel.order : index
                        collectionOrderMap.set(id, order)
                    })

                    // Get all collection IDs
                    const collectionIds = relations.map((rel: any) =>
                        typeof rel === 'object' ? rel.id : rel
                    )

                    // Fetch products for all selected collections
                    const productsResult = await payload.find({
                        collection: 'products',
                        where: {
                            collection: {
                                in: collectionIds,
                            },
                        },
                        limit: block.limit || 100,
                        depth: 2,
                    })

                    // Sort products by their collection's order
                    block.populatedDocs = productsResult.docs.sort((a: any, b: any) => {
                        const aCollectionId = typeof a.collection === 'object' ? a.collection.id : a.collection
                        const bCollectionId = typeof b.collection === 'object' ? b.collection.id : b.collection
                        const aOrder = collectionOrderMap.get(aCollectionId) ?? 999
                        const bOrder = collectionOrderMap.get(bCollectionId) ?? 999
                        return aOrder - bOrder
                    })

                    // Store relations for component to access
                    block.populatedRelations = relations
                }
            }),
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <PagePreviewClient initialData={page} />
        </main>
    )
}
