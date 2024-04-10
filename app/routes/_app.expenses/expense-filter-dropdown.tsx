/* eslint-disable drizzle/enforce-delete-with-where */
import { Dialog } from 'react-aria-components';
import type { MonthKey } from './constants';
import { MONTHS, generateYears } from './constants';
import { ChevronsUpDown } from 'lucide-react';
import Popover from '~/components/popover';
import { ListBoxItem } from '~/components/item';
import { useSearchParams } from '@remix-run/react';
import Button from '~/components/button';
import Select from '~/components/select';
import { useRef, useState } from 'react';

const YEARS = generateYears();

export default function ExpenseFilterDropdown() {
    const triggerRef = useRef(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentMonth = Number(searchParams.get('month') ?? new Date().getMonth() + 1);
    const currentYear = Number(searchParams.get('year') ?? new Date().getFullYear());

    return (
        <>
            <Button
                ref={triggerRef}
                onPress={() => setIsPopoverOpen(true)}
                variant="outline"
                rightIcon={<ChevronsUpDown size={16} />}
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
                                setSearchParams((searchParams) => {
                                    searchParams.set('month', String(key));
                                    return searchParams;
                                });
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
                                setSearchParams((searchParams) => {
                                    searchParams.set('year', String(key));
                                    return searchParams;
                                });
                            }}
                        >
                            {YEARS.map((year) => (
                                <ListBoxItem key={year} id={Number(year)}>
                                    {year}
                                </ListBoxItem>
                            ))}
                        </Select>
                    </div>

                    <Button
                        onPress={() => {
                            setIsPopoverOpen(false);
                            setSearchParams((searchParams) => {
                                searchParams.delete('month');
                                searchParams.delete('year');
                                return searchParams;
                            });
                        }}
                        variant="secondary"
                        className="mt-4 w-full"
                    >
                        Reset filters
                    </Button>
                </Dialog>
            </Popover>
        </>
    );
}
