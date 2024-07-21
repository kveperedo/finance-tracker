import { Outlet, useLoaderData, useRevalidator } from '@remix-run/react';
import type { ExpenseParams } from './queries';
import { getExpenses, getSavingsSummary, getUserMonthlyIncome, getUserRole } from './queries';
import AddExpenseModal from './add-expense-modal';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { requireUserId } from '~/auth/session.server';
import { numberFormatter } from '~/utils';
import ExpenseFilterDropdown from './expense-filter-dropdown';
import type { MonthKey } from './constants';
import { MONTHS } from './constants';
import ExpensesList from './expenses-list';
import ExpenseSearchField from './expense-search-field';
import { userPreferencesCookie } from '../resources.user-preferences/cookie.server';
import type { UserPreferences } from '../resources.user-preferences/schema';
import { getMonthlyExpenses } from '../resources.expenses/queries';
import { useBreakpoint } from '~/hooks/useBreakpoint';
import type { Expense } from '~/db/types';
import { useEffect } from 'react';

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
    const userId = await requireUserId(request);
    const cookieHeader = request.headers.get('Cookie');
    const userPreferences = ((await userPreferencesCookie.parse(cookieHeader)) ?? {
        showAddExpensePanel: true,
        showSavingsPanel: true,
        showInvitationsPanel: true,
    }) as UserPreferences;

    const searchParams = new URL(request.url).searchParams;
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const search = searchParams.get('q');
    const category = searchParams.get('category') as Expense['category'] | null;

    const params: ExpenseParams = {
        userId,
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
        search: search ?? undefined,
        category: category ?? undefined,
    };

    const [expenses, monthlyExpenses, monthlyIncome, userRole, savingsSummary] = await Promise.all([
        getExpenses(params),
        getMonthlyExpenses(params),
        getUserMonthlyIncome(userId),
        getUserRole(userId),
        getSavingsSummary(params),
    ]);

    return { expenses, monthlyExpenses, monthlyIncome, savingsSummary, userPreferences, userRole };
}

export default function ExpensesPage() {
    const { monthlyExpenses } = useLoaderData<typeof loader>();
    const { isSm } = useBreakpoint('sm');
    const revalidator = useRevalidator();

    useEffect(() => {
        const onWindowFocus = () => {
            revalidator.revalidate();
        };

        window.addEventListener('focus', onWindowFocus);
        return () => window.removeEventListener('focus', onWindowFocus);
    }, [revalidator]);

    return (
        <div className="container mx-auto flex min-h-0 w-full flex-1 gap-4">
            <aside className="m-4 flex min-h-0 max-w-none flex-1 flex-col rounded border border-stone-300 bg-white px-0 shadow-sm sm:mx-0 sm:max-w-96 sm:flex-none">
                <div className="flex items-center justify-between gap-4 border-b border-stone-200 p-4">
                    <ExpenseFilterDropdown />
                    <AddExpenseModal />
                </div>

                <ExpensesList />

                <div className="flex items-center justify-between gap-4 border-t border-stone-200 p-4">
                    <ExpenseSearchField />

                    <p className="flex items-baseline gap-1 text-xl font-bold">
                        <span className="font-serif text-sm font-light">PHP</span>
                        {numberFormatter.format(monthlyExpenses)}
                    </p>
                </div>
            </aside>

            {isSm && <Outlet />}

            {/* TODO: Move this somewhere else */}
            {/* <ExpenseAside /> */}
        </div>
    );
}
