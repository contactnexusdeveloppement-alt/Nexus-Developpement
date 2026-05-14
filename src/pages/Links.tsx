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
 */

interface LinkItem {
  icon: string; // emoji
  title: string;
  description: string;
  href: string;
  /** True = <Link> React Router. False = <a target="_blank">. */
  internal: boolean;
  featured?: boolean;
}

const LINKS: LinkItem[] = [
  {
    icon: "🌐",
    title: "Notre site",
    description: "Découvre nos services & nos projets",
    href: "/",
    internal: true,
  },
  {
    icon: "💎",
    title: "Créer mon site internet",
    description: "Vitrine, e-commerce, sur-mesure",
    href: "/creation-site-web",
    internal: true,
  },
  {
    icon: "📩",
    title: "Demander un devis",
    description: "Réponse sous 24 h",
    href: "/#devis",
    internal: true,
  },
  {
    icon: "🚀",
    title: "Devenir apporteur d'affaires",
    description: "20 % de commission · Sans engagement",
    href: "/apporteurs",
    internal: true,
    featured: true,
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
        description="Accède directement à notre programme apporteurs d'affaires, nos services et notre formulaire de contact."
        canonical="https://nexusdeveloppement.fr/links"
      />

      {/* Fond animé canvas — pattern identique aux autres pages du site */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      {/* Skip link clavier */}
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
              Agence Numérique · Paris
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

      {/* Styles spécifiques à la page (hover/focus, reduced-motion) */}
      <style>{`
        .links-card {
          background: rgba(15, 30, 54, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(74, 158, 255, 0.2);
          border-radius: 16px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: inherit;
          text-decoration: none;
          position: relative;
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          will-change: transform;
          /* Normalise le rendu entre <a> et <button> (le button a une font/align/width différents par défaut) */
          font: inherit;
          text-align: left;
          width: 100%;
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
        .links-card .links-arrow {
          transition: transform 0.22s ease;
        }
        .links-card:hover .links-arrow,
        .links-card:focus-visible .links-arrow {
          transform: translateX(4px);
        }

        .links-card--featured {
          background: linear-gradient(135deg, rgba(74,158,255,0.18) 0%, rgba(45,212,191,0.10) 100%);
          border: 1.5px solid rgba(74, 158, 255, 0.6);
          box-shadow: 0 0 24px -4px rgba(74, 158, 255, 0.35),
                      0 4px 16px -4px rgba(45, 212, 191, 0.15);
        }
        .links-card--featured:hover,
        .links-card--featured:focus-visible {
          box-shadow: 0 8px 32px -4px rgba(74, 158, 255, 0.5),
                      0 0 40px -4px rgba(74, 158, 255, 0.35);
        }

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

        @media (prefers-reduced-motion: reduce) {
          .links-card,
          .links-card .links-arrow,
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
  const content = (
    <>
      {/* Icône carrée 44×44 */}
      <span
        aria-hidden="true"
        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl text-xl"
        style={{
          backgroundColor: item.featured ? "rgba(74,158,255,0.18)" : "rgba(74,158,255,0.08)",
          border: "1px solid rgba(74,158,255,0.2)",
        }}
      >
        {item.icon}
      </span>

      {/* Body */}
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-white text-[15px] leading-tight">
          {item.title}
        </span>
        <span className="block text-[13px] text-slate-300/80 mt-1 truncate">
          {item.description}
        </span>
      </span>

      {/* Flèche */}
      <ArrowRight
        className="links-arrow flex-shrink-0 w-5 h-5 text-blue-300"
        aria-hidden="true"
      />

      {/* Badge featured */}
      {item.featured && (
        <span
          className="absolute -top-2 right-3 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full"
          style={{
            backgroundColor: "#2DD4BF",
            color: "#042F2A",
            boxShadow: "0 4px 12px -2px rgba(45, 212, 191, 0.45)",
          }}
          aria-label="Nouveau"
        >
          Nouveau
        </span>
      )}
    </>
  );

  const className = `links-card ${item.featured ? "links-card--featured" : ""}`;

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
