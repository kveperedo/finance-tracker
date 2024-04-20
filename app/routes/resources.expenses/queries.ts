import db from '~/db';
import type { AddExpenseInput } from './schema';
import { expenses } from '~/db/schema';

export async function addExpense({
    amount,
    description,
    id,
    userId,
}: AddExpenseInput & { id: string; userId: string }) {
    const result = await db
        .insert(expenses)
        .values({ id, description, amount: String(amount), userId })
        .returning();

    return result[0];
}
