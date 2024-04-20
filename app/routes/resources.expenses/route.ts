import type { AddExpenseInputWithId, DeleteExpenseInput, ExpenseInput } from './schema';
import { addExpenseSchemaWithId, deleteExpenseSchema, expenseSchema } from './schema';
import type { ActionFunctionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { validateFormData } from 'remix-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requireUserId } from '~/auth/session.server';
import { addExpense, deleteExpense, updateExpense } from './queries';
import { generateFormData } from '~/lib/remix-hook-form';

const invalidRequest = () => json({ error: 'Invalid request' }, { status: 400 });

type PerformExpenseActionParams = {
    formData: any;
    intent: 'create' | 'update' | 'delete';
    userId: string;
};

async function performExpenseAction({ formData, intent, userId }: PerformExpenseActionParams) {
    const resolver = intent === 'delete' ? zodResolver(deleteExpenseSchema) : zodResolver(addExpenseSchemaWithId);
    const { data, errors } = await validateFormData(formData, resolver);
    if (errors) {
        console.log(errors);
        throw invalidRequest();
    }

    switch (intent) {
        case 'create':
            return addExpense({ ...(data as AddExpenseInputWithId), userId });
        case 'update':
            return updateExpense({ ...(data as AddExpenseInputWithId), userId });
        case 'delete':
            return deleteExpense({ ...(data as DeleteExpenseInput), userId });
    }
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);

    try {
        const formData = generateFormData(await request.formData());
        const { data: intentData, errors: intentErrors } = await validateFormData<ExpenseInput>(
            formData,
            zodResolver(expenseSchema)
        );
        if (intentErrors) {
            console.log(intentErrors);
            return invalidRequest();
        }

        return performExpenseAction({ formData, intent: intentData.intent, userId });
    } catch (error) {
        console.error(error);
        return { ok: false, error: 'Something went wrong' };
    }
};
