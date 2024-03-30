import { z } from 'zod';

export const addExpenseSchema = z.object({
    description: z
        .string({
            required_error: 'Description is required',
        })
        .min(1, { message: 'Description should not be empty' }),
    amount: z
        .number({
            required_error: 'Amount is required',
        })
        .min(0.01, { message: 'Amount should be greater than 0' }),
});

export type AddExpenseInput = z.infer<typeof addExpenseSchema>;
