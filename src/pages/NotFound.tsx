import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";

const NotFound = () => {
  useEffect(() => {
    document.title = "Page non trouvée | Nexus Développement";
    return () => {
      document.title = "Nexus Développement | Sites Web, Automatisation & Identité Visuelle";
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      {/* Arrière-plan animé */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>
      
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-8xl font-bold bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            404
          </h1>
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Page non trouvée
          </h2>
          <p className="mb-8 text-lg text-gray-300 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
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
