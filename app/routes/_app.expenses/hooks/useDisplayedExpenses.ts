import { useFetchers, useLoaderData } from '@remix-run/react';
import type { loader } from '../route';
import { FETCHER_KEY } from '~/routes/resources.expenses/expense-form';
import { useMemo } from 'react';
import { generateFormData } from '~/lib/remix-hook-form';
import type { AddExpenseInputWithId, DeleteExpenseInput } from '~/routes/resources.expenses/schema';

export default function useDisplayedExpenses() {
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
            return expenses.map((expense) => ({
                ...expense,
                createdAt: new Date(expense.createdAt),
                updatedAt: new Date(expense.updatedAt),
                isPending: false,
            }));
        }

        const transformedExpenses = expenses.map((expense) => {
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

        type Expense = (typeof transformedExpenses)[number];

        return pendingAddExpense
            ? [
                  {
                      ...pendingAddExpense,
                      amount: String(pendingAddExpense.amount),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      isPending: true,
                  } as Expense,
                  ...transformedExpenses,
              ]
            : transformedExpenses;
    }, [expenses, pendingAddExpense, pendingDeleteExpense, pendingUpdateExpense]);

    return expensesToDisplay;
}
