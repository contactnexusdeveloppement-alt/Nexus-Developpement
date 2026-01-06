import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
}

/**
 * ProtectedRoute component to restrict access based on user roles
 * Redirects unauthorized users to appropriate pages
 */
export const ProtectedRoute = ({
    children,
    allowedRoles,
    redirectTo,
}: ProtectedRouteProps) => {
    const { role, loading } = useUserRole();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!role) {
        // Not authenticated at all
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        // Authenticated but wrong role - redirect to appropriate dashboard
        if (redirectTo) {
            return <Navigate to={redirectTo} replace />;
        }

        // Default redirects based on role
        if (role === 'admin') {
            return <Navigate to="/nx-panel-8f4a/dashboard" replace />;
        }
        if (role === 'sales') {
            return <Navigate to="/sales/dashboard" replace />;
        }

        // Fallback
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
