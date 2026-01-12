import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const payload = await getPayload({ config })

    try {
        const user = await payload.create({
            collection: 'users',
            data: {
                email: 'admin@giez.com',
                password: 'adminpassword123',
            },
        })
        return NextResponse.json({ message: 'Admin created successfully', email: user.email, password: 'adminpassword123' })
    } catch (err: any) {
        console.error('Setup Error:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
