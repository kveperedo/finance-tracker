import { ListPlus, X } from 'lucide-react';
import { Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { useCallback, useState } from 'react';
import Button from '~/components/button';
import { cn } from '~/utils';
import { modalContainerStyles } from '~/components/modal-container';
import ExpenseForm, { EXPENSE_FETCHER_KEY } from '../resources.expenses/expense-form';
import { useFetcher } from '@remix-run/react';

export default function AddExpenseModal() {
    const [isOpen, setIsOpen] = useState(false);
    const fetcher = useFetcher({ key: EXPENSE_FETCHER_KEY });

    const handleSubmitSuccess = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button size="icon">
                <ListPlus size={16} />
            </Button>
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

                        <div className={modalContainerStyles().body()}>
                            <ExpenseForm fetcher={fetcher} autoFocus onSubmitSuccess={handleSubmitSuccess}>
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
                            </ExpenseForm>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
}
