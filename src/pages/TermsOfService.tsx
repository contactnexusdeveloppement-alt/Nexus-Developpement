import { Link } from "react-router-dom";
import { ArrowLeft, Scale, FileCheck, UserX, AlertTriangle, Gavel, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect } from "react";
import { motion } from "framer-motion";

const TermsOfService = () => {
    useEffect(() => {
        document.title = "Conditions Générales d'Utilisation | Nexus Développement";
    }, []);

    const sections = [
        {
            icon: FileCheck,
            title: "1. Objet",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition des services du site Nexus Développement et les conditions d'utilisation par l'utilisateur.
                    </p>
                    <p>
                        Tout accès et/ou utilisation du site suppose l'acceptation et le respect de l'ensemble des termes des présentes conditions.
                    </p>
                </div>
            )
        },
        {
            icon: UserX,
            title: "2. Accès au site",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Le site est accessible gratuitement à tout utilisateur disposant d'un accès à internet.
                        Tous les coûts afférents à l'accès au site (matériel informatique, logiciels, connexion internet) sont exclusivement à la charge de l'utilisateur.
                    </p>
                    <p>
                        Nexus Développement met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité au site, mais n'est tenu à aucune obligation de résultat d'y parvenir.
                    </p>
                </div>
            )
        },
        {
            icon: AlertTriangle,
            title: "3. Responsabilité",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Nexus Développement ne saurait être tenu responsable de tout dysfonctionnement du réseau ou des serveurs ou de tout autre événement échappant au contrôle raisonnable, qui empêcherait ou dégraderait l'accès au site.
                    </p>
                    <p>
                        L'utilisateur s'engage à ne pas perturber le fonctionnement du site de quelque manière que ce soit.
                    </p>
                </div>
            )
        },
        {
            icon: Gavel,
            title: "4. Droit applicable",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Les présentes CGU sont soumises au droit français. En cas de litige non résolu à l'amiable, seuls les tribunaux français seront compétents.
                    </p>
                </div>
            )
        },
        {
            icon: RefreshCw,
            title: "5. Modification des CGU",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Nexus Développement se réserve le droit de modifier unilatéralement et à tout moment le contenu des présentes CGU.
                        L'utilisateur est donc invité à les consulter régulièrement.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen relative font-sans text-slate-200">
            <div className="fixed inset-0 z-0">
                <AnimatedBackground />
            </div>

            <div className="relative z-10 py-20 px-4 md:px-8">
                <div className="container mx-auto max-w-4xl">
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
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                            <Scale className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4">
                            Conditions Générales d'Utilisation
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Les règles du jeu, claires et précises.
                        </p>
                    </motion.div>

                    <div className="grid gap-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-blue-500/20 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0 mx-auto md:mx-0">
                                        <section.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-center md:justify-start gap-3">
                                            {section.title}
                                        </h2>
                                        {section.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 text-center"
                        >
                            <p className="text-slate-400 mb-4">Besoin de précisions ?</p>
                            <a
                                href="mailto:contact.nexus.developpement@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-blue-200 transition-all duration-300"
                            >
                                <Mail className="w-4 h-4" />
                                contact.nexus.developpement@gmail.com
                            </a>
                        </motion.div>
                    </div>

                    <div className="mt-20 text-center border-t border-white/5 pt-8">
                        <p className="text-slate-500 text-sm">
                            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
