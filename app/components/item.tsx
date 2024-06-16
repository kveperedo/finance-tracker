import type {
    ListBoxItemProps as AriaListBoxItemProps,
    MenuItemProps as AriaMenuItemProps,
} from 'react-aria-components';
import { ListBoxItem as AriaListBoxItem, MenuItem as AriaMenuItem, composeRenderProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { tw } from '~/utils';

const itemStyles = tv({
    slots: {
        base: tw('flex cursor-pointer items-center rounded p-2 text-sm data-[focused]:outline-none'),
        icon: tw('mr-3 h-4 w-4'),
    },
    variants: {
        isSelected: { true: { base: tw('bg-stone-200') } },
        isHovered: { true: '' },
        isFocused: { true: '' },
    },
    compoundVariants: [
        { isHovered: true, isSelected: false, className: { base: tw('bg-stone-100') } },
        { isFocused: true, isSelected: false, className: { base: tw('bg-stone-100') } },
    ],
});

export type ListBoxItemProps = {
    icon?: React.ReactNode;
} & AriaListBoxItemProps;

export function ListBoxItem({ icon, ...props }: ListBoxItemProps) {
    const { base, icon: iconStyle } = itemStyles();

    return (
        <AriaListBoxItem
            {...props}
            className={composeRenderProps(props.className, (className, renderProps) =>
                base({ ...renderProps, className })
            )}
        >
            {(renderProps) => (
                <>
                    {icon && <span className={iconStyle(renderProps)}>{icon}</span>}
                    <span>{typeof props.children === 'function' ? props.children(renderProps) : props.children}</span>
                </>
            )}
        </AriaListBoxItem>
    );
}

export type MenuItemProps = {
    icon?: React.ReactNode;
} & AriaMenuItemProps;

export function MenuItem({ icon, ...props }: MenuItemProps) {
    const { base, icon: iconStyle } = itemStyles();

    return (
        <AriaMenuItem
            {...props}
            className={composeRenderProps(props.className, (className, renderProps) =>
                base({ ...renderProps, className })
            )}
        >
            {(renderProps) => (
                <>
                    {icon && <span className={iconStyle(renderProps)}>{icon}</span>}
                    <span>{typeof props.children === 'function' ? props.children(renderProps) : props.children}</span>
                </>
            )}
        </AriaMenuItem>
    );
}
