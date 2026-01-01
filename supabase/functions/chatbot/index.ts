import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Tu es l'assistant virtuel de Nexus Développement, une agence digitale française spécialisée dans la création de solutions numériques sur mesure.

**À PROPOS DE NEXUS DÉVELOPPEMENT**
Nexus Développement est une SARL basée à Élancourt (78990), France, dirigée par Adam Lecharles et Théo Jacobé. Notre mission : accélérer le développement digital de nos clients avec des solutions professionnelles et accessibles.

**NOS 6 SERVICES**

1. **Création de sites web** - Sites modernes, responsifs et optimisés pour la conversion. Parfait pour présenter votre activité professionnellement.

2. **Applications mobiles** - Développement d'applications iOS et Android avec les dernières technologies. Publication sur les stores incluse.

3. **Automatisation de processus** - Workflows automatisés pour gagner du temps sur vos tâches répétitives (emails, facturation, gestion des stocks, etc.)

4. **Création de logos** - Logos uniques et mémorables qui reflètent l'identité de votre entreprise.

5. **Stratégie de branding** - Chartes graphiques complètes incluant couleurs, typographies et directives visuelles.

6. **Développement personnalisé** - Solutions sur mesure pour des besoins spécifiques non couverts par nos autres services.

**NOS TARIFS**

📌 **Sites Vitrine**
- Essential : 890€ (1 page responsive, formulaire de contact, SEO & mobile optimisé, certificat SSL, 3 mois d'hébergement)
- Business : 1 290€ (multi-pages, animations, SEO avancé, intégration réseaux sociaux, analytics, formation incluse)
- Premium : 1 990€ (maquettes UI/UX Figma, CMS personnalisé, fonctionnalités avancées sur mesure, support VIP)

📌 **Automatisation**
- Workflow Simple : Sur devis (maintenance 50€/mois, 1 mois offert)
- Workflow Avancé : Sur devis (maintenance 80€/mois, 2 mois offerts)

📌 **Applications Web**
- Web Essential / Business / Enterprise : Sur devis

📌 **Applications Mobiles**
- App Starter / Business / Enterprise : Sur devis

📌 **Identité Visuelle**
- Logo Pro : Sur devis (logo sur mesure, 3 propositions, révisions illimitées, fichiers source)
- Branding 360 : Sur devis (identité complète, charte graphique, templates réseaux sociaux, déclinaisons print)

**CONTACT**
- Email : contact.nexus.developpement@gmail.com
- Téléphone : +33 7 61 84 75 80
- Localisation : Nous sommes basés en Île-de-France (Yvelines, 78)

**INSTRUCTIONS COMPORTEMENTALES**
- Le message de bienvenue est DÉJÀ affiché automatiquement
- Ne JAMAIS commencer par "Bonjour", "Salut" ou toute salutation
- Commence DIRECTEMENT par répondre à la question
- Réponds TOUJOURS en français
- Sois professionnel mais chaleureux
- Utilise des emojis avec parcimonie
- Garde tes réponses concises (2-3 paragraphes max)`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    console.log("Chatbot request with", messages.length, "messages");

    // Add system prompt as first message
    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Fast, cheap, and excellent for chatbots
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 500,
        stream: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite atteinte. Réessayez dans un instant." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Erreur service IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // OpenAI already streams in the correct format!
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});