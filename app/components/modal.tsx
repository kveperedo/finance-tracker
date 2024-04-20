import type { ModalOverlayProps } from 'react-aria-components';
import { ModalOverlay, Modal as AriaModal, Dialog, Heading } from 'react-aria-components';

import { cn } from '~/utils';
import Button from './button';
import { X } from 'lucide-react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const modalContainerStyles = tv({
    slots: {
        base: 'm-4 w-full rounded-lg border border-stone-300 bg-white shadow-md sm:w-96',
        header: 'flex items-center justify-between border-b border-stone-300 p-4',
        headerText: 'text-lg font-bold text-stone-700',
        body: 'p-8',
    },
    variants: {
        variant: {
            modal: { body: 'p-8' },
            'alert-dialog': { body: 'p-4' },
        },
    },
    defaultVariants: {
        variant: 'modal',
    },
});

export type ModalProps = ModalOverlayProps &
    VariantProps<typeof modalContainerStyles> & {
        title: string;
    };

export default function Modal({ children, variant, title, ...otherProps }: ModalProps) {
    const styles = modalContainerStyles({ variant });

    return (
        <ModalOverlay
            {...otherProps}
            isDismissable
            className={({ isEntering }) =>
                cn(
                    'fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/50 text-center backdrop-blur-sm',
                    isEntering && 'duration-300 ease-out animate-in fade-in'
                )
            }
        >
            {(props) => (
                <AriaModal className={styles.base()}>
                    <Dialog className="outline-none">
                        <div className={styles.header()}>
                            <Heading className={styles.headerText()} slot="title">
                                {title}
                            </Heading>

                            <Button variant="tertiary" size="icon-sm" onPress={props.state.close}>
                                <X />
                            </Button>
                        </div>

                        <div className={styles.body()}>
                            {typeof children === 'function' ? children(props) : children}
                        </div>
                    </Dialog>
                </AriaModal>
            )}
        </ModalOverlay>
    );
}
