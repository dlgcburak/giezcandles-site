import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
    title?: string
    richText: any
    alignment: 'left' | 'center' | 'right'
    backgroundColor: 'white' | 'cream'
}

export const ContentBlock: React.FC<Props> = ({ title, richText, alignment }) => {
    // Mapping alignment to inline styles or classes if needed, 
    // but site.css mostly relies on default flow.
    // We'll use a container > card structure to keep it consistent with the "About" section.

    return (
        <section className="container">
            <div className="card about" style={{ padding: '26px' }}>
                {title && (
                    <div className="sectionTitle">
                        <h2>{title}</h2>
                    </div>
                )}
                <div style={{ lineHeight: 1.7, color: 'rgba(34,17,22,.84)' }}>
                    <RichText data={richText} />
                </div>
            </div>
        </section>
    )
}
