import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  priceColor: string;
  additionalInfo?: string;
  targetAudience?: string;
};

type Category = {
  id: string;
  label: string;
  icon: string;
  plans: PricingPlan[];
};

const pricingData: Category[] = [
  {
    id: "sites",
    label: "Sites Vitrine",
    icon: "🌐",
    plans: [
      {
        name: "Essential",
        price: "890€",
        priceColor: "from-cyan-400 to-cyan-600",
        description: "Votre présence digitale professionnelle en quelques jours",
        features: [
          "Page responsive design moderne",
          "Formulaire de contact intelligent",
          "Optimisation SEO & mobile",
          "Certificat SSL & sécurité",
          "3 mois d'hébergement premium",
          "Support technique dédié"
        ],
        additionalInfo: "Hébergement 50€/mois après 3 mois offerts",
        targetAudience: "Parfait pour les entrepreneurs et petites structures"
      },
      {
        name: "Business",
        price: "1 290€",
        priceColor: "from-blue-400 via-blue-500 to-blue-600",
        description: "L'excellence digitale pour votre entreprise",
        features: [
          "Site multi-pages professionnel",
          "Animations & transitions fluides",
          "SEO avancé & performance optimale",
          "Intégration réseaux sociaux",
          "Analytics détaillés",
          "Formation personnalisée",
          "3 mois d'hébergement premium",
          "Support prioritaire 24/7"
        ],
        isPopular: true,
        additionalInfo: "Hébergement 90€/mois après 3 mois offerts",
        targetAudience: "Idéal pour les entreprises en croissance"
      },
      {
        name: "Premium",
        price: "1 990€",
        priceColor: "from-blue-500 via-blue-600 to-blue-700",
        description: "Solution sur mesure pour une identité digitale exceptionnelle",
        features: [
          "UI/UX design exclusif sur Figma",
          "CMS personnalisé intuitif",
          "Fonctionnalités avancées sur mesure",
          "SEO & référencement local complet",
          "Maintenance premium 3 mois",
          "Formation équipe complète",
          "3 mois d'hébergement premium",
          "Support VIP illimité"
        ],
        additionalInfo: "Hébergement 150€/mois après 3 mois offerts",
        targetAudience: "Pour les marques d'excellence"
      }
    ]
  },
  {
    id: "automatisation",
    label: "Automatisation",
    icon: "⚡",
    plans: [
      {
        name: "Workflow Simple",
        price: "Sur devis",
        priceColor: "from-cyan-400 to-cyan-600",
        description: "Automatisez vos tâches répétitives",
        features: [
          "Analyse approfondie du processus",
          "1 workflow automatisé sur mesure",
          "Intégration outils existants",
          "Documentation technique complète",
          "Formation personnalisée",
          "Support 3 mois",
          "Maintenance 50€/mois"
        ],
        additionalInfo: "1 mois de maintenance offert",
        targetAudience: "Gagnez du temps au quotidien"
      },
      {
        name: "Workflow Avancé",
        price: "Sur devis",
        priceColor: "from-blue-400 via-blue-500 to-blue-600",
        description: "Automatisations complexes interconnectées",
        features: [
          "Workflows multiples synchronisés",
          "Intégrations avancées (CRM, ERP, etc.)",
          "API & webhooks personnalisés",
          "Dashboard de monitoring",
          "Formation équipe complète",
          "Support prioritaire 6 mois",
          "Maintenance 80€/mois"
        ],
        isPopular: true,
        additionalInfo: "2 mois de maintenance offerts",
        targetAudience: "Optimisation totale de vos processus"
      }
    ]
  },
  {
    id: "webapp",
    label: "Applications Web",
    icon: "💻",
    plans: [
      {
        name: "Web Essential",
        price: "Sur devis",
        priceColor: "from-cyan-400 to-cyan-600",
        description: "Application web moderne et performante",
        features: [
          "Interface utilisateur intuitive",
          "Authentification sécurisée",
          "Base de données intégrée",
          "Responsive design adaptatif",
          "API REST personnalisée",
          "Hébergement cloud inclus",
          "Support technique 3 mois"
        ],
        targetAudience: "Lancez votre projet web rapidement"
      },
      {
        name: "Web Business",
        price: "Sur devis",
        priceColor: "from-blue-400 via-blue-500 to-blue-600",
        description: "Solution web complète et évolutive",
        features: [
          "Architecture scalable professionnelle",
          "Dashboard admin personnalisé",
          "Gestion utilisateurs avancée",
          "Intégrations API tierces",
          "Analytics et reporting détaillés",
          "Paiements en ligne sécurisés",
          "Formation équipe complète",
          "Support prioritaire 6 mois"
        ],
        isPopular: true,
        targetAudience: "Pour des applications professionnelles"
      },
      {
        name: "Web Enterprise",
        price: "Sur devis",
        priceColor: "from-blue-500 via-blue-600 to-blue-700",
        description: "Plateforme web sur mesure haute performance",
        features: [
          "Architecture microservices avancée",
          "UI/UX design premium Figma",
          "Intégrations complexes (ERP, CRM)",
          "Sécurité renforcée enterprise",
          "Multi-tenancy & SaaS ready",
          "CI/CD & DevOps complet",
          "Infrastructure cloud optimisée",
          "Support VIP & maintenance illimitée"
        ],
        targetAudience: "Solutions d'envergure enterprise"
      }
    ]
  },
  {
    id: "mobile",
    label: "Applications Mobiles",
    icon: "📱",
    plans: [
      {
        name: "App Starter",
        price: "Sur devis",
        priceColor: "from-cyan-400 to-cyan-600",
        description: "Lancez votre application mobile iOS et Android",
        features: [
          "Développement React Native",
          "Design responsive adaptatif",
          "3-5 écrans principaux",
          "Authentification utilisateur",
          "Notifications push basiques",
          "Tests sur appareils réels",
          "Support technique 3 mois"
        ],
        targetAudience: "Pour démarrer votre présence mobile"
      },
      {
        name: "App Business",
        price: "Sur devis",
        priceColor: "from-blue-400 via-blue-500 to-blue-600",
        description: "Application mobile complète et performante",
        features: [
          "Architecture scalable",
          "Backend & API personnalisés",
          "Synchronisation cloud temps réel",
          "Géolocalisation GPS intégrée",
          "Paiements in-app sécurisés",
          "Analytics utilisateur avancés",
          "Support & maintenance 6 mois"
        ],
        isPopular: true,
        targetAudience: "Solution complète pour entreprises"
      },
      {
        name: "App Enterprise",
        price: "Sur devis",
        priceColor: "from-blue-500 via-blue-600 to-blue-700",
        description: "Application d'entreprise haut de gamme",
        features: [
          "Architecture native iOS + Android",
          "UI/UX premium avec prototypage",
          "Intégrations complexes (CRM, ERP)",
          "Sécurité renforcée enterprise",
          "Dashboard admin personnalisé",
          "Déploiement App Store + Play Store",
          "Support VIP & mises à jour continues"
        ],
        targetAudience: "Pour les projets d'envergure"
      }
    ]
  },
  {
    id: "identite",
    label: "Identité Visuelle",
    icon: "🎨",
    plans: [
      {
        name: "Logo Pro",
        price: "Sur devis",
        priceColor: "from-cyan-400 via-cyan-500 to-blue-500",
        description: "Un logo unique qui marque les esprits",
        features: [
          "Logo professionnel sur mesure",
          "3 propositions créatives",
          "Révisions illimitées",
          "Palette de couleurs dédiée",
          "Fichiers haute résolution",
          "Guide d'utilisation complet"
        ],
        targetAudience: "Créez votre identité mémorable"
      },
      {
        name: "Branding 360",
        price: "Sur devis",
        priceColor: "from-blue-400 via-blue-500 to-blue-600",
        description: "Identité de marque complète et cohérente",
        features: [
          "Identité visuelle complète",
          "Charte graphique professionnelle",
          "Maquettes UI/UX sur Figma",
          "Templates réseaux sociaux",
          "Kit marketing complet",
          "Guide de marque détaillé",
          "Support & ajustements inclus"
        ],
        targetAudience: "Marque professionnelle de A à Z"
      }
    ]
  }
];

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState("sites");
  const activePlans = pricingData.find(cat => cat.id === activeCategory)?.plans || [];
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const scrollToQuote = () => {
    const element = document.getElementById('devis');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="tarifs" className="py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            Nos Tarifs
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Des prix transparents et compétitifs pour tous vos projets digitaux
          </p>
        </div>

        {/* Onglets de catégories */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`} style={{ transitionDelay: "200ms" }}>
          {pricingData.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  : "bg-white/10 text-white hover:bg-white/20 border border-blue-400/30"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Cartes de tarification */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {activePlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-2 transition-all duration-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] group ${
                isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-5"
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                borderImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 211, 238, 0.4)) 1',
                transitionDelay: `${(index + 2) * 150}ms`
              }}
            >
              {/* Badge Populaire */}
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 z-20">
                  <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white text-center py-2 font-bold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.5)]">
                    ⭐ PLUS POPULAIRE
                  </div>
                </div>
              )}

              <CardContent className={`p-8 relative z-10 ${plan.isPopular ? 'pt-16' : ''}`}>
                {/* Nom du plan */}
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{plan.name}</h3>
                
                {/* Prix */}
                <div className="mb-6">
                  <p className="text-sm text-blue-300/70 mb-2 uppercase tracking-wider">à partir de</p>
                  <p className={`text-6xl font-black bg-gradient-to-r ${plan.priceColor} bg-clip-text text-transparent mb-3 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]`}>
                    {plan.price}
                  </p>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Liste des fonctionnalités */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-blue-100/95 text-sm leading-relaxed font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton */}
                <Button
                  onClick={scrollToQuote}
                  className={`w-full bg-gradient-to-r ${plan.priceColor} hover:opacity-90 text-white font-bold py-6 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-[1.02] border-2 border-white/10`}
                >
                  {plan.buttonText || "Choisir cette formule"}
                </Button>

                {/* Informations supplémentaires */}
                {plan.additionalInfo && (
                  <p className="text-center text-xs text-blue-200/60 mt-4 font-medium">
                    {plan.additionalInfo}
                  </p>
                )}

                {/* Public cible */}
                {plan.targetAudience && (
                  <div className="mt-4 pt-4 border-t border-blue-400/20">
                    <p className="text-center text-sm text-cyan-300/90 italic font-medium">
                      {plan.targetAudience}
                    </p>
                  </div>
                )}
              </CardContent>

              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-cyan-500/10 to-transparent" />
              </div>

              {/* Bordure animée */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 blur-xl" />
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-white/90 mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Besoin d'un service sur mesure ?
          </p>
          <button
            onClick={scrollToQuote}
            className="text-blue-300 hover:text-blue-200 font-semibold underline transition-colors"
          >
            Contactez-nous pour un devis personnalisé
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
