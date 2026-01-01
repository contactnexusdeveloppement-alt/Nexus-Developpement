import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Tu es un assistant IA pour l'administrateur de Nexus Développement, une agence de développement web et digital.

Tu analyses les données CRM (devis, réservations d'appels, statuts clients) et proposes des actions concrètes et actionnables.

Tes capacités :
1. Identifier les prospects à relancer (inactifs depuis plusieurs jours)
2. Analyser les tendances budgétaires des devis
3. Détecter les rappels à effectuer (callbacks planifiés)
4. Calculer des statistiques (taux de conversion, budget moyen par service)
5. Suggérer des priorités commerciales
6. Identifier les opportunités de vente

Règles importantes :
- Sois concis et actionnable
- Donne des chiffres précis quand possible
- Propose toujours une action concrète
- Réponds en français
- Ne dis jamais "je ne peux pas analyser", utilise les données fournies
- Formate tes réponses avec des emojis pour la clarté
- Si on te demande des insights, structure ta réponse en sections claires`;

const pricingEstimationPrompt = `Tu es un expert en estimation de devis pour Nexus Développement, une agence de développement web et digital.

GRILLE TARIFAIRE DE RÉFÉRENCE :

## Sites Vitrine
- Essential (1-3 pages simples) : 890€
- Business (5-8 pages + fonctionnalités) : 1 290€
- Premium (10+ pages, complexe) : 1 990€

## Suppléments Site Web
- Formulaire de contact : inclus (0€)
- Système de réservation : +300€
- Paiement en ligne (base e-commerce) : +400€
- Blog : +200€
- Chat en direct : +150€
- Newsletter : +100€
- Espace client/membres : +500€
- Galerie photo avancée : +150€
- Multilingue (par langue supplémentaire) : +300€
- SEO avancé (audit + optimisation) : +300€
- Intégration réseaux sociaux : +100€

## E-commerce (si paiement activé)
- Moins de 50 produits : +200€
- 50-200 produits : +400€
- Plus de 200 produits : +600€
- Gestion de stock avancée : +300€
- Multi-devises : +200€

## Applications Mobiles
- iOS seul : Base 3 000€
- Android seul : Base 3 000€
- iOS + Android : Base 4 500€

### Suppléments Mobile
- Authentification utilisateurs : +500€
- Notifications push : +300€
- Publication stores (App Store + Play Store) : +400€
- Mode hors-ligne : +600€
- Géolocalisation : +400€
- Accès caméra/médias : +300€
- Intégrations tierces (API) : +300€ par intégration

## Automatisation
- Workflow simple (1-3 étapes) : 500€ setup + 50€/mois maintenance
- Workflow avancé (4+ étapes, conditions) : 1 000€ setup + 80€/mois maintenance

## Identité Visuelle
- Logo Essential (2 propositions) : 190€
- Logo Professional (3 propositions + déclinaisons) : 290€
- Logo Premium (5 propositions + charte graphique) : 490€

RÈGLES D'ESTIMATION :
1. Analyse les services demandés et les fonctionnalités cochées
2. Choisis le forfait de base adapté au nombre de pages / complexité
3. Additionne les suppléments pertinents
4. Compare avec le budget déclaré du client
5. Suggère des ajustements si nécessaire (upsell ou réduction de scope)

FORMAT DE RÉPONSE :
Structure ta réponse en markdown avec :
- **Prix de base** par service principal
- **Suppléments** détaillés avec justification
- **TOTAL ESTIMÉ : X€** (sur une ligne clairement visible)
- **Analyse budget** : comparaison avec le budget déclaré
- **Recommandations** : conseils pour ajuster le devis

Sois précis et professionnel. Le total doit être réaliste et justifiable.`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user from the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error('Role check error:', roleError);
      return new Response(JSON.stringify({ error: 'Accès réservé aux administrateurs' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { type, query, data } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    let userMessage = '';
    let systemContent = systemPrompt;

    if (type === 'estimate_price') {
      systemContent = pricingEstimationPrompt;

      const { callNotes, services, budget, businessType, projectDetails } = data;

      userMessage = `Génère une estimation de prix détaillée pour ce projet :

## DEMANDE INITIALE
- **Services demandés** : ${services?.join(', ') || 'Non spécifié'}
- **Budget déclaré** : ${budget || 'Non spécifié'}
- **Type d'activité** : ${businessType || 'Non spécifié'}
- **Description du projet** : ${projectDetails || 'Non spécifié'}

## DONNÉES COLLECTÉES LORS DE L'APPEL
${callNotes ? `
### Site Web
- Nombre de pages estimé : ${callNotes.estimated_pages || 'Non défini'}
- Formulaire de contact : ${callNotes.needs_contact_form ? 'Oui' : 'Non'}
- Système de réservation : ${callNotes.needs_booking ? 'Oui' : 'Non'}
- Paiement en ligne : ${callNotes.needs_payment ? 'Oui' : 'Non'}
- Blog : ${callNotes.needs_blog ? 'Oui' : 'Non'}
- Chat en direct : ${callNotes.needs_chat ? 'Oui' : 'Non'}
- Newsletter : ${callNotes.needs_newsletter ? 'Oui' : 'Non'}
- Espace membres : ${callNotes.needs_user_accounts ? 'Oui' : 'Non'}
- Galerie photo : ${callNotes.needs_gallery ? 'Oui' : 'Non'}
- Multilingue : ${callNotes.needs_multilingual ? `Oui (${callNotes.multilingual_languages || 'langues non précisées'})` : 'Non'}
- SEO important : ${callNotes.seo_important ? 'Oui' : 'Non'}

### E-commerce (si applicable)
- Nombre de produits : ${callNotes.product_count || 'Non défini'}
- Gestion de stock : ${callNotes.needs_stock_management ? 'Oui' : 'Non'}

### Application Mobile
- Plateformes : ${callNotes.target_platforms || 'Non défini'}
- Authentification : ${callNotes.needs_authentication ? 'Oui' : 'Non'}
- Notifications push : ${callNotes.needs_push_notifications ? 'Oui' : 'Non'}
- Publication stores : ${callNotes.needs_store_publication ? 'Oui' : 'Non'}
- Mode hors-ligne : ${callNotes.needs_offline_mode ? 'Oui' : 'Non'}
- Géolocalisation : ${callNotes.needs_geolocation ? 'Oui' : 'Non'}
- Accès caméra : ${callNotes.needs_camera_access ? 'Oui' : 'Non'}

### Automatisation
- Tâches à automatiser : ${callNotes.tasks_to_automate || 'Non défini'}
- Volume estimé : ${callNotes.estimated_volume || 'Non défini'}
- Fréquence : ${callNotes.execution_frequency || 'Non défini'}

### Identité Visuelle
- Logo existant : ${callNotes.has_existing_logo ? 'Oui' : 'Non (à créer)'}
` : 'Aucune donnée collectée'}

Génère une estimation détaillée avec le total clairement indiqué.`;

    } else if (type === 'insights') {
      userMessage = `Analyse ces données CRM et génère des insights actionnables :

DONNÉES ACTUELLES :
${JSON.stringify(data, null, 2)}

Génère une analyse structurée avec :
1. ⚠️ ALERTES URGENTES (rappels du jour, prospects à relancer immédiatement)
2. 📊 STATISTIQUES CLÉS (taux conversion, budget moyen, services populaires)
3. 💡 RECOMMANDATIONS (actions prioritaires à entreprendre)
4. 📈 TENDANCES (évolution récente, opportunités)

Sois précis avec les noms des clients et les chiffres.`;
    } else if (type === 'custom_query') {
      userMessage = `Voici les données CRM actuelles :

${JSON.stringify(data, null, 2)}

Question de l'administrateur : ${query}

Réponds de manière précise et actionnable en te basant sur ces données.`;
    } else if (type === 'enhance_text') {
      systemContent = `Tu es un assistant qui améliore et reformule des textes de notes professionnelles.

Règles STRICTES :
- Garde TOUTES les informations du texte original, n'en supprime aucune
- Reformule de manière claire, professionnelle et structurée
- Corrige les fautes d'orthographe et de grammaire
- Utilise des puces (•) ou des numéros si le texte contient plusieurs idées
- N'ajoute JAMAIS d'informations inventées
- Réponds UNIQUEMENT avec le texte amélioré, sans introduction ni explication
- Le texte doit être en français`;

      const { originalText, fieldContext } = data;

      const contextInstructions: Record<string, string> = {
        'notes_appel': 'Notes prises pendant un appel téléphonique avec un client. Structure avec les points clés discutés.',
        'resume_appel': 'Résumé d\'un appel téléphonique. Reformule de façon concise et professionnelle.',
        'actions_suivre': 'Liste d\'actions à effectuer. Structure en liste numérotée avec priorités si pertinent.',
        'notes_internes': 'Notes internes confidentielles. Reformule de manière claire et organisée.',
        'public_cible': 'Description du public cible/clientèle. Développe en profil marketing détaillé.',
        'objectifs_projet': 'Objectifs du projet. Structure de manière SMART si possible (Spécifique, Mesurable, Atteignable, Réaliste, Temporel).',
        'concurrents': 'Liste de concurrents ou sites de référence. Formate de manière structurée.',
        'sites_exemples': 'Sites web que le client apprécie. Liste clairement avec les aspects appréciés.',
        'autres_fonctionnalites': 'Fonctionnalités spécifiques demandées. Clarifie et structure.',
        'fonctionnalites_app': 'Fonctionnalités principales de l\'application mobile. Liste de manière structurée.',
        'taches_automatiser': 'Tâches à automatiser. Détaille les processus à optimiser.',
        'inspirations': 'Inspirations et références visuelles. Liste les éléments appréciés.',
        'elements_eviter': 'Éléments à éviter dans le design. Liste clairement.',
        'default': 'Texte professionnel. Reformule de manière claire et structurée.'
      };

      const instruction = contextInstructions[fieldContext] || contextInstructions['default'];

      userMessage = `Contexte : ${instruction}

Texte original à améliorer :
"${originalText}"

Reformule ce texte de manière professionnelle et structurée.`;
    } else if (type === 'generate_client_summary') {
      systemContent = `Tu es un assistant CRM expert pour une agence de développement web (Nexus Développement).
Tu génères des résumés clients complets et actionnables pour aider l'équipe commerciale.

Format de réponse :
1. **Profil Client** - Type d'activité, besoins principaux, budget
2. **Historique des Interactions** - Résumé chronologique des contacts
3. **Services Demandés** - Liste détaillée avec spécifications
4. **Opportunités Commerciales** - Potentiel d'upsell, services complémentaires
5. **Prochaines Actions** - Recommandations concrètes pour le prochain contact
6. **Score Lead (0-100)** - Estimation de la pertinence avec courte justification en une phrase

Règles :
- Sois concis mais complet
- Utilise des emojis pour la lisibilité
- Mets en avant les informations commerciales importantes
- Ne invente pas d'informations, base-toi uniquement sur les données fournies`;

      const { client, quotes, calls, callNotes } = data;

      const quotesInfo = quotes.map((q: { created_at: string; services?: string[]; budget?: string; status: string; business_type?: string; project_details?: string }) => `
- Devis du ${new Date(q.created_at).toLocaleDateString('fr-FR')}: Services: ${q.services?.join(', ') || 'N/A'}, Budget: ${q.budget || 'Non spécifié'}, Statut: ${q.status}, Activité: ${q.business_type || 'Non spécifié'}, Détails: ${q.project_details || 'Aucun'}`).join('\n');

      const callsInfo = calls.map((c: { id: string; booking_date: string; time_slot: string; duration: number; status: string }) => {
        const note = callNotes?.[c.id];
        return `
- Appel du ${new Date(c.booking_date).toLocaleDateString('fr-FR')} à ${c.time_slot} (${c.duration}min): Statut: ${c.status}${note?.call_outcome ? `, Résultat: ${note.call_outcome}` : ''}${note?.call_summary ? `, Résumé: ${note.call_summary}` : ''}`;
      }).join('\n');

      userMessage = `Génère un résumé complet pour ce client :

## INFORMATIONS CLIENT
- Nom : ${client.name}
- Email : ${client.email}
- Téléphone : ${client.phone || 'Non renseigné'}
- Statut actuel : ${client.status || 'Lead'}
- Premier contact : ${new Date(client.firstContact).toLocaleDateString('fr-FR')}
- Dernier contact : ${new Date(client.lastContact).toLocaleDateString('fr-FR')}

## DEVIS (${quotes.length})
${quotesInfo || 'Aucun devis'}

## APPELS (${calls.length})
${callsInfo || 'Aucun appel'}

${client.statusNotes ? `## NOTES CLIENT\n${client.statusNotes}` : ''}

Génère un résumé structuré et actionnable.`;
    } else if (type === 'draft_reply') {
      systemContent = `Tu es une assistante commerciale experte pour Nexus Développement.
Tu rédiges des emails de réponse professionnels, chaleureux et persuasifs.

Ton style :
- Professionnel mais moderne (pas de "Veuillez agréer...")
- Concis et direct
- Orienté solution/action
- Utilise un ton empathique

Structure de l'email :
1. Objet (clair et accrocheur)
2. Salutation (Bonjour [Prénom])
3. Contexte (Suite à notre appel / votre demande)
4. Proposition de valeur / Réponse aux points clés
5. Call to Action (Prochain pas clair : lien réservation, question ouverte)
6. Signature`;

      const { client, context, intent } = data;

      userMessage = `Rédige un email pour :
- Client : ${client.name} (${client.email})
- Contexte : ${context || 'Suite à un échange'}
- Intention : ${intent || 'Relance commerciale'}

Génère l'objet et le corps de l'email.`;

    } else {
      userMessage = query || 'Analyse les données et donne-moi un résumé.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requêtes atteinte, réessayez plus tard.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits insuffisants.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Erreur du service IA' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in admin-ai-assistant:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
