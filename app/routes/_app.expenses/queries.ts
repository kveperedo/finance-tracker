import { and, between, desc, eq, ilike, sum } from 'drizzle-orm';
import db from '~/db';
import { expenses, userDetails } from '~/db/schema';
import { startOfMonth, endOfMonth, sub, add } from 'date-fns';
import type { WithUserId } from '~/auth/types';

const getMonth = (date: Date = new Date()) => date.getMonth() + 1;
const getYear = (date: Date = new Date()) => date.getFullYear();
const getDate = (month: number, year: number) => new Date(year, month - 1);

function getFirstAndEndOfMonth({ month = getMonth(), year = getYear() }: Omit<ExpenseParams, 'userId'>) {
    const date = getDate(month, year);
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    return { startDate, endDate };
}

export type ExpenseParams = WithUserId<{
    month?: number;
    year?: number;
    search?: string;
}>;

export function getExpenses({ userId, month, year, search }: ExpenseParams) {
    const { startDate, endDate } = getFirstAndEndOfMonth({ month, year });

    return db
        .select({
            id: expenses.id,
            description: expenses.description,
            amount: expenses.amount,
            createdAt: expenses.createdAt,
            updatedAt: expenses.updatedAt,
        })
        .from(expenses)
        .where(
            and(
                eq(expenses.userId, userId),
                between(expenses.createdAt, startDate, endDate),
                search ? ilike(expenses.description, `%${search}%`) : undefined
            )
        )
        .orderBy(desc(expenses.createdAt));
}

export type GetExpensesReturnType = Awaited<ReturnType<typeof getExpenses>>;

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
