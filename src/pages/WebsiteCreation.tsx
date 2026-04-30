import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, CheckCircle, Monitor, Smartphone, Zap, Search, Rocket, Code, Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schemas";

const FAQ_WEBSITE = [
  {
    q: "Combien coûte la création d'un site web à Élancourt et dans les Yvelines ?",
    a: "Chez Nexus Développement, nos tarifs démarrent à 950 € HT pour le pack Essential (1 à 3 pages, design responsive sur-mesure, formulaire de contact sécurisé, hébergement et certificat SSL inclus pour le premier mois, livraison sous 10 jours ouvrés). Le pack Business à 1 850 € HT couvre 4 à 10 pages structurées avec un CMS pour gérer le contenu, un module blog, un SEO avancé et 1 mois de support inclus. Le pack Premium à 4 000 € HT cible les marques exigeantes : 11 à 20 pages 100 % sur-mesure dessinées sous Figma, animations Framer Motion, fonctionnalités personnalisées, formation complète et support prioritaire 3 mois. Tous les devis sont gratuits, transparents, sans engagement, et nous répondons en moins de 24 heures à toute demande envoyée via le formulaire ou par email.",
  },
  {
    q: "Combien de temps faut-il pour créer un site web professionnel ?",
    a: "Le délai moyen pour un site vitrine est de 2 à 4 semaines : 3 à 5 jours de cadrage et design Figma, 1 à 2 semaines de développement, et environ une semaine de relecture, recette et corrections finales avant la mise en ligne. Pour un site plus complexe avec CMS, blog, espace membre ou intégration de services tiers (Stripe, Calendly, Brevo, Make), comptez 4 à 6 semaines. Pour un site e-commerce avec catalogue, paiement, gestion des stocks et tableau de bord, prévoyez 6 à 10 semaines selon la richesse du catalogue. Nous travaillons en sprints de 2 semaines avec une démo systématique en fin de sprint, ce qui vous permet de valider l'avancement, ajuster les priorités, et éviter les mauvaises surprises à la livraison finale.",
  },
  {
    q: "Nexus Développement est-il vraiment basé à Élancourt dans les Yvelines ?",
    a: "Oui, Nexus Développement (SARL au capital de 1 000 €, SIREN 995 394 095, RCS Versailles) est basée au 4 rue de la Ferme, 78990 Élancourt, dans le département des Yvelines, en Île-de-France. Notre périmètre d'intervention couvre prioritairement Saint-Quentin-en-Yvelines (Montigny-le-Bretonneux, Voisins-le-Bretonneux, Guyancourt, Trappes, Magny-les-Hameaux, La Verrière), ainsi que les communes alentour : Plaisir, Maurepas, Versailles, Bois-d'Arcy, Coignières, Saint-Cyr-l'École. Nous proposons un rendez-vous de cadrage en présentiel, sans surcoût, dans un rayon de 30 km autour d'Élancourt. Pour les clients hors Yvelines, nous travaillons en visioconférence et nous déplaçons sur demande pour les phases clés du projet (kick-off, recette, mise en production).",
  },
  {
    q: "Mon site sera-t-il optimisé pour mobiles, tablettes et tous les écrans ?",
    a: "Oui, sans exception. Nous concevons systématiquement nos sites en approche mobile-first : le design est d'abord pensé pour les écrans de 375 px de large (smartphones standards), puis adapté aux tablettes (768 px) et aux écrans desktop (1280 px et plus). Nous utilisons Tailwind CSS et des grilles responsives qui s'adaptent à toutes les résolutions, y compris aux iPhone Mini, iPad Pro, et écrans 4K. Chaque site est testé sur les principaux navigateurs (Chrome, Safari, Firefox, Edge) et sur Android et iOS réels avant la livraison. Côté performance mobile, nous visons un score Lighthouse minimum de 90 sur Mobile et 95 sur Desktop, avec une attention particulière au LCP (Largest Contentful Paint) inférieur à 2,5 secondes même en 4G dégradée.",
  },
  {
    q: "Le référencement SEO est-il inclus dans la création du site web ?",
    a: "Le SEO technique de base est inclus dans tous nos packs sans surcoût : balises title et meta description optimisées par page, structure de headings (H1-H6) propre, sitemap XML, robots.txt configuré, schemas JSON-LD (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList) intégrés au pré-rendering, balises Open Graph et Twitter Card pour les partages sociaux, balisage sémantique HTML5 strict. Le pack Business ajoute une recherche de mots-clés ciblée pour votre secteur, l'optimisation on-page de chaque page (intention de recherche, maillage interne, contenu enrichi) et la création d'un compte Google Search Console + Bing Webmaster. Le pack Premium intègre une stratégie SEO complète avec audit concurrentiel, plan de contenu éditorial sur 3 à 6 mois, et recommandations détaillées pour le netlinking local Yvelines.",
  },
];

const WebsiteCreation = () => {
  const navigate = useNavigate();
  const pricingPlans = pricingData.find(c => c.id === 'sites')?.plans || [];

  const processSteps = [
    {
      icon: Search,
      title: "1. Découverte",
      description: "Analyse approfondie de vos besoins, de votre marché et de vos objectifs pour une stratégie sur-mesure."
    },
    {
      icon: Layout,
      title: "2. Design UI/UX",
      description: "Création de maquettes modernes et intuitives, validées ensemble avant le moindre code."
    },
    {
      icon: Code,
      title: "3. Développement",
      description: "Intégration technique avec les dernières technologies (React, Tailwind) pour un site ultra-rapide."
    },
    {
      icon: Rocket,
      title: "4. Lancement",
      description: "Mise en ligne, optimisations SEO finales et formation à la gestion de votre nouveau site."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SEO
        title="Création de Sites Web Professionnels | Nexus Développement Élancourt"
        description="Création de sites vitrine modernes et performants à Élancourt (78). Design sur-mesure, SEO optimisé, responsive. Devis gratuit pour votre site web professionnel."
        type="website"
        canonical="/creation-site-web"
        schemas={[
          serviceSchema({
            name: "Création de site web TPE/PME",
            description: "Sites vitrines responsive, performants et optimisés SEO. Design sur-mesure, intégration React/Tailwind, score PageSpeed 95+, livraison sous 2 à 4 semaines.",
            url: "/creation-site-web",
            serviceType: "Web Development",
            areaServed: ["Yvelines", "Île-de-France", "France"],
            offers: [
              { name: "Pack Essential", price: 950, description: "Site vitrine 1 à 3 pages, responsive, formulaire de contact" },
              { name: "Pack Business", price: 1850, description: "4 à 10 pages, CMS, blog, SEO avancé, formation incluse" },
              { name: "Pack Premium", price: 4000, description: "11 à 20 pages sur-mesure, animations, SEO expert" },
            ],
          }),
          faqSchema(FAQ_WEBSITE),
          breadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: "Création de site web", url: "/creation-site-web" },
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
              <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20 mb-8 backdrop-blur-md">
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                Sites Vitrine
                <br />
                <span className="text-3xl md:text-5xl text-blue-200/50">Impact & Performance</span>
              </h1>
              <p className="text-xl text-blue-100/70 leading-relaxed mb-10 max-w-lg">
                Ne vous contentez pas d'être en ligne. Marquez les esprits avec un site web conçu pour convertir. Rapide, esthétique et taillé pour le référencement.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all hover:scale-105"
                >
                  Voir les offres
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-white/10 text-white hover:bg-white/5 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
                >
                  Notre processus
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-[100px] rounded-full" />
              <Card className="relative bg-slate-900/40 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-10 space-y-8">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-blue-400" />
                    Pourquoi un site sur-mesure plutôt qu'un template ?
                  </h3>
                  <div className="space-y-6">
                    {[
                      { icon: CheckCircle, title: "Design Unique", text: "Une identité visuelle qui vous ressemble, pas de templates génériques." },
                      { icon: Zap, title: "Performance Maximale", text: "Score Google PageSpeed 95+, chargement instantané." },
                      { icon: Smartphone, title: "100% Mobile", text: "Une expérience parfaite sur smartphones et tablettes." },
                      { icon: Search, title: "SEO Friendly", text: "Structure optimisée pour plaire aux moteurs de recherche." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 group/item">
                        <div className="mt-1">
                          <item.icon className="w-8 h-8 text-cyan-500/80 group-hover/item:text-cyan-400 transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1 group-hover/item:translate-x-1 transition-transform">{item.title}</h4>
                          <p className="text-blue-200/60 text-sm leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Process Section */}
          <div id="process" className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Comment se déroule la création de votre site web ?</h2>
              <p className="text-blue-200/60 max-w-2xl mx-auto">Une méthodologie éprouvée en 4 étapes pour des résultats prévisibles et de qualité.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="h-full bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-blue-200/60 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div id="tarifs" className="mb-20 scroll-mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                Quel pack site web choisir pour votre activité ?
              </h2>
              <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
                Trois solutions clé en main pour démarrer sereinement. Transparence totale, aucun coût caché.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} index={index} />
              ))}
            </div>
          </div>

          {/* Section "Pourquoi Nexus ?" - SEO Content */}
          <div className="mb-32 max-w-4xl mx-auto prose prose-invert prose-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Pourquoi choisir Nexus Développement pour votre site web ?
            </h2>
            <p className="text-lg text-blue-100/80 leading-relaxed mb-6">
              Basée à <strong>Élancourt dans les Yvelines (78)</strong>, notre agence Nexus Développement
              accompagne les entreprises locales et nationales dans leur transformation digitale. Avec notre
              expertise en création de sites web, nous garantissons des résultats concrets et mesurables.
            </p>

            <h3 className="text-2xl font-bold text-white mb-4 mt-8">Que comprend exactement la création de votre site web ?</h3>
            <ul className="space-y-3 text-blue-100/80 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span><strong>Code propre et maintenable</strong> selon les standards de l'industrie (React, TypeScript)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span><strong>Performance garantie</strong> : Score Google PageSpeed 95+ sur tous nos projets</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span><strong>Support technique réactif</strong> sous 24h, 7j/7</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span><strong>Formation complète incluse</strong> pour que vous soyez autonome</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span><strong>Garantie satisfaction</strong> ou remboursement intégral</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-white mb-4 mt-8">Pour qui concevons-nous nos sites web ?</h3>
            <p className="text-blue-100/80 leading-relaxed">
              Nous concevons des sites pour les TPE, PME et indépendants qui veulent une présence digitale
              à la hauteur de leur ambition. De la boulangerie de quartier au cabinet de conseil B2B, nous
              adaptons nos solutions à vos besoins, votre budget et votre secteur. Notre stack moderne
              (React, TypeScript, Tailwind, Vercel) garantit un site rapide, sécurisé et facile à faire
              évoluer.
            </p>
          </div>

          {/* FAQ Section - SEO Featured Snippets */}
          <div className="mb-20 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Questions Fréquentes - Création de Sites Web
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">
                  💰 Combien coûte la création d'un site web à Élancourt ?
                </h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Nos tarifs démarrent à <strong>950€ pour le pack Essential</strong> (site vitrine 1 à 3 pages,
                  responsive, formulaire de contact sécurisé), <strong>1 850€ pour le pack Business</strong>
                  (4 à 10 pages, CMS, blog, SEO avancé, formation) et <strong>4 000€ pour le pack Premium</strong>
                  (11 à 20 pages sur-mesure, animations, SEO expert). Tous nos devis sont gratuits et sans
                  engagement, réponse sous 24h.
                </p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">
                  ⏱️ Combien de temps pour créer mon site web ?
                </h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Le délai moyen est de <strong>2 à 4 semaines</strong> pour un site vitrine, 4 à 8 semaines
                  pour un site e-commerce complexe. Nous garantissons une livraison rapide avec un accompagnement
                  personnalisé et des points réguliers pour valider chaque étape ensemble.
                </p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">
                  📍 Nexus Développement est-il basé à Élancourt ?
                </h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Oui ! Nexus Développement est basé au <strong>4 rue de la Ferme, 78990 Élancourt</strong>,
                  dans les Yvelines. Nous nous déplaçons dans tout le département 78 et l'Île-de-France
                  (Trappes, Plaisir, Montigny-le-Bretonneux, Versailles...) pour rencontrer nos clients.
                </p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">
                  📱 Mon site sera-t-il optimisé pour mobiles ?
                </h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Absolument ! Tous nos sites sont <strong>100% responsive</strong> et optimisés pour smartphones,
                  tablettes et ordinateurs. Nous testons sur tous les appareils pour garantir une expérience
                  parfaite quel que soit l'écran de vos visiteurs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Bottom */}
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-900/20 to-slate-900/40 rounded-3xl p-12 border border-blue-500/20 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Vous avez un projet spécifique ?</h2>
            <p className="text-blue-200/70 mb-8 text-lg">
              Chaque entreprise est unique. Discutons de vos besoins particuliers et trouvons la solution idéale ensemble.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/#reservation')}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Réserver un appel découverte offert
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default WebsiteCreation;
