import { EllipsisVertical, PencilLine, Trash } from 'lucide-react';
import { Menu, MenuTrigger } from 'react-aria-components';
import Button from '~/components/button';
import { MenuItem } from '~/components/item';
import Popover from '~/components/popover';

type ExpenseMenuProps = {
    onEditClick: () => void;
    onDeleteClick: () => void;
    isPendingExpense: boolean;
};

const ACTION = {
    UPDATE: 'update',
    DELETE: 'delete',
} as const;

export default function ExpenseMenu({ isPendingExpense, onDeleteClick, onEditClick }: ExpenseMenuProps) {
    return (
        <>
            <MenuTrigger>
                <Button
                    className="text-stone-400 hover:text-stone-800 focus:text-stone-800"
                    variant="tertiary"
                    size="icon-sm"
                    isDisabled={isPendingExpense}
                >
                    <EllipsisVertical size={16} />
                </Button>
                <Popover className="w-32" placement="bottom end">
                    <Menu
                        className="p-2 text-sm outline-none"
                        onAction={(id) => {
                            if (id === ACTION.UPDATE) {
                                onEditClick();
                            } else if (id === ACTION.DELETE) {
                                onDeleteClick();
                            }
                        }}
                    >
                        <MenuItem id={ACTION.UPDATE} textValue="edit">
                            <PencilLine className="mr-3" size={16} />
                            Edit
                        </MenuItem>
                        <MenuItem className="text-red-500 focus:bg-red-50" id={ACTION.DELETE} textValue="delete">
                            <Trash className="mr-3" size={16} />
                            Delete
                        </MenuItem>
                    </Menu>
                </Popover>
            </MenuTrigger>
        </>
    );
}
