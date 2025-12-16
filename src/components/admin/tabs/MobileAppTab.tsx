import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import EnhanceableTextarea from "../EnhanceableTextarea";

interface CallNotes {
  target_platforms?: string;
  app_main_features?: string;
  needs_authentication?: boolean;
  needs_push_notifications?: boolean;
  needs_store_publication?: boolean;
  needs_offline_mode?: boolean;
  needs_geolocation?: boolean;
  needs_camera_access?: boolean;
  third_party_integrations?: string;
}

interface MobileAppTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

const MobileAppTab = ({ callNotes, updateCallNotes }: MobileAppTabProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-white">Plateformes cibles</Label>
          <RadioGroup
            value={callNotes.target_platforms || ""}
            onValueChange={(value) => updateCallNotes({ target_platforms: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ios" id="platform-ios" />
              <Label htmlFor="platform-ios" className="text-gray-200 font-normal cursor-pointer">iOS uniquement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="android" id="platform-android" />
              <Label htmlFor="platform-android" className="text-gray-200 font-normal cursor-pointer">Android uniquement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="platform-both" />
              <Label htmlFor="platform-both" className="text-gray-200 font-normal cursor-pointer">iOS et Android</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="app_main_features" className="text-white">Fonctionnalités principales</Label>
          <EnhanceableTextarea
            id="app_main_features"
            value={callNotes.app_main_features || ""}
            onChange={(value) => updateCallNotes({ app_main_features: value })}
            placeholder="Décrire les fonctionnalités principales de l'application..."
            rows={5}
            fieldContext="fonctionnalites_app"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-white">Fonctionnalités additionnelles</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_authentication"
                checked={callNotes.needs_authentication || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_authentication: checked as boolean })}
              />
              <Label htmlFor="needs_authentication" className="text-gray-200 font-normal cursor-pointer">
                Authentification utilisateur
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_push_notifications"
                checked={callNotes.needs_push_notifications || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_push_notifications: checked as boolean })}
              />
              <Label htmlFor="needs_push_notifications" className="text-gray-200 font-normal cursor-pointer">
                Notifications push
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_store_publication"
                checked={callNotes.needs_store_publication || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_store_publication: checked as boolean })}
              />
              <Label htmlFor="needs_store_publication" className="text-gray-200 font-normal cursor-pointer">
                Publication sur les stores (App Store / Google Play)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_offline_mode"
                checked={callNotes.needs_offline_mode || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_offline_mode: checked as boolean })}
              />
              <Label htmlFor="needs_offline_mode" className="text-gray-200 font-normal cursor-pointer">
                Mode hors ligne
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_geolocation"
                checked={callNotes.needs_geolocation || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_geolocation: checked as boolean })}
              />
              <Label htmlFor="needs_geolocation" className="text-gray-200 font-normal cursor-pointer">
                Géolocalisation
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needs_camera_access"
                checked={callNotes.needs_camera_access || false}
                onCheckedChange={(checked) => updateCallNotes({ needs_camera_access: checked as boolean })}
              />
              <Label htmlFor="needs_camera_access" className="text-gray-200 font-normal cursor-pointer">
                Accès caméra
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="third_party_integrations" className="text-white">Intégrations tierces nécessaires</Label>
          <Input
            id="third_party_integrations"
            value={callNotes.third_party_integrations || ""}
            onChange={(e) => updateCallNotes({ third_party_integrations: e.target.value })}
            placeholder="Ex: Google Maps, Facebook Login, Stripe..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAppTab;
