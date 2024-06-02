import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import type { LinksFunction } from '@vercel/remix';
import { ManifestLink } from '@remix-pwa/sw';
import stylesheet from '~/tailwind.css?url';

import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/open-sans';
import ProgressBar from './components/progress-bar';
import { useEffect, useState } from 'react';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
    {
        rel: 'icon',
        href: '/logo.png',
        type: 'image/png',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const [metaTagContent, setMetaTagContent] = useState('width=device-width, initial-scale=1');

    useEffect(() => {
        if (navigator.userAgent.indexOf('iPhone') > -1) {
            setMetaTagContent('width=device-width, initial-scale=1, maximum-scale=1');
        }
    }, []);

    return (
        <html className="font-serif" lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content={metaTagContent} />
                <Meta />
                <ManifestLink />
                <Links />
            </head>
            <body className="flex h-screen flex-col bg-stone-50">
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
