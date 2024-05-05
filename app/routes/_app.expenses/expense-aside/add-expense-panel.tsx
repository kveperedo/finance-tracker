import { useFetcher } from '@remix-run/react';
import type { AccordionPanelProps } from '~/components/accordion-panel';
import AccordionPanel from '~/components/accordion-panel';
import Button from '~/components/button';
import ExpenseForm, { FETCHER_KEY } from '~/routes/resources.expenses/expense-form';

export default function AddExpensePanel(props: Pick<AccordionPanelProps, 'isOpen' | 'onToggle'>) {
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
