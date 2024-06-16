import db from '~/db';
import type { AddExpenseInput } from './schema';
import { expenses } from '~/db/schema';
import type { WithUserId } from '~/auth/types';
import { and, eq } from 'drizzle-orm';

type ExpenseParams = Omit<AddExpenseInput, 'intent'> & WithUserId<{ id: string }>;

export async function addExpense({ amount, description, id, userId, date, category }: ExpenseParams) {
    const [result] = await db
        .insert(expenses)
        .values({ id, description, amount: String(amount), userId, createdAt: date, updatedAt: date, category })
        .returning();

    return result;
}

export async function deleteExpense({ userId, id }: WithUserId<{ id: string }>) {
    return db.delete(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId)));
}

export async function updateExpense(params: ExpenseParams) {
    return db
        .update(expenses)
        .set({
            ...params,
            amount: String(params.amount),
            updatedAt: params.date,
        })
        .where(eq(expenses.id, params.id));
}
