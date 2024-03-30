import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { expenses } from './schema';

export type Expense = InferSelectModel<typeof expenses>;
export type ExpenseInput = InferInsertModel<typeof expenses>;
