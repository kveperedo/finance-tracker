import { CircleX, Search } from 'lucide-react';
import { SearchField } from 'react-aria-components';
import Button from '~/components/button';
import Input from '~/components/input';
import useExpenseSearchParams from './hooks/useExpenseSearchParams';

export default function ExpenseSearchField() {
    const [{ q }, actions] = useExpenseSearchParams();
    const search = q ?? '';

    return (
        <SearchField
            key={search}
            aria-label="Search expenses"
            className="group relative flex max-w-60 flex-1 items-center"
            defaultValue={search}
            onSubmit={(newSearch) => {
                actions.setParam('q', newSearch.toLowerCase());
            }}
            onClear={() => {
                actions.deleteParam('q');
            }}
        >
            <Search className="absolute left-0 ml-3 text-stone-500" size={16} />
            <Input className="px-10 [&::-webkit-search-cancel-button]:hidden" placeholder="Search expenses..." />
            <Button
                className="absolute right-0 mr-[6px] text-stone-500 group-empty:hidden"
                variant="tertiary"
                size="icon-sm"
            >
                <CircleX size={16} />
            </Button>
        </SearchField>
    );
}
