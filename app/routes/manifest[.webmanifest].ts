import type { WebAppManifest } from '@remix-pwa/dev';
import { json } from '@vercel/remix';

export const loader = () => {
    return json(
        {
            short_name: 'Finance Tracker',
            name: 'KP Finance Tracker',
            start_url: '/',
            display: 'standalone',
            background_color: '#d3d7dd',
            theme_color: '#c34138',
            icons: [
                {
                    src: '/logo.png',
                    type: 'image/png',
                    sizes: '144x144',
                },
            ],
            screenshots: [
                {
                    src: '/screenshot.png',
                    sizes: '2834x1346',
                    type: 'image/png',
                    form_factor: 'wide',
                    label: 'Finance Tracker',
                },
                {
                    src: '/screenshot-mobile.png',
                    sizes: '466x946',
                    type: 'image/png',
                    form_factor: 'narrow',
                    label: 'Finance Tracker',
                },
            ],
        } as WebAppManifest,
        {
            headers: {
                'Cache-Control': 'public, max-age=600',
                'Content-Type': 'application/manifest+json',
            },
        }
    );
};
