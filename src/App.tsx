import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));

// Admin pages
const TeamManagement = lazy(() => import("./pages/admin/TeamManagement"));

// Sales Portal pages
const SalesDashboard = lazy(() => import("./pages/sales/SalesDashboard"));
const ProspectsList = lazy(() => import("./pages/sales/ProspectsList"));
const QuoteGenerator = lazy(() => import("./pages/sales/QuoteGenerator"));
const TrainingResources = lazy(() => import("./pages/sales/TrainingResources"));

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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
              <Route
                path="/nx-panel-8f4a/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/nx-panel-8f4a/team"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <TeamManagement />
                  </ProtectedRoute>
                }
              />

              {/* Sales Portal Routes */}
              <Route
                path="/sales/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['sales']}>
                    <SalesDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales/prospects"
                element={
                  <ProtectedRoute allowedRoles={['sales']}>
                    <ProspectsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales/quote-generator"
                element={
                  <ProtectedRoute allowedRoles={['sales']}>
                    <QuoteGenerator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales/training"
                element={
                  <ProtectedRoute allowedRoles={['sales']}>
                    <TrainingResources />
                  </ProtectedRoute>
                }
              />

              <Route path="/concession-automobile" element={<Concession />} />
              <Route path="/catalogue" element={<ProjectsCatalog />} />

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
