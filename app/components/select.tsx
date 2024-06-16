import type { SelectProps as AriaSelectProps, ValidationResult } from 'react-aria-components';
import { ListBox, SelectValue, Select as AriaSelect, Button, FieldError } from 'react-aria-components';
import Label from './label';
import { ChevronsUpDown } from 'lucide-react';
import Popover from './popover';
import { cn } from '~/utils';
import { inputStyles } from './input';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

declare function forwardRefFixed<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
): (props: P & React.RefAttributes<T>) => React.ReactElement | null;

export type forwardRefType = typeof forwardRefFixed;

type SelectProps<T extends object> = Omit<AriaSelectProps<T>, 'children'> & {
    label?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    items?: Iterable<T>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
    renderValue?: (item: T) => React.ReactNode;
};

function Select<T extends object>(
    { label, errorMessage, children, items, renderValue, ...props }: SelectProps<T>,
    ref: ForwardedRef<HTMLDivElement>
) {
    return (
        <AriaSelect
            ref={ref}
            className={(state) =>
                cn(
                    'flex flex-col items-start',
                    typeof props.className === 'function' ? props.className(state) : props.className
                )
            }
            {...props}
        >
            {(renderProps) => (
                <>
                    <Label>{label}</Label>
                    <Button
                        className={(state) =>
                            inputStyles({ ...renderProps, ...state, className: 'flex items-center gap-2' })
                        }
                        autoFocus={props.autoFocus}
                    >
                        <SelectValue<T> className={({ isPlaceholder }) => cn(isPlaceholder && 'text-stone-400')}>
                            {({ selectedItem }) => (selectedItem && renderValue?.(selectedItem)) ?? props.placeholder}
                        </SelectValue>
                        <ChevronsUpDown className="ml-auto" size={16} />
                    </Button>
                    <Popover className="w-[--trigger-width] overflow-auto" maxHeight={300}>
                        <ListBox className="p-2 text-sm outline-none" items={items}>
                            {children}
                        </ListBox>
                    </Popover>
                    <FieldError className="mt-1 text-xs text-red-600">{errorMessage}</FieldError>
                </>
            )}
        </AriaSelect>
    );
}
Select.displayName = 'Select';

const ForwardedSelect = (forwardRef as forwardRefType)(Select);
export default ForwardedSelect;
