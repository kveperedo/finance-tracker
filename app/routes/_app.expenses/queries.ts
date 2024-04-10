import { and, between, desc, eq, sum } from 'drizzle-orm';
import db from '~/db';
import { expenses } from '~/db/schema';
import { startOfMonth, endOfMonth } from 'date-fns';
import type { AddExpenseInput } from './schema';

function getFirstAndEndOfMonth({
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
}: Omit<ExpenseParams, 'userId'>) {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    return { startDate, endDate };
}

export type ExpenseParams = {
    userId: string;
    month?: number;
    year?: number;
};

export function getExpenses({ userId, month, year }: ExpenseParams) {
    const { startDate, endDate } = getFirstAndEndOfMonth({ month, year });

    return db
        .select()
        .from(expenses)
        .where(and(eq(expenses.userId, userId), between(expenses.createdAt, startDate, endDate)))
        .orderBy(desc(expenses.createdAt));
}

export async function getMonthlyExpenses({ userId, month, year }: ExpenseParams) {
    const { startDate, endDate } = getFirstAndEndOfMonth({ month, year });

    const [result] = await db
        .select({
            total: sum(expenses.amount),
        })
        .from(expenses)
        .where(and(eq(expenses.userId, userId), between(expenses.createdAt, startDate, endDate)));

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
