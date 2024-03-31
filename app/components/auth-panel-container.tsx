import type { PropsWithChildren } from 'react';

type AuthPanelContainerProps = PropsWithChildren<{
    header: string;
}>;

export default function AuthPanelContainer({ children, header }: AuthPanelContainerProps) {
    return (
        <div className="m-4 w-full border border-black bg-white shadow-lg sm:w-96">
            <div className="flex items-center justify-between border-b border-black bg-stone-100 p-4">
                <p className="text-xl">{header}</p>
            </div>
            {children}
        </div>
    );
}
