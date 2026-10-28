import { Link } from "react-router-dom";
import { Plus, Repeat } from "lucide-react";
import { quoteOptions, type QuoteOption } from "@/data/options";

/**
 * Catalogue des options à ajouter à un pack site vitrine ou e-commerce,
 * avec ce que couvre le forfait mensuel d'hébergement (CGV, art. 6 et 11).
 */
const OptionCard = ({ option }: { option: QuoteOption }) => (
  <li className="flex h-full flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/50 p-5">
    <div className="flex items-start justify-between gap-3">
      <h4 className="font-semibold text-white leading-snug">{option.label}</h4>
      <span className="shrink-0 whitespace-nowrap rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
        {option.price}
      </span>
    </div>
    <p className="text-sm leading-relaxed text-blue-100/70">{option.description}</p>
  </li>
);

const OptionsCatalog = () => {
  const oneShot = quoteOptions.filter((o) => !o.recurring);
  const recurring = quoteOptions.filter((o) => o.recurring);

  return (
    <section aria-labelledby="options-title" className="mx-auto max-w-6xl">
      <div className="mb-10 text-center">
        <h2 id="options-title" className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Options à ajouter à votre pack
        </h2>
        <p className="mx-auto max-w-2xl text-blue-200/70">
          Prenez le pack qui vous correspond, puis ajoutez seulement ce dont vous avez besoin. Prix HT.
        </p>
      </div>

      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <Plus className="h-5 w-5 text-cyan-400" aria-hidden="true" /> À la création du site
      </h3>
      <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {oneShot.map((o) => (
          <OptionCard key={o.id} option={o} />
        ))}
      </ul>

      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <Repeat className="h-5 w-5 text-cyan-400" aria-hidden="true" /> Chaque mois, sans engagement
      </h3>
      <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recurring.map((o) => (
          <OptionCard key={o.id} option={o} />
        ))}
      </ul>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-950/30 p-6 text-blue-100/80">
        <h3 className="mb-2 font-semibold text-white">Ce que comprend le forfait mensuel d'hébergement</h3>
        <p className="text-sm leading-relaxed">
          Hébergement du site, certificat SSL, maintenance corrective (bugs, mises à jour de sécurité) et
          support technique avec réponse sous 48 h ouvrées. Sans engagement : résiliable à tout moment avec
          30 jours de préavis. Une fois le site intégralement payé, il vous appartient.
        </p>
      </div>

      <p className="mt-8 text-center">
        <Link
          to="#devis"
          className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-transform hover:scale-105"
        >
          Demander un devis avec mes options
        </Link>
      </p>
    </section>
  );
};

export default OptionsCatalog;
