import { boolean, numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

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

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const userDetails = pgTable(
    'user_details',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        role: roleEnum('role').notNull().default('user'),
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

export const expensesCategories = pgEnum('expenses_categories', [
    'housing',
    'transport',
    'groceries',
    'food',
    'personal-care',
    'entertainment',
    'others',
]);

export const expenses = pgTable('expenses', {
    id: uuid('id').defaultRandom().primaryKey(),
    description: text('description').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    category: expensesCategories('category').default('others').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdateFn(() => new Date()),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
});

export const invitations = pgTable('invitations', {
    id: uuid('id').defaultRandom().primaryKey(),
    isRegistered: boolean('is_registered').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdateFn(() => new Date()),
});
