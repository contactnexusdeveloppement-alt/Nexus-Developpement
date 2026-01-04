import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";

// Lazy loading pages for performance
const Index = lazy(() => import("./pages/Index"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Team = lazy(() => import("./pages/Team"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WebsiteCreation = lazy(() => import("./pages/WebsiteCreation"));
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
const PublicQuoteWizard = lazy(() => import("./pages/PublicQuoteWizard"));

const queryClient = new QueryClient();

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/creation-site-web" element={<WebsiteCreation />} />
              <Route path="/automatisation" element={<Automation />} />
              <Route path="/applications-web" element={<WebApps />} />
              <Route path="/applications-mobiles" element={<MobileApps />} />
              <Route path="/identite-visuelle" element={<VisualIdentity />} />
              <Route path="/salon-coiffure" element={<SalonCoiffure />} />
              <Route path="/restaurant" element={<Restaurant />} />
              <Route path="/agence-immobiliere" element={<AgenceImmobiliere />} />
              <Route path="/agence-immo/property/:id" element={<PropertyDetail />} />

              <Route path="/mentions-legales" element={<LegalNotice />} />
              <Route path="/confidentialite" element={<PrivacyPolicy />} />
              <Route path="/cgu" element={<TermsOfService />} />
              <Route path="/equipe" element={<Team />} />
              <Route path="/nx-panel-8f4a" element={<AdminLogin />} />
              <Route path="/nx-panel-8f4a/dashboard" element={<AdminDashboard />} />

              <Route path="/concession-automobile" element={<Concession />} />
              <Route path="/catalogue" element={<ProjectsCatalog />} />
              <Route path="/devis-en-ligne" element={<PublicQuoteWizard />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ScrollToTop />
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
