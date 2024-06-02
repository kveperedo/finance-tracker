import type { Config } from 'drizzle-kit';
import envServerSchema from '~/env.server';

export default {
    schema: 'app/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: envServerSchema.DATABASE_URL,
    },
    verbose: true,
    strict: true,
    out: './migrations',
} satisfies Config;
