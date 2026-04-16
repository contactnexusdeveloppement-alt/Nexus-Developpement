import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Cookie,
  Info,
  Settings,
  BarChart3,
  Target,
  ShieldCheck,
  Globe2,
  Mail,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect } from "react";
import { motion } from "framer-motion";

const CookiePolicy = () => {
  useEffect(() => {
    document.title = "Politique de Cookies | Nexus Développement";
  }, []);

  const sections = [
    {
      icon: Info,
      title: "1. Qu'est-ce qu'un cookie ?",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
            lors de la visite d'un site internet. Il permet au site de reconnaître votre navigateur,
            de mémoriser vos préférences et, dans certains cas, d'analyser votre navigation.
          </p>
          <p>
            La présente politique décrit les cookies et traceurs utilisés sur le site
            <strong className="text-white"> nexusdeveloppement.fr</strong>, conformément au RGPD
            (Règlement UE 2016/679), à la directive ePrivacy et aux recommandations de la CNIL.
          </p>
        </div>
      ),
    },
    {
      icon: ShieldCheck,
      title: "2. Cookies strictement nécessaires",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Ces cookies sont indispensables au bon fonctionnement du site (session d'authentification,
            mémorisation du choix de cookies, sécurité). Ils sont exemptés de consentement et ne peuvent
            être désactivés sans empêcher l'utilisation normale du site.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white">sb-* (Supabase)</strong> — session d'authentification, durée de 1 an ;</li>
            <li><strong className="text-white">cookie_consent</strong> — mémorisation de votre choix, durée de 6 mois.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: "3. Cookies de mesure d'audience",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Ces cookies nous permettent de mesurer la fréquentation du site et d'améliorer son contenu.
            Ils ne sont déposés qu'après votre consentement explicite, sauf si nous utilisons une solution
            exemptée par la CNIL (statistiques anonymes, durée de vie ≤ 13 mois, pas de croisement de
            données).
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Statistiques de visite : pages consultées, temps passé, parcours (durée ≤ 13 mois).</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Target,
      title: "4. Cookies tiers",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Certains services intégrés au site peuvent déposer leurs propres cookies (hébergement Vercel,
            intégrations éventuelles de vidéos, cartes, réseaux sociaux, polices distantes). Ces cookies
            sont soumis aux politiques de confidentialité de leurs éditeurs respectifs.
          </p>
          <p>
            Aucun cookie publicitaire, de profilage marketing ou de ciblage comportemental n'est déposé
            sans votre consentement préalable.
          </p>
        </div>
      ),
    },
    {
      icon: Settings,
      title: "5. Gestion de vos préférences",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Lors de votre première visite, un bandeau vous permet d'accepter, de refuser ou de personnaliser
            le dépôt des cookies soumis à consentement. Vous pouvez modifier votre choix à tout moment
            en vidant les cookies de votre navigateur et en rechargeant la page, ou via le lien dédié
            en pied de page du site.
          </p>
          <p>
            Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies.
            La désactivation de certains cookies peut toutefois altérer le fonctionnement du site.
          </p>
        </div>
      ),
    },
    {
      icon: Globe2,
      title: "6. Paramétrage par navigateur",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Les principaux navigateurs disposent d'une aide expliquant la gestion des cookies :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/fr-fr/microsoft-edge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: ListChecks,
      title: "7. Vos droits",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Conformément au RGPD, vous disposez de droits d'accès, de rectification, d'effacement,
            de limitation, d'opposition et de portabilité sur les données collectées via les cookies.
            Pour exercer ces droits, voir la
            {" "}
            <Link to="/confidentialite" className="text-blue-400 hover:text-blue-300 underline">
              Politique de Confidentialité
            </Link>
            .
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la CNIL :
            {" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              www.cnil.fr
            </a>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative font-sans text-slate-200">
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center md:justify-start">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-12 text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
              <Cookie className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4">
              Politique de Cookies
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Transparence totale sur les traceurs utilisés sur notre site.
            </p>
          </motion.div>

          <div className="grid gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                    <section.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 w-full">
                    <h2 className="text-xl font-bold text-white mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3">
                      {section.title}
                    </h2>
                    {section.content}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-slate-400 mb-4">Une question sur les cookies ?</p>
              <a
                href="mailto:contact.nexus.developpement@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-blue-200 transition-all duration-300 break-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all text-sm sm:text-base">
                  contact.nexus.developpement@gmail.com
                </span>
              </a>
            </motion.div>
          </div>

          <div className="mt-20 text-center border-t border-white/5 pt-8">
            <p className="text-slate-500 text-sm">
              Dernière mise à jour :{" "}
              {new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
