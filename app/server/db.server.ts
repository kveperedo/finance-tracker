import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import envServerSchema from './env.server';

const sql = neon(envServerSchema.DATABASE_URL);
const db = drizzle(sql);

export default db;
