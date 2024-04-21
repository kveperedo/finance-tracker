import { ListPlus } from 'lucide-react';
import { DialogTrigger } from 'react-aria-components';
import { useCallback, useState } from 'react';
import Button from '~/components/button';
import ExpenseForm, { FETCHER_KEY } from '../resources.expenses/expense-form';
import { useFetcher } from '@remix-run/react';
import Modal from '~/components/modal';

export default function AddExpenseModal() {
    const [isOpen, setIsOpen] = useState(false);
    const fetcher = useFetcher({ key: FETCHER_KEY.ADD });

    const handleSubmitSuccess = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button size="icon">
                <ListPlus size={16} />
            </Button>
            <Modal title="Add Expense">
                <ExpenseForm fetcher={fetcher} autoFocus onSubmitSuccess={handleSubmitSuccess}>
                    <div className="mt-8 flex gap-4">
                        <Button variant="secondary" className="flex-1" type="button" onPress={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">
                            Submit
                        </Button>
                    </div>
                </ExpenseForm>
            </Modal>
        </DialogTrigger>
    );
}
