import { GridList, GridListItem } from 'react-aria-components';
import type { GetExpensesReturnType } from './queries';
import { format } from 'date-fns';
import { cn, numberFormatter } from '~/utils';
import { forwardRef } from 'react';
import { useSearchParams } from '@remix-run/react';
import { EmptyExpenses, EmptySearchExpenses } from './empty';

type ExpenseListProps = {
    pendingExpenseId?: string;
    expenses: GetExpensesReturnType;
};

const ExpensesList = forwardRef<HTMLDivElement, ExpenseListProps>(({ expenses, pendingExpenseId }, ref) => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('q') ?? '';

    return (
        <GridList
            aria-label="Expenses list"
            ref={ref}
            className="flex flex-1 flex-col overflow-auto rounded"
            items={expenses}
            selectionBehavior="toggle"
            renderEmptyState={() => {
                if (search) {
                    return <EmptySearchExpenses />;
                }

                return <EmptyExpenses />;
            }}
        >
            {(expense) => {
                const isPendingExpense = pendingExpenseId === expense.id;

                return (
                    <GridListItem
                        className={({ isFocused }) =>
                            cn(
                                'flex items-center justify-between border-b border-stone-100 px-4 py-2',
                                isFocused && 'border-stone-300 bg-stone-50 outline-none',
                                isPendingExpense && 'bg-stone-100'
                            )
                        }
                        textValue={expense.description}
                    >
                        <div>
                            <p className="text-sm font-medium text-stone-950">{expense.description}</p>
                            <p className="text-xs text-stone-400">{format(expense.createdAt, 'MMMM dd')}</p>
                        </div>

                        <p className="text-right font-semibold">{numberFormatter.format(Number(expense.amount))}</p>
                    </GridListItem>
                );
            }}
        </GridList>
    );
});
ExpensesList.displayName = 'ExpensesList';

export default ExpensesList;
