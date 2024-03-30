import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type z from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const numberFormatter = new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export async function parseRequest<ZodSchema>(
    request: Request,
    { schema }: { schema: z.ZodType<ZodSchema> }
) {
    const type = request.headers.get('content-type');

    if (type !== 'application/json') {
        throw new Error('Only application/json content types are allowed');
    }

    const result = schema.safeParse(await request.json());

    if (!result.success) {
        console.error(result.error.errors);
        throw new Error('Invalid Request');
    }

    return result.data;
}
