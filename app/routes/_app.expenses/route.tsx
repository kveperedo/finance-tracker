import { useLoaderData } from '@remix-run/react';
import { redirect } from '@vercel/remix';
import type { ExpenseParams } from './queries';
import { getExpenses, getMonthlyExpenses, getSavingsSummary, getUserMonthlyIncome } from './queries';
import AddExpenseModal from './add-expense-modal';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { getUserId } from '~/auth/session.server';
import { numberFormatter } from '~/utils';
import ExpenseFilterDropdown from './expense-filter-dropdown';
import type { MonthKey } from './constants';
import { MONTHS } from './constants';
import ExpensesList from './expenses-list';
import ExpenseSearchField from './expense-search-field';
import ExpenseAside from './expense-aside';
import { userPreferencesCookie } from '../resources.user-preferences/cookie.server';
import type { UserPreferences } from '../resources.user-preferences/schema';

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

    const cookieHeader = request.headers.get('Cookie');
    const userPreferences = ((await userPreferencesCookie.parse(cookieHeader)) ?? {
        showAddExpensePanel: true,
        showSavingsPanel: true,
    }) as UserPreferences;

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

    return { expenses, monthlyExpenses, monthlyIncome, savingsSummary, userPreferences };
}

export default function ExpensesPage() {
    const { monthlyExpenses } = useLoaderData<typeof loader>();

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

                    <ExpensesList />

                    <div className="flex items-center justify-between gap-4 border-t border-stone-200 p-4">
                        <ExpenseSearchField />

                        <p className="flex items-baseline gap-1 text-xl font-bold">
                            <span className="font-serif text-sm font-light">PHP</span>
                            {numberFormatter.format(monthlyExpenses)}
                        </p>
                    </div>
                </div>
            </main>
            <ExpenseAside />
        </div>
    );
}
