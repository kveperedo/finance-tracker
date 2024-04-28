import { redirect } from '@vercel/remix';

export function redirectToLogin(request: Request) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);

    return redirect(`/login?${searchParams}`);
}

export async function withDelay<T>(func: Promise<T>, delay: number = 500): Promise<T> {
    const [result] = await Promise.allSettled([func, new Promise((resolve) => setTimeout(resolve, delay))]);

    if (result.status === 'rejected') {
        throw result.reason;
    }

    return result.value as T;
}
