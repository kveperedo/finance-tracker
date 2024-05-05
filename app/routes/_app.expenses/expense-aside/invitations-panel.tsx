import { useLoaderData } from '@remix-run/react';
import type { AccordionPanelProps } from '~/components/accordion-panel';
import AccordionPanel from '~/components/accordion-panel';
import type { loader } from '../route';
import Button from '~/components/button';
import { getFetcherStates } from '~/utils';
import { useFetcherWithReset } from '~/hooks/useFetcherWithReset';
import { useEffect } from 'react';

export default function InvitationsPanel(props: Pick<AccordionPanelProps, 'isOpen' | 'onToggle'>) {
    const fetcher = useFetcherWithReset<string>();
    const { reset } = fetcher;
    const { userRole } = useLoaderData<typeof loader>();
    const { isActionSubmitting, isActionLoading, isDone } = getFetcherStates(fetcher);
    const hasGeneratedLink = Boolean(isDone && fetcher.data);

    useEffect(() => {
        if (!isDone || !fetcher.data) {
            return;
        }

        const url = window.location.origin + '/register?invite=' + fetcher.data;
        navigator.clipboard.writeText(url);
        const id = setTimeout(reset, 4000);

        return () => clearTimeout(id);
    }, [isDone, fetcher.data, reset]);

    if (userRole !== 'admin') {
        return null;
    }

    return (
        <AccordionPanel title="Invitations" {...props}>
            <p className="text-sm">Want to invite other users? Generate an invite link now!</p>
            <fetcher.Form className="mt-4" action="/resources/invitations" method="POST">
                <Button
                    variant="secondary"
                    className="w-full"
                    type="submit"
                    isLoading={isActionSubmitting || isActionLoading}
                    isDisabled={hasGeneratedLink}
                >
                    {hasGeneratedLink ? 'Copied to clipboard!' : 'Generate invite link'}
                </Button>
            </fetcher.Form>
        </AccordionPanel>
    );
}
