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
import '@fontsource-variable/source-code-pro';

import Header from './components/header';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html className="font-serif" lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="flex h-screen flex-col overflow-hidden">
                {children}
                <ScrollRestoration />
                <Scripts />
                <Analytics />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
