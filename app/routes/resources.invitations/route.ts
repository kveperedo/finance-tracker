import { redirect, type ActionFunctionArgs } from '@vercel/remix';
import { requireUserId } from '~/auth/session.server';
import { generateInvitationCode } from './queries';
import { withDelay } from '~/utils.server';
import { getUserRole } from '../_app.expenses/queries';

export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    const userRole = await getUserRole(userId);
    if (userRole !== 'admin') {
        throw redirect('/');
    }

    const invitationCode = await withDelay(generateInvitationCode());
    return invitationCode;
};
