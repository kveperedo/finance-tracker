import type { PropsWithChildren } from 'react';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Button as AriaButton } from 'react-aria-components';
import { cn } from '~/utils';

type ButtonProps = Omit<AriaButtonProps, 'children'> &
    PropsWithChildren<{
        color?: 'lime' | 'stone' | 'purple';
        leftIcon?: React.ReactNode;
        rightIcon?: React.ReactNode;
    }>;

export default function Button({
    leftIcon,
    rightIcon,
    children,
    color,
    ...props
}: ButtonProps) {
    return (
        <AriaButton
            {...props}
            className={(state) =>
                cn(
                    'data-[focused]:out flex items-center justify-center gap-2 border border-black px-4 py-2  transition-colors data-[focused]:outline-offset-4 data-[focused]:outline-black',
                    color === 'lime' &&
                        'bg-lime-300 data-[focused]:bg-lime-400 data-[hovered]:bg-lime-400',
                    color === 'stone' &&
                        'bg-stone-100 text-black data-[focused]:bg-stone-200 data-[hovered]:bg-stone-200',
                    color === 'purple' &&
                        'bg-purple-600 text-white data-[focused]:bg-purple-700 data-[hovered]:bg-purple-700',
                    typeof props.className === 'function'
                        ? props.className(state)
                        : props.className
                )
            }>
            {leftIcon}
            {children}
            {rightIcon}
        </AriaButton>
    );
}
