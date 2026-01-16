import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InviteUserData {
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'sales';
    phone?: string;
}

/**
 * Invite a new user to the platform
 * This calls the invite-team-member Edge Function which manages the full invitation flow
 */
export const inviteUser = async (userData: InviteUserData): Promise<{ success: boolean; error?: string }> => {
    try {
        // Call the new invite-team-member Edge Function
        // This function handles:
        // 1. Verifying admin permissions
        // 2. Generating the invite link
        // 3. Creating the user profile
        // 4. Sending the email via Resend

        // Ensure session exists
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');

        const { data, error } = await supabase.functions.invoke('invite-team-member', {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
            body: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                phone: userData.phone || null,
                // Commission rate could be added here if the form supports it
                redirectUrl: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Edge function error:', error);
            throw new Error(error.message || 'Échec de l\'invitation');
        }

        // The Edge Function might return error in body even if status is 200 (though we try to use status codes)
        if (data?.error) {
            throw new Error(data.error);
        }

        toast.success(`Invitation envoyée à ${userData.email}. L'utilisateur recevra un email pour créer son mot de passe.`);
        return { success: true };

    } catch (error) {
        let errorMessage = 'Échec de l\'invitation';

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        // Try to handle Supabase Edge Function error structure specifically
        // @ts-ignore - Supabase types might verify this dynamically
        if (error?.context?.json) {
            try {
                // @ts-ignore
                const body = await error.context.json();
                if (body && body.error) {
                    errorMessage = body.error;
                }
            } catch (e) {
                // Keep default message
            }
        }

        toast.error(errorMessage);
        console.error('Error inviting user:', error);
        return { success: false, error: errorMessage };
    }
};
