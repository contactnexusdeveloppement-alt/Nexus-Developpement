import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, CheckCircle, PenTool, Image as ImageIcon, Eye, Layers, Type, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const VisualIdentity = () => {
    const navigate = useNavigate();
    const pricingPlans = pricingData.find(c => c.id === 'identite')?.plans || [];

    const brandElements = [
        { icon: Eye, title: "Logo Unique", desc: "Création vectorielle originale, pas de banque d'images." },
        { icon: Layers, title: "Charte Graphique", desc: "Règles d'utilisation, couleurs et espacements." },
        { icon: Type, title: "Typographie", desc: "Sélection de polices lisibles et caractérielles." },
        { icon: ImageIcon, title: "Déclinaisons", desc: "Adaptations pour web, print et réseaux sociaux." }
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <SEO
                title="Création Logo & Identité Visuelle | Nexus Développement"
                description="Conception de logos professionnels et identité visuelle complète. Charte graphique, branding, design moderne. Élancourt (78). Devis gratuit."
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
                            <div className="inline-flex p-3 rounded-2xl bg-pink-500/10 border border-pink-400/20 mb-8 backdrop-blur-md">
                                <Palette className="w-8 h-8 text-pink-400" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-pink-200 to-pink-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                                Identité Visuelle
                                <br />
                                <span className="text-3xl md:text-5xl text-pink-200/50">Marquez les esprits</span>
                            </h1>
                            <p className="text-xl text-pink-100/70 leading-relaxed mb-10 max-w-lg">
                                Votre image dit tout de vous avant même que vous ne parliez. Nous forgeons des identités uniques qui capturent l'essence de votre marque et inspirent confiance.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all hover:scale-105"
                                >
                                    Créer mon image
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 blur-[100px] rounded-full" />
                            <Card className="relative bg-slate-900/40 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-pink-500/30 transition-colors duration-500">
                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardContent className="p-10 space-y-8">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Sparkles className="w-6 h-6 text-pink-400" />
                                        L'art du Branding
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {brandElements.map((el, i) => (
                                            <div key={i} className="space-y-2 group/item">
                                                <div className="bg-pink-500/10 p-2.5 rounded-lg w-fit group-hover/item:bg-pink-500/20 transition-colors">
                                                    <el.icon className="w-6 h-6 text-pink-400" />
                                                </div>
                                                <h4 className="font-semibold text-white">{el.title}</h4>
                                                <p className="text-xs text-pink-200/60 leading-relaxed">{el.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Preview Grid (Abstract) */}
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Une cohérence totale</h2>
                            <p className="text-pink-200/60 max-w-2xl mx-auto">Votre identité se décline partout.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto opacity-80">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-slate-700 font-bold text-6xl select-none group-hover:text-pink-500/20 transition-colors">Aa</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div id="tarifs" className="mb-20 scroll-mt-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-white to-rose-400 bg-clip-text text-transparent">
                                Tarifs Branding
                            </h2>
                            <p className="text-lg text-pink-200/70 max-w-2xl mx-auto">
                                Investissez dans une image qui vous rapporte.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard key={index} plan={plan} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* CTA Bottom */}
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-pink-900/20 to-slate-900/40 rounded-3xl p-12 border border-pink-500/20 backdrop-blur-sm">
                        <h2 className="text-3xl font-bold text-white mb-6">Besoin d'un rebranding ?</h2>
                        <p className="text-pink-200/70 mb-8 text-lg">
                            Vous existez déjà mais votre image ne vous rend pas justice ? Redonnons un coup d'éclat à votre marque.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/#reservation')}
                            className="bg-white text-pink-950 hover:bg-pink-50 font-bold rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            En discuter avec l'équipe
                        </Button>
                    </div>
                </div>

                <Footer />
            </div>
            <ChatBotWidget />
        </div>
    );
};

export default VisualIdentity;
