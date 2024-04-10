import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import type { LinksFunction } from '@vercel/remix';
import stylesheet from '~/tailwind.css?url';

import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/open-sans';
import ProgressBar from './components/progress-bar';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html className="font-serif" lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="flex h-screen flex-col">
                <ProgressBar />
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
