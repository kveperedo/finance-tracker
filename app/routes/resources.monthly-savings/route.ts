import type { ActionFunctionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { requireUserId } from '~/auth/session.server';
import { addUserMonthlyIncome, updateUserMonthlyIncome } from './queries';
import { getValidatedFormData } from 'remix-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MonthlyIncomeInput } from './schema';
import { monthlyIncomeSchema } from './schema';

export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    const { data, errors } = await getValidatedFormData<MonthlyIncomeInput>(request, zodResolver(monthlyIncomeSchema));

    if (errors) {
        return json({ error: 'Invalid request' }, { status: 400 });
    }

    switch (data.intent) {
        case 'create':
            return addUserMonthlyIncome(userId, data.monthlyIncome);
        case 'update':
            return updateUserMonthlyIncome(userId, data.monthlyIncome);
        default:
            return json({ error: 'Invalid request' }, { status: 400 });
    }
};
