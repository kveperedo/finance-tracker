import Button from '~/components/button';
import useExpenseSearchParams from './hooks/useExpenseSearchParams';

export function EmptyExpenses() {
    return (
        <>
            <p className="font-semibold">No expenses this month!</p>
            <p className="text-sm text-stone-500">Start adding expenses by clicking the button above.</p>
        </>
    );
}

export function EmptySearchExpenses() {
    const [, actions] = useExpenseSearchParams();

    return (
        <>
            <p className="font-semibold">No expenses found!</p>
            <p className="text-sm text-stone-500">Try searching for something else.</p>
            <Button
                variant="outline"
                className="mt-2"
                onPress={() => {
                    actions.deleteParam('q');
                }}
            >
                Clear search
            </Button>
        </>
    );
}
