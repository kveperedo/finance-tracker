import { createCookieSessionStorage } from '@vercel/remix';
import envServerSchema from '~/env.server';

type SessionData = {
    userId: string;
};

type SessionFlashData = {
    error: string;
};

const sessionSecret = envServerSchema.SESSION_SECRET;

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData, SessionFlashData>({
        cookie: {
            name: '__session',
            secure: process.env.NODE_ENV === 'production',
            secrets: [sessionSecret],
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
        },
    });

export { getSession, commitSession, destroySession };
