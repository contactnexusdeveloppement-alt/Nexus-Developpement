import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";

const SUGGESTIONS = [
  { label: "Création de site web", href: "/creation-site-web" },
  { label: "Automatisation de processus", href: "/automatisation" },
  { label: "Applications mobiles", href: "/applications-mobiles" },
  { label: "Identité visuelle", href: "/identite-visuelle" },
  { label: "Nos réalisations", href: "/catalogue" },
  { label: "L'équipe Nexus", href: "/equipe" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page non trouvée (404) | Nexus Développement";

    const robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex, nofollow");
    document.head.appendChild(robots);

    const status = document.createElement("meta");
    status.setAttribute("name", "prerender-status-code");
    status.setAttribute("content", "404");
    document.head.appendChild(status);

    return () => {
      document.title = previousTitle;
      robots.remove();
      status.remove();
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          <h1 className="mb-4 text-8xl font-bold bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            404
          </h1>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-white">
            Cette page n'existe pas
          </h2>
          <p className="mb-2 text-base text-gray-300">
            L'URL{" "}
            <code className="px-2 py-1 rounded bg-slate-800 text-cyan-300 text-sm">
              {location.pathname}
            </code>{" "}
            ne correspond à aucune page.
          </p>
          <p className="mb-8 text-gray-400">
            Voici les pages les plus consultées sur le site :
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-10 text-left">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="group flex items-center justify-between bg-slate-900/40 border border-white/10 hover:border-cyan-500/40 rounded-xl px-4 py-3 transition-colors"
              >
                <span className="text-blue-100">{s.label}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
