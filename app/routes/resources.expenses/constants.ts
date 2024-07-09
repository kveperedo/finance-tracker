import type { LucideProps } from 'lucide-react';
import { Car, Folder, Gamepad, HeartPulse, Home, ShoppingCart, Utensils } from 'lucide-react';
import type { Expense } from '~/db/types';

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
            return {
                bg: { default: 'bg-teal-50', isPressed: 'bg-teal-100', isSelected: 'bg-teal-400' },
                text: { default: 'text-teal-500' },
            };
        case 'food':
            return {
                bg: { default: 'bg-green-50', isPressed: 'bg-green-100', isSelected: 'bg-green-400' },
                text: { default: 'text-green-500' },
            };
        case 'groceries':
            return {
                bg: { default: 'bg-orange-50', isPressed: 'bg-orange-100', isSelected: 'bg-orange-400' },
                text: { default: 'text-orange-500' },
            };
        case 'transport':
            return {
                bg: { default: 'bg-blue-50', isPressed: 'bg-blue-100', isSelected: 'bg-blue-400' },
                text: { default: 'text-blue-500' },
            };
        case 'personal-care':
            return {
                bg: { default: 'bg-purple-50', isPressed: 'bg-purple-100', isSelected: 'bg-purple-400' },
                text: { default: 'text-purple-500' },
            };
        case 'entertainment':
            return {
                bg: { default: 'bg-pink-50', isPressed: 'bg-pink-100', isSelected: 'bg-pink-400' },
                text: { default: 'text-pink-500' },
            };
        case 'others':
        default:
            return {
                bg: { default: 'bg-gray-50', isPressed: 'bg-gray-100', isSelected: 'bg-gray-400' },
                text: { default: 'text-gray-500' },
            };
    }
};
