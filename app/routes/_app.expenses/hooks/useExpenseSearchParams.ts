/* eslint-disable drizzle/enforce-delete-with-where */
import { useSearchParams } from '@remix-run/react';
import type { Expense } from '~/db/types';

type ParamKey = 'month' | 'year' | 'q' | 'category';

const PARAM = {
    MONTH: 'month',
    YEAR: 'year',
    Q: 'q',
    CATEGORY: 'category',
} satisfies Record<string, ParamKey>;

export default function useExpenseSearchParams() {
    const [searchParams, setSearchParams] = useSearchParams();
    const month = Number(searchParams.get('month') ?? new Date().getMonth() + 1);
    const year = Number(searchParams.get('year') ?? new Date().getFullYear());
    const q = searchParams.get('q');
    const category = searchParams.get('category') as Expense['category'] | null;

    const setParam = (key: ParamKey, value: string) => {
        setSearchParams((searchParams) => {
            searchParams.set(key, value);
            return searchParams;
        });
    };

    const deleteParam = (...keys: ParamKey[]) => {
        setSearchParams((searchParams) => {
            keys.forEach((key) => searchParams.delete(key));
            return searchParams;
        });
    };

    const clearParams = () => {
        setSearchParams((searchParams) => {
            searchParams.delete(PARAM.MONTH);
            searchParams.delete(PARAM.YEAR);
            searchParams.delete(PARAM.Q);
            searchParams.delete(PARAM.CATEGORY);
            return searchParams;
        });
    };

    return [
        { month, year, q, category },
        { setParam, deleteParam, clearParams },
    ] as const;
}
