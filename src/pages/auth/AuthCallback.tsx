import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Check, AlertCircle, Lock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedBackground from '@/components/AnimatedBackground';

// Helper function to get the appropriate dashboard based on user role
const getRedirectPath = async (userId: string): Promise<string> => {
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

    const role = roleData?.role;

    if (role === 'admin') {
        return '/nx-panel-8f4a/dashboard';
    } else if (role === 'sales') {
        return '/sales/dashboard';
    }

    // Default fallback
    return '/sales/dashboard';
};

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [settingPassword, setSettingPassword] = useState(false);

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Check for error in URL params
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (errorParam) {
                    throw new Error(errorDescription || 'Authentication error');
                }

                // Check for type in URL hash first (Supabase sends tokens in hash)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const typeFromHash = hashParams.get('type');
                const typeFromQuery = searchParams.get('type');
                const inviteType = typeFromHash || typeFromQuery;

                console.log('Auth callback - type from hash:', typeFromHash, 'type from query:', typeFromQuery);

                // Check if there are tokens in the hash that need to be processed
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    // Set the session from hash tokens
                    const { error: setSessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (setSessionError) {
                        throw setSessionError;
                    }

                    console.log('Session set from hash tokens, type:', inviteType);

                    // For invite or recovery, show password form
                    if (inviteType === 'invite' || inviteType === 'recovery' || inviteType === 'magiclink' || inviteType === 'signup') {
                        setShowPasswordForm(true);
                        setLoading(false);
                        return;
                    }
                }

                // Get the current session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    throw sessionError;
                }

                if (session) {
                    // Check if this is an invited user who needs to set password
                    // Supabase invited users have email_confirmed_at but may not have a password yet
                    const needsPassword = inviteType === 'invite' || inviteType === 'recovery' || inviteType === 'magiclink' || inviteType === 'signup';

                    if (needsPassword) {
                        setShowPasswordForm(true);
                        setLoading(false);
                    } else {
                        // Regular login, redirect based on role
                        toast.success('Connexion réussie !');
                        const redirectPath = await getRedirectPath(session.user.id);
                        navigate(redirectPath);
                    }
                } else {
                    throw new Error('Session invalide. Veuillez demander une nouvelle invitation.');
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
                setLoading(false);
            }
        };

        handleAuthCallback();
    }, [navigate, searchParams]);

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setSettingPassword(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                throw updateError;
            }

            toast.success('Mot de passe créé avec succès !');

            // Get user and redirect based on role
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const redirectPath = await getRedirectPath(user.id);
                navigate(redirectPath);
            } else {
                navigate('/sales/dashboard');
            }
        } catch (err) {
            console.error('Password update error:', err);
            toast.error(err instanceof Error ? err.message : 'Échec de la mise à jour du mot de passe');
        } finally {
            setSettingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center p-4">
                <AnimatedBackground />
                <div className="relative z-10 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-white/80">Authentification en cours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen relative flex items-center justify-center p-4">
                <AnimatedBackground />
                <Card className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-md border-red-500/30">
                    <CardHeader className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                        <CardTitle className="text-red-400">Erreur d'authentification</CardTitle>
                        <CardDescription className="text-gray-300">{error}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button
                            onClick={() => navigate('/nx-panel-8f4a')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                            Retour à la connexion
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (showPasswordForm) {
        return (
            <div className="min-h-screen relative flex items-center justify-center p-4">
                <AnimatedBackground />
                <Card className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-md border-blue-500/30">
                    <CardHeader className="space-y-1">
                        <div className="mx-auto p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-2">
                            <KeyRound className="h-8 w-8 text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl text-center text-white">Créez votre mot de passe</CardTitle>
                        <CardDescription className="text-center text-gray-300">
                            Bienvenue chez Nexus Développement ! Définissez un mot de passe sécurisé pour accéder à votre espace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-200">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 6 caractères"
                                        className="pl-10 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-200">Confirmer le mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Répétez le mot de passe"
                                        className="pl-10 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-400"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                disabled={settingPassword}
                            >
                                {settingPassword ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Configuration...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Créer mon compte
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
