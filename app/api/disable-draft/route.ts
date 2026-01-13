import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest): Promise<NextResponse> {
    const draft = await draftMode()
    await draft.disable()
    return NextResponse.redirect(new URL('/', req.url))
}
