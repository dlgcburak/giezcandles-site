import React from 'react'
import { HeroBlock } from './blocks/HeroBlock'
import { ContentBlock } from './blocks/ContentBlock'
import { ArchiveBlock } from './blocks/ArchiveBlock'
import { ContactBlock } from './blocks/ContactBlock'

type Props = {
    layout: any[] // Generic payload block type
}

export const RenderBlocks: React.FC<Props> = ({ layout }) => {
    if (!layout || !Array.isArray(layout) || layout.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col w-full">
            {layout.map((block, index) => {
                const { blockType } = block

                if (blockType && components[blockType]) {
                    const Component = components[blockType]
                    return <Component key={index} {...block} />
                }

                return null
            })}
        </div>
    )
}

const components: Record<string, React.FC<any>> = {
    hero: HeroBlock,
    content: ContentBlock,
    archive: ArchiveBlock,
    contact: ContactBlock,
}
