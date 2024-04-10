import { ListPlus, X } from 'lucide-react';
import { Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { Controller } from 'react-hook-form';
import TextField from '~/components/text-field';
import { useEffect, useState } from 'react';
import Button from '~/components/button';
import NumberField from '~/components/number-field';
import type { AddExpenseInput } from './schema';
import type { useRemixForm } from 'remix-hook-form';
import { cn } from '~/utils';
import { modalContainerStyles } from '~/components/modal-container';

type AddExpenseModalProps = {
    formMethods: ReturnType<typeof useRemixForm<AddExpenseInput>>;
};

export default function AddExpenseModal({ formMethods }: AddExpenseModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const {
        reset,
        handleSubmit,
        control,
        formState: { isValid },
    } = formMethods;

    useEffect(
        function resetFormOnUnmount() {
            if (!isOpen) {
                reset();
            }
        },
        [isOpen, reset]
    );

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button leftIcon={<ListPlus size={20} />}>Add Expense</Button>
            <ModalOverlay
                isDismissable
                className={({ isEntering }) =>
                    cn(
                        'fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/50 text-center backdrop-blur-sm',
                        isEntering && 'duration-300 ease-out animate-in fade-in'
                    )
                }
            >
                <Modal className={modalContainerStyles().base()}>
                    <Dialog>
                        <div className={modalContainerStyles().header()}>
                            <Heading className={modalContainerStyles().headerText()} slot="title">
                                Add Expenses
                            </Heading>

                            <Button variant="tertiary" size="icon-sm" onPress={() => setIsOpen(false)}>
                                <X />
                            </Button>
                        </div>

                        <form
                            className={modalContainerStyles().body()}
                            onSubmit={(event) => {
                                if (isValid) {
                                    setIsOpen(false);
                                }
                                handleSubmit(event);
                            }}
                        >
                            <div className="flex flex-col gap-4">
                                <Controller
                                    control={control}
                                    name="amount"
                                    render={({ field, fieldState: { error } }) => {
                                        return (
                                            <NumberField
                                                autoFocus
                                                label="Amount"
                                                {...field}
                                                onChange={(value) => {
                                                    field.onChange(isNaN(value) ? 0 : value);
                                                }}
                                                isInvalid={!!error?.message}
                                                errorMessage={error?.message}
                                            />
                                        );
                                    }}
                                />

                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            label="Description"
                                            {...field}
                                            isInvalid={!!error?.message}
                                            errorMessage={error?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div className="mt-8 flex gap-4">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    type="button"
                                    onPress={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button className="flex-1" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
}
