import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, CheckCircle, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";

const WebsiteCreation = () => {
  const navigate = useNavigate();
  const pricingPlans = pricingData.find(c => c.id === 'sites')?.plans || [];

  const features = [
    "Design moderne et responsive",
    "Optimisation SEO pour le référencement",
    "Performance et rapidité de chargement",
    "Interface administration facile",
    "Hébergement sécurisé",
    "Support technique réactif"
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 py-32">
          <Button
            variant="ghost"
            className="text-white hover:text-blue-400 mb-8 p-0 hover:bg-transparent"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
          </Button>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 mb-6">
                <Globe className="w-8 h-8 text-blue-300" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent">
                Sites Vitrine
              </h1>
              <p className="text-xl text-blue-100/80 leading-relaxed mb-8">
                Propulsez votre présence en ligne avec un site web vitrine professionnel. Contrairement à une application web complexe, le site vitrine est conçu pour présenter votre activité, vos services et convertir vos visiteurs en prospect qualifiés.
              </p>
              <Button
                size="lg"
                onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Voir les offres
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <Card className="relative bg-black/40 border-blue-500/30 backdrop-blur-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Pourquoi un site vitrine ?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Monitor className="w-12 h-12 text-blue-400 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">Visibilité 24/7</h4>
                        <p className="text-blue-200/70 text-sm">Votre entreprise reste ouverte même quand vous dormez. Présentez vos offres à tout moment.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <CheckCircle className="w-12 h-12 text-blue-400 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">Crédibilité Professionnelle</h4>
                        <p className="text-blue-200/70 text-sm">Un site moderne renforce la confiance de vos futurs clients et vous démarque de la concurrence.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div id="tarifs" className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent">
                Nos Offres de Création
              </h2>
              <p className="text-lg text-white/90">Des packs tout inclus pour démarrer sereinement</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} index={index} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
      <ChatBotWidget />
    </div>
  );
};

export default WebsiteCreation;
