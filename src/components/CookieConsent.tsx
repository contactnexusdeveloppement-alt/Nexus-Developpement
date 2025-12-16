import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-5xl">
        <div className="relative bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 border-2 border-blue-500/50 backdrop-blur-xl rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.5)] p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-blue-200/60 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pr-8">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">🍪 Cookies</h3>
              <p className="text-blue-100/90 text-sm">
                Ce site utilise des cookies techniques nécessaires pour son bon fonctionnement. Aucun cookie publicitaire ou de tracking n'est utilisé. En continuant votre navigation, vous acceptez l'utilisation de ces cookies.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link to="/mentions-legales" onClick={handleClose}>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto bg-white/10 border-blue-400/50 text-blue-100 hover:bg-white/20 hover:text-white"
                >
                  En savoir plus
                </Button>
              </Link>
              <Button 
                onClick={handleAccept}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                Accepter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;