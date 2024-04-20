import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import envServerSchema from '~/env.server';

const client = postgres(envServerSchema.DATABASE_URL, { prepare: false });
const db = drizzle(client);

export default db;
