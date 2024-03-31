import { Outlet } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@vercel/remix';
import { getUserId } from '~/auth/session.server';
import Header from '~/components/header';
import { redirectToLogin } from '~/utils.server';

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        return redirectToLogin(request);
    }

    return null;
}

export default function AppLayoutPage() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
