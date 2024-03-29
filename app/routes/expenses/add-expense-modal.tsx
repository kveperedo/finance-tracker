import { ListPlus, X } from 'lucide-react';
import {
    Dialog,
    DialogTrigger,
    Heading,
    Modal,
    ModalOverlay,
} from 'react-aria-components';
import { cn } from '~/utils';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '~/components/text-field';
import { useEffect, useState } from 'react';
import Button from '~/components/button';
import NumberField from '~/components/number-field';
import type { AddExpenseInput } from './schema';
import { addExpenseSchema } from './schema';

type AddExpenseModalProps = {
    onSubmit: (data: AddExpenseInput) => void;
};

export default function AddExpenseModal({ onSubmit }: AddExpenseModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { control, handleSubmit, reset } = useForm<AddExpenseInput>({
        resolver: zodResolver(addExpenseSchema),
        defaultValues: {
            description: '',
            amount: 0,
        },
    });

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
            <Button color="lime" leftIcon={<ListPlus size={20} />}>
                Add Expense
            </Button>
            <ModalOverlay
                isDismissable
                className={({ isEntering }) =>
                    cn(
                        'fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/50 text-center backdrop-blur-sm',
                        isEntering && 'duration-300 ease-out animate-in fade-in'
                    )
                }>
                <Modal className="m-4 w-full border border-black bg-white sm:w-96">
                    <Dialog>
                        <div className="relative flex items-center justify-between border-b border-black bg-stone-100 p-4">
                            <Heading className="text-xl" slot="title">
                                Add Expenses
                            </Heading>

                            <Button
                                className="border-0 p-1 "
                                onPress={() => setIsOpen(false)}>
                                <X />
                            </Button>
                        </div>

                        <form
                            className="p-4"
                            onSubmit={handleSubmit((data) => {
                                setIsOpen(false);
                                onSubmit(data);
                            })}>
                            <div className="flex flex-col gap-4 py-2">
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({
                                        field,
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            autoFocus
                                            label="Description"
                                            {...field}
                                            isInvalid={!!error?.message}
                                            errorMessage={error?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="amount"
                                    render={({
                                        field,
                                        fieldState: { error },
                                    }) => {
                                        return (
                                            <NumberField
                                                label="Amount"
                                                {...field}
                                                onChange={(value) => {
                                                    field.onChange(
                                                        isNaN(value) ? 0 : value
                                                    );
                                                }}
                                                isInvalid={!!error?.message}
                                                errorMessage={error?.message}
                                            />
                                        );
                                    }}
                                />
                            </div>

                            <div className="mt-8 flex">
                                <Button
                                    type="button"
                                    color="stone"
                                    className="w-full border-r-0"
                                    onPress={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    color="purple">
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
