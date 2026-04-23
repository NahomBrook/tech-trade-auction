// Author: Nahom Brook
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['ws', '@prisma/client', '@neondatabase/serverless'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
}

export default nextConfig
