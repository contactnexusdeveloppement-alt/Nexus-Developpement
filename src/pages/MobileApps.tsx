import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Bell, Wifi, Cpu, Layers, ScanFace, Battery } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schemas";

const FAQ_MOBILE = [
  {
    q: "Combien coûte le développement d'une application mobile iOS et Android ?",
    a: "Le tarif dépend du périmètre fonctionnel et du nombre de plateformes ciblées. Une app hybride mono-plateforme (iOS au choix OU Android au choix) démarre à 4 000 € HT et inclut le développement React Native, le design adaptatif natif, les notifications push, l'inscription au store et la publication. Une app multi-plateformes (iOS et Android avec un seul code base) démarre à 6 000 € HT, soit 50 % moins cher que deux développements natifs séparés en Swift / Kotlin. Pour une app complexe avec backend custom (API REST + base de données + authentification + capteurs comme GPS, caméra, Bluetooth, mode hors-ligne avancé), comptez à partir de 9 000 € HT. La maintenance, l'hébergement du backend et les mises à jour des stores démarrent à 100 € HT par mois pour une app simple, et jusqu'à 250 € HT par mois pour les apps avec backend complexe et fort trafic. Le compte développeur Apple (99 $/an) et Google Play (25 $ uniques) reste à votre charge.",
  },
  {
    q: "iOS et Android avec un seul code, c'est vraiment possible et performant ?",
    a: "Oui, totalement. Avec React Native (utilisé par Meta, Discord, Shopify, Microsoft Office, Coinbase) ou Expo, nous écrivons un seul code base TypeScript qui se compile et se déploie sur les deux stores. Vous gagnez 40 à 50 % du coût et 30 à 40 % du délai versus un développement natif double Swift + Kotlin, sans compromis significatif sur les performances pour la grande majorité des cas d'usage business : commerce, réservation, prise de RDV, suivi de commandes, dashboards, applications métier internes, fitness, content apps. Le natif pur en Swift ou Kotlin n'est vraiment nécessaire que pour des cas très spécifiques : jeux 3D haute performance (Unity reste de toute façon meilleur), traitement vidéo en temps réel ultra-intensif, applications avec un usage très lourd des dernières API natives non encore portées dans React Native. Pour 95 % des projets TPE/PME, React Native est le bon choix tant en coût qu'en qualité finale.",
  },
  {
    q: "Combien de temps pour publier mon app sur l'App Store et Google Play ?",
    a: "10 à 16 semaines en moyenne pour une app multi-plateformes complète : 2 semaines de cadrage avec ateliers utilisateurs et wireframes Figma, 1 à 2 semaines de design final des écrans avec maquettes haute fidélité validées, 6 à 10 semaines de développement en sprints de 2 semaines avec démos sur appareils réels (iPhone et Android), 1 à 2 semaines de recette interne avec tests sur la TestFlight Apple et la Internal Testing Track Google, et enfin 1 à 2 semaines pour la validation des stores. La validation Apple est le facteur le plus imprévisible : généralement 24 à 72 heures, mais peut prendre jusqu'à 7 jours en cas de demande de modification (politique de confidentialité, In-App Purchase, capture d'écran). Google Play valide en 1 à 3 jours. Nous gérons intégralement toutes les démarches stores : création des comptes développeurs, configuration des certificats, soumission, rédaction des métadonnées optimisées ASO, captures d'écran, vidéos preview.",
  },
  {
    q: "Quelles fonctionnalités natives mobiles intégrez-vous (push, biométrie, GPS, etc.) ?",
    a: "Toutes les fonctionnalités natives standards sont intégrables sans surcoût significatif via les bibliothèques officielles React Native et Expo : notifications push avec OneSignal, Firebase Cloud Messaging ou Expo Notifications (avec ciblage et programmation horaire), authentification biométrique FaceID / TouchID / Face Unlock / empreinte Android, géolocalisation GPS précise avec gestion fine des permissions iOS et Android, accès caméra et photothèque avec compression automatique des images, scan de codes-barres et QR codes, intégration Bluetooth Low Energy (BLE) et NFC pour les solutions de paiement ou d'identification, mode hors-ligne avancé avec synchronisation automatique au retour de connexion, deep linking et universal links, partage natif (Share Sheet iOS), notifications locales programmées, paiements In-App Apple Pay et Google Pay (commission 15-30 % stores) ou paiements Stripe externes selon votre modèle.",
  },
];

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
            <SEO
                title="Développement Applications Mobiles iOS & Android | Nexus"
                description="Création d'applications mobiles natives et cross-platform. React Native, iOS, Android. App store optimization. Élancourt (78). Devis gratuit."
                type="website"
                canonical="/applications-mobiles"
                schemas={[
                    serviceSchema({
                        name: "Développement d'applications mobiles iOS et Android",
                        description: "Création d'applications mobiles cross-platform en React Native / Expo. Notifications push, biométrie, mode hors-ligne, publication App Store et Google Play.",
                        url: "/applications-mobiles",
                        serviceType: "Mobile App Development",
                        areaServed: ["Yvelines", "Île-de-France", "France"],
                        offers: [
                            { name: "App hybride 1 plateforme", price: 4000, description: "App React Native sur iOS ou Android au choix" },
                            { name: "App multi-plateformes", price: 6000, description: "Une seule app pour iOS et Android avec design optimisé pour chaque OS" },
                            { name: "App complexe + backend", price: 9000, description: "App native avec backend API custom, capteurs GPS/Caméra, mode hors-ligne avancé" },
                        ],
                    }),
                    faqSchema(FAQ_MOBILE),
                    breadcrumbSchema([
                        { name: "Accueil", url: "/" },
                        { name: "Applications mobiles", url: "/applications-mobiles" },
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

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard key={index} plan={plan} categoryId="mobile" index={index} />
                            ))}
                        </div>
                    </div>

                    {/* CTA Bottom */}
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
        </div>
    );
};

export default MobileApps;
