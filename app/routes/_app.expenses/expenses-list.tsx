import { GridList, GridListItem } from 'react-aria-components';
import { format } from 'date-fns';
import { cn, numberFormatter } from '~/utils';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { EmptyExpenses, EmptySearchExpenses } from './empty';
import useExpenseSearchParams from './hooks/useExpenseSearchParams';
import ExpenseMenu from './expense-menu';
import useDisplayedExpenses from './hooks/useDisplayedExpenses';
import { useDrag } from '@use-gesture/react';
import { animated, useSprings, easings } from '@react-spring/web';
import Button from '~/components/button';
import { PencilLine, Trash } from 'lucide-react';
import { useBreakpoint } from '~/hooks/useBreakpoint';
import { useFetcher } from '@remix-run/react';
import ExpenseForm, { FETCHER_KEY } from '../resources.expenses/expense-form';
import AlertDialog from '~/components/alert-dialog';
import type { DeleteExpenseInput } from '../resources.expenses/schema';
import Modal from '~/components/modal';

type SpringProps = { x: number; isOpen: boolean };
type SpringsReturnType = ReturnType<typeof useSprings<SpringProps>>;

const MIN_X_POSITION = 0;
const MAX_X_POSITION = -96;
const SWIPE_THRESHOLD = 16;

type Intent = 'update' | 'delete' | null;

type ExpenseItemProps = {
    spring: SpringsReturnType[0][number];
    springRef: SpringsReturnType[1];
    expense: ReturnType<typeof useDisplayedExpenses>[number];
};

function ExpenseItem({ expense, spring, springRef }: ExpenseItemProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isSm } = useBreakpoint('sm');
    const [intent, setIntent] = useState<Intent>(null);
    const updateFetcher = useFetcher({ key: FETCHER_KEY.UPDATE });
    const deleteFetcher = useFetcher({ key: FETCHER_KEY.DELETE });

    useEffect(() => {
        if (expense.isPending) {
            setTimeout(
                () => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }),
                0
            );
        }
    }, [expense.isPending]);

    const bind = useDrag(
        ({ offset: [offsetX], last, cancel }) => {
            // Reset all springs except the current one
            springRef.current.forEach((spring, index) => {
                if (index !== expense.index) {
                    spring.start({ x: MIN_X_POSITION, isOpen: false });
                }
            });

            spring.x.start(offsetX);

            // If the user is swiping past the initial position, we want to cancel the gesture
            if (offsetX > MIN_X_POSITION) {
                spring.x.start(MIN_X_POSITION);
                return;
            }

            if (!last) {
                return;
            }

            const currentSpring = springRef.current[expense.index]!;
            const isOpen = spring.isOpen.get();
            if (!isOpen) {
                const isLeftSwipeDetected = offsetX < MIN_X_POSITION - SWIPE_THRESHOLD;
                currentSpring.start(
                    // If left swipe is not enough, we don't want to open the menu
                    isLeftSwipeDetected ? { x: MAX_X_POSITION, isOpen: true } : { x: MIN_X_POSITION, isOpen: false }
                );
            } else {
                const isRightSwipeDetected = offsetX > MAX_X_POSITION + SWIPE_THRESHOLD;
                currentSpring.start(
                    // If right swipe is not enough, we don't want to close the menu
                    isRightSwipeDetected ? { x: MIN_X_POSITION, isOpen: false } : { x: MAX_X_POSITION, isOpen: true }
                );
            }
        },
        {
            axis: 'x',
            from: () => [spring.x.get(), 0],
            bounds: () => ({ left: MAX_X_POSITION, right: 0 }),
            rubberband: true,
            enabled: !isSm && !expense.isPending,
        }
    );

    return (
        <GridListItem
            ref={containerRef}
            className={({ isFocused }) => cn('border-b border-stone-100', isFocused && 'outline-none')}
            textValue={expense.description}
        >
            <div className="relative flex h-14 w-full items-center justify-between bg-stone-50">
                <div className="ml-auto flex items-center gap-2 px-4">
                    <Button
                        variant="outline"
                        className="rounded-full"
                        size="icon-sm"
                        onPress={() => setIntent('update')}
                    >
                        <PencilLine size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-full border-red-100 bg-red-50 text-red-500"
                        size="icon-sm"
                        onPress={() => setIntent('delete')}
                    >
                        <Trash size={16} />
                    </Button>
                </div>
                <animated.div
                    {...bind()}
                    className={cn(
                        'absolute flex h-full w-full touch-pan-y items-center justify-between bg-white px-4',
                        expense.isPending && 'bg-stone-100'
                    )}
                    style={{ x: spring.x }}
                >
                    <div>
                        <p className="text-sm font-medium text-stone-950">{expense.description}</p>
                        <p className="text-xs text-stone-400">{format(expense.updatedAt, 'MMMM dd')}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <p className="text-right font-semibold">{numberFormatter.format(Number(expense.amount))}</p>
                        <div className="hidden sm:block">
                            <ExpenseMenu
                                isPendingExpense={expense.isPending}
                                onDeleteClick={() => setIntent('delete')}
                                onEditClick={() => setIntent('update')}
                            />
                        </div>
                    </div>
                </animated.div>
            </div>
            <AlertDialog
                isOpen={intent === 'delete'}
                onOpenChange={() => setIntent(null)}
                title="Delete Expense"
                message="Are you sure you want to delete this expense?"
                confirmLabel="Delete"
                onConfirm={() => {
                    springRef.start({ x: MIN_X_POSITION, isOpen: false });
                    deleteFetcher.submit({ id: expense.id, intent: 'delete' } as DeleteExpenseInput, {
                        method: 'POST',
                        action: '/resources/expenses',
                    });
                }}
            />
            <Modal title="Update Expense" isOpen={intent === 'update'} onOpenChange={() => setIntent(null)}>
                {({ state: { close } }) => (
                    <ExpenseForm
                        fetcher={updateFetcher}
                        autoFocus
                        defaultValues={{ ...expense, amount: expense.amount, intent: 'update' }}
                        onSubmitSuccess={() => {
                            springRef.start({ x: MIN_X_POSITION, isOpen: false });
                            close();
                        }}
                    >
                        <div className="mt-8 flex gap-4">
                            <Button variant="secondary" className="flex-1" type="button" onPress={close}>
                                Cancel
                            </Button>
                            <Button className="flex-1" type="submit">
                                Submit
                            </Button>
                        </div>
                    </ExpenseForm>
                )}
            </Modal>
        </GridListItem>
    );
}

const ExpensesList = forwardRef<HTMLDivElement>((_props, ref) => {
    const [{ q }] = useExpenseSearchParams();
    const search = q ?? '';
    const expenses = useDisplayedExpenses();
    const [springs, springRef] = useSprings(expenses.length, () => ({
        x: 0,
        isOpen: false,
        config: { easing: easings.easeOutBack },
    }));

    return (
        <GridList
            aria-label="Expenses list"
            ref={ref}
            className="flex flex-1 flex-col overflow-auto"
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
                return <ExpenseItem expense={expense} spring={springs[expense.index]!} springRef={springRef} />;
            }}
        </GridList>
    );
});
ExpensesList.displayName = 'ExpensesList';

export default ExpensesList;
