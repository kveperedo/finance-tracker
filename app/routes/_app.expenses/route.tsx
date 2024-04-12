import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';
import { json, redirect } from '@vercel/remix';
import type { ExpenseParams } from './queries';
import { addExpense, getExpenses, getMonthlyExpenses } from './queries';
import AddExpenseModal from './add-expense-modal';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import type { AddExpenseInput } from './schema';
import { addExpenseSchema } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserId } from '~/auth/session.server';
import { generateFormData } from '~/lib/remix-hook-form';
import { numberFormatter } from '~/utils';
import ExpenseFilterDropdown from './expense-filter-dropdown';
import { useEffect, useMemo, useRef } from 'react';
import type { MonthKey } from './constants';
import { MONTHS } from './constants';
import ExpensesList from './expenses-list';
import Input from '~/components/input';
import { SearchField } from 'react-aria-components';
import Button from '~/components/button';
import { CircleX, Search } from 'lucide-react';

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

const addExpenseSchemaWithId = addExpenseSchema.extend({
    id: z.string().uuid(),
});
type AddExpenseInputWithId = z.infer<typeof addExpenseSchemaWithId>;

export async function action({ request }: ActionFunctionArgs) {
    try {
        const { data, errors } = await getValidatedFormData<AddExpenseInputWithId>(
            request,
            zodResolver(addExpenseSchemaWithId)
        );

        if (errors) {
            return json({ error: 'Invalid request' }, { status: 400 });
        }

        const userId = await getUserId(request);
        if (!userId) {
            return redirect('/login');
        }

        const result = await addExpense({ ...data, userId });

        return { ok: true, data: result };
    } catch (error) {
        console.error(error);
        return { ok: false, error: 'Something went wrong' };
    }
}

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

    const [expenses, monthlyExpenses] = await Promise.all([getExpenses(params), getMonthlyExpenses(params)]);

    return { expenses, monthlyExpenses };
}

export default function ExpensesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('q') ?? '';
    const { expenses, monthlyExpenses } = useLoaderData<typeof loader>();
    const gridRef = useRef<HTMLDivElement>(null);
    const fetcher = useFetcher<typeof action>();
    const formMethods = useRemixForm<AddExpenseInput>({
        resolver: zodResolver(addExpenseSchema),
        submitData: {
            id: uuidv4(),
        },
        defaultValues: {
            description: '',
            amount: 0,
        },
        fetcher,
    });
    const {
        formState: { isSubmitting, isSubmitSuccessful },
    } = formMethods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            gridRef.current?.scrollTo({ top: 0 });
        }
    }, [isSubmitting, isSubmitSuccessful]);

    const pendingExpense = fetcher.formData
        ? (generateFormData(fetcher.formData) as AddExpenseInput & { id: string })
        : null;

    const totalMonthlyExpenses = monthlyExpenses + (pendingExpense?.amount ?? 0);

    const expensesToDisplay = useMemo(() => {
        const transformedExpenses = expenses.map((expense) => ({
            ...expense,
            createdAt: new Date(expense.createdAt),
            updatedAt: new Date(expense.updatedAt),
        }));

        type Expense = (typeof transformedExpenses)[number];

        return pendingExpense
            ? [
                  {
                      ...pendingExpense,
                      amount: String(pendingExpense.amount),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                  } as Expense,
                  ...transformedExpenses,
              ]
            : transformedExpenses;
    }, [expenses, pendingExpense]);

    return (
        <main className="container m-auto mx-auto flex min-h-0 w-full flex-1 flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-0">
                <ExpenseFilterDropdown />
                <AddExpenseModal formMethods={formMethods} />
            </div>

            <div className="mx-4 mb-4 flex min-h-0 flex-1 flex-col rounded border border-stone-300 bg-white px-0 shadow-sm sm:mx-0">
                <ExpensesList ref={gridRef} expenses={expensesToDisplay} pendingExpenseId={pendingExpense?.id} />

                <div className="flex items-center justify-between gap-4 border-t border-stone-200 p-4">
                    <SearchField
                        key={search}
                        className="group relative flex items-center"
                        defaultValue={search}
                        onSubmit={(newSearch) => {
                            setSearchParams((searchParams) => {
                                searchParams.set('q', newSearch.toLowerCase());
                                return searchParams;
                            });
                        }}
                        onClear={() => {
                            setSearchParams((searchParams) => {
                                // eslint-disable-next-line drizzle/enforce-delete-with-where
                                searchParams.delete('q');
                                return searchParams;
                            });
                        }}
                    >
                        <Search className="absolute left-0 ml-3 text-stone-500" size={16} />
                        <Input
                            className="px-10 [&::-webkit-search-cancel-button]:hidden"
                            placeholder="Search expenses"
                        />
                        <Button
                            className="absolute right-0 mr-[6px] text-stone-500 group-empty:invisible"
                            variant="tertiary"
                            size="icon-sm"
                        >
                            <CircleX size={16} />
                        </Button>
                    </SearchField>

                    <p className="flex items-baseline gap-1 text-xl font-bold">
                        <span className="font-serif text-sm font-light">PHP </span>
                        {numberFormatter.format(totalMonthlyExpenses)}
                    </p>
                </div>
            </div>
        </main>
    );
}
