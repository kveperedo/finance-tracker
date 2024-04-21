import { forwardRef } from 'react';
import type { InputProps as AriaInputProps } from 'react-aria-components';
import { Input as AriaInput, composeRenderProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { focusRing } from '~/utils';

export const inputStyles = tv({
    extend: focusRing,
    base: 'h-10 w-full rounded border border-stone-300 px-4 py-2 text-sm text-stone-800 shadow-inner transition-colors placeholder:text-stone-400 invalid:border-red-600 hover:bg-stone-50 focus:bg-stone-50 hover:[&:not([data-invalid])]:border-stone-400 focus:[&:not([data-invalid])]:border-stone-400',
});

const Input = forwardRef<HTMLInputElement, AriaInputProps>((props, ref) => {
    return (
        <AriaInput
            ref={ref}
            {...props}
            className={composeRenderProps(props.className, (className, renderProps) =>
                inputStyles({ ...renderProps, className })
            )}
        />
    );
});
Input.displayName = 'Input';

export default Input;
