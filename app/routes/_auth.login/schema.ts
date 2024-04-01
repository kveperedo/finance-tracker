import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { users } from '~/db/schema';

export const loginSchema = createSelectSchema(users, {
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email({
            message: 'Invalid email address',
        })
        .toLowerCase(),
    passwordHash: z.string({
        required_error: 'Password is required',
    }),
}).pick({
    email: true,
    passwordHash: true,
});

export type LoginInput = z.infer<typeof loginSchema>;
