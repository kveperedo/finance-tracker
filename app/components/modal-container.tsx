import type { PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

export const modalContainerStyles = tv({
    slots: {
        base: 'm-4 w-full rounded-lg border border-stone-300 bg-white shadow-md sm:w-96',
        header: 'flex items-center justify-between border-b border-stone-300 p-4',
        headerText: 'text-lg font-bold text-stone-700',
        body: 'p-8',
    },
});

type ModalContainerProps = PropsWithChildren<{
    header: string;
}>;

export default function ModalContainer({ children, header }: ModalContainerProps) {
    return (
        <div className={modalContainerStyles().base()}>
            <div className={modalContainerStyles().header()}>
                <p className={modalContainerStyles().headerText()}>{header}</p>
            </div>
            <div className={modalContainerStyles().body()}>{children}</div>
        </div>
    );
}
