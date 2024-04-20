import { useFetcher } from '@remix-run/react';
import { Ellipsis, PencilLine, Trash } from 'lucide-react';
import { useState } from 'react';
import { Menu, MenuTrigger } from 'react-aria-components';
import AlertDialog from '~/components/alert-dialog';
import Button from '~/components/button';
import { MenuItem } from '~/components/item';
import Popover from '~/components/popover';
import type { DeleteExpenseInput } from '../resources.expenses/schema';
import Modal from '~/components/modal';
import ExpenseForm from '../resources.expenses/expense-form';
import type { GetExpensesReturnType } from './queries';

type Intent = 'update' | 'delete' | null;

type ExpenseMenuProps = {
    expense: GetExpensesReturnType[number];
    isPendingExpense: boolean;
};

export default function ExpenseMenu({ expense, isPendingExpense }: ExpenseMenuProps) {
    const fetcher = useFetcher();
    const [intent, setIntent] = useState<Intent>(null);

    return (
        <>
            <MenuTrigger>
                <Button variant="tertiary" size="icon-sm" isDisabled={isPendingExpense}>
                    <Ellipsis size={16} />
                </Button>
                <Popover className="w-32" placement="bottom end">
                    <Menu className="p-2 text-sm outline-none" onAction={(id) => setIntent(id as Intent)}>
                        <MenuItem id="update" textValue="edit">
                            <PencilLine className="mr-3" size={16} />
                            Edit
                        </MenuItem>
                        <MenuItem id="delete" textValue="delete">
                            <Trash className="mr-3" size={16} />
                            Delete
                        </MenuItem>
                    </Menu>
                </Popover>
            </MenuTrigger>
            <AlertDialog
                isOpen={intent === 'delete'}
                onOpenChange={() => setIntent(null)}
                title="Delete Expense"
                message="Are you sure you want to delete this expense?"
                confirmLabel="Delete"
                onConfirm={() => {
                    fetcher.submit({ id: expense.id, intent: 'delete' } as DeleteExpenseInput, {
                        method: 'POST',
                        action: '/resources/expenses',
                    });
                }}
            />
            <Modal title="Update Expense" isOpen={intent === 'update'} onOpenChange={() => setIntent(null)}>
                {({ state: { close } }) => (
                    <ExpenseForm
                        fetcher={fetcher}
                        autoFocus
                        defaultValues={{ ...expense, amount: parseFloat(expense.amount), intent: 'update' }}
                        onSubmitSuccess={close}
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
        </>
    );
}
