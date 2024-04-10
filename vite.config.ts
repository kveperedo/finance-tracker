import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import { vercelPreset } from '@vercel/remix/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { remixPWA } from '@remix-pwa/dev';

installGlobals();

export default defineConfig({
    plugins: [remix({ presets: [vercelPreset()] }), tsconfigPaths(), remixPWA()],
});
