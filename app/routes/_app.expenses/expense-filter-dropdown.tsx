/* eslint-disable drizzle/enforce-delete-with-where */
import { Dialog } from 'react-aria-components';
import type { MonthKey } from './constants';
import { MONTHS, generateYears } from './constants';
import { ChevronsUpDown, CircleX, FilterX } from 'lucide-react';
import Popover from '~/components/popover';
import { ListBoxItem } from '~/components/item';
import Button from '~/components/button';
import Select from '~/components/select';
import { useRef, useState } from 'react';
import useExpenseSearchParams from './hooks/useExpenseSearchParams';
import { getMonth } from '~/utils';
import { getYear } from 'date-fns';

const YEARS = generateYears();

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
                {MONTHS[currentMonth as MonthKey]} {currentYear}
            </Button>
            <Popover triggerRef={triggerRef} isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen} showArrow>
                <Dialog aria-label="Expense filter dropdown" className="w-72 p-4 outline-none">
                    <div className="flex items-center gap-4">
                        <Select
                            name="month"
                            className="flex-1"
                            autoFocus
                            label="Month"
                            defaultSelectedKey={currentMonth}
                            selectedKey={currentMonth}
                            onSelectionChange={(key) => {
                                actions.setParam('month', String(key));
                            }}
                        >
                            {Object.entries(MONTHS).map(([key, value]) => (
                                <ListBoxItem key={key} id={Number(key)}>
                                    {value}
                                </ListBoxItem>
                            ))}
                        </Select>
                        <Select
                            name="year"
                            className="flex-1"
                            label="Year"
                            defaultSelectedKey={currentYear}
                            selectedKey={currentYear}
                            onSelectionChange={(key) => {
                                actions.setParam('year', String(key));
                            }}
                        >
                            {YEARS.map((year) => (
                                <ListBoxItem key={year} id={Number(year)}>
                                    {year}
                                </ListBoxItem>
                            ))}
                        </Select>
                    </div>

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
