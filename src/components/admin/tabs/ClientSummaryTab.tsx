import { Mail, Phone, Calendar, Euro, Clock, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface ClientSummaryTabProps {
  quoteRequest: QuoteRequest;
}

const ClientSummaryTab = ({ quoteRequest }: ClientSummaryTabProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Informations Client</h3>
          <div className="space-y-2 text-gray-200">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>{quoteRequest.email}</span>
            </div>
            {quoteRequest.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>{quoteRequest.phone}</span>
              </div>
            )}
            {quoteRequest.business_type && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-400" />
                <span>{quoteRequest.business_type}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>Demande créée le {new Date(quoteRequest.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Services Demandés</h3>
          <div className="flex flex-wrap gap-2">
            {quoteRequest.services.map((service, idx) => (
              <Badge key={idx} className="bg-blue-500/20 text-blue-200 border-blue-400/50">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {quoteRequest.project_details && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Détails du Projet</h3>
            <p className="text-gray-200 bg-slate-800/50 p-4 rounded-lg border border-blue-500/20">
              {quoteRequest.project_details}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {quoteRequest.budget && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Euro className="h-5 w-5 text-green-400" />
                Budget
              </h3>
              <p className="text-gray-200">{quoteRequest.budget}</p>
            </div>
          )}

          {quoteRequest.timeline && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-400" />
                Délai Souhaité
              </h3>
              <p className="text-gray-200">{quoteRequest.timeline}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSummaryTab;