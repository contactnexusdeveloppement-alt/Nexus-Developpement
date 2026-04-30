import { useNavigate, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Globe,
  Smartphone,
  Zap,
  Palette,
  Phone,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { getCityBySlug } from "@/data/localCities";
import {
  breadcrumbSchema,
  faqSchema,
  localServiceSchema,
} from "@/lib/schemas";

interface LocalCityProps {
  slug: string;
}

const LocalCity = ({ slug }: LocalCityProps) => {
  const navigate = useNavigate();
  const city = getCityBySlug(slug);

  if (!city) {
    return <Navigate to="/" replace />;
  }

  const services = [
    {
      icon: Globe,
      title: "Création de site web",
      description: `Sites vitrines modernes pour les TPE et PME de ${city.name}. Design responsive, score PageSpeed 95+, livraison sous 2 à 4 semaines.`,
      href: "/creation-site-web",
      from: "à partir de 950€",
    },
    {
      icon: Smartphone,
      title: "Applications mobiles",
      description: `Apps iOS et Android pour les entreprises de ${city.name} qui veulent fidéliser ou outiller leurs clients.`,
      href: "/applications-mobiles",
      from: "à partir de 4 000€",
    },
    {
      icon: Zap,
      title: "Automatisation",
      description: `Automatisez devis, factures, relances, onboarding clients. ROI mesurable dès le premier mois pour vos équipes à ${city.name}.`,
      href: "/automatisation",
      from: "à partir de 450€",
    },
    {
      icon: Palette,
      title: "Identité visuelle",
      description: `Logo, charte graphique et brand book pour les marques émergentes de ${city.name} et des Yvelines.`,
      href: "/identite-visuelle",
      from: "à partir de 250€",
    },
  ];

  const faqs = [
    {
      q: `Nexus Développement intervient-il vraiment à ${city.name} ?`,
      a: `Oui, sans aucune restriction. Nous sommes basés au 4 rue de la Ferme, 78990 Élancourt, à seulement ${city.distanceFromElancourt} de ${city.name} en voiture. Nous proposons systématiquement un rendez-vous découverte gratuit en présentiel chez vous (commerce, bureau, atelier), avec un café offert, sans aucun frais de déplacement. Pour les phases suivantes (cadrage du projet, validation des maquettes Figma, recette finale, formation à la prise en main du site), nous nous déplaçons à nouveau sans surcoût dans tout le rayon de 30 km autour d'Élancourt — ce qui couvre largement ${city.name} et les communes environnantes des Yvelines. Si vous préférez travailler à distance, nous proposons aussi tous nos rendez-vous en visioconférence (Google Meet ou Zoom) avec partage d'écran et enregistrement systématique pour que vous puissiez revoir les échanges.`,
    },
    {
      q: `Combien coûte la création d'un site web pour une entreprise à ${city.name} ?`,
      a: `Nos tarifs sont identiques à ${city.name} et dans toutes les communes des Yvelines, sans facturation supplémentaire pour le déplacement. Le pack Essential démarre à 950 € HT (1 à 3 pages, design responsive, formulaire de contact, hébergement et SSL inclus 1 mois, livraison 10 jours ouvrés). Le pack Business à 1 850 € HT couvre 4 à 10 pages avec un CMS pour gérer le contenu vous-même, un module blog pour le SEO, du référencement avancé et 1 mois de support. Le pack Premium à 4 000 € HT propose 11 à 20 pages 100 % sur-mesure, des animations Framer Motion, une stratégie SEO complète et 3 mois de support prioritaire. Tous nos devis sont rédigés sous 24 heures, gratuits et sans engagement, et nos prix sont publics sur le site (pas de devis opaque).`,
    },
    {
      q: `En combien de temps mon site sera-t-il visible sur Google à ${city.name} ?`,
      a: `L'indexation Google se fait sous 1 à 2 semaines après mise en ligne, à condition que le sitemap soit soumis dans Google Search Console (nous nous en occupons). Pour bien ressortir sur les requêtes locales type "votre métier ${city.name}" ou "votre métier 78", comptez 2 à 4 mois en moyenne avec une stratégie SEO local solide. Cela inclut : optimisation complète de votre fiche Google Business Profile (choix des catégories, photos, services, FAQ, gestion des avis), schemas JSON-LD géolocalisés (LocalBusiness avec areaServed sur ${city.name}), contenu enrichi mentionnant les quartiers et points d'intérêt locaux, et citations cohérentes sur les annuaires professionnels (Pages Jaunes, Sortlist, Codeur, Apple Maps). Pour les requêtes très concurrentielles, l'effort SEO peut s'étaler sur 6 à 9 mois mais les premiers résultats apparaissent toujours dès le 3e mois.`,
    },
    {
      q: `Pouvez-vous m'aider à optimiser ma fiche Google Business Profile à ${city.name} ?`,
      a: `Oui, l'optimisation complète de votre fiche Google Business Profile est incluse dans nos packs Business et Premium, et disponible en option sur le pack Essential. Concrètement, nous prenons en charge : la création ou réclamation de la fiche, le choix des catégories pertinentes (catégorie principale + 2 à 3 secondaires), la rédaction d'une description optimisée pour le SEO local, l'ajout de toutes vos prestations avec descriptifs et tarifs indicatifs, l'upload de 10 à 20 photos professionnelles (logo, équipe, locaux, réalisations), la création des sections FAQ et "Posts" hebdomadaires, et la mise en place d'une stratégie de réponse aux avis (positifs comme négatifs). À ${city.name} comme dans toutes les villes des Yvelines, Google Business Profile est le levier n°1 de visibilité locale et représente souvent 40 à 60 % du trafic web d'une PME locale.`,
    },
    {
      q: `Pourquoi choisir une agence locale Yvelines plutôt qu'un freelance distant ou une agence parisienne ?`,
      a: `La proximité géographique (${city.distanceFromElancourt} de ${city.name} seulement) permet d'organiser de vrais ateliers de cadrage en présentiel, autour d'un café, qui sont 3 à 4 fois plus efficaces qu'une visioconférence pour comprendre votre activité, votre clientèle, vos contraintes opérationnelles. Nous connaissons intimement le tissu économique local des Yvelines : les flux clients entre Versailles, Saint-Quentin-en-Yvelines, Plaisir, les habitudes des consommateurs locaux, les pôles d'activité (Pariwest, Open Sky, Gare TGV de Montigny). Vous avez un interlocuteur identifié et joignable, pas un sous-traitant à l'autre bout du monde ou un commercial parisien qui vous délègue à un junior. Côté tarifs, nous sommes 30 à 50 % moins chers que les grandes agences parisiennes pour une qualité de livraison équivalente, sans rien sacrifier sur la stack technique (React, TypeScript, Vercel) ni sur la cession totale des droits.`,
    },
  ];

  const url = `/${city.slug}`;
  const title = `Agence Web ${city.name} (${city.postalCode}) — Création de Site, Apps, Automatisation | Nexus Développement`;
  const description = `Agence web à ${city.distanceFromElancourt} de ${city.name}. Création de sites web professionnels, applications mobiles, automatisation et identité visuelle pour TPE et PME. Devis gratuit en 24h.`;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SEO
        title={title}
        description={description}
        type="website"
        canonical={url}
        schemas={[
          localServiceSchema({
            city: city.name,
            postalCode: city.postalCode,
            url,
            description,
          }),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: `Agence web ${city.name}`, url },
          ]),
        ]}
      />

      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 pt-32 pb-20">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 mb-8 pl-0 transition-all rounded-full px-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
          </Button>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6 backdrop-blur-md">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-200">
                {city.name} ({city.postalCode}) — {city.distanceFromElancourt} d'Élancourt
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Agence Web à {city.name}
              <br />
              <span className="text-2xl md:text-4xl text-blue-200/70">
                Sites, Apps, Automatisation
              </span>
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed mb-8">
              {city.intro}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/#reservation")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all hover:scale-105"
              >
                Réserver un appel offert
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/#contact")}
                className="border-white/10 text-white hover:bg-white/5 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
              >
                Demander un devis
              </Button>
            </div>
          </motion.div>

          {/* Contexte local */}
          <div className="max-w-4xl mb-20 prose prose-invert prose-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Le digital à {city.name} : les enjeux pour votre entreprise
            </h2>
            <p className="text-lg text-blue-100/80 leading-relaxed mb-6">
              {city.context}
            </p>

            <h3 className="text-2xl font-bold text-white mb-4 mt-8">
              Quartiers et zones où nous intervenons
            </h3>
            <ul className="space-y-2 text-blue-100/80">
              {city.zones.map((zone) => (
                <li key={zone} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span>{zone}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-2xl font-bold text-white mb-4 mt-8">
              Secteurs locaux que nous accompagnons
            </h3>
            <ul className="space-y-2 text-blue-100/80">
              {city.sectors.map((sector) => (
                <li key={sector} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="capitalize">{sector}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services pour la ville */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Nos services pour les entreprises de {city.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <button
                  key={service.title}
                  onClick={() => navigate(service.href)}
                  className="text-left h-full bg-slate-900/40 border border-white/5 p-8 rounded-2xl hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-blue-200/70 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="text-cyan-400 font-semibold text-sm">
                    {service.from} →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ locale */}
          <div className="mb-20 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Questions fréquentes — agence web {city.name}
            </h2>
            <div className="space-y-6">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{item.q}</h3>
                  <p className="text-blue-100/80 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA bas + contact direct */}
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-900/20 to-slate-900/40 rounded-3xl p-12 border border-blue-500/20 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à booster votre présence digitale à {city.name} ?
            </h2>
            <p className="text-blue-200/70 mb-8 text-lg">
              30 minutes d'appel découverte, sans engagement, pour comprendre vos besoins et vous proposer la meilleure approche.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <Button
                size="lg"
                onClick={() => navigate("/#reservation")}
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                Réserver mon appel offert
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 justify-center text-blue-100/70 text-sm">
              <a
                href="tel:+33761847580"
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <Phone className="w-4 h-4" /> +33 7 61 84 75 80
              </a>
              <a
                href="mailto:contact.nexus.developpement@gmail.com"
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-4 h-4" /> contact.nexus.developpement@gmail.com
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LocalCity;
