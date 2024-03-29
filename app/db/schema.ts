import { numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';

export const expenses = pgTable('expenses', {
    id: serial('id').primaryKey(),
    description: text('description').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdateFn(() => new Date()),
});

export type Expense = InferSelectModel<typeof expenses>;
