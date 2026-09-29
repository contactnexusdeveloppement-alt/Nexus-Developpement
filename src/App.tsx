import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
// Import statique : l'accueil est hydraté à partir du HTML pré-rendu (voir main.tsx).
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import ClientOnly from "./components/ClientOnly";
import HashScroll from "./components/HashScroll";
import { LOCAL_CITIES } from "./data/localCities";

// Lazy loading pages for performance
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CGV = lazy(() => import("./pages/CGV"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Team = lazy(() => import("./pages/Team"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WebsiteCreation = lazy(() => import("./pages/WebsiteCreation"));
const Ecommerce = lazy(() => import("./pages/Ecommerce"));
const Automation = lazy(() => import("./pages/Automation"));
const WebApps = lazy(() => import("./pages/WebApps"));
const MobileApps = lazy(() => import("./pages/MobileApps"));
const VisualIdentity = lazy(() => import("./pages/VisualIdentity"));
const SalonCoiffure = lazy(() => import("./pages/SalonCoiffure"));
const Restaurant = lazy(() => import("./pages/Restaurant"));
const Concession = lazy(() => import("./pages/Concession"));
const AgenceImmobiliere = lazy(() => import("./pages/AgenceImmobiliere"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const ProjectsCatalog = lazy(() => import("./pages/ProjectsCatalog"));
const LocalCity = lazy(() => import("./pages/LocalCity"));
const Apporteurs = lazy(() => import("./pages/Apporteurs"));
const Links = lazy(() => import("./pages/Links"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Chaque route lazy a sa propre frontière Suspense : l'accueil (import statique)
// est ainsi hydraté sans passer par un Suspense absent du HTML pré-rendu.
const withSuspense = (element: React.ReactNode) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Les toasters rendent un nœud après montage : montés hors hydratation pour ne pas faire échouer celle de l'accueil pré-rendu */}
      <ClientOnly>
        <Toaster />
        <Sonner />
      </ClientOnly>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/creation-site-web" element={withSuspense(<WebsiteCreation />)} />
            <Route path="/e-commerce" element={withSuspense(<Ecommerce />)} />
            <Route path="/automatisation" element={withSuspense(<Automation />)} />
            <Route path="/applications-web" element={withSuspense(<WebApps />)} />
            <Route path="/applications-mobiles" element={withSuspense(<MobileApps />)} />
            <Route path="/identite-visuelle" element={withSuspense(<VisualIdentity />)} />
            <Route path="/salon-coiffure" element={withSuspense(<SalonCoiffure />)} />
            <Route path="/restaurant" element={withSuspense(<Restaurant />)} />
            <Route path="/agence-immobiliere" element={withSuspense(<AgenceImmobiliere />)} />
            <Route path="/agence-immo/property/:id" element={withSuspense(<PropertyDetail />)} />
            <Route path="/concession-automobile" element={withSuspense(<Concession />)} />
            <Route path="/catalogue" element={withSuspense(<ProjectsCatalog />)} />

            <Route path="/mentions-legales" element={withSuspense(<LegalNotice />)} />
            <Route path="/confidentialite" element={withSuspense(<PrivacyPolicy />)} />
            <Route path="/cgu" element={withSuspense(<TermsOfService />)} />
            <Route path="/cgv" element={withSuspense(<CGV />)} />
            <Route path="/cookies" element={withSuspense(<CookiePolicy />)} />
            <Route path="/equipe" element={withSuspense(<Team />)} />
            <Route path="/apporteurs" element={withSuspense(<Apporteurs />)} />
            <Route path="/links" element={withSuspense(<Links />)} />

            {LOCAL_CITIES.map((city) => (
              <Route
                key={city.slug}
                path={`/${city.slug}`}
                element={withSuspense(<LocalCity slug={city.slug} />)}
              />
            ))}

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={withSuspense(<NotFound />)} />
          </Routes>
        <ScrollToTop />
        <HashScroll />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
