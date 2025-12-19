import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, CheckCircle, Monitor, Smartphone, Zap, Search, Rocket, Code, Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";

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
                    L'excellence digitale
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
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Comment nous travaillons</h2>
              <p className="text-blue-200/60 max-w-2xl mx-auto">Une méthodologie éprouvée pour des résultats prévisibles et de qualité.</p>
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
                Nos Offres Claires
              </h2>
              <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
                Des solutions clé en main pour démarrer sereinement. Transparence totale, aucun coût caché.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} index={index} />
              ))}
            </div>
          </div>

          {/* FAQ / CTA Bottom */}
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
      <ChatBotWidget />
    </div>
  );
};

export default WebsiteCreation;
