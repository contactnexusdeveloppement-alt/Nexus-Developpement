import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, CheckCircle, Workflow, Database, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";

const Automation = () => {
    const navigate = useNavigate();
    const pricingPlans = pricingData.find(c => c.id === 'automatisation')?.plans || [];

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
                                <Zap className="w-8 h-8 text-blue-300" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent">
                                Automatisation
                            </h1>
                            <p className="text-xl text-blue-100/80 leading-relaxed mb-8">
                                L'automatisation consiste à connecter vos outils (emails, CRM, tableurs) pour qu'ils travaillent ensemble sans intervention humaine. Libérez-vous des tâches répétitives.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => document.getElementById('exemples')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-blue-500/30 transition-all"
                            >
                                Voir des exemples concrets
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                            <Card className="relative bg-black/40 border-blue-500/30 backdrop-blur-xl">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-white mb-6">Pourquoi automatiser ?</h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 items-start">
                                            <div className="bg-blue-500/20 p-2 rounded-lg"><Workflow className="w-6 h-6 text-blue-400" /></div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">Connexion entre outils</h4>
                                                <p className="text-blue-200/70 text-sm">Faites dialoguer votre site web, votre CRM et votre boite mail automatiquement.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="bg-blue-500/20 p-2 rounded-lg"><CheckCircle className="w-6 h-6 text-blue-400" /></div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">Zéro erreur humaine</h4>
                                                <p className="text-blue-200/70 text-sm">Les robots ne font pas de fautes de frappe et n'oublient jamais d'envoyer un mail.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div id="exemples" className="mb-24">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Exemples concrets d'automatisation</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="bg-white/5 border-blue-500/20">
                                <CardContent className="p-6">
                                    <Mail className="w-10 h-10 text-blue-400 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Gestion de Leads</h3>
                                    <p className="text-blue-100/70">Un client remplit un formulaire sur votre site ➜ Il est ajouté automatiquement dans votre CRM ➜ Un email de bienvenue personnalisé lui est envoyé instantanément.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-blue-500/20">
                                <CardContent className="p-6">
                                    <Database className="w-10 h-10 text-cyan-400 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Facturation</h3>
                                    <p className="text-blue-100/70">Une vente est réalisée ➜ La facture est générée automatiquement ➜ Elle est envoyée au client et archivée dans votre comptabilité sans aucun clic.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-blue-500/20">
                                <CardContent className="p-6">
                                    <Workflow className="w-10 h-10 text-purple-400 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Onboarding Client</h3>
                                    <p className="text-blue-100/70">Nouveau contrat signé ➜ Création automatique des accès projet ➜ Envoi des documents contractuels ➜ Planification automatique du rendez-vous de lancement.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div id="tarifs" className="mb-20">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent">
                                Nos Forfaits
                            </h2>
                            <p className="text-lg text-white/90">Gagnez du temps dès aujourd'hui</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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

export default Automation;
