import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Bell, Wifi, Cpu, Layers, ScanFace, Battery } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";

const MobileApps = () => {
    const navigate = useNavigate();
    const pricingPlans = pricingData.find(c => c.id === 'mobile')?.plans || [];

    const features = [
        { icon: Bell, title: "Notifications Push", desc: "Réengagez vos utilisateurs instantanément." },
        { icon: Wifi, title: "Mode Hors-Ligne", desc: "Fonctionne parfaitement même dans le métro." },
        { icon: Cpu, title: "Performance Native", desc: "Fluidité absolue à 60/120 FPS." },
        { icon: ScanFace, title: "Biométrie", desc: "Connexion sécurisée par FaceID / TouchID." }
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden">
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
                            <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-400/20 mb-8 backdrop-blur-md">
                                <Smartphone className="w-8 h-8 text-purple-400" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                Applications Mobiles
                                <br />
                                <span className="text-3xl md:text-5xl text-purple-200/50">iOS & Android</span>
                            </h1>
                            <p className="text-xl text-purple-100/70 leading-relaxed mb-10 max-w-lg">
                                Soyez dans la poche de vos clients. Une expérience fluide, native et engageante pour fidéliser votre audience comme jamais auparavant.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(192,38,211,0.4)] transition-all hover:scale-105"
                                >
                                    Lancer mon app
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-[100px] rounded-full" />
                            <Card className="relative bg-slate-900/40 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardContent className="p-10 space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        {features.map((feat, i) => (
                                            <div key={i} className="space-y-3 group/item">
                                                <div className="bg-purple-500/10 p-3 rounded-xl w-fit group-hover/item:bg-purple-500/20 transition-colors">
                                                    <feat.icon className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <h3 className="font-bold text-white">{feat.title}</h3>
                                                <p className="text-sm text-purple-200/60">{feat.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Tech Stack Preview */}
                    <div className="mb-32 text-center">
                        <h3 className="text-2xl font-bold text-white mb-12">Technologies Maîtrisées</h3>
                        <div className="flex justify-center gap-8 md:gap-16 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Placeholder text/icons for tech stack since we don't have images handy, keeping it clean with text pills */}
                            {["React Native", "Expo", "Swift", "Kotlin", "Firebase"].map((tech) => (
                                <span key={tech} className="text-xl md:text-2xl font-bold text-white/50 hover:text-purple-400 transition-colors cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div id="tarifs" className="mb-20 scroll-mt-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-pink-400 bg-clip-text text-transparent">
                                Tarifs Développement Mobile
                            </h2>
                            <p className="text-lg text-purple-200/70 max-w-2xl mx-auto">
                                Des solutions adaptées, du prototype à l'application grand public.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard key={index} plan={plan} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* FAQ / CTA Bottom */}
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-purple-900/20 to-slate-900/40 rounded-3xl p-12 border border-purple-500/20 backdrop-blur-sm">
                        <h2 className="text-3xl font-bold text-white mb-6">Un projet d'application ?</h2>
                        <p className="text-purple-200/70 mb-8 text-lg">
                            Les applications mobiles demandent une expertise pointue. Validons ensemble la faisabilité technique de votre idée.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/#reservation')}
                            className="bg-white text-purple-950 hover:bg-purple-50 font-bold rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            Réserver un appel technique
                        </Button>
                    </div>
                </div>

                <Footer />
            </div>
            <ChatBotWidget />
        </div>
    );
};

export default MobileApps;
