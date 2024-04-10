import { Loader } from 'lucide-react';
import { Controller } from 'react-hook-form';
import Button from '~/components/button';
import TextField from '~/components/text-field';
import type { LoginInput } from './schema';
import { loginSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { json, redirect } from '@vercel/remix';
import type { SerializeFrom, ActionFunctionArgs } from '@vercel/remix';
import { createUserSession, getUser, login } from '~/auth/session.server';
import { useRemixForm, getValidatedFormData } from 'remix-hook-form';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import ModalContainer from '~/components/modal-container';

type ServerError = { errorType: 'invalidCredentials' };
const isServerError = (actionData: SerializeFrom<typeof action>): actionData is ServerError => {
    return Boolean((actionData as any).errorType);
};

export async function action({ request }: ActionFunctionArgs) {
    const {
        data,
        errors,
        receivedValues: defaultValues,
    } = await getValidatedFormData<LoginInput>(request, zodResolver(loginSchema));
    if (errors) {
        return json({ errors, defaultValues }, { status: 400 });
    }

    const user = await login({
        email: data.email,
        password: data.passwordHash,
    });
    if (!user) {
        return json({ errorType: 'invalidCredentials' } as const, {
            status: 401,
        });
    }

    const redirectTo = new URL(request.url).searchParams.get('redirectTo') ?? '/';

    return createUserSession(user.id, redirectTo);
}

export async function loader({ request }: ActionFunctionArgs) {
    const user = await getUser(request);

    if (user) {
        return redirect('/');
    }

    return null;
}

export default function LoginPage() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const [serverError, setServerError] = useState<string | null>(null);
    const { control, handleSubmit } = useRemixForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });
    const isSubmitting = navigation.formData && (navigation.state === 'submitting' || navigation.state === 'loading');

    const resetServerError = () => {
        if (serverError) {
            setServerError(null);
        }
    };

    useEffect(
        function syncServerError() {
            if (!actionData) {
                return;
            }

            if (isServerError(actionData) && actionData.errorType === 'invalidCredentials') {
                setServerError('Invalid email or password');
            }
        },
        [actionData]
    );

    return (
        <main className="flex h-full items-center justify-center bg-stone-100">
            <ModalContainer header="Login">
                <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                onKeyDown={resetServerError}
                                label="Email"
                                autoFocus
                                isInvalid={!!error?.message}
                                errorMessage={error?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="passwordHash"
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                onKeyDown={resetServerError}
                                label="Password"
                                type="password"
                                isInvalid={Boolean(serverError) ?? !!error?.message}
                                errorMessage={serverError ?? error?.message}
                            />
                        )}
                    />

                    <Button
                        isDisabled={isSubmitting}
                        type="submit"
                        className="mt-4"
                        leftIcon={isSubmitting && <Loader className="animate-spin" size={16} />}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>

                <p className="pt-4 text-sm text-stone-500">
                    Don't have an account?{' '}
                    <Link prefetch="intent" to="/register" className="text-stone-700 underline">
                        Sign up
                    </Link>
                </p>
            </ModalContainer>
        </main>
    );
}
