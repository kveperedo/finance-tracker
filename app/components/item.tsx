import type {
    ListBoxItemProps as AriaListBoxItemProps,
    MenuItemProps as AriaMenuItemProps,
} from 'react-aria-components';
import { ListBoxItem as AriaListBoxItem, MenuItem as AriaMenuItem, composeRenderProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const itemStyles = tv({
    base: 'flex cursor-pointer items-center rounded p-2 data-[focused]:outline-none',
    variants: {
        isSelected: { true: 'bg-stone-300' },
        isHovered: { true: '' },
        isFocused: { true: '' },
    },
    compoundVariants: [
        { isHovered: true, isSelected: false, className: 'bg-stone-100' },
        { isFocused: true, isSelected: false, className: 'bg-stone-100' },
    ],
});

export function ListBoxItem(props: AriaListBoxItemProps) {
    return (
        <AriaListBoxItem
            {...props}
            className={composeRenderProps(props.className, (className, renderProps) =>
                itemStyles({ ...renderProps, className })
            )}
        />
    );
}

export function MenuItem(props: AriaMenuItemProps) {
    return (
        <AriaMenuItem
            {...props}
            className={composeRenderProps(props.className, (className, renderProps) =>
                itemStyles({ ...renderProps, className })
            )}
        />
    );
}
