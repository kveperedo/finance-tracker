import { clsx, type ClassValue } from 'clsx';
import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const numberFormatter = new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const focusRing = tv({
    base: 'outline outline-offset-2 outline-stone-800',
    variants: {
        isFocusVisible: {
            false: 'outline-0',
            true: 'outline-2',
        },
    },
});

export function composeTailwindRenderProps<T>(
    className: string | ((v: T) => string) | undefined,
    tw: string
): string | ((v: T) => string) {
    return composeRenderProps(className, (className) => twMerge(tw, className));
}
