import { useFetchers, useLoaderData } from '@remix-run/react';
import type { loader } from '../route';
import { FETCHER_KEY } from '~/routes/resources.expenses/expense-form';
import { useMemo } from 'react';
import { generateFormData } from '~/lib/remix-hook-form';
import type { AddExpenseInputWithId, DeleteExpenseInput } from '~/routes/resources.expenses/schema';
import type { GetExpensesReturnType } from '../queries';
import useExpenseSearchParams from './useExpenseSearchParams';
import { getMonth } from '~/utils';
import { getYear } from 'date-fns';

type ExpenseFetcherFormData = Omit<AddExpenseInputWithId, 'date'> & { date: string };

type DisplayExpense = GetExpensesReturnType[number] & {
    isPending: boolean;
    index: number;
};

export default function useDisplayedExpenses(): Array<DisplayExpense> {
    const { expenses } = useLoaderData<typeof loader>();
    const [searchParams] = useExpenseSearchParams();

    const fetchers = useFetchers();
    const expenseFetchers = fetchers.filter(({ key }) =>
        [FETCHER_KEY.ADD, FETCHER_KEY.UPDATE, FETCHER_KEY.DELETE].includes(key)
    );
    const addFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.ADD);
    const updateFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.UPDATE);
    const deleteFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.DELETE);

    const pendingAddExpense = useMemo(
        () => (addFetcher?.formData ? (generateFormData(addFetcher.formData) as ExpenseFetcherFormData) : null),
        [addFetcher]
    );

    const pendingUpdateExpense = useMemo(
        () => (updateFetcher?.formData ? (generateFormData(updateFetcher.formData) as ExpenseFetcherFormData) : null),
        [updateFetcher]
    );
    const pendingDeleteExpense = useMemo(
        () => (deleteFetcher?.formData ? (generateFormData(deleteFetcher.formData) as DeleteExpenseInput) : null),
        [deleteFetcher]
    );

    const expensesToDisplay = useMemo(() => {
        if (pendingAddExpense) {
            const month = getMonth(new Date(pendingAddExpense.date));
            const year = getYear(new Date(pendingAddExpense.date));

            if (searchParams.month !== month || searchParams.year !== year) {
                return expenses.map((expense, index) => ({
                    ...expense,
                    createdAt: new Date(expense.createdAt),
                    updatedAt: new Date(expense.updatedAt),
                    isPending: false,
                    index,
                })) satisfies Array<DisplayExpense>;
            }
        } else if (!pendingAddExpense && !pendingUpdateExpense && !pendingDeleteExpense) {
            return expenses.map((expense, index) => ({
                ...expense,
                createdAt: new Date(expense.createdAt),
                updatedAt: new Date(expense.updatedAt),
                isPending: false,
                index,
            })) satisfies Array<DisplayExpense>;
        }

        const expensesWithPendingAdd = pendingAddExpense
            ? [
                  ...expenses,
                  {
                      ...pendingAddExpense,
                      createdAt: new Date(pendingAddExpense.date),
                      updatedAt: new Date(pendingAddExpense.date),
                      amount: String(pendingAddExpense.amount),
                  },
              ]
            : expenses;

        const enrichedExpenses = expensesWithPendingAdd.map((expense) => {
            if (pendingUpdateExpense && expense.id === pendingUpdateExpense.id) {
                return {
                    ...pendingUpdateExpense,
                    amount: String(pendingUpdateExpense.amount),
                    createdAt: new Date(expense.createdAt),
                    updatedAt: new Date(pendingUpdateExpense.date),
                    isPending: true,
                };
            }

            return {
                ...expense,
                createdAt: new Date(expense.updatedAt!),
                updatedAt: new Date(expense.updatedAt!),
                isPending: expense.id === pendingDeleteExpense?.id || expense.id === pendingAddExpense?.id,
            };
        });
        const sortedExpenses = enrichedExpenses.sort(
            (a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
        );

        return sortedExpenses.map((expense, index) => ({ ...expense, index })) satisfies Array<DisplayExpense>;
    }, [
        expenses,
        pendingAddExpense,
        pendingDeleteExpense,
        pendingUpdateExpense,
        searchParams.month,
        searchParams.year,
    ]);

    return expensesToDisplay;
}
