import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, UserCheck, Mail, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect } from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    useEffect(() => {
        document.title = "Politique de Confidentialité | Nexus Développement";
    }, []);

    const sections = [
        {
            icon: Database,
            title: "1. Collecte des données",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Nous collectons les informations que vous nous fournissez directement lorsque vous utilisez notre site, notamment via notre formulaire de contact ou lors d'une demande de devis.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                        <li>Identité (Nom, Prénom)</li>
                        <li>Coordonnées (Email, Téléphone)</li>
                        <li>Informations professionnelles (Entreprise, Projet)</li>
                    </ul>
                </div>
            )
        },
        {
            icon: Eye,
            title: "2. Utilisation des données",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>Vos données sont utilisées exclusivement pour :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                        <li>Répondre à vos demandes de contact et devis</li>
                        <li>La gestion de la relation client</li>
                        <li>L'amélioration de nos services</li>
                        <li>Le respect de nos obligations légales</li>
                    </ul>
                </div>
            )
        },
        {
            icon: Lock,
            title: "3. Conservation et Sécurité",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Vos données sont conservées pendant une durée de 3 ans à compter de notre dernier contact commercial.
                        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou altération.
                    </p>
                </div>
            )
        },
        {
            icon: Server,
            title: "4. Partage des données",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Nexus Développement ne vend ni ne loue vos données personnelles à des tiers.
                        Vos données peuvent être transmises à nos sous-traitants (hébergeur, outils de messagerie) uniquement pour les besoins de l'exécution de nos services, dans le respect strict du RGPD.
                    </p>
                </div>
            )
        },
        {
            icon: UserCheck,
            title: "5. Vos droits (RGPD)",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                        <li>Droit d'accès et de rectification</li>
                        <li>Droit à l'effacement ("droit à l'oubli")</li>
                        <li>Droit à la limitation du traitement</li>
                        <li>Droit à la portabilité des données</li>
                    </ul>
                    <p className="mt-2">
                        Pour exercer ces droits, contactez-nous à : <a href="mailto:contact.nexus.developpement@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">contact.nexus.developpement@gmail.com</a>
                    </p>
                </div>
            )
        },
        {
            icon: Globe,
            title: "6. Cookies",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Notre site utilise des cookies techniques essentiels au fonctionnement du site.
                        Nous n'utilisons pas de cookies publicitaires ou de traçage intrusifs.
                        Vous pouvez configurer votre navigateur pour refuser les cookies, bien que cela puisse affecter certaines fonctionnalités du site.
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
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Nous protégeons vos données comme nous protégeons notre code.
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
                                className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 hover:border-blue-500/20 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                                        <section.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h2 className="text-xl font-bold text-white mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3">
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
                            <p className="text-slate-400 mb-4">Une question sur vos données ?</p>
                            <a
                                href="mailto:contact.nexus.developpement@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-blue-200 transition-all duration-300 break-all"
                            >
                                <Mail className="w-4 h-4 shrink-0" />
                                <span className="break-all text-sm sm:text-base">contact.nexus.developpement@gmail.com</span>
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

export default PrivacyPolicy;
