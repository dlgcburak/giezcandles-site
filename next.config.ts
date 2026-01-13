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
    ],
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default withPayload(nextConfig)
