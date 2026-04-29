export type LocalCity = {
  slug: string;
  name: string;
  postalCode: string;
  distanceFromElancourt: string;
  intro: string;
  context: string;
  /** Quartiers / zones d'activité ciblées dans la ville */
  zones: string[];
  /** Secteurs locaux clés à mentionner pour le contexte économique */
  sectors: string[];
};

export const LOCAL_CITIES: LocalCity[] = [
  {
    slug: "agence-web-versailles",
    name: "Versailles",
    postalCode: "78000",
    distanceFromElancourt: "15 km",
    intro:
      "Vous cherchez une agence web à Versailles pour propulser votre activité ? Nexus Développement, basée à 15 km dans les Yvelines, accompagne les commerces, restaurants, indépendants et PME versaillais avec des sites web qui convertissent et des automatisations qui font gagner des heures.",
    context:
      "Versailles concentre un tissu commercial dense (Notre-Dame, Saint-Louis, Chantiers, Montreuil) et une clientèle exigeante. Une présence digitale soignée — site rapide, fiche Google Maps optimisée, prise de rendez-vous en ligne — est aujourd'hui indispensable pour capter les flux de touristes comme la clientèle locale fidèle.",
    zones: [
      "Notre-Dame",
      "Saint-Louis",
      "Chantiers",
      "Montreuil",
      "Clagny-Glatigny",
      "Bernard de Jussieu",
    ],
    sectors: [
      "tourisme et hôtellerie",
      "restauration et gastronomie",
      "artisanat de luxe",
      "professions libérales",
      "agences immobilières",
      "salons de coiffure et instituts",
    ],
  },
  {
    slug: "agence-web-saint-quentin-en-yvelines",
    name: "Saint-Quentin-en-Yvelines",
    postalCode: "78180",
    distanceFromElancourt: "5 km",
    intro:
      "Nexus Développement est l'agence web de proximité pour Saint-Quentin-en-Yvelines. Nous accompagnons les startups, scale-ups et entreprises industrielles de l'agglomération avec des sites web haute performance, des applications métier sur-mesure et des automatisations qui libèrent vos équipes.",
    context:
      "Saint-Quentin-en-Yvelines (SQY) est l'un des principaux pôles économiques d'Île-de-France avec plus de 11 000 entreprises. Vous y trouvez de grands comptes (Renault, Bouygues, Crédit Agricole, Stellantis), un cluster automobile et aéronautique reconnu, et une scène startup en pleine expansion (TechnoCentre, Pépinière Promopole). Notre stack moderne (React, Vercel, Stripe) est calibrée pour ce niveau d'exigence.",
    zones: [
      "Montigny-le-Bretonneux",
      "Voisins-le-Bretonneux",
      "Guyancourt",
      "Trappes",
      "Élancourt",
      "Magny-les-Hameaux",
      "La Verrière",
    ],
    sectors: [
      "industrie automobile",
      "aéronautique et défense",
      "services informatiques",
      "ingénierie et conseil",
      "startups SaaS",
      "commerces de proximité",
    ],
  },
  {
    slug: "agence-web-trappes",
    name: "Trappes",
    postalCode: "78190",
    distanceFromElancourt: "4 km",
    intro:
      "Vous tenez un commerce, un restaurant ou une PME à Trappes ? Nexus Développement, votre agence web voisine à Élancourt, conçoit pour vous des sites professionnels qui ressortent en tête sur Google et qui convertissent vos visiteurs en clients.",
    context:
      "Trappes concentre une grande diversité de TPE et PME (commerces, artisans, restauration, services à la personne). La concurrence sur Google est encore relativement faible sur les requêtes locales, ce qui en fait un excellent terrain pour les commerces qui investissent dans une présence en ligne soignée maintenant.",
    zones: [
      "Centre-ville",
      "Plaine de Neauphle",
      "Bois de l'Étang",
      "Gare de Trappes",
      "Macarons",
    ],
    sectors: [
      "restauration",
      "commerces de proximité",
      "artisans du bâtiment",
      "services à la personne",
      "auto-écoles et garages",
      "santé et bien-être",
    ],
  },
  {
    slug: "agence-web-plaisir",
    name: "Plaisir",
    postalCode: "78370",
    distanceFromElancourt: "7 km",
    intro:
      "À Plaisir, Nexus Développement accompagne les commerçants, professions libérales et PME locales avec des sites web modernes et un référencement naturel ciblé sur les Yvelines. Devis gratuit, accompagnement de proximité, livraison rapide.",
    context:
      "Plaisir est connue pour son centre commercial Open Sky, ses zones d'activité (Sainte-Apolline, Le Buisson de la Couldre) et sa vie commerciale dynamique. Pour les commerces locaux, capter le trafic Google Maps et apparaître dans les résultats de recherche autour de leur ville est devenu un levier de croissance majeur.",
    zones: [
      "Centre-ville",
      "Open Sky",
      "Sainte-Apolline",
      "Le Buisson de la Couldre",
      "Valibout",
      "Gâtines",
    ],
    sectors: [
      "commerces et boutiques",
      "restauration",
      "professions médicales",
      "artisans",
      "auto-entrepreneurs",
      "services aux entreprises",
    ],
  },
  {
    slug: "agence-web-montigny-le-bretonneux",
    name: "Montigny-le-Bretonneux",
    postalCode: "78180",
    distanceFromElancourt: "8 km",
    intro:
      "Nexus Développement est l'agence web de référence pour Montigny-le-Bretonneux et le centre d'affaires de Saint-Quentin-en-Yvelines. Sites vitrine, applications métier, automatisation : nous outillons votre activité avec une stack moderne (React, Vercel, Stripe).",
    context:
      "Montigny-le-Bretonneux abrite la gare TGV de SQY et l'un des plus importants quartiers d'affaires des Yvelines (Centre Commercial Espace Saint-Quentin, Sourderie, Pas du Lac). Vous y trouvez un mix de grands comptes, de cabinets de conseil et de startups en hyper-croissance qui demandent des outils digitaux à la hauteur de leurs ambitions.",
    zones: [
      "Centre-ville",
      "Pas du Lac",
      "Sourderie",
      "Saint-Quentin Gare",
      "Hauts du Manet",
    ],
    sectors: [
      "conseil et services aux entreprises",
      "édition logicielle",
      "ingénierie",
      "santé et professions libérales",
      "restauration d'affaires",
      "commerces et services",
    ],
  },
  {
    slug: "agence-web-maurepas",
    name: "Maurepas",
    postalCode: "78310",
    distanceFromElancourt: "3 km",
    intro:
      "Vous êtes commerçant, artisan ou dirigeant de PME à Maurepas ? Nexus Développement, votre agence web voisine à Élancourt, vous aide à passer le cap du digital avec un site clair, rapide et qui apparaît en tête sur Google quand on cherche votre activité.",
    context:
      "Maurepas dispose d'un tissu commercial actif autour du centre-ville, de Pariwest et de la Mare aux Saules. Beaucoup de commerces et services locaux n'ont pas encore optimisé leur présence digitale — c'est une fenêtre pour ceux qui investissent dès maintenant dans un site web professionnel et une fiche Google Maps soignée.",
    zones: [
      "Centre-ville",
      "Pariwest",
      "La Mare aux Saules",
      "Friches",
      "La Malmedonne",
    ],
    sectors: [
      "commerces de proximité",
      "restauration et boulangerie",
      "artisans du bâtiment",
      "auto et mécanique",
      "santé et bien-être",
      "services à la personne",
    ],
  },
];

export const getCityBySlug = (slug: string) =>
  LOCAL_CITIES.find((c) => c.slug === slug);
