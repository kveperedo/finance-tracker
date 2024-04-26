import { useFetchers, useLoaderData } from '@remix-run/react';
import type { loader } from '../route';
import { FETCHER_KEY } from '~/routes/resources.expenses/expense-form';
import { useMemo } from 'react';
import { generateFormData } from '~/lib/remix-hook-form';
import type { AddExpenseInputWithId, DeleteExpenseInput } from '~/routes/resources.expenses/schema';
import type { GetExpensesReturnType } from '../queries';

type DisplayExpense = GetExpensesReturnType[number] & {
    isPending: boolean;
    index: number;
};

export default function useDisplayedExpenses(): Array<DisplayExpense> {
    const { expenses } = useLoaderData<typeof loader>();

    const fetchers = useFetchers();
    const expenseFetchers = fetchers.filter(({ key }) =>
        [FETCHER_KEY.ADD, FETCHER_KEY.UPDATE, FETCHER_KEY.DELETE].includes(key)
    );
    const addFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.ADD);
    const updateFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.UPDATE);
    const deleteFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.DELETE);

    const pendingAddExpense = useMemo(
        () => (addFetcher?.formData ? (generateFormData(addFetcher.formData) as AddExpenseInputWithId) : null),
        [addFetcher]
    );
    const pendingUpdateExpense = useMemo(
        () => (updateFetcher?.formData ? (generateFormData(updateFetcher.formData) as AddExpenseInputWithId) : null),
        [updateFetcher]
    );
    const pendingDeleteExpense = useMemo(
        () => (deleteFetcher?.formData ? (generateFormData(deleteFetcher.formData) as DeleteExpenseInput) : null),
        [deleteFetcher]
    );

    const expensesToDisplay = useMemo(() => {
        if (!pendingAddExpense && !pendingUpdateExpense && !pendingDeleteExpense) {
            return expenses.map((expense, index) => ({
                ...expense,
                createdAt: new Date(expense.createdAt),
                updatedAt: new Date(expense.updatedAt),
                isPending: false,
                index,
            }));
        }

        const optimisticUpdateDeleteExpenses = expenses.map((expense) => {
            if (pendingUpdateExpense && expense.id === pendingUpdateExpense.id) {
                return {
                    ...pendingUpdateExpense,
                    amount: String(pendingUpdateExpense.amount),
                    createdAt: new Date(expense.createdAt),
                    updatedAt: new Date(),
                    isPending: true,
                };
            }

            return {
                ...expense,
                createdAt: new Date(expense.createdAt),
                updatedAt: new Date(expense.updatedAt),
                isPending: expense.id === pendingDeleteExpense?.id,
            };
        });

        type Expense = (typeof optimisticUpdateDeleteExpenses)[number];

        const optimisticCreateExpenses = pendingAddExpense
            ? [
                  {
                      ...pendingAddExpense,
                      amount: String(pendingAddExpense.amount),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      isPending: true,
                  } as Expense,
                  ...optimisticUpdateDeleteExpenses,
              ]
            : optimisticUpdateDeleteExpenses;

        return optimisticCreateExpenses.map((expense, index) => ({ ...expense, index }));
    }, [expenses, pendingAddExpense, pendingDeleteExpense, pendingUpdateExpense]);

    return expensesToDisplay;
}
