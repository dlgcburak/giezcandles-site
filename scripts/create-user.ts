import { getPayload } from 'payload'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

dotenv.config({
    path: path.resolve(dirname, '../.env.local'),
})


const createUser = async () => {
    const config = (await import('../payload.config')).default
    console.log('Initializing Payload...')
    try {
        const payload = await getPayload({ config })
        console.log('Payload initialized.')

        console.log('Attempting to create user: admin@giez.com')
        const user = await payload.create({
            collection: 'users',
            data: {
                email: 'admin@giez.com',
                password: 'adminpassword123',
            },
        })
        console.log('SUCCESS: Admin user created successfully:', user.email)
    } catch (err: any) {
        console.error('ERROR:', err.message)
    }
    process.exit(0)
}

createUser()
