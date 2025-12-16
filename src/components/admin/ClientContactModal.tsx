import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Check } from "lucide-react";
import ClientSummaryTab from "./tabs/ClientSummaryTab";
import CallInfoTab from "./tabs/CallInfoTab";
import { BusinessTab } from "./tabs/BusinessTab";
import GeneralQuestionsTab from "./tabs/GeneralQuestionsTab";
import VisualIdentityTab from "./tabs/VisualIdentityTab";
import WebsiteTab from "./tabs/WebsiteTab";
import { EcommerceTab } from "./tabs/EcommerceTab";
import MobileAppTab from "./tabs/MobileAppTab";
import { AutomationTab } from "./tabs/AutomationTab";
import { ProjectManagementTab } from "./tabs/ProjectManagementTab";
import EstimationTab from "./tabs/EstimationTab";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business_type?: string;
  services: string[];
  project_details?: string;
  budget?: string;
  timeline?: string;
  created_at: string;
}

interface CallNotes {
  id?: string;
  quote_request_id: string;
  call_status?: string;
  call_date?: string;
  call_notes?: string;
  // Business
  target_audience?: string;
  project_objectives?: string;
  competitors?: string;
  social_media_presence?: string;
  // General
  has_domain?: boolean;
  domain_name?: string;
  has_hosting?: boolean;
  hosting_details?: string;
  // Visual Identity
  has_existing_logo?: boolean;
  logo_received_by_email?: boolean;
  existing_tagline?: string;
  existing_brand_guidelines?: boolean;
  preferred_colors?: string;
  preferred_fonts?: string;
  style_preferences?: string;
  inspirations?: string;
  elements_to_avoid?: string;
  // Website
  estimated_pages?: number;
  example_sites?: string;
  needs_contact_form?: boolean;
  needs_booking?: boolean;
  needs_payment?: boolean;
  needs_blog?: boolean;
  needs_chat?: boolean;
  needs_newsletter?: boolean;
  needs_user_accounts?: boolean;
  needs_gallery?: boolean;
  other_features?: string;
  content_ready?: boolean;
  needs_professional_photos?: boolean;
  needs_multilingual?: boolean;
  multilingual_languages?: string;
  seo_important?: boolean;
  seo_keywords?: string;
  needs_analytics?: boolean;
  needs_social_integration?: boolean;
  who_updates_after?: string;
  // E-commerce
  product_count?: number;
  needs_stock_management?: boolean;
  delivery_methods?: string;
  payment_methods?: string;
  needs_invoicing?: boolean;
  // Mobile
  target_platforms?: string;
  app_main_features?: string;
  needs_authentication?: boolean;
  needs_push_notifications?: boolean;
  needs_store_publication?: boolean;
  needs_offline_mode?: boolean;
  needs_geolocation?: boolean;
  needs_camera_access?: boolean;
  third_party_integrations?: string;
  // Automation
  current_tools?: string;
  tasks_to_automate?: string;
  estimated_volume?: string;
  recurring_budget?: string;
  automation_users?: string;
  execution_frequency?: string;
  // Project Management
  main_contact_name?: string;
  main_contact_role?: string;
  validation_availability?: string;
  urgency_level?: string;
  urgent_deadline?: string;
  preferred_communication?: string;
  needs_training?: boolean;
  wants_maintenance_contract?: boolean;
  // Estimation
  proposed_price?: number;
  price_details?: string;
  client_accepted?: boolean;
  deposit_received?: boolean;
  deposit_amount?: number;
  estimated_start_date?: string;
  estimated_delivery_date?: string;
}

interface ClientContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteRequest: QuoteRequest;
}

const ClientContactModal = ({ open, onOpenChange, quoteRequest }: ClientContactModalProps) => {
  const [callNotes, setCallNotes] = useState<CallNotes>({ quote_request_id: quoteRequest.id });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChangesRef = useRef(false);

  useEffect(() => {
    if (open) {
      loadCallNotes();
    }
  }, [open, quoteRequest.id]);

  // Auto-save effect
  useEffect(() => {
    if (!open) {
      // Clear interval when modal closes
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
      return;
    }

    // Set up auto-save every 30 seconds
    autoSaveIntervalRef.current = setInterval(() => {
      if (hasUnsavedChangesRef.current && !isSaving && !isAutoSaving) {
        handleAutoSave();
      }
    }, 30000); // 30 seconds

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
  }, [open, isSaving, isAutoSaving]);

  const loadCallNotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("client_call_notes")
        .select("*")
        .eq("quote_request_id", quoteRequest.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCallNotes(data);
      } else {
        setCallNotes({ quote_request_id: quoteRequest.id });
      }
    } catch (error) {
      console.error("Error loading call notes:", error);
      toast.error("Erreur lors du chargement des notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    try {
      const { error } = await supabase
        .from("client_call_notes")
        .upsert(callNotes, { onConflict: "quote_request_id" });

      if (error) throw error;

      setLastSaved(new Date());
      hasUnsavedChangesRef.current = false;
    } catch (error) {
      console.error("Error auto-saving call notes:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("client_call_notes")
        .upsert(callNotes, { onConflict: "quote_request_id" });

      if (error) throw error;

      setLastSaved(new Date());
      hasUnsavedChangesRef.current = false;
      toast.success("Notes sauvegardées avec succès");
    } catch (error) {
      console.error("Error saving call notes:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const updateCallNotes = (updates: Partial<CallNotes>) => {
    setCallNotes((prev) => ({ ...prev, ...updates }));
    hasUnsavedChangesRef.current = true;
  };

  const hasLogoService = quoteRequest.services.some((s) => {
    const lower = s.toLowerCase();
    // Afficher l'onglet Identité visuelle pour tout projet avec logo/branding OU site web/webapp
    return (
      lower.includes("logo") ||
      lower.includes("branding") ||
      lower.includes("website") ||
      lower.includes("webapp") ||
      lower.includes("site") ||
      lower.includes("web")
    );
  });
  const hasWebsiteService = quoteRequest.services.some((s) => {
    const lower = s.toLowerCase();
    return lower.includes("site") || lower.includes("web") || lower.includes("website") || lower.includes("webapp");
  });
  const hasMobileService = quoteRequest.services.some((s) => {
    const lower = s.toLowerCase();
    return lower.includes("mobile") || (lower.includes("app") && !lower.includes("webapp") && !lower.includes("web"));
  });
  const hasAutomationService = quoteRequest.services.some((s) =>
    s.toLowerCase().includes("automation") || s.toLowerCase().includes("automatisation")
  );
  
  // E-commerce tab visible only if payment is needed
  const hasEcommerceNeeds = callNotes.needs_payment === true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-slate-900/95 backdrop-blur-xl border-blue-500/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Contact Client - {quoteRequest.name}
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm">
              {isAutoSaving ? (
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Save className="h-4 w-4 animate-pulse" />
                  <span>Sauvegarde...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center gap-1.5 text-green-400">
                  <Check className="h-4 w-4" />
                  <span>
                    Sauvegardé à {lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : (
          <>
            <Tabs defaultValue="summary" className="w-full flex flex-col flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-11 gap-1 bg-slate-800/50 border border-blue-500/20">
                <TabsTrigger value="summary" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Résumé</TabsTrigger>
                <TabsTrigger value="call" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Appel</TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Business</TabsTrigger>
                <TabsTrigger value="general" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Général</TabsTrigger>
                {hasLogoService && <TabsTrigger value="visual" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Visuel</TabsTrigger>}
                {hasWebsiteService && <TabsTrigger value="website" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Site Web</TabsTrigger>}
                {hasEcommerceNeeds && <TabsTrigger value="ecommerce" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">E-com</TabsTrigger>}
                {hasMobileService && <TabsTrigger value="mobile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Mobile</TabsTrigger>}
                {hasAutomationService && <TabsTrigger value="automation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Auto.</TabsTrigger>}
                <TabsTrigger value="project" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Projet</TabsTrigger>
                <TabsTrigger value="estimation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Devis</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="summary">
                  <ClientSummaryTab quoteRequest={quoteRequest} />
                </TabsContent>

            <TabsContent value="call">
              <CallInfoTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
            </TabsContent>

            <TabsContent value="business">
              <BusinessTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
            </TabsContent>

            <TabsContent value="general">
              <GeneralQuestionsTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
            </TabsContent>

              {hasLogoService && (
                <TabsContent value="visual">
                  <VisualIdentityTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
                </TabsContent>
              )}

            {hasWebsiteService && (
              <TabsContent value="website">
                <WebsiteTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
              </TabsContent>
            )}

            {hasEcommerceNeeds && (
              <TabsContent value="ecommerce">
                <EcommerceTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
              </TabsContent>
            )}

            {hasMobileService && (
              <TabsContent value="mobile">
                <MobileAppTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
              </TabsContent>
            )}

            {hasAutomationService && (
              <TabsContent value="automation">
                <AutomationTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
              </TabsContent>
            )}

            <TabsContent value="project">
              <ProjectManagementTab callNotes={callNotes} updateCallNotes={updateCallNotes} />
            </TabsContent>

            <TabsContent value="estimation">
              <EstimationTab callNotes={callNotes} updateCallNotes={updateCallNotes} quoteRequest={quoteRequest} />
            </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-blue-500/30">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientContactModal;