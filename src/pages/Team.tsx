import { Link } from "react-router-dom";
import { ArrowLeft, Code, Compass, Sparkles, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { breadcrumbSchema } from "@/lib/schemas";

import adamImage from "@/assets/adam_lecharles.webp";
import theoJImage from "@/assets/theo_jacobee.webp";

const Team = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const founders = [
        {
            name: "Adam Le Charlès",
            role: "Co-fondateur & Tech Lead",
            bio: "Passionné par l'architecture logicielle, je supervise toute la vision technique de l'agence. Mon rôle : garantir des solutions robustes, pérennes et faciles à faire évoluer pour nos clients.",
            image: adamImage,
            details: "Tech Lead — Stack moderne",
            objectPosition: { objectPosition: "center 30%" },
        },
        {
            name: "Théo Jacobée",
            role: "Co-fondateur & Stratégie",
            bio: "Mon rôle est de transformer vos idées en plans d'action concrets. J'analyse votre marché, votre cible et vos contraintes pour vous proposer la meilleure approche digitale possible.",
            image: theoJImage,
            details: "Stratégie & Business",
            objectPosition: {},
        },
    ];

    const values = [
        {
            icon: Code,
            title: "Qualité du code avant tout",
            text: "Stack moderne et typée (React, TypeScript, Tailwind, Vercel). Code livré sur GitHub privé du client, documenté, prêt à être repris par n'importe quel développeur.",
        },
        {
            icon: Compass,
            title: "Tarifs transparents",
            text: "Tous nos prix sont publiés sur le site et dans nos schémas JSON-LD. Pas de devis opaque, pas de coûts cachés. Vous savez exactement ce que vous payez avant de signer.",
        },
        {
            icon: Sparkles,
            title: "Livraison rapide",
            text: "Site vitrine en 2 à 4 semaines. Application MVP en 6 à 10 semaines. Sprints de 2 semaines avec démo systématique pour ajuster en continu.",
        },
        {
            icon: ShieldCheck,
            title: "Cession totale des droits",
            text: "Le code, le design, le contenu : tout vous appartient à la livraison. Pas de dépendance à notre agence, pas de licence cachée. Liberté totale.",
        },
    ];

    return (
        <div className="min-h-screen relative font-sans text-slate-200">
            <SEO
                title="L'équipe Nexus Développement | Co-fondateurs & valeurs"
                description="Présentation des co-fondateurs de Nexus Développement, agence digitale française à Élancourt (78). Adam Le Charlès et Théo Jacobée vous accompagnent sur votre projet web et mobile."
                type="website"
                canonical="/equipe"
                schemas={[
                    {
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        "@id": "https://nexusdeveloppement.fr/equipe#aboutpage",
                        name: "L'équipe Nexus Développement",
                        description: "Présentation des co-fondateurs de l'agence Nexus Développement à Élancourt.",
                        url: "https://nexusdeveloppement.fr/equipe",
                        about: {
                            "@id": "https://nexusdeveloppement.fr/#organization",
                            "@type": "Organization",
                        },
                        mainEntity: founders.map((member) => {
                            const slug = member.name
                                .toLowerCase()
                                .normalize("NFD")
                                .replace(/[̀-ͯ]/g, "")
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, "");
                            return {
                                "@type": "Person",
                                "@id": `https://nexusdeveloppement.fr/equipe#${slug}`,
                                name: member.name,
                                jobTitle: member.role,
                                description: member.bio,
                                worksFor: {
                                    "@id": "https://nexusdeveloppement.fr/#organization",
                                    "@type": "Organization",
                                },
                            };
                        }),
                    },
                    breadcrumbSchema([
                        { name: "Accueil", url: "/" },
                        { name: "L'équipe", url: "/equipe" },
                    ]),
                ]}
            />

            <div className="fixed inset-0 z-0">
                <AnimatedBackground />
            </div>

            <div className="relative z-10">
                <Navigation />

                <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6">
                            Les co-fondateurs de Nexus Développement
                        </h1>
                        <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Une agence à taille humaine, créée le 22 décembre 2025 à Élancourt (Yvelines).
                            Notre engagement : un interlocuteur unique pour votre projet, du cadrage à la livraison.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
                        {founders.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-slate-900/40 backdrop-blur-md border border-white/10 overflow-hidden hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group h-full flex flex-col hover:-translate-y-1">
                                    <div className="relative h-96 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60" />
                                        <img
                                            src={member.image}
                                            alt={`Portrait de ${member.name}, ${member.role} chez Nexus Développement`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            style={member.objectPosition}
                                        />
                                    </div>
                                    <CardContent className="p-6 flex-1 flex flex-col relative z-20 -mt-12">
                                        <div className="mb-3">
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-bold shadow-lg shadow-blue-900/50 mb-3 backdrop-blur-sm border border-blue-400/30">
                                                {member.details}
                                            </span>
                                            <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                                {member.name}
                                            </h2>
                                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
                                                {member.role}
                                            </p>
                                        </div>
                                        <p className="text-slate-300 text-base leading-relaxed flex-1 border-t border-white/10 pt-4 opacity-90">
                                            {member.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Notre histoire */}
                    <div className="max-w-4xl mx-auto mb-24 prose prose-invert prose-lg">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <Users className="w-7 h-7 text-cyan-400" />
                            Notre histoire
                        </h2>
                        <p className="text-blue-100/80 leading-relaxed mb-4">
                            Nexus Développement est née le 22 décembre 2025 d'une conviction simple : les TPE
                            et PME françaises méritent un accompagnement digital aussi soigné que celui des
                            grandes entreprises, sans le tarif des grandes agences parisiennes.
                        </p>
                        <p className="text-blue-100/80 leading-relaxed mb-4">
                            Basés à Élancourt, au cœur des Yvelines, nous accompagnons en priorité les
                            entreprises locales (Versailles, Saint-Quentin-en-Yvelines, Trappes, Plaisir,
                            Montigny-le-Bretonneux, Maurepas) et plus largement toute structure française qui
                            cherche un partenaire technique fiable et transparent. Tous nos rendez-vous découverte
                            sont proposés en présentiel sans surcoût dans un rayon de 30 km autour d'Élancourt,
                            ou en visioconférence partout ailleurs.
                        </p>
                        <p className="text-blue-100/80 leading-relaxed">
                            Notre stack technique est moderne et résolument durable : React, TypeScript,
                            Tailwind, Vercel, Stripe, Resend. Nous évitons les frameworks propriétaires ou les
                            CMS verrouillés qui rendent les sites difficiles à maintenir et coûteux à faire
                            évoluer. À la fin de chaque mission, vous recevez votre code sur un repository
                            GitHub privé qui vous appartient — vous restez maître de votre infrastructure.
                        </p>
                    </div>

                    {/* Nos valeurs */}
                    <div className="max-w-5xl mx-auto mb-20">
                        <h2 className="text-3xl font-bold text-white mb-12 text-center">
                            Nos engagements pour vos projets
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {values.map((value) => (
                                <div
                                    key={value.title}
                                    className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-cyan-400 mb-4">
                                        <value.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-blue-100/70 text-sm leading-relaxed">{value.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400 mb-6">Prêt à démarrer votre projet avec nous ?</p>
                        <Link to="/#tarifs">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/20 active:scale-95 transition-all rounded-full px-8 py-6 text-lg font-medium">
                                Voir nos offres
                            </Button>
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default Team;
