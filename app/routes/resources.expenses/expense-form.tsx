import { useRemixForm } from 'remix-hook-form';
import type { AddExpenseInput } from './schema';
import { addExpenseSchema } from './schema';
import { Controller } from 'react-hook-form';
import NumberField from '~/components/number-field';
import TextField from '~/components/text-field';
import { useEffect, useRef, type PropsWithChildren } from 'react';
import type { useFetcher } from '@remix-run/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from '~/components/date-picker';
import { cn, getMonth, getYear, isDateMatchingSearchParams, toAriaDateTime, toNativeDate } from '~/utils';
import type { Expense } from '~/db/types';
import useExpenseSearchParams from '../_app.expenses/hooks/useExpenseSearchParams';
import { generateFormData } from '~/lib/remix-hook-form';
import Select from '~/components/select';
import { ListBoxItem } from '~/components/item';
import { expenseCategories, getTagColors } from './constants';

const generateDefaultValues = (): AddExpenseInput => {
    return {
        date: new Date(),
        amount: 0,
        description: '',
        category: null as any,
        intent: 'create',
    };
};

export const FETCHER_KEY = {
    ADD: 'add-expense-fetcher',
    UPDATE: 'update-expense-fetcher',
    DELETE: 'delete-expense-fetcher',
};

type DefaultValues = Omit<Expense, 'userId'> & { intent: AddExpenseInput['intent'] };

type ExpenseFormProps = PropsWithChildren<{
    autoFocus?: boolean;
    onSubmitSuccess?: () => void;
    fetcher: ReturnType<typeof useFetcher>;
    defaultValues?: DefaultValues;
}>;

export default function ExpenseForm({
    autoFocus,
    children,
    fetcher,
    defaultValues,
    onSubmitSuccess,
}: ExpenseFormProps) {
    const isUpdate = Boolean(defaultValues);
    const {
        handleSubmit,
        control,
        formState: { isSubmitSuccessful, isSubmitting },
        reset,
    } = useRemixForm<AddExpenseInput>({
        resolver: zodResolver(addExpenseSchema),
        fetcher,
        defaultValues: isUpdate
            ? { ...defaultValues, date: defaultValues?.updatedAt, amount: parseInt(defaultValues?.amount ?? '0') }
            : generateDefaultValues(),
        submitData: {
            id: isUpdate ? defaultValues?.id : uuidv4(),
        },
        submitConfig: {
            method: 'POST',
            action: '/resources/expenses',
        },
    });
    const numberFieldRef = useRef<HTMLInputElement | null>(null);
    const [searchParams, { setParam }] = useExpenseSearchParams();

    useEffect(() => {
        if (fetcher.formData) {
            const formData = generateFormData(fetcher.formData);
            const date = new Date(formData.date);

            if (!isDateMatchingSearchParams(date.toString(), searchParams)) {
                setParam('month', getMonth(date).toString());
                setParam('year', getYear(date).toString());
            }
        }
    }, [fetcher.formData, searchParams, setParam]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(generateDefaultValues());
            numberFieldRef.current?.focus();
        }
    }, [isSubmitting, isSubmitSuccessful, reset]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            onSubmitSuccess?.();
        }
    }, [isSubmitting, isSubmitSuccessful, onSubmitSuccess]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <Controller
                    control={control}
                    name="date"
                    render={({ field, fieldState: { error } }) => (
                        <DatePicker
                            label="Date"
                            {...field}
                            value={toAriaDateTime(field.value ?? new Date())}
                            onChange={(value) => field.onChange(toNativeDate(value))}
                            isInvalid={!!error?.message}
                            errorMessage={error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="category"
                    render={({ field, fieldState: { error } }) => (
                        <Select
                            autoFocus={autoFocus}
                            label="Category"
                            placeholder="Select a category"
                            items={expenseCategories}
                            renderValue={({ label, Icon }) => {
                                const { text } = getTagColors(field.value);

                                return (
                                    <span className="flex items-center gap-3">
                                        <span className={cn(field.value && text.default)}>
                                            <Icon size={16} />
                                        </span>
                                        {label}
                                    </span>
                                );
                            }}
                            {...field}
                            selectedKey={field.value}
                            onSelectionChange={(item) => field.onChange(item)}
                            isInvalid={!!error?.message}
                            errorMessage={error?.message}
                        >
                            {(item) => {
                                const { Icon } = item;
                                const { text } = getTagColors(item.value);

                                return (
                                    <ListBoxItem
                                        id={item.value}
                                        textValue={item.value}
                                        icon={<Icon className={cn(text.default, 'h-[inherit] w-[inherit]')} />}
                                    >
                                        {item.label}
                                    </ListBoxItem>
                                );
                            }}
                        </Select>
                    )}
                />

                <Controller
                    control={control}
                    name="amount"
                    render={({ field, fieldState: { error } }) => {
                        return (
                            <NumberField
                                // autoFocus={autoFocus}
                                label="Amount"
                                {...field}
                                ref={(node) => {
                                    field.ref(node);
                                    numberFieldRef.current = node;
                                }}
                                onChange={(value) => {
                                    field.onChange(isNaN(value) ? 0 : value);
                                }}
                                isInvalid={!!error?.message}
                                errorMessage={error?.message}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="description"
                    render={({ field, fieldState: { error } }) => {
                        return (
                            <TextField
                                label="Description"
                                {...field}
                                isInvalid={!!error?.message}
                                errorMessage={error?.message}
                            />
                        );
                    }}
                />
            </div>

            {children}
        </form>
    );
}
