import type { Config } from 'tailwindcss';

export default {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            serif: ['Zilla Slab', 'serif'],
        },
        extend: {},
    },
    plugins: [],
} satisfies Config;
