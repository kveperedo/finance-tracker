import { z } from 'zod';

export const loginUserSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
    }),
    password: z.string({
        required_error: 'Password is required',
    }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

loginUserSchema.extend({
    passwordConfirmation: z.string({
        required_error: 'Password confirmation is required',
    }),
});

export const registerUserSchema = loginUserSchema
    .extend({
        passwordConfirmation: z.string({
            required_error: 'Password confirmation is required',
        }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
    });

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
