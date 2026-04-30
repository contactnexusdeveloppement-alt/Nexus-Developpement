import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, CheckCircle, PenTool, Image as ImageIcon, Eye, Layers, Type, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schemas";

const FAQ_BRANDING = [
  {
    q: "Combien coûte la création d'un logo professionnel et d'une identité visuelle complète ?",
    a: "Notre offre démarre à 250 € HT pour le pack Logo Essential : briefing approfondi (1 heure de visio), 3 propositions de logo distinctes inspirées de votre univers, 2 tours d'allers-retours pour ajuster l'option retenue, déclinaisons noir / blanc / négatif, palette de couleurs principales (5 à 7 teintes avec codes HEX, RGB, CMYK), sélection typographique (1 typographie principale + 1 secondaire), livraison de tous les fichiers sources (.AI, .SVG, .PNG, .EPS, .PDF) et cession totale et exclusive des droits patrimoniaux. Le pack Logo + Supports à 600 € HT ajoute la conception de cartes de visite recto-verso, une signature email professionnelle compatible Gmail / Outlook, un en-tête de documents Word et PowerPoint réutilisable. Le pack Branding Complet à 1 200 € HT couvre l'ensemble : charte graphique professionnelle de 30 à 40 pages, brand book stratégique, papeterie complète (cartes, factures, devis, présentations), templates pour vos 3 réseaux sociaux principaux (Instagram, LinkedIn, Facebook).",
  },
  {
    q: "En combien de temps livrez-vous un logo professionnel finalisé ?",
    a: "Le pack Logo Essential est livré en 5 à 7 jours ouvrés selon votre disponibilité pour les allers-retours : 1 jour pour le briefing initial et l'analyse de votre univers concurrentiel, 2 à 3 jours pour la création des 3 premières propositions de logo, 1 à 2 jours pour le tour d'aller-retour avec ajustements (couleurs, typographie, équilibre, simplification), et 1 jour pour la finalisation et la livraison de tous les fichiers sources. Le pack Logo + Supports prend 10 à 14 jours ouvrés au total : aux étapes du logo s'ajoutent le design des cartes de visite, la signature email et l'en-tête de documents. Le pack Branding Complet nécessite 3 à 4 semaines de travail : phase de brand strategy (positionnement, valeurs, ton de communication), création complète de la charte graphique avec règles d'utilisation, conception du brand book stratégique et création de tous les templates et supports déclinés.",
  },
  {
    q: "Que comprend exactement une charte graphique complète professionnelle ?",
    a: "Une charte graphique professionnelle (incluse dans le pack Branding Complet à 1 200 € HT) regroupe l'ensemble des règles visuelles de votre marque sur 30 à 40 pages : présentation du logo et de toutes ses déclinaisons (horizontale, verticale, mono-couleur, négative), zone de protection minimale et tailles minimales d'utilisation, palette colorimétrique complète avec codes HEX, RGB, CMYK et Pantone pour le print, hiérarchie typographique détaillée (titres H1-H6, corps de texte, citations, légendes) avec polices web et print, iconographie ou pictogrammes clés conçus dans le style de la marque, règles photographiques (style, traitement, recommandations de banques d'images), exemples d'application concrets sur tous les supports (site web, application mobile, cartes de visite, papeterie, signalétique, réseaux sociaux, affichage). Le tout est livré en PDF haute définition prêt à être imprimé et partagé avec votre équipe ou prestataires, plus tous les fichiers sources éditables.",
  },
  {
    q: "Cédez-vous l'intégralité des droits sur le logo et les créations livrées ?",
    a: "Oui, sans aucune restriction ni surcoût. Tous nos packs identité visuelle incluent la cession totale et exclusive des droits patrimoniaux sur le logo final livré et l'ensemble des créations associées (charte graphique, supports déclinés, templates). Vous êtes libre d'utiliser ces créations sans la moindre restriction : en France comme à l'international, pour tout support physique ou numérique (site web, application, packaging, signalétique, véhicule, vêtement, communication digitale, supports publicitaires), pour toute durée (illimitée), pour toute exploitation commerciale (vente de produits ou services dérivés, franchise, licence). Vous pouvez également modifier ou faire évoluer ces créations à votre guise sans nous demander d'accord. Cette cession est officialisée par un document écrit signé à la livraison, conforme au Code de la Propriété Intellectuelle (article L. 131-3), qui sécurise juridiquement vos droits pour le présent et l'avenir.",
  },
];

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
                canonical="/identite-visuelle"
                schemas={[
                    serviceSchema({
                        name: "Création de logo et identité visuelle",
                        description: "Conception de logos professionnels, charte graphique complète, supports print et digitaux, brand book. Cession totale des droits incluse.",
                        url: "/identite-visuelle",
                        serviceType: "Brand Identity Design",
                        areaServed: ["Yvelines", "Île-de-France", "France"],
                        offers: [
                            { name: "Logo Essential", price: 250, description: "Logo + déclinaisons N&B + palette + typographies + sources" },
                            { name: "Logo + Supports", price: 600, description: "Logo + cartes de visite + signature email + en-tête" },
                            { name: "Branding Complet", price: 1200, description: "Charte graphique complète + brand book + templates réseaux sociaux" },
                        ],
                    }),
                    faqSchema(FAQ_BRANDING),
                    breadcrumbSchema([
                        { name: "Accueil", url: "/" },
                        { name: "Identité visuelle", url: "/identite-visuelle" },
                    ]),
                ]}
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

                    {/* Preview Grid - Client Logos */}
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Une cohérence totale</h2>
                            <p className="text-pink-200/60 max-w-2xl mx-auto">Votre identité se décline partout.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { src: "/Aura creative.webp", alt: "Aura Creative" },
                                { src: "/AETHELRED.webp", alt: "AETHELRED" },
                                { src: "/LUMINA.webp", alt: "LUMINA" },
                                { src: "/Océan & Terre.webp", alt: "Océan & Terre" },
                            ].map((logo, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative group hover:border-pink-500/30 transition-all duration-300"
                                >
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard key={index} plan={plan} categoryId="identite" index={index} />
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
        </div>
    );
};

export default VisualIdentity;
