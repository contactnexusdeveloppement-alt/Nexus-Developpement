import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, CheckCircle, Workflow, Database, Mail, Clock, ShieldCheck, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const Automation = () => {
    const navigate = useNavigate();
    const pricingPlans = pricingData.find(c => c.id === 'automatisation')?.plans || [];

    const examples = [
        {
            icon: Mail,
            title: "Gestion de Leads",
            desc: "Nouveau lead web ➜ CRM (Hubspot/Notion) ➜ Email de bienvenue personnalisé instantané.",
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            icon: Database,
            title: "Facturation Auto",
            desc: "Paiement Stripe reçu ➜ Génération facture ➜ Envoi au client ➜ Archivage comptable.",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10"
        },
        {
            icon: Workflow,
            title: "Onboarding Client",
            desc: "Contrat signé ➜ Création espace projet ➜ Envoi accès ➜ Invitation Slack/Discord.",
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <SEO
                title="Automatisation de Processus Métier | Nexus Développement"
                description="Automatisez vos tâches répétitives et gagnez en productivité. Solutions d'automatisation sur-mesure pour TPE/PME. Zapier, Make, n8n. Devis gratuit."
                type="website"
            />

            <div className="fixed inset-0 z-0" aria-hidden="true">
                <AnimatedBackground />
            </div>

            <div className="relative z-10">
                <Navigation />

                {/* Hero Section */}
                <div className="container mx-auto px-4 pt-32 pb-20">
                    <Button
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/10 mb-8 pl-0 transition-all rounded-full px-4"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 mb-8 backdrop-blur-md">
                                <Zap className="w-8 h-8 text-amber-400" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                                Automatisation
                                <br />
                                <span className="text-3xl md:text-5xl text-amber-200/50">Gain de temps & Sérénité</span>
                            </h1>
                            <p className="text-xl text-amber-100/70 leading-relaxed mb-10 max-w-lg">
                                Vos outils (CRM, Emails, Tableurs) doivent travailler pour vous, pas l'inverse. Supprimez les tâches répétitives et concentrez-vous sur votre valeur ajoutée.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105"
                                >
                                    Automatiser mon business
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => document.getElementById('exemples')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="border-white/10 text-white hover:bg-white/5 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
                                >
                                    Voir des exemples
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-[100px] rounded-full" />
                            <Card className="relative bg-slate-900/40 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-amber-500/30 transition-colors duration-500">
                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardContent className="p-10 space-y-8">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Clock className="w-6 h-6 text-amber-400" />
                                        Pourquoi automatiser ?
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 items-start group/item">
                                            <div className="bg-amber-500/10 p-3 rounded-lg mt-1 group-hover/item:bg-amber-500/20 transition-colors">
                                                <Workflow className="w-6 h-6 text-amber-400 group-hover/item:text-amber-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-2">Connectivité Totale</h4>
                                                <p className="text-amber-200/60 text-sm leading-relaxed">
                                                    Nous faisons dialoguer tous vos logiciels entre eux (No-Code & Code).
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start group/item">
                                            <div className="bg-orange-500/10 p-3 rounded-lg mt-1 group-hover/item:bg-orange-500/20 transition-colors">
                                                <ShieldCheck className="w-6 h-6 text-orange-400 group-hover/item:text-orange-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-2">Fiabilité 100%</h4>
                                                <p className="text-amber-200/60 text-sm leading-relaxed">
                                                    Les robots ne font pas d'erreurs de copie, n'oublient jamais rien et ne dorment pas.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Exemples Section */}
                    <div id="exemples" className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Cas Concrets</h2>
                            <p className="text-amber-200/60 max-w-2xl mx-auto">Voici comment nous faisons gagner des heures à nos clients chaque semaine.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {examples.map((ex, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                >
                                    <div className="h-full bg-slate-900/40 border border-white/5 p-8 rounded-3xl hover:bg-slate-800/60 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden group">
                                        <div className={`w-14 h-14 ${ex.bg} rounded-2xl flex items-center justify-center ${ex.color} mb-6 group-hover:scale-110 transition-transform`}>
                                            <ex.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">{ex.title}</h3>
                                        <div className="flex items-start gap-3 text-amber-100/70 text-sm leading-relaxed">
                                            <PlayCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500/50" />
                                            {ex.desc}
                                        </div>
                                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div id="tarifs" className="mb-20 scroll-mt-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-white to-orange-400 bg-clip-text text-transparent">
                                Tarifs Accessibles
                            </h2>
                            <p className="text-lg text-amber-200/70 max-w-2xl mx-auto">
                                Commence par un audit, ou passe directement à l'action.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard key={index} plan={plan} categoryId="automatisation" index={index} />
                            ))}
                        </div>
                    </div>

                    {/* Section "Pourquoi Nexus ?" - SEO Content */}
                    <div className="mb-32 max-w-4xl mx-auto prose prose-invert prose-lg">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            Pourquoi choisir Nexus Développement pour votre automatisation ?
                        </h2>
                        <p className="text-lg text-amber-100/80 leading-relaxed mb-6">
                            Basée à <strong>Élancourt dans les Yvelines (78)</strong>, notre agence Nexus Développement
                            est spécialisée dans l'automatisation de processus métier pour TPE et PME. Nous transformons
                            vos tâches répétitives en workflows automatiques qui vous font gagner des heures chaque semaine.
                        </p>

                        <h3 className="text-2xl font-bold text-white mb-4 mt-8">Notre expertise automatisation</h3>
                        <ul className="space-y-3 text-amber-100/80 leading-relaxed">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                                <span><strong>Connectivité totale</strong> : Zapier, Make.com, n8n pour relier tous vos outils</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                                <span><strong>Solutions sur-mesure</strong> : Code personnalisé quand les no-code montrent leurs limites</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                                <span><strong>ROI rapide</strong> : Récupérez votre in vestissement en moins de 3 mois</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                                <span><strong>Support et évolutivité</strong> : Nous faisons évoluer vos automatisations avec vous</span>
                            </li>
                        </ul>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-20 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                            Questions Fréquentes - Automatisation
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-amber-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-3">
                                    💰 Combien coûte l'automatisation de processus ?
                                </h3>
                                <p className="text-amber-100/80 leading-relaxed">
                                    Le <strong>pack Audit démarre à 490€</strong> pour identifier vos opportunités d'automatisation.
                                    Le pack Automatisation complète démarre à 1490€. L'investissement se récupère en moyenne en 2-3 mois
                                    grâce au temps gagné.
                                </p>
                            </div>

                            <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-amber-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-3">
                                    🔧 Quels outils utilisez-vous pour automatiser ?
                                </h3>
                                <p className="text-amber-100/80 leading-relaxed">
                                    Nous maîtrisons <strong>Zapier, Make.com (ex-Integromat), n8n</strong> pour le no-code, ainsi que
                                    des solutions custom en <strong>Python, Node.js et API</strong> pour les besoins avancés nécessitant
                                    du code sur-mesure.
                                </p>
                            </div>

                            <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-amber-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-3">
                                    ⏱️ Combien de temps faut-il pour automatiser un processus ?
                                </h3>
                                <p className="text-amber-100/80 leading-relaxed">
                                    Un workflow simple peut être mis en place en <strong>2-5 jours</strong>. Pour des automatisations
                                    complexes impliquant plusieurs outils, comptez 2-4 semaines. Nous commençons toujours par un audit
                                    pour identifier les gains rapides.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Bottom */}
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-amber-900/20 to-slate-900/40 rounded-3xl p-12 border border-amber-500/20 backdrop-blur-sm">
                        <h2 className="text-3xl font-bold text-white mb-6">Quel processus optimiser ?</h2>
                        <p className="text-amber-200/70 mb-8 text-lg">
                            Vous ne savez pas par où commencer ? Identifions ensemble les gisements de productivité dans votre entreprise.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/#reservation')}
                            className="bg-white text-amber-950 hover:bg-amber-50 font-bold rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            Réserver mon audit offert
                        </Button>
                    </div>
                </div>

                <Footer />
            </div>
            <ChatBotWidget />
        </div>
    );
};

export default Automation;
