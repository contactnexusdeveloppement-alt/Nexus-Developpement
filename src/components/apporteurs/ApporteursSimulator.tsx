import { useMemo, useState, useId } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

type SignatureRate = "basse" | "mediane" | "haute";
type Mix = "vitrines" | "equilibre" | "premium";

// Tickets HT alignés sur la grille publiée dans src/data/pricingData.ts
// (packs Essential, Business et Premium) et sur les forfaits mensuels
// d'hébergement/maintenance qui les accompagnent.
const TICKET_HT: Record<Mix, number> = {
  vitrines: 950,
  equilibre: 1850,
  premium: 4000,
};
const FORFAIT_MENSUEL_HT: Record<Mix, number> = {
  vitrines: 50,
  equilibre: 75,
  premium: 115,
};

// Taux de signature indicatifs : aucun historique ne les étaye encore.
const SIGNATURE_RATES: Record<SignatureRate, number> = {
  basse: 0.25,
  mediane: 0.4,
  haute: 0.6,
};

const COMMISSION_RATE = 0.2;
// Mois de forfait commissionnés sur une projection de 3 ans, à raison de
// 24 mois maximum par client signé au mois t (t = 0..35) : Σ min(24, 36 − t).
const MOIS_FORFAIT_3_ANS = 588;

function computeGains(contactsParAn: number, signatureRate: SignatureRate, mix: Mix) {
  const dealsParAn = contactsParAn * SIGNATURE_RATES[signatureRate];
  const gainAnnuel = Math.round(dealsParAn * TICKET_HT[mix] * COMMISSION_RATE);
  const gainMensuel = Math.round(gainAnnuel / 12);
  const forfaits3ans = Math.round(
    (dealsParAn / 12) * MOIS_FORFAIT_3_ANS * FORFAIT_MENSUEL_HT[mix] * COMMISSION_RATE,
  );
  const total3ans = gainAnnuel * 3 + forfaits3ans;
  return { gainMensuel, gainAnnuel, total3ans };
}

const formatEuros = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const SIGNATURE_OPTIONS: { value: SignatureRate; label: string; pct: string }[] = [
  { value: "basse", label: "Hypothèse basse", pct: "25 %" },
  { value: "mediane", label: "Hypothèse médiane", pct: "40 %" },
  { value: "haute", label: "Hypothèse haute", pct: "60 %" },
];

const MIX_OPTIONS: { value: Mix; label: string; detail: string }[] = [
  { value: "vitrines", label: "Plutôt sites vitrines", detail: "pack Essential, 950 € HT" },
  { value: "equilibre", label: "Mix équilibré", detail: "pack Business, 1 850 € HT" },
  { value: "premium", label: "Plutôt projets premium", detail: "pack Premium, 4 000 € HT" },
];

const CONTACTS_MAX = 24;

const ApporteursSimulator = () => {
  const [contacts, setContacts] = useState(4);
  const [signature, setSignature] = useState<SignatureRate>("basse");
  const [mix, setMix] = useState<Mix>("equilibre");

  const headingId = useId();
  const liveId = useId();
  const noteId = useId();

  const gains = useMemo(() => computeGains(contacts, signature, mix), [contacts, signature, mix]);
  const sliderPct = (contacts / CONTACTS_MAX) * 100;

  return (
    <section
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: "var(--ned-bg-mid)" }}
      aria-labelledby={headingId}
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 border"
            style={{
              backgroundColor: "var(--ned-accent-soft)",
              borderColor: "var(--ned-border)",
              color: "var(--ned-accent)",
            }}
          >
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            Simulateur
          </div>
          <h2
            id={headingId}
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.03em" }}
          >
            Combien vous pouvez gagner —
            <br />
            sans mentir
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--ned-silver)" }}
          >
            Une estimation à partir de nos tarifs publiés (packs Essential, Business et Premium)
            et d'hypothèses de signature que vous choisissez.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border p-6 md:p-10"
          style={{
            backgroundColor: "var(--ned-bg-elevated)",
            borderColor: "var(--ned-border)",
          }}
        >
          {/* Curseur — contacts qualifiés par an */}
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <label
                htmlFor="sim-contacts"
                className="text-sm font-medium"
                style={{ color: "var(--ned-silver-light)" }}
              >
                Combien de contacts qualifiés pouvez-vous présenter par an&nbsp;?
              </label>
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color: "var(--ned-accent)" }}
              >
                {contacts}
              </span>
            </div>
            <input
              id="sim-contacts"
              type="range"
              min={0}
              max={CONTACTS_MAX}
              step={1}
              value={contacts}
              onChange={(e) => setContacts(Number(e.target.value))}
              className="ned-slider w-full"
              aria-valuemin={0}
              aria-valuemax={CONTACTS_MAX}
              aria-valuenow={contacts}
            />
            <div className="flex justify-between text-xs mt-2 tabular-nums" style={{ color: "var(--ned-silver)" }}>
              <span>0</span>
              <span>12</span>
              <span>{CONTACTS_MAX}</span>
            </div>
          </div>

          {/* Taux de signature */}
          <div className="mb-8">
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "var(--ned-silver-light)" }}
              id="sim-signature-label"
            >
              Part de ces contacts qui signent (hypothèse)
            </p>
            <div
              role="radiogroup"
              aria-labelledby="sim-signature-label"
              className="grid grid-cols-3 gap-2 md:gap-3"
            >
              {SIGNATURE_OPTIONS.map((opt) => {
                const active = signature === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSignature(opt.value)}
                    className="px-3 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1E36]"
                    style={{
                      backgroundColor: active ? "var(--ned-accent-soft)" : "transparent",
                      borderColor: active ? "var(--ned-accent)" : "var(--ned-border)",
                      color: active ? "var(--ned-silver-light)" : "var(--ned-silver)",
                    }}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs mt-0.5 tabular-nums opacity-80">{opt.pct}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mix de projets */}
          <div className="mb-10">
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "var(--ned-silver-light)" }}
              id="sim-mix-label"
            >
              Type de projets présentés
            </p>
            <div
              role="radiogroup"
              aria-labelledby="sim-mix-label"
              className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3"
            >
              {MIX_OPTIONS.map((opt) => {
                const active = mix === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMix(opt.value)}
                    className="px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1E36]"
                    style={{
                      backgroundColor: active ? "var(--ned-accent-soft)" : "transparent",
                      borderColor: active ? "var(--ned-accent)" : "var(--ned-border)",
                      color: active ? "var(--ned-silver-light)" : "var(--ned-silver)",
                    }}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs mt-0.5 opacity-80">{opt.detail}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Résultats */}
          <div
            className="grid sm:grid-cols-3 gap-4 md:gap-6 pt-6 border-t"
            style={{ borderColor: "var(--ned-border)" }}
            aria-describedby={noteId}
          >
            <GainBlock label="≈ par mois (CA HT)" value={formatEuros(gains.gainMensuel)} />
            <GainBlock label="Par an (CA HT)" value={formatEuros(gains.gainAnnuel)} highlight />
            <GainBlock
              label="Projection 3 ans, forfaits inclus (flux constant)"
              value={formatEuros(gains.total3ans)}
            />
          </div>

          <p
            id={noteId}
            className="mt-6 text-sm leading-relaxed"
            style={{ color: "var(--ned-silver)" }}
          >
            Montants HT que vous facturez en tant qu'auto-entrepreneur : retirez vos cotisations
            sociales (environ 21 à 26 % selon votre activité). Taux de signature indicatifs, non
            issus d'un historique. Aucun gain n'est garanti : la commission n'est due que sur les
            projets réellement signés et encaissés, dans les conditions des mentions légales du
            programme.
          </p>

          {/* Annonce vocale ARIA pour les screen readers */}
          <p id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
            Environ {formatEuros(gains.gainMensuel)} HT par mois, {formatEuros(gains.gainAnnuel)} HT
            par an, {formatEuros(gains.total3ans)} HT sur 3 ans forfaits inclus.
          </p>
        </motion.div>
      </div>

      {/* Style local pour le slider (cross-browser, sans dépendance) */}
      <style>{`
        .ned-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(to right, var(--ned-accent) 0%, var(--ned-accent) ${sliderPct}%, rgba(200,205,211,0.15) ${sliderPct}%, rgba(200,205,211,0.15) 100%);
          outline: none;
        }
        .ned-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--ned-silver-light);
          border: 3px solid var(--ned-accent);
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(74,158,255,0.15), 0 4px 12px rgba(0,0,0,0.4);
          transition: transform 0.15s;
        }
        .ned-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .ned-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--ned-silver-light);
          border: 3px solid var(--ned-accent);
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(74,158,255,0.15), 0 4px 12px rgba(0,0,0,0.4);
        }
        .ned-slider:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(74,158,255,0.4), 0 4px 12px rgba(0,0,0,0.4);
        }
      `}</style>
    </section>
  );
};

const GainBlock = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="text-center sm:text-left">
    <p
      className="text-xs font-medium uppercase tracking-wider mb-2"
      style={{ color: "var(--ned-silver)" }}
    >
      {label}
    </p>
    <p
      className="text-2xl md:text-3xl font-bold tabular-nums"
      style={{
        color: highlight ? "var(--ned-success)" : "var(--ned-silver-light)",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </p>
  </div>
);

export default ApporteursSimulator;
