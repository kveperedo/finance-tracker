import { useFetcher, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@vercel/remix';
import type { ExpenseParams } from './queries';
import { addExpense, getExpenses, getMonthlyExpenses } from './queries';
import { format } from 'date-fns';
import AddExpenseModal from './add-expense-modal';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@vercel/remix';
import type { AddExpenseInput } from './schema';
import { addExpenseSchema } from './schema';
import type { Expense } from '~/db/types';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserId } from '~/auth/session.server';
import { generateFormData } from '~/lib/remix-hook-form';
import { cn, numberFormatter } from '~/utils';
import ExpenseFilterDropdown from './expense-filter-dropdown';
import { useEffect, useRef } from 'react';

const addExpenseSchemaWithId = addExpenseSchema.extend({
    id: z.string().uuid(),
});
type AddExpenseInputWithId = z.infer<typeof addExpenseSchemaWithId>;

export async function action({ request }: ActionFunctionArgs) {
    try {
        const { data, errors } = await getValidatedFormData<AddExpenseInputWithId>(
            request,
            zodResolver(addExpenseSchemaWithId)
        );

        if (errors) {
            return json({ error: 'Invalid request' }, { status: 400 });
        }

        const userId = await getUserId(request);
        if (!userId) {
            return redirect('/login');
        }

        const result = await addExpense({ ...data, userId });

        return { ok: true, data: result };
    } catch (error) {
        console.error(error);
        return { ok: false, error: 'Something went wrong' };
    }
}

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }

    const searchParams = new URL(request.url).searchParams;
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const params: ExpenseParams = {
        userId,
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
    };

    const [expenses, monthlyExpenses] = await Promise.all([getExpenses(params), getMonthlyExpenses(params)]);

    return { expenses, monthlyExpenses };
}

export default function ExpensesPage() {
    const { expenses, monthlyExpenses } = useLoaderData<typeof loader>();
    const tableRef = useRef<HTMLDivElement>(null);
    const fetcher = useFetcher<typeof action>();
    const formMethods = useRemixForm<AddExpenseInput>({
        resolver: zodResolver(addExpenseSchema),
        submitData: {
            id: uuidv4(),
        },
        defaultValues: {
            description: '',
            amount: 0,
        },
        fetcher,
    });
    const {
        formState: { isSubmitting, isSubmitted },
    } = formMethods;

    useEffect(() => {
        if (isSubmitted) {
            tableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isSubmitting, isSubmitted]);

    const pendingExpense = fetcher.formData
        ? (generateFormData(fetcher.formData) as AddExpenseInput & { id: string })
        : null;

    const totalMonthlyExpenses = monthlyExpenses + (pendingExpense?.amount ?? 0);
    const expensesToDisplay = pendingExpense
        ? [
              {
                  ...pendingExpense,
                  amount: String(pendingExpense.amount),
                  createdAt: new Date(),
                  updatedAt: new Date(),
              } as Expense,
              ...expenses,
          ]
        : expenses;
    const hasEmptyExpenses = expensesToDisplay.length === 0;

    return (
        <main className="container m-auto mx-auto flex w-full flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 sm:px-0">
                <ExpenseFilterDropdown />
                <AddExpenseModal formMethods={formMethods} />
            </div>

            {hasEmptyExpenses ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-1">
                    <p className="font-semibold">No expenses this month!</p>
                    <p className="text-sm text-stone-500">Start adding expenses by clicking the button above.</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between rounded bg-stone-100 p-2">
                        <span className="flex-1 text-xs font-bold text-stone-500">Description</span>
                        <span className="basis-[100px] text-xs font-bold text-stone-500">Date</span>
                        <span className="basis-[100px] text-right text-xs font-bold text-stone-500">Amount</span>
                    </div>

                    <div ref={tableRef} className="flex-1 overflow-scroll">
                        {expensesToDisplay.map((expense) => {
                            const isOptimistic = pendingExpense?.id === expense.id;

                            return (
                                <div
                                    className={cn(
                                        'flex items-center justify-between border-b border-b-stone-100 p-2 text-sm text-stone-600 transition-colors',
                                        isOptimistic && 'bg-lime-200'
                                    )}
                                    key={expense.id}
                                >
                                    <span className="flex-1">{expense.description}</span>
                                    <span className="basis-[100px] font-mono text-sm">
                                        {format(expense.createdAt, 'MM-dd-yyyy')}
                                    </span>
                                    <span className="basis-[100px] text-right font-mono text-sm">
                                        {numberFormatter.format(parseFloat(expense.amount))}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {!hasEmptyExpenses && (
                <div className="flex items-center justify-end p-4">
                    <p className="font-mono text-xl font-bold">
                        <span className="font-serif text-sm font-extralight">PHP </span>
                        {numberFormatter.format(totalMonthlyExpenses)}
                    </p>
                </div>
            )}
        </main>
    );
}
