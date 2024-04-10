import type { LabelProps } from 'react-aria-components';
import { Label as AriaLabel } from 'react-aria-components';
import { cn } from '~/utils';

export default function Label({ children, ...props }: LabelProps) {
    return (
        <AriaLabel {...props} className={cn('mb-1 text-sm text-stone-600', props.className)}>
            {children}
        </AriaLabel>
    );
}
