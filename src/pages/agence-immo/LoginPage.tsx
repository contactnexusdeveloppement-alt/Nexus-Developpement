import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/agence-immo/layout/Header';
import Footer from '../../components/agence-immo/layout/Footer';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation of login
        if (email && password) {
            alert('Connexion réussie ! (Simulation)');
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header forceSolid={true} />

            <main className="flex-grow flex items-center justify-center py-20 px-4 bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-black-rich text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-black-rich mb-2">Bienvenue</h1>
                        <p className="text-gray-500">Connectez-vous à votre espace personnel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-gold" />
                                <span className="text-gray-600">Se souvenir de moi</span>
                            </label>
                            <button type="button" className="text-gold hover:text-black-rich transition-colors font-medium">
                                Mot de passe oublié ?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-black-rich text-white font-bold rounded-md hover:bg-gold transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <span>SE CONNECTER</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Pas encore de compte ?{' '}
                        <button className="text-gold font-bold hover:underline">
                            Créer un compte
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
