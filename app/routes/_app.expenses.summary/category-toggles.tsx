import { useLoaderData } from '@remix-run/react';
import type { loader } from './route';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import { keyBy } from 'lodash-es';
import { expenseCategories, getTagColors } from '../resources.expenses/constants';
import useExpenseSearchParams from '../_app.expenses/hooks/useExpenseSearchParams';
import { cn, focusRing, numberFormatter } from '~/utils';
import { FocusScope, useFocusManager } from 'react-aria';
import type { Expense } from '~/db/types';
import { useState } from 'react';

type CategoryToggleProps = {
    category: Expense['category'];
    total: number;
    isSelected: boolean;
    onChange: (isSelected: boolean) => void;
};

const CategoryToggle = ({ category, total, isSelected, onChange }: CategoryToggleProps) => {
    const { label } = categoryMap[category]!;
    const { bg, text } = getTagColors(category);
    const [, actions] = useExpenseSearchParams();
    const focusManager = useFocusManager();

    return (
        <AriaToggleButton
            key={category}
            isSelected={isSelected}
            className={({ isHovered, isFocusVisible, isPressed, isSelected }) =>
                cn(
                    focusRing({ isFocusVisible }),
                    'flex flex-1 flex-col items-center gap-2 px-2 py-4 transition-colors first:rounded-l-[3px] last:rounded-r-[3px]',
                    isHovered && bg.default,
                    isPressed && bg.isPressed,
                    isSelected && `${bg.isSelected} text-white shadow-inner`
                )
            }
            onKeyDown={(e) => {
                switch (e.key) {
                    case 'ArrowRight':
                        focusManager?.focusNext({ wrap: true });
                        break;
                    case 'ArrowLeft':
                        focusManager?.focusPrevious({ wrap: true });
                        break;
                    case 'Tab':
                        if (e.shiftKey) {
                            focusManager?.focusFirst();
                        } else {
                            focusManager?.focusLast();
                        }
                }
            }}
            onChange={(isSelected) => {
                if (!isSelected) {
                    actions.deleteParam('category');
                } else {
                    actions.setParam('category', category);
                }
                onChange(isSelected);
            }}
        >
            {({ isPressed }) => (
                <>
                    <p
                        className={cn(
                            'rounded px-2 py-1 text-center text-sm',
                            bg.default,
                            text.default,
                            isSelected && 'bg-transparent text-white',
                            isPressed && 'bg-transparent'
                        )}
                    >
                        {label}
                    </p>
                    <p className={cn('flex items-baseline gap-1 rounded text-sm font-semibold')}>
                        <span className="text-xs font-normal">PHP</span>
                        {numberFormatter.format(total)}
                    </p>
                </>
            )}
        </AriaToggleButton>
    );
};

const categoryMap = keyBy(expenseCategories, 'value');

export const CategoryToggles = () => {
    const { expensesByCategory } = useLoaderData<typeof loader>();
    const [{ category: selectedCategory }] = useExpenseSearchParams();
    const [optimisticCategory, setOptimisticCategory] = useState(selectedCategory);

    return (
        <FocusScope>
            <div className="flex items-center justify-between divide-x divide-stone-100 rounded border border-stone-300 bg-white shadow-sm">
                {expensesByCategory.map(({ total, category }) => (
                    <CategoryToggle
                        key={category}
                        category={category}
                        total={total}
                        isSelected={optimisticCategory === category}
                        onChange={(isSelected) => {
                            setOptimisticCategory(isSelected ? category : null);
                        }}
                    />
                ))}
            </div>
        </FocusScope>
    );
};
