import { useFetcher, useLoaderData } from '@remix-run/react';
import { cn, numberFormatter } from '~/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, LabelList, Cell, Text } from 'recharts';
import type { MonthKey } from './constants';
import { MONTHS } from './constants';
import type { loader } from './route';
import useExpenseSearchParams from './hooks/useExpenseSearchParams';
import MonthlyIncomeForm from '../resources.monthly-savings/monthly-income-form';
import { Dialog, DialogTrigger } from 'react-aria-components';
import Button from '~/components/button';
import { Ellipsis } from 'lucide-react';
import Popover from '~/components/popover';

function EmptyMonthlyIncome() {
    const fetcher = useFetcher();

    return (
        <div className="flex flex-col gap-4 p-4">
            <p className="text-sm">Want to track your savings per month? Set your monthly income now!</p>
            <MonthlyIncomeForm fetcher={fetcher} />
        </div>
    );
}

export default function MonthlySavingsPanel() {
    const { monthlyIncome, monthlyExpenses, savingsSummary } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    const [{ month, year }] = useExpenseSearchParams();
    const isEmptyIncome = monthlyIncome === null || !savingsSummary;

    return (
        <div className="flex flex-col rounded border border-stone-300 bg-white shadow-sm">
            <div className="flex flex-1 items-center justify-between border-b border-stone-300 p-4">
                <p className="text-sm font-medium">Savings</p>
            </div>
            {isEmptyIncome ? (
                <EmptyMonthlyIncome />
            ) : (
                <>
                    <div className="flex justify-evenly p-4">
                        <div className="ml-8">
                            <p className="text-sm text-stone-600">Monthly savings</p>
                            <p className="text-lg font-bold">
                                <span className="text-sm font-light">PHP </span>
                                {numberFormatter.format(monthlyIncome - monthlyExpenses)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-stone-600">Monthly income</p>
                            <p className="text-lg font-bold">
                                <span className="text-sm font-light">PHP </span>
                                {numberFormatter.format(monthlyIncome)}
                                <DialogTrigger>
                                    <Button className="ml-1 inline-flex h-7 w-7" variant="tertiary" size="icon-sm">
                                        <Ellipsis size={16} />
                                    </Button>
                                    <Popover showArrow placement="bottom end">
                                        <Dialog aria-label="Update monthly income" className="w-72 p-4 outline-none">
                                            {({ close }) => (
                                                <div className="flex items-center gap-4">
                                                    <MonthlyIncomeForm
                                                        autoFocus
                                                        fetcher={fetcher}
                                                        defaultValue={monthlyIncome}
                                                        onSubmitSuccess={close}
                                                    />
                                                </div>
                                            )}
                                        </Dialog>
                                    </Popover>
                                </DialogTrigger>
                            </p>
                        </div>
                    </div>

                    <div className="h-64 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart margin={{ top: 16 }} data={savingsSummary}>
                                <CartesianGrid className="stroke-stone-100" vertical={false} />
                                <XAxis
                                    dataKey={({ month, year }) => `${MONTHS[month as MonthKey]}`}
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
                                <Bar barSize={32} dataKey="total">
                                    {savingsSummary.map((savings) => {
                                        const isCurrentMonth = savings.month === month && savings.year === year;

                                        return (
                                            <Cell
                                                key={`${savings.month}-${savings.year}`}
                                                className={cn(isCurrentMonth ? 'fill-stone-700' : 'fill-stone-300')}
                                            />
                                        );
                                    })}
                                    <LabelList
                                        className="fill-stone-700 text-xs font-medium"
                                        dataKey="total"
                                        position="top"
                                        formatter={(value: number) => numberFormatter.format(value)}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}
