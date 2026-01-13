import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // If you use remote images, add them here.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xkdwmppsvygzujndpjca.storage.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
}

export default withPayload(nextConfig)
