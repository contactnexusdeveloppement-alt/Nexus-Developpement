-- Create training_resources table for the sales partner training/resource center
-- This table stores guides, best practices, and training materials

CREATE TABLE IF NOT EXISTS public.training_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'sales_arguments', 'product_info', 'best_practices', 'process'
    content TEXT NOT NULL, -- Markdown format
    excerpt TEXT, -- Short summary for listings
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT training_resources_category_check CHECK (
      category IN (
        'sales_arguments',
        'product_info',
        'best_practices',
        'process',
        'tools',
        'other'
      )
    )
);

-- Create indexes
CREATE INDEX idx_training_resources_category ON public.training_resources(category);
CREATE INDEX idx_training_resources_published ON public.training_resources(is_published) WHERE is_published = true;
CREATE INDEX idx_training_resources_order ON public.training_resources(display_order);

-- Enable Row Level Security
ALTER TABLE public.training_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for training_resources

-- All authenticated users (admins + sales) can view published resources
CREATE POLICY "Authenticated users can view published resources" 
ON public.training_resources 
FOR SELECT 
TO authenticated
USING (is_published = true);

-- Admins can view all resources (including unpublished)
CREATE POLICY "Admins can view all resources" 
ON public.training_resources 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can insert resources
CREATE POLICY "Admins can insert resources" 
ON public.training_resources 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can update resources
CREATE POLICY "Admins can update resources" 
ON public.training_resources 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can delete resources
CREATE POLICY "Admins can delete resources" 
ON public.training_resources 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger to auto-update updated_at
CREATE TRIGGER update_training_resources_updated_at 
BEFORE UPDATE ON public.training_resources 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial training resources
INSERT INTO public.training_resources (title, category, content, excerpt, display_order, is_published) VALUES
(
  'Vitrine vs Application Web',
  'product_info',
  E'# Différence entre Site Vitrine et Application Web\n\n## Site Vitrine\n\nUn site vitrine est une présence web simple et élégante pour présenter votre entreprise, vos services et vos produits.\n\n**Caractéristiques :**\n- Pages statiques (Accueil, Services, À propos, Contact)\n- Contenu informatif\n- Formulaire de contact\n- SEO optimisé\n- Temps de développement : 2-4 semaines\n- **Prix : 950€ - 1850€**\n\n**Idéal pour :**\n- PME locales\n- Professionnels indépendants\n- Commerce de proximité\n- Cabinet de conseil\n\n---\n\n## Application Web\n\nUne application web est une solution interactive avec fonctionnalités avancées et base de données.\n\n**Caractéristiques :**\n- Authentification utilisateurs\n- Base de données dynamique\n- Tableau de bord personnalisé\n- Actions en temps réel\n- Temps de développement : 6-12 semaines\n- **Prix : 4000€+**\n\n**Idéal pour :**\n- SaaS / Plateformes\n- Systèmes de réservation\n- E-commerce complexe\n- Outils métier spécifiques\n\n---\n\n## Comment choisir ?\n\n**Posez ces questions :**\n1. Avez-vous besoin d''authentification utilisateur ?\n2. Vos clients doivent-ils effectuer des actions (réserver, acheter, collaborer) ?\n3. Avez-vous besoin de gérer des données complexes ?\n\nSi OUI à 2+ questions → **Application Web**  \nSi NON → **Site Vitrine** suffit',
  'Comprenez la différence entre site vitrine et application web pour mieux conseiller vos prospects.',
  1,
  true
),
(
  'Arguments de Vente Clés',
  'sales_arguments',
  E'# Arguments de Vente Nexus Développement\n\n## 🎯 Notre Positionnement\n\n"Nous créons des solutions digitales sur mesure qui transforment vos défis métier en opportunités de croissance."\n\n---\n\n## 💪 Nos Forces\n\n### 1. Expertise Full-Stack\n- Technologies modernes (React, Node.js, Supabase)\n- Solutions évolutives et performantes\n- Code de qualité professionnelle\n\n### 2. Accompagnement Personnalisé\n- Écoute approfondie de vos besoins\n- Conseils stratégiques\n- Formation et support post-livraison\n\n### 3. Transparence Totale\n- Devis détaillé et clair\n- Communication régulière sur l''avancement\n- Pas de coûts cachés\n\n### 4. Délais Respectés\n- Planning défini dès le départ\n- Méthodologie agile\n- Livraisons par étapes\n\n---\n\n## 🛡️ Réponses aux Objections\n\n### "C''est trop cher"\n➜ *"Investir dans une solution de qualité vous fait économiser en maintenance et évolutions futures. Nos clients constatent un ROI moyen de X mois grâce à [automatisation/nouveaux clients/gain de temps]."*\n\n### "J''ai déjà un site"\n➜ *"Parfait ! Analysons ensemble ce qui fonctionne et ce qui pourrait être amélioré. Parfois, une simple évolution suffit. Notre objectif est de vous apporter une vraie valeur ajoutée."*\n\n### "Je dois réfléchir"\n➜ *"Bien sûr ! Puis-je vous envoyer quelques exemples de projets similaires ? Quand souhaitez-vous qu''on en rediscute ?"*\n\n### "Mon concurrent fait moins cher"\n➜ *"La question est : que proposent-ils exactement ? Notre approche sur-mesure garantit que la solution correspond parfaitement à vos besoins, sans compromis sur la qualité."*\n\n---\n\n## 📞 Techniques de Closing\n\n1. **Créer l''urgence** : "Compte tenu de votre deadline X, nous devrions lancer le projet avant [date] pour respecter vos délais."\n\n2. **Question alternative** : "Préférez-vous démarrer mi-janvier ou début février ?"\n\n3. **Récapitulatif** : "Résumons : vous avez besoin de [X, Y, Z]. Notre pack Business à 1850€ répond parfaitement. On lance ?"\n\n4. **Garantie** : "Si à tout moment vous n''êtes pas satisfait, nous ajustons jusqu''à ce que ce soit parfait."',
  'Maîtrisez nos arguments de vente et réponses aux objections les plus courantes.',
  2,
  true
),
(
  'Process de Qualification',
  'process',
  E'# Process de Qualification d''un Prospect\n\n## Étape 1 : Premier Contact (5 min)\n\n**Objectifs :**\n- Établir le contact\n- Comprendre le besoin global\n- Fixer un RDV de découverte\n\n**Script :**\n> "Bonjour [Nom], je suis [Votre Nom] de Nexus Développement. J''ai vu que vous recherchiez [service]. Pouvez-vous me parler brièvement de votre projet ? ... Parfait ! Je propose qu''on planifie un appel de 20 minutes où je pourrai mieux comprendre vos besoins. Quel jour vous conviendrait ?"\n\n---\n\n## Étape 2 : Appel de Découverte (20-30 min)\n\n### Questions à Poser (BANT)\n\n**Budget :**\n- "Avez-vous une enveloppe budgétaire définie pour ce projet ?"\n- "Quel retour sur investissement attendez-vous ?"\n\n**Authority (Décideur) :**\n- "Êtes-vous la personne qui valide ce type de projet ?"\n- "Y a-t-il d''autres parties prenantes dans la décision ?"\n\n**Need (Besoin) :**\n- "Quel problème cherchez-vous à résoudre ?"\n- "Que se passe-t-il si vous ne faites rien ?"\n- "Qu''attendez-vous concrètement de cette solution ?"\n\n**Timeline :**\n- "Avez-vous une date limite en tête ?"\n- "Quand souhaitez-vous que la solution soit opérationnelle ?"\n\n---\n\n## Étape 3 : Scoring du Lead\n\n**Prospect CHAUD (75-100 points) :**\n- Budget confirmé ✅\n- Décideur identifié ✅\n- Besoin urgent ✅\n- Timeline < 2 mois ✅\n\n**Prospect TIÈDE (50-74 points) :**\n- Budget estimé\n- Processus de décision en cours\n- Besoin confirmé mais pas urgent\n- Timeline 2-6 mois\n\n**Prospect FROID (< 50 points) :**\n- Budget flou\n- Pas décideur\n- Exploration\n- Pas de timeline\n\n---\n\n## Étape 4 : Suite à Donner\n\n**Prospect CHAUD :**\n→ Envoyer un devis sous 24h\n→ Relance J+2 si pas de réponse\n\n**Prospect TIÈDE :**\n→ Envoyer documentation / case studies\n→ Relance hebdomadaire\n\n**Prospect FROID :**\n→ Ajouter à la newsletter\n→ Relance mensuelle',
  'Apprenez à qualifier efficacement vos prospects avec notre méthode BANT.',
  3,
  true
);
