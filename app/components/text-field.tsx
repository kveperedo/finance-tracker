import { forwardRef } from 'react';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import { TextField as AriaTextField, Text, FieldError } from 'react-aria-components';
import Input from './input';
import { cn } from '~/utils';
import Label from './label';

type TextFieldProps = AriaTextFieldProps & {
    label?: string;
    description?: string;
    errorMessage?: string;
    placeholder?: string;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, description, errorMessage, placeholder, ...props }, ref) => {
        return (
            <AriaTextField {...props} className={cn('flex flex-col items-start', props.className)}>
                {label && <Label>{label}</Label>}
                <Input ref={ref} placeholder={placeholder} />
                {description && <Text slot="description">{description}</Text>}
                <FieldError className="mt-1 text-xs text-red-600">{errorMessage}</FieldError>
            </AriaTextField>
        );
    }
);
TextField.displayName = 'TextField';

export default TextField;
