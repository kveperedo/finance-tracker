import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import envServerSchema from '~/env.server';
import * as schema from './schema';

const sql = neon(envServerSchema.DATABASE_URL);
const db = drizzle(sql, { schema });

export default db;
