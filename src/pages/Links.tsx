import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Instagram, Facebook, Globe } from "lucide-react";
import SEO from "@/components/SEO";
import AnimatedBackground from "@/components/AnimatedBackground";
import logo from "@/assets/nexus-logo.webp";

/**
 * Linktree custom pour les bios Instagram.
 * Volontairement sans Navigation ni Footer global : page focalisée 100 %
 * sur la redirection. Mobile-first (80 % du trafic vient d'Insta mobile).
 *
 * 3 niveaux visuels :
 *   - 'hero'    : CTA principal (audit gratuit). Plus gros, gradient bleu/teal,
 *                 glow intense, peut afficher un sous-texte promo.
 *   - default   : CTA standard (voir réalisations, demander devis).
 *   - 'compact' : CTA réduits (site, apporteur). Moins haut, font plus petite.
 */

interface LinkItem {
  icon: string;
  title: string;
  description?: string;
  href: string;
  /** True = <Link> React Router. False = <a target="_blank">. */
  internal: boolean;
  variant?: "hero" | "compact";
  /** Bandeau promo affiché en bas de la card (variant hero uniquement). */
  promo?: string;
}

const LINKS: LinkItem[] = [
  // CTA principal — le plus visible
  {
    icon: "🎁",
    title: "Audit gratuit · 15 min · 100% offert",
    description: "Réservez votre créneau, on analyse votre projet ensemble.",
    href: "/#reservation",
    internal: true,
    variant: "hero",
    promo: "🔥 Offre lancement -30% jusqu'au 15 sept",
  },
  // CTA secondaires (standard)
  {
    icon: "💼",
    title: "Voir nos réalisations",
    description: "Notre portfolio complet",
    href: "/catalogue",
    internal: true,
  },
  {
    icon: "📩",
    title: "Demander un devis",
    description: "Réponse sous 24 h",
    href: "/#devis",
    internal: true,
  },
  // CTA tertiaire (compact)
  {
    icon: "🌐",
    title: "Découvrir notre site",
    description: "Tous nos services",
    href: "/",
    internal: true,
    variant: "compact",
  },
  // En bas, format réduit, sans badge
  {
    icon: "🚀",
    title: "Devenir apporteur d'affaires",
    description: "20 % de commission · Sans engagement",
    href: "/apporteurs",
    internal: true,
    variant: "compact",
  },
];

const SOCIALS = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/nexus_developpement/",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61584419880166&sk=about",
  },
  {
    icon: Globe,
    label: "Site web Nexus Développement",
    href: "https://nexusdeveloppement.fr",
  },
];

const Links = () => {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#0a0f1e" }}>
      <SEO
        title="Liens utiles · Nexus Développement"
        description="Réservez votre audit gratuit, découvrez nos réalisations, demandez un devis ou rejoignez notre programme apporteur d'affaires."
        canonical="https://nexusdeveloppement.fr/links"
      />

      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      <a
        href="#links-list"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-500 focus:text-white"
      >
        Aller aux liens
      </a>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start py-10 px-6">
        <div className="w-full max-w-[480px]">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <img
              src={logo}
              alt="Logo Nexus Développement"
              width={130}
              height={130}
              className="w-[130px] h-[130px] mx-auto drop-shadow-[0_0_25px_rgba(100,150,255,0.4)]"
              loading="eager"
              fetchPriority="high"
            />
            <h1 className="mt-4 text-2xl font-bold text-white tracking-tight">
              Nexus Développement
            </h1>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Agence Numérique · Yvelines
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Création de sites internet, applications mobiles, automatisations et branding visuel.{" "}
              <span className="text-blue-400 font-medium">On code, vous touchez.</span>
            </p>
          </motion.header>

          {/* Liens */}
          <motion.ul
            id="links-list"
            className="flex flex-col gap-[14px]"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.15 },
              },
            }}
            aria-label="Liens utiles"
          >
            {LINKS.map((item) => (
              <motion.li
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
              >
                <LinkCard item={item} />
              </motion.li>
            ))}
          </motion.ul>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex justify-center gap-3"
            aria-label="Réseaux sociaux"
          >
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="links-icon flex items-center justify-center w-11 h-11 rounded-xl border bg-[rgba(15,30,54,0.7)] backdrop-blur-md transition-all"
                  style={{ borderColor: "rgba(74,158,255,0.2)" }}
                >
                  <Icon className="w-5 h-5 text-blue-200" aria-hidden="true" />
                </a>
              );
            })}
          </motion.div>

          {/* Footer minimaliste */}
          <footer className="mt-10 text-center text-[11px] uppercase tracking-wider text-slate-500">
            © 2026 Nexus Développement ·{" "}
            <Link to="/mentions-legales" className="hover:text-blue-400 transition-colors">
              Mentions légales
            </Link>
          </footer>
        </div>
      </main>

      {/* Styles spécifiques à la page */}
      <style>{`
        /* === Base : commun à toutes les variantes ============================= */
        .links-card {
          display: block;
          width: 100%;
          background: rgba(15, 30, 54, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(74, 158, 255, 0.2);
          border-radius: 16px;
          padding: 18px 22px;
          color: inherit;
          text-decoration: none;
          position: relative;
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          will-change: transform;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .links-card:hover,
        .links-card:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(74, 158, 255, 0.55);
          box-shadow: 0 8px 24px -8px rgba(74, 158, 255, 0.35),
                      0 0 24px -4px rgba(74, 158, 255, 0.25);
          outline: none;
        }
        .links-card:focus-visible {
          box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.7),
                      0 8px 24px -8px rgba(74, 158, 255, 0.4);
        }

        .links-card__row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .links-card__icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background-color: rgba(74, 158, 255, 0.08);
          border: 1px solid rgba(74, 158, 255, 0.2);
          font-size: 1.25rem;
          line-height: 1;
        }
        .links-card__body {
          flex: 1 1 0%;
          min-width: 0;
        }
        .links-card__title {
          display: block;
          color: white;
          font-weight: 700;
          font-size: 15px;
          line-height: 1.25;
        }
        .links-card__desc {
          display: block;
          font-size: 13px;
          color: rgba(203, 213, 225, 0.8);
          margin-top: 4px;
        }
        .links-arrow {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          color: rgb(147, 197, 253);
          transition: transform 0.22s ease;
        }
        .links-card:hover .links-arrow,
        .links-card:focus-visible .links-arrow {
          transform: translateX(4px);
        }

        /* === Variant Hero (CTA principal) ===================================== */
        .links-card--hero {
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.28) 0%, rgba(45, 212, 191, 0.12) 100%);
          border: 1.5px solid rgba(74, 158, 255, 0.7);
          padding: 24px 28px;
          box-shadow: 0 0 36px -4px rgba(74, 158, 255, 0.4),
                      0 4px 16px -4px rgba(45, 212, 191, 0.2);
        }
        .links-card--hero:hover,
        .links-card--hero:focus-visible {
          box-shadow: 0 8px 40px -4px rgba(74, 158, 255, 0.55),
                      0 0 48px -4px rgba(74, 158, 255, 0.4);
        }
        .links-card--hero .links-card__icon {
          width: 56px;
          height: 56px;
          font-size: 1.75rem;
          background-color: rgba(74, 158, 255, 0.2);
          border-color: rgba(74, 158, 255, 0.5);
        }
        .links-card--hero .links-card__title {
          font-size: 17px;
          font-weight: 800;
        }
        .links-card--hero .links-card__desc {
          font-size: 13px;
          color: rgba(226, 232, 240, 0.85);
        }
        .links-card--hero .links-arrow {
          width: 24px;
          height: 24px;
        }

        /* Bandeau promo (dans la card hero uniquement) */
        .links-card__promo {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(74, 158, 255, 0.28);
          font-size: 13px;
          font-weight: 600;
          color: rgb(94, 234, 212);
          text-align: center;
          letter-spacing: 0.01em;
        }

        /* === Variant Compact (réduit, en bas) ================================ */
        .links-card--compact {
          padding: 12px 18px;
          background: rgba(15, 30, 54, 0.5);
        }
        .links-card--compact .links-card__icon {
          width: 36px;
          height: 36px;
          font-size: 1rem;
        }
        .links-card--compact .links-card__title {
          font-size: 13px;
          font-weight: 600;
        }
        .links-card--compact .links-card__desc {
          font-size: 11px;
          margin-top: 2px;
        }
        .links-card--compact .links-arrow {
          width: 16px;
          height: 16px;
        }

        /* === Socials carrés ================================================== */
        .links-icon:hover,
        .links-icon:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(74, 158, 255, 0.55) !important;
          box-shadow: 0 8px 24px -8px rgba(74, 158, 255, 0.35),
                      0 0 24px -4px rgba(74, 158, 255, 0.25);
          outline: none;
        }
        .links-icon:focus-visible {
          box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.7) !important;
        }

        /* === Accessibilité : prefers-reduced-motion ========================== */
        @media (prefers-reduced-motion: reduce) {
          .links-card,
          .links-arrow,
          .links-icon {
            transition: none !important;
          }
          .links-card:hover,
          .links-card:focus-visible,
          .links-icon:hover,
          .links-icon:focus-visible {
            transform: none !important;
          }
          .links-card:hover .links-arrow,
          .links-card:focus-visible .links-arrow {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const LinkCard = ({ item }: { item: LinkItem }) => {
  const variantClass = item.variant ? `links-card--${item.variant}` : "";
  const className = `links-card ${variantClass}`.trim();

  const content = (
    <>
      <div className="links-card__row">
        <span aria-hidden="true" className="links-card__icon">
          {item.icon}
        </span>
        <span className="links-card__body">
          <span className="links-card__title">{item.title}</span>
          {item.description && (
            <span className="links-card__desc">{item.description}</span>
          )}
        </span>
        <ArrowRight className="links-arrow" aria-hidden="true" />
      </div>
      {item.promo && <div className="links-card__promo">{item.promo}</div>}
    </>
  );

  // Navigation interne (React Router)
  if (item.internal) {
    return (
      <Link to={item.href} className={className} aria-label={item.title}>
        {content}
      </Link>
    );
  }

  // Lien externe (nouvel onglet)
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={item.title}
    >
      {content}
    </a>
  );
};

export default Links;
