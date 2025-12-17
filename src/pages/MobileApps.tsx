import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, CheckCircle, Wifi, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";

const MobileApps = () => {
    const navigate = useNavigate();
    const pricingPlans = pricingData.find(c => c.id === 'mobile')?.plans || [];

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <div className="fixed inset-0 z-0" aria-hidden="true">
                <AnimatedBackground />
            </div>

            <div className="relative z-10">
                <Navigation />

                <div className="container mx-auto px-4 py-32">
                    <Button
                        variant="ghost"
                        className="text-white hover:text-blue-400 mb-8 p-0 hover:bg-transparent"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
                    </Button>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        <div>
                            <div className="inline-flex p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 mb-6">
                                <Smartphone className="w-8 h-8 text-blue-300" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent">
                                Applications Mobiles
                            </h1>
                            <p className="text-xl text-blue-100/80 leading-relaxed mb-8">
                                Soyez présent dans la poche de vos clients 24/7. Nous développons des applications mobiles natives et hybrides (iOS & Android) offrant une expérience utilisateur fluide et engageante.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-blue-500/30 transition-all"
                            >
                                Lancer mon application
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                            <Card className="relative bg-black/40 border-blue-500/30 backdrop-blur-xl">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-white mb-6">La force du mobile</h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 items-start">
                                            <div className="bg-blue-500/20 p-2 rounded-lg"><Bell className="w-6 h-6 text-blue-400" /></div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">Notifications Push</h4>
                                                <p className="text-blue-200/70 text-sm">Gardez le contact et réengagez vos utilisateurs directement sur leur écran d'accueil.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="bg-blue-500/20 p-2 rounded-lg"><Wifi className="w-6 h-6 text-blue-400" /></div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">Mode Hors-Ligne</h4>
                                                <p className="text-blue-200/70 text-sm">Vos services restent accessibles même sans connexion internet.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div id="tarifs" className="mb-20">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent">
                                Tarifs Développement Mobile
                            </h2>
                            <p className="text-lg text-white/90">Des solutions adaptées à chaque phase de votre projet</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard key={index} plan={plan} index={index} />
                            ))}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
            <ChatBotWidget />
        </div>
    );
};

export default MobileApps;
