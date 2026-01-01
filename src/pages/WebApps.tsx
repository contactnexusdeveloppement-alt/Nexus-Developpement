import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, CheckCircle, Code, Layers, Database, Lock, Globe, Server, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const WebApps = () => {
    const navigate = useNavigate();
    const pricingPlans = pricingData.find(c => c.id === 'webapp')?.plans || [];

    const capabilities = [
        {
            icon: Database,
            title: "Gestion de Données",
            description: "CRM, ERP, tableaux de bords complexes pour visualiser et piloter votre activité."
        },
        {
            icon: Lock,
            title: "Espaces Sécurisés",
            description: "Authentification forte, rôles utilisateurs et protection des données sensibles."
        },
        {
            icon: Globe,
            title: "Accessible Partout",
            description: "Vos outils disponibles 24/7 sur n'importe quel navigateur, sans installation."
        },
        {
            icon: Server,
            title: "Scalabilité",
            description: "Une architecture cloud robuste prête à grandir avec votre nombre d'utilisateurs."
        }
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <SEO
                title="Développement Applications Web | Nexus Développement Élancourt"
                description="Développement d'applications web sur-mesure avec React, Node.js. Solutions SaaS, dashboards, plateformes métier. Élancourt (78). Devis gratuit."
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
                            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20 mb-8 backdrop-blur-md">
                                <Laptop className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                Applications Web
                                <br />
                                <span className="text-3xl md:text-5xl text-blue-200/50">SaaS & Outils Métier</span>
                            </h1>
                            <p className="text-xl text-blue-100/70 leading-relaxed mb-10 max-w-lg">
                                Plus qu'un site, créez un véritable logiciel accessible en ligne. Automatisez, gérez et scalez votre business avec des outils sur-mesure performants.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all hover:scale-105"
                                >
                                    Voir les solutions
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="border-white/10 text-white hover:bg-white/5 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
                                >
                                    Fonctionnalités
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-[100px] rounded-full" />
                            <Card className="relative bg-slate-900/40 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardContent className="p-10 space-y-8">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Layers className="w-6 h-6 text-cyan-400" />
                                        Puissance & Flexibilité
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 items-start group/item">
                                            <div className="bg-blue-500/10 p-3 rounded-lg mt-1 group-hover/item:bg-blue-500/20 transition-colors">
                                                <Code className="w-6 h-6 text-blue-400 group-hover/item:text-blue-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-2">Développement Sur-Mesure</h4>
                                                <p className="text-blue-200/60 text-sm leading-relaxed">
                                                    Pas de limites. Nous construisons exactement ce dont vous avez besoin, avec les technologies les plus modernes (React, Node, Supabase).
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start group/item">
                                            <div className="bg-cyan-500/10 p-3 rounded-lg mt-1 group-hover/item:bg-cyan-500/20 transition-colors">
                                                <CheckCircle className="w-6 h-6 text-cyan-400 group-hover/item:text-cyan-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-2">Expérience Utilisateur (UX)</h4>
                                                <p className="text-blue-200/60 text-sm leading-relaxed">
                                                    Des interfaces fluides et intuitives qui rendent vos utilisateurs productifs dès la première utilisation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Capabilities Section */}
                    <div id="capabilities" className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ce que nous pouvons construire</h2>
                            <p className="text-blue-200/60 max-w-2xl mx-auto">De la simple plateforme de gestion au SaaS international.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {capabilities.map((cap, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-slate-800/20 border border-white/5 hover:bg-slate-800/40 hover:border-cyan-500/30 transition-all duration-300 group"
                                >
                                    <cap.icon className="w-10 h-10 text-cyan-500/70 mb-4 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                                    <h3 className="text-xl font-bold text-white mb-2">{cap.title}</h3>
                                    <p className="text-blue-200/50 text-sm leading-relaxed">{cap.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div id="tarifs" className="mb-20 scroll-mt-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text text-transparent">
                                Investissez dans votre croissance
                            </h2>
                            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
                                Des solutions robustes pour porter votre vision.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard key={index} plan={plan} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* Section "Pourquoi Nexus ?" - SEO Content */}
                    <div className="mb-32 max-w-4xl mx-auto prose prose-invert prose-lg">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            Pourquoi choisir Nexus Développement pour votre application web ?
                        </h2>
                        <p className="text-lg text-blue-100/80 leading-relaxed mb-6">
                            Basée à <strong>Élancourt dans les Yvelines (78)</strong>, notre agence Nexus Développement
                            est spécialisée dans le développement d'applications web sur-mesure. Du simple CRM interne
                            au SaaS multi-tenants, nous construisons des plateformes scalables et performantes.
                        </p>

                        <h3 className="text-2xl font-bold text-white mb-4 mt-8">Technologies modernes maîtrisées</h3>
                        <ul className="space-y-3 text-blue-100/80 leading-relaxed">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                                <span><strong>React, TypeScript, Node.js</strong> : Stack moderne pour applications performantes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                                <span><strong>Supabase, PostgreSQL</strong> : Bases de données robustes et scalables</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                                <span><strong>Architecture cloud</strong> : Prête à grandir avec vos utilisateurs</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                                <span><strong>Sécurité renforcée</strong> : Authentification, rôles, protection données</span>
                            </li>
                        </ul>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-20 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                            Questions Fréquentes - Applications Web
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-3">
                                    💰 Quel est le coût d'une application web sur-mesure ?
                                </h3>
                                <p className="text-blue-100/80 leading-relaxed">
                                    Les tarifs démarrent à <strong>2990€ pour une application simple</strong> et 5990€ pour
                                    une solution SaaS complète. Le prix varie selon la complexité, le nombre de fonctionnalités
                                    et l'intégration avec vos systèmes existants.
                                </p>
                            </div>

                            <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-3">
                                    ⏱️ Combien de temps pour développer mon application ?
                                </h3>
                                <p className="text-blue-100/80 leading-relaxed">
                                    Comptez <strong>4 à 8 semaines pour une application simple</strong>, 3 à 6 mois pour un
                                    SaaS complet avec fonctionnalités avancées. Nous travaillons en sprints agiles avec des
                                    démos régulières.
                                </p>
                            </div>

                            <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-3">
                                    🔐 Mon application sera-t-elle sécurisée ?
                                </h3>
                                <p className="text-blue-100/80 leading-relaxed">
                                    Absolument ! Nous implémentons <strong>l'authentification forte, le chiffrement des données,
                                        la gestion des rôles</strong> et respectons les normes RGPD. Tests de sécurité systématiques
                                    avant mise en production.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Bottom */}
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-cyan-900/20 to-slate-900/40 rounded-3xl p-12 border border-cyan-500/20 backdrop-blur-sm">
                        <h2 className="text-3xl font-bold text-white mb-6">Prêt à lancer votre projet ?</h2>
                        <p className="text-blue-200/70 mb-8 text-lg">
                            Transformez votre idée en un produit digital performant.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/#reservation')}
                            className="bg-white text-cyan-950 hover:bg-cyan-50 font-bold rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            Discuter de mon concept
                        </Button>
                    </div>
                </div>

                <Footer />
            </div>
            <ChatBotWidget />
        </div>
    );
};

export default WebApps;
