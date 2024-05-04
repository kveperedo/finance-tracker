import Button from '~/components/button';
import MonthlySavingsPanel from './monthly-savings-panel';
import ExpenseForm, { FETCHER_KEY } from '../resources.expenses/expense-form';
import { useFetcher, useLoaderData } from '@remix-run/react';
import type { AccordionPanelProps } from '../../components/accordion-panel';
import AccordionPanel from '../../components/accordion-panel';
import type { UserPreferenceKey, UserPreferences } from '../resources.user-preferences/schema';
import type { loader } from './route';
import { generateFormData } from '~/lib/remix-hook-form';
import { useMemo } from 'react';

function ExpenseFormPanel(props: Pick<AccordionPanelProps, 'isOpen' | 'onToggle'>) {
    const fetcher = useFetcher({ key: FETCHER_KEY.ADD });

    return (
        <AccordionPanel title="Add expenses" {...props}>
            <ExpenseForm fetcher={fetcher}>
                <Button className="mt-8 w-full" type="submit">
                    Submit
                </Button>
            </ExpenseForm>
        </AccordionPanel>
    );
}

export default function ExpenseAside() {
    const { userPreferences } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<UserPreferences>({ key: 'user-prefs-fetcher' });
    const optimisticUserPreferences = useMemo(() => {
        return fetcher.formData ? (generateFormData(fetcher.formData) as UserPreferences) : null;
    }, [fetcher.formData]);
    const showAddExpensePanel =
        optimisticUserPreferences?.showAddExpensePanel ?? userPreferences.showAddExpensePanel ?? true;
    const showSavingsPanel = optimisticUserPreferences?.showSavingsPanel ?? userPreferences.showSavingsPanel ?? true;

    const updatePreferences = (preferenceKey: UserPreferenceKey, isOpen: boolean) => {
        fetcher.submit({ [preferenceKey]: isOpen }, { method: 'POST', action: '/resources/user-preferences' });
    };

    return (
        <aside className="my-4 -mr-2 hidden w-96 flex-col gap-4 overflow-auto pr-3 sm:flex">
            <ExpenseFormPanel
                isOpen={showAddExpensePanel}
                onToggle={(isOpen) => updatePreferences('showAddExpensePanel', isOpen)}
            />
            <MonthlySavingsPanel
                isOpen={showSavingsPanel}
                onToggle={(isOpen) => updatePreferences('showSavingsPanel', isOpen)}
            />
        </aside>
    );
}
