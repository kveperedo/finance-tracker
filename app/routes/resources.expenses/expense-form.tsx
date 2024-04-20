import { useRemixForm } from 'remix-hook-form';
import { addExpenseSchema, type AddExpenseInput } from './schema';
import { Controller } from 'react-hook-form';
import NumberField from '~/components/number-field';
import TextField from '~/components/text-field';
import { useEffect, useRef, type PropsWithChildren } from 'react';
import type { useFetcher } from '@remix-run/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

export const EXPENSE_FETCHER_KEY = 'add-expense-fetcher';

type ExpenseFormProps = PropsWithChildren<{
    autoFocus?: boolean;
    onSubmitSuccess?: () => void;
    fetcher: ReturnType<typeof useFetcher>;
}>;

export default function ExpenseForm({ autoFocus, children, fetcher, onSubmitSuccess }: ExpenseFormProps) {
    const {
        handleSubmit,
        control,
        formState: { isSubmitSuccessful, isSubmitting },
        reset,
    } = useRemixForm<AddExpenseInput>({
        resolver: zodResolver(addExpenseSchema),
        fetcher,
        defaultValues: {
            amount: 0,
            description: '',
        },
        submitData: {
            id: uuidv4(),
        },
        submitConfig: {
            method: 'POST',
            action: '/resources/expenses',
        },
    });
    const numberFieldRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            numberFieldRef.current?.focus();
        }
    }, [isSubmitting, isSubmitSuccessful, reset]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            onSubmitSuccess?.();
        }
    }, [isSubmitting, isSubmitSuccessful, onSubmitSuccess]);

    useEffect(() => () => console.log('unmounting'), []);

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <Controller
                    control={control}
                    name="amount"
                    render={({ field, fieldState: { error } }) => {
                        return (
                            <NumberField
                                autoFocus={autoFocus}
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
