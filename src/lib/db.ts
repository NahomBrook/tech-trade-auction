// Author: Nahom Brook
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@/app/generated/prisma/client'
import ws from 'ws'

// Node.js environments (Next.js server) do not ship a native WebSocket.
// Assigning the ws constructor globally lets @neondatabase/serverless open its
// persistent WebSocket tunnel to Neon on port 443 (TLS), bypassing any ISP or
// cloud firewall that blocks port 5432.
neonConfig.webSocketConstructor = ws

// ---------------------------------------------------------------------------
// Singleton pattern — prevents exhausting the connection pool during Next.js
// hot-module replacement in development (where modules re-execute on change).
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined
}

function createClient(): PrismaClient {
  // PrismaNeon reads DATABASE_URL and establishes a WebSocket pool to Neon.
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const db = globalThis.db ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.db = db
}
