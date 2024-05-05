import type { LoginUserInput, RegisterUserInput } from './schema';
import db from '~/db';
import bcrypt from 'bcryptjs';
import { invitations, users } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { getSession, destroySession, commitSession } from './cookie.server';
import { redirect } from '@vercel/remix';

type RegisterParams = Omit<RegisterUserInput, 'passwordConfirmation'> & {
    invitationCode: string;
};

export async function register({ email, password, invitationCode }: RegisterParams) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.transaction(async (tx) => {
        const [user] = await tx.insert(users).values({ email, passwordHash }).returning();
        await tx.update(invitations).set({ isRegistered: true }).where(eq(invitations.id, invitationCode));

        return user;
    });

    if (!user) {
        return null;
    }

    return { id: user.id, email };
}

export async function login({ email, password }: LoginUserInput) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
        return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
        return null;
    }

    return { id: user.id, email: user.email };
}

export async function logout(request: Request) {
    const session = await getUserSession(request);

    return redirect('/login', {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    });
}

function getUserSession(request: Request) {
    return getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const { userId } = session.data;

    return userId ?? null;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    const session = await getUserSession(request);
    const { userId } = session.data;

    if (!userId) {
        const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }

    return userId;
}

export async function getUser(request: Request) {
    const userId = await getUserId(request);

    if (!userId) {
        return null;
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    return user ?? null;
}

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await getSession();
    session.set('userId', userId);

    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    });
}
