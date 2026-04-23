// Author: Nahom Brook
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },

  // engine: "classic" → Prisma CLI uses the Rust query engine over a direct TCP
  // connection. We route it through DIRECT_URL (port 443) to bypass any ISP or
  // firewall that blocks port 5432. The app runtime never uses this engine;
  // it uses the PrismaNeon WebSocket adapter in src/lib/db.ts instead.
  engine: 'classic',

  datasource: {
    // url       → Prisma Client runtime connection (pooled via DATABASE_URL)
    // directUrl → Prisma CLI only: db push, migrate, db pull (port 443, non-pooler)
    url:       env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
})
