import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';
import ariaComponentPlugin from 'tailwindcss-react-aria-components';

export default {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            serif: ['Open Sans   Variable', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
        },
        extend: {},
    },
    plugins: [ariaComponentPlugin, animatePlugin],
} satisfies Config;
