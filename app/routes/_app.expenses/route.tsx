import { useFetcher, useLoaderData } from '@remix-run/react';
import { redirect } from '@vercel/remix';
import type { ExpenseParams } from './queries';
import { getExpenses, getMonthlyExpenses, getSavingsSummary, getUserMonthlyIncome } from './queries';
import AddExpenseModal from './add-expense-modal';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { getUserId } from '~/auth/session.server';
import { numberFormatter } from '~/utils';
import ExpenseFilterDropdown from './expense-filter-dropdown';
import { useCallback, useRef } from 'react';
import type { MonthKey } from './constants';
import { MONTHS } from './constants';
import ExpensesList from './expenses-list';
import Button from '~/components/button';
import ExpenseForm, { FETCHER_KEY } from '../resources.expenses/expense-form';
import ExpenseSearchField from './expense-search-field';
import MonthlySavingsPanel from './monthly-savings-panel';

export const meta: MetaFunction = ({ location }) => {
    const searchParams = new URLSearchParams(location.search);
    const month = searchParams.get('month') ?? new Date().getMonth() + 1;
    const year = searchParams.get('year') ?? new Date().getFullYear();

    return [
        { title: `${MONTHS[month as MonthKey]} ${year} Expenses` },
        {
            name: 'description',
            content: `Expenses for ${MONTHS[month as MonthKey]} ${year}`,
        },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }

    const searchParams = new URL(request.url).searchParams;
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const search = searchParams.get('q');

    const params: ExpenseParams = {
        userId,
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
        search: search ?? undefined,
    };

    const [expenses, monthlyExpenses, monthlyIncome, savingsSummary] = await Promise.all([
        getExpenses(params),
        getMonthlyExpenses(params),
        getUserMonthlyIncome(userId),
        getSavingsSummary(params),
    ]);

    return { expenses, monthlyExpenses, monthlyIncome, savingsSummary };
}

export default function ExpensesPage() {
    const { monthlyExpenses } = useLoaderData<typeof loader>();
    const gridRef = useRef<HTMLDivElement>(null);
    const fetcher = useFetcher({ key: FETCHER_KEY.ADD });

    const handleSubmit = useCallback(() => {
        gridRef.current?.scrollTo({ top: 0 });
    }, []);

    return (
        <div className="container mx-auto flex min-h-0 w-full flex-1 gap-4">
            <main className="flex flex-1 flex-col">
                <div className="m-4 flex min-h-0 flex-1 flex-col rounded border border-stone-300 bg-white px-0 shadow-sm sm:mx-0">
                    <div className="flex items-center justify-between gap-4 border-b border-stone-200 p-4">
                        <p className="text-sm font-medium">Expenses this month</p>
                        <div className="ml-auto">
                            <ExpenseFilterDropdown />
                        </div>
                        <div className="block sm:hidden">
                            <AddExpenseModal />
                        </div>
                    </div>

                    <ExpensesList ref={gridRef} />

                    <div className="flex items-center justify-between gap-4 border-t border-stone-200 p-4">
                        <ExpenseSearchField />

                        <p className="flex items-baseline gap-1 text-xl font-bold">
                            <span className="font-serif text-sm font-light">PHP</span>
                            {numberFormatter.format(monthlyExpenses)}
                        </p>
                    </div>
                </div>
            </main>
            <aside className="my-4 -mr-2 hidden w-96 flex-col gap-4 overflow-auto pr-3 sm:flex">
                <div className="rounded border border-stone-300 bg-white shadow-sm">
                    <div className="border-b border-stone-300 p-4">
                        <p className="text-sm font-medium">Add expenses</p>
                    </div>
                    <div className="p-4">
                        <ExpenseForm fetcher={fetcher} onSubmitSuccess={handleSubmit}>
                            <Button className="mt-8 w-full" type="submit">
                                Submit
                            </Button>
                        </ExpenseForm>
                    </div>
                </div>
                <MonthlySavingsPanel />
            </aside>
        </div>
    );
}
