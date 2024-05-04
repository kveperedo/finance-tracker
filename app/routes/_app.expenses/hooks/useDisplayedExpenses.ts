import { useFetchers, useLoaderData } from '@remix-run/react';
import type { loader } from '../route';
import { FETCHER_KEY } from '~/routes/resources.expenses/expense-form';
import { useMemo } from 'react';
import { generateFormData } from '~/lib/remix-hook-form';
import type { AddExpenseInputWithId, DeleteExpenseInput } from '~/routes/resources.expenses/schema';
import type { GetExpensesReturnType } from '../queries';
import useExpenseSearchParams from './useExpenseSearchParams';
import { isDateMatchingSearchParams } from '~/utils';

type ExpenseFetcherFormData = Omit<AddExpenseInputWithId, 'date'> & { date: string };

type DisplayExpense = GetExpensesReturnType[number] & {
    isPending: boolean;
    index: number;
};

export default function useDisplayedExpenses(): Array<DisplayExpense> {
    const { expenses } = useLoaderData<typeof loader>();
    const [searchParams] = useExpenseSearchParams();

    const fetchers = useFetchers();
    const { pendingAddExpense, pendingUpdateExpense, pendingDeleteExpense } = useMemo(() => {
        const expenseFetchers = fetchers.filter(({ key }) =>
            [FETCHER_KEY.ADD, FETCHER_KEY.UPDATE, FETCHER_KEY.DELETE].includes(key)
        );
        const addFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.ADD);
        const updateFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.UPDATE);
        const deleteFetcher = expenseFetchers.find(({ key }) => key === FETCHER_KEY.DELETE);

        return {
            pendingAddExpense: addFetcher?.formData
                ? (generateFormData(addFetcher.formData) as ExpenseFetcherFormData)
                : null,
            pendingUpdateExpense: updateFetcher?.formData
                ? (generateFormData(updateFetcher.formData) as ExpenseFetcherFormData)
                : null,
            pendingDeleteExpense: deleteFetcher?.formData
                ? (generateFormData(deleteFetcher.formData) as DeleteExpenseInput)
                : null,
        };
    }, [fetchers]);

    const expensesToDisplay = useMemo(() => {
        const defaultExpenses = expenses.map((expense, index) => ({
            ...expense,
            createdAt: new Date(expense.createdAt),
            updatedAt: new Date(expense.updatedAt),
            isPending: false,
            index,
        })) satisfies Array<DisplayExpense>;
        if (pendingAddExpense && !isDateMatchingSearchParams(pendingAddExpense.date, searchParams)) {
            return defaultExpenses;
        }
        if (pendingUpdateExpense && !isDateMatchingSearchParams(pendingUpdateExpense.date, searchParams)) {
            return defaultExpenses;
        }

        // When adding expense with a different date from the current date,
        // the pending add expense is somehow already included in the expenses
        // so we need to check if it's already included
        const isAddPendingAlreadyIncluded = expenses.some((expense) => expense.id === pendingAddExpense?.id);

        const expensesWithPendingAdd =
            pendingAddExpense && !isAddPendingAlreadyIncluded
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

        return expensesWithPendingAdd
            .map((expense) => {
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
            })
            .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
            .map((expense, index) => ({ ...expense, index })) satisfies Array<DisplayExpense>;
    }, [expenses, pendingAddExpense, pendingDeleteExpense, pendingUpdateExpense, searchParams]);

    return expensesToDisplay;
}
