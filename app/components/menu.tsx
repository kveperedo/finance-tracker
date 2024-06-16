import type { MenuProps as AriaMenuProps } from 'react-aria-components';
import { Menu as AriaMenu } from 'react-aria-components';
import { cn } from '~/utils';

export default function Menu<T extends object>(props: AriaMenuProps<T>) {
    return <AriaMenu {...props} className={cn('flex flex-col gap-[2px] p-2 outline-none', props.className)} />;
}
