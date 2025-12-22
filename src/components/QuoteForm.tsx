import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Check, Send, Sparkles, Building2, Globe, Smartphone, Zap, Palette, PenTool, LayoutTemplate } from "lucide-react";

const businessTypes = [
  "Pizzeria / Restaurant",
  "Salon de coiffure / Esthétique",
  "E-commerce",
  "Coach / Consultant",
  "Artisan / Métier manuel",
  "Professionnel libéral",
  "Startup / Tech",
  "Autre"
];

const serviceTypes = [
  { id: "website", label: "Création d'un site web", icon: Globe, description: "Vitrine ou complet" },
  { id: "webapp", label: "Application web", icon: LayoutTemplate, description: "SaaS ou outil métier" },
  { id: "mobile", label: "Application mobile", icon: Smartphone, description: "iOS & Android" },
  { id: "automation", label: "Automatisation", icon: Zap, description: "Gain de temps" },
  { id: "logo", label: "Création de logo", icon: PenTool, description: "Identité forte" },
  { id: "branding", label: "Branding complet", icon: Palette, description: "Charte graphique" },
  { id: "custom", label: "Sur mesure", icon: Sparkles, description: "Projet spécifique" }
];

const QuoteForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    services: [] as string[],
    projectDetails: "",
    budget: "",
    timeline: "",
    consentGiven: false
  });

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || formData.services.length === 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (!formData.consentGiven) {
      toast({
        title: "Consentement requis",
        description: "Vous devez accepter la politique de confidentialité pour continuer",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-quote', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "✅ Demande envoyée !",
        description: "Nous reviendrons vers vous dans les plus brefs délais.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        businessType: "",
        services: [],
        projectDetails: "",
        budget: "",
        timeline: "",
        consentGiven: false
      });
    } catch (error) {
      console.error("Error sending quote:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="devis" className="py-12 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[40px] md:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[40px] md:blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]"
          >
            Demande de Devis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-blue-100/80 max-w-2xl mx-auto"
          >
            Parlez-nous de votre projet, nous construisons l'avenir ensemble
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

            <CardHeader className="text-center pb-8 border-b border-white/5">
              <CardTitle className="text-2xl text-white">Démarrons votre projet</CardTitle>
              <CardDescription className="text-blue-200/60">
                Remplissez ce formulaire pour obtenir une estimation précise
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-6 md:px-10">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section: Contact */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm border border-blue-500/30">1</span>
                    Vos informations
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-200">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jean Dupont"
                        required
                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-200/20 focus:border-blue-400/50 focus:bg-slate-800/80 transition-all h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-200">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jean@exemple.fr"
                        required
                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-200/20 focus:border-blue-400/50 focus:bg-slate-800/80 transition-all h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-200">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+33 6 12 34 56 78"
                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-200/20 focus:border-blue-400/50 focus:bg-slate-800/80 transition-all h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-blue-200">Type d'activité</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white h-11 focus:ring-blue-500/30">
                          <SelectValue placeholder="Sélectionnez votre secteur" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type} className="focus:bg-blue-600/20 focus:text-blue-200">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                {/* Section: Services */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm border border-blue-500/30">2</span>
                    Services souhaités *
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {serviceTypes.map((service) => {
                      const Icon = service.icon;
                      const isSelected = formData.services.includes(service.id);
                      return (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleServiceToggle(service.id)}
                          className={`cursor-pointer relative p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center gap-3 ${isSelected
                            ? "bg-blue-600/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            : "bg-slate-800/30 border-white/5 hover:bg-slate-800/60 hover:border-white/20"
                            }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-slate-700/50 text-slate-400"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-blue-100/70"}`}>
                              {service.label}
                            </p>
                            <p className="text-xs text-blue-200/40">{service.description}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 text-blue-400">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                {/* Section: Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm border border-blue-500/30">3</span>
                    Détails du projet
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="projectDetails" className="text-blue-200">Description</Label>
                    <Textarea
                      id="projectDetails"
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      placeholder="Décrivez vos objectifs, vos références, et les fonctionnalités clés..."
                      rows={5}
                      className="bg-slate-800/50 border-white/10 text-white placeholder:text-blue-200/20 focus:border-blue-400/50 focus:bg-slate-800/80 transition-all resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-blue-200">Budget estimé</Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => setFormData({ ...formData, budget: value })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white h-11">
                          <SelectValue placeholder="Votre budget" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          <SelectItem value="<500">Moins de 500€</SelectItem>
                          <SelectItem value="500-1000">500€ - 1 000€</SelectItem>
                          <SelectItem value="1000-2500">1 000€ - 2 500€</SelectItem>
                          <SelectItem value="2500-5000">2 500€ - 5 000€</SelectItem>
                          <SelectItem value="5000-10000">5 000€ - 10 000€</SelectItem>
                          <SelectItem value=">10000">Plus de 10 000€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-blue-200">Délai souhaité</Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                      >
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white h-11">
                          <SelectValue placeholder="Votre échéance" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          <SelectItem value="urgent">Urgent (moins de 2 semaines)</SelectItem>
                          <SelectItem value="1month">Dans le mois</SelectItem>
                          <SelectItem value="2-3months">2-3 mois</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="flex items-start space-x-3 p-4 bg-blue-900/10 border border-blue-500/10 rounded-lg">
                  <Checkbox
                    id="consent"
                    checked={formData.consentGiven}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, consentGiven: checked as boolean })
                    }
                    className="mt-1 border-blue-400/50 data-[state=checked]:bg-blue-500"
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm text-blue-200/80 leading-relaxed cursor-pointer select-none"
                  >
                    J'accepte que mes données soient traitées pour cette demande. Voir nos{" "}
                    <Link
                      to="/mentions-legales"
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      mentions légales
                    </Link>
                    .
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.consentGiven}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold h-14 text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                    {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteForm;
