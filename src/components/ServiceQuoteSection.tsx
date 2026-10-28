import { lazy, Suspense } from "react";
import ClientOnly from "@/components/ClientOnly";

const QuoteForm = lazy(() => import("@/components/QuoteForm"));

/**
 * Formulaire de devis en bas des pages services, avec le service de la page
 * présélectionné : le visiteur n'a plus à repartir sur l'accueil pour demander
 * un devis. Même chargement que sur l'accueil (ClientOnly + lazy) : le
 * placeholder porte l'id « devis » pour que les ancres et les cartes tarifs
 * fonctionnent avant le montage du formulaire.
 */
const Placeholder = () => (
  <section id="devis" className="min-h-[900px] scroll-mt-32" aria-busy="true" aria-label="Chargement du formulaire" />
);

const ServiceQuoteSection = ({ service }: { service: string }) => (
  <ClientOnly fallback={<Placeholder />}>
    <Suspense fallback={<Placeholder />}>
      <QuoteForm defaultService={service} />
    </Suspense>
  </ClientOnly>
);

export default ServiceQuoteSection;
