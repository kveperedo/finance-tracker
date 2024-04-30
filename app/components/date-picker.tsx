import type { DatePickerProps as AriaDatePickerProps, DateValue } from 'react-aria-components';
import {
    DatePicker as AriaDatePicker,
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    DateInput,
    DateSegment,
    Dialog,
    FieldError,
    Group,
    Heading,
    Text,
} from 'react-aria-components';
import Label from './label';
import Popover from './popover';
import Button from './button';
import { inputStyles } from './input';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, focusRing } from '~/utils';
import { forwardRef } from 'react';

type DatePickerProps<T extends DateValue> = {
    label?: string;
    description?: string;
    errorMessage?: string;
} & AriaDatePickerProps<T>;

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps<DateValue>>(
    ({ label, description, errorMessage, className, ...otherProps }, ref) => {
        return (
            <AriaDatePicker
                ref={ref}
                granularity="day"
                {...otherProps}
                className={(renderProps) =>
                    cn(
                        'flex flex-col items-start',
                        typeof className === 'function' ? className(renderProps) : className
                    )
                }
            >
                {label && <Label>{label}</Label>}
                <Group
                    className={(renderProps) =>
                        inputStyles({ ...renderProps, className: 'flex items-center justify-between' })
                    }
                >
                    <DateInput className="flex gap-[2px]">
                        {(segment) => (
                            <DateSegment
                                className={(renderProps) =>
                                    focusRing({
                                        ...renderProps,
                                        className: cn(
                                            'rounded-sm caret-transparent outline-offset-0 focus:bg-stone-800 focus:text-stone-100'
                                        ),
                                    })
                                }
                                segment={segment}
                            />
                        )}
                    </DateInput>
                    <Button className="-mr-[10px] text-stone-600" variant="tertiary" size="icon-sm">
                        <CalendarIcon size={16} />
                    </Button>
                </Group>
                {description && <Text slot="description">{description}</Text>}
                <FieldError className="mt-1 text-xs text-red-600">{errorMessage}</FieldError>
                <Popover>
                    <Dialog className="p-4">
                        <Calendar>
                            <header className="mb-4 flex items-center justify-between gap-2">
                                <Button variant="outline" size="icon-sm" slot="previous">
                                    <ChevronLeft />
                                </Button>
                                <Heading className="text-sm" />
                                <Button variant="outline" size="icon-sm" slot="next">
                                    <ChevronRight />
                                </Button>
                            </header>
                            <CalendarGrid>
                                <CalendarGridHeader>
                                    {(day) => <CalendarHeaderCell className="text-xs">{day}</CalendarHeaderCell>}
                                </CalendarGridHeader>
                                <CalendarGridBody>
                                    {(date) => (
                                        <CalendarCell
                                            date={date}
                                            className={(renderProps) =>
                                                focusRing({
                                                    ...renderProps,
                                                    className:
                                                        'flex h-9 w-9 items-center justify-center rounded-full text-sm outline-offset-0 hover:bg-stone-100 focus:bg-stone-100 selected:bg-stone-800 selected:text-stone-50 disabled:text-stone-300',
                                                })
                                            }
                                        />
                                    )}
                                </CalendarGridBody>
                            </CalendarGrid>
                        </Calendar>
                    </Dialog>
                </Popover>
            </AriaDatePicker>
        );
    }
);
DatePicker.displayName = 'DatePicker';

export default DatePicker;
