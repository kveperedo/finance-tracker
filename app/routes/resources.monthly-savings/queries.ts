import { eq } from 'drizzle-orm';
import db from '~/db';
import { userDetails } from '~/db/schema';

export async function addUserMonthlyIncome(userId: string, monthlyIncome: number) {
    const [result] = await db
        .insert(userDetails)
        .values({
            userId,
            monthlyIncome: String(monthlyIncome),
        })
        .returning();

    return result;
}

export async function updateUserMonthlyIncome(userId: string, monthlyIncome: number) {
    const [result] = await db
        .update(userDetails)
        .set({ monthlyIncome: String(monthlyIncome) })
        .where(eq(userDetails.userId, userId))
        .returning();

    return result;
}
