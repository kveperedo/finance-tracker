import type { SelectProps as AriaSelectProps, ValidationResult } from 'react-aria-components';
import { ListBox, SelectValue, Select as AriaSelect, Button } from 'react-aria-components';
import Label from './label';
import { ChevronsUpDown } from 'lucide-react';
import Popover from './popover';
import { cn } from '~/utils';
import { inputStyles } from './input';

type SelectProps<T extends object> = Omit<AriaSelectProps<T>, 'children'> & {
    label?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    items?: Iterable<T>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
};

export default function Select<T extends object>({ label, errorMessage, children, items, ...props }: SelectProps<T>) {
    return (
        <AriaSelect
            className={(state) =>
                cn('flex flex-col', typeof props.className === 'function' ? props.className(state) : props.className)
            }
            {...props}>
            <Label>{label}</Label>
            <Button
                className={(state) => inputStyles({ ...state, className: 'flex items-center gap-2' })}
                autoFocus={props.autoFocus}>
                <SelectValue />
                <ChevronsUpDown className="ml-auto" size={16} />
            </Button>
            <Popover className="w-[--trigger-width] overflow-auto" maxHeight={300}>
                <ListBox className="p-2 text-sm" items={items}>
                    {children}
                </ListBox>
            </Popover>
        </AriaSelect>
    );
}
