import type { FetcherWithComponents } from '@remix-run/react';
import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';

export type FetcherWithComponentsReset<T> = FetcherWithComponents<T> & {
    reset: () => void;
};

export function useFetcherWithReset<T>(): FetcherWithComponentsReset<T> {
    const fetcher = useFetcher<T>();
    const [data, setData] = useState(fetcher.data);

    useEffect(() => {
        if (fetcher.state === 'idle') {
            setData(fetcher.data);
        }
    }, [fetcher.state, fetcher.data]);

    const reset = useCallback(() => setData(undefined), []);

    return {
        ...fetcher,
        data: data as T,
        reset,
    };
}
