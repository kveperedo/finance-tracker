import z from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    SESSION_SECRET: z.string().min(1),
});

const envServer = envSchema.safeParse(process.env);
if (!envServer.success) {
    console.error(envServer.error.issues);
    throw new Error(
        `Missing server environment variables. ${envServer.error.message}`
    );
}

const envServerSchema = envServer.data;

export default envServerSchema;
