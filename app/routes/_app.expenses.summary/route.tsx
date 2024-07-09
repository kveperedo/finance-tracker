import type { LoaderFunctionArgs } from '@vercel/remix';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Text, XAxis } from 'recharts';
import { requireUserId } from '~/auth/session.server';
import { cn, numberFormatter } from '~/utils';
import { getTotalExpensesByCategory, getYearlyExpenses } from './queries';
import { useLoaderData } from '@remix-run/react';
import type { MonthKey } from '../_app.expenses/constants';
import { MONTHS } from '../_app.expenses/constants';
import useExpenseSearchParams from '../_app.expenses/hooks/useExpenseSearchParams';
import { CategoryToggles } from './category-toggles';

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);
    const searchParams = new URL(request.url).searchParams;
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const params = {
        userId,
        year: year ? Number(year) : undefined,
        month: month ? Number(month) : undefined,
    };

    const [yearlyExpenses, expensesByCategory] = await Promise.all([
        getYearlyExpenses(params),
        getTotalExpensesByCategory(params),
    ]);

    return { yearlyExpenses, expensesByCategory };
}

export default function ExpensesSummaryPage() {
    const { yearlyExpenses } = useLoaderData<typeof loader>();
    const [{ month }] = useExpenseSearchParams();

    return (
        <div className="my-4 flex flex-1 flex-col gap-4">
            <CategoryToggles />
            <div className="flex flex-1 flex-col rounded border border-stone-300 bg-white shadow-sm">
                <div className="border-b border-stone-200 p-4">
                    <p className="text-sm font-medium">Yearly Expenses</p>
                </div>
                <div className="flex-1 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart margin={{ top: 16 }} data={yearlyExpenses}>
                            <CartesianGrid className="stroke-stone-100" vertical={false} />
                            <XAxis
                                dataKey={({ month }) => `${MONTHS[month as MonthKey]}`}
                                axisLine={false}
                                tickLine={false}
                                tick={({ x, y, payload }) => (
                                    <g transform={`translate(${x},${y})`}>
                                        <Text className="fill-stone-600 text-xs" textAnchor="middle">
                                            {payload.value}
                                        </Text>
                                    </g>
                                )}
                                tickMargin={12}
                                interval={0}
                            />
                            <Bar barSize={64} dataKey="total">
                                {yearlyExpenses.map((expense) => {
                                    const isCurrentMonth = expense.month === month;

                                    return (
                                        <Cell
                                            key={expense.month}
                                            className={cn(isCurrentMonth ? 'fill-stone-700' : 'fill-stone-300')}
                                        />
                                    );
                                })}
                                <LabelList
                                    className="fill-stone-700 text-xs font-medium"
                                    dataKey="total"
                                    position="top"
                                    formatter={(value: number) => (value === 0 ? '' : numberFormatter.format(value))}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
