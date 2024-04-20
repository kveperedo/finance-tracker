import { chain } from 'react-aria';
import type { ModalProps } from './modal';
import Modal from './modal';
import Button from './button';

type AlertDialogProps = {
    title: string;
    message: string;
    cancelLabel?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
} & ModalProps;

export default function AlertDialog({
    title,
    message,
    cancelLabel,
    confirmLabel,
    onCancel,
    onConfirm,
    ...props
}: AlertDialogProps) {
    return (
        <Modal title={title} variant="alert-dialog" {...props}>
            {({ state: { close } }) => (
                <>
                    <p className="text-left text-sm">{message}</p>
                    <div className="mt-8 flex justify-end gap-4">
                        <Button autoFocus variant="secondary" onPress={chain(onCancel, close)}>
                            {cancelLabel ?? 'Cancel'}
                        </Button>
                        <Button onPress={chain(onConfirm, close)}>{confirmLabel ?? 'Confirm'}</Button>
                    </div>
                </>
            )}
        </Modal>
    );
}
