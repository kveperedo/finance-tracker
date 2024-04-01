import {
    numeric,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
    'users',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        email: text('email').unique().notNull(),
        passwordHash: text('password_hash').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => ({
        emailIdx: uniqueIndex('email_idx').on(table.email),
    })
);

export const expenses = pgTable('expenses', {
    id: uuid('id').defaultRandom().primaryKey(),
    description: text('description').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdateFn(() => new Date()),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
});
