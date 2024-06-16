import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { expenses, expensesCategories } from '~/db/schema';

export const expenseSchema = z.object({
    intent: z.enum(['create', 'update', 'delete']).default('create'),
});
export type ExpenseInput = z.infer<typeof expenseSchema>;

export const addExpenseSchema = expenseSchema
    .extend(
        createInsertSchema(expenses, {
            updatedAt: z.date().default(() => new Date()),
            description: z
                .string({
                    required_error: 'Description is required',
                })
                .min(1, { message: 'Description is required' }),
            amount: z
                .number({
                    required_error: 'Amount is required',
                })
                .min(0.01, { message: 'Amount should be greater than 0' }),
        }).pick({
            description: true,
            amount: true,
        }).shape
    )
    .extend({
        date: z.coerce.date(),
        category: z.enum(expensesCategories.enumValues, {
            required_error: 'Category is required',
            invalid_type_error: 'Category is required',
        }),
    });

export type AddExpenseInput = z.infer<typeof addExpenseSchema>;

export const addExpenseSchemaWithId = addExpenseSchema.extend({
    id: z.string().uuid(),
});
export type AddExpenseInputWithId = z.infer<typeof addExpenseSchemaWithId>;

export const deleteExpenseSchema = z.object({
    id: z.string(),
});
export type DeleteExpenseInput = z.infer<typeof deleteExpenseSchema>;
