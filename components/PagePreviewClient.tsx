'use client'

import React from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { RenderBlocks } from '@/components/RenderBlocks'
import type { Page } from '@/payload-types'

type Props = {
    initialData: Page
}

export const PagePreviewClient: React.FC<Props> = ({ initialData }) => {
    const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { data } = useLivePreview<Page>({
        initialData,
        serverURL,
        depth: 3,
    })

    return <RenderBlocks layout={data.layout} />
}
