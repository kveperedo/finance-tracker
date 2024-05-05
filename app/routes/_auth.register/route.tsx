import { Form } from 'react-aria-components';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import ModalContainer from '~/components/modal-container';
import type { RegisterInput } from './schema';
import { registerSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import TextField from '~/components/text-field';
import Button from '~/components/button';
import { Link, useActionData, useNavigation } from '@remix-run/react';
import { Loader } from 'lucide-react';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, SerializeFrom } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import db from '~/db';
import { users } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { createUserSession, register } from '~/auth/session.server';
import { useEffect, useState } from 'react';
import { validateInvitationCode } from '../resources.invitations/queries';

type ServerError = { errorType: 'accountExists' | 'unknownError' };
const isServerError = (actionData: SerializeFrom<typeof action>): actionData is ServerError => {
    return Boolean((actionData as any).errorType);
};

export const meta: MetaFunction = () => {
    return [
        { title: 'Register' },
        {
            name: 'description',
            content: 'Register for an account',
        },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const params = new URL(request.url).searchParams;
    const invitationCode = params.get('invite');
    if (!invitationCode) {
        throw redirect('/login');
    }

    const isValidInvitationCode = await validateInvitationCode(invitationCode);
    if (!isValidInvitationCode) {
        throw redirect('/login');
    }

    return { ok: true };
}

export async function action({ request }: ActionFunctionArgs) {
    const params = new URL(request.url).searchParams;
    const invitationCode = params.get('invite');
    if (!invitationCode) {
        throw redirect('/login');
    }

    const {
        data,
        errors,
        receivedValues: defaultValues,
    } = await getValidatedFormData<RegisterInput>(request, zodResolver(registerSchema));
    if (errors) {
        return json({ errors, defaultValues }, { status: 400 });
    }

    const result = await db.select().from(users).where(eq(users.email, data.email));
    const accountExists = Boolean(result[0]);
    if (accountExists) {
        return json({ errorType: 'accountExists' } as ServerError, {
            status: 400,
        });
    }

    const user = await register({ email: data.email, password: data.passwordHash, invitationCode: invitationCode });
    if (!user) {
        return json({ errorType: 'unknownError' } as ServerError, {
            status: 500,
        });
    }

    return createUserSession(user?.id, '/');
}

export default function RegisterPage() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.formData && (navigation.state === 'submitting' || navigation.state === 'loading');
    const { control, handleSubmit } = useRemixForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(
        function syncServerError() {
            if (!actionData) {
                return;
            }

            if (isServerError(actionData)) {
                switch (actionData.errorType) {
                    case 'accountExists':
                        setServerError('An account with that email already exists.');
                        break;
                    case 'unknownError':
                        setServerError('An unknown error occurred. Please try again.');
                        break;
                }
            }
        },
        [actionData]
    );

    return (
        <main className="flex h-full items-center justify-center bg-stone-100">
            <ModalContainer header="Register">
                <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                onKeyDown={() => setServerError(null)}
                                label="Email"
                                autoFocus
                                isInvalid={Boolean(serverError) ?? !!error?.message}
                                errorMessage={serverError ?? error?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="passwordHash"
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label="Password"
                                type="password"
                                isInvalid={!!error?.message}
                                errorMessage={error?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirmPasswordHash"
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label="Confirm Password"
                                type="password"
                                isInvalid={!!error?.message}
                                errorMessage={error?.message}
                            />
                        )}
                    />

                    <Button
                        isDisabled={isSubmitting}
                        type="submit"
                        className="mt-4"
                        leftIcon={isSubmitting && <Loader className="animate-spin" size={20} />}
                    >
                        {isSubmitting ? 'Registering account...' : 'Register account'}
                    </Button>
                </Form>

                <p className="pt-4 text-sm text-stone-500">
                    Already have an account?{' '}
                    <Link prefetch="intent" to="/login" className="text-stone-700 underline">
                        Login
                    </Link>
                </p>
            </ModalContainer>
        </main>
    );
}
