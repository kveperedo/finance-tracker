import { redirect, type ActionFunctionArgs } from '@vercel/remix';
import { logout } from '~/auth/session.server';

export async function action({ request }: ActionFunctionArgs) {
    return logout(request);
}

export function loader() {
    return redirect('/');
}
