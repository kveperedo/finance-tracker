import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { config } from 'dotenv';
import postgres from 'postgres';
import envServerSchema from '~/env.server';
config({ path: '.env' });

const main = async () => {
    console.log('Migrating database...');

    try {
        const client = postgres(envServerSchema.DATABASE_URL, { prepare: false });
        const db = drizzle(client);

        await migrate(db, { migrationsFolder: 'migrations' });
        console.log('Migration completed');
        process.exit(0);
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
};
main();
