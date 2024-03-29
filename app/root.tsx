import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import type { LinksFunction } from '@vercel/remix';
import stylesheet from '~/tailwind.css?url';

import '@fontsource/zilla-slab';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html className="bg-gray-900 font-serif text-white" lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="h-screen">
                {children}
                <ScrollRestoration />
                <Scripts />
                <Analytics />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
