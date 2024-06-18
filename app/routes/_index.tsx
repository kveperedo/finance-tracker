import { redirect } from '@vercel/remix';

export function loader() {
    return redirect('/expenses/summary');
}
