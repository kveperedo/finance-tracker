import type { WithUserId } from '~/auth/types';
import { getMonthlyExpenses } from '../resources.expenses/queries';
import type { Expense } from '~/db/types';
import db from '~/db';
import { expenses, expensesCategories } from '~/db/schema';
import { and, between, eq, sum } from 'drizzle-orm';
import { getFirstAndEndOfMonth } from '~/utils';

export const getYearlyExpenses = async ({ userId, year }: WithUserId<{ year?: number }>) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const monthlyExpenses = (await Promise.all(months.map((month) => getMonthlyExpenses({ userId, month, year })))).map(
        (total, index) => ({ month: index + 1, total })
    );

    return monthlyExpenses;
};

const getTotalExpenseByCategory = async ({
    userId,
    month,
    year,
    category,
}: WithUserId<{ year?: number; month?: number; category: Expense['category'] }>) => {
    const { startDate, endDate } = getFirstAndEndOfMonth({ month, year });

    const [result] = await db
        .select({
            total: sum(expenses.amount),
        })
        .from(expenses)
        .where(
            and(
                eq(expenses.userId, userId),
                eq(expenses.category, category),
                between(expenses.createdAt, startDate, endDate)
            )
        );

    return result?.total ? parseFloat(result.total) : 0;
};

export const getTotalExpensesByCategory = async ({
    userId,
    month,
    year,
}: WithUserId<{ year?: number; month?: number }>) => {
    const categories = expensesCategories.enumValues;

    return (
        await Promise.all(categories.map((category) => getTotalExpenseByCategory({ userId, category, year, month })))
    ).map((total, index) => ({ category: categories[index]!, total }));
};
