import { GridList, GridListItem } from 'react-aria-components';
import { format } from 'date-fns';
import { cn, numberFormatter } from '~/utils';
import { forwardRef } from 'react';
import { EmptyExpenses, EmptySearchExpenses } from './empty';
import useExpenseSearchParams from './hooks/useExpenseSearchParams';
import ExpenseMenu from './expense-menu';
import useDisplayedExpenses from './hooks/useDisplayedExpenses';

const ExpensesList = forwardRef<HTMLDivElement>((_props, ref) => {
    const [{ q }] = useExpenseSearchParams();
    const search = q ?? '';
    const expenses = useDisplayedExpenses();

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
                return (
                    <GridListItem
                        className={({ isFocused }) =>
                            cn(
                                'flex items-center justify-between border-b border-stone-100 px-4 py-2',
                                isFocused && 'outline-none',
                                expense.isPending && 'bg-stone-100'
                            )
                        }
                        textValue={expense.description}
                    >
                        <div>
                            <p className="text-sm font-medium text-stone-950">{expense.description}</p>
                            <p className="text-xs text-stone-400">{format(expense.createdAt, 'MMMM dd')}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <p className="text-right font-semibold">{numberFormatter.format(Number(expense.amount))}</p>
                            <ExpenseMenu expense={expense} isPendingExpense={expense.isPending} />
                        </div>
                    </GridListItem>
                );
            }}
        </GridList>
    );
});
ExpensesList.displayName = 'ExpensesList';

export default ExpensesList;
