import MonthlySavingsPanel from './monthly-savings-panel';
import { useFetcher, useLoaderData } from '@remix-run/react';
import type { UserPreferenceKey, UserPreferences } from '../../resources.user-preferences/schema';
import type { loader } from '../route';
import { generateFormData } from '~/lib/remix-hook-form';
import { useMemo } from 'react';
import AddExpensePanel from './add-expense-panel';
import InvitationsPanel from './invitations-panel';

export default function ExpenseAside() {
    const { userPreferences } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<UserPreferences>({ key: 'user-prefs-fetcher' });
    const optimisticUserPreferences = useMemo(() => {
        return fetcher.formData ? (generateFormData(fetcher.formData) as UserPreferences) : null;
    }, [fetcher.formData]);
    const showAddExpensePanel =
        optimisticUserPreferences?.showAddExpensePanel ?? userPreferences.showAddExpensePanel ?? true;
    const showSavingsPanel = optimisticUserPreferences?.showSavingsPanel ?? userPreferences.showSavingsPanel ?? true;
    const showInvitationsPanel =
        optimisticUserPreferences?.showInvitationsPanel ?? userPreferences.showInvitationsPanel ?? true;

    const updatePreferences = (preferenceKey: UserPreferenceKey, isOpen: boolean) => {
        fetcher.submit({ [preferenceKey]: isOpen }, { method: 'POST', action: '/resources/user-preferences' });
    };

    return (
        <aside className="my-4 -mr-2 hidden w-96 flex-col gap-4 overflow-auto pr-3 sm:flex">
            <AddExpensePanel
                isOpen={showAddExpensePanel}
                onToggle={(isOpen) => updatePreferences('showAddExpensePanel', isOpen)}
            />
            <MonthlySavingsPanel
                isOpen={showSavingsPanel}
                onToggle={(isOpen) => updatePreferences('showSavingsPanel', isOpen)}
            />
            <InvitationsPanel
                isOpen={showInvitationsPanel}
                onToggle={(isOpen) => updatePreferences('showInvitationsPanel', isOpen)}
            />
        </aside>
    );
}
