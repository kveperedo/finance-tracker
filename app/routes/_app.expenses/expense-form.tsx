import type { useRemixForm } from 'remix-hook-form';
import type { AddExpenseInput } from './schema';
import { Controller } from 'react-hook-form';
import NumberField from '~/components/number-field';
import TextField from '~/components/text-field';
import type { PropsWithChildren } from 'react';

type ExpenseFormProps = PropsWithChildren<{
    formMethods: ReturnType<typeof useRemixForm<AddExpenseInput>>;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}>;

export default function ExpenseForm({ formMethods, onSubmit, children }: ExpenseFormProps) {
    const { control } = formMethods;

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
                <Controller
                    control={control}
                    name="amount"
                    render={({ field, fieldState: { error } }) => {
                        return (
                            <NumberField
                                autoFocus
                                label="Amount"
                                {...field}
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
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            label="Description"
                            {...field}
                            isInvalid={!!error?.message}
                            errorMessage={error?.message}
                        />
                    )}
                />
            </div>

            {children}
        </form>
    );
}
