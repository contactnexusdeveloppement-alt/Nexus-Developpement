import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
interface CallNotes {
  proposed_price?: number;
  price_details?: string;
  client_accepted?: boolean;
  deposit_received?: boolean;
  deposit_amount?: number;
  estimated_start_date?: string;
  estimated_delivery_date?: string;
  // Website fields
  estimated_pages?: number;
  needs_contact_form?: boolean;
  needs_booking?: boolean;
  needs_payment?: boolean;
  needs_blog?: boolean;
  needs_chat?: boolean;
  needs_newsletter?: boolean;
  needs_user_accounts?: boolean;
  needs_gallery?: boolean;
  needs_multilingual?: boolean;
  multilingual_languages?: string;
  seo_important?: boolean;
  // Mobile fields
  target_platforms?: string;
  needs_authentication?: boolean;
  needs_push_notifications?: boolean;
  needs_store_publication?: boolean;
  needs_offline_mode?: boolean;
  needs_geolocation?: boolean;
  needs_camera_access?: boolean;
  // Automation fields
  tasks_to_automate?: string;
  estimated_volume?: string;
  execution_frequency?: string;
  // E-commerce
  product_count?: number;
  needs_stock_management?: boolean;
  // Visual
  has_existing_logo?: boolean;
}

interface QuoteRequest {
  services: string[];
  budget?: string;
  business_type?: string;
  project_details?: string;
}

interface EstimationTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
  quoteRequest?: QuoteRequest;
}

const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="text-lg font-bold text-white mb-3">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-base font-semibold text-blue-300 mb-2 mt-3">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-sm font-semibold text-cyan-300 mb-2 mt-2">{children}</h3>
      ),
      p: ({ children }) => (
        <p className="text-gray-200 mb-2 text-sm leading-relaxed">{children}</p>
      ),
      ul: ({ children }) => (
        <ul className="space-y-1 mb-3 ml-2">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="space-y-1 mb-3 ml-4 list-decimal">{children}</ol>
      ),
      li: ({ children }) => (
        <li className="text-gray-200 text-sm flex items-start gap-2">
          <span className="text-blue-400 mt-0.5">•</span>
          <span className="flex-1">{children}</span>
        </li>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold text-white">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="text-cyan-300 not-italic font-medium">{children}</em>
      ),
      hr: () => <hr className="border-blue-500/30 my-3" />,
      code: ({ children }) => (
        <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 text-xs">{children}</code>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const EstimationTab = ({ callNotes, updateCallNotes, quoteRequest }: EstimationTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiEstimation, setAiEstimation] = useState<string | null>(null);
  const [estimatedTotal, setEstimatedTotal] = useState<number | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionToken(session?.access_token || null);
    };
    getSession();
  }, []);
  const generateEstimation = async () => {
    if (!quoteRequest) {
      toast.error("Données du devis non disponibles");
      return;
    }

    if (!sessionToken) {
      toast.error("Session expirée, veuillez vous reconnecter");
      return;
    }

    setIsGenerating(true);
    setAiEstimation(null);
    setEstimatedTotal(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            type: "estimate_price",
            data: {
              callNotes,
              services: quoteRequest.services,
              budget: quoteRequest.budget,
              businessType: quoteRequest.business_type,
              projectDetails: quoteRequest.project_details,
            },
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Limite de requêtes atteinte, réessayez plus tard.");
        }
        if (response.status === 402) {
          throw new Error("Crédits insuffisants.");
        }
        throw new Error("Erreur du service IA");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream non disponible");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullText += content;
                setAiEstimation(fullText);
              }
            } catch {
              // Ignore incomplete JSON
            }
          }
        }
      }

      // Extract total from the response
      const totalMatch = fullText.match(/TOTAL[^:]*:\s*(\d[\d\s]*(?:[.,]\d+)?)\s*€/i);
      if (totalMatch) {
        const total = parseFloat(totalMatch[1].replace(/\s/g, "").replace(",", "."));
        setEstimatedTotal(total);
      }
    } catch (error) {
      console.error("Error generating estimation:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToPrice = () => {
    if (estimatedTotal) {
      updateCallNotes({ proposed_price: estimatedTotal });
      toast.success(`${estimatedTotal}€ copié dans le prix proposé`);
    }
  };

  const copyToDetails = () => {
    if (aiEstimation) {
      updateCallNotes({ price_details: aiEstimation });
      toast.success("Estimation copiée dans les détails");
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* AI Estimation Section */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-white">Estimation IA</h3>
          </div>
          <Button
            onClick={generateEstimation}
            disabled={isGenerating || !quoteRequest || !sessionToken}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer une estimation
              </>
            )}
          </Button>
        </div>

        {!quoteRequest && (
          <p className="text-sm text-yellow-400">
            ⚠️ Les données du devis ne sont pas disponibles pour générer une estimation.
          </p>
        )}

        {aiEstimation && (
          <div className="space-y-3">
            <ScrollArea className="h-[280px] rounded-lg border border-blue-500/30 bg-slate-900/50 p-4">
              <MarkdownContent content={aiEstimation} />
            </ScrollArea>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={copyToDetails}
                variant="outline"
                size="sm"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier dans les détails
              </Button>
              {estimatedTotal && (
                <Button
                  onClick={copyToPrice}
                  variant="outline"
                  size="sm"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copier {estimatedTotal.toLocaleString("fr-FR")}€ dans le prix
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="proposed_price" className="text-white">Prix proposé (€)</Label>
          <Input
            id="proposed_price"
            type="number"
            step="0.01"
            value={callNotes.proposed_price || ""}
            onChange={(e) => updateCallNotes({ proposed_price: parseFloat(e.target.value) || undefined })}
            placeholder="5000.00"
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price_details" className="text-white">Détails de l'estimation</Label>
          <Textarea
            id="price_details"
            value={callNotes.price_details || ""}
            onChange={(e) => updateCallNotes({ price_details: e.target.value })}
            placeholder="Décomposition du devis, options, conditions..."
            rows={4}
            className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-white">Client a accepté le devis ?</Label>
          <RadioGroup
            value={callNotes.client_accepted === undefined ? "" : callNotes.client_accepted ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ client_accepted: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="accepted-yes" />
              <Label htmlFor="accepted-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="accepted-no" />
              <Label htmlFor="accepted-no" className="text-gray-200 font-normal cursor-pointer">Non / En attente</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-white">Acompte reçu ?</Label>
          <RadioGroup
            value={callNotes.deposit_received === undefined ? "" : callNotes.deposit_received ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ deposit_received: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="deposit-yes" />
              <Label htmlFor="deposit-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="deposit-no" />
              <Label htmlFor="deposit-no" className="text-gray-200 font-normal cursor-pointer">Non / En attente</Label>
            </div>
          </RadioGroup>
        </div>

        {callNotes.deposit_received && (
          <div className="space-y-2">
            <Label htmlFor="deposit_amount" className="text-white">Montant de l'acompte (€)</Label>
            <Input
              id="deposit_amount"
              type="number"
              step="0.01"
              value={callNotes.deposit_amount || ""}
              onChange={(e) => updateCallNotes({ deposit_amount: parseFloat(e.target.value) || undefined })}
              placeholder="1500.00"
              className="bg-slate-800 border-blue-500/30 text-white"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimated_start_date" className="text-white">Date de début estimée</Label>
            <Input
              id="estimated_start_date"
              type="date"
              value={callNotes.estimated_start_date || ""}
              onChange={(e) => updateCallNotes({ estimated_start_date: e.target.value })}
              className="bg-slate-800 border-blue-500/30 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_delivery_date" className="text-white">Date de livraison estimée</Label>
            <Input
              id="estimated_delivery_date"
              type="date"
              value={callNotes.estimated_delivery_date || ""}
              onChange={(e) => updateCallNotes({ estimated_delivery_date: e.target.value })}
              className="bg-slate-800 border-blue-500/30 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationTab;
