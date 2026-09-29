import Navigation from "@/components/Navigation";
import { intro } from "@/lib/motion";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  CreditCard,
  Truck,
  Package,
  Search,
  Layout,
  Code,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import { projects } from "@/data/projects";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schemas";

const FAQ_ECOMMERCE = [
  {
    q: "Combien coûte la création d'une boutique en ligne ?",
    a: "Nos boutiques démarrent à 2 000 € HT (Boutique Starter : jusqu'à 50 produits, panier, paiement par carte, gestion des commandes), 3 500 € HT pour l'E-commerce Standard (50 à 200 produits, Stripe ou PayPal, stock et variantes, frais de port, comptes clients, 2 mois de support) et 5 500 € HT pour l'E-commerce Advanced (200 à 500 produits, multi-devises et multi-langues, suivi des expéditions, avis clients, codes promo, support prioritaire 3 mois). L'hébergement et la maintenance sont facturés à partir de 100 € HT par mois selon le pack. Le devis est gratuit et nous répondons sous 24 h ouvrées.",
  },
  {
    q: "Shopify, WooCommerce ou développement sur-mesure : que choisir ?",
    a: "Nous choisissons la plateforme selon votre catalogue et vos outils existants. Shopify (en thème ou en headless avec une interface React sur-mesure) convient aux marques qui veulent un back-office simple, des paiements et une logistique fiables sans gérer de serveur : c'est le choix retenu pour Arno Polynice et Bodystart Nutrition. WooCommerce est pertinent si vous avez déjà un site WordPress et un catalogue à y intégrer, comme pour Orient Relais. Une boutique entièrement sur-mesure (React, Stripe, base de données) ne se justifie que pour des règles métier particulières : configurateurs, tarifs par client, abonnements complexes.",
  },
  {
    q: "Combien de temps faut-il pour lancer une boutique en ligne ?",
    a: "Comptez 6 à 10 semaines selon la taille du catalogue : une à deux semaines de cadrage (catalogue, livraison, paiement, TVA), deux semaines de design du parcours d'achat, trois à cinq semaines de développement et d'intégrations (paiement, transporteurs, emails de commande), puis une semaine de recette avec des commandes de test avant la mise en ligne. Vous validez chaque étape en cours de route.",
  },
  {
    q: "Le paiement et les données clients sont-ils sécurisés ?",
    a: "Les paiements passent par Stripe, PayPal ou Shopify Payments : les numéros de carte ne transitent jamais par votre site et l'authentification forte (3-D Secure) est gérée par le prestataire. Les comptes clients, adresses et commandes sont stockés chez l'éditeur de la plateforme ou dans une base hébergée en Europe. Nous livrons les mentions obligatoires d'une boutique en ligne : CGV adaptées à la vente à distance, politique de confidentialité, informations sur le droit de rétractation et la livraison.",
  },
  {
    q: "Pouvez-vous reprendre une boutique existante ?",
    a: "Oui. Nous commençons par un audit de la boutique actuelle (vitesse, tunnel d'achat, SEO, paiements, données) puis nous proposons soit des corrections ciblées, soit une refonte avec migration du catalogue, des clients et de l'historique des commandes. La refonte d'Orient Relais s'est faite sans interruption de vente.",
  },
];

const Ecommerce = () => {
  const navigate = useNavigate();
  const pricingPlans = pricingData.find((c) => c.id === "ecommerce")?.plans || [];
  const clientProjects = projects.filter((p) => !p.isDemo);

  const processSteps = [
    {
      icon: Search,
      title: "1. Cadrage",
      description: "Catalogue, variantes, livraison, paiement, TVA : on pose les règles de votre boutique avant de dessiner quoi que ce soit.",
    },
    {
      icon: Layout,
      title: "2. Parcours d'achat",
      description: "Fiches produits, panier et tunnel de commande maquettés et validés ensemble, mobile en premier.",
    },
    {
      icon: Code,
      title: "3. Développement",
      description: "Intégration de la plateforme (Shopify, WooCommerce ou sur-mesure), des paiements, des transporteurs et des emails de commande.",
    },
    {
      icon: Rocket,
      title: "4. Lancement",
      description: "Commandes de test, mise en ligne, formation à la gestion des produits et des commandes.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SEO
        title="Création de site e-commerce | Nexus Développement Élancourt"
        description="Boutique en ligne sur-mesure (Shopify, WooCommerce, Stripe) pour commerces et marques : catalogue, paiement, logistique. Devis gratuit sous 24 h."
        type="website"
        canonical="/e-commerce"
        schemas={[
          serviceSchema({
            name: "Création de site e-commerce",
            description: "Boutiques en ligne pour commerces et marques : Shopify (thème ou headless), WooCommerce ou développement sur-mesure, paiement Stripe/PayPal, logistique et emails de commande.",
            url: "/e-commerce",
            serviceType: "E-commerce Development",
            areaServed: ["Yvelines", "Île-de-France", "France"],
            offers: [
              { name: "Boutique Starter", price: 2000, description: "Jusqu'à 50 produits, panier, paiement CB, gestion des commandes" },
              { name: "E-commerce Standard", price: 3500, description: "50 à 200 produits, Stripe/PayPal, stock et variantes, comptes clients" },
              { name: "E-commerce Advanced", price: 5500, description: "200 à 500 produits, multi-devises, expéditions, avis, promotions" },
            ],
          }),
          faqSchema(FAQ_ECOMMERCE),
          breadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: "Site e-commerce", url: "/e-commerce" },
          ]),
        ]}
      />

      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero */}
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
              initial={intro({ opacity: 0, x: -50 })}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20 mb-8 backdrop-blur-md">
                <ShoppingCart className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                Sites E-commerce
                <br />
                <span className="text-3xl md:text-5xl text-blue-200/50">Vendre en ligne, sans friction</span>
              </h1>
              <p className="text-xl text-blue-100/70 leading-relaxed mb-10 max-w-lg">
                Trois boutiques livrées et en production : Arno Polynice, Orient Relais, Bodystart Nutrition.
                Catalogue, paiement, logistique : une boutique pensée pour convertir et simple à gérer au quotidien.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("tarifs")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all hover:scale-105"
                >
                  Voir les offres
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("realisations")?.scrollIntoView({ behavior: "smooth" })}
                  className="border-white/10 text-white hover:bg-white/5 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
                >
                  Voir les boutiques livrées
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={intro({ opacity: 0, scale: 0.9 })}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-[100px] rounded-full" />
              <Card className="relative bg-slate-900/40 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-10 space-y-8">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Package className="w-6 h-6 text-blue-400" />
                    Ce que comprend votre boutique
                  </h3>
                  <div className="space-y-6">
                    {[
                      { icon: CheckCircle, title: "Plateforme adaptée à votre volume", text: "Shopify en thème ou en headless, WooCommerce si vous êtes déjà sur WordPress, sur-mesure pour les règles métier particulières." },
                      { icon: CreditCard, title: "Paiement sécurisé", text: "Stripe, PayPal ou Shopify Payments avec authentification forte ; aucune donnée de carte ne transite par votre site." },
                      { icon: Truck, title: "Logistique intégrée", text: "Frais de port calculés, étiquettes et suivi d'expédition, emails de confirmation et de livraison." },
                      { icon: Search, title: "Fiches produits qui se référencent", text: "Structure SEO, données produit balisées, performance mobile soignée." },
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

          {/* Réalisations e-commerce */}
          <div id="realisations" className="mb-32 scroll-mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Trois boutiques en ligne, livrées et en production</h2>
              <p className="text-blue-200/60 max-w-2xl mx-auto">Des clients réels, des boutiques qui vendent. Cliquez pour les visiter.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {clientProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visiter la boutique ${project.title} (nouvelle fenêtre)`}
                    className="group block h-full bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <div className="aspect-[8/5] overflow-hidden bg-slate-800">
                      <img
                        src={project.image}
                        alt={project.altText}
                        width={800}
                        height={500}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        {project.title}
                        <ExternalLink className="w-4 h-4 text-cyan-400 opacity-70" aria-hidden="true" />
                      </h3>
                      <p className="text-blue-200/60 text-sm leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-200 border border-blue-400/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div id="process" className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Comment se déroule la création de votre boutique ?</h2>
              <p className="text-blue-200/60 max-w-2xl mx-auto">Quatre étapes, un point de validation à chacune.</p>
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

          {/* Tarifs */}
          <div id="tarifs" className="mb-20 scroll-mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                Quel pack e-commerce pour votre catalogue ?
              </h2>
              <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
                Trois packs selon la taille du catalogue. Prix HT, hébergement et maintenance en sus.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} categoryId="ecommerce" index={index} />
              ))}
            </div>
          </div>

          {/* FAQ (même source que le JSON-LD FAQPage) */}
          <div className="mb-20 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Questions fréquentes - Site e-commerce
            </h2>
            <div className="space-y-6">
              {FAQ_ECOMMERCE.map((item) => (
                <div key={item.q} className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-3">{item.q}</h3>
                  <p className="text-blue-100/80 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-900/20 to-slate-900/40 rounded-3xl p-12 border border-blue-500/20 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6">Vous avez un catalogue à mettre en ligne ?</h2>
            <p className="text-blue-200/70 mb-8 text-lg">
              Parlons de vos produits, de votre logistique et de vos outils actuels : on vous dit quelle plateforme convient et à quel prix.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/#reservation")}
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

export default Ecommerce;
