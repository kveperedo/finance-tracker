import { useRemixForm } from 'remix-hook-form';
import type { MonthlyIncomeInput } from './schema';
import { monthlyIncomeSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import NumberField from '~/components/number-field';
import Button from '~/components/button';
import { useEffect } from 'react';
import type { useFetcherWithReset } from '~/hooks/useFetcherWithReset';
import { getFetcherStates } from '~/utils';

type MonthlyIncomeFormProps = {
    defaultValue?: number;
    autoFocus?: boolean;
    onSubmitSuccess?: () => void;
    fetcher: ReturnType<typeof useFetcherWithReset>;
};

export default function MonthlyIncomeForm({
    defaultValue,
    autoFocus,
    onSubmitSuccess,
    fetcher,
}: MonthlyIncomeFormProps) {
    const { control, handleSubmit } = useRemixForm<MonthlyIncomeInput>({
        resolver: zodResolver(monthlyIncomeSchema),
        fetcher,
        submitConfig: {
            method: 'POST',
            action: '/resources/monthly-savings',
        },
        defaultValues: {
            monthlyIncome: defaultValue,
            intent: defaultValue ? 'update' : 'create',
        },
    });
    const { reset } = fetcher;
    const { isActionSubmitting, isActionLoading, isDone: isSubmitSuccessful } = getFetcherStates(fetcher);
    const isLoading = isActionSubmitting || isActionLoading;

    let buttonActionText;
    if (defaultValue) {
        buttonActionText = isLoading ? 'Updating' : 'Update';
    } else {
        buttonActionText = isLoading ? 'Saving' : 'Save';
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            onSubmitSuccess?.();
            reset();
        }
    }, [reset, isSubmitSuccessful, onSubmitSuccess]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-start justify-between gap-2"
            method="POST"
            action="/resources/monthly-savings"
        >
            <Controller
                control={control}
                name="monthlyIncome"
                render={({ field, fieldState: { error } }) => (
                    <NumberField
                        autoFocus={autoFocus}
                        aria-label="Monthly income input"
                        className="flex-1"
                        {...field}
                        onChange={(value) => {
                            field.onChange(isNaN(value) ? 0 : value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        isInvalid={!!error?.message}
                        errorMessage={error?.message}
                    />
                )}
            />
            <Button variant="secondary" type="submit" isDisabled={isLoading}>
                {buttonActionText} income
            </Button>
        </form>
    );
}
