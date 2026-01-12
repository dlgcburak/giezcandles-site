import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const url = searchParams.get('url')

    if (!secret || !url) {
        return new Response('Missing parameters', { status: 400 })
    }

    if (secret !== process.env.PAYLOAD_SECRET) {
        return new Response('Invalid token', { status: 401 })
    }

    const payload = await getPayload({ config })
    const draft = await draftMode()

    draft.enable()

    return redirect(url)
}
