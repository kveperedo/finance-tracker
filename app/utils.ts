import { parseDateTime } from '@internationalized/date';
import type { FetcherWithComponents } from '@remix-run/react';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import type { DateValue } from 'react-aria-components';
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

// Reference:
// https://remix.run/docs/en/main/start/v2#usefetcher
export function getFetcherStates<T>(fetcher: FetcherWithComponents<T>) {
    const isInit = fetcher.state === 'idle' && fetcher.data == null;
    const isDone = fetcher.state === 'idle' && fetcher.data != null;
    const isActionSubmitting = fetcher.state === 'submitting';
    const isActionLoading = fetcher.state === 'loading' && fetcher.formMethod != null && fetcher.formMethod != 'GET';
    const isLoaderSubmitting = fetcher.state === 'loading' && fetcher.formMethod === 'GET';
    const isNormalLoad = fetcher.state === 'loading' && fetcher.formMethod == null;

    return {
        isInit,
        isDone,
        isActionSubmitting,
        isActionLoading,
        isLoaderSubmitting,
        isNormalLoad,
    };
}

export const getMonth = (date: Date = new Date()) => date.getMonth() + 1;
export const getYear = (date: Date = new Date()) => date.getFullYear();

export function toAriaDateTime(date: Date) {
    const formattedDateTime = format(date, "yyyy-MM-dd'T'HH:mm:ss");

    return parseDateTime(formattedDateTime);
}

export function toNativeDate(dateValue: DateValue) {
    return new Date(dateValue.toString());
}
