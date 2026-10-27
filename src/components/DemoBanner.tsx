import { Link } from "react-router-dom";

/**
 * Bandeau fixe en bas des démos métier (salon, restaurant, immobilier,
 * concession). Ces pages affichent une entreprise, une équipe, des avis et des
 * prix fictifs sur notre domaine : le visiteur doit savoir que c'est une
 * démonstration (rgpd-19 de l'audit du 26/09). Le lien sert aussi de CTA vers
 * le formulaire de devis.
 *
 * Styles Tailwind autonomes (pas de tokens du site principal) : les démos ont
 * chacune leur propre thème, et leurs feuilles globales recolorent les <a>
 * (d'où le !important sur la couleur du lien).
 */
const DemoBanner = () => (
  <>
    {/* Réserve la hauteur du bandeau pour qu'il ne masque pas le bas du footer. */}
    <div aria-hidden="true" className="h-20 sm:h-14" />
    <aside
      aria-label="Site de démonstration"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/10 bg-slate-950/95 px-4 py-2.5 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.35)] backdrop-blur"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-1.5 text-center text-[13px] leading-snug sm:flex-row sm:justify-between sm:gap-4 sm:text-left sm:text-sm">
        <p>
          <span className="mr-1.5 rounded bg-cyan-400 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-950">
            Démo
          </span>
          Site fictif réalisé par Nexus Développement : l'entreprise et tout son contenu sont inventés.
        </p>
        <Link
          to="/#devis"
          className="shrink-0 font-semibold !text-cyan-300 underline-offset-4 hover:!text-cyan-200 hover:underline"
        >
          Le même pour votre activité →
        </Link>
      </div>
    </aside>
  </>
);

export default DemoBanner;
