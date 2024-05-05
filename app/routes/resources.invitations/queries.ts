import { eq } from 'drizzle-orm';
import db from '~/db';
import { invitations } from '~/db/schema';

export async function validateInvitationCode(invitationCode: string) {
    const [result] = await db.select().from(invitations).where(eq(invitations.id, invitationCode));

    if (!result) {
        return false;
    }

    return !result.isRegistered;
}

export async function generateInvitationCode() {
    const [result] = await db.insert(invitations).values({}).returning();

    return result?.id ?? null;
}
