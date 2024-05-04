import { createCookie } from '@vercel/remix';

export const userPreferencesCookie = createCookie('user-prefs', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
});
