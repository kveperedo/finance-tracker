import { useSearchParams } from '@remix-run/react';
import Button from '~/components/button';

export function EmptyExpenses() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <p className="font-semibold">No expenses this month!</p>
            <p className="text-sm text-stone-500">Start adding expenses by clicking the button above.</p>
        </div>
    );
}

export function EmptySearchExpenses() {
    const [, setSearchParams] = useSearchParams();

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <p className="font-semibold">No expenses found!</p>
            <p className="text-sm text-stone-500">Try searching for something else.</p>
            <Button
                variant="outline"
                className="mt-2"
                onPress={() => {
                    setSearchParams((searchParams) => {
                        // eslint-disable-next-line drizzle/enforce-delete-with-where
                        searchParams.delete('q');
                        return searchParams;
                    });
                }}
            >
                Clear search
            </Button>
        </div>
    );
}
