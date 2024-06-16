/* eslint-disable drizzle/enforce-delete-with-where */
import { Dialog } from 'react-aria-components';
import type { MonthKey } from './constants';
import { MONTHS, SHORT_MONTHS } from './constants';
import { ChevronLeft, ChevronRight, ChevronsUpDown, CircleX, FilterX } from 'lucide-react';
import Popover from '~/components/popover';
import Button from '~/components/button';
import { useRef, useState } from 'react';
import useExpenseSearchParams from './hooks/useExpenseSearchParams';
import { cn, getMonth } from '~/utils';
import { getYear } from 'date-fns';
import { chunk } from 'lodash-es';

function MonthSelect() {
    const [{ month: currentMonth, year: currentYear }, actions] = useExpenseSearchParams();
    const chunkedMonths = chunk(Object.entries(SHORT_MONTHS), 3);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="icon-sm"
                    onPress={() => actions.setParam('year', String(currentYear - 1))}
                >
                    <ChevronLeft />
                </Button>

                <p className="text-sm">
                    {MONTHS[currentMonth as MonthKey]} {currentYear}
                </p>

                <Button
                    variant="outline"
                    size="icon-sm"
                    onPress={() => actions.setParam('year', String(currentYear + 1))}
                >
                    <ChevronRight />
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                {chunkedMonths.map((months, index) => (
                    <div key={index} className="flex gap-2">
                        {months.map(([key, value]) => {
                            const isCurrentMonth = currentMonth === Number(key);

                            return (
                                <Button
                                    key={key}
                                    onPress={() => {
                                        actions.setParam('month', key);
                                    }}
                                    size="sm"
                                    variant={isCurrentMonth ? 'primary' : 'tertiary'}
                                    className={cn('flex-1', isCurrentMonth && 'shadow-sm')}
                                >
                                    {value}
                                </Button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ExpenseFilterDropdown() {
    const triggerRef = useRef(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [{ month: currentMonth, year: currentYear }, actions] = useExpenseSearchParams();
    const dateNow = new Date();
    const isSameAsCurrentDate = getMonth(dateNow) === currentMonth && getYear(dateNow) === currentYear;

    return (
        <>
            <Button
                className="whitespace-nowrap pr-[6px] shadow-sm"
                ref={triggerRef}
                onPress={() => setIsPopoverOpen(true)}
                variant="outline"
                rightIcon={
                    isSameAsCurrentDate ? (
                        <div className="flex h-7 w-7 items-center justify-center">
                            <ChevronsUpDown size={16} />
                        </div>
                    ) : (
                        <Button
                            className="hover:bg-stone-300"
                            size="icon-sm"
                            variant="tertiary"
                            onPress={() => {
                                actions.deleteParam('month', 'year');
                            }}
                        >
                            <CircleX size={16} />
                        </Button>
                    )
                }
            >
                {MONTHS[currentMonth as MonthKey]} {currentYear} Expenses
            </Button>
            <Popover
                placement="bottom left"
                triggerRef={triggerRef}
                isOpen={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                showArrow
            >
                <Dialog aria-label="Expense filter dropdown" className="w-60 p-4 outline-none">
                    <MonthSelect />
                    {!isSameAsCurrentDate && (
                        <Button
                            onPress={() => {
                                setIsPopoverOpen(false);
                                actions.deleteParam('month', 'year');
                            }}
                            variant="secondary"
                            className="mt-4 w-full"
                            leftIcon={<FilterX size={16} />}
                        >
                            Clear filters
                        </Button>
                    )}
                </Dialog>
            </Popover>
        </>
    );
}
