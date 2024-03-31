import { desc, gte, sum } from 'drizzle-orm';
import db from '~/db';
import { expenses } from '~/db/schema';
import { startOfMonth } from 'date-fns';
import type { AddExpenseInput } from './schema';

export function getExpenses() {
    return db
        .select()
        .from(expenses)
        .where(gte(expenses.createdAt, startOfMonth(new Date())))
        .orderBy(desc(expenses.createdAt));
}

export async function getMonthlyExpenses() {
    const startOfMonthDate = startOfMonth(new Date());

    const [result] = await db
        .select({
            total: sum(expenses.amount),
        })
        .from(expenses)
        .where(gte(expenses.createdAt, startOfMonthDate));

    if (!result) {
        return 0;
    }

    return result.total ? parseFloat(result.total) : 0;
}

export async function addExpense({
    amount,
    description,
    id,
}: AddExpenseInput & { id: string }) {
    const result = await db
        .insert(expenses)
        .values({ id, description, amount: String(amount) })
        .returning();

    return result[0];
}
