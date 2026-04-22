// Author: Nahom Brook
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Tell Next.js not to attempt to bundle these Node.js-native packages.
  // ws uses native bindings; @prisma/client ships pre-built platform binaries.
  // Marking them external ensures they load from node_modules at runtime
  // instead of being mangled by webpack/turbopack.
  serverExternalPackages: ['ws', '@prisma/client', '@neondatabase/serverless'],
}

export default nextConfig
