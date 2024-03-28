import { numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
	id: serial('id').primaryKey(),
	description: text('description'),
	amount: numeric('amount', { precision: 10, scale: 2 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});
