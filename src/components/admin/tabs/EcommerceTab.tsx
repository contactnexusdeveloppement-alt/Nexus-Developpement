import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface CallNotes {
  product_count?: number;
  needs_stock_management?: boolean;
  delivery_methods?: string;
  payment_methods?: string;
  needs_invoicing?: boolean;
}

interface EcommerceTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

export const EcommerceTab = ({ callNotes, updateCallNotes }: EcommerceTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-4">
      <div>
        <Label htmlFor="product_count">Combien de produits/services à vendre ?</Label>
        <Input
          id="product_count"
          type="number"
          value={callNotes.product_count || ""}
          onChange={(e) => updateCallNotes({ product_count: parseInt(e.target.value) || undefined })}
          placeholder="Nombre approximatif"
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-white">Besoin de gestion de stock ?</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Suivi automatique des stocks, alertes de rupture, gestion multi-entrepôts si nécessaire</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={callNotes.needs_stock_management?.toString()}
          onValueChange={(value) => updateCallNotes({ needs_stock_management: value === "true" })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="stock_yes" />
            <Label htmlFor="stock_yes">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="stock_no" />
            <Label htmlFor="stock_no">Non</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="delivery_methods" className="text-white">Modes de livraison souhaités ?</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Colissimo, Chronopost, retrait en magasin, livraison express, internationale...</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="delivery_methods"
          value={callNotes.delivery_methods || ""}
          onChange={(e) => updateCallNotes({ delivery_methods: e.target.value })}
          placeholder="Ex: Colissimo, Chronopost, retrait en magasin..."
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="payment_methods">Moyens de paiement souhaités ?</Label>
        <Input
          id="payment_methods"
          value={callNotes.payment_methods || ""}
          onChange={(e) => updateCallNotes({ payment_methods: e.target.value })}
          placeholder="Ex: Stripe, PayPal, virement..."
          className="mt-2"
        />
      </div>

      <div>
        <Label>Facturation automatique nécessaire ?</Label>
        <RadioGroup
          value={callNotes.needs_invoicing?.toString()}
          onValueChange={(value) => updateCallNotes({ needs_invoicing: value === "true" })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="invoice_yes" />
            <Label htmlFor="invoice_yes">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="invoice_no" />
            <Label htmlFor="invoice_no">Non</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
    </TooltipProvider>
  );
};