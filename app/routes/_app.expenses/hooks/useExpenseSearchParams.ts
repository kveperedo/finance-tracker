/* eslint-disable drizzle/enforce-delete-with-where */
import { useSearchParams } from '@remix-run/react';

type ParamKey = 'month' | 'year' | 'q';

export default function useExpenseSearchParams() {
    const [searchParams, setSearchParams] = useSearchParams();
    const month = Number(searchParams.get('month') ?? new Date().getMonth() + 1);
    const year = Number(searchParams.get('year') ?? new Date().getFullYear());
    const q = searchParams.get('q');

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
            searchParams.delete('month');
            searchParams.delete('year');
            searchParams.delete('q');
            return searchParams;
        });
    };

    return [
        { month, year, q },
        { setParam, deleteParam, clearParams },
    ] as const;
}
