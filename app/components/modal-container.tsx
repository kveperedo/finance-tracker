import type { PropsWithChildren } from 'react';
import { modalContainerStyles } from './modal';

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
