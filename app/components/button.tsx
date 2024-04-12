import { forwardRef, type PropsWithChildren } from 'react';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Button as AriaButton, composeRenderProps } from 'react-aria-components';
import { focusRing } from '~/utils';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const buttonStyles = tv({
    extend: focusRing,
    base: 'apply-focus flex items-center justify-center gap-2 rounded text-sm transition-colors',
    variants: {
        variant: {
            primary: 'bg-stone-800 text-stone-100 shadow-sm hover:bg-stone-700 pressed:bg-stone-900',
            secondary: 'bg-stone-100 text-stone-800 shadow-sm hover:bg-stone-200 pressed:bg-stone-300',
            tertiary: 'bg-transparent text-stone-800 shadow-none hover:bg-stone-100 pressed:bg-stone-200',
            outline: 'border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50',
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 px-3',
            lg: 'h-11 px-8',
            icon: 'h-10 w-10',
            'icon-sm': 'h-7 w-7',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'default',
    },
});

type ButtonVariants = Omit<VariantProps<typeof buttonStyles>, 'isFocusVisible'>;

type ButtonProps = Omit<AriaButtonProps, 'children'> &
    PropsWithChildren<{
        leftIcon?: React.ReactNode;
        rightIcon?: React.ReactNode;
    }> &
    ButtonVariants;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ leftIcon, rightIcon, children, variant, size, ...props }, ref) => {
        return (
            <AriaButton
                ref={ref}
                {...props}
                className={composeRenderProps(props.className, (className, renderProps) =>
                    buttonStyles({ ...renderProps, variant, size, className })
                )}
            >
                {leftIcon}
                {children}
                {rightIcon}
            </AriaButton>
        );
    }
);
Button.displayName = 'Button';

export default Button;
