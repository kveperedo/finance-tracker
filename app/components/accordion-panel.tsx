import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useId, type PropsWithChildren } from 'react';
import { cn } from '~/utils';

export type AccordionPanelProps = PropsWithChildren<{
    title: string;
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}>;

export default function AccordionPanel({ title, children, isOpen, onToggle }: AccordionPanelProps) {
    const id = useId();

    console.log(isOpen);

    return (
        <Accordion
            className="rounded border border-stone-300 bg-white shadow-sm"
            type="single"
            collapsible
            value={isOpen ? id : ''}
            onValueChange={(value) => {
                onToggle(value === id);
            }}
        >
            <AccordionItem value={id}>
                <AccordionTrigger
                    className={cn(
                        'flex w-full cursor-pointer items-center justify-between border-b border-transparent p-4',
                        isOpen && 'border-stone-300'
                    )}
                >
                    <span className="text-sm font-medium">{title}</span>
                    <ChevronDown className={cn('transition-transform', isOpen && 'rotate-180')} size={16} />
                </AccordionTrigger>

                <AccordionContent className="p-4 animate-in fade-in data-[state=closed]:hidden data-[state=open]:slide-in-from-top-1">
                    {children}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
