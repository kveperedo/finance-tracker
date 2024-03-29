import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
    id: uuid('id').defaultRandom().primaryKey(),
    description: text('description').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdateFn(() => new Date()),
});
