import { keyBy } from 'lodash-es';
import type { Expense } from '~/db/types';
import { expenseCategories, getTagColors } from '../resources.expenses/constants';
import { cn } from '~/utils';

export type CategoryTagProps = {
    category: Expense['category'];
};

const categoryMap = keyBy(expenseCategories, 'value');

export default function CategoryTag({ category }: CategoryTagProps) {
    const { Icon } = categoryMap[category]!;

    return (
        <span
            className={cn(
                'flex h-8 w-8 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                getTagColors(category)
            )}
        >
            <Icon size={16} />
        </span>
    );
}
