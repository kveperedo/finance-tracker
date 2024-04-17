import { z } from 'zod';

export const monthlyIncomeSchema = z.object({
    monthlyIncome: z
        .number({
            required_error: 'Value is required',
        })
        .positive({
            message: 'Value should be greater than 0',
        }),
    intent: z.enum(['create', 'update']).default('create'),
});
export type MonthlyIncomeInput = z.infer<typeof monthlyIncomeSchema>;
