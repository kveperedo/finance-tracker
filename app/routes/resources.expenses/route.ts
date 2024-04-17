import { z } from 'zod';
import { addExpenseSchema } from './schema';
import type { ActionFunctionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { getValidatedFormData } from 'remix-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requireUserId } from '~/auth/session.server';
import { addExpense } from './queries';

const addExpenseSchemaWithId = addExpenseSchema.extend({
    id: z.string().uuid(),
});
type AddExpenseInputWithId = z.infer<typeof addExpenseSchemaWithId>;

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const { data, errors } = await getValidatedFormData<AddExpenseInputWithId>(
            request,
            zodResolver(addExpenseSchemaWithId)
        );

        if (errors) {
            return json({ error: 'Invalid request' }, { status: 400 });
        }

        const userId = await requireUserId(request);
        const result = await addExpense({ ...data, userId });

        return { ok: true, data: result };
    } catch (error) {
        console.error(error);
        return { ok: false, error: 'Something went wrong' };
    }
};
