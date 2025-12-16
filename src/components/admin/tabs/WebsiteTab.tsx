import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import EnhanceableTextarea from "../EnhanceableTextarea";

interface CallNotes {
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
}

interface WebsiteTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

const WebsiteTab = ({ callNotes, updateCallNotes }: WebsiteTabProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_pages" className="text-white">Nombre de pages estimé</Label>
          <Input
            id="estimated_pages"
            type="number"
            value={callNotes.estimated_pages || ""}
            onChange={(e) => updateCallNotes({ estimated_pages: parseInt(e.target.value) || undefined })}
            placeholder="5"
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="example_sites" className="text-white">Sites exemples qu'il aime</Label>
          <EnhanceableTextarea
            id="example_sites"
            value={callNotes.example_sites || ""}
            onChange={(value) => updateCallNotes({ example_sites: value })}
            placeholder="URLs des sites qui plaisent au client..."
            rows={3}
            fieldContext="sites_exemples"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-white">Fonctionnalités nécessaires</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_contact_form"
                checked={callNotes.needs_contact_form || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_contact_form: checked as boolean })}
              />
              <Label htmlFor="needs_contact_form" className="text-gray-200 font-normal cursor-pointer">
                Formulaire de contact
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_booking"
                checked={callNotes.needs_booking || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_booking: checked as boolean })}
              />
              <Label htmlFor="needs_booking" className="text-gray-200 font-normal cursor-pointer">
                Système de réservation
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_payment"
                checked={callNotes.needs_payment || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_payment: checked as boolean })}
              />
              <Label htmlFor="needs_payment" className="text-gray-200 font-normal cursor-pointer">
                Paiement en ligne
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_blog"
                checked={callNotes.needs_blog || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_blog: checked as boolean })}
              />
              <Label htmlFor="needs_blog" className="text-gray-200 font-normal cursor-pointer">
                Blog
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_chat"
                checked={callNotes.needs_chat || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_chat: checked as boolean })}
              />
              <Label htmlFor="needs_chat" className="text-gray-200 font-normal cursor-pointer">
                Chat en direct
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_newsletter"
                checked={callNotes.needs_newsletter || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_newsletter: checked as boolean })}
              />
              <Label htmlFor="needs_newsletter" className="text-gray-200 font-normal cursor-pointer">
                Newsletter
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_user_accounts"
                checked={callNotes.needs_user_accounts || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_user_accounts: checked as boolean })}
              />
              <Label htmlFor="needs_user_accounts" className="text-gray-200 font-normal cursor-pointer">
                Espace client (comptes utilisateurs)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_gallery"
                checked={callNotes.needs_gallery || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_gallery: checked as boolean })}
              />
              <Label htmlFor="needs_gallery" className="text-gray-200 font-normal cursor-pointer">
                Galerie photo/portfolio
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="other_features" className="text-white">Autres fonctionnalités spécifiques</Label>
          <EnhanceableTextarea
            id="other_features"
            value={callNotes.other_features || ""}
            onChange={(value) => updateCallNotes({ other_features: value })}
            placeholder="Autres besoins particuliers..."
            rows={3}
            fieldContext="autres_fonctionnalites"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-white">Contenu déjà prêt (textes, images) ?</Label>
          <RadioGroup
            value={callNotes.content_ready === undefined ? "" : callNotes.content_ready ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ content_ready: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="content-yes" />
              <Label htmlFor="content-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="content-no" />
              <Label htmlFor="content-no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-white">Besoin de photos professionnelles ?</Label>
          <RadioGroup
            value={callNotes.needs_professional_photos === undefined ? "" : callNotes.needs_professional_photos ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ needs_professional_photos: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="photos-yes" />
              <Label htmlFor="photos-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="photos-no" />
              <Label htmlFor="photos-no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-white">Site multilingue ?</Label>
          <RadioGroup
            value={callNotes.needs_multilingual === undefined ? "" : callNotes.needs_multilingual ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ needs_multilingual: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="multilingual-yes" />
              <Label htmlFor="multilingual-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="multilingual-no" />
              <Label htmlFor="multilingual-no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        {callNotes.needs_multilingual && (
          <div className="space-y-2">
            <Label htmlFor="multilingual_languages" className="text-white">Quelles langues ?</Label>
            <Input
              id="multilingual_languages"
              value={callNotes.multilingual_languages || ""}
              onChange={(e) => updateCallNotes({ multilingual_languages: e.target.value })}
              placeholder="Français, Anglais, Espagnol..."
              className="bg-slate-800 border-blue-500/30 text-white"
            />
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-white">Le référencement (SEO) est-il important ?</Label>
          <RadioGroup
            value={callNotes.seo_important?.toString()}
            onValueChange={(value) => updateCallNotes({ seo_important: value === "true" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="seo_yes" />
              <Label htmlFor="seo_yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="seo_no" />
              <Label htmlFor="seo_no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        {callNotes.seo_important && (
          <div className="space-y-2">
            <Label htmlFor="seo_keywords" className="text-white">Mots-clés SEO principaux</Label>
            <Input
              id="seo_keywords"
              value={callNotes.seo_keywords || ""}
              onChange={(e) => updateCallNotes({ seo_keywords: e.target.value })}
              placeholder="Ex: plombier Paris, restaurant italien..."
              className="bg-slate-800 border-blue-500/30 text-white"
            />
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-white">Besoin d'outils d'analyse (Google Analytics) ?</Label>
          <RadioGroup
            value={callNotes.needs_analytics?.toString()}
            onValueChange={(value) => updateCallNotes({ needs_analytics: value === "true" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="analytics_yes" />
              <Label htmlFor="analytics_yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="analytics_no" />
              <Label htmlFor="analytics_no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-white">Intégration réseaux sociaux nécessaire ?</Label>
          <RadioGroup
            value={callNotes.needs_social_integration?.toString()}
            onValueChange={(value) => updateCallNotes({ needs_social_integration: value === "true" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="social_yes" />
              <Label htmlFor="social_yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="social_no" />
              <Label htmlFor="social_no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="who_updates_after" className="text-white">Qui fera les mises à jour du site après livraison ?</Label>
          <Input
            id="who_updates_after"
            value={callNotes.who_updates_after || ""}
            onChange={(e) => updateCallNotes({ who_updates_after: e.target.value })}
            placeholder="Ex: Nous-mêmes, vous en maintenance, webmaster interne..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default WebsiteTab;
