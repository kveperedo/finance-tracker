import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';

export default {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            serif: ['Zilla Slab', 'serif'],
            mono: ['Source Code Pro', 'monospace'],
        },
        extend: {},
    },
    plugins: [animatePlugin],
} satisfies Config;
