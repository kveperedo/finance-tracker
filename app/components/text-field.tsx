import { forwardRef } from 'react';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components';
import { Label, TextField as AriaTextField, Text, FieldError } from 'react-aria-components';
import Input from './input';
import { cn } from '~/utils';

type TextFieldProps = AriaTextFieldProps & {
    label?: string;
    description?: string;
    errorMessage?: string;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, description, errorMessage, ...props }, ref) => {
        return (
            <AriaTextField {...props} className={cn('flex flex-col items-start', props.className)}>
                <Label className="mb-1">{label}</Label>
                <Input ref={ref} />
                {description && <Text slot="description">{description}</Text>}
                <FieldError className="mt-1 text-sm text-red-600">{errorMessage}</FieldError>
            </AriaTextField>
        );
    }
);
TextField.displayName = 'TextField';

export default TextField;
