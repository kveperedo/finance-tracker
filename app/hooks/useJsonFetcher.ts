import { useFetcher } from '@remix-run/react';

export default function useJsonFetcher<Schema, TData = unknown>() {
    const fetcher = useFetcher<TData>();

    type SubmitTarget = Parameters<typeof fetcher.submit>[0];
    type SubmitOptions = Parameters<typeof fetcher.submit>[1];

    return {
        ...fetcher,
        submit: (data: Schema, options: SubmitOptions) =>
            fetcher.submit(data as SubmitTarget, {
                method: 'POST',
                encType: 'application/json',
                ...options,
            }),
        json: fetcher.json as Schema | undefined,
    };
}
