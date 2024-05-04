import type { ActionFunctionArgs, LoaderFunctionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { userPreferencesCookie } from './cookie.server';
import { getValidatedFormData } from 'remix-hook-form';
import type { UserPreferences } from './schema';
import { userPreferencesSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const cookieHeader = request.headers.get('Cookie');

    const cookie = ((await userPreferencesCookie.parse(cookieHeader)) ?? {}) as UserPreferences;

    return cookie;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = ((await userPreferencesCookie.parse(cookieHeader)) ?? {}) as UserPreferences;

    const { data, errors } = await getValidatedFormData<UserPreferences>(request, zodResolver(userPreferencesSchema));

    if (errors) {
        console.log(errors);
        return json({ error: 'Invalid request' }, { status: 400 });
    }

    cookie.showAddExpensePanel = data.showAddExpensePanel ?? cookie.showAddExpensePanel;
    cookie.showSavingsPanel = data.showSavingsPanel ?? cookie.showSavingsPanel;

    return json(cookie, {
        headers: { 'Set-Cookie': await userPreferencesCookie.serialize(cookie) },
    });
};
