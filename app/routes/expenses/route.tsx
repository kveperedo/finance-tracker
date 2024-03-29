import { useLoaderData } from '@remix-run/react';
import { addExpense, getExpenses, getMonthlyExpenses } from './queries';
import { format } from 'date-fns';
import AddExpenseModal from './add-expense-modal';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';
import { addExpenseSchema } from './schema';
import { cn, numberFormatter, parseRequest } from '~/utils';
import type { Expense } from '~/db/types';
import useJsonFetcher from '~/hooks/useJsonFetcher';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const addExpenseSchemaWithId = addExpenseSchema.extend({
    id: z.string().uuid(),
});
type AddExpenseInputWithId = z.infer<typeof addExpenseSchemaWithId>;

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await parseRequest(request, {
            schema: addExpenseSchemaWithId,
        });

        const result = await addExpense(data);

        return { ok: true, data: result };
    } catch (error) {
        return { ok: false, error: 'Something went wrong' };
    }
}

export async function loader() {
    const [expenses, monthlyExpenses] = await Promise.all([
        getExpenses(),
        getMonthlyExpenses(),
    ]);

    return { expenses, monthlyExpenses };
}

export default function ExpensesPage() {
    const { expenses, monthlyExpenses } = useLoaderData<typeof loader>();
    const fetcher = useJsonFetcher<AddExpenseInputWithId, typeof action>();
    const pendingExpense = fetcher.json;

    const totalMonthlyExpenses =
        monthlyExpenses + (pendingExpense?.amount ?? 0);
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

    return (
        <main className="container m-auto mx-auto flex w-full flex-1 flex-col overflow-hidden border-x-0 border-black sm:border-x">
            <div className="flex items-center justify-between border-b border-black p-4">
                <div>
                    <p className="text-left">Monthly Expenses</p>
                    <p className="font-mono text-2xl font-bold">
                        <span className="font-serif text-lg font-extralight">
                            PHP{' '}
                        </span>
                        {numberFormatter.format(totalMonthlyExpenses)}
                    </p>
                </div>
                <AddExpenseModal
                    onSubmit={(data) => {
                        fetcher.submit(
                            { ...data, id: uuidv4() },
                            {
                                method: 'POST',
                                encType: 'application/json',
                            }
                        );
                    }}
                />
            </div>

            <div className="flex justify-between border-b border-black bg-stone-100 p-2 font-bold">
                <span className="flex-1 text-sm font-light">Description</span>
                <span className="basis-[100px] text-sm font-light">Date</span>
                <span className="basis-[100px] text-right text-sm font-light">
                    Amount
                </span>
            </div>

            <div className="flex-1 overflow-scroll">
                {expensesToDisplay.map((expense) => {
                    const isOptimistic = pendingExpense?.id === expense.id;

                    return (
                        <div
                            className={cn(
                                'flex items-center justify-between border-b border-b-stone-100 p-2 transition-colors',
                                isOptimistic && 'bg-lime-200'
                            )}
                            key={expense.id}>
                            <span className="flex-1">
                                {expense.description}
                            </span>
                            <span className="basis-[100px] font-mono text-sm">
                                {format(expense.createdAt, 'MM-dd-yyyy')}
                            </span>
                            <span className="basis-[100px] text-right font-mono text-sm">
                                {expense.amount}
                            </span>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
