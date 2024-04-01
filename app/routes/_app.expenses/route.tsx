import { useFetcher, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@vercel/remix';
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

    const [expenses, monthlyExpenses] = await Promise.all([getExpenses(userId), getMonthlyExpenses(userId)]);

    return { expenses, monthlyExpenses };
}

export default function ExpensesPage() {
    const { expenses, monthlyExpenses } = useLoaderData<typeof loader>();
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

    const pendingExpense = fetcher.formData
        ? (generateFormData(fetcher.formData) as AddExpenseInput & { id: string })
        : null;

    if (pendingExpense) {
        console.log(pendingExpense);
    }

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

    return (
        <main className="container m-auto mx-auto flex w-full flex-1 flex-col overflow-hidden border-x-0 border-black sm:border-x">
            <div className="flex items-center justify-between border-b border-black p-4">
                <div>
                    <p className="text-left">Monthly Expenses</p>
                    <p className="font-mono text-2xl font-bold">
                        <span className="font-serif text-lg font-extralight">PHP </span>
                        {numberFormatter.format(totalMonthlyExpenses)}
                    </p>
                </div>
                <AddExpenseModal formMethods={formMethods} />
            </div>

            <div className="flex justify-between border-b border-black bg-stone-100 p-2 font-bold">
                <span className="flex-1 text-sm font-light">Description</span>
                <span className="basis-[100px] text-sm font-light">Date</span>
                <span className="basis-[100px] text-right text-sm font-light">Amount</span>
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
                            <span className="flex-1">{expense.description}</span>
                            <span className="basis-[100px] font-mono text-sm">
                                {format(expense.createdAt, 'MM-dd-yyyy')}
                            </span>
                            <span className="basis-[100px] text-right font-mono text-sm">{expense.amount}</span>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
