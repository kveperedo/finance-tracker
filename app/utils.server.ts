import { redirect } from '@vercel/remix';

export function redirectToLogin(request: Request) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);

    return redirect(`/login?${searchParams}`);
}
