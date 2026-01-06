import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user' | 'sales';

interface UseUserRoleReturn {
    role: UserRole | null;
    isAdmin: boolean;
    isSales: boolean;
    isUser: boolean;
    loading: boolean;
    error: Error | null;
}

/**
 * Hook to get the current user's role from the user_roles table
 */
export const useUserRole = (): UseUserRoleReturn => {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setRole(null);
                    setLoading(false);
                    return;
                }

                const { data, error: roleError } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();

                if (roleError) {
                    // PGRST116 = Row not found, this is normal for new users without role
                    if (roleError.code !== 'PGRST116') {
                        throw roleError;
                    }
                    setRole(null);
                    setLoading(false);
                    return;
                }

                setRole(data?.role as UserRole || null);
            } catch (err) {
                // Only log unexpected errors, not normal "no role" cases
                if (err && typeof err === 'object' && 'code' in err && err.code !== 'PGRST116') {
                    console.error('Error fetching user role:', err);
                    setError(err instanceof Error ? err : new Error('Failed to fetch user role'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchUserRole();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        role,
        isAdmin: role === 'admin',
        isSales: role === 'sales',
        isUser: role === 'user',
        loading,
        error,
    };
};
