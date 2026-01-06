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
 * This calls the invite-user Edge Function which uses inviteUserByEmail
 * to send a proper invitation email with a password setup link
 */
export const inviteUser = async (userData: InviteUserData): Promise<{ success: boolean; error?: string }> => {
    try {
        // Get current session for authorization
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('Vous devez être connecté pour inviter des utilisateurs');
        }

        // Call the invite-user Edge Function with explicit Authorization header
        const { data, error } = await supabase.functions.invoke('invite-user', {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
            body: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                phone: userData.phone || null,
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Edge function error:', error);
            throw new Error(error.message || 'Échec de l\'invitation');
        }

        if (!data?.success) {
            throw new Error(data?.error || 'Échec de l\'invitation');
        }

        toast.success(`Invitation envoyée à ${userData.email}. L'utilisateur recevra un email pour créer son mot de passe.`);
        return { success: true };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Échec de l\'invitation';
        toast.error(errorMessage);
        console.error('Error inviting user:', error);
        return { success: false, error: errorMessage };
    }
};
