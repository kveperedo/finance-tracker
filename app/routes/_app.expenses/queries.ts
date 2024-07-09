import { and, between, desc, eq, ilike } from 'drizzle-orm';
import db from '~/db';
import { expenses, userDetails } from '~/db/schema';
import { sub, add } from 'date-fns';
import type { WithUserId } from '~/auth/types';
import { getDate, getFirstAndEndOfMonth, getMonth, getYear } from '~/utils';
import { getMonthlyExpenses } from '../resources.expenses/queries';
import type { Expense } from '~/db/types';

export type ExpenseParams = WithUserId<{
    month?: number;
    year?: number;
    search?: string;
    category?: Expense['category'];
}>;

export function getExpenses({ userId, month, year, search, category }: ExpenseParams) {
    const { startDate, endDate } = getFirstAndEndOfMonth({ month, year });

    return db
        .select({
            id: expenses.id,
            description: expenses.description,
            amount: expenses.amount,
            category: expenses.category,
            createdAt: expenses.createdAt,
            updatedAt: expenses.updatedAt,
        })
        .from(expenses)
        .where(
            and(
                eq(expenses.userId, userId),
                between(expenses.updatedAt, startDate, endDate),
                search ? ilike(expenses.description, `%${search}%`) : undefined,
                category ? eq(expenses.category, category) : undefined
            )
        )
        .orderBy(desc(expenses.updatedAt));
}

export type GetExpensesReturnType = Awaited<ReturnType<typeof getExpenses>>;

export async function getUserRole(userId: string) {
    const [result] = await db
        .select({
            role: userDetails.role,
        })
        .from(userDetails)
        .where(eq(userDetails.userId, userId));

    if (!result) {
        return null;
    }

    return result.role;
}

export async function getUserMonthlyIncome(userId: string) {
    const [result] = await db
        .select({
            monthlyIncome: userDetails.monthlyIncome,
        })
        .from(userDetails)
        .where(eq(userDetails.userId, userId));
    if (!result) {
        return null;
    }

    return result.monthlyIncome ? parseFloat(result.monthlyIncome) : null;
}

const MONTHS_TO_GENERATE_SAVINGS = 4;

const generatePreviousMonthsAndYears = (count: number, startDate: Date) => {
    return Array.from({ length: count }, (_, index) => {
        const date = sub(startDate, { months: index });

        return { month: getMonth(date), year: getYear(date) };
    });
};

export async function getSavingsSummary({
    userId,
    month = getMonth(),
    year = getYear(),
}: WithUserId<{ month?: number; year?: number }>) {
    const userMonthlyIncome = await getUserMonthlyIncome(userId);
    if (!userMonthlyIncome) {
        return null;
    }

    const currentDate = new Date();
    const isCurrentMonthAndYear = month === getMonth(currentDate) && year === getYear(currentDate);

    const generatedMonthsAndYears = generatePreviousMonthsAndYears(
        MONTHS_TO_GENERATE_SAVINGS,
        isCurrentMonthAndYear ? currentDate : add(getDate(month!, year!), { months: 1 })
    );

    return (
        await Promise.all(generatedMonthsAndYears.map(({ month, year }) => getMonthlyExpenses({ userId, month, year })))
    )
        .map((expense, index) => {
            const { month, year } = generatedMonthsAndYears[index]!;

            if (expense === 0) {
                // If there are no expenses for the month,
                // we just set the total to zero so that the
                // chart will be cleaner.
                return { month, year, total: 0 };
            }

            return { month, year, total: userMonthlyIncome - expense };
        })
        .reverse();
}
