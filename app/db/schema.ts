import { numeric, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

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

export const userDetails = pgTable(
    'user_details',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        monthlyIncome: numeric('monthly_income', { precision: 10, scale: 2 }),
        userId: uuid('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull()
            .unique(),
    },
    (table) => ({
        userIdIdx: uniqueIndex('user_id_idx').on(table.userId),
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
