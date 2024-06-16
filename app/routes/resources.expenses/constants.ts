import type { LucideProps } from 'lucide-react';
import { Car, Folder, Gamepad, HeartPulse, Home, ShoppingCart, Utensils } from 'lucide-react';
import type { Expense } from '~/db/types';
import { tw } from '~/utils';

type ExpenseCategory = Expense['category'];

export const expenseCategories: Array<{
    value: ExpenseCategory;
    label: string;
    Icon: React.ComponentType<LucideProps>;
}> = [
    { value: 'housing', label: 'Housing', Icon: Home },
    { value: 'groceries', label: 'Groceries', Icon: ShoppingCart },
    { value: 'food', label: 'Food', Icon: Utensils },
    { value: 'transport', label: 'Transport', Icon: Car },
    { value: 'entertainment', label: 'Entertainment', Icon: Gamepad },
    { value: 'personal-care', label: 'Personal Care', Icon: HeartPulse },
    { value: 'others', label: 'Others', Icon: Folder },
];

export const getTagColors = (category: Expense['category']) => {
    switch (category) {
        case 'housing':
            return tw('bg-blue-50 text-blue-500');
        case 'food':
            return tw('bg-green-50 text-green-500');
        case 'groceries':
            return tw('bg-orange-50 text-orange-500');
        case 'transport':
            return tw('bg-cyan-50 text-cyan-500');
        case 'personal-care':
            return tw('bg-purple-50 text-purple-500');
        case 'entertainment':
            return tw('bg-pink-50 text-pink-500');
        case 'others':
        default:
            return tw('bg-gray-50 text-gray-500');
    }
};
