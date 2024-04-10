import type { PopoverProps as AriaPopoverProps } from 'react-aria-components';
import { OverlayArrow, Popover as AriaPopover, composeRenderProps } from 'react-aria-components';
import React from 'react';
import { tv } from 'tailwind-variants';

export interface PopoverProps extends Omit<AriaPopoverProps, 'children'> {
    showArrow?: boolean;
    children: React.ReactNode;
}

const popoverStyles = tv({
    base: 'rounded border border-stone-300 bg-white bg-clip-padding text-slate-700 shadow-2xl outline-none',
    variants: {
        isEntering: {
            true: 'duration-200 ease-out animate-in fade-in placement-left:slide-in-from-right-1 placement-right:slide-in-from-left-1 placement-top:slide-in-from-bottom-1 placement-bottom:slide-in-from-top-1',
        },
        isExiting: {
            true: 'duration-150 ease-in animate-out fade-out placement-left:slide-out-to-right-1 placement-right:slide-out-to-left-1 placement-top:slide-out-to-bottom-1 placement-bottom:slide-out-to-top-1',
        },
    },
});

export default function Popover({ children, showArrow, className, ...props }: PopoverProps) {
    return (
        <AriaPopover
            offset={showArrow ? 12 : 8}
            {...props}
            className={composeRenderProps(className, (className, renderProps) =>
                popoverStyles({ ...renderProps, className })
            )}>
            {showArrow && (
                <OverlayArrow className="group">
                    <svg
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        className="block fill-white stroke-stone-300 stroke-1 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180">
                        <path d="M0 0 L6 6 L12 0" />
                    </svg>
                </OverlayArrow>
            )}
            {children}
        </AriaPopover>
    );
}
