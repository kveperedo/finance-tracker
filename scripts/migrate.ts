import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';
import envServerSchema from '~/env.server';
config({ path: '.env' });

const sql = neon(envServerSchema.DATABASE_URL);
const db = drizzle(sql);

const main = async () => {
	console.log('Migrating database...');

	try {
		await migrate(db, { migrationsFolder: 'migrations' });
		console.log('Migration completed');
	} catch (error) {
		console.error('Error during migration:', error);
		process.exit(1);
	}
};
main();
