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
  { id: "website", label: "Création d'un site web" },
  { id: "webapp", label: "Application web" },
  { id: "mobile", label: "Application mobile" },
  { id: "automation", label: "Automatisation de processus" },
  { id: "logo", label: "Création de logo" },
  { id: "branding", label: "Branding visuel complet" },
  { id: "custom", label: "Service sur mesure" }
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
    
    // Validation basique
    if (!formData.name || !formData.email || formData.services.length === 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Vérification du consentement RGPD
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

      // Reset form
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
    } catch (error: any) {
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
    <section id="devis" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            Demande de Devis
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Parlez-nous de votre projet, nous vous répondons rapidement
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-slate-900/95 border-2 border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-white">Informations sur votre projet</CardTitle>
            <CardDescription className="text-blue-200/80">
              Remplissez ce formulaire pour obtenir un devis personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jean Dupont"
                    required
                    aria-required="true"
                    className="bg-white/10 border-blue-400/30 text-white placeholder:text-blue-200/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean@exemple.fr"
                    required
                    aria-required="true"
                    className="bg-white/10 border-blue-400/30 text-white placeholder:text-blue-200/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="bg-white/10 border-blue-400/30 text-white placeholder:text-blue-200/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-white">Type d'activité</Label>
                  <Select 
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-blue-400/30 text-white" aria-label="Type d'activité">
                      <SelectValue placeholder="Sélectionnez votre secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Services souhaités */}
              <div className="space-y-3">
                <Label className="text-white">Services souhaités *</Label>
                <div className="space-y-2">
                  {serviceTypes.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.services.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        className="border-blue-400/50 data-[state=checked]:bg-blue-500"
                      />
                      <label
                        htmlFor={service.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-blue-100"
                      >
                        {service.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Détails du projet */}
              <div className="space-y-2">
                <Label htmlFor="projectDetails" className="text-white">Décrivez votre projet</Label>
                <Textarea
                  id="projectDetails"
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  placeholder="Expliquez-nous vos besoins, vos objectifs et vos attentes..."
                  rows={5}
                  className="bg-white/10 border-blue-400/30 text-white placeholder:text-blue-200/50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-white">Budget estimé</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-blue-400/30 text-white" aria-label="Budget estimé">
                      <SelectValue placeholder="Sélectionnez une fourchette" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="timeline" className="text-white">Délai souhaité</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-blue-400/30 text-white" aria-label="Délai souhaité">
                      <SelectValue placeholder="Quand en avez-vous besoin ?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (moins de 2 semaines)</SelectItem>
                      <SelectItem value="1month">Dans le mois</SelectItem>
                      <SelectItem value="2-3months">2-3 mois</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* RGPD Consent */}
              <div className="flex items-start space-x-3 p-4 bg-blue-950/40 border border-blue-400/30 rounded-lg">
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
                  className="text-sm text-blue-100/90 leading-relaxed cursor-pointer"
                >
                  J'accepte que mes données personnelles soient utilisées pour traiter ma demande de devis. 
                  Vous pouvez consulter notre politique de confidentialité et vos droits dans nos{" "}
                  <Link 
                    to="/mentions-legales" 
                    target="_blank"
                    className="text-cyan-300 hover:text-cyan-200 underline font-medium"
                  >
                    mentions légales
                  </Link>
                  . *
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.consentGiven}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] border border-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                size="lg"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuoteForm;
