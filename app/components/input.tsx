import { forwardRef } from 'react';
import type { InputProps as AriaInputProps } from 'react-aria-components';
import { Input as AriaInput } from 'react-aria-components';
import { cn } from '~/utils';

const Input = forwardRef<HTMLInputElement, AriaInputProps>((props, ref) => {
    return (
        <AriaInput
            ref={ref}
            {...props}
            className={(state) =>
                cn(
                    'h-10 w-full border border-black bg-stone-100 px-4 py-2 transition-colors placeholder:text-stone-400 data-[invalid]:border-red-600 data-[hovered]:bg-stone-50 data-[focused]:outline-offset-4 data-[focused]:outline-black',
                    typeof props.className === 'function'
                        ? props.className(state)
                        : props.className
                )
            }
        />
    );
});
Input.displayName = 'Input';

export default Input;
