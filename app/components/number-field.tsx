import { forwardRef } from 'react';
import type { NumberFieldProps as AriaNumberFieldProps } from 'react-aria-components';
import { NumberField as AriaNumberField, FieldError, Text } from 'react-aria-components';
import Input from './input';
import { cn } from '~/utils';
import Label from './label';

type NumberFieldProps = AriaNumberFieldProps & {
    label?: string;
    description?: string;
    placeholder?: string;
    errorMessage?: string;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
    ({ label, description, errorMessage, placeholder, ...props }, ref) => {
        return (
            <AriaNumberField
                {...props}
                onFocus={(event) => {
                    (event.target as HTMLInputElement).select();
                    props.onFocus?.(event);
                }}
                className={cn('flex flex-col items-start', props.className)}
            >
                {label && <Label>{label}</Label>}
                <Input ref={ref} className="text-sm" placeholder={placeholder} />
                {description && <Text slot="description">{description}</Text>}
                <FieldError className="mt-1 text-xs text-red-600">{errorMessage}</FieldError>
            </AriaNumberField>
        );
    }
);
NumberField.displayName = 'NumberField';

export default NumberField;
