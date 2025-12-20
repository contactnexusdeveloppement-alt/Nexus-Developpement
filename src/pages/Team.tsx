import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect } from "react";

const Team = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const team = [
        {
            name: "Adam Le Charlès",
            role: "Co-fondateur & Tech Lead",
            bio: "Je suis passionné par l'architecture logicielle. Je supervise toute la vision technique de l'agence pour garantir à nos partenaires des solutions robustes, pérennes et à la pointe de l'innovation.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Expert React & Node.js"
        },
        {
            name: "Théo Jacobée",
            role: "Co-fondateur & Stratégie",
            bio: "Mon but est de transformer vos idées complexes en plans d'action concrets. J'analyse votre marché pour maximiser votre ROI et assurer une croissance durable de votre activité.",
            image: "/images/theo_jacobee.png",
            details: "Visionnaire Business"
        },
        {
            name: "Théo Gautier",
            role: "Directeur Créatif",
            bio: "Diplômé des Gobelins et ami d'enfance d'Adam, j'ai affûté mon œil dans des studios parisiens. J'apporte cette touche artistique unique qui rendra votre projet inoubliable.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Master Web Design - Gobelins"
        },
        {
            name: "Sarah Chen",
            role: "Lead Developer Fullstack",
            bio: "Ancienne de chez Criteo et diplômée d'EPITECH, je suis obsédée par la performance. Je conçois l'architecture de vos applications pour qu'elles soient rapides et scalables.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Ex-Criteo • EPITECH"
        },
        {
            name: "Lucas Martin",
            role: "Senior Backend Developer",
            bio: "Issu de l'École 42, je suis un puriste du code. Je bâtis pour vous des API sécurisées et ultra-rapides, capables d'encaisser n'importe quelle charge de trafic.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Alumni École 42"
        },
        {
            name: "Emma Dubois",
            role: "Senior UI/UX Designer",
            bio: "Formée à Strate, j'allie la psychologie cognitive au design. Je crée des parcours utilisateurs si fluides que vos clients navigueront sur votre site sans même y penser.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Master UX - Strate"
        },
        {
            name: "Thomas Petit",
            role: "Frontend Developer",
            bio: "Sorti de l'IIM, je suis le magicien qui donne vie aux maquettes. Je code des animations immersives en WebGL et Three.js pour créer l'effet 'Wow' que vous recherchez.",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Expert Creative Coding"
        },
        {
            name: "Julie Morel",
            role: "Chef de Projet Digital",
            bio: "Avec mon Master d'HEC Paris, j'orchestre les sprints techniques. Je suis votre point de contact privilégié pour m'assurer que votre projet avance vite et bien.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Master HEC Paris"
        },
        {
            name: "Maxime Leroy",
            role: "DevOps Engineer",
            bio: "Ingénieur INSA Lyon, je suis le gardien de votre infrastructure. J'automatise tout pour que votre site soit en ligne 24h/24 et 7j/7, quoi qu'il arrive.",
            image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Ingénieur INSA"
        },
        {
            name: "Chloé Durand",
            role: "SEO & Content Manager",
            bio: "Diplômée du CELSA, je manie les mots pour plaire à Google. Je déploie des stratégies de contenu chirurgicales pour vous propulser en tête des résultats de recherche.",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400",
            details: "Master CELSA"
        }
    ];

    return (
        <div className="min-h-screen relative font-sans text-slate-200">
            <div className="fixed inset-0 z-0">
                <AnimatedBackground />
            </div>

            <div className="relative z-10 py-20 px-4 md:px-8">
                <div className="container mx-auto max-w-6xl">
                    <Link to="/">
                        <Button variant="ghost" className="mb-12 text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Retour à l'accueil
                        </Button>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6">
                            L'Équipe Nexus
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Une synergie d'experts passionnés, unis par la volonté de repousser les limites du digital.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10 overflow-hidden hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group h-full flex flex-col hover:-translate-y-1">
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60" />
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <CardContent className="p-5 flex-1 flex flex-col relative z-20 -mt-12">
                                        <div className="mb-3">
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-bold shadow-lg shadow-blue-900/50 mb-3 backdrop-blur-sm border border-blue-400/30">
                                                {member.details}
                                            </span>
                                            <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-blue-300 transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
                                                {member.role}
                                            </p>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed flex-1 border-t border-white/10 pt-4 opacity-90">
                                            {member.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-slate-400 mb-6">Vous souhaitez rejoindre l'aventure ?</p>
                        <Link to="/contact">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/20 active:scale-95 transition-all rounded-full px-8 py-6 text-lg font-medium">
                                Voir nos offres
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
