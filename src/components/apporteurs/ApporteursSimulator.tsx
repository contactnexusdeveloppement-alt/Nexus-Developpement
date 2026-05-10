import { useMemo, useState, useId } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

type SignatureRate = "prudent" | "realiste" | "optimiste";
type Mix = "vitrines" | "equilibre" | "premium";

const TICKET_AVERAGE: Record<Mix, number> = {
  vitrines: 1200,
  equilibre: 1990,
  premium: 3500,
};

const SIGNATURE_RATES: Record<SignatureRate, number> = {
  prudent: 0.25,
  realiste: 0.4,
  optimiste: 0.6,
};

const COMMISSION_RATE = 0.2;

function computeGains(contactsParMois: number, signatureRate: SignatureRate, mix: Mix) {
  const ticket = TICKET_AVERAGE[mix];
  const dealsParMois = contactsParMois * SIGNATURE_RATES[signatureRate];
  const gainMensuel = dealsParMois * ticket * COMMISSION_RATE;
  const gainAnnuel = gainMensuel * 12;
  // Maintenance récurrente : 8€/mois × deals × 24 mois max sur 3 ans, pondération conservatrice 0.5
  const maintenance3ans = dealsParMois * 12 * 3 * 8 * 0.5;
  const total3ans = gainAnnuel * 3 + maintenance3ans;
  return { gainMensuel, gainAnnuel, total3ans };
}

const formatEuros = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const SIGNATURE_OPTIONS: { value: SignatureRate; label: string; pct: string }[] = [
  { value: "prudent", label: "Prudent", pct: "25 %" },
  { value: "realiste", label: "Réaliste", pct: "40 %" },
  { value: "optimiste", label: "Optimiste", pct: "60 %" },
];

const MIX_OPTIONS: { value: Mix; label: string }[] = [
  { value: "vitrines", label: "Plutôt sites vitrines" },
  { value: "equilibre", label: "Mix équilibré" },
  { value: "premium", label: "Plutôt projets premium" },
];

const ApporteursSimulator = () => {
  const [contacts, setContacts] = useState(2);
  const [signature, setSignature] = useState<SignatureRate>("realiste");
  const [mix, setMix] = useState<Mix>("equilibre");

  const headingId = useId();
  const liveId = useId();

  const gains = useMemo(() => computeGains(contacts, signature, mix), [contacts, signature, mix]);

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
            Pas de promesses bidon. Voici les vrais chiffres, basés sur nos tarifs réels.
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
          {/* Slider 1 — Contacts par mois */}
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <label
                htmlFor="sim-contacts"
                className="text-sm font-medium"
                style={{ color: "var(--ned-silver-light)" }}
              >
                Combien de contacts qualifiés par mois&nbsp;?
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
              min={1}
              max={10}
              step={1}
              value={contacts}
              onChange={(e) => setContacts(Number(e.target.value))}
              className="ned-slider w-full"
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuenow={contacts}
            />
            <div className="flex justify-between text-xs mt-2 tabular-nums" style={{ color: "var(--ned-silver)" }}>
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Slider 2 — Taux de signature */}
          <div className="mb-8">
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "var(--ned-silver-light)" }}
              id="sim-signature-label"
            >
              Taux de signature estimé
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
              Mix de projets
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
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Affichage des gains */}
          <div
            className="grid sm:grid-cols-3 gap-4 md:gap-6 pt-6 border-t"
            style={{ borderColor: "var(--ned-border)" }}
          >
            <GainBlock label="Gain mensuel estimé" value={formatEuros(gains.gainMensuel)} />
            <GainBlock label="Gain annuel estimé" value={formatEuros(gains.gainAnnuel)} />
            <GainBlock
              label="Sur 3 ans avec maintenance"
              value={formatEuros(gains.total3ans)}
              highlight
            />
          </div>

          {/* Annonce vocale ARIA pour les screen readers */}
          <p id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
            Gain mensuel estimé : {formatEuros(gains.gainMensuel)}. Gain annuel estimé :{" "}
            {formatEuros(gains.gainAnnuel)}. Sur 3 ans : {formatEuros(gains.total3ans)}.
          </p>
        </motion.div>

        <p
          className="mt-6 text-xs md:text-sm italic text-center max-w-3xl mx-auto"
          style={{ color: "var(--ned-silver)" }}
        >
          Estimations honnêtes basées sur nos tarifs effectifs. Aucun gain n'est garanti — votre
          rémunération dépend uniquement du nombre de clients réellement signés et payés.
        </p>
      </div>

      {/* Style local pour le slider (cross-browser, sans dépendance) */}
      <style>{`
        .ned-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(to right, var(--ned-accent) 0%, var(--ned-accent) ${
            ((contacts - 1) / 9) * 100
          }%, rgba(200,205,211,0.15) ${((contacts - 1) / 9) * 100}%, rgba(200,205,211,0.15) 100%);
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
