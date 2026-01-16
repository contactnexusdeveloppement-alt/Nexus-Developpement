export interface Chapter {
    id: string;
    number: string;
    title: string;
    description: string;
    content: string;
}

export const trainingGuide: Chapter[] = [
    {
        id: 'vision',
        number: '01',
        title: 'Vision, Positionnement & Philosophie',
        description: 'Comprendre l\'ADN Nexus et notre mission auprès des TPE/PME.',
        content: `
## 1.1 Le Contexte de la Digitalisation des TPE/PME
Pour comprendre la mission de Nexus Développement et la portée de votre rôle en tant qu'apporteur d'affaires, il est impératif de saisir le contexte économique actuel. Nous vivons une ère où la présence numérique n'est plus une option cosmétique, mais une condition de survie économique. Pourtant, une fracture numérique persiste. De nombreux artisans, commerçants et professions libérales restent en marge, non pas par manque d'intérêt, mais par peur de la complexité technique et par méfiance envers des prestataires souvent opaques.

Nexus Développement ne se positionne pas simplement comme une agence web, mais comme un **partenaire de croissance structurelle**. Là où le marché est saturé d'offres polarisées — d'un côté des solutions gratuites mais chronophages (Wix) et de l'autre des agences aux tarifs prohibitifs — Nexus occupe un terrain stratégique : celui de l'excellence technique accessible et transparente.

> **L'objectif n'est pas de vendre un site internet, mais de vendre une "Sérénité Technique" et un outil de conversion commerciale.**

## 1.2 L'ADN Nexus : Les Cinq Piliers de Confiance
Pour convaincre un prospect, il est crucial de comprendre ce qui différencie Nexus de la concurrence.

1. **L'Équipe Experte et l'Approche Collaborative** : Contrairement aux plateformes automatisées, Nexus avance "pas à pas" avec le client. La validation de chaque étape clé (design, développement) est un garde-fou contre l'insatisfaction.
2. **Le Respect des Délais** : Dans l'industrie, le retard est la norme. Nexus fait du respect du planning un avantage concurrentiel majeur.
3. **Le Support 7j/7** : C'est l'argument de réassurance le plus puissant. "Vous n'êtes jamais seul". Pour un restaurateur, savoir qu'un support est disponible le dimanche est une assurance-vie.
4. **La Transparence Financière** : Aucun surcoût caché. Les devis sont détaillés. Le prix annoncé est le prix payé.
5. **La Sérénité Technique** : Maintenance, sécurité, sauvegardes. Le client se concentre sur son métier, Nexus gère la technique.

## 1.3 La Valeur Ajoutée pour l'Apporteur d'Affaires
En tant que partenaire, vous disposez d'un produit "clé en main" facile à défendre. La structure tarifaire est claire, les exemples de réussite sont probants, et la demande est universelle. Chaque entreprise sans site web ou avec un site obsolète est un prospect qualifié.
`
    },
    {
        id: 'vulgarisation',
        number: '02',
        title: 'Vulgarisation Technique & Éducation',
        description: 'Responsive, SEO, CMS... Les concepts clés expliqués simplement.',
        content: `
## 2.1 Le Site Vitrine : Bien Plus qu'une Carte de Visite
Le terme "Site Vitrine" est souvent mal compris. Il ne s'agit pas d'une image statique, mais d'une **plateforme active de conversion**.
> **Définition Vulgarisée** : Imaginez le site vitrine comme la devanture d'un magasin couplée à un commercial disponible 24h/24. Il présente l'entreprise et incite le visiteur à entrer en contact.
> **Chiffre clé** : 93% des parcours d'achat commencent par une recherche en ligne.

## 2.2 Le Responsive Design et l'Approche Mobile-First
Nexus insiste sur le "Design responsive mobile-first".
*   **Explication** : Le site s'adapte comme un fluide à la taille de l'écran (iPhone, tablette, PC).
*   **Argument Commercial** : Plus de 60% des recherches locales (ex: "plombier Élancourt") se font sur mobile. Si le site est illisible, le client part chez le concurrent en 3 secondes.

## 2.3 Le SEO (Référencement Naturel)
*   **Concept** : L'art d'être visible sur Google sans payer de publicité.
*   **L'Approche Nexus** : Nous livrons des sites "optimisés pour convertir". Le code est propre et rapide.
*   **Analogie** : "Avoir un beau site sans SEO, c'est comme ouvrir une boutique de luxe au milieu du désert. Personne ne la verra."

## 2.4 Le CMS (Content Management System)
L'interface qui permet de gérer le contenu. Les offres Business et Premium incluent un CMS, donnant au client le pouvoir de modifier ses textes et photos sans coder. C'est un argument fort d'**autonomie**.

## 2.5 L'Hébergement et la Maintenance (Le "Loyer")
Un site non maintenu devient vulnérable. L'abonnement Nexus (50€-115€) est une "assurance tranquillité" incluant sécurité, sauvegardes et mises à jour.
`
    },
    {
        id: 'offres',
        number: '03',
        title: 'Analyse Détaillée des Offres',
        description: 'Starter, Business, Premium : Quelle formule pour quel client ?',
        content: `
Le cœur de l'offre Nexus repose sur trois formules étagées correspondant au niveau de maturité du client.

## 3.1 Formule 1 : "Starter" – L'Essentiel Pro (Dès 950€)
*   **Cible** : Artisan solo, freelance débutant, petit commerce sans site.
*   **Offre** : Site One-Page ou jusqu'à 3 pages. Design Mobile-First.
*   **Abonnement** : 50€/mois.
*   **Argument** : "Pour moins de 1000€, passez de l'anonymat à une crédibilité totale."

## 3.2 Formule 2 : "Business" – La Conversion Active (Best-Seller, 1850€)
*   **Cible** : PME établie, cabinet médical, garage, restaurant, agence immo.
*   **Offre** : 4 à 10 pages, CMS intégré (autonomie), Structure SEO avancée (une page par service).
*   **Abonnement** : 75€/mois (2 mois offerts).
*   **Argument** : "Un investissement de croissance. Multipliez vos chances d'être trouvé sur Google avec une page par service."

## 3.3 Formule 3 : "Premium" – L'Excellence Sur-Mesure (Dès 4000€)
*   **Cible** : Startups, Marques de luxe, Hôtellerie, ETI.
*   **Offre** : Design 100% sur-mesure (Figma), Animations avancées (React/Framer), Complexité technique.
*   **Abonnement** : 115€/mois (3 mois offerts).
*   **Argument** : "Votre site est le reflet direct de la qualité de vos produits. Un design sur-mesure envoie un signal fort de solidité."
`
    },
    {
        id: 'automatisation',
        number: '04',
        title: 'L\'Automatisation : Le Levier de Rentabilité',
        description: 'Vendre non plus un coût, mais une économie de temps et d\'argent.',
        content: `
Si le site vitrine est la "façade", l'automatisation est le "moteur". C'est là que Nexus se différencie radicalement des freelances.

## 4.1 Qu'est-ce que l'Automatisation Nexus ?
Connecter le site aux processus internes pour supprimer les tâches répétitives. "Gagner du temps en optimisant vos workflows".

## 4.2 Scénarios Concrets (Cas Clients)
*   **Cas A : Prise de RDV (Santé, Beauté, Garage)**
    *   *Problème* : Le téléphone sonne tout le temps, ou le client tombe sur répondeur.
    *   *Solution* : Module de prise de RDV synchronisé 24h/24.
    *   *Preuve Sociale* : "Le site permet à mes clients de prendre RDV la nuit."
    *   *ROI* : Si vous gagnez 1h de secrétariat par jour, l'automatisation est remboursée en une semaine.

*   **Cas B : Commande en Ligne (Resto, Boulangerie)**
    *   *Problème* : Erreurs de commande au téléphone, ligne occupée le samedi soir.
    *   *Solution* : Click & Collect. Augmentation du panier moyen grâce aux photos (achat d'impulsion).

*   **Cas C : Gestion Client (Services)**
    *   *Solution* : Portail client pour voir l'avancement d'un dossier en temps réel.

## 4.3 Vendre l'Upsell
L'automatisation ne doit pas être vue comme technique, mais comme une **libération**.
> **Stratégie** : Demandez "Quelle est la tâche que vous détestez faire ou qui vous prend le plus de temps ?". La réponse est souvent "la facturation", "le planning". Nexus a un module pour ça.
`
    },
    {
        id: 'services-plus',
        number: '05',
        title: 'Services Complémentaires',
        description: 'Web Apps, Mobile, Branding. L\'étendue de la gamme.',
        content: `
Nexus ne s'arrête pas au site web.

## 5.1 Applications Web & Mobiles
*   **Web Apps (SaaS)** : Logiciels métier accessibles via navigateur (ex: suivi logistique, gestion adhérents).
*   **Apps Mobiles (iOS/Android)** : Pour la géolocalisation, le push, l'usage natif.
*   **Argument** : "Solutions logicielles puissantes et sur-mesure."

## 5.2 Identité Visuelle & Branding
Un beau site avec un logo amateur est un gâchis.
*   **Offre** : Création de Logos et Chartes Graphiques.
*   **Argument** : "Avant de faire votre site, redonnons un coup de jeune logique à votre image. Une identité forte crédibilise l'entreprise avant même la lecture des textes."
`
    },
    {
        id: 'vente',
        number: '06',
        title: 'Manuel de Vente & Psychologie',
        description: 'Méthodologie, SONCAS et Traitement des Objections.',
        content: `
Vendre du numérique, c'est vendre une promesse de résultat.

## 6.1 Le Ciblage
Ciblez les entreprises avec une "douleur" visible.
*   **Les Invisibles** : Pas de site. Faciles à convaincre.
*   **Les Obsolètes** : Site vieux de 5 ans, non responsive. Argument : "Google vous pénalise".
*   **Les Débordés** : Ne répondent pas au téléphone. Argument : Automatisation.

## 6.2 Phase de Découverte (Écoute Active)
Ne présentez pas Nexus tout de suite. Posez des questions.
*   "Comment trouvez-vous vos clients aujourd'hui ?"
*   "Quelle part de votre temps passez-vous à l'administratif ?"
*   "Que font vos concurrents sur le web ?"

## 6.3 Argumentaire SONCAS
Adaptez le discours au profil psychologique :
*   **Sécurité** : Insistez sur le Support 7j/7, la maintenance.
*   **Orgueil** : Design Premium, "Le plus beau site de la région".
*   **Nouveauté** : Technos modernes (React).
*   **Confort** : Automatisation, gain de temps.
*   **Argent** : ROI, le site se rembourse seul.
*   **Sympathie** : L'équipe humaine de Nexus.

## 6.4 Traitement des Objections (La Bible)
*   **"C'est trop cher"** -> Fractionnement. "950€ sur 3 ans, c'est moins d'1€ par jour. Votre entreprise ne mérite-t-elle pas ça ?"
*   **"Je peux le faire moi-même sur Wix"** -> Professionnalisme. "Votre métier c'est la plomberie, pas le web. Combien valent 50h de votre travail ?"
*   **"Le bouche-à-oreille suffit"** -> Sécurité. "Le web amplifie et sécurise le bouche-à-oreille. On vérifie votre sérieux sur Google."
*   **"L'abo mensuel me gêne"** -> Assurance. "Ce n'est pas un loyer, c'est un gardiennage et une assurance contre le piratage."
`
    },
    {
        id: 'concurrence',
        number: '08',
        title: 'Analyse Concurrentielle',
        description: 'Connaître l\'ennemi pour mieux vendre.',
        content: `
## Wix / Squarespace (DIY)
*   *Points Forts* : Prix bas, facilité d'accès.
*   *Faiblesses* : Le client doit tout faire (temps perdu), référencement médiocre, site "sans âme", le site ne vous appartient jamais vraiment.

## Freelances Indépendants
*   *Points Forts* : Prix bas, contact direct.
*   *Faiblesses* : Disparition fréquente (maladie, changement de carrière), pas de dispo 7j/7, compétences limitées (soit design, soit code).

## Grosses Agences Web
*   *Points Forts* : Image prestigieuse.
*   *Faiblesses* : Prix très élevés (>5000€), délais longs, petits clients négligés.

## Nexus Développement (L'Équilibre Parfait)
Support 7j/7, Prix forfaitisés clairs, Design sur-mesure et Expertise technique réelle.
`
    }
];
