import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { users } from '~/db/schema';

export const registerSchema = createSelectSchema(users, {
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email({
            message: 'Invalid email address',
        }),
    passwordHash: z
        .string({
            required_error: 'Password is required',
        })
        .min(8, {
            message: 'Password must be at least 8 characters',
        }),
})
    .pick({
        email: true,
        passwordHash: true,
    })
    .extend({
        confirmPasswordHash: z.string({
            required_error: 'Confirm password is required',
        }),
    })
    .refine((data) => data.passwordHash === data.confirmPasswordHash, {
        message: 'Passwords do not match',
        path: ['confirmPasswordHash'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;
