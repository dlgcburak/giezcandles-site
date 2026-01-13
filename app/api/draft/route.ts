import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const slug = searchParams.get('slug')

    if (secret !== payload.secret) {
        return new Response('Invalid token', { status: 401 })
    }

    if (!slug) {
        return new Response('Missing slug', { status: 404 })
    }

    const draft = await draftMode()
    draft.enable()

    redirect(slug)
}
