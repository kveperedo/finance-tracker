import { and, desc, eq, gte, sum } from 'drizzle-orm';
import db from '~/db';
import { expenses } from '~/db/schema';
import { startOfMonth } from 'date-fns';
import type { AddExpenseInput } from './schema';

export function getExpenses(userId: string) {
    return db
        .select()
        .from(expenses)
        .where(and(gte(expenses.createdAt, startOfMonth(new Date())), eq(expenses.userId, userId)))
        .orderBy(desc(expenses.createdAt));
}

export async function getMonthlyExpenses(userId: string) {
    const startOfMonthDate = startOfMonth(new Date());

    const [result] = await db
        .select({
            total: sum(expenses.amount),
        })
        .from(expenses)
        .where(and(gte(expenses.createdAt, startOfMonthDate), eq(expenses.userId, userId)));

    if (!result) {
        return 0;
    }

    return result.total ? parseFloat(result.total) : 0;
}

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
