/**
 * Helpers pour générer des schemas JSON-LD réutilisables.
 * Les schemas globaux (Organization, LocalBusiness, WebSite) restent
 * dans index.html. Ici on génère les schemas spécifiques à chaque page :
 * Service + Offer, FAQPage, BreadcrumbList.
 */

const SITE_URL = "https://nexusdeveloppement.fr";
const ORG_REF = { "@id": `${SITE_URL}/#organization` };
const LOCAL_REF = { "@id": `${SITE_URL}/#localbusiness` };

export type FAQItem = { q: string; a: string };

export type ServiceOffer = {
  name: string;
  price: number;
  priceCurrency?: string;
  description?: string;
};

export type BreadcrumbItem = { name: string; url: string };

export function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  areaServed?: string[];
  offers?: ServiceOffer[];
}) {
  const url = opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url,
    provider: { ...ORG_REF, "@type": "Organization" },
    ...(opts.areaServed && {
      areaServed: opts.areaServed.map((name) => ({
        "@type": "AdministrativeArea",
        name,
      })),
    }),
    ...(opts.offers && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: opts.name,
        itemListElement: opts.offers.map((offer) => ({
          "@type": "Offer",
          name: offer.name,
          price: offer.price,
          priceCurrency: offer.priceCurrency ?? "EUR",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: offer.price,
            priceCurrency: offer.priceCurrency ?? "EUR",
            valueAddedTaxIncluded: false,
          },
          ...(offer.description && {
            itemOffered: {
              "@type": "Service",
              name: offer.name,
              description: offer.description,
            },
          }),
        })),
      },
    }),
  };
}

export function localServiceSchema(opts: {
  city: string;
  postalCode: string;
  url: string;
  description: string;
}) {
  const url = opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#service`,
    name: `Nexus Développement — Agence web ${opts.city}`,
    description: opts.description,
    url,
    parentOrganization: { ...ORG_REF, "@type": "Organization" },
    provider: { ...LOCAL_REF, "@type": "LocalBusiness" },
    areaServed: {
      "@type": "City",
      name: opts.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: opts.city,
        postalCode: opts.postalCode,
        addressRegion: "Île-de-France",
        addressCountry: "FR",
      },
    },
    serviceType: [
      "Création de site web",
      "Applications mobiles",
      "Automatisation de processus",
      "Identité visuelle",
    ],
  };
}
