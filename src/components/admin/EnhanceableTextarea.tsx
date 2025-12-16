import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Undo2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface EnhanceableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  fieldContext: string;
  className?: string;
  id?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const EnhanceableTextarea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  fieldContext,
  className,
  id,
}: EnhanceableTextareaProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionToken(session?.access_token || null);
    };
    getSession();
  }, []);

  const enhanceText = async () => {
    if (!value?.trim()) {
      toast.error("Écrivez d'abord du texte à améliorer");
      return;
    }

    setIsEnhancing(true);
    setOriginalText(value);

    try {
      if (!sessionToken) {
        toast.error("Session expirée, veuillez vous reconnecter");
        setIsEnhancing(false);
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-ai-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          type: "enhance_text",
          data: {
            originalText: value,
            fieldContext,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Limite de requêtes atteinte, réessayez plus tard");
          return;
        }
        if (response.status === 402) {
          toast.error("Crédits IA insuffisants");
          return;
        }
        throw new Error("Erreur du service IA");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let enhancedText = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        const text = decoder.decode(chunk);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                enhancedText += content;
                onChange(enhancedText);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      toast.success("Texte amélioré !");
    } catch (error) {
      console.error("Error enhancing text:", error);
      toast.error("Erreur lors de l'amélioration");
      setOriginalText(null);
    } finally {
      setIsEnhancing(false);
    }
  };

  const undoEnhancement = () => {
    if (originalText !== null) {
      onChange(originalText);
      setOriginalText(null);
      toast.info("Texte original restauré");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={enhanceText}
          disabled={isEnhancing || !value?.trim()}
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Amélioration...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              Améliorer
            </>
          )}
        </Button>
        {originalText !== null && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={undoEnhancement}
            className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300"
          >
            <Undo2 className="h-3 w-3 mr-1" />
            Annuler
          </Button>
        )}
      </div>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500",
          className
        )}
      />
    </div>
  );
};

export default EnhanceableTextarea;
