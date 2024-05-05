import { z } from 'zod';

export const userPreferencesSchema = z.object({
    showAddExpensePanel: z.boolean().optional(),
    showSavingsPanel: z.boolean().optional(),
    showInvitationsPanel: z.boolean().optional(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type UserPreferenceKey = keyof UserPreferences;
